
"use client";

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Activity, Suggestion } from '@/lib/types';
import ItineraryCalendar from '@/components/itinerary-calendar';
import AiSuggestions from '@/components/ai-suggestions';
import { getSuggestions } from './actions';
import { useToast } from "@/hooks/use-toast";
import { Sunrise } from 'lucide-react';
import { getActivities, addActivity, updateActivity, deleteActivity as deleteActivityFromDb } from '@/services/firestore';

function ItineraryPage() {
  const searchParams = useSearchParams();
  // const isAdmin = searchParams.get('admin') === 'true';
  const isAdmin = true;
  const isReadOnly = false;

  const [activities, setActivities] = useState<Activity[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchActivities() {
      try {
        console.log("Attempting to fetch activities...");
        setIsLoadingActivities(true);
        const fetchedActivities = await getActivities();
        console.log("Fetched activities:", fetchedActivities); // Log the fetched data
        setActivities(fetchedActivities);
      } catch (error) {
        console.error("Error fetching activities: ", error);
        setActivities([]); // Set activities to an empty array on error
        toast({
          variant: "destructive",
          title: "Database Error",
          description: "Could not load itinerary. Please try again later.",
        });
      } finally {
        setIsLoadingActivities(false);
        console.log("Finished fetching activities. isLoadingActivities:", false);
      }
    }
    fetchActivities();
  }, [toast]);

  const handleAddActivity = async (activity: Omit<Activity, 'id'>) => {
    if (isReadOnly) return;
    try {
      const newActivityId = await addActivity(activity);
      const newActivity = { ...activity, id: newActivityId };
      // After successfully adding, re-fetch activities to update the UI
      setIsLoadingSuggestions(true);
      const result = await getSuggestions(newActivity.title);
      if(result && result.length > 0) {
        setSuggestions(result);
      }
    } catch (error) {
      console.error('Failed to add activity:', error);
      toast({
        variant: "destructive",
        title: "Database Error",
        description: "Could not save the new activity.",
      });
    } finally {
      setIsLoadingSuggestions(false);
      // Always re-fetch and sort after adding
      const fetchedActivities = await getActivities();
      setActivities(fetchedActivities.sort((a, b) => {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        return a.time.localeCompare(b.time);
      }));
    }
  };

  const handleUpdateActivity = async (updatedActivity: Activity) => {
    if (isReadOnly) return;
    try {
      await updateActivity(updatedActivity);
      setActivities(activities.map((activity) =>
        activity.id === updatedActivity.id ? updatedActivity : activity
      ));
    } catch (error) {
      console.error('Failed to update activity:', error);
       toast({
        variant: "destructive",
        title: "Database Error",
        description: "Could not update the activity.",
      });
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (isReadOnly) return;
    try {
      await deleteActivityFromDb(id);
      setActivities(activities.filter((activity) => activity.id !== id));
    } catch (error) {
      console.error('Failed to delete activity:', error);
      toast({
        variant: "destructive",
        title: "Database Error",
        description: "Could not delete the activity.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary/80 text-primary-foreground py-6 px-4 md:px-8 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold font-headline flex items-center gap-3">
            <Sunrise className="w-8 h-8"/>
            Arizona Adventure Planner
          </h1>
          <p className="mt-1 text-primary-foreground/90">Your personal guide to the Grand Canyon State.</p>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3 flex flex-col gap-8">
             {isLoadingActivities ? (
                <p>Loading itinerary...</p>
             ) : (
                <ItineraryCalendar 
                  activities={activities}
                  onAddActivity={handleAddActivity}
                  onUpdateActivity={handleUpdateActivity}
                  onDeleteActivity={handleDeleteActivity}
                  isReadOnly={isReadOnly}
                />
             )}
          </div>
          <div className="lg:col-span-2">
            <AiSuggestions suggestions={suggestions} isLoading={isLoadingSuggestions} />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>Happy travels in sunny Arizona!</p>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ItineraryPage />
    </Suspense>
  )
}
