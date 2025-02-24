// import * as admin from "firebase-admin";
import * as v2 from "firebase-functions";
import { v4 as uuidv4 } from 'uuid';

// const db = admin.firestore();

import { convertToCoreMessages, streamText } from 'ai';
import { models, customModel } from "../lib/models";


export const getChatResponse = v2.https.onRequest(async (request, response) => {
  response.setHeader("Content-Type", "application/json");

  try {
    console.log(">> Request received");

    // Extract messages and modelId from the request body
    const { messages, modelId = 'gpt-4' } = request.body;
    console.log(">> Messages:", messages);

    // Select the requested model or default to the first available model
    const model = models.find((m) => m.id === modelId) || models[0];

    // Convert messages into the format required for processing
    const coreMessages = convertToCoreMessages(messages);

    // Generate a unique user message ID
    const userMessageId = generateUUID();

    // Send an initial response containing the user message ID
    response.write(JSON.stringify({
      type: 'user-message-id',
      content: userMessageId, 
    }) + "\n");


    const systemPrompt = 'You are a helpful assistant.';


    // Stream AI response
    const result = streamText({
      model: customModel(model.apiIdentifier),
      system: systemPrompt,
      messages: coreMessages,
      maxSteps: 5,
    });

    // Simulate a data stream object for handling streaming responses
    const dataStream = {
      writeData: (data: any) => {
        response.write(JSON.stringify(data) + "\n");
      },
    };

    // Merge AI response into the data stream
    // @ts-ignore
    await result.mergeIntoDataStream(dataStream);

    // End the response once all data has been streamed
    response.end();
  } catch (error) {
    console.error("API Error:", error);
    response.status(500).json({ error: "Failed to generate response" });
  }
});

function generateUUID() {
  return uuidv4();
}

