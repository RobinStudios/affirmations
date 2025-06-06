
"use client";

import type { GoodThingItem } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { getTodayDateString } from '@/lib/content-data'; // Keep for date string utility
import { summarizeGoodNews } from '@/ai/flows/summarize-good-news';
import { db } from '@/lib/firebase'; // Import Firestore instance
import { collection, query, where, getDocs, orderBy, limit, documentId } from 'firebase/firestore';

interface AppContextType {
  favorites: string[];
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  getFavoriteItems: () => Promise<GoodThingItem[]>;
  getTodaysItem: () => Promise<GoodThingItem | null>;
  getArchivedItems: () => Promise<GoodThingItem[]>;
  isLoadingTodayItem: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to map Firestore doc to GoodThingItem
const mapDocToGoodThingItem = (doc: any): GoodThingItem => {
  const data = doc.data();
  return {
    id: doc.id,
    date: data.date,
    type: data.type,
    content: data.content,
    source: data.source,
    // isFavorite will be set dynamically
  };
};

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

  const isFavorite = useCallback((itemId: string) => favorites.includes(itemId), [favorites]);

  const getFavoriteItems = useCallback(async (): Promise<GoodThingItem[]> => {
    if (!favorites.length) return [];
    setIsLoadingTodayItem(true); // Re-use loading state for simplicity, or add a new one
    try {
      const affirmationsCol = collection(db, 'affirmations');
      // Firestore 'in' query supports up to 30 elements in the array. 
      // For more, multiple queries would be needed. Assuming favorites list is not excessively long.
      if (favorites.length > 30) {
        console.warn("Favorite list is long, fetching in batches might be required for >30 items.");
      }
      const q = query(affirmationsCol, where(documentId(), 'in', favorites.slice(0, 30)));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        ...mapDocToGoodThingItem(doc),
        isFavorite: true,
      }));
      setIsLoadingTodayItem(false);
      return items;
    } catch (error) {
      console.error("Error fetching favorite items from Firestore:", error);
      setIsLoadingTodayItem(false);
      return []; // Fallback to empty array on error
    }
  }, [favorites, isFavorite]);
  
  const getArchivedItems = useCallback(async (): Promise<GoodThingItem[]> => {
    setIsLoadingTodayItem(true);
    const todayStr = getTodayDateString();
    try {
      const affirmationsCol = collection(db, 'affirmations');
      const q = query(
        affirmationsCol,
        where('date', '<', todayStr),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        ...mapDocToGoodThingItem(doc),
        isFavorite: isFavorite(doc.id),
      }));
      setIsLoadingTodayItem(false);
      return items;
    } catch (error) {
      console.error("Error fetching archived items from Firestore:", error);
      setIsLoadingTodayItem(false);
      return [];
    }
  }, [isFavorite]);

  const getTodaysItem = useCallback(async (): Promise<GoodThingItem | null> => {
    const todayStr = getTodayDateString();

    if (todaysItemCache && todaysItemCache.date === todayStr) {
      return {...todaysItemCache, isFavorite: isFavorite(todaysItemCache.id)};
    }
    
    setIsLoadingTodayItem(true);
    let item: GoodThingItem | null = null;

    try {
      const affirmationsCol = collection(db, 'affirmations');
      const q = query(affirmationsCol, where('date', '==', todayStr), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        item = mapDocToGoodThingItem(doc);

        if (item && item.type === 'news' && item.content.startsWith('http')) {
          try {
            const summaryResult = await summarizeGoodNews({ articleUrl: item.content });
            item = {
              ...item,
              content: summaryResult.summary,
              type: 'ai-news', 
              source: item.source || item.content, // Keep original source (URL) or use AI as source
            };
          } catch (summaryError) {
            console.error("Failed to summarize news:", summaryError);
            item = { ...item, content: "Could not load news summary. View original article.", type: 'news' };
          }
        }
      }
    } catch (error) {
      console.error("Error fetching today's item from Firestore:", error);
      // Optionally, could fallback to local data here if desired
      // For now, we'll return null on Firestore error to make it clear data source failed
    }
    
    if (item) {
      const itemWithFavoriteStatus = {...item, isFavorite: isFavorite(item.id)};
      setTodaysItemCache(itemWithFavoriteStatus);
    } else {
      setTodaysItemCache(null); // Clear cache if no item found for today
    }
    
    setIsLoadingTodayItem(false);
    return todaysItemCache ? { ...todaysItemCache, isFavorite: isFavorite(todaysItemCache.id) } : null;
  }, [isFavorite, todaysItemCache]);


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
