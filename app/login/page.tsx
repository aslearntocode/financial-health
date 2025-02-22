'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoginModal from '@/app/components/LoginModal'

export default function LoginPage() {
  const router = useRouter()
  
  useEffect(() => {
    const scrollPosition = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    document.body.style.top = `-${scrollPosition}px`
    
    return () => {
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      window.scrollTo(0, scrollPosition)
    }
  }, [])

  // Get the current path before login was triggered
  const currentPath = typeof window !== 'undefined' ? 
    new URLSearchParams(window.location.search).get('redirect') || 
    window.location.pathname : '/credit/score'

  return (
    <div className="fixed inset-0 z-[9999]" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
      <LoginModal 
        isOpen={true} 
        onClose={() => router.back()}
        redirectPath={currentPath}
      />
    </div>
  )
} 