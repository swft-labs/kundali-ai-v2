import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { callAstrologyAPI, retrieveBirthDetails } from "../lib/utils";
import { BirthDetails, Kundali, KundaliSchema } from "../../types";
import * as admin from "firebase-admin";
import * as v2 from "firebase-functions";

const db = admin.firestore();

const openai = new OpenAI({
  apiKey: "YOUR_OPENAI_API_KEY",
});



async function generateKundaliChart(userId: string): Promise<{ north_chart_svg: string; south_chart_svg: string }> {
  try {
    // Fetch Kundali chart SVG from astrology API
    const chartResponse = await callAstrologyAPI(db, userId, "horo_chart_image");

    if (!chartResponse?.svg) {
      throw new Error("Failed to generate Kundali chart SVG.");
    }

    const kundaliSVG = chartResponse.svg; // Extract the raw SVG string

    return {
      north_chart_svg: kundaliSVG, // Use the same SVG for both for now
      south_chart_svg: kundaliSVG,
    };
  } catch (error) {
    console.error("Error generating Kundali chart:", error);
    return {
      north_chart_svg: "",
      south_chart_svg: "",
    };
  }
}



async function generateLifeDetails(kundaliSummary: string): Promise<Kundali["life_details"]> {
  try {
    const systemMessage = `
      You are an expert Vedic astrologer. Your task is to generate a detailed analysis of the user's personality, relationships, career, and health based on their Kundali summary.
      ${KundaliSchema.shape.life_details.toString()}
    `;

    const userMessage = `Kundali summary: ${JSON.stringify(kundaliSummary)}`;

    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      response_format: zodResponseFormat(KundaliSchema.shape.life_details, "lifeDetails"),
    });

    return response.choices[0].message.parsed as Kundali["life_details"];
  } catch (error) {
    console.error("Error generating life details:", error);
    return KundaliSchema.shape.life_details.parse({
      personality: "AI-generated insights not available.",
      relationships: "AI-generated insights not available.",
      career_and_money: "AI-generated insights not available.",
      health: "AI-generated insights not available.",
    });
  }
}

async function generateKundaliSummary(userId: string) {
  try {
    // Retrieve birth details
    const birthDetails: BirthDetails = await retrieveBirthDetails(db, userId);

    // Call astrology API for Kundali summary
    const kundaliSummaryResponse = await callAstrologyAPI(db, userId, "vedic_horoscope");

    // Generate Kundali chart SVGs
    const kundaliChart = await generateKundaliChart(userId);


    // Extract relevant details
    const astroDetails = kundaliSummaryResponse?.astro_details;
    const planets = kundaliSummaryResponse?.planets_position;
    const dasha = kundaliSummaryResponse?.current_vimshottari_dasha;
    const manglikDosha = kundaliSummaryResponse?.manglik_dosha;

    // Format Kundali Summary
    const kundaliSummary = `
    ### 🌟 Basic Birth Details
    - **Full Name**: [Enter Name]
    - **Date of Birth**: ${birthDetails.year}-${birthDetails.month}-${birthDetails.date}
    - **Time of Birth**: ${birthDetails.hour}:${birthDetails.minute}
    - **Place of Birth**: ${birthDetails.place_of_birth}
    - **Timezone**: ${birthDetails.timezone}
    - **Chart Type**: [North Indian / South Indian]

    ---

    ## 🌙 Lagna Chart (Core Chart Elements)
    - **Lagna (Ascendant Sign)**: ${astroDetails?.ascendant || "N/A"}
    - **Rashi (Moon Sign)**: ${astroDetails?.moon_sign || "N/A"}
    - **Nakshatra (Lunar Mansion)**: ${astroDetails?.naksahtra || "N/A"}

    ---

    ## 🪐 Planetary Positions (Graha Sthiti)
    | Planet  | Zodiac Sign | House Number | Status (Exalted, Debilitated, Retrograde) |
    |---------|------------|--------------|-------------------------------------------|
    ${planets
      .map(
        (planet: any) =>
          `| ${planet.name} | ${planet.sign} | ${planet.house} | ${
            planet.is_retro === "true" ? "Retrograde" : planet.planet_awastha
          } |`
      )
      .join("\n")}

    ---

    ## ⏳ Vimshottari Dasha (Planetary Periods)
    - **Current Mahadasha (Major Period)**: ${dasha?.major?.dasha_period[0]?.planet || "N/A"}
      - **Start Date**: ${dasha?.major?.dasha_period[0]?.start || "N/A"}
      - **End Date**: ${dasha?.major?.dasha_period[0]?.end || "N/A"}
    - **Current Antardasha (Sub-Period)**: ${dasha?.minor?.dasha_period[0]?.planet || "N/A"}
      - **Start Date**: ${dasha?.minor?.dasha_period[0]?.start || "N/A"}
      - **End Date**: ${dasha?.minor?.dasha_period[0]?.end || "N/A"}

    ---

    ## 🔮 Yogas & Doshas (Special Combinations)
    ### ✅ **Raj Yogas (Success-related Combinations)**
    - [Enter Yogas]

    ### ⚠️ **Doshas (Challenges & Obstacles)**
    - **Manglik Dosha**: ${manglikDosha?.from_ascendant?.is_manglik ? "Present" : "Not Present"}
    - **Kaal Sarp Dosha**: [Data Not Available]
    `;

    // Generate Life Details using OpenAI API
    const lifeDetails = await generateLifeDetails(kundaliSummary);

    // Construct Kundali Data
    const kundaliData = {
      birth_details: birthDetails,
      kundali_summary: kundaliSummary,
      life_details: lifeDetails,
      kundali_chart: kundaliChart,
    };

    // Store in Firestore
    await db.collection("kundali").doc(userId).set(kundaliData);
    console.log(`Kundali stored for user ${userId}`);
  } catch (error) {
    console.error("Error generating Kundali:", error);
    throw new Error("Failed to generate Kundali.");
  }
}

export const generateKundali = v2.https.onRequest(async (request, response) => {
  try {
    const { userId } = request.body;

    if (!userId) {
      response.status(400).json({ error: "Missing userId" });
      return;
    }

    await generateKundaliSummary(userId);

    response.status(200).json({ message: `Kundali generated for user ${userId}` });
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(500).json({ error: "Internal server error", details: error.message });
    } else {
      response.status(500).json({ error: "Internal server error", details: "An unknown error occurred." });
    }
  }
});
