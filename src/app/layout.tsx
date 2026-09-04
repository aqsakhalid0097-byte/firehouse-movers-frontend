import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { IBM_Plex_Mono } from 'next/font/google';
import '../index.css';
import { Providers } from './providers';

const aeonik = localFont({
  src: [
    {
      path: '../../public/fonts/aeonik/Aeonik-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/aeonik/Aeonik-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/aeonik/Aeonik-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/aeonik/Aeonik-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-aeonik',
  display: 'swap',
});

// Monospace accent font for technical/numeric UI details
// (dispatch codes, ETAs, timestamps, tracking numbers, stat counters)
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Firehouse Movers — Portal & Dispatch Console',
  description: 'Operations, Dispatch, Staff Directory, and Logistics Management Portal for Firehouse Movers.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${aeonik.variable} ${plexMono.variable}`}>
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
