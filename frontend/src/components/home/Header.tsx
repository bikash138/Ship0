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

export function Header() {
  return (
    <header className="border-b border-white/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="relative flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Logo />
        </div>

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
            <Link href="https://github.com/bikash138" target="_blank">
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
