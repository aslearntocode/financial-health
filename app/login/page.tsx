'use client'

import { useState } from 'react'
import { auth } from '@/app/firebase/config'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      
      // Get redirect path from URL if it exists
      const params = new URLSearchParams(window.location.search)
      const redirectPath = params.get('redirect')
      
      // Redirect to the specified path if it exists, otherwise go to investment
      router.push(redirectPath || '/investment')
    } catch (error) {
      setError('Failed to sign in. Please try again.')
      console.error('Sign in error:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to continue
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in to access the investment tools
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  )
} 