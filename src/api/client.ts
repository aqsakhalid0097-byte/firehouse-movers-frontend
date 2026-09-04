/**
 * Central API client for Firehouse Movers frontend SPA.
 * Handles session credentials, CSRF tokens, and consistent error payloads.
 */

export interface ApiErrorPayload {
  code?: string;
  message: string;
  fields?: Record<string, string[]>;
}

export class ApiError extends Error {
  status: number;
  data: ApiErrorPayload;

  constructor(status: number, data: ApiErrorPayload) {
    super(data.message || `API request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

import { DEFAULT_API_BASE_URL } from './axios';

let cachedCsrfToken: string | null = null;

export async function fetchCsrfToken(): Promise<string> {
  if (cachedCsrfToken) return cachedCsrfToken;

  try {
    const csrfUrl = `${DEFAULT_API_BASE_URL}/csrf/`;
    const res = await fetch(csrfUrl, { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      if (data.csrfToken) {
        cachedCsrfToken = data.csrfToken;
        return data.csrfToken;
      }
    }
  } catch (err) {
    console.warn('Unable to fetch CSRF token from backend, falling back to cookie', err);
  }

  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const method = (options.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrfToken = await fetchCsrfToken();
    if (csrfToken) {
      headers.set('X-CSRFToken', csrfToken);
    }
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    let errorData: ApiErrorPayload;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText || 'An unexpected error occurred' };
    }
    throw new ApiError(response.status, errorData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
