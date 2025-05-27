import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface OtherPayload {
  activeOther?: string;
  blog1?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    seeAllLink?: string;
  };
  blog2?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    seeAllLink?: string;
    bgLine?: string;
  };
  blog3?: {
    title?: string;
    bgLine?: string;
  };
  blog5?: {
    title?: string;
    subtitle?: string;
  };
  services2?: {
    heading?: {
      tag?: string;
      title?: string;
    };
    tagImage?: string;
    services?: Array<{
      icon: string;
      title: string;
      description: string;
      iconBgColor?: string;
    }>;
    backgroundImage?: string;
    buttons?: {
      primary?: {
        text?: string;
        link?: string;
        btnClass?: string;
        iconClass?: string;
      };
      secondary?: {
        text?: string;
        link?: string;
        btnClass?: string;
        iconClass?: string;
      };
    };
  };
  contact1?: {
    badge?: string;
    title?: string;
    description?: string;
    formTitle?: string;
    chatTitle?: string;
    chatDescription?: string;
    whatsappLink?: string;
    viberLink?: string;
    messengerLink?: string;
    emailTitle?: string;
    emailDescription?: string;
    supportEmail?: string;
    showEmail?: boolean;
    inquiryTitle?: string;
    inquiryDescription?: string;
    phoneNumber?: string;
    showPhone?: boolean;
    services?: string[];
    buttonColor?: string;
    badgeColor?: string;
  };
  services5?: {
    title?: string;
    subtitle?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    linkText?: string;
    linkUrl?: string;
    backgroundColor?: string;
    titleColor?: string;
    buttonColor?: string;
  };
  project2?: {
    title?: string;
    subtitle?: string;
    description?: string;
    backgroundColor?: string;
    titleColor?: string;
    badgeColor?: string;
  };
}

// Get other data
export const getOther = createAsyncThunk(
  "other/getOther",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/other`);
      return data.other;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Diğer bileşen bilgileri alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update other data
export const updateOther = createAsyncThunk(
  "other/updateOther",
  async (payload: OtherPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(`${server}/other`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.other;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Diğer bileşenler güncellenemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
); 