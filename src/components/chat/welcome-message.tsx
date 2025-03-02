import { Text } from "@/components/ui/text";
import { View } from "react-native";

type WelcomeMessageProps = {
  topic?: string;
};

// Map of topics to their emojis from index.tsx
const topicEmojis: Record<string, string> = {
  "Ask me anything": "🎱",
  "Daily Reading": "🌞",
  "Match Compatibility": "🌹",
  "Career and Business": "💼",
  "Health Outlook": "🫀",
  "Spritual Wellness": "🧘",
};

export const WelcomeMessage = ({ topic }: WelcomeMessageProps) => {
  // Get the emoji for the current topic, or default to moon emoji
  const topicEmoji = topic ? topicEmojis[topic] || "🌙" : "🌙";
  const topicTitle = topic || "Kundali AI";

  // Default welcome content
  let welcomeContent = (
    <View className="space-y-4">
      <Text className="text-center leading-7">
        Welcome to Kundali AI! Your astrological insights are ready. Let’s dive
        into your cosmic blueprint and uncover what the universe has in store
        for you. What would you like to explore today?
      </Text>
    </View>
  );

  // Topic-specific welcome messages
  if (topic) {
    switch (topic) {
      case "Ask me anything":
        welcomeContent = (
          <View className="space-y-4">
            <Text className="text-center leading-7">
              The stars are aligned, and I have the answers you seek. Whether
              it's love, career, or personal growth—ask away. Let's decode your
              destiny. ✨
            </Text>
          </View>
        );
        break;
      case "Daily Reading":
        welcomeContent = (
          <View className="space-y-4">
            <Text className="text-center leading-7">
              Your daily astrological insights are here. The planetary movements
              shape your energy—here’s how today unfolds for you. Let’s align
              your actions with the cosmos. 🌞
            </Text>
          </View>
        );
        break;
      case "Match Compatibility":
        welcomeContent = (
          <View className="space-y-4">
            <Text className="text-center leading-7">
              Wondering if you and someone special are truly aligned? I’ve
              analyzed your cosmic compatibility—here’s what the stars reveal
              about your connection. 💕
            </Text>
          </View>
        );
        break;
      case "Career and Business":
        welcomeContent = (
          <View className="space-y-4">
            <Text className="text-center leading-7">
              Success isn’t just about effort—it’s about timing. The planetary
              transits reveal when to make bold moves, seize opportunities, and
              elevate your career. Let’s chart your path to prosperity. 📈
            </Text>
          </View>
        );
        break;
      case "Health Outlook":
        welcomeContent = (
          <View className="space-y-4">
            <Text className="text-center leading-7">
              Your physical and emotional well-being are influenced by planetary
              energy. Here’s what your birth chart says about your health cycles
              and vitality. Let’s align your habits with the universe for a
              healthier you. ❤️‍🩹
            </Text>
          </View>
        );
        break;
      case "Spritual Wellness":
        welcomeContent = (
          <View className="space-y-4">
            <Text className="text-center leading-7">
              Your spiritual evolution is written in the stars. Whether you seek
              inner peace, guidance, or a deeper connection with the cosmos,
              here’s how your Kundali can illuminate your path. ✨
            </Text>
          </View>
        );
        break;
    }
  }

  return (
    <View className="max-w-xl rounded-xl p-6">
      <View className="mb-8 h-[50] flex-row items-center justify-center gap-2 space-x-4">
        <Text className="text-3xl">{topicEmoji}</Text>
        <Text className="text-xl font-bold">{topicTitle}</Text>
      </View>

      {welcomeContent}
    </View>
  );
};
