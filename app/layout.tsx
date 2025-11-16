import './globals.css'
import type { Metadata } from 'next'

// Revalidate metadata every 10 minutes (600 seconds)
export const revalidate = 600

export const metadata: Metadata = {
  title: 'YONI • pi² Control (18+)',
  description: 'YONI: Creator‑KI, Auto‑Translate, Transzendenz‑Hub. Minimal Flat Build für Vercel. Für Nutzer:innen ab 18 Jahren.',
  themeColor: '#0a0a0a',
  manifest: '/manifest.webmanifest',
  icons: {
    apple: '/icon-192.png',
  },
  other: {
    'age-rating': '18+',
  },
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
