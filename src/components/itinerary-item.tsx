
"use client";

import React, { useState, useEffect } from "react";
import type { Activity } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Mountain, Utensils, Landmark, MapPin, Edit, Calendar, Clock, Link } from "lucide-react";
import { format } from "date-fns";
import ItineraryForm from "./itinerary-form";
import Image from "next/image";

type ItineraryItemProps = {
  activity: Activity;
  onUpdateActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
  isReadOnly?: boolean;
};

const getIconForActivity = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (/\b(hike|mountain|park|trail|canyon)\b/.test(lowerTitle)) return <Mountain className="w-5 h-5 text-primary" />;
  if (/\b(eat|dine|restaurant|lunch|dinner|breakfast|food|cafe)\b/.test(lowerTitle)) return <Utensils className="w-5 h-5 text-primary" />;
  if (/\b(landmark|monument|museum|site|tour|gallery|home|airbnb)\b/.test(lowerTitle)) return <Landmark className="w-5 h-5 text-primary" />;
  return <MapPin className="w-5 h-5 text-primary" />;
};

export default function ItineraryItem({ activity, onUpdateActivity, onDeleteActivity, isReadOnly = false }: ItineraryItemProps) {
  const [isDetailViewOpen, setDetailViewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formattedTime, setFormattedTime] = useState("");
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    // Correctly parsing date parts to avoid timezone issues.
    const [year, month, day] = activity.date.split('-').map(Number);
    const [hours, minutes] = activity.time.split(':').map(Number);
    const date = new Date(year, month - 1, day, hours, minutes);
    
    setFormattedTime(format(date, "h:mm a"));
    setFormattedDate(format(date, "EEEE, MMMM d, yyyy"));
  }, [activity.date, activity.time]);


  const handleUpdate = (updatedActivity: Omit<Activity, 'id'> | Activity) => {
    onUpdateActivity(updatedActivity as Activity);
    setIsEditing(false);
  }

  const openEditDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDetailViewOpen(false); // Close detail view if open
    setIsEditing(true);
  }

  return (
    <>
      <Dialog open={isDetailViewOpen} onOpenChange={setDetailViewOpen}>
        <DialogTrigger asChild>
          <button className="w-full text-left">
            <Card className="transition-all hover:shadow-md bg-card/80 cursor-pointer">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {getIconForActivity(activity.title)}
                </div>
                <div className="flex-grow">
                  <p className="font-bold font-headline text-sm">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formattedTime}
                  </p>
                </div>
                {!isReadOnly && (
                    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                        <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10 h-8 w-8"
                        onClick={openEditDialog}
                        aria-label={`Edit ${activity.title}`}
                        >
                        <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                        onClick={() => onDeleteActivity(activity.id)}
                        aria-label={`Delete ${activity.title}`}
                        >
                        <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                )}
              </CardContent>
            </Card>
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {getIconForActivity(activity.title)}
              {activity.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground"/>
                  <span className="text-foreground">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground"/>
                  <span className="text-foreground">{formattedTime}</span>
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
                      {activity.website}
                    </a>
                </div>
              )}
          </div>
          {!isReadOnly && (
              <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={(e) => { setDetailViewOpen(false); openEditDialog(e); }}>Edit</Button>
                  <Button variant="destructive" onClick={() => { setDetailViewOpen(false); onDeleteActivity(activity.id); }}>Delete</Button>
              </div>
          )}
        </DialogContent>
      </Dialog>
      
      {!isReadOnly && (
         <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Activity</DialogTitle>
              </DialogHeader>
              <ItineraryForm 
                activity={activity} 
                onSubmit={handleUpdate} 
                submitButtonText="Save Changes"
                onCancel={() => setIsEditing(false)}
              />
            </DialogContent>
         </Dialog>
      )}
    </>
  );
}
