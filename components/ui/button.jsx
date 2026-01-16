import React from "react";
import { cn } from "./utils";

export function Button({
  children,
  className,
  variant = "default",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-[#0B1628] text-white hover:bg-[#0B1628]/90",
    outline: "border bg-white text-black hover:bg-black/[0.04]",
    ghost: "bg-transparent text-black hover:bg-black/[0.04]",
  };

  return (
    <button
      className={cn(base, variants[variant] || variants.default, className)}
      {...props}
    >
      {children}
    </button>
  );
}
