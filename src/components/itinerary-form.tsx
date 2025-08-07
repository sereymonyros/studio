
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, PlusCircle } from "lucide-react";
import type { Activity } from "@/lib/types";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters.").max(100),
  date: z.date({ required_error: "A date is required." }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)."),
  website: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  address: z.string().optional(),
});

type ItineraryFormProps = {
  activity?: Omit<Activity, 'id'> & { id?: string };
  onSubmit: (activity: Omit<Activity, 'id'> | Activity) => void;
  submitButtonText?: string;
  onCancel?: () => void;
};

export default function ItineraryForm({ activity, onSubmit, submitButtonText = "Add to Itinerary", onCancel }: ItineraryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: activity?.title || "",
      date: activity?.date ? new Date(activity.date.replace(/-/g, '/')) : new Date(),
      time: activity?.time || "12:00",
      website: activity?.website || "",
      address: activity?.address || "",
    },
  });

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    const activityData = {
      title: values.title,
      date: format(values.date, "yyyy-MM-dd"),
      time: values.time,
      website: values.website,
      address: values.address,
    };
    
    if (activity?.id) {
      onSubmit({ ...activityData, id: activity.id });
    } else {
      onSubmit(activityData);
    }
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity / Landmark</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Hike Camelback Mountain" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 123 Main St, Sedona, AZ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="e.g., https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2">
            {onCancel && <Button type="button" variant="outline" className="w-full" onClick={onCancel}>Cancel</Button>}
            <Button type="submit" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              {submitButtonText}
            </Button>
        </div>
      </form>
    </Form>
  );
}
