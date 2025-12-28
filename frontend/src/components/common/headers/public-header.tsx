import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Logo } from "@/assests/logo";
import { Button } from "../../ui/button";
import { CaretDownIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { ThemeToggle } from "../../ui/theme-toggle";
import { CreditUsageDisplay } from "../credit-usage-display";
import { SOCIAL_LINKS } from "@/data/social-links";

const NAVIGATION_LINKS = [
  { label: "Community", href: "#" },
  { label: "Enterprise", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Pricing", href: "#" },
] as const;

const PublicHeader = () => {
  return (
    <header className="sticky top-0 z-50 border-white/20 bg-background/95 backdrop-blur">
      <div className="relative flex items-center justify-between px-4 py-2">
        <Link href="/">
          <Logo />
        </Link>

        {/* Navigation Links */}
        <SignedOut>
          <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            {NAVIGATION_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button className="flex items-center gap-1 hover:text-foreground transition-colors">
              Resources
              <CaretDownIcon className="h-3 w-3" />
            </button>
          </nav>
        </SignedOut>

        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {/* Social Media Links */}
          <div className="hidden sm:flex items-center gap-3 text-muted-foreground border-white/10 pl-4">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label={label}
              >
                <Icon />
              </Link>
            ))}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Authentication Buttons */}
          <SignedOut>
            <SignInButton>
              <Button
                variant={"default"}
                className="text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2"
              >
                Get Started
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <CreditUsageDisplay />
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
