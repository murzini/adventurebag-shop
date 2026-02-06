export const dynamic = "force-dynamic";

const DEFAULT_CONFIG = {
  ctaCaption: "Add to cart",
  ctaHelperText: "Prototype checkout. No payment, no shipping, no account required.",
  imageTipText: "Tip: click thumbnails to switch · click the big image to open full size",
};

export async function GET() {
  const base = process.env.COACH_BASE_URL;
  if (!base) {
    return Response.json({ ok: false, error: "Missing COACH_BASE_URL" }, { status: 500 });
  }

  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/coach/shop-config/details`, {
      cache: "no-store",
    });

    const data = await res.json();
    const merged = { ...DEFAULT_CONFIG, ...(data || {}) };
    merged.ctaCaption = String(merged.ctaCaption || DEFAULT_CONFIG.ctaCaption);
    merged.ctaHelperText = String(merged.ctaHelperText || DEFAULT_CONFIG.ctaHelperText);
    merged.imageTipText = String(merged.imageTipText || DEFAULT_CONFIG.imageTipText);

    return Response.json(merged, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return Response.json(
      { ok: true, ...DEFAULT_CONFIG, note: "Falling back to defaults; Coach unreachable.", error: String(e) },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }
}
