"use client";
import { StorySection } from "@/components/StorySection";

// Pexels photo — swap if it doesn't fit the "calm, warm, journaling / mother in soft light" feel.
// Search "pregnant woman journal morning light" on pexels.com for alternatives.
const IMAGE_URL =
  "https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=1200";

export function ScienceSection() {
  return (
    <StorySection
      bucket="science"
      imageUrl={IMAGE_URL}
      imageAlt="A mother reading in soft light"
      imageSide="left"
      glow="rose"
    />
  );
}
