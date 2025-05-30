import { NextRequest, NextResponse } from "next/server";
import Iyzipay from "iyzipay";

// Initialize iyzipay
const iyzipay = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY || "sandbox-OwAK76eKxLfPmFS3uF65m3yOsohhKD3B",
  secretKey: process.env.IYZIPAY_SECRET_KEY || "sandbox-P5Ppp3OxgdCQnfbCoZcaUEacUdv54l6i",
  uri: process.env.IYZIPAY_URI || "https://sandbox-api.iyzipay.com",
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { pricingId, callbackUrl } = data;
    
    // Create a unique basket ID for this transaction
    const uniqueId = new Date().getTime().toString();
    
    // Create request object
    const request = {
      locale: "tr",
      conversationId: uniqueId,
      price: "149.00",
      paidPrice: "149.00",
      currency: "TRY",
      basketId: "P_" + uniqueId,
      paymentGroup: "PRODUCT",
      callbackUrl: callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL || req.headers.get('origin')}/api/checkout/iyzico/callback`,
      
      buyer: {
        id: "BY789",
        name: "Test",
        surname: "User",
        gsmNumber: "+905350000000",
        email: "test@example.com",
        identityNumber: "74300864791",
        registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        ip: "85.34.78.112",
        city: "Istanbul",
        country: "Turkey",
      },
      
      shippingAddress: {
        contactName: "Test User",
        city: "Istanbul",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      },
      
      billingAddress: {
        contactName: "Test User",
        city: "Istanbul",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      },
      
      basketItems: [
        {
          id: "BI101",
          name: "Premium Erişim",
          category1: "Subscription",
          itemType: "VIRTUAL",
          price: "149.00",
        }
      ],
    };
    
    // Initialize checkout form
    return new Promise((resolve) => {
      iyzipay.checkoutFormInitialize.create(request, function (err: any, result: any) {
        if (err) {
          console.error("Iyzipay error:", err);
          resolve(NextResponse.json({ status: "error", message: err.errorMessage || "Ödeme başlatılırken bir hata oluştu" }, { status: 500 }));
        } else {
          console.log("Checkout form initialized:", result);
          if (result.status === "success") {
            // Fix the script if needed to ensure it runs properly
            const updatedContent = result.checkoutFormContent
              .replace('<script type="text/javascript">', '<script type="text/javascript">')
              .replace('</script>', '</script>');
              
            resolve(NextResponse.json({ 
              status: "success", 
              checkoutFormContent: updatedContent,
              token: result.token,
              paymentPageUrl: result.paymentPageUrl
            }));
          } else {
            resolve(NextResponse.json({ 
              status: "error", 
              message: result.errorMessage || "Ödeme başlatılırken bir hata oluştu" 
            }, { status: 400 }));
          }
        }
      });
    });
    
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ status: "error", message: "Bir hata oluştu" }, { status: 500 });
  }
} 