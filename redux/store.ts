// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import blogReducer from "./reducers/blogReducer";
import serviceReducer from "./reducers/serviceReducer";
import headerReducer from "./reducers/headerReducer";
import footerReducer from "./reducers/footerReducer";

export const store = configureStore({
  reducer: {
    user: userReducer,
    blog: blogReducer,
    service: serviceReducer,
    header: headerReducer,
    footer: footerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
