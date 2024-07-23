import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { backendUrl } from '../build/backendUrl';

export const userApi = (() => {
    const api = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: backendUrl + '/api/user',
        prepareHeaders: (headers) => {
            headers.set("Accept", "application/json");
            headers.set("Content-Type", "application/json");
            return headers;
        }
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getUsers: builder.query({
        query: () => '',
        providesTags: ['User'],
        }),
        addUser: builder.mutation({
        query: (user) => ({
            url: '',
            method: 'POST',
            body: user,
        }),
        invalidatesTags: ['User'],
        }),
        deleteUser: builder.mutation({
        query: (id) => ({
            url: `/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['User'],
        }),
        updateUser: builder.mutation({
        query: (user) => ({
            url: '',
            method: 'PUT',
            body: user,
        }),
        invalidatesTags: ['User'],
        }),
    }),
 });
 return api;
})();

export const invalidateTag = () => {
    console.log('invalidateTag');
    userApi.util.invalidateTags(['User']);
};

export const {
    useGetUsersQuery,
    useAddUserMutation,
    useDeleteUserMutation,
    useUpdateUserMutation,
} = userApi;