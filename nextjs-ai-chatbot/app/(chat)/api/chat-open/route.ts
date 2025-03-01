import {
	type Message,
	convertToCoreMessages,
	createDataStreamResponse,
	streamText,
} from 'ai';
import { customModel } from '@/lib/ai';
import { models } from '@/lib/ai/models';
import { systemPrompt } from '@/lib/ai/prompts';
import { generateUUID } from '@/lib/utils';

// Function to get topic-specific system prompts
const getTopicSystemPrompt = (topic?: string): string => {
	if (!topic) {
		return systemPrompt; // Use the default system prompt if no topic is provided
	}
	
	switch (topic) {
		case "Ask me anything":
			return "You are Kundali AI, a Vedic astrology expert. Answer any questions about astrology, spirituality, or life guidance with wisdom and clarity. Provide thoughtful insights while acknowledging the limitations of astrological predictions.";
		
		case "Daily Reading":
			return "You are Kundali AI, specializing in daily astrological readings. Analyze planetary positions and their potential influences on daily life. Ask for birth details if not provided. Explain how current transits might affect the querent based on their birth chart.";
		
		case "Match Compatibility":
			return "You are Kundali AI, an expert in astrological compatibility analysis. Assess relationship compatibility using Vedic astrology principles like Guna Milan (Ashtakoot). Analyze how planetary positions in two birth charts interact and what that means for relationships. Ask for birth details of both individuals if not provided.";
		
		case "Career and Business":
			return "You are Kundali AI, specializing in career and business astrology. Analyze planetary influences on professional life, favorable periods for career moves, and potential business opportunities. Provide insights on strengths, challenges, and timing for business decisions based on astrological principles.";
		
		case "Health Outlook":
			return "You are Kundali AI, focusing on health astrology. Provide astrological perspectives on health and wellness based on birth charts. Identify potential strengths and sensitivities indicated by planetary positions. Always include a disclaimer that your insights are not medical advice and recommend consulting healthcare professionals for medical concerns.";
		
		case "Spritual Wellness":
			return "You are Kundali AI, a guide for spiritual development through Vedic astrology. Suggest spiritual practices, meditation techniques, and paths that align with the querent's astrological profile. Provide insights on karmic patterns, spiritual strengths, and areas for growth based on birth chart analysis.";
		
		default:
			return systemPrompt; // Use the default system prompt for unrecognized topics
	}
};

export async function POST(request: Request) {
	try {
		console.log(">> Request received");
		const { messages, modelId = 'gpt-4o-mini', topic } = await request.json();
		console.log(">> Messages:", messages);
		console.log(">> Topic:", topic);

		const model = models.find((m) => m.id === modelId) || models[0];
		const coreMessages = convertToCoreMessages(messages);
		const userMessageId = generateUUID();
		
		// Get the appropriate system prompt based on the topic
		const topicPrompt = getTopicSystemPrompt(topic);

		return createDataStreamResponse({
			execute: (dataStream) => {
				dataStream.writeData({
					type: 'user-message-id',
					content: userMessageId,
				});

				const result = streamText({
					model: customModel(model.apiIdentifier),
					system: topicPrompt, // Use the topic-specific prompt
					messages: coreMessages,
					maxSteps: 5,
				});

				result.mergeIntoDataStream(dataStream);
			},
		});

	} catch (error) {
		console.error("API Error:", error);
		return new Response(
			JSON.stringify({ error: "Failed to generate response" }),
			{ 
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				}
			}
		);
	}
}

export async function GET() {
	return new Response('Ready', { status: 200 });
}
