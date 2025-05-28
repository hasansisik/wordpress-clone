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
      socialLabel: "Follow us:"
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
        title: "Custom Services For Your Business"
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
          link: "#"
        },
        secondary: {
          text: "How We Work",
          link: "#"
        }
      }
    },
    cta9: {
      videoGuide: {
        image: "/assets/imgs/cta-14/img-1.png",
        videoId: "gXFATcwrO-U",
        buttonText: "Video Guide"
      },
      vectors: {
        vector1: "/assets/imgs/cta-14/vector.svg",
        vector2: "/assets/imgs/cta-14/vector-2.svg",
        bgLine: "/assets/imgs/service-2/bg-line.png"
      },
      heading: {
        tag: "How It Work",
        title: "What are the <span class=\"fw-bold\">Steps Involved</span> in <br /> Our <span class=\"fw-bold\">Process?</span>"
      },
      tagImage: "/assets/imgs/features-1/dots.png"
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