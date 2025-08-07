"use client";

import { useState, useEffect } from 'react';
import type { Activity, Suggestion } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import ItineraryForm from '@/components/itinerary-form';
import ItineraryList from '@/components/itinerary-list';
import AiSuggestions from '@/components/ai-suggestions';
import { getSuggestions } from './actions';
import { useToast } from "@/hooks/use-toast"
import { Cactus } from 'lucide-react';

export default function Home() {
  const [activities, setActivities] = useLocalStorage<Activity[]>('activities', []);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const { toast } = useToast()

  const handleAddActivity = async (activity: Omit<Activity, 'id'>) => {
    const newActivity = { ...activity, id: crypto.randomUUID() };
    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);

    setIsLoadingSuggestions(true);
    setSuggestions([]);
    try {
      const result = await getSuggestions(newActivity.title);
      if(result && result.length > 0) {
        setSuggestions(result);
      }
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not fetch suggestions at this time.",
      })
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter((activity) => activity.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary/80 text-primary-foreground py-6 px-4 md:px-8 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold font-headline flex items-center gap-3">
            <Cactus className="w-8 h-8"/>
            Arizona Adventure Planner
          </h1>
          <p className="mt-1 text-primary-foreground/90">Your personal guide to the Grand Canyon State.</p>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <ItineraryForm onAddActivity={handleAddActivity} />
            <AiSuggestions suggestions={suggestions} isLoading={isLoadingSuggestions} />
          </div>
          <div className="lg:col-span-3">
            <ItineraryList activities={activities} onDeleteActivity={handleDeleteActivity} />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>Happy travels in sunny Arizona!</p>
      </footer>
    </div>
  );
}
