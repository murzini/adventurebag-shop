"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// NOTE: We intentionally use relative imports here so `/shop` works even if `@/*` path aliases
// are not picked up in some local setups.
import { routes } from "../lib/prototype/routes";
import { fade } from "../lib/prototype/fade";
import { buildCatalogItemsFallback } from "../lib/prototype/catalog";

import { TopBar } from "../components/prototype/TopBar";
import { Landing } from "../components/prototype/Landing";
import { SearchPage } from "../components/prototype/SearchPage";
import { DetailsPage } from "../components/prototype/DetailsPage";
import { CheckoutFlow } from "../components/prototype/CheckoutFlow";
import { ThankYouPage } from "../components/prototype/ThankYouPage";

export default function ShopPage() {
  const [catalog, setCatalog] = useState([]);
  const [route, setRoute] = useState(routes.landing);
  const [selectedItem, setSelectedItem] = useState(null);

  // IMPORTANT: CheckoutFlow expects "customize" | "delivery" | "pay"
  const [checkoutStep, setCheckoutStep] = useState("customize");

  const [debug, setDebug] = useState(false);
  const [landingConfig, setLandingConfig] = useState(null);
  const [searchConfig, setSearchConfig] = useState(null);
  const [detailsConfig, setDetailsConfig] = useState(null);

  // Tour Mode (Milestone 8): render real Shop UI, but make it view-only.
  // Enabled via: ?tour=1&step=landing|search|details|customize|delivery|payment&sku=AB-000001
  const [isTour, setIsTour] = useState(false);
  const [tourStep, setTourStep] = useState("landing");
  const [tourSku, setTourSku] = useState(null);

  useEffect(() => {
    try {
      const qs = new URLSearchParams(window.location.search);
      setIsTour(qs.get("tour") === "1");
      setTourStep(qs.get("step") || "landing");
      setTourSku(qs.get("sku"));
    } catch {
      setIsTour(false);
      setTourStep("landing");
      setTourSku(null);
    }
  }, []);

  useEffect(() => {
    let alive = true;

    const pickPreferred = (items) => {
      if (isTour && tourSku) {
        return (
          items.find((x) => String(x?.sku || x?.SKU || "") === String(tourSku)) ||
          items[0] ||
          null
        );
      }
      return items[0] || null;
    };

    const load = async () => {
      try {
        const res = await fetch("/api/catalog", { cache: "no-store" });
        const data = await res.json();
        const items = data?.items || [];
        if (!alive) return;

        if (items.length) {
          setCatalog(items);
          setSelectedItem((prev) =>
            isTour ? pickPreferred(items) : prev || pickPreferred(items)
          );
        } else {
          const fallback = buildCatalogItemsFallback();
          setCatalog(fallback);
          setSelectedItem((prev) =>
            isTour ? pickPreferred(fallback) : prev || pickPreferred(fallback)
          );
        }
      } catch {
        if (!alive) return;
        const fallback = buildCatalogItemsFallback();
        setCatalog(fallback);
        setSelectedItem((prev) =>
          isTour ? pickPreferred(fallback) : prev || pickPreferred(fallback)
        );
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [isTour, tourSku]);

  useEffect(() => {
    if (!isTour) return;

    const step = String(tourStep || "landing").toLowerCase();

    if (step === "landing") {
      setCheckoutStep("customize");
      setRoute(routes.landing);
      return;
    }
    if (step === "search") {
      setCheckoutStep("customize");
      setRoute(routes.search);
      return;
    }
    if (step === "details") {
      setCheckoutStep("customize");
      setRoute(routes.details);
      return;
    }
    if (step === "customize") {
      setCheckoutStep("customize");
      setRoute(routes.checkout);
      return;
    }
    if (step === "delivery") {
      setCheckoutStep("delivery");
      setRoute(routes.checkout);
      return;
    }
    if (step === "payment") {
      setCheckoutStep("pay");
      setRoute(routes.checkout);
      return;
    }

    setCheckoutStep("customize");
    setRoute(routes.landing);
  }, [isTour, tourStep]);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/details-config", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!alive) return;
        setDetailsConfig(data || null);
      } catch {
        if (!alive) return;
        setDetailsConfig(null);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/search-config", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!alive) return;
        setSearchConfig(data || null);
      } catch {
        if (!alive) return;
        setSearchConfig(null);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/landing-config", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!alive) return;
        if (res.ok && data?.ok && data?.config) {
          setLandingConfig(data.config);
        } else {
          setLandingConfig(null);
        }
      } catch {
        if (!alive) return;
        setLandingConfig(null);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    try {
      const qs = new URLSearchParams(window.location.search);
      setDebug(!isTour && qs.get("debug") === "1");
    } catch {
      setDebug(false);
    }
  }, [isTour]);

  const goHome = () => {
    setCheckoutStep("customize");
    setRoute(routes.landing);
  };

  // Blocks all interactions in Tour mode (Student controls navigation via Prev/Next)
  const TourShield = isTour ? (
    <div
      className="fixed inset-0 z-[9999] cursor-default"
      title="Tour mode: view-only"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    />
  ) : null;

  if (!catalog.length || !selectedItem) {
    return (
      <div className="min-h-screen bg-[#f6f7fb]">
        <TopBar stageLabel="Shop" tokenLabel="" onGoHome={goHome} />
        {TourShield}
        <div className="mx-auto max-w-6xl px-4 py-24 text-sm text-muted-foreground">
          Loading catalog…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <TopBar stageLabel="Shop" tokenLabel="" onGoHome={goHome} />
      {TourShield}

      <div className="mx-auto max-w-6xl px-4 py-6">
        <AnimatePresence mode="wait">
          {route === routes.landing && (
            <motion.div key="landing" {...fade} transition={{ duration: 0.2 }}>
              <Landing
                config={landingConfig}
                onStart={() => {
                  if (!isTour) setRoute(routes.search);
                }}
              />
            </motion.div>
          )}

          {route === routes.search && (
            <motion.div key="search" {...fade} transition={{ duration: 0.2 }}>
              <SearchPage
                items={catalog}
                config={searchConfig}
                onSelect={(item) => {
                  if (!isTour) {
                    setSelectedItem(item);
                    setRoute(routes.details);
                  }
                }}
                onBack={() => {
                  if (!isTour) goHome();
                }}
              />
            </motion.div>
          )}

          {route === routes.details && (
            <motion.div key="details" {...fade} transition={{ duration: 0.2 }}>
              <DetailsPage
                item={selectedItem}
                config={detailsConfig}
                onBack={() => {
                  if (!isTour) setRoute(routes.search);
                }}
                onCheckout={() => {
                  if (!isTour) {
                    setCheckoutStep("customize");
                    setRoute(routes.checkout);
                  }
                }}
              />
            </motion.div>
          )}

          {route === routes.checkout && (
            <motion.div key="checkout" {...fade} transition={{ duration: 0.2 }}>
              <CheckoutFlow
                item={selectedItem}
                step={checkoutStep}
                setStep={isTour ? () => {} : setCheckoutStep}
                onBackToDetails={() => {
                  if (!isTour) {
                    setCheckoutStep("customize");
                    setRoute(routes.details);
                  }
                }}
                onFinish={() => {
                  if (!isTour) setRoute(routes.thankyou);
                }}
              />
            </motion.div>
          )}

          {route === routes.thankyou && (
            <motion.div key="thankyou" {...fade} transition={{ duration: 0.2 }}>
              <ThankYouPage
                onGoHome={() => {
                  if (!isTour) goHome();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
