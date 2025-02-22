import * as admin from "firebase-admin";
import * as v2 from "firebase-functions";
import { OpenAI } from "openai";
import { pipeDataStreamToResponse, streamText } from "ai";
import { retrieveUserData, retrieveKundaliSummary } from "./utils";

const db = admin.firestore();
const openai = new OpenAI({ apiKey: "YOUR_OPENAI_API_KEY" });

export const getChatResponse = v2.https.onRequest(async (request, response) => {
  try {
    const { userId, userMessage } = request.body;
    if (!userId || !userMessage) {
      response.status(400).send({ error: "User ID and message are required" });
      return;
    }

    // Fetch user data
    const userData = await retrieveUserData(db, userId);
    if (!userData) {
      response.status(404).send({ error: "User not found" });
      return;
    }

    // Fetch Kundali summary
    const kundaliSummary = await retrieveKundaliSummary(db, userId) || "No Kundali data available.";

    // Fetch long-term journal memories
    const memoriesDoc = await db.collection("journal_memories").doc(userId).get();
    const longTermMemories = memoriesDoc.exists ? memoriesDoc.data()?.memories : {};

    // Fetch last 5 chat messages for context
    const chatMessagesSnapshot = await db
      .collection("chats")
      .doc(userId)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();

    const chatHistory = chatMessagesSnapshot.docs.reverse().map(doc => ({
      role: doc.data().sender === "user" ? "user" : "assistant",
      content: doc.data().text,
    }));

    // Construct system prompt
    const systemPrompt = `
      You are an AI expert in Vedic astrology, Kundali insights, and personalized life guidance.
      Use the following information to provide insightful and spiritually wise responses:
      
      - Kundali Summary: ${kundaliSummary}
      - Long-Term Memories: ${JSON.stringify(longTermMemories)}
      - User's Past Conversations: Integrated for continuity.
      
      Keep responses personalized, spiritual, and helpful.
    `;

    pipeDataStreamToResponse(response, {
      execute: async (dataStreamWriter) => {
        dataStreamWriter.writeData("Initializing response...");

        const result = streamText({
          model: openai("gpt-4o-mini"),
          maxTokens: 1024,
          system: systemPrompt,
          messages: [
            { role: "system", content: systemPrompt },
            ...chatHistory.map(message => ({ role: message.role as "system" | "user" | "assistant" | "data", content: message.content })),
            { role: "user", content: userMessage },
          ],
        });

        result.mergeIntoDataStream(dataStreamWriter);
      },
      onError: (error) => {
        return error instanceof Error ? error.message : String(error);
      },
    });

  } catch (error) {
    response.status(500).send({ error: "Internal server error" });
  }
});
