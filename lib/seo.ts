import { Metadata } from "next";

export interface SeoData {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

const defaultSeoData: Record<string, SeoData> = {
  home: {
    title: "Ana Sayfa | WordPress Clone",
    description: "WordPress Clone ile web sitenizi hızlı ve kolay bir şekilde oluşturun.",
    keywords: "wordpress, clone, website, cms, blog",
    ogTitle: "WordPress Clone | Modern CMS",
    ogDescription: "WordPress Clone ile web sitenizi hızlı ve kolay bir şekilde oluşturun.",
    ogImage: "/og-image.jpg",
  },
  blog: {
    title: "Blog | WordPress Clone",
    description: "En son makalelerimizi keşfedin ve bilgi birikimimizden yararlanın.",
    keywords: "blog, makaleler, wordpress, içerik, yazılar",
    ogTitle: "Blog Makaleleri | WordPress Clone",
    ogDescription: "En son makalelerimizi keşfedin ve bilgi birikimimizden yararlanın.",
    ogImage: "/blog-og-image.jpg",
  },
  about: {
    title: "Hakkımızda | WordPress Clone",
    description: "WordPress Clone'un arkasındaki hikayeyi ve ekibi tanıyın.",
    keywords: "hakkımızda, şirket, ekip, misyon, vizyon",
    ogTitle: "Hakkımızda | WordPress Clone",
    ogDescription: "WordPress Clone'un arkasındaki hikayeyi ve ekibi tanıyın.",
    ogImage: "/about-og-image.jpg",
  },
  contact: {
    title: "İletişim | WordPress Clone",
    description: "Bizimle iletişime geçin. Sorularınızı yanıtlamaktan memnuniyet duyarız.",
    keywords: "iletişim, bize ulaşın, adres, telefon, email",
    ogTitle: "İletişim | WordPress Clone",
    ogDescription: "Bizimle iletişime geçin. Sorularınızı yanıtlamaktan memnuniyet duyarız.",
    ogImage: "/contact-og-image.jpg",
  },
  service: {
    title: "Hizmetlerimiz | WordPress Clone",
    description: "Sunduğumuz profesyonel hizmetleri keşfedin ve ihtiyaçlarınıza uygun çözümleri bulun.",
    keywords: "hizmetler, çözümler, servisler, örnekler, işler",
    ogTitle: "Hizmetlerimiz | WordPress Clone",
    ogDescription: "Sunduğumuz profesyonel hizmetleri keşfedin ve ihtiyaçlarınıza uygun çözümleri bulun.",
    ogImage: "/services-og-image.jpg",
  },
};

// Storage might be upgraded to a database or API call in the future
export function getSeoData(page: string): SeoData {
  return defaultSeoData[page] || defaultSeoData.home;
}

export function generateMetadata(page: string): Metadata {
  const seoData = getSeoData(page);
  
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    openGraph: {
      title: seoData.ogTitle || seoData.title,
      description: seoData.ogDescription || seoData.description,
      images: seoData.ogImage ? [seoData.ogImage] : [],
    },
    ...(seoData.canonicalUrl && {
      alternates: {
        canonical: seoData.canonicalUrl,
      },
    }),
  };
} 