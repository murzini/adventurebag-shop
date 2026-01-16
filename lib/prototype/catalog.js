export function buildCatalogItems() {
  const forWhom = ["Man", "Woman", "Kid"];
  const forWhat = ["Travel", "Mechanical work", "Business", "Hiking", "Sports"];
  const materials = ["Nylon", "Polyester", "Leather", "Canvas", "Ripstop"];
  const pick = (arr, i) => arr[i % arr.length];

  return Array.from({ length: 100 }).map((_, idx) => {
    const id = idx + 1;
    const fw = pick(forWhat, id * 3);
    const whom = pick(forWhom, id * 7);
    const mat = pick(materials, id * 11);

    const base = 49 + (id % 10) * 8;
    const uplift =
      fw === "Business" ? 20 : fw === "Mechanical work" ? 10 : fw === "Hiking" ? 15 : 0;
    const price = Math.min(199, base + uplift);

    return {
      id,
      name: `AdventureBag ${String(id).padStart(3, "0")}`,
      subtitle: `${fw} · ${mat} · ${whom}`,
      price,
      forWhom: whom,
      forWhat: fw,
      material: mat,
    };
  });
}
