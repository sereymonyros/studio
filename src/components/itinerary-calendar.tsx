
"use client";

import React, { useState } from 'react';
import type { Activity } from '@/lib/types';
import { format, startOfDay, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import ItineraryItem from './itinerary-item';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ItineraryForm from './itinerary-form';
import { cn } from '@/lib/utils';
import Image from "next/image";

type ItineraryCalendarProps = {
  activities: Activity[];
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
  onUpdateActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
  isReadOnly?: boolean;
};

export default function ItineraryCalendar({ activities, onAddActivity, onUpdateActivity, onDeleteActivity, isReadOnly = false }: ItineraryCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = new Date().getFullYear();
  // Dates are 0-indexed for month, so 7 is August.
  const tripStart = new Date(year, 7, 15); 
  const tripEnd = new Date(year, 7, 22);

  const tripDays = eachDayOfInterval({ start: tripStart, end: tripEnd });

  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const activitiesByDate = activities.reduce((acc, activity) => {
    const dateKey = activity.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  const handleAddSubmit = (activity: Omit<Activity, 'id'>) => {
    onAddActivity(activity);
    setAddModalOpen(false);
  };

  const openAddModal = (date: Date) => {
    setSelectedDate(date);
    setAddModalOpen(true);
  }
  
  const isSedonaDay = (day: Date) => {
      const dayStr = format(day, 'yyyy-MM-dd');
      return dayStr === `${year}-08-15` || dayStr === `${year}-08-16`;
  }

  const isGrandCanyonDay = (day: Date) => {
      const dayStr = format(day, 'yyyy-MM-dd');
      return dayStr === `${year}-08-17` || dayStr === `${year}-08-18`;
  }

  return (
    <div className="bg-card/50 rounded-lg border p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold font-headline">
          Trip Itinerary: {format(tripStart, 'MMMM d')} - {format(tripEnd, 'd, yyyy')}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {tripDays.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayActivities = (activitiesByDate[dateKey] || []).sort((a,b) => a.time.localeCompare(b.time));
          const isSedona = isSedonaDay(day);
          const isGrandCanyon = isGrandCanyonDay(day);
          const isSpecialDay = isSedona || isGrandCanyon;
          
          return (
            <div 
              key={day.toISOString()}
              className={cn(
                "border rounded-md p-2 flex flex-col relative overflow-hidden min-h-[150px]", 
                isToday(day) ? 'bg-accent/40' : 'bg-card',
                isSpecialDay && "text-white"
              )}
            >
              {isSedona && (
                <>
                  <Image 
                    src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4nob-IyAOCdBqCRoSkOUtu2PaTE5nAqqzaPo1tBxpt2vgQzZgIMXAMFAXhw7Z2HEnzfwnRii7oDE-SrfmL9NoxXJUa6Q3rxef5zMQLcwgfQ40l-AyxRgExvCVvgW5AXs21G5bzsg=s680-w680-h510-rw"
                    alt="Sedona red rock view"
                    fill
                    className="object-cover z-0"
                    data-ai-hint="sedona red rock"
                  />
                  <div className="absolute inset-0 bg-black/30 z-10"></div>
                </>
              )}
              {isGrandCanyon && (
                 <>
                  <Image 
                    src="https://chasingexperiencesvlog.com/wp-content/uploads/slide-rock-state-park-for-kids-families-sedona-101-576x1024-1.jpg"
                    alt="Grand Canyon Landscape"
                    fill
                    className="object-cover z-0"
                    data-ai-hint="grand canyon"
                  />
                  <div className="absolute inset-0 bg-black/30 z-10"></div>
                </>
              )}
              <div className="relative z-20">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                      <span className={cn("font-bold", isToday(day) && 'text-primary')}>{format(day, 'd')}</span>
                      <span className={cn("text-xs", isSpecialDay ? "text-white/80" : "text-muted-foreground")}>{format(day, 'EEEE')}</span>
                  </div>
                   {!isReadOnly && (
                      <Dialog open={isAddModalOpen && selectedDate != null && isSameDay(day, selectedDate)} onOpenChange={(isOpen) => { if (!isOpen) setAddModalOpen(false)}}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className={cn("h-6 w-6", isSpecialDay && "hover:bg-white/20 text-white/80 hover:text-white")} onClick={() => openAddModal(day)}>
                              <PlusCircle className="h-4 w-4"/>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                              <DialogHeader>
                              <DialogTitle>Add Activity on {selectedDate && format(selectedDate, 'PPP')}</DialogTitle>
                              </DialogHeader>
                              {selectedDate && <ItineraryForm
                                  activity={{id: '', title: '', date: format(selectedDate!, 'yyyy-MM-dd'), time: '12:00', address: ''}}
                                  onSubmit={handleAddSubmit}
                                  onCancel={() => setAddModalOpen(false)}
                              />}
                          </DialogContent>
                      </Dialog>
                   )}
                </div>
              </div>
              <div className="flex-grow space-y-2 mt-2 relative z-20">
                  {dayActivities.map(activity => (
                    <ItineraryItem 
                      key={activity.id}
                      activity={activity} 
                      onUpdateActivity={onUpdateActivity}
                      onDeleteActivity={onDeleteActivity}
                      isReadOnly={isReadOnly}
                    />
                  ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
