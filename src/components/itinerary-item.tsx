"use client";

import React, { useState } from "react";
import type { Activity } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Mountain, Utensils, Landmark, MapPin, Edit, X } from "lucide-react";
import { format } from "date-fns";
import ItineraryForm from "./itinerary-form";

type ItineraryItemProps = {
  activity: Activity;
  onUpdateActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
};

const getIconForActivity = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (/\b(hike|mountain|park|trail|canyon)\b/.test(lowerTitle)) return <Mountain className="w-5 h-5 text-primary" />;
  if (/\b(eat|dine|restaurant|lunch|dinner|breakfast|food|cafe)\b/.test(lowerTitle)) return <Utensils className="w-5 h-5 text-primary" />;
  if (/\b(landmark|monument|museum|site|tour|gallery)\b/.test(lowerTitle)) return <Landmark className="w-5 h-5 text-primary" />;
  return <MapPin className="w-5 h-5 text-primary" />;
};

export default function ItineraryItem({ activity, onUpdateActivity, onDeleteActivity }: ItineraryItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Combine date and time for a full ISO-like string that the Date constructor understands
  const activityDate = new Date(`${activity.date}T${activity.time}`);

  const handleUpdate = (updatedActivity: Activity) => {
    onUpdateActivity(updatedActivity);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <Card className="bg-card/50">
        <CardContent className="p-4">
          <ItineraryForm 
            activity={activity} 
            onSubmit={(updatedActivity) => handleUpdate(updatedActivity as Activity)} 
            submitButtonText="Save Changes"
            onCancel={() => setIsEditing(false)}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all hover:shadow-md bg-card/80">
      <CardContent className="p-3 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          {getIconForActivity(activity.title)}
        </div>
        <div className="flex-grow">
          <p className="font-bold font-headline text-sm">{activity.title}</p>
          <p className="text-xs text-muted-foreground">
            {format(activityDate, "h:mm a")}
          </p>
        </div>
        <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary hover:bg-primary/10 h-8 w-8"
              onClick={() => setIsEditing(true)}
              aria-label={`Edit ${activity.title}`}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
              onClick={() => onDeleteActivity(activity.id)}
              aria-label={`Delete ${activity.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
