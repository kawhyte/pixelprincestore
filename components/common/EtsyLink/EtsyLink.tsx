"use client";

import { trackEtsyClickOut } from "@/lib/analytics";
import { usePathname } from "next/navigation";

export default function EtsyLink({
  href,
  className,
  children,
  "aria-label": ariaLabel,
  onClick,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const shop = href.includes("pixelprinceprintable") ? "printables" : "main";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={className}
      aria-label={ariaLabel}
      onClick={() => {
        trackEtsyClickOut(shop, pathname);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}
