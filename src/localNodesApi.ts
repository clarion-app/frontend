import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { backendUrl } from './build/backendUrl';

export interface LocalNodeType {
    node_id: string;
    name: string;
    backend_url: string;
    wallet_address: string;
}

export const localNodesApi = createApi({
    reducerPath: 'localNodesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: backendUrl + '/api/clarion/network/local_nodes',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['LocalNodes'],
    endpoints: (builder) => ({
        getLocalNodes: builder.query<LocalNodeType[], void>({
        query: () => '',
        providesTags: ['LocalNodes'],
        }),
    }),
 });

 export const { useGetLocalNodesQuery } = localNodesApi;