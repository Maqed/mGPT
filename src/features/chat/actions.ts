"use server";

import { db } from "@/lib/db";
import { conversation } from "@/lib/db/schema";
import {
  type CreateConversationInput,
  createConversationInputSchema,
} from "@/features/chat/zod";

export const createConversation = async (input?: CreateConversationInput) => {
  const parsedInput = createConversationInputSchema.parse(input ?? {});

  const [createdConversation] = await db
    .insert(conversation)
    .values({
      ...(parsedInput.title ? { title: parsedInput.title } : {}),
    })
    .returning();

  return createdConversation;
};
