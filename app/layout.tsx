import './globals.css'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'

// Enable ISR with 10-minute revalidation
export const revalidate = 600

export const viewport: Viewport = {
  themeColor: '#8b5cf6',
}

export const metadata: Metadata = {
  title: 'YONI • pi² Control (18+)',
  description: 'YONI: Creator‑KI, Auto‑Translate, Transzendenz‑Hub. Minimal Flat Build für Vercel. Für Nutzer:innen ab 18 Jahren.',
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
    title: 'YONI',
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
      <body>
        {children}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ("serviceWorker" in navigator) {
              window.addEventListener("load", () => {
                navigator.serviceWorker
                  .register("/service-worker.js")
                  .catch(console.error);
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}
