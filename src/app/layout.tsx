import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// Exposed as --font-sans / --font-mono, which tailwind.config.ts maps onto
// font-sans and font-mono. Self-hosted at build time, so no runtime request to
// Google and no layout shift.
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fighterready.app'),
  title: 'Fighter Ready — Matchmaking with an opinion.',
  description:
    'The safety-first matchmaking, sparring and event platform for combat sports. Objective bout matching for boxing, kickboxing, MMA, Muay Thai and white-collar.',
  keywords: [
    'boxing matchmaking',
    'combat sports platform',
    'sparring finder',
    'MMA matchmaking',
    'Muay Thai',
    'white collar boxing',
    'bout ticketing',
  ],
  openGraph: {
    title: 'Fighter Ready — Matchmaking with an opinion.',
    description:
      'Objective, safety-gated bout matching for boxing, kickboxing, MMA, Muay Thai and white-collar.',
    type: 'website',
    siteName: 'Fighter Ready',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#09090b',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-carbon font-sans antialiased">
        <a
          href="#round-00"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-emerald-500 focus:bg-zinc-950 focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-fight focus:text-emerald-300"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
