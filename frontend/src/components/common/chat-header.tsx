"use client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Logo } from "../../assests/logo";
import { Button } from "../ui/button";
import Link from "next/link";
import { useGetProjectById } from "@/hooks/use-project";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle";
import { CreditUsageDisplay } from "./credit-usage-display";

export function ChatHeader({ projectId }: { projectId: string }) {
  const { data: project } = useGetProjectById(projectId);

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
              <DropdownMenuTrigger className="flex items-center gap-1 sm:gap-2 outline-none min-w-0">
                <span className="font-medium hover:text-foreground/80 transition-colors truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px] text-sm sm:text-base">
                  {project?.title || "Loading..."}
                </span>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/">Go to Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/">All Projects</Link>
                </DropdownMenuItem>
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
