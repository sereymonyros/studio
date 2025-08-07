"use server";

import { suggestActivities } from "@/ai/flows/suggestActivities";

export async function getSuggestions(activityTitle: string) {
  return await suggestActivities(activityTitle);
}
