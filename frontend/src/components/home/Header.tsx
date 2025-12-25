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
import { XIcon, LinkedinIcon, GithubIcon } from "@/assests/social-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChatHeader } from "../common/chat-header";
import { ThemeToggle } from "../ui/theme-toggle";

export function Header() {
  const pathname = usePathname();
  const isChatPage = pathname?.includes("chat");
  const projectId = isChatPage ? pathname.split("/")[2] : "";

  return (
    <>
      {isChatPage ? (
        <ChatHeader projectId={projectId} />
      ) : (
        <header className="sticky top-0 z-50 border-white/20 bg-background/95 backdrop-blur">
          <div className="relative flex items-center justify-between px-4 py-4">
            <Link href="/">
              <Logo />
            </Link>

            {/* Navigation Links */}
            <SignedOut>
              <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
                <a href="#" className="hover:text-foreground transition-colors">
                  Community
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  Enterprise
                </a>
                <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                  Resources
                  <CaretDownIcon className="h-3 w-3" />
                </button>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contact
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  Pricing
                </a>
              </nav>
            </SignedOut>

            <div className="flex items-center gap-4">
              {/* Social Media Links */}
              <div className="flex items-center gap-4 text-muted-foreground border-white/10 pl-6">
                <Link
                  href="https://github.com/bikash138"
                  target="_blank"
                  className="hover:text-foreground transition-color"
                >
                  <GithubIcon />
                </Link>

                <Link
                  href="https://www.linkedin.com/in/bikash-shaw-5ab74727b/"
                  className="hover:text-foreground transition-colors"
                  target="_blank"
                >
                  <LinkedinIcon />
                </Link>
                <Link
                  href="https://x.com/Bikash__Shaw"
                  className="hover:text-foreground transition-colors"
                  target="_blank"
                >
                  <XIcon />
                </Link>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Authentication Buttons */}
              <SignedOut>
                <SignInButton>
                  <Button variant={"default"}>Get Started</Button>
                </SignInButton>
                {/* <SignUpButton>
                  <Button>Sign Up</Button>
                </SignUpButton> */}
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </header>
      )}
    </>
  );
}
