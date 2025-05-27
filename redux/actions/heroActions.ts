import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface HeroPayload {
  activeHero?: string;
  hero1?: {
    badge?: {
      label?: string;
      text?: string;
      link?: string;
    };
    title?: string;
    description?: string;
    primaryButton?: {
      text?: string;
      link?: string;
    };
    secondaryButton?: {
      text?: string;
      link?: string;
    };
    images?: {
      background?: string;
      shape1?: string;
      shape2?: string;
      shape3?: string;
    };
    card?: {
      image?: string;
      title?: string;
      description?: string;
      button?: {
        label?: string;
        text?: string;
        link?: string;
      };
    };
  };
  hero3?: {
    badge?: {
      text?: string;
    };
    title?: {
      part1?: string;
      part2?: string;
    };
    description?: string;
    button?: {
      text?: string;
      link?: string;
    };
    avatars?: Array<{
      image: string;
      alt: string;
    }>;
    images?: {
      image1?: string;
      image2?: string;
      image3?: string;
      image4?: string;
      star?: string;
    };
  };
}

// Get hero data
export const getHero = createAsyncThunk(
  "hero/getHero",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/hero`);
      return data.hero;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Hero bilgileri alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update hero data
export const updateHero = createAsyncThunk(
  "hero/updateHero",
  async (payload: HeroPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(`${server}/hero`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.hero;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Hero güncellenemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
); 