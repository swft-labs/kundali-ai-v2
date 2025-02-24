import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.LOCAL_API_URL || process.env.PRODUCTION_API_URL;

export async function fetchApi(
  endpoint: string,
  options: { token: string; chatId?: string },
) {
  const token = await AsyncStorage.getItem("session");

  const response = await fetch(
    `${API_BASE_URL}/api/${endpoint}`,
    {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(options.chatId && {
        body: JSON.stringify({ chatId: options.chatId }),
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getChatsByUserId({ token }: { token: string }) {
  try {
    console.log("getChatsByUserId called");
    const response = await fetchApi("history", {
      token,
    });
    console.log("getChatsByUserId response", response);
    return response;
  } catch (error) {
    console.error("Error fetching chats.", error);
    throw new Error("Failed to fetch chats");
  }
}

export async function getChatById({
  chatId,
  token,
}: {
  chatId: string;
  token: string;
}) {
  try {
    const response = await fetchApi("/api/chat", { chatId, token });
    return response;
  } catch (error) {
    console.error("Error fetching chat.", error);
    throw new Error("Failed to fetch chat");
  }
}
