/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

'use client'

import { useState } from 'react'
import { NextStudio } from 'next-sanity/studio'
import type { StudioThemeColorSchemeKey } from 'sanity'
import config from '../../../sanity.config'

const STORAGE_KEY = 'pp_studio_scheme'

function readStoredScheme(): StudioThemeColorSchemeKey {
  if (typeof window === 'undefined') return 'dark'
  const saved = window.localStorage.getItem(STORAGE_KEY)
  return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'dark'
}

export default function StudioPage() {
  // NextStudio renders behind `<Suspense fallback={null}>` internally, so the SSR
  // output is always null regardless of `scheme` — reading localStorage here can't
  // cause a hydration mismatch.
  const [scheme, setScheme] = useState<StudioThemeColorSchemeKey>(readStoredScheme)

  const handleSchemeChange = (next: StudioThemeColorSchemeKey) => {
    setScheme(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }

  return <NextStudio config={config} scheme={scheme} onSchemeChange={handleSchemeChange} />
}
