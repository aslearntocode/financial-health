import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Analytics } from "@vercel/analytics/react"
import Footer from "@/components/Footer"
import { Toaster } from "@/components/ui/toaster"

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
      <body className="min-h-screen">
        <main>
          {children}
        </main>
        <Footer />
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
