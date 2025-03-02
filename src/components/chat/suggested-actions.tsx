import { ScrollAdapt } from "@/components/chat/scroll-adapt";
import { Text } from "@/components/ui/text";
import { useStore } from "@/store/globalStore";
import { cn, generateUUID } from "@/utils";
import type { CreateMessage, Message } from "ai";
import { useEffect, useState } from "react";
import { Pressable, View, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

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
      shouldBeVisible: !(hasInput || selectedImageUris.length > 0),
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

    // Send the initial message using append with the topic
    await append(
      {
        role: "user",
        content: action,
      },
      {
        body: {
          id: newChatId,
          topic: topic, // Pass the topic to the backend
        },
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
              title: "Reveal my future...",
              label:
                "Get a personalized breakdown of upcoming planetary shifts and how they may open new doors in your life.",
              action:
                "Based on my planetary transits, what major opportunities are coming my way?",
            },
            {
              title: "How is my energy shifting?",
              label:
                "Understand the cosmic influences shaping your emotions, focus, and overall energy during this period.",
              action:
                "Analyze my current planetary influences and how they are shaping my energy.",
            },
            {
              title: "Should I take action or wait?",
              label:
                "Find out if the current planetary transits support bold moves, or if it’s better to hold back and wait for the right moment.",
              action:
                "Given my Kundali and transits, is now a good time for big decisions or should I wait?",
            },
          ];
        case "Daily Reading":
          return [
            {
              title: "My personal forecast for today",
              label:
                "A detailed breakdown of today’s planetary positions and how they influence your emotions, actions, and decisions.",
              action:
                "Give me my personalized astrological reading for today based on my chart and current transits.",
            },
            {
              title: "Will today impact my emotions?",
              label:
                "See how planetary movements today are affecting your mood, focus, and relationships based on your placements.",
              action:
                "Analyze my chart and journal history—how will today's planetary movements impact my emotions?",
            },
            {
              title: "What should I focus on today?",
              label:
                "Get guidance on the best areas to direct your energy today, whether it’s career, relationships, or personal growth.",
              action:
                "Based on my chart and today's transits, what should I prioritize today?",
            },
          ];
        case "Match Compatibility":
          return [
            {
              title: "Analyze compatibility with...",
              label:
                "Discover the strengths, challenges, and karmic lessons within your relationship through a detailed astrological comparison.",
              action:
                "Based on our Kundalis, what strengths and challenges exist in my relationship with [partner's name]?",
            },
            {
              title: "Which of my friends is most compatible with me?",
              label:
                "Explore which of your friends share the best cosmic alignment with you.",
              action:
                "Compare my birth chart with my friends—who am I most compatible with based on planetary alignments?",
            },
            {
              title: "How will my relationships evolve?",
              label:
                "See upcoming planetary shifts and how they might bring changes to your romantic, business, or personal relationships.",
              action:
                "How will my relationships change based on upcoming astrological transits?",
            },
          ];
        case "Career and Business":
          return [
            {
              title: "Should I move careers now?",
              label:
                "Check if cosmic timing supports making a job switch, starting a new business, or pursuing new professional opportunities.",
              action:
                "Based on my chart and planetary cycles, is now a good time to switch careers or start a new venture?",
            },
            {
              title: "When will I grow in my career?",
              label:
                "Find out when the planetary alignments will be most favorable for promotions, recognition, and financial success.",
              action:
                "Analyze my transits—when am I most likely to see professional success and growth?",
            },
            {
              title: "How can I maximize finances?",
              label:
                "Get strategic insights into wealth-building, smart financial decisions, and the best periods for investments.",
              action:
                "Based on my planetary placements, what is the best strategy to maximize my financial success?",
            },
          ];
        case "Health Outlook":
          return [
            {
              title: "How is my energy and health?",
              label:
                "A personalized astrological check-up on how today's planetary movements impact your vitality, stress levels, and well-being.",
              action:
                "Based on my chart and today's planetary transits, how is my health and energy looking?",
            },
            {
              title: "What Health plan should I follow?",
              label:
                "Discover which wellness routines, diets, and self-care practices are best suited to your unique astrological blueprint.",
              action:
                "Based on my planetary alignments, what diet, fitness, and wellness practices suit me best?",
            },
            {
              title: "Any upcoming health concerns?",
              label:
                "Learn about any planetary influences that could indicate times when you may need to be extra mindful of your health and habits.",
              action:
                "Are there any upcoming planetary transits that indicate a period of low energy or health sensitivity?",
            },
          ];
        case "Spritual Wellness":
          return [
            {
              title: "How do I feel happy?",
              label:
                "Explore meditation techniques, rituals, and spiritual practices that resonate with your astrological placements and soul journey.",
              action:
                "Based on my Kundali, which spiritual practices or meditations resonate most with me?",
            },
            {
              title: "How can I clear karmic patterns?",
              label:
                "Gain insights into past-life karmic lessons and how to work through any blockages to spiritual and personal growth.",
              action:
                "Analyze my karmic patterns—what lessons am I carrying forward, and how can I resolve them?",
            },
            {
              title: "What does my Kundali say ?",
              label:
                "Uncover your deeper soul purpose and the spiritual lessons you are meant to experience in this lifetime.",
              action:
                "What does my birth chart reveal about my higher purpose and spiritual evolution?",
            },
          ];
        default:
          break;
      }
    }

    // Default fallback options if no specific topic is selected
    return [
      {
        title: "What's my cosmic energy right now?",
        label:
          "Get an instant analysis of the planetary transits affecting you at this very moment and how to harness their energy.",
        action:
          "Analyze my planetary transits and tell me how my energy is shifting right now.",
      },
      {
        title: "How is my week looking astrologically?",
        label:
          "A breakdown of upcoming planetary shifts and how they will influence different aspects of your life over the next 7 days.",
        action:
          "Give me an overview of how my week will be based on my birth chart and transits.",
      },
      {
        title: "Who in my circle is my best match?",
        label:
          "Discover which of your friends, colleagues, or love interests share the best astrological compatibility with you.",
        action:
          "Compare my birth chart with my friends and tell me who I'm most astrologically aligned with.",
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
