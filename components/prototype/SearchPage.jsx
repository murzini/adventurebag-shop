"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { fade } from "../../lib/prototype/fade";
import { BackpackThumb, Pill } from "./Shared";

export function SearchPage({ items, onSelect, onOpenDetails }) {
  // Backward compatibility:
  // - app/shop uses `onSelect(item)`
  // - older callers used `onOpenDetails(id)`
  const handleSelect = onSelect || onOpenDetails;

  const selectItem = (item) => {
    if (!handleSelect) return;
    if (onSelect) return handleSelect(item);
    return handleSelect(item?.id);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8">
      <motion.div {...fade} transition={{ duration: 0.25 }}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Search</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Browse all backpacks (100). Filters are placeholders — logic comes later.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-2xl border bg-white px-3 py-2 text-xs text-muted-foreground shadow-sm">
              <SlidersHorizontal className="h-4 w-4" />
              Filters (placeholder)
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-5">
                <div className="text-sm font-semibold">Filters</div>
                <div className="mt-1 text-xs text-muted-foreground">UI only — no filtering yet.</div>

                <div className="mt-5 space-y-5">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">For whom</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Pill>Man</Pill>
                      <Pill>Woman</Pill>
                      <Pill>Kid</Pill>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">For what</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Pill>Travel</Pill>
                      <Pill>Mechanical work</Pill>
                      <Pill>Business</Pill>
                      <Pill>Hiking</Pill>
                      <Pill>Sports</Pill>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">Price</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Pill>€0–€49</Pill>
                      <Pill>€50–€79</Pill>
                      <Pill>€80–€119</Pill>
                      <Pill>€120–€179</Pill>
                      <Pill>€180+</Pill>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">Materials</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Pill>Nylon</Pill>
                      <Pill>Polyester</Pill>
                      <Pill>Leather</Pill>
                      <Pill>Canvas</Pill>
                      <Pill>Ripstop</Pill>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-9">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((it) => (
                <button
                  key={it.id}
                  onClick={() => selectItem(it)}
                  className="text-left"
                  aria-label={`Open details for ${it.name}`}
                >
                  <Card className="rounded-3xl shadow-sm transition hover:shadow-md group cursor-pointer">
                    <CardContent className="p-5">
                      <div className="relative">
                        <div className="aspect-square overflow-hidden rounded-2xl border">
                          <BackpackThumb seed={it.id} />
                        </div>
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-black/0 transition group-hover:bg-black/20">
                          <div className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold opacity-0 transition group-hover:opacity-100">
                            View details
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-sm font-semibold">{it.name}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{it.subtitle}</div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm font-semibold">€{it.price}</div>
                        <div className="inline-flex items-center gap-1 rounded-full border bg-white px-3 py-1 text-xs text-muted-foreground">
                          View
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
