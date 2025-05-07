import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import reverbConfig from './build/reverbConfig.json';
import { WindowWS } from '@clarion-app/types';
import { backendUrl } from './build/backendUrl';
import { store } from './build/store';

const win = window as unknown as WindowWS;

win.Pusher = Pusher;

if(!win.Echo) {
    win.Echo = new Echo({
        broadcaster: 'pusher',
        key: reverbConfig.appKey,
        wsHost: reverbConfig.host,
        wsPort: reverbConfig.port ?? 80,
        wssPort: reverbConfig.port ?? 443,
        forceTLS: (reverbConfig.protocol ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
        cluster: 'mt1',
        authEndpoint: `${backendUrl}/broadcasting/auth`,
        auth: {
            headers: {
              Authorization: "Bearer " + store.getState().token.value,
            },
        },
    });
}