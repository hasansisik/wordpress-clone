// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import blogReducer from "./reducers/blogReducer";
import serviceReducer from "./reducers/serviceReducer";
import headerReducer from "./reducers/headerReducer";
import footerReducer from "./reducers/footerReducer";
import heroReducer from "./reducers/heroReducer";
import { ctaReducer } from './reducers/ctaReducer';
import faqReducer from './reducers/faqReducer';
import otherReducer from './reducers/otherReducer';
import generalReducer from "./reducers/generalReducer";
import contactFormReducer from "./reducers/contactFormReducer";

export const store = configureStore({
  reducer: {
    user: userReducer,
    blog: blogReducer,
    service: serviceReducer,
    header: headerReducer,
    footer: footerReducer,
    hero: heroReducer,
    cta: ctaReducer,
    faq: faqReducer,
    other: otherReducer,
    general: generalReducer,
    contactForm: contactFormReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
