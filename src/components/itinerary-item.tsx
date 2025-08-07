
"use client";

import React, { useState } from "react";
import type { Activity } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Mountain, Utensils, Landmark, MapPin, Edit, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import ItineraryForm from "./itinerary-form";

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
  if (/\b(landmark|monument|museum|site|tour|gallery)\b/.test(lowerTitle)) return <Landmark className="w-5 h-5 text-primary" />;
  return <MapPin className="w-5 h-5 text-primary" />;
};

export default function ItineraryItem({ activity, onUpdateActivity, onDeleteActivity, isReadOnly = false }: ItineraryItemProps) {
  const [isDetailViewOpen, setDetailViewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [year, month, day] = activity.date.split('-').map(Number);
  const [hours, minutes] = activity.time.split(':').map(Number);
  const activityDate = new Date(year, month - 1, day, hours, minutes);

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
          <Card className="transition-all hover:shadow-md bg-card/80 cursor-pointer">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {getIconForActivity(activity.title)}
              </div>
              <div className="flex-grow">
                <p className="font-bold font-headline text-sm">{activity.title}</p>
                <p className="text-xs text-muted-foreground">
                  {format(activityDate, "h:mm a")}
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
                  <span className="text-foreground">{format(activityDate, "EEEE, MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground"/>
                  <span className="text-foreground">{format(activityDate, "h:mm a")}</span>
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
