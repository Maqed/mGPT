import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const conversation = pgTable("conversation", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull().default("New Chat"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const message = pgTable("message", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversation.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["user", "assistant"] }).notNull(),
  content: text("content").notNull().default(""),
  status: text("status", { enum: ["streaming", "done", "error"] })
    .notNull()
    .default("done"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
