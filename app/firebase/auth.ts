import { getAuth } from 'firebase/auth'
import { app } from './firebase'

// Remove unused imports
export const auth = getAuth(app) 