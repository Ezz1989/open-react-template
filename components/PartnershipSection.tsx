"use client";
import { StorySection } from "@/components/StorySection";

// Pexels photo — swap the ID if the picked image doesn't fit the "warm couple / partnership" feel.
// Search "pregnancy couple hands on belly" on pexels.com and paste a new URL here.
const IMAGE_URL =
  "https://images.pexels.com/photos/3893668/pexels-photo-3893668.jpeg?auto=compress&cs=tinysrgb&w=1200";

export function PartnershipSection() {
  return (
    <StorySection
      bucket="partnership"
      imageUrl={IMAGE_URL}
      imageAlt="A couple expecting a baby, together"
      imageSide="right"
      glow="rose"
      priority
    />
  );
}
