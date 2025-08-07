"use client";

import type { Activity } from "@/lib/types";
import ItineraryItem from "./itinerary-item";
import { format, parseISO } from 'date-fns';

type ItineraryListProps = {
  activities: Activity[];
  onDeleteActivity: (id: string) => void;
};

export default function ItineraryList({ activities, onDeleteActivity }: ItineraryListProps) {
  const sortedActivities = [...activities].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const groupedActivities = sortedActivities.reduce((acc, activity) => {
    const dateKey = activity.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  const sortedGroups = Object.entries(groupedActivities).sort(
    ([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime()
  );

  if (activities.length === 0) {
    return (
      <div className="text-center py-16 px-8 bg-card/50 rounded-lg border-2 border-dashed">
        <h3 className="text-xl font-semibold font-headline text-muted-foreground">Your Itinerary is Empty</h3>
        <p className="text-muted-foreground mt-2">Add an activity to start planning your adventure!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-headline border-b pb-2">Your Itinerary</h2>
      <div className="space-y-8">
        {sortedGroups.map(([date, groupActivities]) => (
          <div key={date}>
            <h3 className="text-lg font-semibold font-headline text-primary mb-3 sticky top-0 bg-background/80 backdrop-blur-sm py-2">
              {format(parseISO(`${date}T00:00:00`), 'EEEE, MMMM d')}
            </h3>
            <div className="space-y-3">
              {groupActivities.map((activity) => (
                <ItineraryItem
                  key={activity.id}
                  activity={activity}
                  onDeleteActivity={onDeleteActivity}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
