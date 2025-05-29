import { NextRequest, NextResponse } from 'next/server';
import { retrieveCheckoutFormResult } from '@/lib/iyzipay';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { status: 'error', errorMessage: 'Token is required' },
        { status: 400 }
      );
    }

    // Call the iyzipay API to verify the payment
    const result = await retrieveCheckoutFormResult(token);
    
    // Check if the payment was successful
    if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
      // Here you could update your database to mark the user as premium
      // For example: await db.users.update({ where: { id: userId }, data: { isPremium: true } })
      
      return NextResponse.json({
        status: 'success',
        paymentStatus: result.paymentStatus,
        paymentId: result.paymentId
      });
    } else {
      return NextResponse.json({
        status: 'error',
        paymentStatus: result.paymentStatus,
        errorMessage: result.errorMessage || 'Payment failed'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { status: 'error', errorMessage: 'An error occurred during payment verification' },
      { status: 500 }
    );
  }
} 