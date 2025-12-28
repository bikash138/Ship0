import { type Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/home/Header";
import QueryProvider from "@/components/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProviderWrapper } from "@/components/clerk-provider-wrapper";
import { ThemeFavicon } from "@/components/theme-favicon";
import { ThemeTransition } from "@/components/theme-transition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ship0 - Build Faster with AI",
    template: "%s | Ship0",
  },
  description:
    "Ship0 is an AI-powered code generation platform that helps you build web applications faster. Generate frontend projects with a simple prompt.",
  keywords: [
    "AI",
    "code generation",
    "web development",
    "frontend",
    "UI development",
    "automation",
    "Ship0",
  ],
  authors: [{ name: "Bikash Shaw" }],
  creator: "Bikash Shaw",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Ship0 - Build Faster with AI",
    description:
      "AI-powered code generation platform that helps you build web applications faster. Generate frontend projects with a simple prompt.",
    siteName: "Ship0",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ship0 - Build Faster with AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ship0 - Build Faster with AI",
    description:
      "AI-powered frontend code generation platform. Turn prompts into production-ready code with instant live preview. Build UI faster and ship with confidence.",
    images: ["/og-image.png"],
    creator: "@Bikash__Shaw",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen overflow-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeFavicon />
          <ThemeTransition />
          <ClerkProviderWrapper>
            <QueryProvider>
              <Header />
              <main className="overflow-hidden h-full flex flex-col">
                {children}
              </main>
              <Toaster />
            </QueryProvider>
          </ClerkProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
