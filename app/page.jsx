"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// NOTE: We intentionally use relative imports here so `/shop` works even if `@/*` path aliases
// are not picked up in some local setups.
import { routes } from "../lib/prototype/routes";
import { fade } from "../lib/prototype/fade";
import { buildCatalogItems } from "../lib/prototype/catalog";

import { TopBar } from "../components/prototype/TopBar";
import { Landing } from "../components/prototype/Landing";
import { SearchPage } from "../components/prototype/SearchPage";
import { DetailsPage } from "../components/prototype/DetailsPage";
import { CheckoutFlow } from "../components/prototype/CheckoutFlow";
import { ThankYouPage } from "../components/prototype/ThankYouPage";

// Standalone Shop view: no Student session, no token, just the shop prototype.
export default function ShopPage() {
  const catalog = useMemo(() => buildCatalogItems(), []);
  const [route, setRoute] = useState(routes.landing);
  const [selectedItem, setSelectedItem] = useState(catalog[0]);
  const [checkoutStep, setCheckoutStep] = useState(1);

  const goHome = () => {
    setCheckoutStep(1);
    setRoute(routes.landing);
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <TopBar stageLabel="Shop" tokenLabel="" onGoHome={goHome} />

      <div className="mx-auto max-w-6xl px-4 py-6">
        <AnimatePresence mode="wait">
          {route === routes.landing && (
            <motion.div key="landing" {...fade} transition={{ duration: 0.2 }}>
              <Landing onStart={() => setRoute(routes.search)} />
            </motion.div>
          )}

          {route === routes.search && (
            <motion.div key="search" {...fade} transition={{ duration: 0.2 }}>
              <SearchPage
                items={catalog}
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
