
"use client";

import { useState, Suspense, useEffect } from 'react';
import type { Activity, Suggestion } from '@/lib/types';
import ItineraryCalendar from '@/components/itinerary-calendar';
import AiSuggestions from '@/components/ai-suggestions';
import { getSuggestions } from './actions';
import { useToast } from "@/hooks/use-toast";
import { Sunrise } from 'lucide-react';
import { getActivities, addActivity, updateActivity, deleteActivity as deleteActivityFromDb } from '@/services/firestore';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { translations } from '@/lib/translations';
import type { Language } from '@/lib/translations';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

function ItineraryPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [lang, setLang] = useState<Language>('en');
  const [isAdmin, setIsAdmin] = useState(true);
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
          title: t.toasts.dbErrorTitle,
          description: t.toasts.dbErrorLoad,
        });
      } finally {
        setIsLoadingActivities(false);
      }
    }
    fetchActivities();
  }, [toast, t.toasts]);

  const handleAddActivity = async (activity: Omit<Activity, 'id'>) => {
    if (isAdmin) return; // Disable in admin mode
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
        title: t.toasts.dbErrorTitle,
        description: t.toasts.dbErrorSave,
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
    if (isAdmin) return; // Disable in admin mode
    try {
      await updateActivity(updatedActivity);
      const fetchedActivities = await getActivities();
      setActivities(fetchedActivities);
    } catch (error) {
      console.error('Failed to update activity:', error);
       toast({
        variant: "destructive",
        title: t.toasts.dbErrorTitle,
        description: t.toasts.dbErrorUpdate,
      });
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (isAdmin) return; // Disable in admin mode
    try {
      await deleteActivityFromDb(id);
      setActivities(activities.filter((activity) => activity.id !== id));
    } catch (error) {
      console.error('Failed to delete activity:', error);
      toast({
        variant: "destructive",
        title: t.toasts.dbErrorTitle,
        description: t.toasts.dbErrorDelete,
      });
    }
  };
  
  const toggleLanguage = () => {
    setLang(prevLang => prevLang === 'en' ? 'km' : 'en');
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary/80 text-white-foreground py-6 px-4 md:px-8 shadow-md">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center md:justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold font-headline flex items-center justify-center md:justify-start gap-3">
              <Sunrise className="w-8 h-8"/>
              {t.header.title}
            </h1>
            <p className="mt-1 text-white-foreground/90">{t.header.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="admin-mode" checked={isAdmin} onCheckedChange={setIsAdmin} aria-label="Toggle Admin Mode" />
              <Label htmlFor="admin-mode" className="flex items-center gap-2 text-foreground dark:text-primary-foreground font-medium">
                <span>{isAdmin ? 'Admin' : 'User'}</span>
              </Label>
            </div>
            <Button variant="ghost" onClick={toggleLanguage} aria-label={t.header.toggleLang} className="font-bold">
              {lang === 'en' ? 'ខ្មែរ' : 'EN'}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="rounded-lg p-4">
          <div className="flex justify-center">
            <div className="grid lg:grid-cols-2 gap-8 items-start w-full max-w-6xl">
              <div className="lg:col-span-3 flex flex-col gap-8">
                {isLoadingActivities ? (
                    <p>{t.calendar.loading}</p>
                ) : (
                    <ItineraryCalendar 
                      activities={activities}
                      onAddActivity={handleAddActivity}
                      onUpdateActivity={handleUpdateActivity}
                      onDeleteActivity={handleDeleteActivity}
                      isReadOnly={isAdmin}
                      lang={lang}
                      t={t}
                    />
                )}
              </div>
              <div className="lg:col-span-2">
                <AiSuggestions suggestions={suggestions} isLoading={isLoadingSuggestions} t={t.suggestions} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>{t.footer.text}</p>
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
