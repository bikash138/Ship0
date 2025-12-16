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
import { CaretDownIcon } from "@phosphor-icons/react";
import { XIcon, LinkedinIcon, GithubIcon } from "../../assests/Social-Icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetProjectById } from "@/hooks/use-project";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function ChatHeader({ projectId }: { projectId: string }) {
  const { data: project } = useGetProjectById(projectId);

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-background/95 backdrop-blur">
      <div className="relative flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Logo />
          <span>/</span>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
              <span className="font-medium hover:text-foreground/80 transition-colors">
                {project?.title || "Loading..."}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
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

        <div className="flex items-center gap-4">
          {/* Authentication Buttons */}
          <SignedOut>
            <SignInButton>
              <Button variant={"outline"}>Sign in</Button>
            </SignInButton>
            <SignUpButton>
              <Button>Sign Up</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
