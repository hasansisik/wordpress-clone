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
    salesEmail?: string;
    inquiryTitle?: string;
    inquiryDescription?: string;
    phoneNumber?: string;
    services?: string[];
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