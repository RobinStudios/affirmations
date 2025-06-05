// Summarizes a news article to provide the user with a quick and positive update on world events.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeGoodNewsInputSchema = z.object({
  articleUrl: z
    .string()
    .url()
    .describe('The URL of the news article to summarize.'),
});
export type SummarizeGoodNewsInput = z.infer<typeof SummarizeGoodNewsInputSchema>;

const SummarizeGoodNewsOutputSchema = z.object({
  summary: z.string().describe('A short, positive summary of the news article.'),
});
export type SummarizeGoodNewsOutput = z.infer<typeof SummarizeGoodNewsOutputSchema>;

export async function summarizeGoodNews(input: SummarizeGoodNewsInput): Promise<SummarizeGoodNewsOutput> {
  return summarizeGoodNewsFlow(input);
}

const summarizeGoodNewsPrompt = ai.definePrompt({
  name: 'summarizeGoodNewsPrompt',
  input: {schema: SummarizeGoodNewsInputSchema},
  output: {schema: SummarizeGoodNewsOutputSchema},
  prompt: `Summarize the following news article in a short, positive blurb. Use no more than 50 words.\n\nArticle URL: {{{articleUrl}}}`,
});

const summarizeGoodNewsFlow = ai.defineFlow(
  {
    name: 'summarizeGoodNewsFlow',
    inputSchema: SummarizeGoodNewsInputSchema,
    outputSchema: SummarizeGoodNewsOutputSchema,
  },
  async input => {
    const {output} = await summarizeGoodNewsPrompt(input);
    return output!;
  }
);
