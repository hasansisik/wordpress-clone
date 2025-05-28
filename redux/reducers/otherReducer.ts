import { createReducer } from "@reduxjs/toolkit";
import { getOther, updateOther } from "../actions/otherActions";

interface OtherState {
  other: any;
  loading: boolean;
  error: string | null;
  success?: boolean;
  message?: string;
}

const initialState: OtherState = {
  other: {
    activeOther: "blog1",
    blog1: {
      badge: "From Blog",
      badgeVisible: true,
      badgeBackgroundColor: "#f1f0fe",
      badgeTextColor: "#6342EC",
      title: "Our Latest Articles",
      titleColor: "#111827",
      subtitle: "Explore the insights and trends shaping our industry",
      subtitleColor: "#6E6E6E",
      seeAllLink: "#",
      backgroundColor: "#ffffff"
    },
    blog2: {
      badge: "From Blog",
      badgeVisible: true,
      badgeBackgroundColor: "#f1f0fe",
      badgeTextColor: "#6342EC",
      title: "Our Latest News and Articles",
      titleColor: "#111827",
      subtitle: "Explore the insights and trends shaping our industry. 🔥",
      subtitleColor: "#6E6E6E",
      seeAllLink: "#",
      seeAllLinkText: "See all articles",
      seeAllButtonVisible: true,
      seeAllButtonColor: "#111827",
      backgroundColor: "#ffffff",
      bgLine: "/assets/imgs/blog-2/img-bg-line.png"
    },
    blog3: {
      title: "Related Posts",
      titleColor: "#111827",
      backgroundColor: "#ffffff",
      bgLine: "/assets/imgs/team-1/bg-line.png"
    },
    blog5: {
      title: "Trending News",
      titleColor: "#111827",
      subtitle: "Explore the insights and trends shaping our industry",
      subtitleColor: "#6E6E6E",
      backgroundColor: "#ffffff"
    },
    services2: {
      heading: {
        tag: "What we offer",
        tagVisible: true,
        tagBackgroundColor: "#f1f0fe",
        tagTextColor: "#6342EC",
        title: "Let's Discover Our Service <span class=\"fw-bold\">Our Service <br class=\"d-none d-lg-inline\" /> Features</span> Charter",
        titleColor: "#111827"
      },
      tagImage: "/assets/imgs/features-1/dots.png",
      services: [
        {
          icon: "/assets/imgs/service-2/icon-1.svg",
          title: "Business Analytics",
          description: "A business consultant provides expert advice and guidance to businesses on various aspects to improve their performance, efficiency, and profitability.",
          iconBgColor: "bg-primary-soft"
        },
        {
          icon: "/assets/imgs/service-2/icon-2.svg",
          title: "Investment",
          description: "A business consultant provides expert advice and guidance to businesses on various aspects to improve their performance, efficiency, and profitability.",
          iconBgColor: "bg-success-soft"
        },
        {
          icon: "/assets/imgs/service-2/icon-3.svg",
          title: "Tax Advisory",
          description: "A business consultant provides expert advice and guidance to businesses on various aspects to improve their performance, efficiency, and profitability.",
          iconBgColor: "bg-warning-soft"
        },
        {
          icon: "/assets/imgs/service-2/icon-4.svg",
          title: "Automated reports",
          description: "A business consultant provides expert advice and guidance to businesses on various aspects to improve their performance, efficiency, and profitability.",
          iconBgColor: "bg-info-soft"
        },
        {
          icon: "/assets/imgs/service-2/icon-5.svg",
          title: "Funnel optimization",
          description: "A business consultant provides expert advice and guidance to businesses on various aspects to improve their performance, efficiency, and profitability.",
          iconBgColor: "bg-danger-soft"
        },
        {
          icon: "/assets/imgs/service-2/icon-6.svg",
          title: "Integrations",
          description: "A business consultant provides expert advice and guidance to businesses on various aspects to improve their performance, efficiency, and profitability.",
          iconBgColor: "bg-secondary-soft"
        }
      ],
      backgroundColor: "#ffffff",
      backgroundImage: "/assets/imgs/service-2/bg-line.png",
      buttons: {
        primary: {
          text: "Explore Now",
          link: "/page-services-1",
          btnClass: "btn-gradient",
          iconClass: "stroke-white",
          visible: true,
          backgroundColor: "#6342EC",
          textColor: "#FFFFFF"
        },
        secondary: {
          text: "Contact Us",
          link: "/page-contact-1",
          btnClass: "btn-outline-secondary",
          iconClass: "stroke-dark",
          visible: true,
          backgroundColor: "transparent",
          textColor: "#111827"
        }
      }
    },
    contact1: {
      badge: "İletişime Geçin",
      badgeVisible: true,
      title: "Ekibimiz İle İletişime Geçin",
      titleColor: "#111827",
      description: "Yardıma hazır uzmanlarımızla kapsamlı bir hizmet ajansıyız. <br />24 saat içinde sizinle iletişime geçeceğiz.",
      descriptionColor: "#6E6E6E",
      backgroundColor: "#ffffff",
      formTitle: "Mesaj Bırakın",
      chatTitle: "Bizimle sohbet edin",
      chatDescription: "Destek ekibimiz 7/24 hizmetinizdedir",
      whatsappLink: "#",
      viberLink: "#",
      messengerLink: "#",
      emailTitle: "Bize e-posta gönderin",
      emailDescription: "Ekibimiz sorularınıza hızlı bir şekilde yanıt verecektir",
      supportEmail: "destek@infinia.com",
      showEmail: true,
      inquiryTitle: "Daha fazla bilgi için",
      inquiryDescription: "Anında yardım için bize ulaşın",
      phoneNumber: "+01 (24) 568 900",
      showPhone: true,
      addressTitle: "Adresimiz",
      addressDescription: "Bizi ziyaret edin",
      address: "Atatürk Cad. No:123, 34000 İstanbul, Türkiye",
      showAddress: true,
      services: [
        "Araştırma planlaması",
        "Finans Danışmanlığı",
        "İş promosyonu",
        "İş Danışmanlığı",
        "Finans Danışmanlığı",
        "İş promosyonu"
      ],
      buttonColor: "#6342EC",
      buttonTextColor: "#FFFFFF",
      badgeColor: "rgba(99, 66, 236, 0.1)"
    },
    services5: {
      title: "Explore Our Projects",
      titleColor: "#333333",
      subtitle: "What we offers",
      subtitleVisible: true,
      subtitleBackgroundColor: "#f1f0fe",
      subtitleTextColor: "#6342EC",
      description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      descriptionColor: "#6E6E6E",
      buttonText: "Get Free Quote",
      buttonVisible: true,
      buttonLink: "#",
      linkText: "How We Work",
      linkVisible: true,
      linkUrl: "#",
      backgroundColor: "#ffffff",
      buttonColor: "#6342EC",
      buttonTextColor: "#FFFFFF",
      filterAllText: "Hepsi",
      filterButtonColor: "#6342EC",
      filterButtonTextColor: "#FFFFFF"
    },
    project2: {
      title: "Our featured projects",
      titleColor: "#333333",
      subtitle: "Recent work",
      subtitleVisible: true,
      subtitleBackgroundColor: "rgba(99, 66, 236, 0.1)",
      subtitleTextColor: "#6342EC",
      description: "⚡Don't miss any contact. Stay connected.",
      descriptionColor: "#6E6E6E",
      backgroundColor: "#f8f9fa"
    }
  },
  loading: false,
  error: null,
};

export const otherReducer = createReducer(initialState, (builder) => {
  builder
    // Get Other
    .addCase(getOther.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getOther.fulfilled, (state, action) => {
      state.loading = false;
      state.other = action.payload;
      state.error = null;
    })
    .addCase(getOther.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Update Other
    .addCase(updateOther.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateOther.fulfilled, (state, action) => {
      state.loading = false;
      state.other = action.payload;
      state.success = true;
      state.message = "Diğer bileşenler başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateOther.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
});

export default otherReducer; 