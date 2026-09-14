"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

/**
 * Website analytics — same PostHog EU project the Flutter app already uses
 * (`lib/services/analytics_service.dart`), so this is one dashboard for app +
 * site, not a second vendor.
 *
 * No-ops with a console warning if the key is missing (local dev without
 * `.env.local` set) instead of throwing — unlike `lib/supabase.ts`, a missing
 * analytics key must never break the page for a real visitor.
 */
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = "https://eu.i.posthog.com"; // matches analytics_service.dart's EU host (PDPL)

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!POSTHOG_KEY) {
      console.warn("NEXT_PUBLIC_POSTHOG_KEY not set — site analytics disabled.");
      return;
    }
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      // Captures pageviews (incl. the client-side route changes used by the
      // /ar,/en guide pages) and pageleaves automatically.
      capture_pageview: true,
      capture_pageleave: true,
      person_profiles: "identified_only",
    });
  }, []);

  if (!POSTHOG_KEY) return <>{children}</>;
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
