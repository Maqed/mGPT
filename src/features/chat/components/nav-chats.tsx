import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";

export function NavChats() {
  // TODO: add chats

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarMenu>{/* TODO: add chats ui */}</SidebarMenu>
    </SidebarGroup>
  );
}
