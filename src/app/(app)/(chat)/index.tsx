import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { ArrowRight } from "lucide-react-native";

const options = [
  { emoji: "🎱", label: "Ask me anything" },
  { emoji: "🌞", label: "Daily Reading" },
  { emoji: "🌹", label: "Match Compatibility" },
  { emoji: "💼", label: "Career and Business" },
  { emoji: "❤️", label: "Health Outlook" },
];

export default function ChatHome() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold text-center mb-20">
        🌙 Kundali AI
      </Text>
      {options.map((item, index) => (
        <Pressable
          key={index}
          onPress={() => router.push("/chat")}
          className="flex-row items-center justify-between bg-[#1E1E1E] p-4 rounded-2xl mb-3 border border-[#333]"
        >
          <Text className="text-white text-lg">
            {item.emoji} {item.label}
          </Text>
          <View className="ml-4">
            <ArrowRight size={18} color="#888" />
          </View>
        </Pressable>
      ))}
    </View>
  );
}
