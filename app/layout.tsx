import './globals.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'YONI • pi² Control (Vercel‑Min)',
  description: 'YONI: Creator‑KI, Auto‑Translate, Transzendenz‑Hub. Minimal Flat Build für Vercel.',
  manifest: '/manifest.webmanifest',
  icons: {
    apple: '/icon-192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
