import { chatRequestSchema } from "@/features/chat/zod";
import { db } from "@/lib/db";
import { message } from "@/lib/db/schema";
import { groq } from "@ai-sdk/groq";
import { UIMessage, streamText, convertToModelMessages } from "ai";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const parsedBody = chatRequestSchema.parse({
    ...body,
  });

  const messages = body.messages as UIMessage[];

  const latestMessage = messages.at(-1);
  const latestPart = latestMessage?.parts[0];

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    messages: await convertToModelMessages(messages),
    onFinish: async ({ text }) => {
      if (latestMessage?.role === "user" && latestPart?.type === "text") {
        await db.insert(message).values({
          role: "user",
          status: "done",
          conversationId: parsedBody.conversationId,
          content: latestPart.text,
        });
      }
      await db.insert(message).values({
        content: text,
        status: "done",
        role: "assistant",
        conversationId: parsedBody.conversationId,
      });
    },
  });

  return result.toUIMessageStreamResponse({
    consumeSseStream: async () => {
      await result.consumeStream();
    },
  });
};
