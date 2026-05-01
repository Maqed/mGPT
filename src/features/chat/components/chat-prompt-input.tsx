"use client";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";

function ChatPromptInput() {
  function handleSubmit() {
    // TODO: handle submit for chat creation and adding a chat message
  }

  return (
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
  );
}

export { ChatPromptInput };
