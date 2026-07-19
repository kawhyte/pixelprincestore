import { ChevronDown } from "lucide-react";

export default function FaqAccordion({ faq }: { faq: { q: string; a: string }[] }) {
  return (
    <div className="space-y-3">
      {faq.map(({ q, a }) => (
        <details key={q} className="group rounded-md border border-border bg-card p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-charcoal [&::-webkit-details-marker]:hidden">
            {q}
            <ChevronDown className="h-5 w-5 shrink-0 text-sage-500 transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-3 text-soft-charcoal">{a}</p>
        </details>
      ))}
    </div>
  );
}
