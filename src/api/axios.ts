import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosError,
  type CreateAxiosDefaults,
  type InternalAxiosRequestConfig,
} from 'axios';

/**
 * Standard API error payload returned from Django REST Framework endpoints.
 */
export interface ApiErrorPayload {
  code?: string;
  message: string;
  detail?: string;
  fields?: Record<string, string[]>;
  [key: string]: unknown;
}

/**
 * Custom Error class normalizing API errors for consistent handling across components.
 */
export class ApiError extends Error {
  status: number;
  data: ApiErrorPayload;

  constructor(status: number, data: ApiErrorPayload) {
    const message =
      data.message || data.detail || `API request failed with status ${status}`;
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Backend server address and API base URLs from environment or sensible defaults.
 */
const getEnvVar = (nextKey: string, viteKey: string, fallback: string = ''): string => {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[nextKey]) return process.env[nextKey] as string;
    if (process.env[viteKey]) return process.env[viteKey] as string;
  }
  return fallback;
};

export const BACKEND_URL: string =
  getEnvVar('NEXT_PUBLIC_BACKEND_URL', 'VITE_BACKEND_URL', '');

export const DEFAULT_API_BASE_URL: string =
  getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'VITE_API_BASE_URL', '/api/v1');

export const AUTH_API_BASE_URL: string =
  getEnvVar('NEXT_PUBLIC_AUTH_API_BASE_URL', 'VITE_AUTH_API_BASE_URL', `${DEFAULT_API_BASE_URL}/auth`);


/**
 * Extracts the Django CSRF token directly from document cookies.
 */
export function getCsrfTokenFromCookie(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

let csrfPromise: Promise<string> | null = null;

/**
 * Fetches/bootstraps a fresh CSRF token from the Django backend (/api/v1/csrf/).
 * Sets the csrftoken session cookie and returns the token string.
 */
export async function fetchCsrfToken(): Promise<string> {
  const cookieToken = getCsrfTokenFromCookie();
  if (cookieToken) return cookieToken;

  if (!csrfPromise) {
    const csrfEndpoint = `${DEFAULT_API_BASE_URL}/csrf/`;
    csrfPromise = axios
      .get<{ csrfToken: string }>(csrfEndpoint, { withCredentials: true })
      .then((res) => {
        return res.data?.csrfToken || getCsrfTokenFromCookie();
      })
      .catch((err) => {
        console.warn('Unable to bootstrap CSRF token from backend', err);
        return getCsrfTokenFromCookie();
      })
      .finally(() => {
        csrfPromise = null;
      });
  }
  return csrfPromise;
}

/**
 * Base configuration tailored for Django Session Authentication.
 * - withCredentials: true ensures sessionid and csrftoken cookies are sent.
 * - xsrfCookieName & xsrfHeaderName configure standard Django CSRF header handling.
 */
const defaultAxiosConfig: CreateAxiosDefaults = {
  baseURL: DEFAULT_API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
};

/**
 * Configures request and response interceptors for Django Session Auth on any Axios instance.
 */
export function setupSessionAuthInterceptors(instance: AxiosInstance): AxiosInstance {
  // Request Interceptor: Ensure CSRF token is attached for state-changing HTTP methods
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const method = (config.method || 'get').toUpperCase();
      const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

      if (isMutation) {
        let token =
          config.headers['X-CSRFToken'] ||
          config.headers['x-csrftoken'] ||
          getCsrfTokenFromCookie();

        if (!token) {
          token = await fetchCsrfToken();
        }

        if (token) {
          config.headers.set('X-CSRFToken', token as string);
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor: Normalize API errors and catch session authentication failures
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<Record<string, unknown>>) => {
      if (error.response) {
        const status = error.response.status;
        const rawData = error.response.data || {};

        // Parse DRF style error responses ({ detail: "..." } or { error: "..." } or { message: "..." } or { non_field_errors: [...] } or field dicts)
        let message = 'An unexpected error occurred';
        if (typeof rawData === 'string') {
          message = rawData;
        } else if (rawData.detail && typeof rawData.detail === 'string') {
          message = rawData.detail;
        } else if (rawData.message && typeof rawData.message === 'string') {
          message = rawData.message;
        } else if (rawData.error && typeof rawData.error === 'string') {
          message = rawData.error;
        } else if (Array.isArray(rawData.non_field_errors)) {
          message = rawData.non_field_errors.join(', ');
        } else if (typeof rawData === 'object' && rawData !== null) {
          const firstFieldKey = Object.keys(rawData)[0];
          if (firstFieldKey && Array.isArray((rawData as any)[firstFieldKey])) {
            message = `${firstFieldKey}: ${(rawData as any)[firstFieldKey].join(' ')}`;
          }
        }

        const normalizedPayload: ApiErrorPayload = {
          code: typeof rawData.code === 'string' ? rawData.code : undefined,
          message,
          detail: typeof rawData.detail === 'string' ? rawData.detail : undefined,
          fields:
            typeof rawData === 'object' && !Array.isArray(rawData)
              ? (rawData as Record<string, string[]>)
              : undefined,
        };

        // If session is expired or unauthorized (401 / 403), dispatch custom session expired event
        // ONLY for the core /auth/me/ endpoint so general sub-resource 401s (e.g. /awards/me/, /goals/me/) don't wipe the user session
        const requestUrl = (error.config?.url || '').trim();
        const baseURL = (error.config?.baseURL || '').trim();
        const isCoreAuthMe =
          baseURL.endsWith('/auth') &&
          (requestUrl === '/me/' || requestUrl === '/me' || requestUrl === '' || requestUrl === '/');

        if (
          isCoreAuthMe &&
          (status === 401 || (status === 403 && typeof rawData.detail === 'string' && rawData.detail.includes('CSRF')))
        ) {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(
              new CustomEvent('auth:unauthorized', {
                detail: { status, message: normalizedPayload.message },
              })
            );
          }
        }

        return Promise.reject(new ApiError(status, normalizedPayload));
      }

      // Network or request setup error
      const networkErrorPayload: ApiErrorPayload = {
        message: error.message || 'Network error. Please check your connection.',
      };
      return Promise.reject(new ApiError(0, networkErrorPayload));
    }
  );

  return instance;
}

/**
 * Factory function to create customized Axios instances with Django Session Auth pre-configured.
 */
export function createApiClient(customConfig?: CreateAxiosDefaults): AxiosInstance {
  const instance = axios.create({
    ...defaultAxiosConfig,
    ...customConfig,
    headers: {
      ...defaultAxiosConfig.headers,
      ...customConfig?.headers,
    },
  });
  return setupSessionAuthInterceptors(instance);
}

/**
 * Primary authenticated Axios instance for general API endpoints (/api/v1/...).
 * Configured with Django session credentials, automatic CSRF headers, and error handling.
 */
export const apiClient: AxiosInstance = createApiClient();

/**
 * Specialized Axios instance for authentication endpoints (/api/v1/auth/...).
 */
export const authApiClient: AxiosInstance = createApiClient({
  baseURL: AUTH_API_BASE_URL,
});

export default apiClient;

