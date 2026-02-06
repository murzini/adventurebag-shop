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
import { ResponsiveDebug } from "../components/prototype/ResponsiveDebug";

// Standalone Shop view: no Student session, no token, just the shop prototype.
export default function ShopPage() {
  const [catalog, setCatalog] = useState([]);
  const [route, setRoute] = useState(routes.landing);
  const [selectedItem, setSelectedItem] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [debug, setDebug] = useState(false);
  const [landingConfig, setLandingConfig] = useState(null);
  const [searchConfig, setSearchConfig] = useState(null);
  const [detailsConfig, setDetailsConfig] = useState(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const res = await fetch("/api/catalog", { cache: "no-store" });
        const data = await res.json();
        const items = data?.items || [];
        if (!alive) return;
        if (items.length) {
          setCatalog(items);
          setSelectedItem((prev) => prev || items[0] || null);
        } else {
          const fallback = buildCatalogItemsFallback();
          setCatalog(fallback);
          setSelectedItem((prev) => prev || fallback[0] || null);
        }
      } catch {
        if (!alive) return;
        const fallback = buildCatalogItemsFallback();
        setCatalog(fallback);
        setSelectedItem((prev) => prev || fallback[0] || null);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    // Details page CMS (optional). If unreachable, DetailsPage uses built-in defaults.
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
    // Search page CMS (optional). If unreachable, SearchPage uses built-in defaults.
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/search-config", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!alive) return;
        // This endpoint always returns a merged config.
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
    // Landing page CMS (optional). If unreachable, the Landing component uses built-in defaults.
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
    // Enable overlay for cross-device QA: add ?debug=1
    try {
      setDebug(new URLSearchParams(window.location.search).get("debug") === "1");
    } catch {
      setDebug(false);
    }
  }, []);

  const goHome = () => {
    setCheckoutStep(1);
    setRoute(routes.landing);
  };

  if (!catalog.length || !selectedItem) {
    return (
      <div className="min-h-screen bg-[#f6f7fb]">
        <TopBar stageLabel="Shop" tokenLabel="" onGoHome={goHome} />
      {debug ? <ResponsiveDebug /> : null}
        <div className="mx-auto max-w-6xl px-4 py-24 text-sm text-muted-foreground">
          Loading catalog…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <TopBar stageLabel="Shop" tokenLabel="" onGoHome={goHome} />
      {debug ? <ResponsiveDebug /> : null}

      <div className="mx-auto max-w-6xl px-4 py-6">
        <AnimatePresence mode="wait">
          {route === routes.landing && (
            <motion.div key="landing" {...fade} transition={{ duration: 0.2 }}>
              <Landing
                config={landingConfig}
                onStart={() => setRoute(routes.search)}
              />
            </motion.div>
          )}

          {route === routes.search && (
            <motion.div key="search" {...fade} transition={{ duration: 0.2 }}>
              <SearchPage
                items={catalog}
                config={searchConfig}
                onSelect={(item) => {
                  setSelectedItem(item);
                  setRoute(routes.details);
                }}
                onBack={goHome}
              />
            </motion.div>
          )}

          {route === routes.details && (
            <motion.div key="details" {...fade} transition={{ duration: 0.2 }}>
              <DetailsPage
                item={selectedItem}
                config={detailsConfig}
                onBack={() => setRoute(routes.search)}
                onCheckout={() => {
                  setCheckoutStep(1);
                  setRoute(routes.checkout);
                }}
              />
            </motion.div>
          )}

          {route === routes.checkout && (
            <motion.div key="checkout" {...fade} transition={{ duration: 0.2 }}>
              <CheckoutFlow
                item={selectedItem}
                step={checkoutStep}
                setStep={setCheckoutStep}
                onBackToDetails={() => {
                  setCheckoutStep(1);
                  setRoute(routes.details);
                }}
                onFinish={() => setRoute(routes.thankyou)}
              />
            </motion.div>
          )}

          {route === routes.thankyou && (
            <motion.div key="thankyou" {...fade} transition={{ duration: 0.2 }}>
              <ThankYouPage onGoHome={goHome} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
