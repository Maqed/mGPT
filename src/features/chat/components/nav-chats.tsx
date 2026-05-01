"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";

type Chat = {
  id: string;
  title: string;
};

const getChats = async (): Promise<Chat[]> => {
  const response = await fetch("/api/chats");

  if (!response.ok) {
    throw new Error("Failed to fetch chats");
  }

  return response.json();
};

export function NavChats() {
  const {
    data: chats = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: getChats,
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarMenu>
        {isLoading ? (
          <>
            <SidebarMenuSkeleton />
            <SidebarMenuSkeleton />
            <SidebarMenuSkeleton />
          </>
        ) : null}

        {isError ? (
          <SidebarMenuItem>
            <span className="px-3 py-2 text-xs text-muted-foreground">
              Could not load chats
            </span>
          </SidebarMenuItem>
        ) : null}

        {!isLoading && !isError && chats.length === 0 ? (
          <SidebarMenuItem>
            <span className="px-3 py-2 text-xs text-muted-foreground">
              No chats yet
            </span>
          </SidebarMenuItem>
        ) : null}

        {chats.map((chat) => (
          <SidebarMenuItem key={chat.id}>
            <SidebarMenuButton
              className="truncate"
              render={<Link href={`/chat/${chat.id}`}>{chat.title}</Link>}
            />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
