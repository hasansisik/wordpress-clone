import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface OtherPayload {
  activeOther?: string;
  blog1?: {
    badge?: string;
    badgeVisible?: boolean;
    badgeBackgroundColor?: string;
    badgeTextColor?: string;
    title?: string;
    titleColor?: string;
    subtitle?: string;
    subtitleColor?: string;
    seeAllLink?: string;
    backgroundColor?: string;
  };
  blog2?: {
    badge?: string;
    badgeVisible?: boolean;
    badgeBackgroundColor?: string;
    badgeTextColor?: string;
    title?: string;
    titleColor?: string;
    subtitle?: string;
    subtitleColor?: string;
    seeAllLink?: string;
    seeAllLinkText?: string;
    seeAllButtonVisible?: boolean;
    seeAllButtonColor?: string;
    backgroundColor?: string;
    bgLine?: string;
  };
  blog3?: {
    title?: string;
    titleColor?: string;
    backgroundColor?: string;
    bgLine?: string;
  };
  blog5?: {
    title?: string;
    titleColor?: string;
    subtitle?: string;
    subtitleColor?: string;
    backgroundColor?: string;
  };
  services2?: {
    heading?: {
      tag?: string;
      tagVisible?: boolean;
      tagBackgroundColor?: string;
      tagTextColor?: string;
      title?: string;
      titleColor?: string;
    };
    tagImage?: string;
    services?: Array<{
      icon: string;
      title: string;
      description: string;
      iconBgColor?: string;
    }>;
    backgroundColor?: string;
    backgroundImage?: string;
    buttons?: {
      primary?: {
        text?: string;
        link?: string;
        btnClass?: string;
        iconClass?: string;
        visible?: boolean;
        backgroundColor?: string;
        textColor?: string;
      };
      secondary?: {
        text?: string;
        link?: string;
        btnClass?: string;
        iconClass?: string;
        visible?: boolean;
        backgroundColor?: string;
        textColor?: string;
      };
    };
  };
  contact1?: {
    badge?: string;
    badgeVisible?: boolean;
    title?: string;
    titleColor?: string;
    description?: string;
    descriptionColor?: string;
    backgroundColor?: string;
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
    addressTitle?: string;
    addressDescription?: string;
    address?: string;
    showAddress?: boolean;
    services?: string[];
    buttonColor?: string;
    buttonTextColor?: string;
    badgeColor?: string;
  };
  services5?: {
    title?: string;
    titleColor?: string;
    subtitle?: string;
    subtitleVisible?: boolean;
    subtitleBackgroundColor?: string;
    subtitleTextColor?: string;
    description?: string;
    descriptionColor?: string;
    buttonText?: string;
    buttonVisible?: boolean;
    buttonLink?: string;
    linkText?: string;
    linkVisible?: boolean;
    linkUrl?: string;
    backgroundColor?: string;
    buttonColor?: string;
    buttonTextColor?: string;
    filterAllText?: string;
    filterButtonColor?: string;
    filterButtonTextColor?: string;
  };
  project2?: {
    title?: string;
    titleColor?: string;
    subtitle?: string;
    subtitleVisible?: boolean;
    subtitleBackgroundColor?: string;
    subtitleTextColor?: string;
    description?: string;
    descriptionColor?: string;
    backgroundColor?: string;
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