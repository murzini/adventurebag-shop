import { BASE_BACKPACKS } from "./backpacks_meta";

const pad2 = (n) => String(n).padStart(2, "0");

/**
 * Fallback catalog builder for cases where /api/catalog is unavailable.
 * Uses only backpacks_meta.js (no filesystem scan).
 *
 * Important:
 * - baseId is ALWAYS the Base_XX string, for both base items and variations.
 * - variations can be included in backpacks_meta.js (id starts Var_ or isBase:false).
 */
export function buildCatalogItemsFallback() {
  const baseModels = (BASE_BACKPACKS || []).filter((b) => {
    if (!b?.id) return false;
    if (b.isBase === true) return true;
    return String(b.id).startsWith("Base_");
  });

  const baseById = new Map(baseModels.map((b) => [b.id, b]));

  const explicitVars = (BASE_BACKPACKS || []).filter((b) => {
    if (!b?.id) return false;
    if (b.isBase === false) return true;
    return String(b.id).startsWith("Var_");
  }).map((v) => {
    let baseId = v.baseId || null;
    if (!baseId) {
      const m = String(v.id).match(/^Var_(\d{1,2})_/i);
      if (m) baseId = `Base_${pad2(m[1])}`;
    }
    return { ...v, isBase: false, baseId };
  });

  const items = [];
  let idx = 1;

  for (const b of baseModels) {
    const sku = String(idx).padStart(3, "0");
    items.push({
      id: idx,
      sku,
      name: `AdventureBag ${sku}`,
      subtitle: b.model,
      isBase: true,
      baseId: b.id,
      imageUrl: b.imageUrl,
      price: b.price,
      audience: b.audience,
      purpose: b.purpose,
      material: b.material,
      color: b.color,
      priceBand: b.priceBand,
      description: b.description,
    });
    idx += 1;
  }

  for (const v of explicitVars) {
    const base = baseById.get(v.baseId);
    if (!base) continue;
    const sku = String(idx).padStart(3, "0");
    items.push({
      id: idx,
      sku,
      name: `AdventureBag ${sku}`,
      subtitle: v.name || v.model || base.model,
      isBase: false,
      baseId: v.baseId,
      imageUrl: v.imageUrl,
      price: v.price ?? base.price,
      audience: v.audience ?? base.audience,
      purpose: v.purpose ?? base.purpose,
      material: v.material ?? base.material,
      color: v.color ?? base.color,
      priceBand: v.priceBand ?? base.priceBand,
      description: v.description ?? base.description,
    });
    idx += 1;
  }

  return items;
}
