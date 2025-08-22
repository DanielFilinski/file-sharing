import { TeamsUserCredential } from '@microsoft/teamsfx';
import { apiClient } from '../api';

export interface AuthConfig {
  clientId: string;
  initiateLoginEndpoint: string;
  apiEndpoint: string;
  apiScope: string;
}

export interface UserInfo {
  id: string;
  displayName: string;
  email: string;
  tenantId: string;
}

export class AuthService {
  private credential: TeamsUserCredential | null = null;
  private config: AuthConfig | null = null;
  private currentUser: UserInfo | null = null;
  private tokenRefreshTimer: NodeJS.Timeout | null = null;

  async initialize(config?: AuthConfig): Promise<void> {
    if (config) {
      this.config = config;
    } else {
      // Используем значения из переменных окружения
      this.config = {
        clientId: import.meta.env.VITE_CLIENT_ID || '',
        initiateLoginEndpoint: import.meta.env.VITE_START_LOGIN_PAGE_URL || '',
        apiEndpoint: import.meta.env.VITE_API_ENDPOINT || '',
        apiScope: import.meta.env.VITE_API_SCOPE || '',
      };
    }

    if (!this.config.clientId) {
      throw new Error('Client ID is required for authentication');
    }

    try {
      this.credential = new TeamsUserCredential({
        clientId: this.config.clientId,
        initiateLoginEndpoint: this.config.initiateLoginEndpoint,
        apiEndpoint: this.config.apiEndpoint,
      });

      // Обновляем токен в API клиенте
      const token = await this.getToken();
      if (token) {
        apiClient.setToken(token);
      }

      // Настраиваем автоматическое обновление токена
      this.setupTokenRefresh();
    } catch (error) {
      console.error('Failed to initialize authentication:', error);
      throw error;
    }
  }

  async getToken(): Promise<string | null> {
    if (!this.credential) {
      throw new Error('Authentication not initialized');
    }

    try {
      const token = await this.credential.getToken([this.config!.apiScope]);
      return token?.token || null;
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  }

  async getUserInfo(): Promise<UserInfo | null> {
    if (!this.credential) {
      throw new Error('Authentication not initialized');
    }

    try {
      const userInfo = await this.credential.getUserInfo();
      if (userInfo) {
        this.currentUser = {
          id: userInfo.id || '',
          displayName: userInfo.displayName || '',
          email: userInfo.preferredUserName || '',
          tenantId: userInfo.tenantId || '',
        };
        return this.currentUser;
      }
      return null;
    } catch (error) {
      console.error('Failed to get user info:', error);
      return null;
    }
  }

  async login(): Promise<void> {
    if (!this.credential) {
      throw new Error('Authentication not initialized');
    }

    try {
      await this.credential.login([this.config!.apiScope]);
      
      // Обновляем токен в API клиенте
      const token = await this.getToken();
      if (token) {
        apiClient.setToken(token);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    if (!this.credential) {
      return;
    }

    try {
      await this.credential.logout();
      this.currentUser = null;
      apiClient.setToken(null);
      
      // Очищаем таймер обновления токена
      if (this.tokenRefreshTimer) {
        clearTimeout(this.tokenRefreshTimer);
        this.tokenRefreshTimer = null;
      }
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return this.credential !== null && this.currentUser !== null;
  }

  getCurrentUser(): UserInfo | null {
    return this.currentUser;
  }

  private setupTokenRefresh(): void {
    // Обновляем токен каждые 50 минут (токены обычно живут 1 час)
    const REFRESH_INTERVAL = 50 * 60 * 1000; // 50 минут

    this.tokenRefreshTimer = setInterval(async () => {
      try {
        const token = await this.getToken();
        if (token) {
          apiClient.setToken(token);
        }
      } catch (error) {
        console.error('Failed to refresh token:', error);
        // При ошибке обновления токена пытаемся перелогиниться
        try {
          await this.login();
        } catch (loginError) {
          console.error('Failed to re-login after token refresh error:', loginError);
        }
      }
    }, REFRESH_INTERVAL);
  }

  // Метод для ручного обновления токена
  async refreshToken(): Promise<string | null> {
    try {
      const token = await this.getToken();
      if (token) {
        apiClient.setToken(token);
      }
      return token;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }
}

// Создаем глобальный экземпляр сервиса аутентификации
export const authService = new AuthService();
