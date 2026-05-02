import { db } from "@/lib/db";
import { UI_MESSAGE_STREAM_HEADERS } from "ai";
import { eq } from "drizzle-orm";
import { conversation } from "@/lib/db/schema";
import { streamContext } from "@/lib/chat/stream-context";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const { conversationId } = await params;

  const currentConversation = await db.query.conversation.findFirst({
    where: eq(conversation.id, conversationId),
  });

  if (!currentConversation || currentConversation.activeStreamId == null) {
    return new Response(null, { status: 204 });
  }

  return new Response(
    await streamContext.resumeExistingStream(
      currentConversation.activeStreamId,
    ),
    { headers: UI_MESSAGE_STREAM_HEADERS },
  );
}
