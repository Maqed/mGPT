import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { NavChats } from "./nav-chats";

export function ChatSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link href="/">mGPT</Link>
      </SidebarHeader>
      <SidebarContent>
        <NavChats />
      </SidebarContent>
    </Sidebar>
  );
}
