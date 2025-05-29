import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutForm } from '@/lib/iyzipay';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Get the user's IP address
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
    
    // Create the checkout form using our helper
    const checkoutFormResult = await createCheckoutForm({
      price: 149, // Price from your premium product
      paidPrice: 149, // Total amount to be paid (same as price if no discounts)
      callbackUrl: `${req.headers.get('origin')}/checkout/callback`,
      buyerInfo: {
        id: data.userId || 'guest-user',
        name: data.firstName || 'Misafir',
        surname: data.lastName || 'Kullanıcı',
        email: data.email || 'misafir@ornek.com',
        identityNumber: data.identityNumber || '74300864791', // Default test identity number
        phone: data.phone || '+905350000000',
        city: data.city || 'Istanbul',
        country: data.country || 'Turkey',
        address: data.address || 'Örnek Adres',
        zipCode: data.zipCode || '34732',
        ip: ip
      },
      billingAddress: {
        contactName: `${data.firstName || 'Misafir'} ${data.lastName || 'Kullanıcı'}`,
        city: data.city || 'Istanbul',
        country: data.country || 'Turkey',
        address: data.address || 'Örnek Adres',
        zipCode: data.zipCode || '34742'
      },
      basketItems: [
        {
          id: 'PREMIUM001',
          name: 'Premium İçerik Erişimi',
          category: 'İçerik',
          price: 149
        }
      ]
    });
    
    return NextResponse.json(checkoutFormResult);
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Ödeme başlatılırken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 