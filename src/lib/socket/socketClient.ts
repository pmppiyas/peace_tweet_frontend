import { io, Socket } from 'socket.io-client';
import { tokenStorage } from '@/lib/auth/token';

let socket: Socket | null = null;

export const getSocketUrl = (): string => {
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

  // If already connected with same auth, return existing
  if (socket?.connected) {
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
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
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
