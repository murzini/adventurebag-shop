export const runtime = "nodejs";

import { NextResponse } from "next/server";

const COACH_BASE_URL = (process.env.COACH_BASE_URL || "").replace(/\/$/, "");

export async function GET() {
  try {
    if (!COACH_BASE_URL) {
      return NextResponse.json(
        { ok: false, error: "Missing COACH_BASE_URL" },
        { status: 500 }
      );
    }

    const upstream = await fetch(`${COACH_BASE_URL}/api/coach/shop-config/landing`, {
      cache: "no-store",
    });
    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return NextResponse.json(
        { ok: false, error: data?.error || "Failed to fetch Coach landing config" },
        { status: upstream.status }
      );
    }

    return NextResponse.json({ ok: true, config: data });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
