"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { fade } from "../../lib/prototype/fade";

export function RunningExperiment({ seconds = 15, onDone }) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const startedAtRef = useRef(null);

  useEffect(() => {
    startedAtRef.current = Date.now();
    const id = window.setInterval(() => {
      const now = Date.now();
      const elapsed = now - (startedAtRef.current || now);
      setElapsedMs(Math.min(elapsed, seconds * 1000));
    }, 80);

    return () => window.clearInterval(id);
  }, [seconds]);

  useEffect(() => {
    if (elapsedMs >= seconds * 1000) {
      const t = window.setTimeout(() => onDone(), 350);
      return () => window.clearTimeout(t);
    }
  }, [elapsedMs, seconds, onDone]);

  const pct = Math.round((elapsedMs / (seconds * 1000)) * 100);
  const remaining = Math.max(0, seconds - Math.floor(elapsedMs / 1000));

  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <motion.div {...fade} transition={{ duration: 0.25 }}>
        <Card className="rounded-3xl shadow-sm">
          <CardContent className="p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#7BAACB]/[0.25]">
                <FlaskConical className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm font-semibold">Experiment is running</div>
                <div className="mt-1 text-xs text-muted-foreground">Simulating traffic, events, and measurement…</div>
              </div>
            </div>

            <div className="mt-10">
              <div className="flex items-center justify-between text-sm">
                <div className="font-semibold">Progress</div>
                <div className="text-muted-foreground">{pct}%</div>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/10">
                <div className="h-3 bg-[#3C5A7D] transition-all" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-3 text-xs text-muted-foreground">Estimated time remaining: {remaining}s</div>
            </div>

            <div className="mt-10 rounded-3xl border bg-[#7BAACB]/[0.08] p-5">
              <div className="text-xs text-muted-foreground">What’s happening (simulated)</div>
              <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                <li>Assigning users to variants</li>
                <li>Collecting funnel events</li>
                <li>Computing conversion deltas</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
