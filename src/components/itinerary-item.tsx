
"use client";

import React, { useState, useEffect } from "react";
import type { Activity } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Mountain, Utensils, Landmark, MapPin, Edit, Calendar, Clock, Link, Key, Home } from "lucide-react";
import { format } from "date-fns";
import { enUS, km } from 'date-fns/locale';
import ItineraryForm from "./itinerary-form";
import { cn } from "@/lib/utils";
import type { Language, Translation } from "@/lib/translations";

type ItineraryItemProps = {
  activity: Activity;
  onUpdateActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
  isReadOnly?: boolean;
  isAdmin: boolean;
  lang: Language;
  t: Translation['form'];
};

const getIconForActivity = (activity: Activity) => {
  const { title, address, website } = activity;
  const textToSearch = [title, address || '', website || ''].join(' ').toLowerCase();

  const iconProps = { className: cn("w-4 h-4 text-black/80 dark:text-white/80"), strokeWidth: 2.5 };
  if (/\b(home|airbnb)\b/i.test(textToSearch)) return <Home {...iconProps} />;
  if (/\b(hike|mountain|park|trail|canyon)\b/.test(textToSearch)) return <Mountain {...iconProps} />;
  if (/\b(eat|dine|restaurant|lunch|dinner|breakfast|food|cafe)\b/i.test(textToSearch)) return <Utensils {...iconProps} />;
  if (/\b(landmark|monument|museum|site|tour)\b/i.test(textToSearch)) return <Landmark {...iconProps} />;
  return <MapPin {...iconProps} />;
};

export default function ItineraryItem({ activity, onUpdateActivity, onDeleteActivity, isReadOnly = false, isAdmin, lang, t }: ItineraryItemProps) {
  const [isDetailViewOpen, setDetailViewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const locale = lang === 'km' ? km : enUS;
  const displayTitle = lang === 'km' && activity.title_km ? activity.title_km : activity.title;

  let formattedTime = "";
  let formattedDate = "";
  try {
    // Safari does not like `new Date('YYYY-MM-DD')`
    const activityDate = new Date(`${activity.date.replace(/-/g, '/')}T${activity.time}`);
    if (!isNaN(activityDate.getTime())) {
      formattedTime = format(activityDate, "p", { locale });
      formattedDate = format(activityDate, "PPPP", { locale });
      console.log("Time: ", formattedTime);
    }
  } catch (e) {
    console.error("Error formatting date:", e);
  }

  const images = activity.imageUrls && activity.imageUrls.length > 0 ? activity.imageUrls : [];
  const [currentSlide, setCurrentSlide] = useState(0); 
  
  const handleUpdate = (updatedActivity: Omit<Activity, 'id'> | Activity) => {
    onUpdateActivity(updatedActivity as Activity);
    setIsEditing(false);
    setDetailViewOpen(false);
  }
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteActivity(activity.id)
    setDetailViewOpen(false);
  }
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev + 1));
  };

  const openEditDialog = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsEditing(true);
    setDetailViewOpen(false);
  }
  
  const youtubeUrl = activity.youtubeUrl ?? null;

  return (
    <>
      <Dialog open={isDetailViewOpen} onOpenChange={setDetailViewOpen}>
        <DialogTrigger asChild>
           <div className="cursor-pointer" onClick={() => setDetailViewOpen(true)}>
              <Card className={cn(
                "transition-all hover:shadow-md bg-card/60 border-0 rounded-3xl",
                "hover:bg-card/100 focus:bg-card/100 border-white"
                 
              )}>
                <CardContent className="p-1.5 flex items-center gap-1.5">
                  <div className="pl-1.5">
                    {getIconForActivity(activity)}
                  </div>
                  <div className="flex-grow">
                    <p className={cn(
                      "text-black/80 dark:text-white/80 font-bold font-headline text-sm",
                    )}>
                      {displayTitle}
                      <span className="ml-2 font-normal text-xs">{activity.time}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
        </DialogTrigger>

        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {getIconForActivity(activity)}
              {displayTitle}
            </DialogTitle>
          </DialogHeader>

          {images && images.length > 0 && (
            <div className="relative">
              <img src={images[currentSlide]} alt={`Image ${currentSlide + 1}`} className="w-full rounded-lg object-cover aspect-video" />
              {/* Add onClick handler to the image to go to the next slide */}
              {images.length > 1 && ( // Only add click behavior if there's more than one image
                <div onClick={nextSlide} className="absolute inset-0 cursor-pointer">
                    {/* This div covers the image to make it clickable */}
                </div>
              )}

              {/* Navigation buttons (only show if more than one image) */}
              {images.length > 1 && (
                <>
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevSlide}
                      className="rounded-full bg-black/20 text-white hover:bg-black/50"
                    >
                      &lt;
                    </Button>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextSlide}
                      className="rounded-full bg-black/20 text-white hover:bg-black/50"
                    >
                      &gt;
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {youtubeUrl && (
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={youtubeUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
          )}


          <div className="space-y-4 py-4">            
              <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground"/>
                  <span className="text-foreground">{activity.time}</span>
              </div>
            
              {activity.website && (
                <div className="flex items-start gap-3">
                    <Link className="w-5 h-5 text-muted-foreground mt-1"/>
                    <a 
                      href={activity.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
>
 {activity.websiteText}
                    </a>
                </div>
              )}      

                {activity.address && (
                <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-1"/>
                     <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {activity.address}
                    </a>
                </div>
              )}
              {activity?.code && (
                <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-muted-foreground"/>
                <span className="text-foreground">{activity.code}</span>
            </div>
              )}        
          </div>
        </DialogContent>
      </Dialog>
      
      {!isAdmin && (
         <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogContent className="bg-background">
              <DialogHeader>
                <DialogTitle>{t.editTitle}</DialogTitle>
              </DialogHeader>
              <ItineraryForm 
                activity={activity} 
                onSubmit={handleUpdate}
                onCancel={() => setIsEditing(false)}
                lang={lang}
                t={t}
                isReadOnly={isAdmin}
              />
            </DialogContent>
         </Dialog>
      )}
    </>
  );
}
