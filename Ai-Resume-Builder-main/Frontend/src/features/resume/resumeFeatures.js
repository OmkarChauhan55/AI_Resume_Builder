import { createSlice } from "@reduxjs/toolkit";

// ❌ DELETE YOUR OLD initialState
// ✅ REPLACE WITH THIS:
const initialState = {
  resumeData: {},
  template: 1, // Template selector ke liye
};

export const resumeSlice = createSlice({
  name: "editResume",
  initialState,
  reducers: {
    addResumeData: (state, action) => {
      state.resumeData = action.payload;
    },
    // ✅ YEH ADD KARO (reducer ke andar, comma lagake)
    updateResumeData: (state, action) => {
      state.resumeData = { ...state.resumeData, ...action.payload };
    },
    setTemplate: (state, action) => {
      state.template = action.payload;
    },
  },
});

// ✅ EXPORT UPDATE KARO
export const { addResumeData, updateResumeData, setTemplate } = resumeSlice.actions;

export default resumeSlice.reducer;