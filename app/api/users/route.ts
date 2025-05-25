import { getCurrentUser } from '@/lib/auth';
import { findUserById } from '@/lib/db';
import { NextResponse } from 'next/server';

// Get all users - only accessible to admins
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    // Only admins can access the user list
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // In a real app, this would be a database query
    // For our mock implementation, we'll just import the users from the mock DB
    const { users } = await import('@/lib/db');
    
    // Return users without passwords
    const safeUsers = users.map(user => ({
      ...user,
      password: undefined
    }));
    
    return NextResponse.json({ success: true, users: safeUsers });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while getting users' },
      { status: 500 }
    );
  }
} 