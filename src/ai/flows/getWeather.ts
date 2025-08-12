'use server';
/**
 * @fileOverview A flow for getting the weather forecast.
 *
 * - getWeather - A function that gets the weather for a specific location and time.
 * - GetWeatherInput - The input type for the getWeather function.
 * - GetWeatherOutput - The return type for the getWeather function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GetWeatherInputSchema = z.object({
  city: z.string().describe('The city for which to get the weather forecast.'),
  date: z.string().describe('The date for the forecast in YYYY-MM-DD format.'),
  time: z.string().describe('The time for the forecast in HH:mm format.'),
});
export type GetWeatherInput = z.infer<typeof GetWeatherInputSchema>;

const GetWeatherOutputSchema = z.object({
  temperature: z.number().describe('The temperature in Fahrenheit.'),
  conditions: z.string().describe('A brief description of the weather conditions (e.g., "Sunny", "Cloudy").'),
});
export type GetWeatherOutput = z.infer<typeof GetWeatherOutputSchema>;

// This tool simulates a weather API call.
// In a real application, this would fetch data from a live weather service.
const getWeatherTool = ai.defineTool(
  {
    name: 'getWeatherTool',
    description: 'Returns the weather forecast for a given location and time.',
    inputSchema: GetWeatherInputSchema,
    outputSchema: GetWeatherOutputSchema,
  },
  async ({ city, date, time }) => {
    // Simulate weather based on time of day and location
    const hour = parseInt(time.split(':')[0], 10);
    let temp = 85; // Base temperature

    // Adjust for time of day
    if (hour < 6) temp = 75; // Early morning
    else if (hour < 12) temp += (hour - 6) * 3; // Morning warmup
    else if (hour < 17) temp = 105; // Hottest part of the day
    else if (hour < 20) temp -= (hour - 17) * 4; // Evening cool down
    else temp = 80; // Night

    // Adjust for city
    if (city.toLowerCase().includes('phoenix') || city.toLowerCase().includes('sedona')) {
      temp += 5;
    } else if (city.toLowerCase().includes('grand canyon')) {
      temp -= 10;
    }
    
    // Simulate slight daily variation
    const dayOfMonth = parseInt(date.split('-')[2], 10);
    temp += (dayOfMonth % 5) - 2;

    return {
        temperature: Math.round(temp),
        conditions: 'Sunny',
    };
  }
);

const getWeatherFlow = ai.defineFlow(
  {
    name: 'getWeatherFlow',
    inputSchema: GetWeatherInputSchema,
    outputSchema: GetWeatherOutputSchema,
  },
  async (input) => {
    // For this use case, we can directly call the tool.
    // A more complex flow could use an LLM to decide when to call the tool.
    return await getWeatherTool(input);
  }
);

export async function getWeather(input: GetWeatherInput): Promise<GetWeatherOutput> {
  return await getWeatherFlow(input);
}
