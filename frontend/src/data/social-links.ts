import { GithubIcon, LinkedinIcon, XIcon } from "@/assets/social-icons";

export const SOCIAL_LINKS = [
  { icon: GithubIcon, href: "https://github.com/bikash138", label: "GitHub" },
  {
    icon: LinkedinIcon,
    href: "https://www.linkedin.com/in/bikash-shaw-5ab74727b/",
    label: "LinkedIn",
  },
  { icon: XIcon, href: "https://x.com/Bikash__Shaw", label: "X (Twitter)" },
] as const;
