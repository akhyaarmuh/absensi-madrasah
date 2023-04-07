import { createSlice } from '@reduxjs/toolkit';

const initialState = { data: [] };

export const classroomSlice = createSlice({
  name: 'classroom',
  initialState,
  reducers: {
    setClassroom: (state, action) => {
      state.data = action.payload;
    },

    deleteClassroom: (state, action) => {
      state.data = state.data.filter((classroom) => classroom.value !== action.payload);
    },
  },
});

export const { setClassroom, deleteClassroom } = classroomSlice.actions;

export default classroomSlice.reducer;
