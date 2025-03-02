import { useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

const options = [
  { emoji: "🎱", label: "Ask me anything" },
  { emoji: "🌞", label: "Daily Reading" },
  { emoji: "🌹", label: "Match Compatibility" },
  { emoji: "💼", label: "Career and Business" },
  { emoji: "🫀", label: "Health Outlook" },
  { emoji: "🧘", label: "Spritual Wellness" },
];

export default function ChatHome() {
  const router = useRouter();

  const handleOptionPress = (label: string) => {
    router.push({
      pathname: "/chat",
      params: { topic: label },
    });
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="mb-20 text-center text-2xl font-bold">
        🌙 Kundali AI
      </Text>
      {options.map((item, index) => (
        <Pressable
          key={index}
          onPress={() => handleOptionPress(item.label)}
          className="mb-3 w-80 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 dark:bg-black"
        >
          <View className="flex-1">
            <Text className="text-lg font-semibold">
              {item.emoji} {item.label}
            </Text>
          </View>
          <View>
            <ArrowRight size={18} color="#888" />
          </View>
        </Pressable>
      ))}
    </View>
  );
}
