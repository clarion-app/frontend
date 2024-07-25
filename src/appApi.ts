import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { backendUrl } from './build/backendUrl';

export const appApi = createApi({
    reducerPath: 'appApi',
    baseQuery: fetchBaseQuery({
        baseUrl: backendUrl + '/api/app',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            headers.set('Authorization', 'Bearer ' + (localStorage.getItem("token") || ""));
            return headers;
        },
    }),
    tagTypes: ['App'],
    endpoints: (builder) => ({
        getApps: builder.query({
        query: () => '',
        providesTags: ['App'],
        }),
    }),
 });

export const invalidateTag = () => {
    console.log('invalidateTag');
    appApi.util.invalidateTags(['App']);
};

export const {
    useGetAppsQuery
} = appApi;