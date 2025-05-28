import { createReducer } from "@reduxjs/toolkit";
import { getCta, updateCta } from "../actions/ctaActions";

interface CtaState {
  cta: any;
  loading: boolean;
  error: string | null;
  success?: boolean;
  message?: string;
}

const initialState: CtaState = {
  cta: {
    activeCta: "cta4",
    cta1: {
      badge: "About us",
      badgeVisible: true,
      badgeBackgroundColor: "#f1f0fe",
      badgeTextColor: "#6342EC",
      title: "Together, We are <span class=\"fw-bold\">Shaping </span> a<br /> <span class=\"fw-bold\">Promising</span> Future<span class=\"fw-bold\">.</span>",
      tagImage: "/assets/imgs/features-1/dots.png",
      star1: "/assets/imgs/cta-15/star-2.svg",
      star2: "/assets/imgs/cta-15/star-1.svg",
      bgEllipse: "/assets/imgs/cta-15/bg-ellipse.png",
      images: [
        {
          src: "/assets/imgs/cta-15/img-1.png",
          alt: "Team member 1"
        },
        {
          src: "/assets/imgs/cta-15/img-2.png",
          alt: "Team member 2"
        },
        {
          src: "/assets/imgs/cta-15/img-3.png",
          alt: "Team member 3"
        },
        {
          src: "/assets/imgs/cta-15/img-4.png",
          alt: "Team member 4"
        },
        {
          src: "/assets/imgs/cta-15/img-5.png",
          alt: "Team member 5"
        }
      ],
      socialLabel: "Follow us:",
      buttons: {
        primary: {
          visible: true,
          text: "Get Started",
          link: "#",
          backgroundColor: "",
          textColor: "#FFFFFF"
        },
        secondary: {
          visible: true,
          text: "Learn More",
          link: "#",
          backgroundColor: "transparent",
          textColor: "#111827"
        }
      }
    },
    cta4: {
      videoGuide: {
        image: "/assets/imgs/cta-4/img-1.png",
        videoId: "gXFATcwrO-U",
        buttonText: "Video "
      },
      vector: {
        image: "/assets/imgs/cta-4/vector.svg"
      },
      heading: {
        small: "What We Do",
        title: "Custom Services For Your Business",
        visible: true,
        smallColor: "#6342EC",
        titleColor: "#111827"
      },
      description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      features: [
        "Creative Ideas",
        "Web Development",
        "Digital Marketing",
        "App Development"
      ],
      buttons: {
        primary: {
          text: "Get Free Quote",
          link: "#",
          visible: true,
          backgroundColor: "",
          textColor: "#FFFFFF"
        },
        secondary: {
          text: "How We Work",
          link: "#",
          visible: true,
          backgroundColor: "transparent",
          textColor: "#111827"
        }
      }
    },
    cta3: {
      tag: "Our History",
      tagVisible: true,
      tagBackgroundColor: "#f1f0fe",
      tagTextColor: "#6342EC",
      title: "A Journey of Innovation and Growth",
      titleColor: "#111827",
      subtitle: "Loved By Developers Trusted By Enterprises",
      subtitleColor: "#6E6E6E",
      description: "Was founded with a passion for technology and a desire to make a difference in the digital world. From our humble beginnings, we have grown into a reputable and sought-after web development agency, serving a diverse range of clients across various industries. Over the years, we have successfully delivered countless projects, each one a testament to our dedication, expertise, and innovative approach. Our journey has been marked by continuous growth, learning, and adaptation and we are proud of the milestones we have achieved along the way.",
      descriptionColor: "#111827",
      tagImage: "/assets/imgs/features-1/dots.png",
      buttons: {
        primary: {
          visible: true,
          text: "Get Started",
          link: "#",
          backgroundColor: "",
          textColor: "#FFFFFF"
        }
      }
    }
  },
  loading: false,
  error: null,
};

export const ctaReducer = createReducer(initialState, (builder) => {
  builder
    // Get CTA
    .addCase(getCta.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getCta.fulfilled, (state, action) => {
      state.loading = false;
      state.cta = action.payload;
      state.error = null;
    })
    .addCase(getCta.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Update CTA
    .addCase(updateCta.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateCta.fulfilled, (state, action) => {
      state.loading = false;
      state.cta = action.payload;
      state.success = true;
      state.message = "CTA başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateCta.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
});

export default ctaReducer; 