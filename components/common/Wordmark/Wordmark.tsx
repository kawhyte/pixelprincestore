/**
 * Wordmark: the single source of truth for "The Pixel Prince" brand mark.
 *
 * Text version is the shipped state. When Kenny supplies a pixel-type SVG
 * wordmark (PLAN-14 E4 / PLAN-18 email branding), swap the inner markup here
 * only: every consumer (nav, future email templates) updates in one place.
 */
interface WordmarkProps {
  className?: string;
}

export default function Wordmark({ className }: WordmarkProps) {
  return (
    <span className={`font-semibold tracking-tight text-charcoal ${className || ""}`}>
      The Pixel Prince
    </span>
  );
}
