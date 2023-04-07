import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openSidenav: false,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleSidenav: (state, action) => {
      state.openSidenav = action.payload || !state.openSidenav;
    },
  },
});

export const { toggleSidenav } = themeSlice.actions;

export default themeSlice.reducer;
