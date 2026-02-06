"use client";


import React from "react";
// Standalone extraction of the “Pick a hypothesis” screen from the uploaded page.jsx.
// Visual prototype only (no backend).

// NOTE: Canvas preview environments sometimes don't have app-level UI components.
// We keep this file self-contained to ensure Preview always runs.

function Button({ className = "", variant, disabled, ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none";
  const styles =
    "bg-black text-white hover:bg-black/90 border border-black";
  return <button className={`${base} ${styles} ${className}`} disabled={disabled} {...props} />;
}

function Card({ className = "", ...props }) {
  return <div className={`rounded-3xl border bg-white shadow-sm ${className}`} {...props} />;
}

function CardContent({ className = "", ...props }) {
  return <div className={`p-6 ${className}`} {...props} />;
}

// Canvas-safe: avoid animation/icon deps that can break Preview in some environments.
const fade = {};

// Minimal icon stubs (keep the same component names used in the UI)
const ArrowRight = ({ className = "" }) => <span className={className}>→</span>;
const Backpack = ({ className = "" }) => <span className={className}>🎒</span>;
const Blocks = ({ className = "" }) => <span className={className}>▦</span>;
const ChevronDown = ({ className = "" }) => <span className={className}>⌄</span>;
const ChevronLeft = ({ className = "" }) => <span className={className}>‹</span>;
const ChevronRight = ({ className = "" }) => <span className={className}>›</span>;
const Eye = ({ className = "" }) => <span className={className}>👁️</span>;
const FlaskConical = ({ className = "" }) => <span className={className}>🧪</span>;
const Trash2 = ({ className = "" }) => <span className={className}>🗑️</span>;


function TopBar() {
  return (
    <div className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button
          onClick={() => {}}
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

        <div className="hidden sm:block text-right">
          <div className="text-sm font-semibold leading-none">Select Problem & Hypothesis</div>
          
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-muted-foreground">
            <FlaskConical className="h-3.5 w-3.5" />
            A/B test
          </span>
        </div>
      </div>
    </div>
  );
}

function IconButton({ title, onClick, children, danger }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl border bg-white transition hover:bg-black/[0.03] active:scale-[0.99] ${
        danger ? "hover:bg-red-50" : ""
      }`}
    >
      {children}
    </button>
  );
}

function PlaceholderHypImage({ label }) {
  return (
    <div
      className="relative h-56 w-full overflow-hidden rounded-3xl border"
      style={{
        background:
          "linear-gradient(135deg, rgba(60,90,125,0.14) 0%, rgba(123,170,203,0.16) 40%, rgba(0,0,0,0.02) 100%)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-3xl border bg-white px-5 py-3 text-sm text-black/70 shadow-sm">
          <Eye className="h-5 w-5" />
          {label}
        </div>
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <div className="rounded-full border bg-white/80 px-4 py-3 text-xs text-black/45 backdrop-blur">
          Placeholder image (coach-provided later)
        </div>
      </div>
    </div>
  );
}

function ABTestHypothesesFromScreenshot({ onChooseHypothesis, onBackToWelcome }) {
  // Student-facing: pick a Problem, then pick a Hypothesis within it.
  const [problems] = React.useState([
    {
      id: "p1",
      title: "Low checkout completion",
      hypotheses: [
        {
          id: "h1",
          title: "Shorten checkout",
          desc: "If we reduce steps from 4 to 2, completion increases because friction decreases.",
          imgLabel: "Checkout steps mock",
        },
        {
          id: "h2",
          title: "Stronger trust signals",
          desc: "If we add delivery & returns reassurance, completion increases because anxiety drops.",
          imgLabel: "Trust badges mock",
        },
      ],
    },
    {
      id: "p2",
      title: "Low product detail engagement",
      hypotheses: [
        {
          id: "h3",
          title: "Better hero images",
          desc: "If we upgrade the first image and add zoom, add-to-cart increases because clarity improves.",
          imgLabel: "Product hero mock",
        },
        {
          id: "h4",
          title: "Show delivery fees earlier",
          desc: "If we display delivery costs on details page, drop-off decreases because expectations are set.",
          imgLabel: "Delivery fees mock",
        },
      ],
    },
  ]);

  const [openProblemId, setOpenProblemId] = React.useState("p1");
  const [activeHypByProblem, setActiveHypByProblem] = React.useState({ p1: "h1", p2: "h3" });

  const openProblem = problems.find((p) => p.id === openProblemId) || problems[0];
  const activeHypId = activeHypByProblem[openProblem.id] || openProblem.hypotheses[0]?.id;
  const activeHyp = openProblem.hypotheses.find((h) => h.id === activeHypId) || openProblem.hypotheses[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight">Select Problem & Hypothesis</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Choose one hypothesis to test.</p>
          </div>
          <Button variant="outline" className="rounded-2xl" onClick={onBackToWelcome}>
            Back to Welcome
          </Button>
        </div>

        <Card className="mt-8 rounded-3xl shadow-sm">
          <CardContent className="p-8">
            <div className="text-xs text-muted-foreground">Problems</div>

            <div className="mt-6 grid gap-4">
              {problems.map((p) => {
                const open = p.id === openProblemId;
                const count = p.hypotheses.length;
                const selectedHypId = activeHypByProblem[p.id] || p.hypotheses[0]?.id;
                const selectedHyp = p.hypotheses.find((h) => h.id === selectedHypId) || p.hypotheses[0];

                return (
                  <div key={p.id} className="rounded-[2rem] border bg-white">
                    <button
                      className="flex w-full items-start justify-between gap-3 px-6 py-5"
                      onClick={() => setOpenProblemId(p.id)}
                      aria-expanded={open}
                      type="button"
                    >
                      <div className="flex-1 text-left">
                        <div className="text-2xl font-semibold tracking-tight">{p.title}</div>
                        <div className="mt-2 text-sm text-muted-foreground">{count} hypotheses</div>
                      </div>
                      <span className={`rounded-2xl border bg-white p-2 ${open ? "shadow-sm" : ""}`}>
                        <ChevronDown className={`h-4 w-4 text-black/70 transition ${open ? "rotate-180" : ""}`} />
                      </span>
                    </button>

                    {open ? (
                      <div className="px-6 pb-6">
                        <div className="rounded-3xl border bg-white p-6">
                          <div className="text-xs text-muted-foreground">Hypothesis</div>
                          <div className="mt-2 text-xl font-semibold tracking-tight">
                            <span className="text-muted-foreground">Hypothesis {p.hypotheses.findIndex((h) => h.id === selectedHyp.id) + 1}: </span>
                            <span className="text-foreground">{selectedHyp.title}</span>
                          </div>

                          <div className="mt-4 text-base text-black/60">{selectedHyp.desc}</div>

                          <div className="mt-6">
                            <PlaceholderHypImage label={selectedHyp.imgLabel || "Hypothesis image"} />
                          </div>

                          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                              <IconButton
                                title="Previous hypothesis"
                                onClick={() => {
                                  const idx = p.hypotheses.findIndex((h) => h.id === selectedHyp.id);
                                  const prev = (idx - 1 + p.hypotheses.length) % p.hypotheses.length;
                                  setActiveHypByProblem((cur) => ({ ...cur, [p.id]: p.hypotheses[prev].id }));
                                }}
                              >
                                <ChevronLeft className="h-4 w-4 text-black/70" />
                              </IconButton>
                              <IconButton
                                title="Next hypothesis"
                                onClick={() => {
                                  const idx = p.hypotheses.findIndex((h) => h.id === selectedHyp.id);
                                  const next = (idx + 1) % p.hypotheses.length;
                                  setActiveHypByProblem((cur) => ({ ...cur, [p.id]: p.hypotheses[next].id }));
                                }}
                              >
                                <ChevronRight className="h-4 w-4 text-black/70" />
                              </IconButton>
                              <div className="text-sm text-muted-foreground">
                                Hypothesis {p.hypotheses.findIndex((h) => h.id === selectedHyp.id) + 1} of {p.hypotheses.length}
                              </div>
                            </div>

                            <div className="flex-1" />

                            <div className="flex flex-wrap items-center gap-2">
                              <Button
                                className="rounded-2xl px-6"
                                onClick={() =>
                                  onChooseHypothesis({
                                    problemTitle: p.title,
                                    hypothesisIndex: p.hypotheses.findIndex((h) => h.id === selectedHyp.id) + 1,
                                    hypothesisTitle: selectedHyp.title,
                                  })
                                }
                              >
                                Choose this hypothesis
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options, placeholder }) {
  return (
    <div className="grid gap-2">
      <div className="text-sm font-semibold">{label}</div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-2xl border bg-white px-4 py-3 pr-10 text-sm outline-none transition focus:ring-2 focus:ring-black/10"
        >
          <option value="" disabled>
            {placeholder || "Select"}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <ChevronDown className="h-4 w-4 text-black/50" />
        </div>
      </div>
    </div>
  );
}

function RunningExperiment({ seconds = 15, onDone, params }) {
  const [elapsedMs, setElapsedMs] = React.useState(0);
  const startedAtRef = React.useRef(null);

  React.useEffect(() => {
    startedAtRef.current = Date.now();
    const id = window.setInterval(() => {
      const now = Date.now();
      const elapsed = now - (startedAtRef.current || now);
      setElapsedMs(Math.min(elapsed, seconds * 1000));
    }, 80);
    return () => window.clearInterval(id);
  }, [seconds]);

  React.useEffect(() => {
    if (elapsedMs >= seconds * 1000) {
      const t = window.setTimeout(() => onDone?.(), 350);
      return () => window.clearTimeout(t);
    }
  }, [elapsedMs, seconds, onDone]);

  const pct = Math.round((elapsedMs / (seconds * 1000)) * 100);
  const remaining = Math.max(0, seconds - Math.floor(elapsedMs / 1000));

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight">Experiment is running</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Simulating traffic, events, and measurement.
            </p>
          </div>
        </div>

        <Card className="mt-8 rounded-3xl shadow-sm">
          <CardContent className="p-8">
            {params ? (
              <div className="mb-8 rounded-3xl border bg-white p-5">
                <div className="text-xs text-muted-foreground">Parameters</div>
                <div className="mt-2 grid gap-1 text-sm text-black/60">
                  <div><span className="font-semibold text-black/70">Duration:</span> {params.duration} week(s)</div>
                  <div><span className="font-semibold text-black/70">Market:</span> {params.market}</div>
                  <div><span className="font-semibold text-black/70">Split:</span> {params.split}</div>
                </div>
              </div>
            ) : null}

            <div>
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
      </div>
    </div>
  );
}

function ReviewResultsScreen({ onBackToWelcome, onReconfigure, onTestAnotherHypothesis }) {
  const [showRollout, setShowRollout] = React.useState(false);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight">Review results</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Review the outcome of the experiment and decide on next steps.
            </p>
          </div>
        </div>

        <Card className="mt-8 rounded-3xl shadow-sm">
          <CardContent className="p-8">
            <div className="prose prose-sm max-w-none text-muted-foreground min-h-[180px]">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
            <div className="mt-8 min-h-[96px]">
              <div
                className={`rounded-3xl border bg-[#7BAACB]/[0.08] p-5 text-sm text-muted-foreground transition ${
                  showRollout ? "opacity-100" : "opacity-0"
                }`}
                style={{ pointerEvents: showRollout ? "auto" : "none" }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Full rollout details will be configured later. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between min-h-[72px]">
              <div className="text-sm text-muted-foreground">&nbsp;</div>
              <div className="flex flex-wrap justify-end gap-3">
                <Button variant="outline" onClick={onReconfigure}>
                  Re-configure the test
                </Button>
                <Button variant="outline" onClick={onTestAnotherHypothesis}>
                  Test another hypothesis
                </Button>
                <Button onClick={() => setShowRollout(true)}>
                  Full roll out
                </Button>
                <Button variant="ghost" onClick={onBackToWelcome}>
                  Back to Welcome
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ConfigureTestScreen({ chosen, onBack, onRun, onBackToWelcome }) {
  const [duration, setDuration] = React.useState("");
  const [market, setMarket] = React.useState("");
  const [split, setSplit] = React.useState("50/50");

  const ready = Boolean(duration && market && split);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight">Configure the test</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Set the parameters for your experiment. All fields are required.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="rounded-2xl" onClick={onBackToWelcome}>
              Back to Welcome
            </Button>
            <Button variant="outline" className="rounded-2xl" onClick={onBack}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </div>

        <Card className="mt-8 rounded-3xl shadow-sm">
          <CardContent className="p-8">
            <div className="text-xs text-muted-foreground">Selected hypothesis</div>
            <div className="mt-3 rounded-3xl border bg-white p-5">
              <div className="text-sm text-muted-foreground">{chosen?.problemTitle || "Problem"}</div>
              <div className="mt-1 text-2xl font-semibold tracking-tight">
                Hypothesis {chosen?.hypothesisIndex || "—"}: {chosen?.hypothesisTitle || "—"}
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <Select
                label="Duration (weeks)"
                value={duration}
                onChange={setDuration}
                placeholder="Select duration"
                options={[1, 2, 3, 4].map((n) => ({ value: String(n), label: String(n) }))}
              />

              <Select
                label="Market"
                value={market}
                onChange={setMarket}
                placeholder="Select market"
                options={["Ukraine", "Poland", "Germany", "Italy", "France", "Austria"].map((m) => ({
                  value: m,
                  label: m,
                }))}
              />

              <Select
                label="Split (%)"
                value={split}
                onChange={setSplit}
                placeholder="Select split"
                options={[
                  "10/90",
                  "20/80",
                  "30/70",
                  "40/60",
                  "50/50",
                  "60/40",
                  "70/30",
                  "80/20",
                  "90/10",
                ].map((s) => ({ value: s, label: s }))}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground">
                {ready ? "All parameters set." : "Please select all parameters to continue."}
              </div>
              <Button
                className="rounded-2xl px-7"
                disabled={!ready}
                onClick={() => onRun({ duration, market, split })}
              >
                Run the test
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function StudentNewFlow({ onBackToWelcome = () => {}, onStageChange = () => {}, initialStep = 'pick' }) {
  const [step, setStep] = React.useState("pick"); // pick | configure | running | review
  const [chosen, setChosen] = React.useState(null);
  const [testParams, setTestParams] = React.useState(null);

  // Sync internal step from backend stage on refresh/navigation
  React.useEffect(() => {
    if (initialStep && typeof initialStep === "string") {
      setStep(initialStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStep]);

  // When user moves inside the AB-test flow, inform parent/backend
  React.useEffect(() => {
    if (step === "pick") onStageChange("PROBLEM");
    if (step === "configure") onStageChange("TEST_CONFIGURATION");
    if (step === "running") onStageChange("RUN_TEST");
    if (step === "review") onStageChange("REVIEW_RESULTS");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);



  const goPick = () => {
    setStep("pick");
    onStageChange("PROBLEM");
  };

  const goWelcome = () => {
    setStep("pick");
    setChosen(null);
    setTestParams(null);
    onStageChange("WELCOME");
    onBackToWelcome();
  };
  const goReview = () => {
    setStep("review");
    onStageChange("REVIEW_RESULTS");
  };
  const goRunning = (params) => {
    setTestParams(params);
    setStep("running");
    onStageChange("RUN_TEST");
  };
  const goConfigure = (payload) => {
    setChosen(payload);
    setStep("configure");
    onStageChange("TEST_CONFIGURATION");
  };

  return (
    <div className="min-h-screen bg-white">
      <TopBar />

      {step === "pick" ? (
        <ABTestHypothesesFromScreenshot
          onChooseHypothesis={goConfigure}
          onBackToWelcome={goWelcome}
        />
      ) : step === "configure" ? (
        <ConfigureTestScreen
          chosen={chosen}
          onBack={goPick}
          onBackToWelcome={goWelcome}
          onRun={goRunning}
        />
      ) : step === "review" ? (
        <ReviewResultsScreen
          onBackToWelcome={goWelcome}
          onReconfigure={() => {
            setStep("configure");
            onStageChange("TEST_CONFIGURATION");
          }}
          onTestAnotherHypothesis={() => {
            setStep("pick");
            onStageChange("PROBLEM");
          }}
        />
      ) : (
        <RunningExperiment
          seconds={15}
          params={testParams}
          onDone={goReview}
        />
      )}


      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} AdventureBag</div>
        </div>
      </footer>
    </div>
  );
}
