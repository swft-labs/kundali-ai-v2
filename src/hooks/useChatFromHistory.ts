import { useState, useEffect } from "react";
import { Message } from "ai/react";
import { convertToUIMessages } from "@/lib/utils";

type ChatIdState = {
  id: string;
  from: "history" | "newChat";
} | null;

interface UseChatFromHistoryProps {
  chatId: ChatIdState;
  token: string | null;
}

export function useChatFromHistory({ chatId, token }: UseChatFromHistoryProps) {
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (chatId?.id && chatId.from === "history") {
      setLoading(true);
      fetch(`http://localhost:3000/api/chat/${chatId.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((messages) => {
          console.log(">> messages", messages);
          const uiMessages = convertToUIMessages(messages);
          console.log(">> uiMessages", uiMessages);

          if (messages.length) {
            setInitialMessages(convertToUIMessages(messages));
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Error fetching chat messages:", err);
          setInitialMessages([]);
        });
    }
  }, [chatId, token]);

  return { initialMessages, loading };
}
