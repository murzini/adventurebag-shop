// Centralized UI breakpoints for the Shop app.
// Use these numbers for any JS-based responsive logic (rare).
// Tailwind breakpoints are defined in tailwind.config.js.

export const BREAKPOINTS = {
  XS: 360,      // smallest modern phones
  PHONE: 390,   // typical iPhone/Samsung base width
  TABLET: 768,  // iPad portrait
  DESKTOP: 1024,
  WIDE: 1280,
};

export const mq = {
  xs: `(min-width: ${BREAKPOINTS.XS}px)`,
  phone: `(min-width: ${BREAKPOINTS.PHONE}px)`,
  tablet: `(min-width: ${BREAKPOINTS.TABLET}px)`,
  desktop: `(min-width: ${BREAKPOINTS.DESKTOP}px)`,
  wide: `(min-width: ${BREAKPOINTS.WIDE}px)`,
};
