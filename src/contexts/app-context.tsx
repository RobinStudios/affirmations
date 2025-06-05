"use client";

import type { GoodThingItem } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { GOOD_THINGS_DATA, getTodayDateString } from '@/lib/content-data';
import { summarizeGoodNews } from '@/ai/flows/summarize-good-news';

interface AppContextType {
  favorites: string[];
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  getFavoriteItems: () => GoodThingItem[];
  getTodaysItem: () => Promise<GoodThingItem | null>;
  getArchivedItems: () => GoodThingItem[];
  isLoadingTodayItem: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useLocalStorage<string[]>('affirmation-oasis-favorites', []);
  const [todaysItemCache, setTodaysItemCache] = useState<GoodThingItem | null>(null);
  const [isLoadingTodayItem, setIsLoadingTodayItem] = useState<boolean>(false);

  const toggleFavorite = (itemId: string) => {
    setFavorites(prevFavorites =>
      prevFavorites.includes(itemId)
        ? prevFavorites.filter(id => id !== itemId)
        : [...prevFavorites, itemId]
    );
  };

  const isFavorite = (itemId: string) => favorites.includes(itemId);

  const getFavoriteItems = (): GoodThingItem[] => {
    return GOOD_THINGS_DATA.filter(item => favorites.includes(item.id)).map(item => ({...item, isFavorite: true}));
  };
  
  const getArchivedItems = (): GoodThingItem[] => {
    const today = getTodayDateString();
    return GOOD_THINGS_DATA.filter(item => item.date < today)
                           .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                           .map(item => ({...item, isFavorite: isFavorite(item.id)}));
  };

  const getTodaysItem = async (): Promise<GoodThingItem | null> => {
    const todayStr = getTodayDateString();

    if (todaysItemCache && todaysItemCache.date === todayStr) {
      return {...todaysItemCache, isFavorite: isFavorite(todaysItemCache.id)};
    }
    
    setIsLoadingTodayItem(true);
    let item = GOOD_THINGS_DATA.find(i => i.date === todayStr) || null;

    if (item && item.type === 'news' && item.content.startsWith('http')) {
      try {
        const summaryResult = await summarizeGoodNews({ articleUrl: item.content });
        item = {
          ...item,
          content: summaryResult.summary,
          type: 'ai-news', 
          source: item.source || "AI Summary", // Keep original source or use AI as source
        };
      } catch (error) {
        console.error("Failed to summarize news:", error);
        // Fallback to original content or a message
        item = { ...item, content: "Could not load news summary. View original article.", type: 'news' };
      }
    }
    
    if (item) {
      const itemWithFavoriteStatus = {...item, isFavorite: isFavorite(item.id)};
      setTodaysItemCache(itemWithFavoriteStatus);
      setIsLoadingTodayItem(false);
      return itemWithFavoriteStatus;
    }
    
    setIsLoadingTodayItem(false);
    return null;
  };


  return (
    <AppContext.Provider value={{ favorites, toggleFavorite, isFavorite, getFavoriteItems, getTodaysItem, getArchivedItems, isLoadingTodayItem }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
