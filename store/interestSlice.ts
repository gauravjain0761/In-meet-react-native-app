import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';
import type { RootState } from './index';
import HttpClient, { CancelToken } from '../axios/axios';
import { getToken } from '~/storage/userToken';
import { ActionResponse } from '~/types/custom';

export const getInterestList = createAsyncThunk(
  'interest/getInterestList',
  async (data: { page: number }, { signal, rejectWithValue }) => {
    try {
      const source = CancelToken.source();
      signal.addEventListener('abort', () => {
        source.cancel();
      });
      const token = await getToken();
      const { page } = data;
      const response = await HttpClient.get('/hobby/search', {
        params: {
          page,
        },
        cancelToken: source.token,
        headers: {
          Authorization: token,
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

export interface IInterest {
  createTime: string;
  hobbyName: string;
  id: number;
  imageURL: string;
  isDisable: boolean;
  modifyTime: string;
  userCount: null | number;
}

export interface ILikeInfo {
  name: string;
  avatar: string;
  city: string;
  birthday: string;
  paired_percetage: any;
  user?: any;
}

interface interestState {
  records: IInterest[];
  currentMatchingId: number;
}

const initialState: interestState = {
  records: [],
  currentMatchingId: 0,
};

export const interestSlice = createSlice({
  name: 'interest',
  initialState,
  reducers: {
    updateCurrentMatchingId: (state, action: PayloadAction<number>) => {
      state.currentMatchingId = action.payload;
    },
  },
  extraReducers: {
    [getInterestList.fulfilled.type]: (
      state: interestState,
      action: { payload: ActionResponse<{ data: { records: IInterest[] } }> },
    ) => {
      try {
        state.records = action.payload.data.records;
      } catch (error) { }
    },
  },
});

export const { updateCurrentMatchingId } = interestSlice.actions;

export const selectInterest = (state: RootState) => state.interest.records;

export default interestSlice.reducer;
