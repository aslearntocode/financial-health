'use client'

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { User } from "firebase/auth"
import { ProfileDropdown } from "./ProfileDropdown"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex space-x-8">
            <Link href="/" className="text-white hover:text-white/90">
              Home
            </Link>
            <Link href="/about" className="text-white hover:text-white/90">
              About Us
            </Link>
            <Link href="/investment" className="text-white hover:text-white/90">
              Investment
            </Link>
            <Link href="/credit" className="text-white hover:text-white/90">
              Credit
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <ProfileDropdown user={user} />
            ) : (
              <Link href="/login">
                <button className="text-white hover:text-white/90">
                  Log in
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
} 