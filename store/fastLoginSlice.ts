import { createSlice } from '@reduxjs/toolkit';

export type FastLoginType = 'FACEBOOK' | 'GOOGLE' | 'APPLE' | 'LINE';

interface FastLoginState {
  accessToken: string;
  email: string;
  type: FastLoginType | '';
}

const initialState: FastLoginState = {
  accessToken: '',
  email: '',
  type: '',
};

export const fastLoginSlice = createSlice({
  name: 'fastLogin',
  initialState,
  reducers: {
    updateAccessToken: (state: FastLoginState, action: { payload: { accessToken: string } }) => {
      state.accessToken = action.payload.accessToken;
    },
    updateFastLoginEmail: (state: FastLoginState, action: { payload: { email: string } }) => {
      state.email = action.payload.email;
    },
    updateFastLoginType: (state: FastLoginState, action: { payload: { type: FastLoginType } }) => {
      state.type = action.payload.type;
    },
  },
});

export const { updateAccessToken, updateFastLoginEmail, updateFastLoginType } =
  fastLoginSlice.actions;

export default fastLoginSlice.reducer;
