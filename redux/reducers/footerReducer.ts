import { createReducer } from "@reduxjs/toolkit";
import { getFooter, updateFooter } from "../actions/footerActions";

interface FooterState {
  footer: any;
  loading: boolean;
  error: string | null;
  success?: boolean;
  message?: string;
}

const initialState: FooterState = {
  footer: {
    logo: {
      src: "/assets/imgs/template/favicon.svg",
      alt: "infinia",
      text: "Infinia"
    },
    copyright: "Copyright © 2024 Infinia. All Rights Reserved",
    description: "You may also realize cost savings from your energy efficient choices in your custom home. Federal tax credits for some green materials can allow you to deduct as much.",
    socialLinks: [
      {
        _id: "1",
        name: "Facebook",
        link: "https://www.facebook.com/",
        order: 0
      },
      {
        _id: "2",
        name: "Twitter",
        link: "https://twitter.com/",
        order: 1
      },
      {
        _id: "3",
        name: "LinkedIn",
        link: "https://www.linkedin.com/",
        order: 2
      },
      {
        _id: "4",
        name: "Instagram",
        link: "https://www.instagram.com/",
        order: 3
      }
    ],
    columns: [
      {
        _id: "1",
        title: "Company",
        order: 0,
        links: [
          {
            _id: "1",
            name: "Mission & Vision",
            link: "#",
            order: 0
          },
          {
            _id: "2",
            name: "Our Team",
            link: "#",
            order: 1
          },
          {
            _id: "3",
            name: "Careers",
            link: "#",
            order: 2
          }
        ]
      },
      {
        _id: "2",
        title: "Resource",
        order: 1,
        links: [
          {
            _id: "1",
            name: "Knowledge Base",
            link: "#",
            order: 0
          },
          {
            _id: "2",
            name: "Documents",
            link: "#",
            order: 1
          }
        ]
      }
    ],
    contactItems: {
      address: "0811 Erdman Prairie, Joaville CA",
      phone: "+01 (24) 568 900",
      email: "contact@infinia.com",
      hours: "Mon-Fri: 9am-5pm"
    },
    instagramPosts: [],
    appLinks: [],
    showAppLinks: false,
    showInstagram: false,
    showPrivacyLinks: true,
    showSocialLinks: true,
    privacyLinks: [
      {
        _id: "1",
        name: "Privacy policy",
        link: "#",
        order: 0
      },
      {
        _id: "2",
        name: "Cookies",
        link: "#",
        order: 1
      },
      {
        _id: "3",
        name: "Terms of service",
        link: "#",
        order: 2
      }
    ],
    footerComponent: "Footer1"
  },
  loading: false,
  error: null,
};

export const footerReducer = createReducer(initialState, (builder) => {
  builder
    // Get Footer
    .addCase(getFooter.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getFooter.fulfilled, (state, action) => {
      state.loading = false;
      state.footer = action.payload;
      state.error = null;
    })
    .addCase(getFooter.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Update Footer
    .addCase(updateFooter.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateFooter.fulfilled, (state, action) => {
      state.loading = false;
      state.footer = action.payload;
      state.success = true;
      state.message = "Footer başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateFooter.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
});

export default footerReducer; 