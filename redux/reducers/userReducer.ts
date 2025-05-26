import { createReducer } from "@reduxjs/toolkit";
import {
  login,
  logout,
  register,
  getMyProfile,
  editProfile,
  getAllUsers,
  editUser,
  deleteUser
} from "../actions/userActions";

interface userState {
  user: any;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  message?: string;
  users: any[];
  success?: boolean;
}

const initialState: userState = {
  user: {},
  loading: false,
  error: null,
  isAuthenticated: false,
  users: [],
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    // Login
    .addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    })
    .addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    })
    
    // Register
    .addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.users = [...state.users, action.payload];
      state.success = true;
      state.message = "Kullanıcı başarıyla oluşturuldu.";
      state.error = null;
    })
    .addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Logout
    .addCase(logout.pending, (state) => {
      state.loading = true;
    })
    .addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.users = [];
    })
    .addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Get My Profile
    .addCase(getMyProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getMyProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    })
    .addCase(getMyProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    })
    
    // Edit Profile
    .addCase(editProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(editProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.success = true;
      state.message = "Profil başarıyla güncellendi";
      state.error = null;
    })
    .addCase(editProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Get All Users
    .addCase(getAllUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
      state.error = null;
    })
    .addCase(getAllUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Edit User
    .addCase(editUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(editUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users = state.users.map(user => 
        user._id === action.payload._id ? action.payload : user
      );
      state.success = true;
      state.message = "Kullanıcı bilgileri güncellendi";
      state.error = null;
    })
    .addCase(editUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    })
    
    // Delete User
    .addCase(deleteUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users = state.users.filter(user => user._id !== action.payload);
      state.success = true;
      state.message = "Kullanıcı başarıyla silindi";
      state.error = null;
    })
    .addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
});

export default userReducer;