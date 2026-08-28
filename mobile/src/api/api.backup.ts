import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.225.247:3000';

export type AuthUser = {
  id: string;
  email: string;
  role: 'STAFF' | 'ADMIN';
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: AuthUser;
  };
};

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(result?.message)
        ? result.message.join(', ')
        : result?.message || 'Login gagal',
    );
  }

  await AsyncStorage.setItem(
    'accessToken',
    result.data.accessToken,
  );

  await AsyncStorage.setItem(
    'user',
    JSON.stringify(result.data.user),
  );

  return result;
}

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem('accessToken');
}

export async function getStoredUser(): Promise<AuthUser | null> {
  const user = await AsyncStorage.getItem('user');

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as AuthUser;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  await AsyncStorage.multiRemove([
    'accessToken',
    'user',
  ]);
}

export { API_URL };
