import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { ArrowRight } from "lucide-react-native";

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
      params: { topic: label }
    });
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold text-center mb-20">
        🌙 Kundali AI
      </Text>
      {options.map((item, index) => (
        <Pressable
          key={index}
          onPress={() => handleOptionPress(item.label)}
          className="flex-row items-center justify-between bg-[#1E1E1E] p-4 rounded-2xl mb-3 border border-[#333] w-80"
        >
          <View className="flex-1">
            <Text className="text-white text-lg">
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
