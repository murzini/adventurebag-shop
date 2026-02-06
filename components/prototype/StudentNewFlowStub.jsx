"use client";
import { Button } from "../ui/button";

export default function PickHypothesisStub({ onBack }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-4xl font-semibold">New A/B Testing Flow</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Placeholder for new Student flow triggered by Pick a hypothesis.
      </p>
      <div className="mt-8">
        <Button onClick={onBack}>Back</Button>
      </div>
    </div>
  );
}
