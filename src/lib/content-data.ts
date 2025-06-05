import type { GoodThingItem } from '@/types';

// Helper to get date strings for mocking data around today
const getDateString = (offsetDays: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


export const GOOD_THINGS_DATA: GoodThingItem[] = [
  {
    id: '1',
    date: getDateString(0), // Today
    type: 'quote',
    content: 'The best way to uplift yourself is to uplift others.',
    source: 'Booker T. Washington',
  },
  {
    id: 'news-today',
    date: getDateString(0), // Also Today, to test AI summary. The app logic will pick one. Let's ensure home page picks based on a deterministic factor or just the first one.
    // For deterministic pick, ensure one item per day in a real scenario. For now, let's adjust so only one is for today
    // type: 'news',
    // content: 'https://www.goodnewsnetwork.org/rescue-dog-becomes-first-ever-pit-bull-k9-officer-in-new-york-state/', 
    // source: 'Good News Network',
  },
  {
    id: '2',
    date: getDateString(-1), // Yesterday
    type: 'kindness',
    content: 'A neighbor shared their garden harvest with the entire street.',
    source: 'Community Story',
  },
  {
    id: '3',
    date: getDateString(-2), // Day before yesterday
    type: 'news',
    content: 'https://www.positive.news/society/the-cafe-where-you-pay-what-you-can-afford/',
    source: 'Positive News',
  },
  {
    id: '4',
    date: getDateString(-3),
    type: 'quote',
    content: 'Believe you can and you\'re halfway there.',
    source: 'Theodore Roosevelt',
  },
  {
    id: '5',
    date: getDateString(-4),
    type: 'ai-news',
    content: 'Volunteers successfully reforested a large area, planting over 10,000 native trees in a single weekend.',
    source: 'AI Generated Summary',
  },
  {
    id: '6',
    date: getDateString(-5),
    type: 'kindness',
    content: 'Someone left a "take a book, leave a book" library box in the local park.',
  },
  {
    id: '7',
    date: getDateString(-6),
    type: 'quote',
    content: 'The only way to do great work is to love what you do.',
    source: 'Steve Jobs'
  },
  {
    id: '8',
    date: getDateString(-7),
    type: 'news',
    content: 'Local animal shelter reported a record number of adoptions this month.',
    source: 'Community Gazette'
  },
   {
    id: '9',
    date: getDateString(-8),
    type: 'quote',
    content: 'Every moment is a fresh beginning.',
    source: 'T.S. Eliot'
  },
  {
    id: '10',
    date: getDateString(-9),
    type: 'kindness',
    content: 'Students organized a charity drive for the local food bank, exceeding all expectations.',
    source: 'School Newsletter'
  }
];

// Adjust data so only one item exists for today if multiple were set by getDateString(0)
const todayStr = getDateString(0);
let todayItemCount = 0;
GOOD_THINGS_DATA.forEach(item => {
  if (item.date === todayStr) {
    todayItemCount++;
    if (todayItemCount > 1) {
      // Shift date of subsequent "today" items to ensure uniqueness for demo
      item.date = getDateString(0 - todayItemCount + 1); 
    }
  }
});
// Ensure there's one item for 'news' type for today for AI summary testing
const aiTestItemIndex = GOOD_THINGS_DATA.findIndex(item => item.id === 'news-today');
if (aiTestItemIndex !== -1) {
    GOOD_THINGS_DATA[aiTestItemIndex].date = getDateString(0);
    GOOD_THINGS_DATA[aiTestItemIndex].type = 'news';
    GOOD_THINGS_DATA[aiTestItemIndex].content = 'https://www.goodnewsnetwork.org/rescue-dog-becomes-first-ever-pit-bull-k9-officer-in-new-york-state/';
    // Remove the original 'today' item to avoid conflict
    const originalTodayIndex = GOOD_THINGS_DATA.findIndex(item => item.id === '1' && item.date === getDateString(0));
    if (originalTodayIndex !== -1 && originalTodayIndex !== aiTestItemIndex) {
        GOOD_THINGS_DATA.splice(originalTodayIndex, 1);
    }
} else {
    // If 'news-today' wasn't found, ensure item with id '1' is today's.
    const firstItem = GOOD_THINGS_DATA.find(item => item.id === '1');
    if (firstItem) firstItem.date = getDateString(0);
}


export const getTodayDateString = (): string => {
  return getDateString(0);
};
