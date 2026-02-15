export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { fetchCoachJson } from "@/lib/server/coachProxy";

// Proxies Shop Landing CMS from Coach.
// We proxy via the Shop origin to avoid CORS and to keep the client simple.

function json(body, status = 200) {
  return NextResponse.json(body, { status });
}

const DEFAULT_CONFIG = {
  heroTitle: "Travel better with AdventureBag",
  heroSubtitle:
    "Thoughtfully designed backpacks for work, travel, and everyday movement.",
  heroCtaLabel: "Shop backpacks",
  categories: [],
  features: [],
  bottomTitle: "Explore our backpacks",
  bottomSubtitle: "Browse all models and find the one that fits you best.",
  bottomCtaLabel: "View all backpacks",
};

export async function GET() {
  try {
    const data = await fetchCoachJson("/api/coach/shop-config/landing");

    return json({
      ok: true,
      degraded: false,
      config: { ...DEFAULT_CONFIG, ...(data || {}) },
    });
  } catch (e) {
    return json(
      {
        ok: false,
        degraded: true,
        config: DEFAULT_CONFIG,
        error: e?.message || "Failed to reach Coach",
        hint: e?.preview || "",
      },
      200
    );
  }
}
