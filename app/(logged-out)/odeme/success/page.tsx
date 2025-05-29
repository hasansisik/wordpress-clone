"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { setPremiumStatus, getMyProfile } from "@/redux/actions/userActions";
import { AppDispatch, RootState } from "@/redux/store";

export default function SuccessPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [redirecting, setRedirecting] = useState(false);
  const [premiumUpdated, setPremiumUpdated] = useState(false);
  const { user, loading } = useSelector((state: RootState) => state.user);

  // Profil bilgilerini bir kez al
  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  // Premium durumunu sadece bir kez güncelle
  useEffect(() => {
    if (!premiumUpdated && !loading && user?._id) {
      dispatch(setPremiumStatus(true))
        .then(() => {
          setPremiumUpdated(true);
        });
    }
  }, [dispatch, user, loading, premiumUpdated]);

  // 5 saniye sonra ana sayfaya yönlendir
  useEffect(() => {
    const timer = setTimeout(() => {
      setRedirecting(true);
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="container max-w-lg mx-auto px-4 py-8">
      <Link 
        href="/" 
        className="inline-flex items-center text-xs font-medium text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="mr-1 h-3 w-3" />
        Ana Sayfaya Dön
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        
        <h1 className="text-xl font-bold mb-2">Ödeme Başarılı!</h1>
        <p className="text-gray-600 mb-6">
          Premium içerik erişiminiz aktif edilmiştir. Tüm premium içeriklere artık erişebilirsiniz.
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
        
        {redirecting ? (
          <div className="text-sm text-gray-500">
            Ana sayfaya yönlendiriliyorsunuz...
          </div>
        ) : (
          <Button 
            onClick={() => router.push("/")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            Ana Sayfaya Dön
          </Button>
        )}
      </div>
    </div>
  );
} 