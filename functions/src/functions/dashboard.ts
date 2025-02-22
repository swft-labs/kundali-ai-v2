import * as admin from "firebase-admin";
import * as v2 from "firebase-functions";
import { retrieveKundaliSummary, retrieveBirthDetails, getPanchangData } from "./utils";

import { DashboardEntry, DashboardEntrySchema } from "../../types";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: "YOUR_OPENAI_API_KEY",
});

const db = admin.firestore();


export async function generateAstrologyInsights(kundaliSummary: string, dailyPanchang: string): Promise<DashboardEntry> {
  const systemMessage = `
    You are an expert Vedic astrologer with deep knowledge of Kundali interpretation and Panchang analysis. 
    Your task is to generate highly personalized daily astrology insights based on the user's Kundali summary and the daily Panchang.

    Follow these structured guidelines:
    
    - daily_quote: Provide an insightful Vedic wisdom quote, mantra, or motivational message tailored to the planetary influences of the day.
    
    - dos: List 3-5 positive actions or rituals the user should follow based on the planetary positions, Nakshatra, and Tithi.
    
    - donts: List 3-5 things the user should avoid today, considering any planetary conflicts, Rahu-Kaal, or Doshas.
    
    - suggestions: Provide practical guidance on lifestyle, career, health, or relationships influenced by their Kundali and today’s planetary alignments.
    
    - daily_horoscope_transition: Write a short but impactful summary of the user's daily horoscope, indicating any important planetary transits affecting them today.
    
    - mood_of_the_day: Predict the dominant emotional theme of the day (e.g., "Energetic & Productive," "Reflective & Emotional," "Challenging but Rewarding").
    
    - auspicious_time: Identify the most favorable time window today for important activities based on the Abhijit Muhurta and Panchang elements.

    Important: 
    - Always reference the user's Kundali for personal influences.
    - Align suggestions with today’s planetary influences and Panchang.
    - Use concise, high-impact wording to make the insights engaging.

    Your output must strictly follow this structure:
    ${DashboardEntrySchema.toString()}
  `;

  const userMessage = `Kundali summary: ${JSON.stringify(kundaliSummary)}
  Panchang data: ${JSON.stringify(dailyPanchang)}`;

  const response = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
    response_format: zodResponseFormat(DashboardEntrySchema, "dashboardEntry"),
  });

  return response.choices[0].message.parsed as DashboardEntry;
}



function isUserTime2AM(userTimezone: string): boolean {
  try {
    const nowUtc = new Date();
    const userLocalTime = new Date(nowUtc.toLocaleString("en-US", { timeZone: userTimezone }));
    return userLocalTime.getHours() === 2; // Run if local time is 2 AM
  } catch (error) {
    console.error(`Invalid timezone for user: ${userTimezone}`, error);
    return false;
  }
}


export const dashboardOutlook = v2.pubsub
  .schedule("every hour") // Runs every hour to check for users in 2 AM local time
  .timeZone("UTC")
  .onRun(async () => {
    const usersSnapshot = await db.collection("users").get();
    const date = new Date().toISOString().split("T")[0];

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;

      try {
        const birthDetails = await retrieveBirthDetails(db, userId);
        if (!birthDetails || !birthDetails.timezone) continue;

        if (!isUserTime2AM(birthDetails.timezone)) continue;

        const kundaliSummary = await retrieveKundaliSummary(db, userId);
        if (!kundaliSummary) continue;

        // Fetch Panchang data
        const dailyPanchangData = await getPanchangData(db, userId);

        // Convert Panchang object to a string for AI processing
        const dailyPanchangString = JSON.stringify(dailyPanchangData);

        // Generate astrology insights
        const astrologyInsights = await generateAstrologyInsights(kundaliSummary, dailyPanchangString);

        // Store insights in Firestore
        await db.collection("dashboard").doc(userId).collection(date).doc("summary").set({
          ...astrologyInsights,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Dashboard updated for user ${userId} at 2 AM local time`);
      } catch (error) {
        console.error(`Failed to process user ${userId}:`, error);
      }
    }
  });
