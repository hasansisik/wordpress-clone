import "@/public/assets/css/vendors/bootstrap.min.css"
import "@/public/assets/css/vendors/swiper-bundle.min.css"
import "@/public/assets/css/vendors/aos.css"
import "@/public/assets/css/vendors/odometer.css"
import "@/public/assets/css/vendors/carouselTicker.css"
import "@/public/assets/css/vendors/magnific-popup.css"
import "@/public/assets/fonts/bootstrap-icons/bootstrap-icons.min.css"
import "@/public/assets/fonts/boxicons/boxicons.min.css"
import "@/public/assets/fonts/satoshi/satoshi.css"
import "@/public/assets/css/main.css"

import "@/node_modules/react-modal-video/css/modal-video.css"

import type { Metadata } from "next"
import { store } from "@/redux/store"
import { getGeneral } from "@/redux/actions/generalActions"
import { generateMetadata as generateSeoMetadata } from "@/lib/seo"
import Layout from "@/components/layout/Layout"
import WhatsAppButton from "@/components/common/WhatsAppButton"

// Dinamik metadata oluşturma
export async function generateMetadata(): Promise<Metadata> {
  // Redux store'a genel verileri yükle
  await store.dispatch(getGeneral())
  
  // SEO metadatasını oluştur
  return generateSeoMetadata("general")
}

export default function LogoutLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <Layout useGlobalTheme={true}>
        {children}
        <WhatsAppButton />
      </Layout>
    );
  }
