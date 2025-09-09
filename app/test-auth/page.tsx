'use client'

import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'
import LoginModal from '@/app/components/LoginModal'

export default function TestAuthPage() {
  const { currentUser, loading } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Authentication Test</h1>
        
        {currentUser ? (
          <div className="space-y-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              ✅ Successfully authenticated!
            </div>
            
            <div className="space-y-2">
              <h2 className="font-semibold">User Information:</h2>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Name:</strong> {currentUser.displayName || 'Not provided'}</p>
              <p><strong>UID:</strong> {currentUser.uid}</p>
              <p><strong>Email Verified:</strong> {currentUser.emailVerified ? 'Yes' : 'No'}</p>
            </div>
            
            <div className="pt-4">
              <button
                onClick={() => {
                  // This would typically be handled by a logout function
                  window.location.reload()
                }}
                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Test Logout (Refresh Page)
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              ⚠️ Not authenticated
            </div>
            
            <p className="text-gray-600 text-center">
              Click the button below to test the login functionality.
            </p>
            
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Test Login
            </button>
          </div>
        )}
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        redirectPath="/test-auth"
      />
    </div>
  )
}
