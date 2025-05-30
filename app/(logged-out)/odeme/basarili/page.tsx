"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Gift, Star, Award, Zap, ArrowLeft, Check, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setPremiumStatus, getMyProfile } from "@/redux/actions/userActions";
import { AppDispatch, RootState } from "@/redux/store";

// Import required for confetti effect
const importConfetti = () => import('canvas-confetti');

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [countdown, setCountdown] = useState(10);
  const [showConfetti, setShowConfetti] = useState(false);
  const [premiumUpdated, setPremiumUpdated] = useState(false);
  const { user, loading } = useSelector((state: RootState) => state.user);
  const [isValidPayment, setIsValidPayment] = useState(false);
  const [validationError, setValidationError] = useState(false);

  // Check if this is a valid payment completion
  useEffect(() => {
    // Check for payment token in URL params
    const paymentToken = searchParams.get('token');
    // Check for payment validation in session storage (set by callback)
    const paymentValidation = sessionStorage.getItem('validPaymentCompletion');
    
    // Validate the payment - either token exists or session has validation
    if (paymentToken || paymentValidation === 'true') {
      setIsValidPayment(true);
      
      // Clear session storage validation
      if (paymentValidation) {
        sessionStorage.removeItem('validPaymentCompletion');
      }
      
      // Only trigger confetti for valid payments
      triggerConfetti();
    } else {
      // Not a valid payment completion
      setValidationError(true);
      console.warn("Invalid payment access attempt");
    }
  }, [searchParams]);

  // Get user profile
  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  // Update premium status only for valid payments
  useEffect(() => {
    if (isValidPayment && !premiumUpdated && !loading && user?._id) {
      dispatch(setPremiumStatus(true))
        .then(() => {
          setPremiumUpdated(true);
          console.log("Premium status updated successfully");
        })
        .catch((error) => {
          console.error("Error updating premium status:", error);
        });
    }
  }, [dispatch, user, loading, premiumUpdated, isValidPayment]);

  // Trigger confetti animation
  const triggerConfetti = async () => {
    try {
      const confetti = (await importConfetti()).default;
      
      // Initial big burst
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Set repeated confetti bursts from sides
      setShowConfetti(true);
      
      // Side confetti bursts every 2.5 seconds
      const confettiInterval = setInterval(async () => {
        const confetti = (await importConfetti()).default;
        
        // Left side
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        
        // Right side
        setTimeout(async () => {
          const confetti = (await importConfetti()).default;
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        }, 250);
      }, 2500);

      // Clean up interval
      return () => clearInterval(confettiInterval);
    } catch (error) {
      console.error("Error triggering confetti:", error);
    }
  };

  // Countdown and redirect
  useEffect(() => {
    // Only start countdown for valid payments
    if (!isValidPayment) return;
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, [router, isValidPayment]);

  // For invalid access, show error message
  if (validationError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="shadow-md border-red-100 max-w-md w-full">
          <CardHeader className="pb-2 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <CardTitle className="text-xl">Geçersiz Erişim</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Bu sayfaya doğrudan erişmeye çalışıyorsunuz. Ödeme işlemi tamamlanmadan bu sayfaya erişilemez.
            </p>
            
            <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
              <Link href="/odeme">Ödeme Sayfasına Dön</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col px-4">
      {/* Header with back button */}
      <div className="pt-6 px-4 z-10">
        <Link 
          href="/" 
          className="inline-flex items-center text-xs font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-1 h-3 w-3" />
          Ana Sayfaya Dön
        </Link>
      </div>
      
      {/* Success animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-float absolute top-20 left-1/4 text-green-300 opacity-50">
          <Gift size={32} />
        </div>
        <div className="animate-float-delayed absolute top-40 right-1/4 text-yellow-300 opacity-50">
          <Star size={40} />
        </div>
        <div className="animate-float-slow absolute bottom-40 left-1/3 text-orange-300 opacity-50">
          <Award size={48} />
        </div>
        <div className="animate-float-slower absolute bottom-20 right-1/3 text-blue-300 opacity-50">
          <Zap size={36} />
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <Card className="shadow-xl border-green-200 max-w-md w-full transform transition-all duration-500 hover:scale-105">
          <CardHeader className="pb-2 text-center relative">
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-lg animate-pulse">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <div className="mt-14">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 text-transparent bg-clip-text">Ödeme Başarılı!</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <div className="py-4 px-2">
              <p className="text-gray-700 mb-6 leading-relaxed">
                Premium içerik erişiminiz <span className="font-semibold text-green-600">başarıyla aktifleştirildi</span>. 
                Tüm premium içeriklere artık sınırsız erişebilirsiniz.
              </p>
              
              <div className="p-4 bg-gray-50 rounded-lg mb-6">
                <h2 className="font-medium text-sm mb-2">Premium Abonelik Detayları:</h2>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                    <span>Tüm özel makalelere sınırsız erişim</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                    <span>Premium içerik koleksiyonlarına tam erişim</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">
                  <span className="countdown-text font-medium text-green-600">{countdown}</span> saniye içinde otomatik olarak ana sayfaya yönlendirileceksiniz.
                </p>
              </div>
              
              <Button 
                onClick={() => router.push("/")}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md transition-all hover:shadow-lg"
              >
                Hemen Ana Sayfaya Dön
              </Button>
              
              {/* Premium status indicator */}
              <div className="mt-4 text-xs text-gray-500">
                {loading ? (
                  <p>Premium durumu güncelleniyor...</p>
                ) : premiumUpdated ? (
                  <p className="text-green-600">Premium erişim durumunuz başarıyla güncellendi!</p>
                ) : (
                  <p>Premium erişim durumunuz güncelleniyor...</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Add floating animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out 1s infinite;
        }
        .animate-float-slow {
          animation: float 7s ease-in-out 0.5s infinite;
        }
        .animate-float-slower {
          animation: float 8s ease-in-out 1.5s infinite;
        }
        .countdown-text {
          font-size: 1.25rem;
        }
      `}</style>
    </div>
  );
} 