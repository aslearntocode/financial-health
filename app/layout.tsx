import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Financial HealthAdvisor",
  description: "Get personalized investment portfolio recommendations based on your profile",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  )
}
