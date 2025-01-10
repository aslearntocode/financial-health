"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

const TIMEOUT_DURATION = 30 * 60 * 1000 // 30 minutes in milliseconds

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [lastActivity, setLastActivity] = useState(Date.now())

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login')
      }
    })

    const handleActivity = () => {
      setLastActivity(Date.now())
    }

    // Track user activity
    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('click', handleActivity)
    window.addEventListener('scroll', handleActivity)

    // Check for inactivity
    const interval = setInterval(() => {
      if (Date.now() - lastActivity >= TIMEOUT_DURATION) {
        signOut(auth)
        router.push('/login')
      }
    }, 1000) // Check every second

    return () => {
      unsubscribe()
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('click', handleActivity)
      window.removeEventListener('scroll', handleActivity)
      clearInterval(interval)
    }
  }, [router, lastActivity])

  return <>{children}</>
} 