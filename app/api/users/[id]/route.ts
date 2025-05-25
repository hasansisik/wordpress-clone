import { getCurrentUser } from '@/lib/auth';
import { findUserById, users } from '@/lib/db';
import { NextResponse } from 'next/server';

// Delete user - admin only
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    // Only admins can delete users
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const userId = params.id;
    
    // Check if user exists
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Don't allow deleting self
    if (userId === currentUser.id) {
      return NextResponse.json(
        { success: false, message: 'You cannot delete your own account' },
        { status: 400 }
      );
    }
    
    // Remove the user from our in-memory store
    users.splice(userIndex, 1);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while deleting user' },
      { status: 500 }
    );
  }
} 