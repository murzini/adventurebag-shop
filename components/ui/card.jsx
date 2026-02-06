import React from "react";
import { cn } from "./utils";

export function Card({ children, className, ...props }) {
  return (
    <div className={cn("border bg-white", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}
