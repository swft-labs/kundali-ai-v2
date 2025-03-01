import { generateUUID } from "@/lib/utils";
import { Redirect, Stack, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { Pressable, type TextInput, View, ScrollView, Text } from "react-native";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import { fetch } from "expo/fetch";
import { useChat } from "ai/react/dist/index";
import { LottieLoader } from "@/components/chat/lottie-loader";
import { ChatInterface } from "@/components/chat/chat-interface";
import { ChatInput } from "@/components/ui/chat-input";
import { SuggestedActions } from "@/components/chat/suggested-actions";
import type { ScrollView as GHScrollView } from "react-native-gesture-handler";
import { useStore } from "@/lib/globalStore";
import { MessageCirclePlusIcon, Menu, ArrowLeft } from "lucide-react-native";
import { Message } from "ai/react/dist/index";
import Animated, { FadeIn } from "react-native-reanimated";

type WeatherResult = {
  city: string;
  temperature: number;
  weatherCode: string;
  humidity: number;
  wind: number;
}; // Use for Gen UI tools in the future

// New ChatHeader component
const ChatHeader = ({ 
  hasMessages, 
  onNewChat 
}: { 
  hasMessages: boolean; 
  onNewChat: () => void 
}) => {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  
  return (
    <View 
      className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-black"
      style={{ paddingTop: Math.max(top, 10) }}
    >
      <Pressable onPress={() => router.back()} className="p-2">
        <ArrowLeft size={20} color="black" />
      </Pressable>
      
      <Text className="text-lg font-medium">🌙 Kundali AI</Text>
      
      <Pressable 
        disabled={!hasMessages} 
        onPress={onNewChat}
        className="p-2"
      >
        <MessageCirclePlusIcon
          size={20}
          color={!hasMessages ? "#eee" : "black"}
        />
      </Pressable>
    </View>
  );
};

const HomePage = () => {
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
    api: `http://localhost:3000/api/chat-open`,
    body: {
      id: chatId?.id,
      modelId: "gpt-4o-mini",
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
      <ChatHeader 
        hasMessages={messages.length > 0} 
        onNewChat={handleNewChat} 
      />
      
      <ScrollView
        className="container relative mx-auto flex-1 bg-white dark:bg-black"
        ref={scrollViewRef}
      >
        <ChatInterface
          messages={messages}
          scrollViewRef={scrollViewRef}
          isLoading={isLoading}
        />
      </ScrollView>

      {messages.length === 0 && (
        <SuggestedActions hasInput={input.length > 0} append={append} />
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
