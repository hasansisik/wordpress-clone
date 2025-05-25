import { login } from '@/lib/auth';
import { createUser } from '@/lib/db';
import { UserRole } from '@/lib/types';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate role (only allow user, editor roles from frontend)
    const validRole: UserRole = ['user', 'editor'].includes(role) ? role as UserRole : 'user';

    try {
      const newUser = createUser(name, email, password, validRole);
      
      // Automatically log the user in
      await login(email, password);
      
      return NextResponse.json({ success: true, user: newUser });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
} 