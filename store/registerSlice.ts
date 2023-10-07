import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import type { RootState } from './index';
import HttpClient, { CancelToken } from '../axios/axios';
import { ActionResponse } from '~/types/custom';

type LocationObject = {
  longitude: number;
  latitude: number;
};
interface RegisterState {
  phone: string;
  password: string;
  name: string;
  gender: string;
  birthday: string;
  city: string;
  avatar: string;
  location: LocationObject | null;
}

interface ValidationErrors {
  code: number;
  message: string;
  data: unknown;
}

const initialState = {
  phone: '',
  password: '',
  name: '',
  gender: '',
  birthday: '',
  city: '',
  avatar: '',
  location: null,
};

const enum FILETYPE {
  CHAT = 'CHAT',
  AVATAR = 'AVATAR',
  BLOG = 'BLOG',
  PUBLIC_PHOTO = 'PUBLIC_PHOTO',
  PRIVATE_PHOTO = 'PRIVATE_PHOTO',
}

export const uploadAvatar = createAsyncThunk(
  'register/uploadAvatar',
  async (data: any, { signal, rejectWithValue }) => {
    try {
      const source = CancelToken.source();
      signal.addEventListener('abort', () => {
        source.cancel();
      });
      const { avatar } = data;
      const response = await HttpClient.post(
        '/file/uploadChatFile',
        {
          multipartFile: avatar,
        },
        {
          params: {
            fileType: FILETYPE.AVATAR,
          },
          cancelToken: source.token,
        },
      );
      return response.data;
    } catch (err: any) {
      const error: AxiosError<ActionResponse<{ data: any }>> = err;
      if (!error.response) {
        throw err;
      }
      throw error.response.data;
    }
  },
);

export const patchRegister = createAsyncThunk(
  'register/patchRegister',
  async (data: RegisterState, { signal, rejectWithValue }) => {
    try {
      const source = CancelToken.source();
      signal.addEventListener('abort', () => {
        source.cancel();
      });
      const { phone, password, name, gender, birthday, city, avatar } = data;
      const response = await HttpClient.post(
        '/user/register',
        {
          account: phone,
          phone,
          password,
          name,
          birthday,
          city,
          gender,
          roleId: 2,
          avatar,
        },
        {
          cancelToken: source.token,
        },
      );
      return response.data;
    } catch (err: any) {
      const error: AxiosError<ActionResponse<{ data: any }>> = err;
      if (!error.response) {
        throw err;
      }
            throw error.response.data;
    }
  },
);

export const registerSlice = createSlice({
  name: 'register',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updatePhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    updatePassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    updateName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    updateGender: (state, action: PayloadAction<string>) => {
      state.gender = action.payload;
    },
    updateBirthday: (state, action: PayloadAction<string>) => {
      state.birthday = action.payload;
    },
    updateCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
    updateAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
    updateLocation: (state, action: PayloadAction<LocationObject | null>) => {
      state.location = action.payload;
    },
    cleanUpRegister: state => {
      state = initialState;
    },
  },
});

export const {
  updatePhone,
  updateAvatar,
  updateBirthday,
  updateCity,
  updateGender,
  updateName,
  updatePassword,
  updateLocation,
  cleanUpRegister,
} = registerSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectEmail = (state: RootState) => state.user.email;

export default registerSlice.reducer;
