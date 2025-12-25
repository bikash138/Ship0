"use client";
import { PricingTable } from "@clerk/nextjs";
import { motion } from "motion/react";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function Pricing() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className={`${spaceGrotesk.className} text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent`}
          >
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include core
            features.
          </p>
        </div>

        {/* Clerk Pricing Table */}
        <div className="w-full">
          <PricingTable />
        </div>
      </div>
    </section>
  );
}
