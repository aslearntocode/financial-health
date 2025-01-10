import { auth } from './config'
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  browserLocalPersistence, 
  setPersistence,
  browserSessionPersistence
} from 'firebase/auth'

export const signInWithGoogle = async () => {
  try {
    // First sign out completely
    await auth.signOut()
    
    // Clear all auth states
    await auth.updateCurrentUser(null)
    
    // Set to session-only persistence
    await setPersistence(auth, browserSessionPersistence)
    
    // Create a new provider instance each time
    const provider = new GoogleAuthProvider()
    
    // Force account selection
    provider.setCustomParameters({
      prompt: 'select_account'
    })

    // Perform sign in
    const result = await signInWithPopup(auth, provider)
    console.log('Sign in successful:', result.user)
    return result.user
  } catch (error) {
    console.error('Sign in error:', error)
    throw error
  }
}

export const signOutUser = async () => {
  try {
    // Sign out from Firebase
    await auth.signOut()
    
    // Clear current user
    await auth.updateCurrentUser(null)
    
    // Clear all storage
    window.sessionStorage.clear()
    window.localStorage.clear()
    
    // Clear any Google OAuth tokens
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i]
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
    }
    
    // Reload the page to clear any remaining state
    window.location.reload()
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}

// Initialize with session persistence
setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error('Error setting persistence:', error)
}) 