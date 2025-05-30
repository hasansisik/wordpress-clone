import { NextRequest, NextResponse } from "next/server";
import Iyzipay from "iyzipay";

// Initialize iyzipay
const iyzipay = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY || "sandbox-OwAK76eKxLfPmFS3uF65m3yOsohhKD3B",
  secretKey: process.env.IYZIPAY_SECRET_KEY || "sandbox-P5Ppp3OxgdCQnfbCoZcaUEacUdv54l6i",
  uri: process.env.IYZIPAY_URI || "https://sandbox-api.iyzipay.com",
});

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ 
      status: "error", 
      message: "Token is required" 
    }, { status: 400 });
  }

  try {
    // Create request object for retrieving payment result
    const request: any = {
      locale: "tr",
      conversationId: "123456789",
      token: token
    };
    
    // Get payment result
    return new Promise((resolve) => {
      iyzipay.checkoutForm.retrieve(request, function (err: any, result: any) {
        if (err) {
          console.error("Iyzipay error:", err);
          resolve(NextResponse.json({ 
            status: "error", 
            message: err.errorMessage || "Ödeme durumu kontrol edilirken bir hata oluştu" 
          }, { status: 500 }));
        } else {
          console.log("Payment status check:", result);
          
          if (result.status === "success" && result.paymentStatus === "SUCCESS") {
            // Payment successful
            resolve(NextResponse.json({ 
              status: "success", 
              paymentStatus: result.paymentStatus,
              message: "Ödeme başarılı"
            }));
          } else {
            // Payment failed or pending
            resolve(NextResponse.json({ 
              status: "error", 
              paymentStatus: result.paymentStatus || "FAILURE",
              message: result.errorMessage || "Ödeme başarısız"
            }));
          }
        }
      });
    });
  } catch (error) {
    console.error("Payment status check error:", error);
    return NextResponse.json({ 
      status: "error", 
      message: "Ödeme durumu kontrol edilirken bir hata oluştu" 
    }, { status: 500 });
  }
} 