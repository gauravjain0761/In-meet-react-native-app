import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';
import type { RootState } from './index';
import HttpClient, { CancelToken } from '../axios/axios';
import { getToken } from '~/storage/userToken';
import { ActionResponse } from '~/types/custom';

export const uploadFile = createAsyncThunk(
  'file/upload',
  async (
    data: {
      fileData: any;
      userId: number;
      fileType: 'BLOG' | 'AVATAR' | 'CHAT' | 'PHOTO';
    },
    { signal, rejectWithValue },
  ) => {
    try {
      const source = CancelToken.source();
      console.log('source',source);
      
      signal.addEventListener('abort', () => {
        source.cancel();
      });
      const token = await getToken();
      const { userId, fileType, fileData } = data;

      const bodyFormData = new FormData();
      bodyFormData.append('file', fileData);
      console.log('bodyFormData',bodyFormData);
      
      const response = await HttpClient.post('/file/upload', bodyFormData, {
        params: {
          userId,
          fileType,
        },
        cancelToken: source.token,

        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('response',response);
      
      return response.data;
    } catch (err: any) {
      
      console.log('errerrerrerr',err);
      const error: AxiosError<ActionResponse<{ data: any }>> = err;
      if (!error.response) {
        throw err;
      }

      throw error.response.data;
    }
  },
);

export default uploadFile;
