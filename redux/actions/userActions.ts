import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  picture?: string;
  role?: string;
  companyId?: string;
}

export interface EditProfilePayload {
  name?: string;
  email?: string;
  picture?: string;
  companyId?: string;
}

export interface EditUserPayload {
  userId: string;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  status?: string;
  picture?: string;
  companyId?: string;
}

export const login = createAsyncThunk(
  "user/login",
  async (payload: LoginPayload, thunkAPI) => {
    try {
      const { data } = await axios.post(`${server}/auth/login`, payload);
      const token = data.user.token;
      localStorage.setItem("accessToken", token);
      document.cookie = `token=${token}; path=/; max-age=86400`; // 24 hours
      return data.user;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Giriş yapılamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  "user/register",
  async (payload: RegisterPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(`${server}/auth/register`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.user;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Kullanıcı kaydı yapılamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.get(`${server}/auth/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("accessToken");
      document.cookie = "token=; path=/; max-age=0";
      return null;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Çıkış yapılamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getMyProfile = createAsyncThunk(
  "user/getMyProfile",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(`${server}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.user;
    } catch (error: any) {
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
      const message = error.response?.data?.message || 'Profil bilgileri alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const editProfile = createAsyncThunk(
  "user/editProfile",
  async (payload: EditProfilePayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(`${server}/auth/profile`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.user;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Profil güncellenemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(`${server}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.users;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Kullanıcılar alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const editUser = createAsyncThunk(
  "user/editUser",
  async (payload: EditUserPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { userId, ...userData } = payload;
      const { data } = await axios.put(`${server}/auth/users/${userId}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.user;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Kullanıcı güncellenemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${server}/auth/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return userId;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Kullanıcı silinemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

