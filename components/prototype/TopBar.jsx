"use client";

import React from "react";
import { Backpack } from "lucide-react";
import { routes } from "../../lib/prototype/routes";

export function TopBar({ onGoHome, route, mode }) {
  return (
    <div className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button
          onClick={onGoHome}
          className="group flex items-center gap-2 rounded-2xl px-2 py-1 transition hover:bg-black/5"
          aria-label="Go to Welcome"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#3C5A7D] text-white shadow-sm">
            <Backpack className="h-5 w-5" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold leading-none">AdventureBag</div>
            <div className="text-xs text-muted-foreground">Student training prototype</div>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-xs text-muted-foreground">
            {mode === "wizard" ? "Student wizard" : "Shop tour"} ·{" "}
            {route === routes.welcome
              ? "Welcome"
              : route === routes.landing
                ? "Landing"
                : route === routes.search
                  ? "Search"
                  : route === routes.details
                    ? "Details"
                    : route === routes.checkout
                      ? "Checkout"
                      : route === routes.thankyou
                        ? "Thank you"
                        : route === routes.abtest
                          ? "A/B test"
                          : route === routes.running
                            ? "Running"
                            : "Results"}
          </div>
        </div>
      </div>
    </div>
  );
}
