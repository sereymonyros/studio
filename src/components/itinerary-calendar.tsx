
"use client";

import React, { useState, type FC, useMemo, useEffect } from 'react';
import type { Activity } from '@/lib/types';
import { format, startOfDay, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { enUS, km } from 'date-fns/locale';
import ItineraryItem from './itinerary-item';
import { Button } from '@/components/ui/button';
import { PlusCircle, Plane, User, CloudSun, Ticket } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ItineraryForm from './itinerary-form';
import { cn } from '@/lib/utils';
import Image from "next/image";
import type { Language, Translation } from '@/lib/translations';

type Passenger = {
    name: string;
    seat: string;
    avatar: 'male' | 'female' | 'child';
    boardingPassUrl?: string;
};

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

const departurePassengers: Passenger[] = [
    { name: 'Tony', seat: '31D', avatar: 'male', boardingPassUrl: 'https://firebasestorage.googleapis.com/v0/b/astral-web-460708-r4.firebasestorage.app/o/tony.jpeg?alt=media&token=c21d1bfe-a57b-4296-b487-a2f946d8a2d8' },
    { name: 'LyLy', seat: '31E', avatar: 'female' },
    { name: 'Benjamin', seat: '31B', avatar: 'child', boardingPassUrl: 'https://firebasestorage.googleapis.com/v0/b/astral-web-460708-r4.firebasestorage.app/o/benjamin.jpeg?alt=media&token=f6272d2b-7fd2-439e-a991-b63e349116b3' },
    { name: 'Ryan', seat: '31C', avatar: 'child' },
    { name: 'Vanna', seat: '31F', avatar: 'female', boardingPassUrl: 'https://firebasestorage.googleapis.com/v0/b/astral-web-460708-r4.firebasestorage.app/o/vanna.jpeg?alt=media&token=5f96dadd-9d57-4286-a274-56bca685b5dd' },
    { name: 'Roth', seat: '30E', avatar: 'male' },
    { name: 'Navin', seat: '30F', avatar: 'male' },
    { name: 'Lim', seat: '26D', avatar: 'female' },
    { name: 'Nhok', seat: '30D', avatar: 'male' },
    { name: 'Master Sieng', seat: '26C', avatar: 'male' },
    { name: 'Lord Ren', seat: '26B', avatar: 'male' },
  ];

const returnPassengers: Passenger[] = [
    { name: 'Tony', seat: '31E', avatar: 'male', boardingPassUrl: 'https://firebasestorage.googleapis.com/v0/b/astral-web-460708-r4.firebasestorage.app/o/tony.jpeg?alt=media&token=c21d1bfe-a57b-4296-b487-a2f946d8a2d8' },
    { name: 'LyLy', seat: '31B', avatar: 'female', boardingPassUrl: 'https://placehold.co/400x600.png' },
    { name: 'Benjamin', seat: '31D', avatar: 'child', boardingPassUrl: 'https://placehold.co/400x600.png' },
    { name: 'Ryan', seat: '31F', avatar: 'child', boardingPassUrl: 'https://placehold.co/400x600.png' },
    { name: 'Vanna', seat: '31C', avatar: 'female', boardingPassUrl: 'https://firebasestorage.googleapis.com/v0/b/astral-web-460708-r4.firebasestorage.app/o/vanna.jpeg?alt=media&token=5f96dadd-9d57-4286-a274-56bca685b5dd' },
    { name: 'Roth', seat: '30E', avatar: 'male', boardingPassUrl: 'https://placehold.co/400x600.png' },
    { name: 'Navin', seat: '30B', avatar: 'male', boardingPassUrl: 'https://placehold.co/400x600.png' },
    { name: 'Lim', seat: '30A', avatar: 'female', boardingPassUrl: 'https://placehold.co/400x600.png' },
    { name: 'Nhok', seat: '30E', avatar: 'male', boardingPassUrl: 'https://placehold.co/400x600.png' },
    { name: 'Master Lee', seat: '30D', avatar: 'male', boardingPassUrl: 'https://placehold.co/400x600.png' },
    { name: 'Lord Ren', seat: '3C', avatar: 'male', boardingPassUrl: 'https://placehold.co/400x600.png' },
];

const useDailyRandomTemperature = (dateKey: string) => {
  const [temp, setTemp] = useState<number | null>(null);

  useEffect(() => {
    // This function now runs only on the client side
    const getStoredTemp = () => {
      const todayStr = new Date().toISOString().split('T')[0];
      const storedData = localStorage.getItem(`weather_${dateKey}`);
      if (storedData) {
        const { temp, date } = JSON.parse(storedData);
        if (date === todayStr) {
          return temp;
        }
      }
      return null;
    };

    const storedTemp = getStoredTemp();
    if (storedTemp) {
      setTemp(storedTemp);
    } else {
      const newTemp = Math.floor(Math.random() * (110 - 100 + 1)) + 100;
      localStorage.setItem(`weather_${dateKey}`, JSON.stringify({ temp: newTemp, date: new Date().toISOString().split('T')[0] }));
      setTemp(newTemp);
    }
  }, [dateKey]);

  return temp;
};

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

  const FlightInfo = ({ title, passengers }: { title: string, passengers: Passenger[] }) => {
    const [flight, time] = title.split(' ');
    
    const Avatar = () => {
        const iconProps = { className: "w-3 h-3 text-black dark:text-white" };
        return <User {...iconProps} />;
    };
    
    const PassengerItem = ({ passenger }: { passenger: Passenger }) => (
      <Dialog>
        <DialogTrigger asChild>
          <button className="flex items-center gap-1.5 text-left hover:bg-white/20 p-1 rounded-md transition-colors w-full">
            <Avatar />
            <span className="font-normal">{passenger.name}:</span>
            <span>{passenger.seat}</span>
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Boarding Pass: {passenger.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Image
              src={passenger.boardingPassUrl || `https://placehold.co/400x600.png`}
              alt={`Boarding pass for ${passenger.name}`}
              width={400}
              height={600}
              className="rounded-lg mx-auto"
              data-ai-hint="boarding pass"
            />
          </div>
        </DialogContent>
      </Dialog>
    );

    return (
        <div className="relative z-20 p-2 text-xs bg-card/60 rounded-[35px]">
            <h4 className="font-bold flex items-center justify-center gap-2 mb-2 text-black dark:text-white text-base text-center">
                <Plane className="w-4 h-4 text-black dark:text-white" />
                <span>{flight}</span>
                <span className="text-xs text-muted-foreground">{time}</span>
            </h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-black dark:text-white text-[12px]">
                {passengers.slice(0, -2).map((p) => (
                    <PassengerItem key={p.name} passenger={p} />
                ))}
            </div>
            <div className="grid grid-cols-1 pt-1.5 pb-1.5">
                {passengers.slice(-2).map((p) => (
                     <div key={p.name} className="flex justify-center">
                        <PassengerItem passenger={p} />
                     </div>
                ))}
            </div>
        </div>
    );
};

const Weather = ({ dateKey, lang, t }: { dateKey: string; lang: Language, t: Translation }) => {
    const tempF = useDailyRandomTemperature(dateKey);
    const tempC = tempF ? Math.round(((tempF - 32) * 5) / 9) : null;
    
    if (tempF === null) return null;

    return (
      <div className="absolute top-2 right-2 z-20 text-white p-2 text-right">
        <div className="flex items-start gap-1">
          <CloudSun className="w-5 h-5 mt-0.5" />
          <div>
            <div className="font-bold text-lg leading-none">{tempF}{t.weather.fahrenheit}</div>
            <div className="font-bold text-xs leading-none">{tempC}{t.weather.celsius}</div>
          </div>
        </div>
      </div>
    );
  };

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
                <Weather dateKey={dateKey} lang={lang} t={t} />
                <div className="flex justify-between items-start text-white p-2">
                    <div className="flex flex-col">
                      <span className="font-bold text-lg">{format(day, 'd', { locale })}</span>
                      <span className="text-sm -mt-1 font-bold">{format(day, 'EEEE', { locale })}</span>
                    </div>
                </div>
                
                <div className="flex-grow space-y-2 mt-2 flex flex-col justify-center">
                  {isStartFlightDay && <div className="mb-2"><FlightInfo title="SEA-PHX 11:00-3:00PM" passengers={departurePassengers} /></div>}

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

                {!isReadOnly && (
                    <div className="relative z-20 mt-auto p-2">
                        <Button
                            variant="ghost"
                            className="w-full bg-black/30 text-white hover:bg-black/50 hover:text-white rounded-2xl"
                            onClick={() => openAddModal(day)}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add
                        </Button>
                    </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default ItineraryCalendar;

    

    
