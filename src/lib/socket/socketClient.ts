import { io, Socket } from 'socket.io-client';
import { tokenStorage } from '@/lib/auth/token';
import { envConfig } from '@/config/env';

let socket: Socket | null = null;

export const cleanSocketOrigin = (urlStr: string): string => {
  if (!urlStr) return '';
  const trimmed = urlStr.trim();
  try {
    const parsed = new URL(trimmed);
    return parsed.origin;
  } catch {
    return trimmed
      .replace(/\/api(\/v1)?\/?$/, '')
      .replace(/\/socket\.io\/?$/, '')
      .replace(/\/+$/, '');
  }
};

export const getSocketUrl = (): string => {
  const envSocketUrl = (
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    envConfig.socketUrl ||
    ''
  ).trim();

  if (envSocketUrl) {
    return cleanSocketOrigin(envSocketUrl);
  }

  const envApiUrl = (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    envConfig.apiUrl ||
    ''
  ).trim();

  if (envApiUrl) {
    return cleanSocketOrigin(envApiUrl);
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return '';
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
  if (!socketUrl) return null;

  socket = io(socketUrl, {
    path: '/socket.io',
    auth: {
      token,
    },
    extraHeaders: {
      authorization: `Bearer ${token}`,
    },
    withCredentials: true,
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
