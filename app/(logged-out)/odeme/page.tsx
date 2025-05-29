"use client";

import { useState } from "react";
import { ArrowLeft, Check, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PremiumCheckout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardInfo, setCardInfo] = useState({
    cardHolderName: "",
    cardNumber: "",
    expireMonth: "",
    expireYear: "",
    cvc: "",
  });

  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCardInfo((prev) => ({ ...prev, [id]: value }));
  };

  // Kart numarası formatlayıcı
  const formatCardNumber = (value: string) => {
    if (!value) return value;
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatCardNumber(e.target.value);
    setCardInfo((prev) => ({ ...prev, cardNumber: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Kart bilgilerini temizle
      const cleanCardNumber = cardInfo.cardNumber.replace(/\s+/g, '');
      
      // Ödeme isteği
      const response = await fetch("/api/checkout/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardInfo: {
            ...cardInfo,
            cardNumber: cleanCardNumber,
          }
        }),
      });
      
      const data = await response.json();
      console.log("Payment response:", data);
      
      if (data.status === 'success') {
        // Başarılı ödeme
        router.push("/checkout/premium/success");
      } else {
        // Başarısız ödeme
        setError(data.errorMessage || "Ödeme işlemi başarısız oldu");
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError("Ödeme işlemi sırasında bir hata oluştu");
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6">
      <Link 
        href="/" 
        className="inline-flex items-center text-xs font-medium text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="mr-1 h-3 w-3" />
        Ana Sayfaya Dön
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
              <CardTitle className="text-base">Ödeme Bilgileri</CardTitle>
              <CardDescription className="text-xs">
                Güvenli ödeme için kart bilgilerinizi girin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-3">
                  {/* Kart Bilgileri */}
                  <div>
                    <Label htmlFor="cardHolderName" className="text-xs text-gray-700">Kart Sahibi</Label>
                    <Input 
                      id="cardHolderName" 
                      placeholder="Kart Üzerindeki İsim" 
                      value={cardInfo.cardHolderName}
                      onChange={handleCardInfoChange}
                      required 
                      className="h-8 text-sm text-black mb-3" 
                    />
                    
                    <div className="relative">
                      <Label htmlFor="cardNumber" className="text-xs text-gray-700">Kart Numarası</Label>
                      <Input 
                        id="cardNumber" 
                        placeholder="1234 5678 9012 3456" 
                        value={cardInfo.cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                        required 
                        className="h-8 text-sm text-black mb-3 pr-8" 
                      />
                      <CreditCard className="absolute right-2 bottom-2 h-4 w-4 text-gray-400" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor="expireMonth" className="text-xs text-gray-700">Ay</Label>
                        <Input 
                          id="expireMonth" 
                          placeholder="MM" 
                          maxLength={2}
                          value={cardInfo.expireMonth}
                          onChange={handleCardInfoChange}
                          required 
                          className="h-8 text-sm text-black" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="expireYear" className="text-xs text-gray-700">Yıl</Label>
                        <Input 
                          id="expireYear" 
                          placeholder="YY" 
                          maxLength={2}
                          value={cardInfo.expireYear}
                          onChange={handleCardInfoChange}
                          required 
                          className="h-8 text-sm text-black" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvc" className="text-xs text-gray-700">CVC</Label>
                        <Input 
                          id="cvc" 
                          placeholder="123" 
                          maxLength={3}
                          value={cardInfo.cvc}
                          onChange={handleCardInfoChange}
                          required 
                          className="h-8 text-sm text-black" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Ödeme İşleniyor...
                      </div>
                    ) : (
                      "Ödemeyi Tamamla (₺149)"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <div className="text-xs text-gray-500 text-center">
            <p>Bu ödeme sayfası test amaçlıdır. Gerçek bir ödeme alınmayacaktır.</p>
            <p className="mt-1">Test kartı: 5528790000000008, Son kullanma: 12/30, CVC: 123</p>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Card className="mt-30">
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