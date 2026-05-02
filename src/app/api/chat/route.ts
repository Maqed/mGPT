import { chatRequestSchema } from "@/features/chat/zod";
import { db } from "@/lib/db";
import { conversation, message } from "@/lib/db/schema";
import { groq } from "@ai-sdk/groq";
import {
  streamText,
  convertToModelMessages,
  generateId,
  type UIMessage,
} from "ai";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { streamContext } from "@/lib/chat/stream-context";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const parsedBody = chatRequestSchema.parse({
    ...body,
  });

  const messages = body.messages as UIMessage[];

  const latestMessage = messages.at(-1);
  const latestPart = latestMessage?.parts[0];
  if (latestMessage?.role === "user" && latestPart?.type === "text") {
    await db.insert(message).values({
      role: "user",
      status: "done",
      conversationId: parsedBody.conversationId,
      content: latestPart.text,
    });
  }

  await db
    .update(conversation)
    .set({ activeStreamId: null })
    .where(eq(conversation.id, parsedBody.conversationId));

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: generateId,
    onFinish: async ({ messages }) => {
      await db
        .update(conversation)
        .set({ activeStreamId: null })
        .where(eq(conversation.id, parsedBody.conversationId));

      const latestAssistantMessage = messages
        .slice()
        .reverse()
        .find((msg) => msg.role === "assistant");

      const latestAssistantText = latestAssistantMessage?.parts
        .reduce<string[]>((acc, part) => {
          if (part.type === "text" && "text" in part) {
            acc.push(part.text);
          }
          return acc;
        }, [])
        .join("\n")
        .trim();

      if (latestAssistantText) {
        await db.insert(message).values({
          content: latestAssistantText,
          status: "done",
          role: "assistant",
          conversationId: parsedBody.conversationId,
        });
      }
    },
    async consumeSseStream({ stream }) {
      const streamId = generateId();

      await streamContext.createNewResumableStream(streamId, () => stream);

      await db
        .update(conversation)
        .set({ activeStreamId: streamId })
        .where(eq(conversation.id, parsedBody.conversationId));
    },
  });
};
