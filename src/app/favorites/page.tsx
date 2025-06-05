"use client";

import { ContentCard } from '@/components/content-card';
import { useAppContext } from '@/contexts/app-context';
import { Star } from 'lucide-react';

export default function FavoritesPage() {
  const { getFavoriteItems } = useAppContext();
  const favoriteItems = getFavoriteItems();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Star className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Your Favorites</h1>
      </div>
      
      {favoriteItems.length === 0 ? (
        <div className="text-center py-10">
          <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl text-muted-foreground">You haven't favorited any items yet.</p>
          <p className="text-muted-foreground">Tap the heart icon on an item to save it here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteItems.map(item => (
            <ContentCard key={item.id} item={item} className="h-full"/>
          ))}
        </div>
      )}
    </div>
  );
}
