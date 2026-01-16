"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import { fade } from "../../lib/prototype/fade";
import { BackpackThumb } from "./Shared";

// Some callers use `onBuy`, others use `onCheckout`.
// Support both so the CTA never becomes a no-op.
export function DetailsPage({ item, onBack, onBuy, onCheckout }) {
  const handleCheckout = onBuy || onCheckout;
  if (!item) return null;

  const sku = `AB-${String(item.id).padStart(6, "0")}`;
  const [imgIdx, setImgIdx] = useState(0);
  const seeds = useMemo(() => [0, 1, 2, 3, 4].map((k) => item.id * 101 + k * 17), [item.id]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6">
      <motion.div {...fade} transition={{ duration: 0.25 }}>
        <Button variant="ghost" className="mb-6 px-0 text-sm text-muted-foreground" onClick={onBack}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to search
        </Button>

        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="relative grid grid-cols-[72px_1fr] gap-6">
              <div className="flex flex-col gap-3">
                {seeds.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setImgIdx(i)}
                    aria-label={`Select image ${i + 1}`}
                    className={`aspect-square overflow-hidden rounded-xl bg-black/[0.04] transition ${
                      imgIdx === i ? "ring-2 ring-[#3C5A7D] ring-offset-2" : "hover:bg-black/[0.06]"
                    }`}
                  >
                    <BackpackThumb seed={s} />
                  </button>
                ))}
              </div>

              <div className="relative">
                <div className="absolute inset-0 -z-10 rounded-[2.75rem] bg-gradient-to-b from-[#7BAACB]/[0.22] to-black/[0.02]" />
                <div className="aspect-square overflow-hidden rounded-[2.75rem] bg-transparent">
                  <BackpackThumb seed={seeds[imgIdx]} />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 flex max-w-lg flex-col gap-7">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  {item.forWhat} · {item.material}
                </div>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight">{item.name}</h1>
                <div className="mt-2 text-sm text-muted-foreground">SKU {sku}</div>
              </div>

              <div className="flex items-end justify-between gap-4">
                <div className="text-3xl font-semibold">€{item.price}</div>
                <div className="text-xs text-muted-foreground">Incl. VAT · Shipping calculated next</div>
              </div>

              <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                A rugged everyday backpack built for comfort and smart organization. Designed to move with you — from city to trail.
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-medium">{18 + (item.id % 14)}L</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">For whom</span>
                  <span className="font-medium">{item.forWhom}</span>
                </div>
              </div>

            <Button className="w-full max-w-sm rounded-2xl py-6" onClick={handleCheckout}>
                Buy now
              </Button>

              <div className="pt-6 border-t space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">2–4 business days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Warranty</span>
                  <span className="font-medium">2 years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Returns</span>
                  <span className="font-medium">30 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
