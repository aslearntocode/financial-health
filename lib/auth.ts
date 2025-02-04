export async function getSession() {
  try {
    const response = await fetch('/api/auth/session')
    const session = await response.json()
    
    if (!session || !session.user) {
      return null
    }
    
    return session
  } catch (error) {
    console.error('Error fetching session:', error)
    return null
  }
} 