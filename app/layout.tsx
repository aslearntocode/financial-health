import './globals.css'
import type { Metadata, Viewport } from 'next'
import Header from '@/components/Header'
import { Analytics } from "@vercel/analytics/react"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: 'Financial Health',
  description: 'Your financial health companion',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
  },
  icons: {
    apple: '/icons/icon-192x192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
