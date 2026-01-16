"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, CreditCard, Lock, Smartphone } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { fade } from "../../lib/prototype/fade";
import { BackpackThumb, StepPill } from "./Shared";

const FEES = {
  novaPoshta: 3.5,
  courierKyiv: 5.0,
  pickup: 0,
  cardExtra: 1.5,
  gpayExtra: 1.0,
};

// NOTE: parent page historically passed `onStep`; this component originally expected `setStep`.
// Support both to avoid runtime crashes (Next dev overlay “1 error”).
// NOTE: some callers use `onDone` instead of `onFinish`.
export function CheckoutFlow({ item, step, setStep, onStep, onBackToDetails, onFinish, onDone }) {
  const finish = onDone || onFinish;
  const setStageStep = setStep || onStep;
  const go = (next) => {
    if (typeof setStageStep === "function") setStageStep(next);
  };
  // Guard against accidental invalid/undefined step values
  const safeStep = ["customize", "delivery", "pay"].includes(step) ? step : "customize";

  const [custom, setCustom] = useState({ color: "Black", monogram: "", straps: "Standard", cover: false });
  const [delivery, setDelivery] = useState("novaPoshta");
  const [payment, setPayment] = useState("wire");
  const [email, setEmail] = useState("");

  const deliveryFee =
    delivery === "novaPoshta" ? FEES.novaPoshta : delivery === "courierKyiv" ? FEES.courierKyiv : FEES.pickup;
  const payFee = payment === "card" ? FEES.cardExtra : payment === "gpay" ? FEES.gpayExtra : 0;
  const base = item ? item.price : 0;
  const total = (base + deliveryFee + payFee).toFixed(2);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8">
      <motion.div {...fade} transition={{ duration: 0.25 }}>
        <Button variant="outline" className="rounded-2xl" onClick={onBackToDetails}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to details
        </Button>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <StepPill active={safeStep === "customize"}>Customize</StepPill>
          <StepPill active={safeStep === "delivery"}>Choose Delivery</StepPill>
          <StepPill active={safeStep === "pay"}>Pay & Finish</StepPill>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {safeStep === "customize" ? (
              <Card className="rounded-3xl shadow-sm">
                <CardContent className="p-8">
                  <div className="text-xs text-muted-foreground">Checkout · Step 1</div>
                  <h3 className="mt-2 text-3xl font-semibold tracking-tight">Customize your backpack</h3>
                  <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                    Make it yours. These options don’t change the price yet — we’re just getting the feel right.
                  </p>

                  <div className="mt-8 flex items-center gap-4 rounded-3xl bg-[#7BAACB]/[0.08] p-4">
                    <div className="h-20 w-20 overflow-hidden rounded-2xl border">{item ? <BackpackThumb seed={item.id} /> : null}</div>
                    <div>
                      <div className="text-sm font-semibold">{item ? item.name : "Backpack"}</div>
                      <div className="mt-1 text-xs text-muted-foreground">Preview your configuration</div>
                    </div>
                  </div>

                  <div className="mt-10 space-y-8">
                    <div>
                      <div className="text-sm font-semibold">Color</div>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["Black", "Sand", "Forest", "Navy"].map((c) => (
                          <button
                            key={c}
                            onClick={() => setCustom((v) => ({ ...v, color: c }))}
                            className={`rounded-full border px-4 py-2 text-sm transition ${
                              custom.color === c ? "bg-[#3C5A7D] text-white" : "bg-white text-muted-foreground hover:bg-black/[0.04]"
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
                            key={s}
                            onClick={() => setCustom((v) => ({ ...v, straps: s }))}
                            className={`rounded-full border px-4 py-2 text-sm transition ${
                              custom.straps === s ? "bg-[#3C5A7D] text-white" : "bg-white text-muted-foreground hover:bg-black/[0.04]"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold">Monogram (optional)</div>
                      <input
                        value={custom.monogram}
                        onChange={(e) => setCustom((v) => ({ ...v, monogram: e.target.value }))}
                        placeholder="e.g., MAX"
                        className="mt-3 w-full max-w-sm rounded-2xl border bg-white px-4 py-3 text-sm outline-none"
                      />
                      <div className="mt-2 text-xs text-muted-foreground">Up to 10 characters.</div>
                    </div>

                    <div className="flex items-center justify-between rounded-3xl border p-4">
                      <div>
                        <div className="text-sm font-semibold">Add waterproof cover</div>
                        <div className="mt-1 text-xs text-muted-foreground">Extra protection for rain.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={custom.cover}
                        onChange={(e) => setCustom((v) => ({ ...v, cover: e.target.checked }))}
                        className="h-5 w-5"
                      />
                    </div>
                  </div>

                  <div className="mt-10 grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-12 w-full rounded-2xl" onClick={onBackToDetails}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button className="h-12 w-full rounded-2xl" onClick={() => go("delivery")}>
                      Choose delivery
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : safeStep === "delivery" ? (
              <Card className="rounded-3xl shadow-sm">
                <CardContent className="p-8">
                  <div className="text-xs text-muted-foreground">Checkout · Step 2</div>
                  <h3 className="mt-2 text-3xl font-semibold tracking-tight">Choose Delivery</h3>
                  <div className="mt-2 text-sm text-muted-foreground">Pick the delivery method that works best for you.</div>

                  <div className="mt-6 space-y-3">
                    {[
                      { id: "novaPoshta", title: "NovaPoshta", desc: "To your chosen branch / parcel locker.", price: FEES.novaPoshta.toFixed(2) },
                      { id: "courierKyiv", title: "Our courier delivery", desc: "Kyiv only.", price: FEES.courierKyiv.toFixed(2) },
                      { id: "pickup", title: "Pick-up from our office in Kyiv", desc: "Schedule after purchase.", price: "Free" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setDelivery(opt.id)}
                        className={`w-full rounded-3xl border p-4 text-left transition ${delivery === opt.id ? "bg-[#3C5A7D] text-white" : "bg-white"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold">{opt.title}</div>
                          <div className="text-sm font-semibold">{opt.price === "Free" ? "Free" : `€${opt.price}`}</div>
                        </div>
                        <div className={`mt-1 text-xs ${delivery === opt.id ? "text-white/80" : "text-muted-foreground"}`}>{opt.desc}</div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-12 w-full rounded-2xl" onClick={() => go("customize")}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button className="h-12 w-full rounded-2xl" onClick={() => go("pay")}>
                      Pay & Finish
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-3xl shadow-sm">
                <CardContent className="p-8">
                  <div className="text-xs text-muted-foreground">Checkout · Step 3</div>
                  <h3 className="mt-2 text-3xl font-semibold tracking-tight">Pay & Finish</h3>
                  <div className="mt-2 text-sm text-muted-foreground">Choose a payment method to complete the order.</div>

                  <div className="mt-6 rounded-3xl border bg-white p-4 shadow-sm">
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => setPayment("card")}
                        className={`w-full rounded-2xl border p-4 text-left transition ${
                          payment === "card" ? "border-[#3C5A7D] bg-[#7BAACB]/[0.08]" : "bg-white hover:bg-[#7BAACB]/[0.08]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`mt-0.5 h-4 w-4 rounded-full border ${payment === "card" ? "bg-black" : "bg-white"}`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 text-sm font-semibold">
                                <CreditCard className="h-4 w-4" />
                                Credit Card
                              </div>
                              <div className="text-xs text-muted-foreground">+€{FEES.cardExtra.toFixed(2)}</div>
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">Visa · Maestro · MasterCard</div>
                          </div>
                        </div>

                        {payment === "card" ? (
                          <div className="mt-4 grid gap-3">
                            <div>
                              <div className="text-xs text-muted-foreground">Card number</div>
                              <div className="mt-2 flex items-center gap-2 rounded-2xl border bg-white px-3 py-3">
                                <input className="w-full bg-transparent text-sm outline-none" placeholder="4111 1111 1111 1111" />
                                <div className="rounded-full border bg-white px-2 py-1 text-[10px] text-muted-foreground">VISA</div>
                              </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <div className="text-xs text-muted-foreground">Expiry date</div>
                                <input className="mt-2 w-full rounded-2xl border bg-white px-3 py-3 text-sm outline-none" placeholder="MM/YY" />
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Security code</div>
                                <input className="mt-2 w-full rounded-2xl border bg-white px-3 py-3 text-sm outline-none" placeholder="3 digits" />
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </button>

                      <button
                        type="button"
                        onClick={() => setPayment("gpay")}
                        className={`w-full rounded-2xl border p-4 text-left transition ${
                          payment === "gpay" ? "border-[#3C5A7D] bg-[#7BAACB]/[0.08]" : "bg-white hover:bg-[#7BAACB]/[0.08]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`mt-0.5 h-4 w-4 rounded-full border ${payment === "gpay" ? "bg-black" : "bg-white"}`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 text-sm font-semibold">
                                <Smartphone className="h-4 w-4" />
                                Google Pay
                              </div>
                              <div className="text-xs text-muted-foreground">+€{FEES.gpayExtra.toFixed(2)}</div>
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">Fast checkout on supported devices.</div>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPayment("wire")}
                        className={`w-full rounded-2xl border p-4 text-left transition ${
                          payment === "wire" ? "border-[#3C5A7D] bg-[#7BAACB]/[0.08]" : "bg-white hover:bg-[#7BAACB]/[0.08]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`mt-0.5 h-4 w-4 rounded-full border ${payment === "wire" ? "bg-black" : "bg-white"}`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-sm font-semibold">Wire transfer</div>
                              <div className="text-xs text-muted-foreground">No extra fee</div>
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              We’ll send banking details to your email and wait up to 3 business days before finalizing the order.
                            </div>
                          </div>
                        </div>

                        {payment === "wire" ? (
                          <div className="mt-4">
                            <div className="text-xs text-muted-foreground">Email address</div>
                            <input
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="you@example.com"
                              className="mt-2 w-full rounded-2xl border bg-white px-3 py-3 text-sm outline-none"
                            />
                          </div>
                        ) : null}
                      </button>
                    </div>

                    <div className="mt-6 text-xs text-muted-foreground">Charges are simulated in the prototype.</div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-12 w-full rounded-2xl" onClick={() => go("delivery")}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button className="h-12 w-full rounded-2xl" onClick={finish}>
                      <Lock className="mr-2 h-4 w-4" />
                      Pay €{total}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-5">
            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm font-semibold">Order summary</div>

                {item ? (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-20 w-20 overflow-hidden rounded-2xl border">
                      <BackpackThumb seed={item.id} />
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
                  <div className="h-px bg-black/10" />
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">Total</div>
                    <div className="text-base font-semibold">€{total}</div>
                  </div>
                </div>

                <div className="mt-4 rounded-3xl border bg-[#7BAACB]/[0.08] p-4">
                  <div className="text-xs text-muted-foreground">Selected options</div>
                  <div className="mt-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Color:</span> <span className="font-semibold">{custom.color}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Straps:</span> <span className="font-semibold">{custom.straps}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Monogram:</span> <span className="font-semibold">{custom.monogram || "—"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Waterproof cover:</span>{" "}
                      <span className="font-semibold">{custom.cover ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
