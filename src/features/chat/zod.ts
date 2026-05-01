import * as z from "zod";

export const conversationTitleSchema = z.string().trim().min(1).max(80);

export const createConversationInputSchema = z.object({
  title: conversationTitleSchema.optional(),
});

export type CreateConversationInput = z.input<
  typeof createConversationInputSchema
>;
