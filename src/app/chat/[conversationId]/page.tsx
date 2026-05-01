"use client";

import { use } from "react";
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
import { useLocalStorage } from "usehooks-ts";

type ChatConversationPageProps = {
  params: Promise<{
    conversationId: string;
  }>;
};

type ConversationMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status: "streaming" | "done" | "error";
  createdAt: string;
};

const getConversationMessages = async (
  conversationId: string,
): Promise<ConversationMessage[]> => {
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

  function handleSubmit() {}

  return (
    <>
      <Conversation className="min-h-0">
        <ConversationContent>
          \
          {initialMessages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent>
                {/* {message.parts.map((part, i) =>
                  part.type === "text" ? (
                    <MessageResponse key={i}>{part.text}</MessageResponse>
                  ) : null,
                )} */}
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
            <PromptInputSubmit className="ml-auto" />
          </PromptInputFooter>
        </PromptInput>
      </PromptInputProvider>
    </>
  );
}
