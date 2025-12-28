"use client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Logo } from "@/assests/logo";
import { Button } from "../../ui/button";
import Link from "next/link";
import { useGetProjectById } from "@/hooks/use-project";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CreditUsageDisplay } from "../credit-usage-display";

const PROJECT_MENU_ITEMS = [
  { label: "Go to Dashboard", href: "/" },
  { label: "All Projects", href: "/projects" },
] as const;

export function ChatHeader({ projectId }: { projectId: string }) {
  const { data: project, isLoading, isError } = useGetProjectById(projectId);

  return (
    <header className="sticky top-0 z-50 border-white/20 bg-background/95 backdrop-blur">
      <div className="relative flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0 flex-1 mr-2">
          <Link href="/" className="shrink-0">
            <Logo />
          </Link>
          <span className="hidden sm:inline">/</span>

          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-1 sm:gap-2 outline-none min-w-0"
                aria-label="Project menu"
              >
                <span className="font-medium hover:text-foreground/80 transition-colors truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px] text-sm sm:text-base">
                  {isLoading ? (
                    <span className="text-muted-foreground">Loading...</span>
                  ) : isError ? (
                    <span className="text-destructive">
                      Error loading project
                    </span>
                  ) : (
                    project?.title || "Untitled Project"
                  )}
                </span>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {PROJECT_MENU_ITEMS.map((item) => (
                  <DropdownMenuItem key={item.label} asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 shrink-0">
          <ThemeToggle />
          {/* Authentication Buttons */}
          <SignedOut>
            <SignInButton>
              <Button
                variant={"outline"}
                className="text-xs sm:text-sm px-2 sm:px-4"
              >
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className="text-xs sm:text-sm px-2 sm:px-4">
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <CreditUsageDisplay />
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
