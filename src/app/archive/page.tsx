"use client";

import { ContentCard } from '@/components/content-card';
import { useAppContext } from '@/contexts/app-context';
import { Archive as ArchiveIcon } from 'lucide-react';

export default function ArchivePage() {
  const { getArchivedItems } = useAppContext();
  // For now, display all available past items. Gating is out of scope.
  // The prompt mentioned: "Limit to 7 entries for free users. Unlock full archive via one-time purchase"
  // We will display all for now.
  const archivedItems = getArchivedItems(); 

  return (
    <div className="space-y-8">
       <div className="flex items-center gap-3">
        <ArchiveIcon className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Archive</h1>
      </div>
      
      {archivedItems.length === 0 ? (
        <div className="text-center py-10">
          <ArchiveIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl text-muted-foreground">The archive is currently empty.</p>
          <p className="text-muted-foreground">Past items will appear here over time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {archivedItems.map(item => (
            <ContentCard key={item.id} item={item} className="h-full"/>
          ))}
        </div>
      )}
    </div>
  );
}
