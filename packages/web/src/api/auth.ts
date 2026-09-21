import { apiClient } from './client';

export interface LoginResponse {
  accessToken: string;
}

export async function login(username: string, password: string): Promise<string> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', { username, password });

  return data.accessToken;
}
