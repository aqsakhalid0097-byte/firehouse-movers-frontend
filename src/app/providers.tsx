'use client';

import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AuthProvider } from '../context/AuthContext';
import { CustomCursor } from '../components/CustomCursor';
import { ScrollPageTransition } from '../components/ScrollPageTransition';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  // Every pinned/scroll-driven section on the site (the 3D truck viewer, the
  // editorial services ribbon, the move-journey timeline, etc.) measures its
  // own scroll distance the moment it mounts, before web fonts have
  // necessarily finished loading. If a font swaps in afterwards and reflows
  // the page, every pin below that point drifts out of sync with the layout
  // it was measured against — the visible symptom is two pinned sections
  // overlapping or a section "losing its own space". Re-measuring every
  // ScrollTrigger once fonts (and the rest of the page) have actually
  // settled keeps all of them in sync, no matter which component created
  // them.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const refresh = () => ScrollTrigger.refresh();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => requestAnimationFrame(refresh));
    }

    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CustomCursor />
        <ScrollPageTransition />
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default Providers;
