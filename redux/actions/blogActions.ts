import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface BlogContent {
  intro: string;
  readTime?: string;
  author: {
    name: string;
    avatar?: string;
    date?: string;
  };
  mainImage?: string;
  fullContent: string;
}

export interface BlogPayload {
  title: string;
  image: string;
  description: string;
  category: string[];
  author: string;
  date?: string;
  content: BlogContent;
  link?: string;
  companyId?: string;
}

export interface UpdateBlogPayload extends Partial<BlogPayload> {
  id: string;
}

// Get all blogs
export const getAllBlogs = createAsyncThunk(
  "blog/getAllBlogs",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/blogs`);
      return data.blogs;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Bloglar alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get company blogs
export const getCompanyBlogs = createAsyncThunk(
  "blog/getCompanyBlogs",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(`${server}/blogs/company/blogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.blogs;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Şirket blogları alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get blogs by company ID
export const getBlogsByCompany = createAsyncThunk(
  "blog/getBlogsByCompany",
  async (companyId: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/blogs?companyId=${companyId}`);
      return data.blogs;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Şirket blogları alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single blog
export const getSingleBlog = createAsyncThunk(
  "blog/getSingleBlog",
  async (id: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`${server}/blogs/${id}`);
      return data.blog;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Blog alınamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create blog
export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (blogData: BlogPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(`${server}/blogs`, blogData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.blog;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Blog oluşturulamadı';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update blog
export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ id, ...blogData }: UpdateBlogPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(`${server}/blogs/${id}`, blogData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.blog;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Blog güncellenemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete blog
export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${server}/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Blog silinemedi';
      return thunkAPI.rejectWithValue(message);
    }
  }
); 