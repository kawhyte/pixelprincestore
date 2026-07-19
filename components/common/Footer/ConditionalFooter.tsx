'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

/**
 * ConditionalFooter Component
 *
 * Renders the site footer ONLY on non-Sanity Studio routes.
 * Mirrors ConditionalNavigation so Studio stays chrome-free.
 */
export default function ConditionalFooter() {
  const pathname = usePathname();

  if (pathname?.startsWith('/studio')) {
    return null;
  }

  return <Footer />;
}
