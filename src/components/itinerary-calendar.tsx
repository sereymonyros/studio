
"use client";

import React, { useState, type FC, useMemo } from 'react';
import type { Activity } from '@/lib/types';
import { format, startOfDay, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { enUS, km } from 'date-fns/locale';
import ItineraryItem from './itinerary-item';
import { Button } from '@/components/ui/button';
import { PlusCircle, Plane, User, CloudSun } from 'lucide-react';
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
  isAdmin: boolean;
  lang: Language;
  t: Translation;
};

const departurePassengers = [
    { name: 'Tony', seat: '31D' },
    { name: 'LyLy', seat: '31E' },
    { name: 'Benjamin', seat: '31B' },
    { name: 'Ryan', seat: '31C' },
    { name: 'Vanna', seat: '31F' },
    { name: 'Roth', seat: '15A' },
    { name: 'Mr.Ren', seat: '15B' },
    { name: 'Navin', seat: '15C' },
    { name: 'Lim', seat: '15D' },
    { name: 'Nhok', seat: '15E' },
    { name: 'Master Sieng', seat: '15F' },
  ];

const returnPassengers = [
    { name: 'Tony', seat: '31D' },
    { name: 'LyLy', seat: '31E' },
    { name: 'Benjamin', seat: '31B' },
    { name: 'Ryan', seat: '31C' },
    { name: 'Vanna', seat: '31F' },
    { name: 'Roth', seat: 'N/A' },
    { name: 'Mr.Ren', seat: 'N/A' },
    { name: 'Navin', seat: 'N/A' },
    { name: 'Lim', seat: 'N/A' },
    { name: 'Nhok', seat: 'N/A' },
    { name: 'Master Sieng', seat: 'N/A' },
];


const ItineraryCalendar: FC<ItineraryCalendarProps> = ({ activities, onAddActivity, onUpdateActivity, onDeleteActivity, isReadOnly = false, isAdmin, lang, t }) => {
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
    if (!isAdmin) return;
    await onAddActivity(activity);
    setAddModalOpen(false);
  };

  const dayBackgroundImages: Record<string, string> = {
    [`${year}-08-15`]: "https://firebasestorage.googleapis.com/v0/b/astral-web-460708-r4.firebasestorage.app/o/sedona.png?alt=media&token=b9789354-8b22-4034-a657-61683780da60",
    [`${year}-08-16`]: "https://firebasestorage.googleapis.com/v0/b/astral-web-460708-r4.firebasestorage.app/o/08-16.png?alt=media&token=12547b94-eb4d-4fe8-9c10-e34e6f457f25",
    [`${year}-08-17`]: "https://firebasestorage.googleapis.com/v0/b/astral-web-460708-r4.firebasestorage.app/o/08-17.png?alt=media&token=f3809b3f-af67-49de-aab3-e647c2e1aad1",
    [`${year}-08-18`]: 'https://firebasestorage.googleapis.com/v0/b/astral-web-460708-r4.firebasestorage.app/o/08-18.png?alt=media&token=51d72d6b-b709-4b7e-b0a2-dd8c08681892',
    [`${year}-08-19`]: 'https://firebasestorage.googleapis.com/v0/b/astral-web-460708-r4.firebasestorage.app/o/08-19.png?alt=media&token=7cd14791-e66a-4dd7-b329-dd6f56463cce',
    [`${year}-08-20`]: 'https://firebasestorage.googleapis.com/v0/b/astral-web-460708-r4.firebasestorage.app/o/08-20.jpg?alt=media&token=ca903707-fb19-4a20-9bad-a16234aba652',
    [`${year}-08-21`]: 'https://firebasestorage.googleapis.com/v0/b/astral-web-460708-r4.firebasestorage.app/o/08-21.avif?alt=media&token=56f9850c-3b35-4322-bc45-43992b5f0eae',
    [`${year}-08-22`]: 'https://firebasestorage.googleapis.com/v0/b/astral-web-460708-r4.firebasestorage.app/o/08-22.jpg?alt=media&token=5836dba8-5f31-47a5-b4f9-1e09fb912902',
    // Add more dates and URLs as needed
  };

  const openAddModal = (date: Date) => {
    if (!isAdmin) return;
    setSelectedDate(date);
    setAddModalOpen(true);
  }

  const FlightInfo = ({ title, passengers }: { title: string, passengers: {name: string, seat: string}[] }) => (
    <div className="relative z-20 p-2 text-xs bg-card/60 rounded-2xl">
      <h4 className="font-bold flex items-center justify-center gap-2 mb-2 text-black dark:text-white text-base text-center">
        <Plane className="w-4 h-4 text-black dark:text-white" /> {title}
      </h4>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-black dark:text-white text-[12px]">
        {passengers.map(p => (
          <div key={p.name} className="flex items-center gap-1.5">
              <User className="w-3 h-3 text-black dark:text-white"/>
              <span className="font-normal">{p.name}:</span>
              <span>{p.seat}</span>
          </div>
        ))}
      </div>
    </div>
  );
  
  const dailyTemperatures = useMemo(() => {
    const temps = new Map<string, { f: number, c: number }>();
    tripDays.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      // Use date to create a stable "random" seed
      const seed = day.getDate();
      const tempF = 100 + (seed % 16); // Stable random between 100-115
      const tempC = Math.round((tempF - 32) * 5 / 9);
      temps.set(dateKey, { f: tempF, c: tempC });
    });
    return temps;
  }, [tripDays]);


  return (
    <div className="rounded-lg p-4 md:p-6 shadow-sm">
      <Dialog open={isAddModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>{t.form.addTitle} {selectedDate && format(selectedDate, 'PPP', { locale })}</DialogTitle>
          </DialogHeader>
          <ItineraryForm 
            onSubmit={handleAddSubmit} 
            onCancel={() => setAddModalOpen(false)}
            activity={{ date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '' }}
            lang={lang}
            t={t.form}
            isReadOnly={!isAdmin}
          />
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {tripDays.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayActivities = (activitiesByDate[dateKey] || []).sort((a,b) => a.time.localeCompare(b.time));
          const weather = dailyTemperatures.get(dateKey);

          const backgroundImageSrc = dayBackgroundImages[dateKey];
          const isStartFlightDay = dateKey === `${year}-08-15`;
          const isEndFlightDay = dateKey === `${year}-08-22`;
          
          return (
            <div 
              key={day.toISOString()}
              className={cn(
                "rounded-[35px] p-2 flex flex-col relative overflow-hidden min-h-[300px] transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                'bg-card'
              )}
            >             
              {backgroundImageSrc && (
                <>
                  <Image
                    src={backgroundImageSrc}
                    alt={`Background for ${format(day, 'MMMM d')}`}
                    fill
                    className="object-cover z-0"
                  />
                  <div className="absolute inset-0 bg-black/20 z-10"></div>
                </>
              )}

              <div className="relative z-20 flex flex-col flex-grow">
                <div className="flex justify-between items-start text-white p-2">
                    <div className="flex flex-col">
                      <span className="font-bold text-lg">{format(day, 'd', { locale })}</span>
                      <span className="text-sm -mt-1">{format(day, 'EEEE', { locale })}</span>
                    </div>
                    
                    {weather && (
                       <div className="flex items-center gap-2 text-right">
                         <CloudSun className="w-5 h-5" />
                         <div className="flex flex-col" style={{fontSize: '16px'}}>
                           <span className="font-bold">{weather.f}°F</span>
                           <span className="font-light">{weather.c}°C</span>
                         </div>
                       </div>
                    )}
                </div>
                
                <div className="flex-grow space-y-2 mt-2 flex flex-col justify-center">
                  {isStartFlightDay && <div className="mb-2"><FlightInfo title="SEA-PHX 12-3PM" passengers={departurePassengers}/></div>}

                  {dayActivities.map(activity => (
                    <ItineraryItem 
                      key={activity.id}
                      activity={activity} 
                      onUpdateActivity={onUpdateActivity}
                      onDeleteActivity={onDeleteActivity}
                      isReadOnly={!isAdmin}
                      isAdmin={isAdmin}
                      lang={lang}
                      t={t.form}
                    />
                  ))}
                  
                  {isEndFlightDay && <div className="mt-auto pt-2"><FlightInfo title="PHX-SEA 2:00-5:00PM" passengers={returnPassengers} /></div>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default ItineraryCalendar;

    