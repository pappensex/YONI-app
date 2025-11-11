import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'YONI App',
  description: 'YONI: Creator-KI, Auto-Translate, Transzendenz-Hub',
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
