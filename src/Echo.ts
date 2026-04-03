import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import reverbConfig from './build/reverbConfig.json';
import { WindowWS } from '@clarion-app/types';
import { backendUrl } from './build/backendUrl';

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
        authorizer: (channel: { name: string }) => ({
            authorize: (socketId: string, callback: (error: boolean, data: unknown) => void) => {
                const csrfToken = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1] || '';
                fetch(`${backendUrl}/broadcasting/auth`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
                    },
                    body: `socket_id=${encodeURIComponent(socketId)}&channel_name=${encodeURIComponent(channel.name)}`,
                })
                .then(response => {
                    if (!response.ok) throw new Error(`Auth failed: ${response.status}`);
                    return response.json();
                })
                .then(data => callback(false, data))
                .catch(error => callback(true, error));
            },
        }),
    });
}