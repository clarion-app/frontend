import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { backendUrl } from './build/backendUrl';

export const appApi = (() => {
    const api = createApi({
    reducerPath: 'appApi',
    baseQuery: fetchBaseQuery({
        baseUrl: backendUrl + '/api/app'
    }),
    tagTypes: ['App'],
    endpoints: (builder) => ({
        getApps: builder.query({
        query: () => '',
        providesTags: ['App'],
        }),
    }),
 });
 return api;
})();

export const invalidateTag = () => {
    console.log('invalidateTag');
    appApi.util.invalidateTags(['App']);
};

export const {
    useGetAppsQuery
} = appApi;