
"use client";

import React, { useState, useEffect } from "react";
import type { Activity } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Mountain, Utensils, Landmark, MapPin, Edit, Calendar, Clock, Link, Key } from "lucide-react";
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
  lang: Language;
  t: Translation['form'];
};

const getIconForActivity = (title: string) => {
  const lowerTitle = title.toLowerCase();
  const iconProps = { className: cn("w-6 h-6 text-black dark:text-white"), strokeWidth: 2.5 };
  if (/\b(hike|mountain|park|trail|canyon)\b/.test(lowerTitle)) return <Mountain {...iconProps} />;
  if (/\b(eat|dine|restaurant|lunch|dinner|breakfast|food|cafe)\b/.test(lowerTitle)) return <Utensils {...iconProps} />;
  if (/\b(landmark|monument|museum|site|tour|gallery|home|airbnb)\b/.test(lowerTitle)) return <Landmark {...iconProps} />;
  return <MapPin {...iconProps} />;
};

export default function ItineraryItem({ activity, onUpdateActivity, onDeleteActivity, isReadOnly = false, lang, t }: ItineraryItemProps) {
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
                "transition-all hover:shadow-md bg-card/80 border-0 rounded-3xl",
                "opacity-80 hover:opacity-100 focus:opacity-100 border-white"
                 
              )}>
                <CardContent className="p-2 flex items-center gap-2">
                  {getIconForActivity(activity.title)}
                  <div className="flex-grow">
                    <p className={cn(
                      "text-black dark:text-white font-bold font-headline text-sm",
                    )}>
                      {displayTitle}
                    </p>
                    <p className={cn(
                      "text-black dark:text-white text-xs font-bold"
                    )}>
                      {activity.time}
                    </p>
                  </div>
                  {!isReadOnly && (
                    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={openEditDialog}
                        aria-label={`Edit ${activity.title}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDelete}
                        aria-label={`Delete ${activity.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {getIconForActivity(activity.title)}
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
          <div className="flex justify-end gap-2 pt-4">
              {!isReadOnly && (
                  <>
                      <Button variant="outline" onClick={(e) => { e.stopPropagation(); setDetailViewOpen(false); setIsEditing(true);}}>{t.buttons.edit}</Button>
                      <Button variant="destructive" onClick={handleDelete}>{t.buttons.delete}</Button>
                  </>
              )}
          </div>
        </DialogContent>
      </Dialog>
      
      {!isReadOnly && (
         <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.editTitle}</DialogTitle>
              </DialogHeader>
              <ItineraryForm 
                activity={activity} 
                onSubmit={handleUpdate}
                onCancel={() => setIsEditing(false)}
                lang={lang}
                t={t}
              />
            </DialogContent>
         </Dialog>
      )}
    </>
  );
}
