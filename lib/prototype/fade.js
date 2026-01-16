// Simple fade used for screen transitions.
// Keep it minimal to avoid "flash" of the previous screen during navigation.
export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};
