import { NextRequest, NextResponse } from 'next/server';
import Iyzipay from 'iyzipay';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { cardInfo } = data;
    
    // Get the user's IP address
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
    
    // iyzipay instance oluştur
    const iyzipay = new Iyzipay({
      apiKey: "sandbox-afXhZPW0MQlE4dCUUlHcEopnMBgXnAZI",
      secretKey: "sandbox-wbwpzKIiplZxI3hh5ALI4FJyAcZKL6kq",
      uri: "https://sandbox-api.iyzipay.com"
    });
    
    console.log("Received card info:", cardInfo);
    
    // Marketplace ödeme isteği oluştur - PRODUCT paymentGroup kullan
    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: `wordpress-clone-${Date.now()}`,
      price: "149.00",
      paidPrice: "149.00",
      currency: Iyzipay.CURRENCY.TRY,
      installment: '1',
      basketId: `basket-${Date.now()}`,
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT, // LISTING yerine PRODUCT kullan
      callbackUrl: "http://localhost:3000/checkout/premium/success",
      paymentCard: {
        cardHolderName: cardInfo.cardHolderName,
        cardNumber: cardInfo.cardNumber,
        expireMonth: cardInfo.expireMonth,
        expireYear: cardInfo.expireYear,
        cvc: cardInfo.cvc,
        registerCard: '0'
      },
      buyer: {
        id: `user-${Date.now()}`,
        name: cardInfo.cardHolderName.split(' ')[0] || "Misafir",
        surname: cardInfo.cardHolderName.split(' ').slice(1).join(' ') || "Kullanıcı",
        gsmNumber: "+905350000000",
        email: "test@example.com",
        identityNumber: "74300864791",
        lastLoginDate: "2020-10-05 12:43:35",
        registrationDate: "2020-10-05 12:43:35",
        registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        ip: ip,
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34732"
      },
      shippingAddress: {
        contactName: cardInfo.cardHolderName || "Misafir Kullanıcı",
        city: "Istanbul",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742"
      },
      billingAddress: {
        contactName: cardInfo.cardHolderName || "Misafir Kullanıcı",
        city: "Istanbul",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742"
      },
      basketItems: [
        {
          id: "PREMIUM001",
          name: "Premium İçerik Erişimi",
          category1: "İçerik",
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: "149.00"
        }
      ]
    };
    
    console.log("Creating payment with updated parameters...");
    
    const result = await new Promise((resolve, reject) => {
      iyzipay.payment.create(request, function (err, result) {
        if (err) {
          console.error("Payment error:", err);
          reject(err);
        } else {
          console.log("Payment result:", result);
          resolve(result);
        }
      });
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        errorMessage: 'Ödeme işlemi sırasında bir hata oluştu: ' + (error instanceof Error ? error.message : String(error)),
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 