import { Stack } from "expo-router";

export default function ChatLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // Show navbar for Chat Home
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          headerShown: false, // Show navbar for Chat Home
        }}
      />
    </Stack>
  );
}
