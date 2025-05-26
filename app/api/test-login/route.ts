import { NextResponse } from 'next/server';
import { findUserByEmail, createSession } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user by email
    const user = findUserByEmail(email);
    
    // Check if user exists and password matches
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    
    // Create a session
    const { sessionId, expires } = createSession(user.id);
    
    // Set session cookie
    try {
      const cookieStore = await cookies();
      
      // Set the cookie
      cookieStore.set('test-session', sessionId, {
        expires,
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
      
      
      // Return user data (without password)
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (cookieError) {
      console.error('Error setting cookie:', cookieError);
      return NextResponse.json(
        { success: false, message: 'Failed to set session cookie' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
} 