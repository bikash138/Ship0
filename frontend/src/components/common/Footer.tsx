"use client";
import Link from "next/link";
import { Logo } from "@/assests/logo";
import { GithubIcon, LinkedinIcon, XIcon } from "@/assests/social-icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border pt-10 pb-6 mt-20 rounded-b-md">
      <div className="max-w-2xl mx-auto px-4">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center mb-8">
          <Logo />
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center items-center gap-6 mb-8">
          <Link
            href="https://x.com/Bikash__Shaw"
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            aria-label="Twitter"
            target="_blank"
          >
            <XIcon />
          </Link>
          <Link
            href="https://github.com/bikash138"
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            aria-label="GitHub"
            target="_blank"
          >
            <GithubIcon />
          </Link>
          <Link
            href="https://www.linkedin.com/in/bikash-shaw-5ab74727b/"
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            aria-label="LinkedIn"
            target="_blank"
          >
            <LinkedinIcon />
          </Link>
        </div>

        <div className="bg-border w-full h-px mb-8"></div>

        {/* Copyright */}
        <div className="text-center pb-4">
          <p className="text-muted-foreground text-sm">
            <span className="block sm:inline">
              © {currentYear} Ship0. All rights reserved.
            </span>
            <span className="hidden sm:inline"> | </span>
            <span className="block sm:inline mt-1 sm:mt-0">
              Build with ❤️ by{" "}
              <Link
                href="https://bikashdev.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-foreground font-medium hover:underline hover:decoration-dotted hover:underline-offset-4 duration-200 transition-all">
                  Bikash Shaw
                </span>
              </Link>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
