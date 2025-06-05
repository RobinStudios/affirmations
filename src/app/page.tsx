"use client";

import { useEffect, useState } from 'react';
import { ContentCard } from '@/components/content-card';
import { useAppContext } from '@/contexts/app-context';
import type { GoodThingItem } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function HomePage() {
  const { getTodaysItem, isLoadingTodayItem } = useAppContext();
  const [item, setItem] = useState<GoodThingItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchItem = async () => {
    setError(null);
    try {
      const fetchedItem = await getTodaysItem();
      setItem(fetchedItem);
      if (!fetchedItem) {
        setError("No good thing found for today. Please check back tomorrow!");
      }
    } catch (e) {
      console.error("Error fetching today's item:", e);
      setError("Could not load today's good thing. Please try refreshing.");
    }
  };

  useEffect(() => {
    fetchItem();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Depend on getTodaysItem which is memoized in context

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] pt-4 pb-8">
      {isLoadingTodayItem && !item && (
        <div className="flex flex-col items-center justify-center w-full max-w-md">
          <Skeleton className="h-[350px] w-full rounded-lg" />
          <Skeleton className="h-8 w-32 mt-4 rounded" />
        </div>
      )}
      {!isLoadingTodayItem && item && (
        <ContentCard item={item} className="min-h-[300px] md:min-h-[350px]" />
      )}
      {!isLoadingTodayItem && !item && (
         <div className="text-center p-8 bg-card rounded-lg shadow-xl max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Oops!</h2>
            <p className="text-muted-foreground mb-6">{error || "No good thing found for today. Please check back tomorrow!"}</p>
            {error && (
              <Button onClick={fetchItem}>
                <RefreshCw className="mr-2 h-4 w-4" /> Try Again
              </Button>
            )}
          </div>
      )}
    </div>
  );
}
