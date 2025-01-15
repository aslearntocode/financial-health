'use client'

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { User } from "firebase/auth"
import { ProfileDropdown } from "./ProfileDropdown"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 w-full overflow-x-hidden">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center w-full">
          <div className="flex items-center">
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <div className="hidden md:flex space-x-8 ml-8">
              <Link href="/" className="text-white hover:text-white/90 whitespace-nowrap">
                Home
              </Link>
              <Link href="/about" className="text-white hover:text-white/90 whitespace-nowrap">
                About Us
              </Link>
              <Link href="/investment" className="text-white hover:text-white/90 whitespace-nowrap">
                Investment
              </Link>
              <Link href="/credit" className="text-white hover:text-white/90 whitespace-nowrap">
                Credit
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <ProfileDropdown user={user} />
            ) : (
              <Link href="/login">
                <button className="text-white hover:text-white/90 whitespace-nowrap">
                  Log in
                </button>
              </Link>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-2 w-full bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="text-white hover:text-white/90 px-2 py-1">
                Home
              </Link>
              <Link href="/about" className="text-white hover:text-white/90 px-2 py-1">
                About Us
              </Link>
              <Link href="/investment" className="text-white hover:text-white/90 px-2 py-1">
                Investment
              </Link>
              <Link href="/credit" className="text-white hover:text-white/90 px-2 py-1">
                Credit
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
} 