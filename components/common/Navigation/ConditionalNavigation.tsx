'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

/**
 * ConditionalNavigation Component
 *
 * Renders the site navigation ONLY on non-Sanity Studio routes.
 * This prevents the site header from appearing in Sanity Studio.
 */
export default function ConditionalNavigation() {
  const pathname = usePathname();

  // Hide navigation on Sanity Studio routes
  if (pathname?.startsWith('/studio')) {
    return null;
  }

  return <Navigation />;
}
