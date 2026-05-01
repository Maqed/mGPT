import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { message } from "@/lib/db/schema";

type RouteContext = {
  params: Promise<{
    conversationId: string;
  }>;
};

export const GET = async (_request: Request, { params }: RouteContext) => {
  const { conversationId } = await params;

  if (!conversationId) {
    return NextResponse.json(
      { error: "conversationId is required" },
      { status: 400 },
    );
  }

  try {
    const conversationMessages = await db
      .select({
        id: message.id,
        role: message.role,
        content: message.content,
        status: message.status,
        createdAt: message.createdAt,
      })
      .from(message)
      .where(eq(message.conversationId, conversationId))
      .orderBy(asc(message.createdAt));

    const normalizedMessages = conversationMessages.map((item) => ({
      id: item.id,
      role: item.role,
      parts: [{ type: "text", text: item.content }],
    }));

    return NextResponse.json(normalizedMessages);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch conversation messages" },
      { status: 500 },
    );
  }
};
