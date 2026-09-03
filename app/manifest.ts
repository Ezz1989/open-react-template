import type { MetadataRoute } from "next";

// Without this, Android's "Add to Home Screen" / install prompt has no
// manifest to read and falls back to a generic icon instead of the mark —
// app/icon.png and app/apple-icon.png only cover the browser tab and iOS
// home screen, not the Android/Chrome install path.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nawah — نواة",
    short_name: "Nawah",
    description:
      "The Arabic pregnancy companion app for mothers and fathers. Built for GCC and Egypt.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF5EA",
    theme_color: "#8B3549",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
