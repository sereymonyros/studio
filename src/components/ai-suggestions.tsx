"use client";

import type { Suggestion } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb } from "lucide-react";

interface AiSuggestionsProps {
  suggestions: Suggestion[];
  isLoading: boolean;
}

export default function AiSuggestions({ suggestions, isLoading }: AiSuggestionsProps) {
  const shouldRender = isLoading || suggestions.length > 0;

  if (!shouldRender) {
    return null;
  }
  
  return (
    <Card className="bg-card/80 border-dashed border-accent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent-foreground/80">
          <Lightbulb className="w-6 h-6 text-accent" />
          <span>AI-Powered Suggestions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        )}
        {!isLoading && suggestions.length > 0 && (
          <ul className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="pl-2 border-l-2 border-accent">
                <h4 className="font-bold font-headline">{suggestion.name}</h4>
                <p className="text-muted-foreground">{suggestion.description}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
