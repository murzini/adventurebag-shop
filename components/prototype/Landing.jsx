"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Star, Truck } from "lucide-react";
import { Button } from "../ui/button";
import { fade } from "../../lib/prototype/fade";

export function Landing({ onStart }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:pb-24 sm:pt-10">
      <motion.div {...fade} transition={{ duration: 0.25 }}>
        <section className="relative overflow-hidden rounded-[2.75rem] bg-gradient-to-b from-[#7BAACB]/[0.22] to-black/[0.02] px-6 py-14 text-center sm:px-8 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Travel better with AdventureBag
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
              Thoughtfully designed backpacks for work, travel, and everyday movement. Built to last, easy to choose,
              and made to fit your life.
            </p>

            <div className="mt-8 flex justify-center sm:mt-10">
              <Button onClick={onStart} className="h-12 rounded-2xl px-7 text-base sm:h-auto sm:px-8 sm:py-6">
                Shop backpacks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-14 sm:mt-24">
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">Find your perfect backpack</h2>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-5">
            {["Travel", "Business", "Hiking", "Sports", "Kids"].map((label) => (
              <button
                key={label}
                onClick={onStart}
                className="group rounded-3xl border bg-white p-5 text-left transition hover:shadow-md sm:p-6"
              >
                <div className="text-base font-semibold sm:text-lg">{label}</div>
                <div className="mt-2 text-sm text-muted-foreground">Explore backpacks built for {label.toLowerCase()}.</div>
                <div className="mt-4 inline-flex items-center text-sm font-semibold text-[#3C5A7D]">
                  Browse
                  <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-8 md:mt-24 md:grid-cols-3">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-[#3C5A7D] text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-semibold">Built to last</div>
              <div className="mt-1 text-sm text-muted-foreground">Durable materials and reliable construction.</div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-[#3C5A7D] text-white">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-semibold">Fast delivery</div>
              <div className="mt-1 text-sm text-muted-foreground">Quick, trackable shipping options.</div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-[#3C5A7D] text-white">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-semibold">Loved by owners</div>
              <div className="mt-1 text-sm text-muted-foreground">Comfort-first designs used every day.</div>
            </div>
          </div>
        </section>

        <section className="mt-16 text-center sm:mt-28">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Explore our backpacks</h2>
          <p className="mt-3 text-sm text-muted-foreground">Browse all models and find the one that fits you best.</p>
          <div className="mt-8 flex justify-center sm:mt-10">
            <Button variant="outline" className="h-12 rounded-2xl px-7 sm:h-auto sm:px-8 sm:py-5" onClick={onStart}>
              View all backpacks
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
