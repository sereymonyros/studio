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

type ItineraryCalendarProps = {
  activities: Activity[];
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
  onUpdateActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
};

export default function ItineraryCalendar({ activities, onAddActivity, onUpdateActivity, onDeleteActivity }: ItineraryCalendarProps) {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = new Date().getFullYear();
  // Dates are 0-indexed for month, so 7 is August.
  const tripStart = new Date(year, 7, 15); 
  const tripEnd = new Date(year, 7, 22);

  const tripDays = eachDayOfInterval({ start: tripStart, end: tripEnd });

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
          
          return (
            <div key={day.toString()} className={cn("border rounded-md p-2 min-h-[160px] flex flex-col", isToday(day) ? 'bg-accent/40' : 'bg-card')}>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <span className={cn("font-bold", isToday(day) && 'text-primary')}>{format(day, 'd')}</span>
                    <span className="text-xs text-muted-foreground">{format(day, 'EEEE')}</span>
                </div>
                 <Dialog open={isAddModalOpen && selectedDate && isSameDay(day, selectedDate)} onOpenChange={(isOpen) => { if (!isOpen) setAddModalOpen(false)}}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openAddModal(day)}>
                        <PlusCircle className="h-4 w-4 text-muted-foreground"/>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Add Activity on {selectedDate && format(selectedDate, 'PPP')}</DialogTitle>
                        </DialogHeader>
                        {selectedDate && (
                          <ItineraryForm
                            activity={{id: '', title: '', date: format(selectedDate, 'yyyy-MM-dd'), time: '12:00'}}
                            onSubmit={handleAddSubmit}
                            onCancel={() => setAddModalOpen(false)}
                          />
                        )}
                    </DialogContent>
                </Dialog>
              </div>
              <div className="mt-2 space-y-2 overflow-y-auto">
                {dayActivities.map(activity => (
                  <ItineraryItem
                    key={activity.id}
                    activity={activity}
                    onUpdateActivity={onUpdateActivity}
                    onDeleteActivity={onDeleteActivity}
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
