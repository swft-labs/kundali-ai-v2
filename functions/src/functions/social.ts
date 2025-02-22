import * as admin from "firebase-admin";
import * as v2 from "firebase-functions";
import { callAstrologyAPI } from "../lib/utils";
import { SocialProfile, Compatibility } from "../../types";

const db = admin.firestore();

async function calculateCompatibility(userId: string, profileId: string) {
  try {
    // Call the astrology API to get compatibility details
    const matchResponse = await callAstrologyAPI(db, userId, "match_making_report");

    if (!matchResponse) {
      console.error(`No match response for userId: ${userId} and profileId: ${profileId}`);
      return;
    }

    // Construct the Compatibility object
    const compatibilityData: Compatibility = {
      received_points: matchResponse?.ashtakoota?.received_points || 0,
      manglik: {
        status: matchResponse?.manglik?.status || false,
        male_percentage: matchResponse?.manglik?.male_percentage || 0,
        female_percentage: matchResponse?.manglik?.female_percentage || 0,
      },
      rajju_dosha: {
        status: matchResponse?.rajju_dosha?.status || false,
      },
      vedha_dosha: {
        status: matchResponse?.vedha_dosha?.status || false,
      },
      match_report: matchResponse?.conclusion?.match_report || "No match report available.",
    };

    // Construct the SocialProfile object
    const profileData: SocialProfile = {
      profileId,
      name: "", // Assuming name is fetched elsewhere or needs to be updated later
      kundali_ref: `/kundali/${profileId}`,
      compatibility: compatibilityData, // Attach compatibility data
    };

    // Store data in Firestore
    const profileRef = db
      .collection("social_profiles")
      .doc(userId)
      .collection("profiles")
      .doc(profileId);

    await profileRef.set(profileData);

    console.log(`Compatibility data stored for ${userId} and ${profileId}`);
  } catch (error) {
    console.error("Error calculating compatibility:", error);
  }
}

export const addSocialProfile = v2.https.onRequest(async (request, response) => {
  try {
    const { userId, profileId } = request.body;
    
    if (!userId || !profileId) {
      response.status(400).json({ error: "Missing userId or profileId" });
      return;
    }

    await calculateCompatibility(userId, profileId);

    response.status(202).json({ message: "Compatibility check started" });
  } catch (error) {
    console.error("Error adding social profile:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});
