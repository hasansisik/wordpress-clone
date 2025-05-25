import { NextResponse } from 'next/server';
import { findUserByEmail, createSession } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    console.log('Test login request received');
    const { email, password } = await request.json();
    
    console.log(`Login attempt for email: ${email}`);
    
    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user by email
    const user = findUserByEmail(email);
    
    // Check if user exists and password matches
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    if (user.password !== password) {
      console.log(`Invalid password for email: ${email}`);
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    console.log(`User authenticated: ${user.name} (${user.email})`);
    
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
      
      console.log('Session cookie set successfully');
      
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