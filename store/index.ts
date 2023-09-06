import { configureStore } from '@reduxjs/toolkit';
// ...
import { useDispatch } from 'react-redux';
import userReducer from './userSlice';
import registerReducer from './registerSlice';
import forumReducer from './forumSlice';
import interestReducer from './interestSlice';
import roomReducer from './roomSlice';
import fastLoginReducer from './fastLoginSlice';

export const store = configureStore({
  devTools: true,
  reducer: {
    fastLogin: fastLoginReducer,
    user: userReducer,
    register: registerReducer,
    forums: forumReducer,
    interest: interestReducer,
    room: roomReducer,
  },
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware();
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
