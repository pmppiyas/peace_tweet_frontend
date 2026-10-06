import { io, Socket } from 'socket.io-client';
import { tokenStorage } from '@/lib/auth/token';

let socket: Socket | null = null;

export const getSocketUrl = (): string => {
  // If running in browser
  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    // On live production deployment (like peacetweet.vercel.app)
    if (!isLocalhost) {
      let candidate = (process.env.NEXT_PUBLIC_SOCKET_URL || '').trim();
      candidate = candidate.replace('peace-tweet-backend', 'peace-tweet-backned');

      if (
        candidate &&
        !candidate.includes('localhost') &&
        !candidate.includes('127.0.0.1')
      ) {
        return candidate.replace(/\/+$/, '');
      }

      let apiCandidate = (process.env.NEXT_PUBLIC_API_URL || '').trim();
      apiCandidate = apiCandidate.replace('peace-tweet-backend', 'peace-tweet-backned');

      if (
        apiCandidate &&
        !apiCandidate.includes('localhost') &&
        !apiCandidate.includes('127.0.0.1')
      ) {
        return apiCandidate.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');
      }

      return 'https://peace-tweet-backned.onrender.com';
    }
  }

  // Local development fallback
  const envSocketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (envSocketUrl) return envSocketUrl;

  const envApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  return envApiUrl.replace(/\/api\/v1\/?$/, '');
};

export const initSocket = (): Socket | null => {
  if (typeof window === 'undefined') return null;

  const token = tokenStorage.getAccessToken();
  if (!token) {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    return null;
  }

  // If socket instance already exists
  if (socket) {
    const currentToken = (socket.auth as any)?.token;
    if (currentToken !== token) {
      socket.auth = { token };
      socket.io.opts.extraHeaders = {
        authorization: `Bearer ${token}`,
      };
      socket.disconnect().connect();
    } else if (!socket.connected) {
      socket.connect();
    }
    return socket;
  }

  const socketUrl = getSocketUrl();

  socket = io(socketUrl, {
    auth: {
      token,
    },
    extraHeaders: {
      authorization: `Bearer ${token}`,
    },
    withCredentials: true,
    // Start with polling for instant handshake then upgrade to websocket
    transports: ['polling', 'websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  socket.on('connect_error', (error) => {
    console.warn('[Socket] Connection error:', error.message);
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  if (!socket && typeof window !== 'undefined') {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
