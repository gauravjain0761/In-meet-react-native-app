import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';
import type { RootState } from './index';
import HttpClient, { CancelToken } from '../axios/axios';
import { getToken } from '~/storage/userToken';
import { ActionResponse } from '~/types/custom';

export type BlogReply = {
  content: string;
  createTime: string;
  id: number;
  modifyTime: string;
  user: User;
};

export type Blog = {
  id: number;
  createTime: string;
  modifyTime: string;
  photo: string;
  content: string;
  cover: string;
  amount: number;
  replyAmount: number | null;
  isDisable: boolean;
  isHidden: boolean;
  isUnLockBefore: boolean;
  isLock: boolean;
  user: User;
  blogReplies: Array<BlogReply>;
  reportUser: User;
  isLikeBefore: boolean;
};

interface BlogListResponse {
  data: {
    records: Blog[];
  };
}

interface forumState {
  items: Blog[];
  currentId: number;
}

const initialState: forumState = {
  items: [],
  currentId: 0,
};

export const addForumPostHeart = createAsyncThunk(
  'forum/addForumPostHeart',
  async (id: number, { signal, rejectWithValue }) => {
    try {
      const source = CancelToken.source();
      signal.addEventListener('abort', () => {
        source.cancel();
      });
      const token = await getToken();
      const response = await HttpClient.put(
        `/blog/${Number(id)}`,
        {},
        {
          cancelToken: source.token,
          headers: {
            Authorization: token,
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

export const replyForumPost = createAsyncThunk(
  'forum/replyForumPost',
  async (data: any, { signal, rejectWithValue }) => {
    try {
      const source = CancelToken.source();
      signal.addEventListener('abort', () => {
        source.cancel();
      });
      const token = await getToken();
      const response = await HttpClient.post('/blogReply', data, {
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

export const getForumList = createAsyncThunk(
  'forum/getForumList',
  async (_, { signal, rejectWithValue }) => {
    try {
      const source = CancelToken.source();
      signal.addEventListener('abort', () => {
        source.cancel();
      });
      const token = await getToken();
      const response = await HttpClient.get('/blog/list', {
        params: {
          page: 1,
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

export const getCurrentForum = createAsyncThunk(
  'forum/getCurrentForum',
  async (data, { signal, rejectWithValue }) => {
    const { id } = data;
    try {
      const source = CancelToken.source();
      signal.addEventListener('abort', () => {
        source.cancel();
      });
      const token = await getToken();
      const response = await HttpClient.get(`/blog/${id}`, {
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

export const addForumPost = createAsyncThunk(
  'forum/addForumPost',
  async (data: any, { signal, rejectWithValue }) => {
    try {
      const source = CancelToken.source();
      signal.addEventListener('abort', () => {
        source.cancel();
      });
      const token = await getToken();
      const response = await HttpClient.post('/blog', data, {
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

export const reportForumPost = createAsyncThunk(
  'forum/reportForumPost',
  async (data: any, { signal, rejectWithValue }) => {
    try {
      const source = CancelToken.source();
      signal.addEventListener('abort', () => {
        source.cancel();
      });
      const token = await getToken();
      const response = await HttpClient.post('/blockReport', data, {
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
export const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    updateCurrentId: (state: forumState, action: PayloadAction<number>) => {
      state.currentId = action.payload;
    },
  },
  extraReducers: {
    [getForumList.fulfilled.type]: (
      state: forumState,
      action: { payload: ActionResponse<BlogListResponse> },
    ) => {
      state.items = action.payload.data.records;
    },
    [getCurrentForum.fulfilled.type]: (
      state: forumState,
      action: { payload: ActionResponse<{ data: Blog }> },
    ) => {
      const index = state.items.findIndex(item => item.id === action.payload.data.id);
      if (index !== -1) {
        state.items[index] = action.payload.data;
        return;
      }
      state.items.push(action.payload.data);
    },
  },
});

export const { updateCurrentId } = forumSlice.actions;

export const selectForums = (state: RootState) => state.forums.items;

export const selectCurrentForum = (state: RootState) => {
  const { currentId } = state.forums;
  const currentForum = get(
    state.forums.items.filter(item => item.id === currentId),
    '[0]',
    {},
  );
  return currentForum;
};

export default forumSlice.reducer;
