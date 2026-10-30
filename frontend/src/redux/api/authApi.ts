/** @format */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { IAuthResponse, ILoginRequest, ISignupRequest } from '../../types/auth.types';

export const authApi = createApi({
  reducerPath: 'authApi',

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include', // Telling the browser to send and accept cookies on cross-origin requests.
  }),

  endpoints: (builder) => ({
    register: builder.mutation<IAuthResponse, ISignupRequest>({
      query: (data) => ({
        url: '/api/v1/auth/register',
        method: 'POST',
        body: data,
      }),
    }),

    login: builder.mutation<IAuthResponse, ILoginRequest>({
      query: (data) => ({
        url: '/api/v1/auth/login',
        method: 'POST',
        body: data,
      }),
    }),

    refresh: builder.mutation<{ status: string; message: string }, void>({
      query: () => ({
        url: '/api/v1/auth/refresh',
        method: 'POST',
      }),
    }),

    logout: builder.mutation<{ status: string; message: string }, void>({
      query: () => ({
        url: '/api/v1/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useRefreshMutation, useLogoutMutation } = authApi;
