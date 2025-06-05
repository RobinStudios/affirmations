export type GoodThingItem = {
  id: string;
  date: string; // YYYY-MM-DD
  type: "quote" | "kindness" | "news" | "ai-news";
  content: string;
  source?: string;
  isFavorite?: boolean; // This will be dynamically added/managed by client
};
