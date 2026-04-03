import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { backendUrl } from './build/backendUrl';
import { addToast } from './notifications/toastSlice';
import { setLoggedInUser } from './user/loggedInUserSlice';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: backendUrl + '/api/clarion/system/app',
    credentials: 'include',
    prepareHeaders: (headers) => {
        headers.set('Content-Type', 'application/json');
        const csrfToken = document.cookie
            .split('; ')
            .find((row) => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];
        if (csrfToken) {
            headers.set('X-XSRF-TOKEN', decodeURIComponent(csrfToken));
        }
        return headers;
    },
});

const baseQueryWithErrorHandling: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    // On 419 (CSRF token mismatch), refresh the CSRF token and retry once
    if (result.error && result.error.status === 419) {
        await fetch(backendUrl + '/api/csrf-cookie', { credentials: 'include' }).catch(() => {});
        result = await rawBaseQuery(args, api, extraOptions);
    }

    if (result.error) {
        const status = result.error.status;

        if (status === 401) {
            api.dispatch(setLoggedInUser({ id: '', name: '', email: '' }));
            window.location.href = '/login';
        }

        const isWrite =
            typeof args !== 'string' &&
            args.method &&
            ['POST', 'PUT', 'PATCH', 'DELETE'].includes(args.method.toUpperCase());

        if (isWrite) {
            const errorData = result.error.data as any;
            const message =
                errorData?.message ||
                (typeof result.error.status === 'string'
                    ? result.error.status
                    : `Request failed (${result.error.status})`);
            api.dispatch(
                addToast({ message, type: 'error', dismissible: true })
            );
        }
    }

    return result;
};

export const appApi = createApi({
    reducerPath: 'appApi',
    baseQuery: baseQueryWithErrorHandling,
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