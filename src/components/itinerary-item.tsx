
"use client";

import React, { useState, useEffect } from "react";
import type { Activity } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Mountain, Utensils, Landmark, MapPin, Edit, Calendar, Clock, Link, Phone } from "lucide-react";
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
  isSpecialDay?: boolean;
  lang: Language;
  t: Translation['form'];
};

const getIconForActivity = (title: string, isSpecialDay: boolean) => {
  const lowerTitle = title.toLowerCase();
  const iconProps = { className: cn("w-5 h-5", isSpecialDay ? "text-white" : "text-foreground"), strokeWidth: 2.5 };
  if (/\b(hike|mountain|park|trail|canyon)\b/.test(lowerTitle)) return <Mountain {...iconProps} />;
  if (/\b(eat|dine|restaurant|lunch|dinner|breakfast|food|cafe)\b/.test(lowerTitle)) return <Utensils {...iconProps} />;
  if (/\b(landmark|monument|museum|site|tour|gallery|home|airbnb)\b/.test(lowerTitle)) return <Landmark {...iconProps} />;
  return <MapPin {...iconProps} />;
};

export default function ItineraryItem({ activity, onUpdateActivity, onDeleteActivity, isReadOnly = false, isSpecialDay = false, lang, t }: ItineraryItemProps) {
  const [isDetailViewOpen, setDetailViewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formattedTime, setFormattedTime] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  
  const locale = lang === 'km' ? km : enUS;
  const displayTitle = lang === 'km' && activity.title_km ? activity.title_km : activity.title;


  useEffect(() => {
    // Safari does not like `new Date('YYYY-MM-DD')`
    const activityDate = new Date(activity.date.replace(/-/g, '/') + `T${activity.time}`);
    if (!isNaN(activityDate.getTime())) {
      setFormattedTime(format(activityDate, "p", { locale }));
      setFormattedDate(format(activityDate, "PPPP", { locale }));
    }
  }, [activity.date, activity.time, locale]);

  const images = activity.imageUrls && activity.imageUrls.length > 0 ? activity.imageUrls : ['https://placehold.co/600x400.png'];
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
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const openEditDialog = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsEditing(true);
    setDetailViewOpen(false);
  }

  return (
    <>
      <Dialog open={isDetailViewOpen} onOpenChange={setDetailViewOpen}>
        <DialogTrigger asChild>
           <div className="cursor-pointer" onClick={() => setDetailViewOpen(true)}>
              <Card className={cn(
                "transition-all hover:shadow-md bg-card/80 border-0",
                "opacity-80 hover:opacity-100 focus:opacity-100",
                isSpecialDay && "bg-black/20 border-white/20"
              )}>
                <CardContent className="p-2 flex items-center gap-2">
                  {getIconForActivity(activity.title, isSpecialDay)}
                  <div className="flex-grow">
                    <p className={cn(
                      "font-bold font-headline text-sm",
                      isSpecialDay ? "text-white" : "text-foreground"
                    )}>
                      {displayTitle}
                    </p>
                    <p className={cn(
                      "text-xs",
                      isSpecialDay ? "text-white/80" : "text-muted-foreground"
                    )}>
                      {formattedTime}
                    </p>
                  </div>
                  {!isReadOnly && (
                    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn("text-muted-foreground hover:text-primary hover:bg-primary/10 h-8 w-8", isSpecialDay && "text-white/70 hover:text-white hover:bg-white/20")}
                        onClick={openEditDialog}
                        aria-label={`Edit ${activity.title}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn("text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8", isSpecialDay && "text-white/70 hover:text-white hover:bg-white/20")}
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
              {getIconForActivity(activity.title, false)}
              {displayTitle}
            </DialogTitle>
          </DialogHeader>

          {images && images.length > 0 && (
            <div className="relative">
              <img src={images[currentSlide]} alt={`Image ${currentSlide + 1}`} className="w-full h-auto rounded-md object-cover aspect-video" />
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

          <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground"/>
                  <span className="text-foreground">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground"/>
                  <span className="text-foreground">{formattedTime}</span>
              </div>
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
              {activity.website && (
                <div className="flex items-start gap-3">
                    <Link className="w-5 h-5 text-muted-foreground mt-1"/>
                    <a 
                      href={activity.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {activity.website}
                    </a>
                </div>
              )}
              {activity.phoneNumber && (
                <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground mt-1"/>
                    <a 
                      href={`tel:${activity.phoneNumber}`}
                      className="text-primary hover:underline"
                    >
                      {activity.phoneNumber}
                    </a>
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
