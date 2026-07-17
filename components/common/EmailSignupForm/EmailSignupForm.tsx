"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailSignupFormProps {
  source: string;
  className?: string;
}

export default function EmailSignupForm({ source, className }: EmailSignupFormProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true, source, website }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setPending(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setPending(false);
    }
  };

  if (success) {
    return (
      <p className={`text-base font-medium text-charcoal ${className || ""}`}>
        You&apos;re in! Watch your inbox for this month&apos;s print.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className || ""}`}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-charcoal outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-200"
        />
        <Button
          type="submit"
          disabled={pending}
          className="rounded-2xl bg-sage-500 px-6 py-3 text-sm font-semibold text-white hover:bg-sage-400 disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get the free prints"}
        </Button>
      </div>

      <label className="flex items-start gap-2 text-xs text-soft-charcoal">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-border text-sage-500 focus:ring-sage-300"
        />
        <span>One email a month: a new free print + shop news. Unsubscribe anytime.</span>
      </label>

      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}
