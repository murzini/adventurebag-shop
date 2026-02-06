"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FlaskConical, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { fade } from "../../lib/prototype/fade";

// Milestone 3 Student flow (UI-only), styled like Milestone 2.
// Steps: pick hypothesis -> configure test -> start simulation.

export function ABTestPlaceholder({ onBack, onStartExperiment }) {
  const problems = useMemo(
    () => [
      {
        id: "p1",
        title: "Low checkout completion",
        description: "Many students drop during the 4-step checkout.",
        hypotheses: [
          {
            id: "h1",
            title: "Shorten checkout",
            description: "If we reduce steps from 4 to 2, completion increases because friction decreases.",
          },
          {
            id: "h2",
            title: "Add trust signals",
            description: "If we add delivery+returns clarity, completion increases because users feel safer.",
          },
        ],
      },
      {
        id: "p2",
        title: "Low add-to-cart from product page",
        description: "Students browse but don’t commit on the details page.",
        hypotheses: [
          {
            id: "h3",
            title: "Highlight key benefits",
            description: "If we move key benefits above the fold, add-to-cart increases.",
          },
          {
            id: "h4",
            title: "Show social proof",
            description: "If we show reviews near CTA, add-to-cart increases.",
          },
        ],
      },
    ],
    []
  );

  const [step, setStep] = useState("pick"); // pick | config
  const [selected, setSelected] = useState({ problemId: "p1", hypothesisId: "h1" });

  // simple config (UI-only)
  const [traffic, setTraffic] = useState(50);
  const [duration, setDuration] = useState(7);
  const [primaryMetric, setPrimaryMetric] = useState("Checkout completion rate");
  const [notes, setNotes] = useState("");

  const selectedProblem = problems.find((p) => p.id === selected.problemId);
  const selectedHypothesis = selectedProblem?.hypotheses?.find((h) => h.id === selected.hypothesisId);

  const canStart = Boolean(selectedProblem && selectedHypothesis);

  const start = () => {
    if (!canStart) return;
    if (typeof onStartExperiment === "function") onStartExperiment({ selectedProblem, selectedHypothesis, traffic, duration, primaryMetric, notes });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <motion.div {...fade} transition={{ duration: 0.25 }}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Milestone 2</div>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight">Pick a hypothesis</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Choose a hypothesis and configure your A/B test. (UI-only prototype)
            </p>
          </div>

          <Button className="rounded-2xl" variant="outline" onClick={onBack}>
            Back to Welcome
          </Button>
        </div>

        <Card className="mt-8 rounded-3xl shadow-sm">
          <CardContent className="p-10">
            {step === "pick" ? (
              <>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#7BAACB]/[0.25]">
                    <FlaskConical className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold">Choose a problem and hypothesis</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      In Milestone 3, the Student selects what to test before starting the simulation.
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                  {problems.map((p) => (
                    <div key={p.id} className="rounded-3xl border bg-white p-5">
                      <div className="text-sm font-semibold">Problem</div>
                      <div className="mt-2 text-base font-semibold">{p.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{p.description}</div>

                      <div className="mt-5 text-sm font-semibold">Hypotheses</div>
                      <div className="mt-3 grid gap-3">
                        {p.hypotheses.map((h) => {
                          const active = selected.problemId === p.id && selected.hypothesisId === h.id;
                          return (
                            <button
                              key={h.id}
                              type="button"
                              onClick={() => setSelected({ problemId: p.id, hypothesisId: h.id })}
                              className={`w-full rounded-2xl border p-4 text-left transition ${active ? "border-black" : "hover:border-black/40"}`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="text-sm font-semibold">{h.title}</div>
                                  <div className="mt-1 text-sm text-muted-foreground">{h.description}</div>
                                </div>
                                {active ? <CheckCircle2 className="h-5 w-5" /> : null}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-3xl border bg-[#7BAACB]/[0.08] p-5">
                  <div>
                    <div className="text-sm font-semibold">Selected</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {selectedProblem?.title} → {selectedHypothesis?.title}
                    </div>
                  </div>
                  <Button className="rounded-2xl px-6" onClick={() => setStep("config")}
                    disabled={!canStart}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#7BAACB]/[0.25]">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold">Configure the test</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Define traffic split, duration, and primary metric. Then start the simulation.
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                  <div className="rounded-3xl border p-5">
                    <div className="text-sm font-semibold">Traffic split</div>
                    <div className="mt-2 text-sm text-muted-foreground">Control vs Variant ({traffic}% goes to Variant)</div>
                    <input
                      className="mt-4 w-full"
                      type="range"
                      min={10}
                      max={90}
                      step={5}
                      value={traffic}
                      onChange={(e) => setTraffic(Number(e.target.value))}
                    />
                    <div className="mt-2 text-sm">Control: {100 - traffic}% · Variant: {traffic}%</div>
                  </div>

                  <div className="rounded-3xl border p-5">
                    <div className="text-sm font-semibold">Duration (days)</div>
                    <div className="mt-2 text-sm text-muted-foreground">Prototype setting for the simulation.</div>
                    <input
                      className="mt-4 w-full rounded-2xl border px-4 py-3"
                      type="number"
                      min={1}
                      max={30}
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                    />
                  </div>

                  <div className="rounded-3xl border p-5 lg:col-span-2">
                    <div className="text-sm font-semibold">Primary metric</div>
                    <div className="mt-2 text-sm text-muted-foreground">What are you optimizing?</div>
                    <select
                      className="mt-4 w-full rounded-2xl border bg-white px-4 py-3"
                      value={primaryMetric}
                      onChange={(e) => setPrimaryMetric(e.target.value)}
                    >
                      <option>Checkout completion rate</option>
                      <option>Checkout start rate</option>
                      <option>Add-to-cart rate</option>
                      <option>Revenue per visitor</option>
                    </select>

                    <div className="mt-5 text-sm font-semibold">Notes</div>
                    <textarea
                      className="mt-3 w-full rounded-2xl border px-4 py-3"
                      rows={4}
                      placeholder="Optional: what exactly will change in the variant?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-3xl border bg-[#7BAACB]/[0.08] p-5">
                  <Button className="rounded-2xl" variant="outline" onClick={() => setStep("pick")}>
                    Back
                  </Button>
                  <Button className="rounded-2xl px-6" onClick={start}>
                    Start experiment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
