"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, CreditCard, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function PremiumCheckout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      // Redirect to success page
      router.push("/checkout/success");
    }, 2000);
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
            <h1 className="text-xl font-bold mb-1">Premium İçerik Erişimi</h1>
            <p className="text-gray-600 text-sm">
              Tek seferlik ödeme ile tüm premium içeriklere erişin
            </p>
          </div>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Ödeme Bilgileri</CardTitle>
              <CardDescription className="text-xs">
                Güvenli ödeme için bilgilerinizi girin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-xs">E-posta</Label>
                    <Input id="email" type="email" placeholder="ornek@mail.com" required className="h-8 text-sm text-black" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="firstName" className="text-xs">Ad</Label>
                      <Input id="firstName" placeholder="Ad" required className="h-8 text-sm text-black" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="lastName" className="text-xs">Soyad</Label>
                      <Input id="lastName" placeholder="Soyad" required className="h-8 text-sm text-black" />
                    </div>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cardNumber" className="text-xs">Kart Numarası</Label>
                      <div className="flex items-center space-x-1">
                        <Lock className="h-3 w-3 text-gray-500" />
                        <span className="text-[10px] text-gray-500">Güvenli</span>
                      </div>
                    </div>
                    <div className="relative">
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" required className="h-8 text-sm text-black" />
                      <CreditCard className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="expiry" className="text-xs">Son Kullanma</Label>
                      <Input id="expiry" placeholder="AA / YY" required className="h-8 text-sm text-black" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="cvc" className="text-xs">CVC</Label>
                      <Input id="cvc" placeholder="123" required className="h-8 text-sm text-black" />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded mt-5"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        İşleniyor...
                      </div>
                    ) : (
                      "Premium Erişim Satın Al (₺149)"
                    )}
                  </Button>
                  
                  
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className=" mt-30">
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