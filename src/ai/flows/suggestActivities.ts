import { defineFlow } from 'genkit';
import { z } from 'zod';
import { ai } from '../genkit';

export const suggestActivities = defineFlow(
  {
    name: 'suggestActivities',
    inputSchema: z.string(),
    outputSchema: z.array(
      z.object({
        name: z.string().describe('The name of the suggested sight or activity.'),
        description: z
          .string()
          .describe('A brief description of the suggestion.'),
      })
    ),
  },
  async (topic) => {
    const prompt = `You are an expert travel planning assistant specializing in Arizona. A user has just added "${topic}" to their itinerary. 
    
    Suggest 2 to 3 interesting and related sights or activities that are geographically nearby. For each suggestion, provide a name and a concise, compelling description.
    
    Return the output as a JSON array of objects, where each object has a "name" and a "description" key.`;

    const llmResponse = await ai.generate({
      prompt,
      model: 'googleai/gemini-2.0-flash',
      output: {
        format: 'json',
        schema: z.array(
          z.object({
            name: z.string(),
            description: z.string(),
          })
        ),
      },
    });

    return llmResponse.output() || [];
  }
);
