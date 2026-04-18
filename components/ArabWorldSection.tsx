"use client";
import { StorySection } from "@/components/StorySection";

// Pexels photo — swap if it doesn't fit the "warm Middle Eastern home / cultural richness" feel.
// Search "middle eastern home warm" or "arabic calligraphy warm" on pexels.com.
const IMAGE_URL =
  "https://images.pexels.com/photos/5490354/pexels-photo-5490354.jpeg?auto=compress&cs=tinysrgb&w=1200";

export function ArabWorldSection() {
  return (
    <StorySection
      bucket="arabWorld"
      imageUrl={IMAGE_URL}
      imageAlt="Warmth and home, Arab world"
      imageSide="right"
      glow="navy"
    />
  );
}
