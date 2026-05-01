 "use client";

import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { createConversation } from "@/features/chat/actions";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSubmit = async ({ text }: PromptInputMessage) => {
    const title = text.trim();
    const createdConversation = await createConversation(
      title ? { title } : undefined,
    );
    router.push(`/chat/${createdConversation.id}`);
  };

  return (
    <>
      <div className="flex-1"></div>
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
