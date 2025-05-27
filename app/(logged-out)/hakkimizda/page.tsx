import Contact1 from "@/components/sections/Contact1";
import Cta1 from "@/components/sections/Cta1";
import Link from "next/link";
import { Metadata } from "next";
import { store } from "@/redux/store";
import { getGeneral } from "@/redux/actions/generalActions";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";
import Blog1 from "@/components/sections/Blog1";
import Services2 from "@/components/sections/Services2";

// Dinamik metadata oluşturma
export async function generateMetadata(): Promise<Metadata> {
  // Redux store'a genel verileri yükle
  await store.dispatch(getGeneral());
  
  // SEO metadatasını oluştur
  return generateSeoMetadata("about");
}

export default function PageAbout3() {
  return (
    <>
      {/*CTA 1*/}
      <Cta1 />
	    {/*Services 2*/}
      <Services2 />
      {/* Contact 3*/}
      <Contact1 />
      {/*Blog 1*/}
      <Blog1 />
    </>
  );
}
