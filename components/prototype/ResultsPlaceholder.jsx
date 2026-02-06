"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { fade } from "../../lib/prototype/fade";

export function ResultsPlaceholder({ onBackToWelcome, onCompleteResults }) {
  const completeAndReturn = () => {
    if (typeof onCompleteResults === "function") onCompleteResults();
    if (typeof onBackToWelcome === "function") onBackToWelcome();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <motion.div {...fade} transition={{ duration: 0.25 }}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Milestone 2</div>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight">Test results</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Placeholder for the next milestone.</p>
          </div>
          <Button className="rounded-2xl" onClick={onBackToWelcome}>
            Back to Welcome
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <Card className="mt-8 rounded-3xl shadow-sm">
          <CardContent className="p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#7BAACB]/[0.25]">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <div className="text-lg font-semibold">Results will appear here</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  In the next milestone we’ll show metrics, confidence, and interpretation guidance.
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border bg-[#7BAACB]/[0.08] p-5">
              <div className="text-sm font-semibold">Complete this step</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Placeholder button: marks “See results” and “Make a conclusion” as completed.
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button className="rounded-2xl px-6" onClick={completeAndReturn}>
                  Mark results reviewed (placeholder)
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
