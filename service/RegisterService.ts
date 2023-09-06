import { BaseQueryFn, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { BASE_URL } from '../constants/config';

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axios({ url: baseUrl + url, method, data, params });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const registerApi = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: BASE_URL }),
  reducerPath: 'registerApi',
  endpoints: (build) => ({
    registerUser: build.mutation<any, string>({
      query: (data: any) => ({ url: '/mutation', method: 'post', data }),
    }),
  }),
});

export const { useRegisterUserMutation } = registerApi;
