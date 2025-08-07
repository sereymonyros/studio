"use client";

import type { Activity } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Mountain, Utensils, Landmark, MapPin } from "lucide-react";
import { format } from "date-fns";

type ItineraryItemProps = {
  activity: Activity;
  onDeleteActivity: (id: string) => void;
};

const getIconForActivity = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (/\b(hike|mountain|park|trail|canyon)\b/.test(lowerTitle)) return <Mountain className="w-6 h-6 text-primary" />;
  if (/\b(eat|dine|restaurant|lunch|dinner|breakfast|food|cafe)\b/.test(lowerTitle)) return <Utensils className="w-6 h-6 text-primary" />;
  if (/\b(landmark|monument|museum|site|tour|gallery)\b/.test(lowerTitle)) return <Landmark className="w-6 h-6 text-primary" />;
  return <MapPin className="w-6 h-6 text-primary" />;
};

export default function ItineraryItem({ activity, onDeleteActivity }: ItineraryItemProps) {
  const activityDate = new Date(`${activity.date}T${activity.time}`);

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          {getIconForActivity(activity.title)}
        </div>
        <div className="flex-grow">
          <p className="font-bold font-headline">{activity.title}</p>
          <p className="text-sm text-muted-foreground">
            {format(activityDate, "h:mm a")}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDeleteActivity(activity.id)}
          aria-label={`Delete ${activity.title}`}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
