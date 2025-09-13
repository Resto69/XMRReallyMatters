import { Offer, Trade, User, MarketStats, Dispute } from '../types';

const API_BASE = 'http://localhost:5011'; // Development backend URL

interface ErrorResponse {
  error: string;
  message: string;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export class ApiService {
  private token: string | null = null;
  private refreshToken: string | null = null;

  private setTokens(token: string, refreshToken: string) {
    this.token = token;
    this.refreshToken = refreshToken;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private clearTokens() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  constructor() {
    this.token = localStorage.getItem('token');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401 && this.refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        });

        if (refreshResponse.ok) {
          const { token, refreshToken } = await refreshResponse.json();
          this.setTokens(token, refreshToken);
          
          // Retry original request with new token
          headers['Authorization'] = `Bearer ${token}`;
          const retryResponse = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
          });

          if (retryResponse.ok) {
            return retryResponse.json();
          }
        }
      } catch (error) {
        this.clearTokens();
        throw new Error('Session expired. Please login again.');
      }
    }

    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // Market data
  async getMarketStats(): Promise<MarketStats> {
    return this.request<MarketStats>('/market-stats');
  }

  async getOffers(filters?: any): Promise<Offer[]> {
    const queryString = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return this.request<Offer[]>(`/offers${queryString}`);
  }

  async getOffer(id: string): Promise<Offer> {
    return this.request<Offer>(`/offers/${id}`);
  }

  async createOffer(offer: Partial<Offer>): Promise<Offer> {
    return this.request<Offer>('/offers', {
      method: 'POST',
      body: JSON.stringify(offer),
    });
  }

  // Trade management
  async getTrades(userId: string): Promise<Trade[]> {
    return this.request<Trade[]>(`/users/${userId}/trades`);
  }

  async getTrade(id: string): Promise<Trade> {
    return this.request<Trade>(`/trades/${id}`);
  }

  async startTrade(offerId: string, amount: number): Promise<Trade> {
    return this.request<Trade>('/trades', {
      method: 'POST',
      body: JSON.stringify({ offerId, amount }),
    });
  }

  async updateTradeStatus(tradeId: string, status: string): Promise<Trade> {
    return this.request<Trade>(`/trades/${tradeId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Authentication
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.setTokens(response.token, response.refreshToken);
    return response;
  }

  async register(username: string, password: string, email: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, email }),
    });
    this.setTokens(response.token, response.refreshToken);
    return response;
  }

  async logout(): Promise<void> {
    if (this.refreshToken) {
      try {
        await this.request('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    this.clearTokens();
  }

  // User management
  async getUser(id: string): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async getUserProfile(): Promise<User> {
    return this.request<User>('/auth/profile');
  }

  // Dispute system
  async getDisputes(): Promise<Dispute[]> {
    return this.request<Dispute[]>('/disputes');
  }

  async createDispute(tradeId: string, reason: string): Promise<Dispute> {
    return this.request<Dispute>('/disputes', {
      method: 'POST',
      body: JSON.stringify({ tradeId, reason }),
    });
  }

  // All mock data generators removed. Real backend API is now used for all endpoints.
}

export const apiService = new ApiService();