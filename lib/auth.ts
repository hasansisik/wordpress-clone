import { cookies } from 'next/headers';
import { getSession } from './db';
import { User } from './types';

// Get current user from custom session
export async function getCurrentUser(): Promise<Omit<User, 'password'> | null> {
  try {
    // Get the cookie store
    const cookieStore = await cookies();
    
    // Check for our custom session
    const sessionId = cookieStore.get('test-session')?.value;
    
    if (sessionId) {
      const customSession = getSession(sessionId);
      if (customSession) {
        return customSession.user;
      }
    }
    
    // If no custom session found, return null
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return user !== null;
}

// Check if user has required role
export async function hasRole(role: string | string[]) {
  const user = await getCurrentUser();
  
  if (!user) {
    return false;
  }
  
  if (Array.isArray(role)) {
    return role.includes(user.role);
  }
  
  return user.role === role;
} 