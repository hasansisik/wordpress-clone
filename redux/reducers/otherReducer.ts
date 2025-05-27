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
      title: "Our Latest Articles",
      subtitle: "Explore the insights and trends shaping our industry",
      seeAllLink: "#"
    },
    blog2: {
      badge: "From Blog",
      title: "Our Latest News and Articles",
      subtitle: "Explore the insights and trends shaping our industry. 🔥",
      seeAllLink: "#",
      bgLine: "/assets/imgs/blog-2/img-bg-line.png"
    },
    blog3: {
      title: "Related Posts",
      bgLine: "/assets/imgs/team-1/bg-line.png"
    },
    blog5: {
      title: "Trending News",
      subtitle: "Explore the insights and trends shaping our industry"
    },
    contact1: {
      badge: "İletişime Geçin",
      title: "Ekibimiz İle İletişime Geçin",
      description: "Yardıma hazır uzmanlarımızla kapsamlı bir hizmet ajansıyız. <br />24 saat içinde sizinle iletişime geçeceğiz.",
      formTitle: "Mesaj Bırakın",
      chatTitle: "Bizimle sohbet edin",
      chatDescription: "Destek ekibimiz 7/24 hizmetinizdedir",
      whatsappLink: "#",
      viberLink: "#",
      messengerLink: "#",
      emailTitle: "Bize e-posta gönderin",
      emailDescription: "Ekibimiz sorularınıza hızlı bir şekilde yanıt verecektir",
      supportEmail: "destek@infinia.com",
      salesEmail: "satis@infinia.com",
      inquiryTitle: "Daha fazla bilgi için",
      inquiryDescription: "Anında yardım için bize ulaşın",
      phoneNumber: "+01 (24) 568 900",
      services: [
        "Araştırma planlaması",
        "Finans Danışmanlığı",
        "İş promosyonu",
        "İş Danışmanlığı",
        "Finans Danışmanlığı",
        "İş promosyonu"
      ]
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