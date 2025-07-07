import { useState, useEffect } from 'react';

// Глобальное состояние для избранного
let globalFavorites = new Set<string>();
let listeners: Set<() => void> = new Set();

// Загружаем избранное из localStorage при инициализации модуля
const loadFavorites = () => {
  const savedFavorites = localStorage.getItem('documentFavorites');
  if (savedFavorites) {
    try {
      const favoritesArray = JSON.parse(savedFavorites);
      globalFavorites = new Set(favoritesArray);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }
};

// Сохраняем избранное в localStorage
const saveFavorites = (favorites: Set<string>) => {
  localStorage.setItem('documentFavorites', JSON.stringify(Array.from(favorites)));
};

// Уведомляем все компоненты об изменении
const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Загружаем избранное при инициализации
loadFavorites();

export const useFavorites = () => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const listener = () => forceUpdate({});
    listeners.add(listener);
    
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const toggleFavorite = (documentKey: string) => {
    if (globalFavorites.has(documentKey)) {
      globalFavorites.delete(documentKey);
    } else {
      globalFavorites.add(documentKey);
    }
    saveFavorites(globalFavorites);
    notifyListeners();
  };

  const isFavorite = (documentKey: string) => {
    return globalFavorites.has(documentKey);
  };

  const getFavorites = () => {
    return Array.from(globalFavorites);
  };

  return {
    favorites: globalFavorites,
    toggleFavorite,
    isFavorite,
    getFavorites
  };
}; 