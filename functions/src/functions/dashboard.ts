import * as admin from "firebase-admin";
import * as v2 from "firebase-functions";
import { retrieveKundaliSummary, retrieveBirthDetails, getPanchangData } from "../lib/utils";

import { DashboardEntry, DashboardEntrySchema } from "../types";
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




export const dashboardOutlook = v2.pubsub
// @ts-ignore  
.schedule("every 15 minutes") // Reduced frequency to avoid unnecessary runs
.timeZone("UTC")
.onRun(async () => {
  const now = new Date();
  const nowISO = now.toISOString();

  // Query only users whose next update is due
  const usersSnapshot = await db
    .collection("users")
    .where("next_insight_update", "<=", nowISO) // Only get users who need updates
    .get();

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;

    try {
      const userData = userDoc.data();
      if (!userData.timezone) continue;

      const kundaliSummary = userData.kundali_summary ?? await retrieveKundaliSummary(db, userId);
      if (!kundaliSummary) continue;

      // Fetch or reuse Panchang data
      let dailyPanchangData = userData.daily_panchang;
      if (!dailyPanchangData || userData.panchang_date !== nowISO.split("T")[0]) {
        dailyPanchangData = await getPanchangData(db, userId);
        await db.collection("users").doc(userId).update({
          daily_panchang: dailyPanchangData,
          panchang_date: nowISO.split("T")[0],
        });
      }

      const dailyPanchangString = JSON.stringify(dailyPanchangData);

      // Generate astrology insights
      const astrologyInsights = await generateAstrologyInsights(kundaliSummary, dailyPanchangString);

      // Store insights in Firestore
      await db.collection("dashboard").doc(userId).collection(nowISO.split("T")[0]).doc("summary").set({
        ...astrologyInsights,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Schedule next update at 2 AM next day in user's timezone
      const nextUpdate = new Date(now);
      nextUpdate.setUTCHours(2, 0, 0, 0);
      const nextUpdateISO = new Date(nextUpdate.toLocaleString("en-US", { timeZone: userData.timezone })).toISOString();

      await db.collection("users").doc(userId).update({ next_insight_update: nextUpdateISO });

      console.log(`Dashboard updated for user ${userId}`);
    } catch (error) {
      console.error(`Failed to process user ${userId}:`, error);
    }
  }
});
