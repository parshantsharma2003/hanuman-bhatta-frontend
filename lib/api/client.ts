import axios, { type AxiosRequestConfig } from 'axios';
import { getApiBaseUrl } from './base';

const apiBaseUrl = getApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

export const API = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function getApiErrorMessage(error: unknown, fallback = 'Unable to complete request'): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as { message?: string; error?: string } | undefined;
    return responseData?.message || responseData?.error || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export async function getJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await API.get<ApiEnvelope<T>>(path, init as AxiosRequestConfig);
  const payload = response.data;

  if (!payload?.success) {
    throw new Error(payload?.message || 'Unable to fetch data');
  }

  return payload.data;
}
