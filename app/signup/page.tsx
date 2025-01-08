'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FcGoogle } from 'react-icons/fc'
import Header from "@/components/Header"
import { auth, db } from "@/lib/firebase"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function SignupPage() {
  const router = useRouter()
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [pin, setPin] = useState(['', '', '', ''])
  const [errorMessage, setErrorMessage] = useState('')

  const handlePinChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pin]
      newPin[index] = value
      setPin(newPin)

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`pin-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      
      if (result.user) {
        setShowPinDialog(true)
      }
    } catch (err) {
      setErrorMessage("Failed to sign up with Google. Please try again.")
      console.error(err)
    }
  }

  const handlePinSubmit = async () => {
    const finalPin = pin.join('')
    if (finalPin.length !== 4) {
      setErrorMessage("Please enter a 4-digit PIN")
      return
    }

    try {
      const user = auth.currentUser
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          pin: finalPin,
          createdAt: new Date().toISOString()
        })
        
        router.push('/dashboard')
      }
    } catch (err) {
      setErrorMessage("Failed to save PIN. Please try again.")
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Sign up with Google and create a PIN for future logins
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="text-red-600 text-sm">{errorMessage}</div>
            )}

            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleGoogleSignup}
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              Sign up with Google
            </Button>

            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-500">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Your PIN</DialogTitle>
              <DialogDescription>
                Please create a 4-digit PIN that you&apos;ll use for future logins
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center space-x-4 my-4">
              {pin.map((digit, index) => (
                <Input
                  key={index}
                  id={`pin-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-2xl"
                />
              ))}
            </div>
            <Button 
              className="w-full" 
              onClick={handlePinSubmit}
            >
              Set PIN
            </Button>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
} 