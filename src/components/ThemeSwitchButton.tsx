"use client";

import { useEffect, useState } from "react";
import { Moon, Monitor, Sun } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function ThemeSwitchButton({
  theme,
  setTheme,
}: {
  theme?: string;
  systemTheme?: string;
  setTheme: (v: string) => void;
}) {
  const current = (theme ?? "system") as "system" | "light" | "dark";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const displayed = (mounted ? current : "system") as
    | "system"
    | "light"
    | "dark";
  const icon =
    displayed === "dark" ? (
      <Moon />
    ) : displayed === "light" ? (
      <Sun />
    ) : (
      <Monitor />
    );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-center gap-2 rounded-lg p-2"
        >
          <span className="shrink-0">{icon}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-(--radix-dropdown-menu-trigger-width)"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => setTheme("light")}
            className="justify-center"
          >
            <Sun />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setTheme("dark")}
            className="justify-center"
          >
            <Moon />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setTheme("system")}
            className="justify-center"
          >
            <Monitor />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
