"use client";import React from "react";


import type { GoodThingItem } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Newspaper, MessageSquareText, Sparkles, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppContext } from '@/contexts/app-context';
import { useToast } from '@/hooks/use-toast';

interface ContentCardProps {
  item: GoodThingItem;
  className?: string;
  showShare?: boolean;
  showFavorite?: boolean;
}

export function ContentCard({ item, className, showShare = true, showFavorite = true }: ContentCardProps) {
  const { toggleFavorite, isFavorite } = useAppContext();
  const { toast } = useToast();
  const [isHeartClicked, setIsHeartClicked] = React.useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click if any
    toggleFavorite(item.id);
    setIsHeartClicked(true);
    setTimeout(() => setIsHeartClicked(false), 500); // Reset animation state
     toast({
      title: isFavorite(item.id) ? "Removed from Favorites" : "Added to Favorites",
      description: `"${item.content.substring(0,30)}..."`,
    });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `One Good Thing: "${item.content}" ${item.source ? `- ${item.source}` : ''}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'One Good Thing',
          text: shareText,
          url: window.location.href, // Or a specific URL for the item if available
        });
        toast({ title: "Shared successfully!" });
      } catch (error) {
        console.error('Error sharing:', error);
        toast({ title: "Could not share", description: "Please try again.", variant: "destructive" });
      }
    } else {
      // Fallback for browsers that don't support navigator.share
      try {
        await navigator.clipboard.writeText(shareText);
        toast({ title: "Copied to clipboard!" });
      } catch (err) {
        toast({ title: "Failed to copy", description: "Could not copy to clipboard.", variant: "destructive" });
      }
    }
  };

  const Icon = item.type === 'quote' ? MessageSquareText : 
               item.type === 'kindness' ? Sparkles : 
               Newspaper;


  const cardContent = (
    <Card className={cn("w-full max-w-md shadow-xl flex flex-col fade-in", className)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon className="w-5 h-5" />
            <span>{item.type.charAt(0).toUpperCase() + item.type.slice(1).replace('-news', ' News')}</span>
          </div>
          <span className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString(undefined, { month:'short', day:'numeric' })}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center text-center py-8 px-6">
        <p className="text-2xl md:text-3xl font-medium leading-relaxed font-headline">
          "{item.content}"
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4 pt-4 pb-6">
        {item.source && (
            item.type === 'news' || (item.type === 'ai-news' && item.content.startsWith('http')) ? 
            <a 
              href={item.source.startsWith('http') ? item.source : (item.type === 'news' && item.content.startsWith('http') ? item.content : '#')} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              Source: {item.source.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]} <LinkIcon className="w-3 h-3"/>
            </a>
            :
            <p className="text-sm text-muted-foreground italic">- {item.source}</p>
        )}
        {(showFavorite || showShare) && (
          <div className="flex gap-4 mt-2">
            {showFavorite && (
              <Button variant="ghost" size="icon" onClick={handleToggleFavorite} aria-label="Favorite">
                <Heart className={cn("w-6 h-6", isFavorite(item.id) ? "fill-destructive text-destructive" : "text-muted-foreground", isHeartClicked && "heart-pulse")} />
              </Button>
            )}
            {showShare && (
              <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share">
                <Share2 className="w-6 h-6 text-muted-foreground" />
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );

  // If it's an AI-news item, and the original content was a URL (stored in item.source for example)
  // we could potentially link to it. For now, item.source is used as display.
  // The content would be the summary.

  return cardContent;
}
