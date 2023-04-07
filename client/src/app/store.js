import { configureStore } from '@reduxjs/toolkit';

import themeReducer from '../features/theme';
import userReducer from '../features/user';
import classroomReducer from '../features/classroom';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    classroom: classroomReducer,
  },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;
