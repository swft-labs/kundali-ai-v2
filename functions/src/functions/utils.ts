import * as admin from "firebase-admin";
import moment from "moment-timezone";
import { User } from "../../types";
import axios from "axios";

export async function retrieveUserData(db: admin.firestore.Firestore, uid: string) {
	const userDoc = await db
		.collection("users")
		.doc(uid as string)
		.get();

	if (!userDoc.exists) {
		return false;
	}
	return userDoc.data() as User;
}


export async function retrieveKundaliSummary(db: admin.firestore.Firestore, uid: string) {
	const kundaliDoc = await db
		.collection("kundali")
		.doc(uid)
		.get();

	if (!kundaliDoc.exists) {
		return null;
	}

	const kundaliData = kundaliDoc.data();
	return kundaliData?.static?.kundali_summary || null;
}


export async function retrieveBirthDetails(db: admin.firestore.Firestore, uid: string) {
	try {
		const kundaliDoc = await db.collection("kundali").doc(uid).get();
		if (!kundaliDoc.exists) {
			throw new Error(`No kundali found for user: ${uid}`);
		}

		const birthDetails = kundaliDoc.data()?.birth_details;
		if (!birthDetails) {
			throw new Error(`Missing birth details for user: ${uid}`);
		}

		// Return formatted birth details with correct property names
		return {
			date: birthDetails.date,
			month: birthDetails.month,
			year: birthDetails.year,
			hour: birthDetails.hour,
			minute: birthDetails.minute,
			latitude: birthDetails.latitude,
			longitude: birthDetails.longitude,
			place_of_birth: birthDetails.place_of_birth,
			timezone: birthDetails.timezone,
		};
	} catch (error) {
		console.error("Error retrieving birth details:", error);
		throw error;
	}
}



export async function callAstrologyAPI(db: admin.firestore.Firestore, uid: string, endpoint: string): Promise<any> {
	try {
		// Retrieve birth details inside this function
		const requestData = await retrieveBirthDetails(db, uid);

		// Make the API request
		const response = await axios.post(`${process.env.ASTROLOGY_API_BASE_URL}/${endpoint}`, requestData, {
			headers: {
				"Authorization": `Basic ${Buffer.from(`${process.env.ASTROLOGY_API_USER_ID}:${process.env.ASTROLOGY_API_KEY}`).toString("base64")}`,
				"Content-Type": "application/json",
			},
		});

		return response.data;
	} catch (error) {
		console.error(`Error calling ${endpoint} API:`, error);
		throw error;
	}
}



function filterPanchangData(response: any): any {
  return {
    day: response.day,
    tithi: response.tithi?.details
      ? {
          name: response.tithi.details.tithi_name,
          summary: response.tithi.details.summary,
          deity: response.tithi.details.deity,
        }
      : null,
    nakshatra: response.nakshatra?.details
      ? {
          name: response.nakshatra.details.nak_name,
          summary: response.nakshatra.details.summary,
          ruler: response.nakshatra.details.ruler,
        }
      : null,
    yog: response.yog?.details
      ? {
          name: response.yog.details.yog_name,
          special: response.yog.details.special,
        }
      : null,
    karan: response.karan?.details
      ? {
          name: response.karan.details.karan_name,
          special: response.karan.details.special,
        }
      : null,
    muhurta: {
      abhijit: response.abhijit_muhurta
        ? { start: response.abhijit_muhurta.start, end: response.abhijit_muhurta.end }
        : null,
      rahukaal: response.rahukaal
        ? { start: response.rahukaal.start, end: response.rahukaal.end }
        : null,
      guliKaal: response.guliKaal
        ? { start: response.guliKaal.start, end: response.guliKaal.end }
        : null,
      yamghant_kaal: response.yamghant_kaal
        ? { start: response.yamghant_kaal.start, end: response.yamghant_kaal.end }
        : null,
    },
  };
}


export async function getPanchangData(db: admin.firestore.Firestore, uid: string): Promise<any> {
  try {
    // Retrieve user's birth details (for date, location, and timezone)
    const birthDetails = await retrieveBirthDetails(db, uid);

    // Get current time in user's timezone
    const now = moment().tz(birthDetails.timezone);

    // Construct request data using birth date but current hour and minute
    const requestData = {
      day: birthDetails.date,  
      month: birthDetails.month, 
      year: birthDetails.year,   
      hour: now.hour(),          // Current hour in user's timezone
      min: now.minute(),         // Current minute in user's timezone
      lat: birthDetails.latitude,
      lon: birthDetails.longitude,
      tzone: birthDetails.timezone,
    };

    // Make the API request to the specified Panchang endpoint
    const response = await axios.post(`${process.env.ASTROLOGY_API_BASE_URL}/advanced_panchang`, requestData, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.ASTROLOGY_API_USER_ID}:${process.env.ASTROLOGY_API_KEY}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
    });

    // Filter the API response to keep only essential data
    return filterPanchangData(response.data);
  } catch (error) {
    console.error(`Error fetching Panchang data from advanced_panchang:`, error);
    throw error;
  }
}


export async function retrieveSocialProfile(db: admin.firestore.Firestore, uid: string) {
	// TODO - dk if we need this yet
}
