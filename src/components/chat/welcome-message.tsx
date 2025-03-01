import { View, Pressable, Linking } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import { MessageCircle } from "@/lib/icons";

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
  "Spritual Wellness": "🧘"
};

export const WelcomeMessage = ({ topic }: WelcomeMessageProps) => {
  // Get the emoji for the current topic, or default to moon emoji
  const topicEmoji = topic ? topicEmojis[topic] || "🌙" : "🌙";
  const topicTitle = topic || "Kundali AI";

  // Default welcome content
  let welcomeContent = (
    <View className="space-y-4">
      <Text className="text-center leading-7">
        Welcome to Kundali AI! I'm here to provide insights based on Vedic astrology 
        and help guide you on your journey. How can I assist you today?
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
              I'm ready to answer any questions you have about astrology, spirituality, 
              or life guidance. What would you like to know?
            </Text>
          </View>
        );
        break;
      case "Daily Reading":
        welcomeContent = (
          <View className="space-y-4">
            <Text className="text-center leading-7">
              Let's explore your daily astrological reading. I can provide insights 
              about planetary positions and how they might influence your day.
            </Text>
            <Text className="text-center leading-7">
              To get started, I'll need to know your birth details (date, time, and place).
            </Text>
          </View>
        );
        break;
      case "Match Compatibility":
        welcomeContent = (
          <View className="space-y-4">
            <Text className="text-center leading-7">
              I can help analyze compatibility between you and another person based on 
              Vedic astrology principles.
            </Text>
            <Text className="text-center leading-7">
              To begin, please share birth details for both individuals.
            </Text>
          </View>
        );
        break;
      case "Career and Business":
        welcomeContent = (
          <View className="space-y-4">
            <Text className="text-center leading-7">
              Let's explore your career path and business prospects through the lens of 
              Vedic astrology.
            </Text>
            <Text className="text-center leading-7">
              I can provide insights about favorable periods for career moves, business 
              decisions, and potential opportunities.
            </Text>
          </View>
        );
        break;
      case "Health Outlook":
        welcomeContent = (
          <View className="space-y-4">
            <Text className="text-center leading-7">
              I can offer astrological perspectives on health and wellness based on your 
              birth chart.
            </Text>
            <Text className="text-center leading-7 italic">
              Note: These insights are not medical advice. Always consult healthcare 
              professionals for medical concerns.
            </Text>
          </View>
        );
        break;
      case "Spritual Wellness":
        welcomeContent = (
          <View className="space-y-4">
            <Text className="text-center leading-7">
              Let's explore your spiritual journey through Vedic astrological insights.
            </Text>
            <Text className="text-center leading-7">
              I can suggest practices, meditations, and spiritual paths that might 
              resonate with your astrological profile.
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
