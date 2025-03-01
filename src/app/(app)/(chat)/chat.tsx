import { ChatInterface } from "@/components/chat/chat-interface";
import { SuggestedActions } from "@/components/chat/suggested-actions";
import { ChatInput } from "@/components/ui/chat-input";
import { useStore } from "@/store/globalStore";
import { generateUUID } from "@/utils";
import { Message, useChat } from "ai/react/dist/index";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetch } from "expo/fetch";
import { ArrowLeft, MessageCirclePlusIcon } from "lucide-react-native";
import { useCallback, useEffect, useRef } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  type TextInput,
} from "react-native";
import type { ScrollView as GHScrollView } from "react-native-gesture-handler";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type WeatherResult = {
  city: string;
  temperature: number;
  weatherCode: string;
  humidity: number;
  wind: number;
}; // Use for Gen UI tools in the future - KEEP THIS

// New ChatHeader component
const ChatHeader = ({
  hasMessages,
  onNewChat,
}: {
  hasMessages: boolean;
  onNewChat: () => void;
}) => {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center justify-between bg-white px-4 py-3 dark:bg-black"
      style={{ paddingTop: Math.max(top, 10) }}
    >
      <Pressable onPress={() => router.back()} className="p-2">
        <ArrowLeft size={20} color="black" />
      </Pressable>

      <Text className="text-lg font-medium">🌙 Kundali AI</Text>

      <Pressable disabled={!hasMessages} onPress={onNewChat} className="p-2">
        <MessageCirclePlusIcon
          size={20}
          color={!hasMessages ? "#eee" : "black"}
        />
      </Pressable>
    </View>
  );
};

const HomePage = () => {
  const { topic } = useLocalSearchParams<{ topic?: string }>();
  const {
    clearImageUris,
    setBottomChatHeightHandler,
    setFocusKeyboard,
    chatId,
    setChatId,
  } = useStore();
  const inputRef = useRef<TextInput>(null);

  // Initialize chatId if not set
  useEffect(() => {
    if (!chatId) {
      setChatId({ id: generateUUID(), from: "newChat" });
    }
  }, []);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    append,
  } = useChat({
    initialMessages: [],
    key: chatId?.id,
    id: chatId?.id,
    api: `${process.env.EXPO_PUBLIC_LOCAL_API_URL}`,
    body: {
      id: chatId?.id,
      modelId: "gpt-4o-mini",
      topic: topic,
    },
    onFinish: () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    },
    fetch: (url: string, options: RequestInit) => {
      return fetch(url, {
        ...options,
        signal: options.signal,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
        },
      }) as unknown as Promise<Response>;
    },
    onError(error) {
      console.log(">> error is", error.message);
    },
  });

  const handleNewChat = useCallback(() => {
    // Reset messages first
    setMessages([]);
    clearImageUris();

    // Small delay to ensure state updates have propagated
    setTimeout(() => {
      const newChatId = generateUUID();
      setChatId({ id: newChatId, from: "newChat" });
      inputRef.current?.focus();
      setBottomChatHeightHandler(false);
    }, 100);
  }, [clearImageUris, setBottomChatHeightHandler, setMessages, setChatId]);

  const handleTextChange = (text: string) => {
    handleInputChange({
      target: { value: text },
    } as any);
  };

  const { bottom } = useSafeAreaInsets();
  const scrollViewRef = useRef<GHScrollView>(null);

  // Reset messages when chatId changes
  useEffect(() => {
    if (chatId) {
      setMessages([] as Message[]);
    }
  }, [chatId, setMessages]);

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      className="flex-1 bg-white dark:bg-black"
      style={{ paddingBottom: bottom }}
    >
      <ChatHeader hasMessages={messages.length > 0} onNewChat={handleNewChat} />

      <ScrollView
        className="container relative mx-auto flex-1 bg-white dark:bg-black"
        ref={scrollViewRef}
      >
        <ChatInterface
          messages={messages}
          scrollViewRef={scrollViewRef}
          isLoading={isLoading}
          topic={topic}
        />
      </ScrollView>

      {messages.length === 0 && (
        <SuggestedActions
          hasInput={input.length > 0}
          append={append}
          topic={topic}
        />
      )}

      <ChatInput
        ref={inputRef}
        scrollViewRef={scrollViewRef}
        input={input}
        onChangeText={handleTextChange}
        focusOnMount={false}
        onSubmit={() => {
          setBottomChatHeightHandler(true);
          handleSubmit(undefined);
          clearImageUris();
        }}
      />
    </Animated.View>
  );
};

export default HomePage;
