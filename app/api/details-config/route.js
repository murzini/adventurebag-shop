export const dynamic = "force-dynamic";
import { fetchCoachJson } from "@/lib/server/coachProxy";

const DEFAULT_CONFIG = {
  ctaCaption: "Add to cart",
  ctaHelperText: "Prototype checkout. No payment, no shipping, no account required.",
  imageTipText: "Tip: click thumbnails to switch · click the big image to open full size",
};

export async function GET() {
  try {
    const data = await fetchCoachJson("/api/coach/shop-config/details");
    const merged = { ...DEFAULT_CONFIG, ...(data || {}) };
    merged.ctaCaption = String(merged.ctaCaption || DEFAULT_CONFIG.ctaCaption);
    merged.ctaHelperText = String(merged.ctaHelperText || DEFAULT_CONFIG.ctaHelperText);
    merged.imageTipText = String(merged.imageTipText || DEFAULT_CONFIG.imageTipText);

    return Response.json(
      { ok: true, degraded: false, ...merged },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    return Response.json(
      {
        ok: false,
        degraded: true,
        ...DEFAULT_CONFIG,
        note: "Falling back to defaults; Coach unreachable.",
        error: String(e?.message || e),
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }
}
