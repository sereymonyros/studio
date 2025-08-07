"use server";

import { runFlow } from "@genkit-ai/next/server";
import { suggestActivities } from "@/ai/flows/suggestActivities";

export async function getSuggestions(activityTitle: string) {
  return await runFlow(suggestActivities, activityTitle);
}
