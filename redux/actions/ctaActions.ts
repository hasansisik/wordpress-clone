import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface CtaPayload {
  activeCta?: string;
  cta1?: {
    badge?: string;
    title?: string;
    tagImage?: string;
    star1?: string;
    star2?: string;
    bgEllipse?: string;
    images?: Array<{
      src: string;
      alt: string;
    }>;
    socialLabel?: string;
  };
  cta4?: {
    videoGuide?: {
      image?: string;
      videoId?: string;
      buttonText?: string;
    };
    vector?: {
      image?: string;
    };
    heading?: {
      small?: string;
      title?: string;
    };
    description?: string;
    features?: string[];
    buttons?: {
      primary?: {
        text?: string;
        link?: string;
      };
      secondary?: {
        text?: string;
        link?: string;
      };
    };
  };
  cta9?: {
    videoGuide?: {
      image?: string;
      videoId?: string;
      buttonText?: string;
    };
    vectors?: {
      vector1?: string;
      vector2?: string;
      bgLine?: string;
    };
    heading?: {
      tag?: string;
      title?: string;
    };
    tagImage?: string;
  };
}

// Get CTA data
export const getCta = createAsyncThunk(
  "cta/getCta",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/cta`);
      return data.cta;
    } catch (error: any) {
      const message = error.response?.data?.message || 'CTA bilgileri alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update CTA data
export const updateCta = createAsyncThunk(
  "cta/updateCta",
  async (payload: CtaPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(`${server}/cta`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.cta;
    } catch (error: any) {
      const message = error.response?.data?.message || 'CTA güncellenemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
); 