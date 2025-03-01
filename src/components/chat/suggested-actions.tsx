import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { ScrollAdapt } from "@/components/chat/scroll-adapt";
import { useWindowDimensions } from "react-native";
import { useState, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useStore } from "@/lib/globalStore";
import { generateUUID } from "@/lib/utils";
import type { Message, CreateMessage } from "ai";

interface SuggestedActionsProps {
  hasInput?: boolean;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: { body?: object },
  ) => Promise<string | null | undefined>;
  topic?: string;
}

export function SuggestedActions({
  hasInput = false,
  append,
  topic,
}: SuggestedActionsProps) {
  const { selectedImageUris, setChatId } = useStore();
  const { width } = useWindowDimensions();
  const [cardWidth, setCardWidth] = useState(0);

  const opacity = useSharedValue(1);

  useEffect(() => {
    // Debug log
    console.log("SuggestedActions visibility:", {
      hasInput,
      selectedImageUris: selectedImageUris.length,
      shouldBeVisible: !(hasInput || selectedImageUris.length > 0)
    });
    
    opacity.value = withTiming(
      hasInput || selectedImageUris.length > 0 ? 0 : 1,
      {
        duration: 200,
      },
    );
  }, [hasInput, selectedImageUris]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handlePress = async (action: string) => {
    const newChatId = generateUUID();
    setChatId({ id: newChatId, from: "newChat" });

    // Send the initial message using append
    await append(
      {
        role: "user",
        content: action,
      },
      {
        body: { id: newChatId },
      },
    );
  };

  // Define topic-specific actions
  const getTopicActions = () => {
    if (topic) {
      switch (topic) {
        case "Ask me anything":
          return [
            {
              title: "Tell me about my future",
              label: "Get insights about potential future paths and opportunities",
              action: "Can you tell me about my potential future based on Vedic astrology?",
            },
            {
              title: "Explain Vedic astrology",
              label: "Learn about the principles and concepts of Vedic astrology",
              action: "Explain the basic principles of Vedic astrology to me.",
            },
            {
              title: "Planetary influences",
              label: "Understand how different planets affect your life",
              action: "How do different planets influence my life according to Vedic astrology?",
            },
          ];
        case "Daily Reading":
          return [
            {
              title: "Today's forecast",
              label: "Get a reading for today based on planetary positions",
              action: "What's my astrological forecast for today? I was born on [your birth date, time, place].",
            },
            {
              title: "Weekly outlook",
              label: "Get a broader view of the week ahead",
              action: "Can you provide a weekly astrological outlook? My birth details are [date, time, place].",
            },
            {
              title: "Planetary transits",
              label: "Learn about current planetary movements affecting you",
              action: "What important planetary transits should I be aware of this month? My birth details are [date, time, place].",
            },
          ];
        case "Match Compatibility":
          return [
            {
              title: "Relationship compatibility",
              label: "Check compatibility between two birth charts for a relationship",
              action: "Can you analyze the compatibility between these two birth charts? Person 1: [birth details], Person 2: [birth details]",
            },
            {
              title: "Business partnership",
              label: "Analyze compatibility for business relationships",
              action: "I'm considering a business partnership. Can you check our compatibility? My details: [birth info], Partner: [birth info]",
            },
            {
              title: "Friendship analysis",
              label: "Understand the dynamics of a friendship",
              action: "Can you analyze our friendship compatibility? My details: [birth info], Friend: [birth info]",
            },
          ];
        case "Career and Business":
          return [
            {
              title: "Career path insights",
              label: "Get guidance on your career direction",
              action: "What career path might be most suitable for me? My birth details are [date, time, place].",
            },
            {
              title: "Business timing",
              label: "Find auspicious times for business decisions",
              action: "When would be an auspicious time to launch my business? My birth details are [date, time, place].",
            },
            {
              title: "Financial forecast",
              label: "Get insights about financial prospects",
              action: "What are my financial prospects for the coming year? My birth details are [date, time, place].",
            },
          ];
        case "Health Outlook":
          return [
            {
              title: "Health strengths",
              label: "Discover your astrological health strengths",
              action: "What health strengths might my birth chart indicate? I was born on [date, time, place].",
            },
            {
              title: "Potential sensitivities",
              label: "Learn about areas that may need attention",
              action: "Are there any health areas I should pay special attention to? My birth details are [date, time, place].",
            },
            {
              title: "Wellness practices",
              label: "Get suggestions for personalized wellness routines",
              action: "What wellness practices might be most beneficial for me? My birth details are [date, time, place].",
            },
          ];
        case "Spritual Wellness":
          return [
            {
              title: "Spiritual path",
              label: "Explore your spiritual journey based on your chart",
              action: "What spiritual path might be most aligned with my birth chart? I was born on [date, time, place].",
            },
            {
              title: "Meditation practices",
              label: "Get personalized meditation recommendations",
              action: "Can you suggest meditation practices based on my birth chart? My details are [date, time, place].",
            },
            {
              title: "Karmic patterns",
              label: "Understand potential karmic patterns in your life",
              action: "What karmic patterns might be present in my life? My birth details are [date, time, place].",
            },
          ];
        default:
          break;
      }
    }

    // Default actions if no topic or topic not recognized
    return [
      {
        title: "What's my astrological forecast",
        label: "Get insights about your day based on your birth chart and current planetary positions.",
        action: "What is my astrological forecast for today? I was born on [your birth date, time, place].",
      },
      {
        title: "Help me understand my chart",
        label: "Get an explanation of your birth chart and what it means for different areas of your life.",
        action: "Help me understand my birth chart. I was born on [your birth date, time, place].",
      },
      {
        title: "Compatibility analysis",
        label: "Check astrological compatibility between you and another person for relationships or partnerships.",
        action: "Can you analyze the compatibility between these two birth charts? Person 1: [birth details], Person 2: [birth details]",
      },
    ];
  };

  const actions = getTopicActions();

  return (
    <Animated.View style={animatedStyle}>
      <ScrollAdapt withSnap itemWidth={cardWidth}>
        {actions.map((item, i) => (
          <Pressable key={item.action} onPress={() => handlePress(item.action)}>
            <View
              onLayout={(e) => setCardWidth(e.nativeEvent.layout.width)}
              className={cn(
                "mb-3 mr-2.5 h-32 w-[280px] rounded-lg border border-gray-200 bg-white p-4 dark:bg-black",
              )}
              style={{
                //   borderWidth: StyleSheet.hairlineWidth,
                //   borderColor: "red",
                ...(i === actions.length - 1 && {
                  marginRight: width - cardWidth,
                }),
              }}
            >
              <Text className="text-lg font-semibold">{item.title}</Text>
              <Text className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {item.label}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollAdapt>
    </Animated.View>
  );
}
