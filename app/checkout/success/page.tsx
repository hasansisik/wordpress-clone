"use client";

import { useEffect } from "react";
import { Award, Check, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function CheckoutSuccess() {
  useEffect(() => {
    // Simpler confetti effect
    const duration = 2 * 1000;
    const end = Date.now() + duration;
    
    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f59e0b', '#d97706', '#b45309']
      });
      
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f59e0b', '#d97706', '#b45309']
      });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm text-center space-y-4 bg-white p-6 rounded-lg shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <Award className="h-8 w-8 text-amber-600" />
        </div>
        
        <h1 className="text-xl font-bold">Premium Erişim Aktif!</h1>
        
        <p className="text-sm text-gray-600">
          Artık tüm premium içeriklere erişebilirsiniz.
        </p>
        
        <div className="bg-amber-50 rounded-md p-4 mt-4">
          <h2 className="text-sm font-medium mb-2 text-amber-800">Özel içerikler:</h2>
          
          <div className="space-y-2 text-left">
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs">Tüm özel makalelere erişim</span>
            </div>
            
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs">Detaylı analizler ve raporlar</span>
            </div>
            
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs">Özel içerik koleksiyonları</span>
            </div>
          </div>
        </div>
        
        <Button asChild className="mt-4 w-full h-9 text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Ana Sayfaya Dön
          </Link>
        </Button>
      </div>
    </div>
  );
} 