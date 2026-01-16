"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Star, Truck } from "lucide-react";
import { Button } from "../ui/button";
import { fade } from "../../lib/prototype/fade";

export function Landing({ onStart }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-10">
      <motion.div {...fade} transition={{ duration: 0.25 }}>
        <section className="relative overflow-hidden rounded-[2.75rem] bg-gradient-to-b from-[#7BAACB]/[0.22] to-black/[0.02] px-8 py-24 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-6xl font-semibold tracking-tight">Travel better with AdventureBag</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Thoughtfully designed backpacks for work, travel, and everyday movement. Built to last, easy to choose,
              and made to fit your life.
            </p>
            <div className="mt-10 flex justify-center">
              <Button onClick={onStart} className="rounded-2xl px-8 py-6 text-base">
                Shop backpacks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-24">
          <h2 className="text-3xl font-semibold tracking-tight text-center">Find your perfect backpack</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {["Travel", "Business", "Hiking", "Sports", "Kids"].map((label) => (
              <button
                key={label}
                onClick={onStart}
                className="group rounded-3xl border bg-white p-6 text-left transition hover:shadow-md"
              >
                <div className="text-lg font-semibold">{label}</div>
                <div className="mt-2 text-sm text-muted-foreground">Explore backpacks built for {label.toLowerCase()}.</div>
                <div className="mt-4 inline-flex items-center text-sm font-semibold text-[#3C5A7D]">
                  Browse
                  <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-24 grid gap-8 md:grid-cols-3">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#3C5A7D] text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-semibold">Built to last</div>
              <div className="mt-1 text-sm text-muted-foreground">Durable materials and reliable construction.</div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#3C5A7D] text-white">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-semibold">Fast delivery</div>
              <div className="mt-1 text-sm text-muted-foreground">Quick, trackable shipping options.</div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#3C5A7D] text-white">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-semibold">Loved by owners</div>
              <div className="mt-1 text-sm text-muted-foreground">Comfort-first designs used every day.</div>
            </div>
          </div>
        </section>

        <section className="mt-28 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Explore our backpacks</h2>
          <p className="mt-3 text-sm text-muted-foreground">Browse all models and find the one that fits you best.</p>
          <div className="mt-10 flex justify-center">
            <Button variant="outline" className="rounded-2xl px-8 py-5" onClick={onStart}>
              View all backpacks
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
