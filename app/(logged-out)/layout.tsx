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
import { generateMetadata as generateSeoMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSeoMetadata("general")

export default function LogoutLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <>{children}</>;
  }
