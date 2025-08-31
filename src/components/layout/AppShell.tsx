"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  Activity,
  Utensils,
  MoreHorizontal,
  HeartPulse,
  Beef,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { ThemeSwitchButton } from "../ThemeSwitchButton";
import { useSession, signOut } from "@/lib/auth-client";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme, systemTheme } = useTheme();
  const { data: session } = useSession();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const navTabs = [
    { href: "/dashboard", label: "Home", icon: <Home /> },
    { href: "/symptom_logs", label: "Log Symptoms", icon: <HeartPulse /> },
    { href: "/food_logs", label: "Log Food", icon: <Beef /> },
    { href: "/more", label: "More", icon: <MoreHorizontal /> },
  ];
  const currentTab =
    navTabs.find((t) => isActive(t.href))?.href ?? "/dashboard";

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="px-3 py-3">
          <div className="text-sm font-semibold">Hypertrack</div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="gap-2 px-2 py-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/dashboard")}
                className="rounded-lg px-3 py-2"
              >
                <Link href="/dashboard">
                  <Home />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/symptom_logs")}
                className="rounded-lg px-3 py-2"
              >
                <Link href="/symptom_logs">
                  <HeartPulse />

                  <span>Symptom Logs</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/food_logs")}
                className="rounded-lg px-3 py-2"
              >
                <Link href="/food_logs">
                  <Beef />
                  <span>Food Logs</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/symptoms")}
                className="rounded-lg px-3 py-2"
              >
                <Link href="/symptoms">
                  <Activity />
                  <span>Symptoms</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/food")}
                className="rounded-lg px-3 py-2"
              >
                <Link href="/food">
                  <Utensils />
                  <span>Food</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/more")}
                className="rounded-lg px-3 py-2"
              >
                <Link href="/more">
                  <MoreHorizontal />
                  <span>More</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="mt-auto border-t p-2">
          <div className="flex flex-col gap-2">
            <ThemeSwitchButton
              theme={theme}
              systemTheme={systemTheme}
              setTheme={setTheme}
            />
            <Separator />
            <UserBlock
              name={session?.user?.name || "User"}
              email={session?.user?.email || "No email"}
              onLogout={() =>
                signOut({
                  fetchOptions: { onSuccess: () => router.push("/login") },
                })
              }
            />
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        {/* Top bar (mobile) */}
        <div className="md:hidden sticky top-0 z-10 border-b bg-background h-12 flex items-center px-3">
          <SidebarTrigger className="p-2" />
          <span className="ml-2 font-medium">Hypertrack</span>
        </div>
        {/* Content container with global responsive padding */}
        <div className="flex-1">
          <div className="mx-auto w-full max-w-5xl px-4 md:px-6 lg:px-8 py-3 md:py-5">
            {/* Back button above content (all pages except dashboard) */}
            <BackButton pathname={pathname} />
            {children}
          </div>
        </div>
        {/* Bottom tabs (mobile) */}
        <nav className="md:hidden sticky bottom-0 z-10 border-t bg-background pb-[env(safe-area-inset-bottom)]">
          <MobileTabs
            navTabs={navTabs}
            currentTab={currentTab}
            onNavigate={(v) => router.push(v)}
          />
        </nav>
      </SidebarInset>
    </SidebarProvider>
  );
}

function UserBlock({
  name,
  email,
  onLogout,
}: {
  name: string;
  email: string;
  onLogout: () => void;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="flex items-center gap-3 rounded-lg p-2">
      <div className="bg-muted text-foreground/80 flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium truncate">{name}</div>
        <div className="text-xs text-muted-foreground truncate">{email}</div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onLogout}
        className="text-xs px-2 py-1 h-auto"
      >
        Logout
      </Button>
    </div>
  );
}

function BackButton({ pathname }: { pathname: string }) {
  const router = useRouter();
  const segments = pathname.split("/").filter(Boolean);
  // Hide on dashboard
  if (segments.length === 1 && segments[0] === "dashboard") return null;
  const target =
    segments.length <= 1 ? "/dashboard" : "/" + segments.slice(0, -1).join("/");
  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2 text-muted-foreground mb-2"
      onClick={() => router.push(target)}
    >
      <ChevronLeft className="size-4" />
      <span>Back</span>
    </Button>
  );
}

function MobileTabs({
  navTabs,
  currentTab,
  onNavigate,
}: {
  navTabs: Array<{ href: string; label: string; icon: React.ReactNode }>;
  currentTab: string;
  onNavigate: (href: string) => void;
}) {
  const { isMobile, setOpenMobile } = useSidebar();
  const handleChange = (v: string) => {
    if (isMobile && v === "/more") {
      setOpenMobile(true);
      return;
    }
    onNavigate(v);
  };
  return (
    <Tabs value={currentTab} onValueChange={handleChange} className="w-full">
      <TabsList className="grid grid-cols-4 h-14 w-full rounded-none p-0 bg-background">
        {navTabs.map((t) => (
          <TabsTrigger
            key={t.href}
            value={t.href}
            className="flex flex-col items-center justify-center gap-0.5 text-xs border-0 rounded-none"
          >
            <div className="h-5 w-5">{t.icon}</div>
            <span>{t.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
