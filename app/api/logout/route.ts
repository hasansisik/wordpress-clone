import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteSession } from '@/lib/db';

export async function POST() {
  try {
    // Get the cookie store
    const cookieStore = await cookies();
    
    // Get the session ID from the cookie
    const sessionId = cookieStore.get('test-session')?.value;
    
    // If there's a session, delete it from the database
    if (sessionId) {
      deleteSession(sessionId);
    }
    
    // Delete the session cookie
    cookieStore.delete('test-session');
    
    // Try to delete NextAuth cookies as well to be thorough
    cookieStore.delete('next-auth.session-token');
    cookieStore.delete('__Secure-next-auth.session-token');
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during logout' },
      { status: 500 }
    );
  }
} 