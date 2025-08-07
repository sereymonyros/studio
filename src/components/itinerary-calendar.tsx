"use client";

import React, { useState } from 'react';
import type { Activity } from '@/lib/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import ItineraryItem from './itinerary-item';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ItineraryForm from './itinerary-form';
import { cn } from '@/lib/utils';

type ItineraryCalendarProps = {
  activities: Activity[];
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
  onUpdateActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
};

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ItineraryCalendar({ activities, onAddActivity, onUpdateActivity, onDeleteActivity }: ItineraryCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Create an empty array for the first day of the week padding
  const startingDayOfWeek = getDay(monthStart);
  const paddingDays = Array.from({ length: startingDayOfWeek });

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
        <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl md:text-2xl font-bold font-headline">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-muted-foreground text-sm">
        {weekDays.map(day => <div key={day}>{day}</div>)}
      </div>
      
      <div className="grid grid-cols-7 grid-rows-5 gap-1 mt-2">
        {paddingDays.map((_, i) => <div key={`pad-${i}`} className="border rounded-md"></div>)}
        {daysInMonth.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayActivities = (activitiesByDate[dateKey] || []).sort((a,b) => a.time.localeCompare(b.time));
          
          return (
            <div key={day.toString()} className={cn("border rounded-md p-2 min-h-[120px] flex flex-col", isToday(day) ? 'bg-accent/40' : 'bg-card')}>
              <div className="flex justify-between items-center">
                <span className={cn("font-bold text-sm", isToday(day) && 'text-primary')}>{format(day, 'd')}</span>
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
                        <ItineraryForm
                          activity={{id: '', title: '', date: format(selectedDate!, 'yyyy-MM-dd'), time: '12:00'}}
                          onSubmit={handleAddSubmit}
                          onCancel={() => setAddModalOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
              </div>
              <div className="mt-1 space-y-1 overflow-y-auto">
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
