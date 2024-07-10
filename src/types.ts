import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export interface WindowWS extends Window {
    Pusher: typeof Pusher;
    Echo: Echo;
}
