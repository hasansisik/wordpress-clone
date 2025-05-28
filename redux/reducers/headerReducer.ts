import { createReducer } from "@reduxjs/toolkit";
import { getHeader, updateHeader } from "../actions/headerActions";

interface HeaderState {
  header: any;
  loading: boolean;
  error: string | null;
  success?: boolean;
  message?: string;
}

const initialState: HeaderState = {
  header: {
    logo: {
      src: "/assets/imgs/template/favicon.svg",
      alt: "infinia",
      text: "Infinia"
    },
    links: {
      freeTrialLink: {
        href: "/",
        text: "Giris"
      }
    },
    mainMenu: [
      {
        _id: "1",
        name: "Anasayfa",
        link: "/",
        order: 0
      },
      {
        _id: "3",
        name: "Hizmetler",
        link: "/hizmetler",
        order: 1
      },
      {
        _id: "4",
        name: "Blog",
        link: "/blog",
        order: 2
      },
      {
        _id: "5",
        name: "İletişim",
        link: "/iletisim",
        order: 3
      },
      {
        _id: "2",
        name: "Hakkımızda",
        link: "/hakkimizda",
        order: 4
      }
    ],
    socialLinks: [],
    topBarItems: [],
    showDarkModeToggle: false,
    showActionButton: false,
    actionButtonText: "Giris",
    actionButtonLink: "/",
    headerComponent: "Header1",
    workingHours: "Mon-Fri: 10:00am - 09:00pm",
    topBarColor: "#3b71fe",
    topBarTextColor: "#ffffff",
    mobileMenuButtonColor: "transparent",
    phoneIconBgColor: "#3b71fe",
    phoneIconColor: "#ffffff",
    phoneQuestionText: "Have Any Questions?"
  },
  loading: false,
  error: null,
};

export const headerReducer = createReducer(initialState, (builder) => {
  builder
    // Get Header
    .addCase(getHeader.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getHeader.fulfilled, (state, action) => {
      state.loading = false;
      state.header = action.payload;
      state.error = null;
    })
    .addCase(getHeader.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Update Header
    .addCase(updateHeader.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateHeader.fulfilled, (state, action) => {
      state.loading = false;
      state.header = action.payload;
      state.success = true;
      state.message = "Header başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateHeader.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
});

export default headerReducer; 