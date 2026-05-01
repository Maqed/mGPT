import * as z from "zod";

export const conversationTitleSchema = z.string().trim().min(1).max(80);

export const createConversationInputSchema = z.object({
  title: conversationTitleSchema.optional(),
});

export const chatRequestSchema = z.object({
  conversationId: z.uuid(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      parts: z
        .array(
          z.object({
            type: z.string(),
            text: z.string().optional(),
          }),
        )
        .optional(),
    }),
  ),
});

export type CreateConversationInput = z.input<
  typeof createConversationInputSchema
>;
export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
