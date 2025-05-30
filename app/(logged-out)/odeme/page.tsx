"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Check, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getGeneral } from "@/services/generalService";

export default function IyzicoCheckout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentPageUrl, setPaymentPageUrl] = useState<string | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [generalSettings, setGeneralSettings] = useState<any>(null);

  // Function to check payment status
  const checkPaymentStatus = async (token: string) => {
    try {
      const response = await fetch(`/api/checkout/iyzico/status?token=${token}`, {
        method: "GET",
      });
      
      const data = await response.json();
      
      if (data.status === "success" && data.paymentStatus === "SUCCESS") {
        router.push("/odeme/basarili");
      } else {
        router.push("/odeme/basarisiz");
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Check if the message is from iyzico
      if (event.data && event.data.type === 'PAYMENT_RESULT') {
        console.log('Payment result received:', event.data);
        
        if (event.data.status === 'success') {
          router.push("/odeme/basarili");
        } else {
          router.push("/odeme/basarisiz");
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [router]);

  // Fetch general settings for iyzico configuration
  useEffect(() => {
    const fetchGeneralSettings = async () => {
      try {
        const settings = await getGeneral();
        setGeneralSettings(settings);
      } catch (error) {
        console.error("Error fetching general settings:", error);
      }
    };

    fetchGeneralSettings();
  }, []);

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/checkout/iyzico", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            callbackUrl: `${window.location.origin}/api/checkout/iyzico/callback`,
          }),
        });

        const data = await response.json();

        if (data.status === "success") {
          // Store payment page URL
          if (data.paymentPageUrl) {
            setPaymentPageUrl(data.paymentPageUrl);
          } else {
            setError("Ödeme sayfası URL'si alınamadı");
          }
        } else {
          setError(data.message || "Ödeme formu oluşturulurken bir hata oluştu");
        }
      } catch (error) {
        console.error("Checkout error:", error);
        setError("Ödeme sayfası yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    // Only initialize checkout once general settings are loaded
    if (generalSettings) {
      initializeCheckout();
    }
  }, [generalSettings]);

  // Direct to payment page in new window if needed
  const handleOpenPaymentPage = () => {
    if (paymentPageUrl) {
      window.open(paymentPageUrl, '_blank');
    }
  };

  return (
    <div className="containe mx-10 px-4 py-6">
      <Link 
        href="/" 
        className="inline-flex items-center text-xs font-medium text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="mr-1 h-3 w-3" />
        Ana Sayfaya Dön
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <div className="mb-4">
            <h4 className="text-xl font-bold mb-1">Premium İçerik Erişimi</h4>
            <p className="text-gray-600 text-sm">
              Tek seferlik ödeme ile tüm premium içeriklere erişin
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <Card className="shadow-sm mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Ödeme</CardTitle>
              <CardDescription className="text-xs">
                Güvenli ödeme için iyzico altyapısı kullanılmaktadır
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-orange-500 rounded-full border-t-transparent"></div>
                </div>
              ) : paymentPageUrl ? (
                <div className="space-y-4">
                  {/* Option 1: iframe */}
                  <div className="rounded-md border overflow-hidden" style={{ height: '800px' }}>
                    {!iframeLoaded && (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin h-8 w-8 border-4 border-orange-500 rounded-full border-t-transparent"></div>
                      </div>
                    )}
                    <iframe 
                      ref={iframeRef}
                      src={paymentPageUrl}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      onLoad={() => setIframeLoaded(true)}
                      className={iframeLoaded ? 'block' : 'hidden'}
                      name="iyzico-checkout-frame"
                      id="iyzico-checkout-frame"
                      frameBorder="0"
                      allowFullScreen={true}
                    />
                  </div>
                  
                  {/* Option 2: Direct link */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      {iframeLoaded 
                        ? "İframe'de sorun yaşıyorsanız, ödeme sayfasını ayrı bir pencerede açabilirsiniz:"
                        : "Ödeme sayfasını ayrı bir pencerede açabilirsiniz:"}
                    </p>
                    <Button 
                      onClick={handleOpenPaymentPage}
                      className="bg-orange-500 hover:bg-orange-600 inline-flex items-center"
                    >
                      Ödeme Sayfasını Aç
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : generalSettings ? (
                <div className="text-center py-6">
                  <p className="text-red-600 text-sm mb-3">Ödeme sayfası yüklenemedi</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline"
                  >
                    Yeniden Dene
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600 text-sm mb-3">Ödeme sistemi yapılandırması yükleniyor...</p>
                  <div className="animate-spin h-8 w-8 border-4 border-orange-500 rounded-full border-t-transparent mx-auto"></div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="text-xs text-gray-500 text-center">
            <p>iyzico güvenli ödeme altyapısı kullanılmaktadır.</p>
            <p className="mt-1">Test kartı: 5528790000000008, Son kullanma: 12/30, CVC: 123</p>
          </div>
        </div>
        
        <div className="md:col-span">
          <Card className="mt-22">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Premium Erişim</CardTitle>
              <CardDescription className="text-sm">
                Tek seferlik ödeme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-3 rounded-lg border border-amber-100 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-sm">Premium Erişim</h5>
                    <p className="text-xs text-gray-600">Kaliteli içerik</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">₺149</div>
                    <p className="text-xs text-gray-600">tek ödeme</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-medium text-xs">Premium içerikler:</h5>
                
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0" />
                  <span className="text-xs">Tüm özel makalelere erişim</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0" />
                  <span className="text-xs">Özel içerik koleksiyonları</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 