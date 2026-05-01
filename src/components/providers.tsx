"use client";
import { type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "./ui/tooltip";

function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}

export default Providers;
