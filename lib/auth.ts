import { cookies } from 'next/headers';
import { createSession, deleteSession, findUserByEmail, getSession } from './db';
import { User } from './types';

const SESSION_COOKIE_NAME = 'session_id';

// Login function
export async function login(email: string, password: string) {
  const user = findUserByEmail(email);
  
  if (!user || user.password !== password) {
    return { success: false, message: 'Invalid email or password' };
  }

  // Create a session
  const { sessionId, expires } = createSession(user.id);
  
  // Set cookie
  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: sessionId,
    expires,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return { success: true };
}

// Logout function
export async function logout() {
  const sessionId = cookies().get(SESSION_COOKIE_NAME)?.value;
  
  if (sessionId) {
    deleteSession(sessionId);
    cookies().delete(SESSION_COOKIE_NAME);
  }
  
  return { success: true };
}

// Get current user
export async function getCurrentUser(): Promise<Omit<User, 'password'> | null> {
  const sessionId = cookies().get(SESSION_COOKIE_NAME)?.value;
  
  if (!sessionId) {
    return null;
  }
  
  const session = getSession(sessionId);
  if (!session) {
    return null;
  }
  
  return session.user;
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