import { createReducer } from "@reduxjs/toolkit";
import { getHero, updateHero } from "../actions/heroActions";

interface HeroState {
  hero: any;
  loading: boolean;
  error: string | null;
  success?: boolean;
  message?: string;
}

const initialState: HeroState = {
  hero: {
    activeHero: "hero1",
    hero1: {
      badge: {
        label: "yeni",
        text: "Free Lifetime ",
        link: "#"
      },
      title: "Create stunning websites with our",
      description: "Build beautiful, responsive websites without code. Our drag-and-drop interface makes it easy to create professional sites in minutes.",
      primaryButton: {
        text: "Get Started",
        link: "/register"
      },
      secondaryButton: {
        text: "Contact Sales",
        link: "/contact"
      },
      images: {
        background: "/assets/imgs/hero-1/background.png",
        shape1: "/assets/imgs/hero-1/shape-1.png",
        shape2: "/assets/imgs/hero-1/shape-2.png",
        shape3: "/assets/imgs/hero-1/shape-3.png"
      },
      card: {
        image: "/assets/imgs/hero-1/shape-4.png",
        title: "Join Our Community",
        description: "Over 2,500+ happy customers",
        button: {
          label: "Get",
          text: "Free Update",
          link: "#"
        }
      }
    },
    hero3: {
      badge: {
        text: "Build Without Limits"
      },
      title: {
        part1: "Create Stunning",
        part2: "Websites Easily"
      },
      description: "Design professional websites with our powerful drag-and-drop builder. No coding skills required.",
      button: {
        text: "Try It Free",
        link: "/register"
      },
      avatars: [
        {
          image: "/assets/imgs/hero-3/avatar-1.png",
          alt: "User avatar 1"
        },
        {
          image: "/assets/imgs/hero-3/avatar-2.png",
          alt: "User avatar 2"
        },
        {
          image: "/assets/imgs/hero-3/avatar-3.png",
          alt: "User avatar 3"
        }
      ],
      images: {
        image1: "/assets/imgs/hero-3/img-1.png",
        image2: "/assets/imgs/hero-3/img-2.png",
        image3: "/assets/imgs/hero-3/img-3.png",
        image4: "/assets/imgs/hero-3/img-4.png",
        star: "/assets/imgs/hero-3/star-rotate.png"
      }
    }
  },
  loading: false,
  error: null,
};

export const heroReducer = createReducer(initialState, (builder) => {
  builder
    // Get Hero
    .addCase(getHero.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getHero.fulfilled, (state, action) => {
      state.loading = false;
      state.hero = action.payload;
      state.error = null;
    })
    .addCase(getHero.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Update Hero
    .addCase(updateHero.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateHero.fulfilled, (state, action) => {
      state.loading = false;
      state.hero = action.payload;
      state.success = true;
      state.message = "Hero başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateHero.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
});

export default heroReducer; 