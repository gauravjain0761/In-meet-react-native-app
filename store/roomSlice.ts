import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';
import type { RootState } from './index';
import HttpClient, { CancelToken } from '../axios/axios';
import { getToken } from '~/storage/userToken';
import { ActionResponse } from '~/types/custom';

export const getRoomMessage = createAsyncThunk(
  'room/getRoomMessage',
  async (data, { signal, rejectWithValue }) => {
    const { senderId, recipientId } = data;
    try {
      const source = CancelToken.source();
      signal.addEventListener('abort', () => {
        source.cancel();
      });
      const token = await getToken();

      const response = await HttpClient.get(`/messages/${senderId}/${recipientId}`, {
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

export const getRoomList = createAsyncThunk(
  'room/getRoomList',
  async ({ userId }: { userId: number }, { signal, rejectWithValue }) => {
    try {
      const source = CancelToken.source();
      signal.addEventListener('abort', () => {
        source.cancel();
      });
      const token = await getToken();

      const response = await HttpClient.get('/messages/list', {
        params: {
          userId,
          isFromClient: true,
          page: 1,
          order: 'asc',
          sort: 'id',
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

interface ChatState {
  currentChatId: number;
}

const initialState: ChatState = {
  currentChatId: 0,
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    updateCurrentChatId: (state, action: PayloadAction<number>) => {
      state.currentChatId = action.payload;
    },
  },
});

export const { updateCurrentChatId } = roomSlice.actions;

export const selectRecipientId = (state: RootState) => state.room.currentChatId;

export default roomSlice.reducer;
