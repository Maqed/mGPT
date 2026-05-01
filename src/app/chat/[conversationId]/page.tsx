"use client";

import { use, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useQuery } from "@tanstack/react-query";
import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { useLocalStorage } from "usehooks-ts";

type ChatConversationPageProps = {
  params: Promise<{
    conversationId: string;
  }>;
};

const getConversationMessages = async (
  conversationId: string,
): Promise<UIMessage[]> => {
  const response = await fetch(`/api/conversation/${conversationId}/messages`);

  if (!response.ok) {
    throw new Error("Failed to fetch conversation messages");
  }

  return response.json();
};

export default function ChatConversation({
  params,
}: ChatConversationPageProps) {
  const { conversationId } = use(params);
  const [localStorageMessage, setLocalStorageMessage] = useLocalStorage(
    "user-prompt",
    "",
  );

  const { data: initialMessages = [] } = useQuery({
    queryKey: ["conversation-messages", conversationId],
    queryFn: () => getConversationMessages(conversationId),
    enabled: !!conversationId && localStorageMessage.length === 0,
  });

  const { messages, sendMessage, setMessages, status, stop } = useChat({
    id: conversationId,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ messages: nextMessages }) => ({
        body: {
          conversationId,
          messages: nextMessages,
        },
      }),
    }),
  });
  const hasHydratedInitialMessagesRef = useRef(false);
  const hasSentInitialPromptRef = useRef(false);

  useEffect(() => {
    if (hasHydratedInitialMessagesRef.current) {
      return;
    }
    if (initialMessages.length === 0) {
      return;
    }
    setMessages(initialMessages);
    hasHydratedInitialMessagesRef.current = true;
  }, [initialMessages, setMessages]);

  useEffect(() => {
    const prompt = localStorageMessage.trim();
    if (!prompt || hasSentInitialPromptRef.current) {
      return;
    }
    hasSentInitialPromptRef.current = true;
    sendMessage({ text: prompt });
    setLocalStorageMessage("");
  }, [localStorageMessage, sendMessage, setLocalStorageMessage]);

  const handleSubmit = async ({ text }: PromptInputMessage) => {
    const prompt = text.trim();
    if (!prompt) {
      return;
    }
    sendMessage({ text: prompt });
  };

  return (
    <>
      <Conversation className="min-h-0">
        <ConversationContent>
          {messages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent>
                {message.parts.map((part, i) =>
                  part.type === "text" ? (
                    <MessageResponse key={`${message.id}-${i}`}>
                      {part.text}
                    </MessageResponse>
                  ) : null,
                )}
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
      </Conversation>
      <PromptInputProvider>
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputSubmit
              className="ml-auto"
              onStop={stop}
              status={status}
            />
          </PromptInputFooter>
        </PromptInput>
      </PromptInputProvider>
    </>
  );
}
