import { createReducer } from "@reduxjs/toolkit";
import {
  getAllBlogs,
  getSingleBlog,
  createBlog,
  updateBlog,
  deleteBlog
} from "../actions/blogActions";

interface BlogState {
  blogs: any[];
  blog: any;
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
}

const initialState: BlogState = {
  blogs: [],
  blog: {},
  loading: false,
  error: null,
  success: false,
  message: null
};

export const blogReducer = createReducer(initialState, (builder) => {
  builder
    // Get All Blogs
    .addCase(getAllBlogs.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAllBlogs.fulfilled, (state, action) => {
      state.loading = false;
      state.blogs = action.payload;
      state.error = null;
    })
    .addCase(getAllBlogs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Get Single Blog
    .addCase(getSingleBlog.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getSingleBlog.fulfilled, (state, action) => {
      state.loading = false;
      state.blog = action.payload;
      state.error = null;
    })
    .addCase(getSingleBlog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Create Blog
    .addCase(createBlog.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(createBlog.fulfilled, (state, action) => {
      state.loading = false;
      state.blogs = [action.payload, ...state.blogs];
      state.success = true;
      state.message = "Blog başarıyla oluşturuldu";
      state.error = null;
    })
    .addCase(createBlog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Update Blog
    .addCase(updateBlog.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(updateBlog.fulfilled, (state, action) => {
      state.loading = false;
      state.blogs = state.blogs.map(blog => 
        blog._id === action.payload._id ? action.payload : blog
      );
      if (state.blog._id === action.payload._id) {
        state.blog = action.payload;
      }
      state.success = true;
      state.message = "Blog başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateBlog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Delete Blog
    .addCase(deleteBlog.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(deleteBlog.fulfilled, (state, action) => {
      state.loading = false;
      state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
      state.success = true;
      state.message = "Blog başarıyla silindi";
      state.error = null;
    })
    .addCase(deleteBlog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
});

export default blogReducer; 