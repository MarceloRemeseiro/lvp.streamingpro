import axios from 'axios';
import https from 'https';
import { LoginResponse } from '../types/restreamer';
import { authConfig } from '../lib/config';

interface ApiError {
  response?: {
    status: number;
  };
  config?: {
    _retry?: boolean;
    headers?: Record<string, string>;
    url?: string;
    method?: string;
  };
}

export class AuthService {
  private static instance: AuthService;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private axiosInstance;

  private constructor() {
    const config = {
      baseURL: authConfig.apiUrl,
      headers: {
        'Accept': 'application/json',
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };

    this.axiosInstance = axios.create(config);

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: ApiError) => {
        const config = error.config || {};
        if (error.response?.status === 401 && !config._retry) {
          config._retry = true;
          await this.refreshAccessToken();
          if (config.headers) {
            config.headers.Authorization = `Bearer ${this.accessToken}`;
          }
          return this.axiosInstance.request({
            ...config,
            url: config.url || '',
            method: config.method || 'get'
          });
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async login(): Promise<void> {
    try {
      const response = await this.axiosInstance.post<LoginResponse>('/api/login', {
        username: authConfig.username,
        password: authConfig.password,
      });
      
      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
    } catch (error) {
      console.error('Error en login:', error);
      throw new Error('Error de autenticación');
    }
  }

  private async refreshAccessToken(): Promise<void> {
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        const checkRefresh = setInterval(() => {
          if (!this.isRefreshing) {
            clearInterval(checkRefresh);
            resolve();
          }
        }, 100);
      });
    }

    this.isRefreshing = true;
    try {
      if (!this.refreshToken) {
        await this.login();
        return;
      }

      const response = await this.axiosInstance.post<LoginResponse>('/api/refresh', {
        refresh_token: this.refreshToken,
      });
      
      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      await this.login();
    } finally {
      this.isRefreshing = false;
    }
  }

  public async request<T>(
    method: string,
    url: string,
    data?: unknown
  ): Promise<T> {
    if (!this.accessToken) {
      await this.login();
    }

    try {
      const response = await this.axiosInstance.request({
        method,
        url,
        data,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        responseType: 'json',
      });
      return response.data as T;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 401) {
        await this.refreshAccessToken();
        return this.request(method, url, data);
      }
      throw error;
    }
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public setAccessToken(token: string): void {
    this.accessToken = token;
  }
}

export async function getAuthToken(): Promise<string | null> {
  try {
    const response = await fetch('/api/v3/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: process.env.NEXT_PUBLIC_RESTREAMER_USERNAME,
        password: process.env.NEXT_PUBLIC_RESTREAMER_PASSWORD
      })
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
} 