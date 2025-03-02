import { useDashboardStore } from "@/store/dashboardStore";

const GET_CHAT_RESPONSE_URL = process.env.EXPO_PUBLIC_GET_CHAT_RESPONSE_URL;
const UPDATE_MEMORIES_URL = process.env.EXPO_PUBLIC_UPDATE_MEMORIES_URL;
const GENERATE_KUNDALI_URL = process.env.EXPO_PUBLIC_GENERATE_KUNDALI_URL;
const ADD_SOCIAL_PROFILE_URL = process.env.EXPO_PUBLIC_ADD_SOCIAL_PROFILE_URL;
const DASHBOARD_UPDATE_URL = process.env.EXPO_PUBLIC_UPDATE_DASHBOARD_URL;

// Helper function to get auth token and user ID with dummy data
async function getAuthDetails() {
  const token = "1234567890";
  const userId = "1234567890";
  return { token, userId };
}

// Specific function calls
export async function getChatsByUserId() {
  try {
    const { token, userId } = await getAuthDetails();
    console.log("getChatsByUserId called");

    const response = await fetch(GET_CHAT_RESPONSE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Function error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("getChatsByUserId response", data);
    return data;
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw new Error("Failed to fetch chats");
  }
}

export async function getChatById({ chatId }: { chatId: string }) {
  try {
    const { token, userId } = await getAuthDetails();

    const response = await fetch(GET_CHAT_RESPONSE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, chatId }),
    });

    if (!response.ok) {
      throw new Error(`Function error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching chat:", error);
    throw new Error("Failed to fetch chat");
  }
}

export async function updateMemories(journalEntry: string) {
  try {
    const { token, userId } = await getAuthDetails();

    const response = await fetch(UPDATE_MEMORIES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, journalEntry }),
    });

    if (!response.ok) {
      throw new Error(`Function error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error updating memories:", error);
    throw new Error("Failed to update memories");
  }
}

export async function generateKundali() {
  try {
    const { token, userId } = await getAuthDetails();

    const response = await fetch(GENERATE_KUNDALI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Function error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error generating kundali:", error);
    throw new Error("Failed to generate kundali");
  }
}

export async function addSocialProfile(profileId: string) {
  try {
    const { token, userId } = await getAuthDetails();

    const response = await fetch(ADD_SOCIAL_PROFILE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, profileId }),
    });

    if (!response.ok) {
      throw new Error(`Function error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error adding social profile:", error);
    throw new Error("Failed to add social profile");
  }
}

export async function getDashboardInsights() {
  try {
    const { token, userId } = await getAuthDetails();
    const { fetchDashboard } = useDashboardStore.getState();

    await fetchDashboard(userId);
  } catch (error) {
    console.error("Error fetching dashboard insights:", error);
    throw new Error("Failed to fetch dashboard insights");
  }
}
