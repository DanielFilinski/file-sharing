import React, { createContext, useContext, useEffect, useState } from 'react';
import { TeamsProvider } from './teams';
import { authService } from './auth';
import { errorHandler } from './errorHandler';
import { notificationService } from './notifications';
import NotificationContainer from '../ui/NotificationContainer';

interface AppContextType {
  isInitialized: boolean;
  isAuthenticated: boolean;
  currentUser: any;
  initialize: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  isInitialized: false,
  isAuthenticated: false,
  currentUser: null,
  initialize: async () => {},
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const initialize = async () => {
    try {
      // Настраиваем глобальную обработку ошибок
      errorHandler.setupGlobalErrorHandling();

      // Инициализируем аутентификацию
      await authService.initialize();

      // Проверяем статус аутентификации
      const user = await authService.getUserInfo();
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        notificationService.success(
          'Добро пожаловать',
          `Вы вошли как ${user.displayName}`
        );
      } else {
        // Пытаемся залогиниться и повторно получить пользователя
        try {
          await authService.login();
          const afterLoginUser = await authService.getUserInfo();
          if (afterLoginUser) {
            setCurrentUser(afterLoginUser);
            setIsAuthenticated(true);
            notificationService.success(
              'Добро пожаловать',
              `Вы вошли как ${afterLoginUser.displayName}`
            );
          }
        } catch (loginError) {
          notificationService.error('Требуется вход', 'Войдите, чтобы продолжить работу');
        }
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      notificationService.error(
        'Ошибка инициализации',
        'Не удалось инициализировать приложение'
      );
      setIsInitialized(true); // Все равно помечаем как инициализированное
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const contextValue: AppContextType = {
    isInitialized,
    isAuthenticated,
    currentUser,
    initialize,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <TeamsProvider>
        {children}
        <NotificationContainer />
      </TeamsProvider>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
