import { NextRequest, NextResponse } from 'next/server';
import Iyzipay from 'iyzipay';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Get the user's IP address
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
    
    // iyzipay instance oluştur - direkt anahtarları burada tanımlayalım
    const iyzipay = new Iyzipay({
      apiKey: "sandbox-afXhZPW0MQlE4dCUUlHcEopnMBgXnAZI",
      secretKey: "sandbox-wbwpzKIiplZxI3hh5ALI4FJyAcZKL6kq",
      uri: "https://sandbox-api.iyzipay.com"
    });
    
    // Checkout form isteği oluştur
    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: `wordpress-clone-${Date.now()}`,
      price: "149.00",
      paidPrice: "149.00",
      currency: Iyzipay.CURRENCY.TRY,
      basketId: `basket-${Date.now()}`,
      paymentGroup: Iyzipay.PAYMENT_GROUP.LISTING,  // Marketplace için LISTING kullanılıyor
      callbackUrl: data.callbackUrl || `${req.headers.get('origin')}/checkout/premium/callback`,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: `user-${Date.now()}`,
        name: "John",
        surname: "Doe",
        gsmNumber: "+905350000000",
        email: "email@email.com",
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
        contactName: "Jane Doe",
        city: "Istanbul",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742"
      },
      billingAddress: {
        contactName: "Jane Doe",
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
          itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
          price: "149.00",
          subMerchantKey: "sandbox-Dq1BjFuV3JyjsrXPl81QTWKPcCE",  // subMerchantKey eklendi
          subMerchantPrice: "149.00"  // subMerchantPrice eklendi
        }
      ]
    };

    // Alternatif olarak PRODUCT ödeme grubu ile deneme
    // Marketplace kullanmadan normal ödeme yapalım
    const simpleRequest = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: `wordpress-clone-${Date.now()}`,
      price: "149.00",
      paidPrice: "149.00",
      currency: Iyzipay.CURRENCY.TRY,
      basketId: `basket-${Date.now()}`,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,  // Normal ürün ödemesi
      callbackUrl: data.callbackUrl || `${req.headers.get('origin')}/checkout/premium/callback`,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: `user-${Date.now()}`,
        name: "John",
        surname: "Doe",
        gsmNumber: "+905350000000",
        email: "email@email.com",
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
        contactName: "Jane Doe",
        city: "Istanbul",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742"
      },
      billingAddress: {
        contactName: "Jane Doe",
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
          itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
          price: "149.00"
        }
      ]
    };
    
    // İki farklı isteğimiz var, önce PRODUCT tipinde olanı deneyelim
    console.log("Trying simple payment request...");
    
    // Promise-based yapıya dönüştür
    const checkoutFormPromise = new Promise((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(simpleRequest, function (err, result) {
        if (err) {
          console.error("iyzipay simple request error:", err);
          
          // Basit istek başarısız olursa, marketplace istek dene
          console.log("Simple request failed, trying marketplace request...");
          iyzipay.checkoutFormInitialize.create(request, function (err2, result2) {
            if (err2) {
              console.error("iyzipay marketplace request error:", err2);
              reject(err2);
            } else {
              console.log("iyzipay marketplace result:", result2);
              resolve(result2);
            }
          });
        } else {
          console.log("iyzipay simple result:", result);
          resolve(result);
        }
      });
    });
    
    // Checkout form oluştur
    const result = await checkoutFormPromise;
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        errorMessage: 'Ödeme başlatılırken bir hata oluştu. Detay: ' + (error instanceof Error ? error.message : String(error)),
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 