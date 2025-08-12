"use server";

import { suggestActivities } from "@/ai/flows/suggestActivities";
import { getWeather, type GetWeatherInput } from "@/ai/flows/getWeather";

export async function getSuggestions(activityTitle: string) {
  return await suggestActivities(activityTitle);
}

export async function getWeatherForActivity(input: GetWeatherInput) {
  return await getWeather(input);
}
