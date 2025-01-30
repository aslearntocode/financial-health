import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: 'Financial Health',
  description: 'Your financial health companion',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
