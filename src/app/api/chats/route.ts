import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { conversation } from "@/lib/db/schema";

export const GET = async () => {
  const chats = await db
    .select({
      id: conversation.id,
      title: conversation.title,
      updatedAt: conversation.updatedAt,
    })
    .from(conversation)
    .orderBy(desc(conversation.updatedAt));

  return NextResponse.json(chats);
};
