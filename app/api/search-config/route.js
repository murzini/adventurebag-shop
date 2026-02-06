export const dynamic = "force-dynamic";

const DEFAULT_CONFIG = {
  pageTitle: "Search",
  pageSubtitle: "Browse backpacks. Filters work on metadata (audience, purpose, material, price band).",
  visibleCount: 24,
  filtersTitle: "Filters",
  filters: {
    audience: { label: "Audience", enabled: true },
    purpose: { label: "Purpose", enabled: true },
    material: { label: "Material", enabled: true },
    priceBand: { label: "Price", enabled: true },
  },
};

const clamp = (n, min, max) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return min;
  return Math.max(min, Math.min(max, v));
};

export async function GET() {
  const base = process.env.COACH_BASE_URL;
  if (!base) {
    return Response.json({ ok: false, error: "Missing COACH_BASE_URL" }, { status: 500 });
  }

  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/coach/shop-config/search`, {
      cache: "no-store",
    });
    const data = await res.json();

    const merged = { ...DEFAULT_CONFIG, ...(data || {}) };
    merged.visibleCount = clamp(merged.visibleCount, 1, 30);
    merged.filters = { ...DEFAULT_CONFIG.filters, ...(merged.filters || {}) };
    for (const k of Object.keys(DEFAULT_CONFIG.filters)) {
      merged.filters[k] = { ...DEFAULT_CONFIG.filters[k], ...(merged.filters[k] || {}) };
      merged.filters[k].enabled = Boolean(merged.filters[k].enabled);
      merged.filters[k].label = String(merged.filters[k].label || DEFAULT_CONFIG.filters[k].label);
    }

    return Response.json(merged, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return Response.json(
      { ok: true, ...DEFAULT_CONFIG, note: "Falling back to defaults; Coach unreachable.", error: String(e) },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }
}
