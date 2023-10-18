import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import type { RootState } from './index';
import HttpClient, { CancelToken } from '../axios/axios';
import { getToken, storeUserToken } from '~/storage/userToken';
import { FastLoginType } from './fastLoginSlice';
import { contactType } from '~/constants/mappingValue';
import { ActionResponse } from '~/types/custom';

enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  ALL = 'ALL',
}
// Define a type for the slice state
interface UserState extends User {
  token: string;
  interested: GENDER.MALE | GENDER.FEMALE | GENDER.ALL | '';
  distance: number;
  startAge: number;
  endAge: number;
  hobbyIds: number[];
  fromRegister: boolean;
}

// Define the initial state using that type
const initialState: UserState = {
  email: '',
  name: '',
  smoke: '',
  point: 0,
  starAmount: 0,
  city: '',
  token: '',
  id: 0,
  interested: '',
  height: null,
  hobbies: [],
  distance: 0,
  startAge: 18,
  endAge: 35,
  hobbyIds: [],
  isBlogEnable: false,
  isLikeEnable: false,
  isMessageEnable: false,
  isSystemEnable: false,
  vipEndTime: '',
  fromRegister: false,
  scrollvalue:0,
  drink:''
};

interface SearchUserParams {
  gender?: GENDER;
  city?: CITY;
  hobbies?: HOBBIES[];
  page?: number;
  limit?: number;
  offset?: number;
  order?: string;
  sort?: string;
}

interface UserResponse extends User {
  token: string;
}

interface UserLoginResponse {
  data: string;
}
interface SocialLoginResponse {
  data: {
    email: string;
    token?: string;
  };
}
interface SocialLoginData {
  accessToken: string;
  type: FastLoginType;
}

interface UserProfileResponse {
  data: UserResponse;
}

export const updateUser = createAsyncThunk('user/update', async (data: any, { signal }) => {
  const source = CancelToken.source();
  signal.addEventListener('abort', () => {
    source.cancel();
  });

  const { userId, ...others } = data;
  const token = await getToken();

  const response = await HttpClient.put<ActionResponse<UserLoginResponse>>(
    `/user/update/${userId}`,
    {
      ...(others && others),
    },
    {
      headers: {
        Authorization: token,
      },
      cancelToken: source.token,
    },
  );
  return response.data;
});

export const searchUser = createAsyncThunk(
  'user/searchUser',
  async (params: SearchUserParams, { signal }) => {
    const source = CancelToken.source();
    const token = await getToken();

    signal.addEventListener('abort', () => {
      source.cancel();
    });
    const response = await HttpClient.get('/user/search', {
      cancelToken: source.token,
      headers: {
        Authorization: token,
      },
      params,
    });
    return response.data;
  },
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (
    data: {
      username: string;
      password: string;
      latitude?: number;
      longitude?: number;
    },
    { signal },
  ) => {
    const source = CancelToken.source();
    signal.addEventListener('abort', () => {
      source.cancel();
    });
    const token = await getToken();

    const response = await HttpClient.post<ActionResponse<UserLoginResponse>>(
      '/user/login',
      {
        ...(data.username && { username: data.username }),
        ...(data.password && { password: data.password }),
        roleId: 2,
      },
      {
        params: {
          ...(data.longitude && data.latitude && { lngLat: `${data.longitude},${data.latitude}` }),
        },
        headers: {
          Authorization: token,
        },
        cancelToken: source.token,
      },
    );
    console.log('response',response);
    
    return response.data;
  },
);
export const recoverUser = createAsyncThunk('user/recover', async (data: {}, { signal }) => {
  const source = CancelToken.source();
  signal.addEventListener('abort', () => {
    source.cancel();
  });
  const response = await HttpClient.post<ActionResponse<UserLoginResponse>>(
    `/user/recover?account=${data}`,
  );
  return response.data;
});
export const socialLoginUser = createAsyncThunk(
  'user/social/socialLogin',
  async (
    data: {
      latitude?: number;
      longitude?: number;
      accessToken?: string;
      type?: FastLoginType;
    },
    { signal },
  ) => {
    const source = CancelToken.source();
    signal.addEventListener('abort', () => {
      source.cancel();
    });
    const token = await getToken();
    const response = await HttpClient.post<ActionResponse<SocialLoginResponse>>(
      '/user/social/login',
      {
        ...(data.type && { type: data.type }),
        ...(data.accessToken && { accessToken: data.accessToken }),
      },
      {
        params: {
          ...(data.longitude && data.latitude && { lngLat: `${data.longitude},${data.latitude}` }),
        },
        headers: {
          Authorization: token,
        },
        cancelToken: source.token,
      },
    );
    return response.data;
  },
);


export const logoutUser = createAsyncThunk('user/logout', async (_, { signal }) => {
  const source = CancelToken.source();
  signal.addEventListener('abort', () => {
    source.cancel();
  });
  const token = await getToken();
  const response = await HttpClient.post<ActionResponse<any>>(
    '/user/logout',
    {},
    {
      headers: {
        Authorization: token,
      },
      cancelToken: source.token,
    },
  );
  return response.data;
});

export const getUserInfo = createAsyncThunk(
  'user/getUserInfo',
  async (
    data: {
      token?: string;
    },
    { signal },
  ) => {
    const { token = '' } = data;
    const source = CancelToken.source();
    signal.addEventListener('abort', () => {
      source.cancel();
    });
    try {
      const storageToken = await getToken();
      const response = await HttpClient.get<ActionResponse<UserProfileResponse>>('/user/info/', {
        cancelToken: source.token,
        headers: {
          Authorization: token || storageToken,
        },
      });
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
export const getUserLocation = createAsyncThunk(
  'user/getUserInfo',
  async (
    data: {
      token?: string;
      lng?: string;
      lat?: string;
    },
    { signal },
  ) => {
    const { token = '' } = data;
    const source = CancelToken.source();
    signal.addEventListener('abort', () => {
      source.cancel();
    });
    try {
      const location = `${data.lng},${data.lat}`;
      const storageToken = await getToken();
      const response = await HttpClient.get<ActionResponse<UserProfileResponse>>('/user/info/', {
        cancelToken: source.token,
        headers: {
          Authorization: token || storageToken,
          lnglat: location,
        },
      });
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
export const patchUserUnbindFastLogin = createAsyncThunk(
  'user/social/unbind',
  async (data, { signal }) => {
    const source = CancelToken.source();
    signal.addEventListener('abort', () => {
      source.cancel();
    });
    try {
      const { type } = data;
      const authToken = await getToken();
      const response = await HttpClient.post<ActionResponse<UserProfileResponse>>(
        `/user/social/unbind/${type}`,
        {},
        {
          cancelToken: source.token,
          headers: {
            Authorization: authToken,
          },
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

export const patchUserFastLogin = createAsyncThunk(
  'user/social/bind',
  async (
    data: {
      type: FastLoginType;
      apple?: SocialLoginData;
      google?: SocialLoginData;
      line?: SocialLoginData;
      facebook?: SocialLoginData;
      userPhone: any;
      token:any
    },
    { signal },
  ) => {
    const source = CancelToken.source();
    signal.addEventListener('abort', () => {
      source.cancel();
    });
    try {
      const { userPhone, facebook, line, google, apple, type,token } = data;
      console.log(data);
    
      console.log('authToken',token);
      
      const response = await HttpClient.post<ActionResponse<UserProfileResponse>>(
        `/user/social/bind`,
        {
          account: userPhone,
          ...(facebook && { accessToken: facebook.accessToken, type: 'FACEBOOK' }),
          ...(line && { accessToken: line.accessToken, type: 'LINE' }),
          ...(google && { accessToken: google.accessToken, type: 'GOOGLE' }),
          ...(apple && { accessToken: apple.accessToken, type: 'APPLE' }),
        },
        {
          cancelToken: source.token,
          headers: {
            Authorization: token,
          },
        },
      );
      console.log('patchUserFastLogin',response);
      
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

export const patchUserNotification = createAsyncThunk(
  'user/patchNotification',
  async (data, { signal }) => {
    const source = CancelToken.source();
    signal.addEventListener('abort', () => {
      source.cancel();
    });
    try {
      const {
        deviceToken,
        isSystemEnable = true,
        isMessageEnable = true,
        isBlogEnable = true,
        isLikeEnable = true,
      } = data;   
      const authToken = await getToken();
      const response = await HttpClient.put<ActionResponse<UserProfileResponse>>(
        '/user/notification/setting',
        {
          deviceToken,
          isSystemEnable,
          isMessageEnable,
          isBlogEnable,
          isLikeEnable,
        },
        {
          cancelToken: source.token,
          headers: {
            Authorization: authToken,
          },
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

export const getUserLike = createAsyncThunk(
  '/userpair/like',
  async (
    data: {
      token?: string;
      isLike?:boolean,
      id?:number
    },
    { signal },
  ) => {
    const { token = '',isLike ,id} = data;
    console.log('data',isLike ,id);
    
    try {
      const storageToken = await getToken();
      const response = await HttpClient.get<ActionResponse<UserProfileResponse>>('/userpair/like', {
        headers: {
          Authorization: token || storageToken,
        },
        params:{
          id:id,
          liked:isLike
        }
      });
      console.log('response',response.data);
      
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

export const getUserWatch = createAsyncThunk(
  '/userpair/watch',
  async (
    data: {
      token?: string;
      isLike?:boolean,
      id?:number
    },
    { signal },
  ) => {
    const { token = '',isLike ,id} = data;
    console.log('data',isLike ,id);
    
    try {
      const storageToken = await getToken();
      const response = await HttpClient.get<ActionResponse<UserProfileResponse>>('/userpair/watch', {
        headers: {
          Authorization: token || storageToken,
        },
        params:{
          id:id,
          liked:isLike
        }
      });
      console.log('responsessss',response.data);
      
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

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    initUser: (state, action: PayloadAction<any>) => {
      state = action.payload;
    },
    patchUserFromRegister: (state, action: PayloadAction<any>) => {
      state.fromRegister = action.payload;
    },
    patchUserToken: (state, action: PayloadAction<any>) => {
      state.token = action.payload;
    },
    setFilterDistance: (state, action: PayloadAction<any>) => {
      state.distance = action.payload;
    },
    setFilterInterested: (state, action: PayloadAction<any>) => {
      state.interested = action.payload;
    },
    setFilterStartAge: (state, action: PayloadAction<any>) => {
      state.startAge = action.payload;
    },
    setFilterEndAge: (state, action: PayloadAction<any>) => {
      state.endAge = action.payload;
    },
    setFilterHobbyIds: (state, action: PayloadAction<any>) => {
      state.hobbyIds = action.payload;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.email += action.payload;
    },
    patchUserHeight: (state, action: PayloadAction<any>) => {
      state.height = action.payload;
    },
    patchUserJob: (state, action: PayloadAction<any>) => {
      state.job = action.payload;
    },
    patchUserEducation: (state, action: PayloadAction<any>) => {
      state.education = action.payload;
    },
    patchUserInterests: (state, action: PayloadAction<any>) => {
      state.hobbies = action.payload;
    },
    patchUserAbout: (state, action: PayloadAction<any>) => {
      state.about = action.payload;
    },
    patchUserSmoke: (state, action: PayloadAction<any>) => {
      state.smoke = action.payload;
    },
    patchUserDrink: (state, action: PayloadAction<any>) => {
      state.drink = action.payload;
    },
    patchUserSignature: (state, action: PayloadAction<any>) => {
      state.signature = action.payload;
    },
    patchUserBloodType: (state, action: PayloadAction<any>) => {
      state.bloodType = action.payload;
    },
    patchUserReligion: (state, action: PayloadAction<any>) => {
      state.religion = action.payload;
    },
    patchUserPoint: (state, action: PayloadAction<any>) => {
      state.point = action.payload;
    },
    patchUserCity: (state, action: PayloadAction<any>) => {
      state.city = action.payload;
    },
    patchUserName: (state, action: PayloadAction<any>) => {
      state.name = action.payload;
    },
    patchUserEmail: (state, action: PayloadAction<any>) => {
      state.email = action.payload;
    },
    patchUserLikeEnable: (state, action: PayloadAction<any>) => {
      state.isLikeEnable = action.payload;
    },
    patchUserBlogEnable: (state, action: PayloadAction<any>) => {
      state.isBlogEnable = action.payload;
    },
    patchUserMessageEnable: (state, action: PayloadAction<any>) => {
      state.isMessageEnable = action.payload;
    },
    patchUserSystemEnable: (state, action: PayloadAction<any>) => {
      state.isSystemEnable = action.payload;
    },
    updateUserScrollValue: (state, action: PayloadAction<any>) => {
      state.scrollvalue = action.payload;
    },
    patchUserSocial: (
      state,
      action: PayloadAction<{
        type: FastLoginType;
        value: string;
      }>,
    ) => {
      switch (action.payload.type) {
        case 'LINE':
          state.line = action.payload.value;
          break;

        case 'FACEBOOK':
          state.facebook = action.payload.value;

          break;

        case 'GOOGLE':
          state.google = action.payload.value;

          break;

        case 'APPLE':
          state.apple = action.payload.value;

          break;

        default:
          break;
      }
    },
    patchUserSocialLogin: (
      state,
      action: PayloadAction<{
        type: contactType;
        data: {
          contactLine?: string;
          contactFacebook?: string;
          contactIg?: string;
          contactWechat?: string;
          phone?: string;
        };
      }>,
    ) => {
      switch (action.payload.type) {
        case contactType.LINE:
          state.contactLine = action.payload.data.contactLine!;
          break;

        case contactType.FACEBOOK:
          state.contactFacebook = action.payload.data.contactFacebook!;

          break;

        case contactType.INSTAGRAM:
          state.contactIg = action.payload.data.contactIg!;

          break;

        case contactType.WECHAT:
          state.contactWechat = action.payload.data.contactWechat!;

          break;
        case contactType.PHONE:
          state.phone = action.payload.data.phone!;

          break;

        default:
          break;
      }
    },
  },
  extraReducers: {
    [searchUser.fulfilled.type]: (state: UserState, action: { payload: ActionResponse<any> }) => { },
    [getUserInfo.fulfilled.type]: (
      state: UserState,
      action: { payload: ActionResponse<UserProfileResponse> },
    ) => {
      try {
        state.account = action.payload.data.account;
        state.name = action.payload.data.name;
        state.email = action.payload.data.email;
        state.gender = action.payload.data.gender;
        state.point = action.payload.data.point;
        state.avatar = action.payload.data.avatar;
        state.birthday = action.payload.data.birthday;
        state.bloodType = action.payload.data.bloodType;
        state.city = action.payload.data.city;
        state.job = action.payload.data.job;
        state.religion = action.payload.data.religion;
        state.education = action.payload.data.education;
        state.about = action.payload.data.about;
        state.height = action.payload.data.height;
        state.hobbies = action.payload.data.hobbies;
        state.id = action.payload.data.id;
        state.isBlogEnable = action.payload.data.isBlogEnable;
        state.isLikeEnable = action.payload.data.isLikeEnable;
        state.isMessageEnable = action.payload.data.isMessageEnable;
        state.isSystemEnable = action.payload.data.isSystemEnable;
        state.deviceToken = action.payload.data.deviceToken;
        state.google = action.payload.data.google;
        state.facebook = action.payload.data.facebook;
        state.line = action.payload.data.line;
        state.apple = action.payload.data.apple;
        state.contactFacebook = action.payload.data.contactFacebook;
        state.contactLine = action.payload.data.contactLine;
        state.contactWechat = action.payload.data.contactWechat;
        state.contactIg = action.payload.data.contactIg;
        state.constellation = action.payload.data.constellation;
        state.vipEndTime = action.payload.data.vipEndTime;
        state.modifyTime = action.payload.data.modifyTime;
        state.level = action.payload.data.level;
        state.starAmount = action.payload.data.starAmount;
        state.lastLoginTime = action.payload.data.lastLoginTime;
      } catch (error) { }
    },
    [getUserInfo.rejected.type]: (state: UserState) => {
      try {
        state.token = '';
        // storeUserToken('');
      } catch (error) { }
    },
    [socialLoginUser.fulfilled.type]: (
      state: UserState,
      action: { payload: ActionResponse<SocialLoginResponse> },
    ) => {
      if (action.payload.data.token) {
        state.token = action.payload.data.token;
      }
    },
    [patchUserNotification.fulfilled.type]: (
      state: UserState,
      action: { payload: ActionResponse<UserProfileResponse> },
    ) => {
      // state.isBlogEnable = action.payload.data.isBlogEnable;
      // state.isMessageEnable = action.payload.data.isMessageEnable;
      // state.isSystemEnable = action.payload.data.isSystemEnable;
      // state.deviceToken = action.payload.data.deviceToken;
    },
    [logoutUser.fulfilled.type]: (state: UserState, action: { payload: any }) => {
      state.token = '';
    },
  },
});

export const {
  initUser,
  incrementByAmount,
  patchUserToken,
  setFilterDistance,
  setFilterEndAge,
  setFilterHobbyIds,
  setFilterInterested,
  setFilterStartAge,
  patchUserHeight,
  patchUserAbout,
  patchUserEducation,
  patchUserInterests,
  patchUserJob,
  patchUserBloodType,
  patchUserReligion,
  patchUserSocialLogin,
  patchUserSocial,
  patchUserSignature,
  patchUserPoint,
  patchUserName,
  patchUserCity,
  patchUserFromRegister,
  patchUserEmail,
  updateUserScrollValue,
  patchUserSmoke,
  patchUserDrink,
  patchUserLikeEnable,
  patchUserBlogEnable,
  patchUserMessageEnable,
  patchUserSystemEnable
} = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectEmail = (state: RootState) => state.user.email;
export const selectUserId = (state: RootState) => state.user.id;
export const selectToken = (state: RootState) => state.user.token;
export const selectAccount = (state: RootState) => state.user.account;

export const selectLoginState = (state: RootState) => Boolean(state.user.token);

export default userSlice.reducer;
