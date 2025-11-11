import { ReactNode } from 'react'

export const metadata = {
  title: 'YONI App',
  description: 'YONI Application',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
