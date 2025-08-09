
"use client";

import React, { useState, type FC } from 'react';
import type { Activity } from '@/lib/types';
import { format, startOfDay, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { enUS, km } from 'date-fns/locale';
import ItineraryItem from './itinerary-item';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ItineraryForm from './itinerary-form';
import { cn } from '@/lib/utils';
import Image from "next/image";
import type { Language, Translation } from '@/lib/translations';

type ItineraryCalendarProps = {
  activities: Activity[];
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
  onUpdateActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
  isReadOnly?: boolean;
  lang: Language;
  t: Translation;
};

const ItineraryCalendar: FC<ItineraryCalendarProps> = ({ activities, onAddActivity, onUpdateActivity, onDeleteActivity, isReadOnly = false, lang, t }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = new Date().getFullYear();
  const tripStart = new Date(year, 7, 15); 
  const tripEnd = new Date(year, 7, 22);

  const tripDays = eachDayOfInterval({ start: tripStart, end: tripEnd });

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  
  const locale = lang === 'km' ? km : enUS;

  const activitiesByDate = activities.reduce((acc, activity) => {
    const dateKey = activity.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  const handleAddSubmit = async (activity: Omit<Activity, 'id'>) => {
    await onAddActivity(activity);
    setAddModalOpen(false);
  };

  const dayBackgroundImages: Record<string, string> = {
    [`${year}-08-15`]: "https://roadslesstraveled.us/blog/wp-content/uploads/2014/05/A-04-Scenic-drive-in-Sedona-561.jpg", // Replace with your actual image URLs
    [`${year}-08-16`]: 'https://twoaztrains.com/wp-content/uploads/2022/12/Open-Air-Viewing-Cars-Verde-Canyon-Train-mb8.jpg',
    [`${year}-08-17`]: '/images/day3.jpg',
    [`${year}-08-18`]: '/images/day4.jpg',
    [`${year}-08-19`]: '/images/day5.jpg',
    [`${year}-08-20`]: '/images/day6.jpg',
    [`${year}-08-21`]: '/images/day7.jpg',
    [`${year}-08-22`]: '/images/day8.jpg',
    // Add more dates and URLs as needed
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
    <div className="bg-card/50 rounded-lg border p-4 md:p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {tripDays.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayActivities = (activitiesByDate[dateKey] || []).sort((a,b) => a.time.localeCompare(b.time));
          const isSedona = isSedonaDay(day);
          const isGrandCanyon = isGrandCanyonDay(day);
          const isSpecialDay = isSedona || isGrandCanyon;

          const backgroundImageSrc = dayBackgroundImages[dateKey];
          
          return (
            <div 
              key={day.toISOString()}
              className={cn(
                "border rounded-md p-2 flex flex-col relative overflow-hidden min-h-[150px] transition-all duration-300 hover:shadow-lg hover:-translate-y-1", 
                isToday(day) ? 'bg-accent/40' : 'bg-card',
                isSpecialDay && "text-white"
              )}
            >             
    

              {/* Render background image if available for this day */}
              {backgroundImageSrc && ( // Only apply if not a special day (Sedona/Grand Canyon have their own)
                <>
                  <Image
                    src={backgroundImageSrc}
                    alt={`Background for ${format(day, 'MMMM d')}`}
                    fill
                    className="object-cover z-0"
                  />
                  <div className="absolute inset-0 bg-black/30 z-10"></div> {/* Optional: Add an overlay for better text readability */}
                </>
              )}

              <div className="relative z-20">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                      <span className={cn("font-bold", isToday(day) && 'text-primary')}>{format(day, 'd', { locale })}</span>
                      <span className={cn("text-xs", isSpecialDay ? "text-white/80" : "text-muted-foreground")}>{format(day, 'EEEE', { locale })}</span>
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
                              <DialogTitle>{t.form.addTitle} {selectedDate && format(selectedDate, 'PPP', { locale })}</DialogTitle>
                              </DialogHeader>
                              {selectedDate && <ItineraryForm
                                  activity={{id: '', title: '', date: format(selectedDate!, 'yyyy-MM-dd'), time: '12:00', address: ''}}
                                  onSubmit={handleAddSubmit}
                                  onCancel={() => setAddModalOpen(false)}
                                  t={t.form}
                                  lang={lang}
                              />}
                          </DialogContent>
                      </Dialog>
                   )}
                </div>
              </div>
              <div className="flex-grow space-y-1 mt-2 relative z-20">
                  {dayActivities.map(activity => (
                    <ItineraryItem 
                      key={activity.id}
                      activity={activity} 
                      onUpdateActivity={onUpdateActivity}
                      onDeleteActivity={onDeleteActivity}
                      isReadOnly={isReadOnly}
                      lang={lang}
                      t={t.form}
                      isSpecialDay={isSpecialDay}
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

export default ItineraryCalendar;
