export const runtime = "nodejs";

import { NextResponse } from "next/server";

// Proxies Shop Landing CMS from Coach.
// We proxy via the Shop origin to avoid CORS and to keep the client simple.

function json(body, status = 200) {
  return NextResponse.json(body, { status });
}

export async function GET() {
  const base = process.env.COACH_BASE_URL;
  if (!base) {
    return json({ ok: false, error: "Missing COACH_BASE_URL" }, 500);
  }

  // Coach endpoint is intentionally public read for local + Vercel.
  const url = `${base.replace(/\/$/, "")}/api/coach/shop-config/landing`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        accept: "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return json(
        {
          ok: false,
          error: `Coach responded ${res.status}`,
          hint: text?.slice?.(0, 120) || "",
        },
        502
      );
    }

    const data = await res.json().catch(() => null);
    if (!data || typeof data !== "object") {
      return json({ ok: false, error: "Invalid JSON from Coach" }, 502);
    }

    return json({ ok: true, config: data });
  } catch (e) {
    return json({ ok: false, error: "Failed to reach Coach" }, 502);
  }
}
