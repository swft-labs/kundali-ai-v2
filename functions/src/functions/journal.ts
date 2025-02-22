import * as admin from "firebase-admin";
import * as v2 from "firebase-functions";
import { OpenAI } from "openai";

const db = admin.firestore();
const openai = new OpenAI({ apiKey: "YOUR_OPENAI_API_KEY" });

export const updateMemories = v2.https.onRequest(async (request, response) => {
  const { userId, journalEntry } = request.body;
  if (!userId || !journalEntry) {
    response.status(400).send({ error: "User ID and journalEntry are required" });
    return;
  }

  const openaiResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: "Extract key events." }, { role: "user", content: journalEntry }],
  });

  const messageContent = openaiResponse.choices[0].message.content;
  if (messageContent === null) {
    response.status(500).json({ error: "Failed to extract memories" });
    return;
  }

  const memoriesData = JSON.parse(messageContent);
  await db.collection("journal_memories").doc(userId).set({ memories: memoriesData.memories }, { merge: true });

  response.status(200).json({ message: "Memories updated successfully" });
});
