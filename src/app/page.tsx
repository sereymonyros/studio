
"use client";

import { useState, Suspense, useEffect } from 'react';
import type { Activity, Suggestion } from '@/lib/types';
import ItineraryCalendar from '@/components/itinerary-calendar';
import AiSuggestions from '@/components/ai-suggestions';
import { getSuggestions } from './actions';
import { useToast } from "@/hooks/use-toast";
import { Sunrise, Languages } from 'lucide-react';
import { getActivities, addActivity, updateActivity, deleteActivity as deleteActivityFromDb } from '@/services/firestore';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

const translations = {
  en: {
    title: "Arizona Adventure Planner",
    description: "Your personal guide to the Grand Canyon State.",
    footer: "Happy travels in sunny Arizona!",
    loading: "Loading itinerary...",
    toggleLang: "Switch to Khmer"
  },
  km: {
    title: "អ្នករៀបចំផែនការផ្សងព្រេងអារីហ្សូណា",
    description: "មគ្គុទ្ទេសក៍ផ្ទាល់ខ្លួនរបស់អ្នកទៅកាន់រដ្ឋ Grand Canyon ។",
    footer: "រីករាយដំណើរកម្សាន្តនៅអារីហ្សូណាដែលមានពន្លឺថ្ងៃ!",
    loading: "កំពុងផ្ទុក...",
    toggleLang: "ប្តូរទៅភាសាអង់គ្លេស"
  }
};

function ItineraryPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [lang, setLang] = useState<'en' | 'km'>('en');
  const { toast } = useToast();
  
  const t = translations[lang];

  useEffect(() => {
    async function fetchActivities() {
      try {
        setIsLoadingActivities(true);
        const fetchedActivities = await getActivities();
        setActivities(fetchedActivities);
      } catch (error) {
        console.error("Error fetching activities: ", error);
        setActivities([]); 
        toast({
          variant: "destructive",
          title: "Database Error",
          description: "Could not load itinerary. Please try again later.",
        });
      } finally {
        setIsLoadingActivities(false);
      }
    }
    fetchActivities();
  }, [toast]);

  const handleAddActivity = async (activity: Omit<Activity, 'id'>) => {
    try {
      const newActivityId = await addActivity(activity);
      const newActivity = { ...activity, id: newActivityId };
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
      const fetchedActivities = await getActivities();
      setActivities(fetchedActivities.sort((a, b) => {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        return a.time.localeCompare(b.time);
      }));
    }
  };

  const handleUpdateActivity = async (updatedActivity: Activity) => {
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
  
  const toggleLanguage = () => {
    setLang(prevLang => prevLang === 'en' ? 'km' : 'en');
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary/80 text-primary-foreground py-6 px-4 md:px-8 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-headline flex items-center gap-3">
              <Sunrise className="w-8 h-8"/>
              {t.title}
            </h1>
            <p className="mt-1 text-primary-foreground/90">{t.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={toggleLanguage} aria-label={t.toggleLang}>
              <Languages className="h-[1.2rem] w-[1.2rem]" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3 flex flex-col gap-8">
             {isLoadingActivities ? (
                <p>{t.loading}</p>
             ) : (
                <ItineraryCalendar 
                  activities={activities}
                  onAddActivity={handleAddActivity}
                  onUpdateActivity={handleUpdateActivity}
                  onDeleteActivity={handleDeleteActivity}
                  isReadOnly={false}
                />
             )}
          </div>
          <div className="lg:col-span-2">
            <AiSuggestions suggestions={suggestions} isLoading={isLoadingSuggestions} />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>{t.footer}</p>
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
