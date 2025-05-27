import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface FaqPayload {
  activeFaq?: string;
  faqs2?: {
    heading?: {
      tag?: string;
      title?: string;
      description?: string;
    };
    tagImage?: string;
    questions?: Array<{
      question: string;
      answer: string;
    }>;
  };
  faqs3?: {
    heading?: {
      tag?: string;
      title?: string;
      description?: string;
    };
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
    images?: {
      image1?: string;
      image2?: string;
    };
    tagImage?: string;
    questions?: Array<{
      question: string;
      answer: string;
    }>;
  };
}

// Get FAQ data
export const getFaq = createAsyncThunk(
  "faq/getFaq",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/faq`);
      return data.faq;
    } catch (error: any) {
      const message = error.response?.data?.message || 'FAQ bilgileri alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update FAQ data
export const updateFaq = createAsyncThunk(
  "faq/updateFaq",
  async (payload: FaqPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(`${server}/faq`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.faq;
    } catch (error: any) {
      const message = error.response?.data?.message || 'FAQ güncellenemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
); 