"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, CreditCard, Lock, ShieldCheck, Truck, Smartphone } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { fade } from "../../lib/prototype/fade";
import { StepPill } from "./Shared";

const FEES = {
  novaPoshta: 3.5,
  courierKyiv: 5.0,
  pickup: 0,
  cardExtra: 1.5,
  gpayExtra: 1.0,
};

// Support legacy props to avoid runtime crashes.
export function CheckoutFlow({ item, step, setStep, onStep, onBackToDetails, onFinish, onDone }) {
  const finish = onDone || onFinish;
  const setStageStep = setStep || onStep;

  const go = (next) => {
    if (typeof setStageStep === "function") setStageStep(next);
  };

  const safeStep = ["customize", "delivery", "pay"].includes(step) ? step : "customize";

  const [custom, setCustom] = useState({ color: "Black", monogram: "", straps: "Standard", cover: false });
  const [delivery, setDelivery] = useState("novaPoshta");
  const [payment, setPayment] = useState("wire");
  const [email, setEmail] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });

  // Prevent focus loss on mobile when parent containers re-render.
  const [activeField, setActiveField] = useState(null);

  // Mobile: show/hide order summary instead of forcing a two-column layout.
  const [showSummary, setShowSummary] = useState(false);

  const deliveryFee =
    delivery === "novaPoshta" ? FEES.novaPoshta : delivery === "courierKyiv" ? FEES.courierKyiv : FEES.pickup;
  const payFee = payment === "card" ? FEES.cardExtra : payment === "gpay" ? FEES.gpayExtra : 0;
  const base = item ? Number(item.price || 0) : 0;
  const total = (base + deliveryFee + payFee).toFixed(2);

  const heroSrc = useMemo(() => {
    if (!item) return null;
    if (item.imageUrl) return item.imageUrl;
    const baseId = item.baseId || item.id;
    if (!baseId) return null;
    return `/backpacks/${baseId}.jpg`;
  }, [item]);

  const stepMeta = useMemo(() => {
    if (safeStep === "customize")
      return { n: 1, title: "Customize your backpack", sub: "Make it yours — quick choices, no surprises." };
    if (safeStep === "delivery")
      return { n: 2, title: "Choose Delivery", sub: "Pick the delivery method that works best for you." };
    return { n: 3, title: "Pay & Finish", sub: "Choose a payment method to complete the order." };
  }, [safeStep]);

  const StickyInput = ({ id, value, onChange, className = "", onBlur, ...rest }) => {
    const ref = useRef(null);

    useEffect(() => {
      if (activeField !== id) return;
      // If a re-render stole focus, restore it.
      if (ref.current && document.activeElement !== ref.current) {
        ref.current.focus({ preventScroll: true });
        try {
          const len = (ref.current.value || "").length;
          ref.current.setSelectionRange?.(len, len);
        } catch {}
      }
    }, [activeField, id, value]);

    return (
      <input
        ref={ref}
        value={value}
        onChange={onChange}
        onFocus={() => setActiveField(id)}
        onBlur={(e) => {
          // Only clear if we're still the active field.
          if (activeField === id) setActiveField(null);
          if (onBlur) onBlur(e);
        }}
        // Prevent parent "selectable rows" or cards from stealing focus on pointer events.
        onPointerDownCapture={(e) => e.stopPropagation()}
        onClickCapture={(e) => e.stopPropagation()}
        className={className}
        {...rest}
      />
    );
  };


  const TrustChip = ({ icon: Icon, label, tone }) => {
    const tones = {
      green: "bg-emerald-50 text-emerald-800 border-emerald-100",
      blue: "bg-sky-50 text-sky-800 border-sky-100",
      violet: "bg-violet-50 text-violet-800 border-violet-100",
    };
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
          tones[tone] || tones.blue
        }`}
      >
        <Icon className="h-4 w-4" />
        {label}
      </span>
    );
  };

  const PaymentMarks = ({ kind }) => {
    if (kind === "gpay") {
      return <img src="/payments/GogolePay.png" alt="Google Pay" className="h-9 w-auto" />;
    }
    if (kind === "card") {
      return (
        <div className="flex items-center gap-2">
          <img src="/payments/Visa.png" alt="Visa" className="h-6 w-auto" />
          <img src="/payments/Master_card.png" alt="Mastercard" className="h-6 w-auto" />
          <img src="/payments/Maestro.svg" alt="Maestro" className="h-6 w-auto" />
        </div>
      );
    }
    return null;
  };

  /**
   * Mobile UX: keep actions visible while scrolling (sticky) and avoid layout jumps.
   * Desktop UX: normal footer inside the card.
   */
  const ActionBar = ({ left, right }) => {
    return (
      <div className="mt-10 lg:mt-auto lg:pt-8">
        <div
          className={
            "sticky bottom-3 z-10 rounded-2xl border bg-white/85 p-3 backdrop-blur " +
            "supports-[padding:env(safe-area-inset-bottom)]:pb-[calc(env(safe-area-inset-bottom)+12px)] " +
            "lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-0"
          }
        >
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
            <div className="h-12">{left ? left : <div className="h-12 w-full opacity-0 pointer-events-none" />}</div>
            <div className="h-12">{right}</div>
          </div>
        </div>
      </div>
    );
  };

  const LeftCard = ({ children }) => {
    // Benchmark height: keep ALL steps at least as tall as Customize (prevents jumping).
    // Extra bottom padding on mobile so the sticky ActionBar never covers content.
    return (
      <Card className="rounded-3xl shadow-sm">
        <CardContent className="flex min-h-[860px] flex-col p-6 pb-28 lg:p-8 lg:pb-8">{children}</CardContent>
      </Card>
    );
  };

  // Safe selectable wrapper: ignores clicks coming from inputs/buttons/labels inside.
  const SelectableRow = ({ selected, onSelect, children }) => {
    const isInteractive = (el) => el && el.closest && el.closest("input,textarea,select,button,a,label");

    return (
      <div
        role="button"
        tabIndex={0}
        onMouseDown={(e) => {
          // Don't steal focus from inputs
          if (isInteractive(e.target)) return;
          onSelect();
        }}
        onKeyDown={(e) => {
          // Only trigger when the row itself is focused (not an inner element)
          if (e.target !== e.currentTarget) return;
          if (e.key === "Enter" || e.key === " ") onSelect();
        }}
        className={`w-full rounded-3xl border px-6 py-5 text-left transition cursor-pointer select-none ${
          selected ? "border-[#0B1A33] ring-1 ring-[#0B1A33]" : "bg-white hover:bg-muted/40"
        }`}
      >
        {children}
      </div>
    );
  };

  const SummaryCard = () => {
    return (
      <Card className="rounded-3xl shadow-sm">
        <CardContent className="p-4">
          <div className="text-sm font-semibold">Order summary</div>

          {item ? (
            <div className="mt-3 flex items-center gap-3">
              <div className="h-20 w-20 overflow-hidden rounded-2xl border bg-muted/30 flex items-center justify-center">
                {heroSrc ? <img src={heroSrc} alt={item.name} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{item.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">SKU AB-{String(item.id).padStart(6, "0")}</div>
              </div>
              <div className="text-sm font-semibold">€{item.price}</div>
            </div>
          ) : null}

          <div className="mt-4 space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Delivery</div>
              <div className="font-semibold">€{deliveryFee.toFixed(2)}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Payment fee</div>
              <div className="font-semibold">€{payFee.toFixed(2)}</div>
            </div>
            <div className="mt-2 flex items-center justify-between border-t pt-3">
              <div className="text-muted-foreground">Total</div>
              <div className="text-lg font-semibold">€{total}</div>
            </div>
          </div>

          <div className="mt-4 rounded-3xl bg-muted/30 p-4 text-sm">
            <div className="font-semibold">Selected options</div>
            <div className="mt-2 space-y-1 text-muted-foreground">
              <div>
                Color: <span className="text-foreground">{custom.color}</span>
              </div>
              <div>
                Straps: <span className="text-foreground">{custom.straps}</span>
              </div>
              <div>
                Monogram: <span className="text-foreground">{custom.monogram ? custom.monogram : "—"}</span>
              </div>
              <div>
                Waterproof: <span className="text-foreground">{custom.cover ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8">
      <motion.div {...fade} transition={{ duration: 0.25 }}>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <StepPill active={safeStep === "customize"}>Customize</StepPill>
          <StepPill active={safeStep === "delivery"}>Choose Delivery</StepPill>
          <StepPill active={safeStep === "pay"}>Pay & Finish</StepPill>
        </div>

        {/* MOBILE: Summary is optional (toggle), so the main flow stays single-column */}
        <div className="mt-4 lg:hidden">
          <button
            type="button"
            onClick={() => setShowSummary((v) => !v)}
            className="w-full rounded-2xl border bg-white px-4 py-3 text-left text-sm flex items-center justify-between"
          >
            <span className="font-semibold">Order summary</span>
            <span className="text-muted-foreground">{showSummary ? "Hide" : `Show · €${total}`}</span>
          </button>

          {showSummary ? (
            <div className="mt-4">
              <SummaryCard />
            </div>
          ) : null}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* MAIN COLUMN */}
          <div className="col-span-12 lg:col-span-7">
            {safeStep === "customize" ? (
              <LeftCard>
                <div className="text-xs text-muted-foreground">Checkout · Step {stepMeta.n}</div>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight">{stepMeta.title}</h3>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">{stepMeta.sub}</p>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <TrustChip icon={Truck} label="Fast delivery" tone="blue" />
                  <TrustChip icon={ShieldCheck} label="30-day returns" tone="green" />
                  <TrustChip icon={Lock} label="Secure checkout" tone="violet" />
                </div>

                <div className="mt-10 space-y-8">
                  <div>
                    <div className="text-sm font-semibold">Color</div>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {["Black", "Sand", "Forest", "Navy"].map((c) => (
                        <button
                          type="button"
                          key={c}
                          onClick={() => setCustom((v) => ({ ...v, color: c }))}
                          className={`rounded-full border px-5 py-2 text-sm transition ${
                            custom.color === c ? "bg-[#0B1A33] text-white border-[#0B1A33]" : "bg-white hover:bg-muted"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold">Shoulder straps</div>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {["Standard", "Extra padded"].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setCustom((v) => ({ ...v, straps: s }))}
                          className={`rounded-full border px-5 py-2 text-sm transition ${
                            custom.straps === s ? "bg-[#0B1A33] text-white border-[#0B1A33]" : "bg-white hover:bg-muted"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold">Monogram (optional)</div>
                    <StickyInput id="custom_monogram"
                      value={custom.monogram}
                      onChange={(e) => setCustom((v) => ({ ...v, monogram: e.target.value }))}
                      placeholder="e.g., MAX"
                      className="mt-3 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0B1A33]/30"
                      maxLength={10}
                    />
                    <div className="mt-2 text-xs text-muted-foreground">Up to 10 characters.</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCustom((v) => ({ ...v, cover: !v.cover }))}
                    className="flex w-full items-center justify-between rounded-3xl border bg-white px-6 py-5 text-left hover:bg-muted/40"
                  >
                    <div>
                      <div className="text-sm font-semibold">Add waterproof cover</div>
                      <div className="mt-1 text-xs text-muted-foreground">Extra protection for rain.</div>
                    </div>
                    <div
                      className={`h-6 w-6 rounded-md border flex items-center justify-center ${
                        custom.cover ? "bg-[#0B1A33] border-[#0B1A33]" : "bg-white"
                      }`}
                    >
                      {custom.cover ? <div className="h-2.5 w-2.5 rounded-sm bg-white" /> : null}
                    </div>
                  </button>
                </div>

                <ActionBar
                  left={null}
                  right={
                    <Button
                      className="h-12 w-full rounded-2xl bg-[#0B1A33] hover:bg-[#0B1A33]/90"
                      onClick={() => go("delivery")}
                    >
                      Choose delivery <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  }
                />
              </LeftCard>
            ) : null}

            {safeStep === "delivery" ? (
              <LeftCard>
                <div className="text-xs text-muted-foreground">Checkout · Step {stepMeta.n}</div>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight">{stepMeta.title}</h3>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">{stepMeta.sub}</p>

                <div className="mt-6 space-y-4">
                  <button
                    type="button"
                    onClick={() => setDelivery("novaPoshta")}
                    className={`w-full rounded-3xl border px-6 py-5 text-left transition ${
                      delivery === "novaPoshta"
                        ? "bg-[#0B1A33] text-white border-[#0B1A33]"
                        : "bg-white hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <img
                          src="/delivery/Nova_Poshta_2022_logo.png"
                          alt="Nova Poshta"
                          className="mt-1 h-7 w-auto rounded-sm bg-white p-1"
                        />
                        <div>
                          <div className="text-sm font-semibold">NovaPoshta</div>
                          <div
                            className={`mt-1 text-xs ${
                              delivery === "novaPoshta" ? "text-white/80" : "text-muted-foreground"
                            }`}
                          >
                            To your chosen branch / parcel locker.
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold">€{FEES.novaPoshta.toFixed(2)}</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDelivery("courierKyiv")}
                    className={`w-full rounded-3xl border px-6 py-5 text-left transition ${
                      delivery === "courierKyiv"
                        ? "bg-[#0B1A33] text-white border-[#0B1A33]"
                        : "bg-white hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold">Our courier delivery</div>
                        <div
                          className={`mt-1 text-xs ${
                            delivery === "courierKyiv" ? "text-white/80" : "text-muted-foreground"
                          }`}
                        >
                          Kyiv only.
                        </div>
                      </div>
                      <div className="text-sm font-semibold">€{FEES.courierKyiv.toFixed(2)}</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDelivery("pickup")}
                    className={`w-full rounded-3xl border px-6 py-5 text-left transition ${
                      delivery === "pickup" ? "bg-[#0B1A33] text-white border-[#0B1A33]" : "bg-white hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold">Pick-up from our office in Kyiv</div>
                        <div
                          className={`mt-1 text-xs ${
                            delivery === "pickup" ? "text-white/80" : "text-muted-foreground"
                          }`}
                        >
                          Schedule after purchase.
                        </div>
                      </div>
                      <div className="text-sm font-semibold">Free</div>
                    </div>
                  </button>
                </div>

                <ActionBar
                  left={
                    <Button variant="outline" className="h-12 w-full rounded-2xl" onClick={() => go("customize")}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  }
                  right={
                    <Button className="h-12 w-full rounded-2xl bg-[#0B1A33] hover:bg-[#0B1A33]/90" onClick={() => go("pay")}>
                      Pay & Finish <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  }
                />
              </LeftCard>
            ) : null}

            {safeStep === "pay" ? (
              <LeftCard>
                <div className="text-xs text-muted-foreground">Checkout · Step {stepMeta.n}</div>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight">{stepMeta.title}</h3>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">{stepMeta.sub}</p>

                <div className="mt-6 space-y-4">
                  <SelectableRow selected={payment === "card"} onSelect={() => setPayment("card")}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-10 w-10 rounded-2xl border bg-white flex items-center justify-center">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold">Credit Card</div>
                          <div className="mt-2">
                            <PaymentMarks kind="card" />
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">+€{FEES.cardExtra.toFixed(2)}</div>
                    </div>
                  </SelectableRow>

                  {payment === "card" ? (
                    <div className="rounded-3xl border bg-white px-6 py-5">
                      <div className="grid gap-3">
                        <StickyInput id="card_number"
                          value={card.number}
                          onChange={(e) => setCard((v) => ({ ...v, number: e.target.value }))}
                          placeholder="Card number"
                          className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0B1A33]/30"
                          inputMode="numeric"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <StickyInput id="card_expiry"
                            value={card.expiry}
                            onChange={(e) => setCard((v) => ({ ...v, expiry: e.target.value }))}
                            placeholder="MM/YY"
                            className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0B1A33]/30"
                            inputMode="numeric"
                          />
                          <StickyInput id="card_cvc"
                            value={card.cvc}
                            onChange={(e) => setCard((v) => ({ ...v, cvc: e.target.value }))}
                            placeholder="CVC"
                            className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0B1A33]/30"
                            inputMode="numeric"
                          />
                        </div>
                        <StickyInput id="card_name"
                          value={card.name}
                          onChange={(e) => setCard((v) => ({ ...v, name: e.target.value }))}
                          placeholder="Name on card"
                          className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0B1A33]/30"
                        />
                      </div>
                    </div>
                  ) : null}

                  <SelectableRow selected={payment === "gpay"} onSelect={() => setPayment("gpay")}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-10 w-10 rounded-2xl border bg-white flex items-center justify-center">
                          <Smartphone className="h-5 w-5" />
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="text-sm font-semibold">Google Pay</div>

                          <div className="inline-flex items-center">
                            <div className="rounded-md border bg-white px-3 py-2 shadow-sm">
                              <PaymentMarks kind="gpay" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">+€{FEES.gpayExtra.toFixed(2)}</div>
                    </div>
                  </SelectableRow>

                  <SelectableRow selected={payment === "wire"} onSelect={() => setPayment("wire")}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-10 w-10 rounded-2xl border bg-white flex items-center justify-center">
                          <ShieldCheck className="h-5 w-5" />
                        </div>

                        <div className="flex-1">
                          <div className="text-sm font-semibold">Wire transfer</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            We’ll send banking details to your email and wait up to 3 business days before finalizing the order.
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">No extra fee</div>
                    </div>
                  </SelectableRow>

                  {payment === "wire" ? (
                    <div className="rounded-3xl border bg-white px-6 py-5">
                      <div className="text-xs text-muted-foreground">Email address</div>
                      <StickyInput id="wire_email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0B1A33]/30"
                      />
                    </div>
                  ) : null}
                </div>

                <div className="mt-6 text-xs text-muted-foreground">Charges are simulated in the prototype.</div>

                <ActionBar
                  left={
                    <Button variant="outline" className="h-12 w-full rounded-2xl" onClick={() => go("delivery")}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  }
                  right={
                    <Button className="h-12 w-full rounded-2xl bg-[#0B1A33] hover:bg-[#0B1A33]/90" onClick={finish}>
                      <Lock className="mr-2 h-4 w-4" />
                      Pay €{total} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  }
                />
              </LeftCard>
            ) : null}
          </div>

          {/* DESKTOP SUMMARY COLUMN ONLY */}
          <div className="hidden lg:block lg:col-span-5">
            <SummaryCard />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
