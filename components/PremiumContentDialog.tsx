"use client";

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { getMyProfile } from "@/redux/actions/userActions";
import { useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award, Lock } from "lucide-react";

interface PremiumContentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const PremiumContentDialog = ({ 
  isOpen, 
  onClose, 
  title = "Premium İçerik2"
}: PremiumContentDialogProps) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  
  // Kullanıcı profil bilgilerini güncelle
  useEffect(() => {
    if (isOpen) {
      // Dialog açılırsa kullanıcı profilini yeniden kontrol et
      dispatch(getMyProfile());
    }
  }, [dispatch, isOpen]);
  
  // Premium kontrolü - === true ile kesin kontrol
  const isPremiumUser = isAuthenticated && user?.isPremium === true;
  
  // Eğer kullanıcı premium ise, dialog'u gösterme
  if (isPremiumUser) {
    if (isOpen) {
      onClose();
    }
    return null;
  }
  
  const handleCheckout = () => {
    onClose();
    router.push("/odeme");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-5 rounded-xl border-amber-100 justify-center">
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <Award className="h-5 w-5 text-amber-600" />
          </div>
          <DialogTitle className="text-xl font-medium">Premium İçerik</DialogTitle>
          <DialogDescription className="text-base">
            Bu premium içeriğe erişmek için özel üyelik gerekiyor.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-3">
          <div className="flex items-center gap-2 bg-amber-50 p-3 rounded-lg text-sm">
            <Lock className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <p className="text-amber-800 m-0">
              Premium içeriklerle bilgi ve analizlere derinlemesine erişim kazanın.
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex-col gap-3 sm:flex-row sm:justify-between pt-1">
          <Button 
            onClick={handleCheckout}
            className="rounded bg-orange-500 text-white"
            size="lg"
          >
            Premium Erişim Al
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="rounded  text-black"
            size="lg"
          >
            Vazgeç
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumContentDialog; 