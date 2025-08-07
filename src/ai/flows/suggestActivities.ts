'use server';
/**
 * @fileOverview A flow for suggesting activities.
 *
 * - suggestActivities - A function that suggests activities based on a topic.
 * - SuggestActivitiesInput - The input type for the suggestActivities function.
 * - SuggestActivitiesOutput - The return type for the suggestActivities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SuggestActivitiesInputSchema = z.string();
export type SuggestActivitiesInput = z.infer<typeof SuggestActivitiesInputSchema>;

const SuggestActivitiesOutputSchema = z.array(
  z.object({
    name: z.string().describe('The name of the suggested sight or activity.'),
    description: z
      .string()
      .describe('A brief description of the suggestion.'),
  })
);
export type SuggestActivitiesOutput = z.infer<
  typeof SuggestActivitiesOutputSchema
>;

const suggestActivitiesFlow = ai.defineFlow(
  {
    name: 'suggestActivitiesFlow',
    inputSchema: SuggestActivitiesInputSchema,
    outputSchema: SuggestActivitiesOutputSchema,
  },
  async topic => {
    const prompt = `You are an expert travel planning assistant specializing in Arizona. A user has just added "${topic}" to their itinerary. 
    
    Suggest 2 to 3 interesting and related sights or activities that are geographically nearby. For each suggestion, provide a name and a concise, compelling description.
    
    Return the output as a JSON array of objects, where each object has a "name" and a "description" key.`;

    const llmResponse = await ai.generate({
      prompt,
      model: 'googleai/gemini-2.0-flash',
      output: {
        format: 'json',
        schema: SuggestActivitiesOutputSchema,
      },
    });

    return llmResponse.output() || [];
  }
);

export async function suggestActivities(
  input: SuggestActivitiesInput
): Promise<SuggestActivitiesOutput> {
  return await suggestActivitiesFlow(input);
}
