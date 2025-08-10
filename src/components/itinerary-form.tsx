
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { enUS, km } from 'date-fns/locale';
import { Calendar as CalendarIcon, PlusCircle, Phone } from "lucide-react";
import type { Activity } from "@/lib/types";
import type { Language, Translation } from "@/lib/translations";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters.").max(100),
  date: z.date({ required_error: "A date is required." }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)."),
  website: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  websiteText: z.string().min(2, "Title must be at least 2 characters.").max(100).optional(),
  address: z.string().optional(),
  imageUrls: z.string().optional(),
  youtubeUrl: z.string().url("Please enter a valid YouTube URL.").optional().or(z.literal('')),
  phoneNumber: z.string().optional(),
  code: z.string().optional(),
});

type ItineraryFormProps = {
  activity?: Omit<Activity, 'id'> & { id?: string };
  onSubmit: (activity: Omit<Activity, 'id'> | Activity) => void;
  onCancel?: () => void;
  lang: Language;
  t: Translation['form'];
};

export default function ItineraryForm({ activity, onSubmit, onCancel, lang, t }: ItineraryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: activity?.title || "",
      date: activity?.date ? new Date(activity.date.replace(/-/g, '/')) : new Date(),
      time: activity?.time || "12:00",
      website: activity?.website || "",
      websiteText: activity?.websiteText || "",
      address: activity?.address || "",
      phoneNumber: activity?.phoneNumber || "",
      imageUrls: activity?.imageUrls?.join('\n') || '',
      youtubeUrl: activity?.youtubeUrl || '',
      code: activity?.code || "",
    },
  });
  
  const locale = lang === 'km' ? km : enUS;
  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    const activityData = {
      title: values.title,
      date: format(values.date, "yyyy-MM-dd"),
      phoneNumber: values.phoneNumber,
      time: values.time,
      website: values.website,
      websiteText: values.websiteText,
      address: values.address || null, // Use null for empty optional fields
      imageUrls: values.imageUrls ? values.imageUrls.split('\n').map(url => url.trim()).filter(url => url !== '') : [],
      youtubeUrl: values.youtubeUrl || null, // Include youtubeUrl from values, use null if empty
      code: values.code,
    } as Omit<Activity, 'id'>; // Cast to Omit<Activity, 'id'>

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
              <FormLabel>{t.fields.title.label}</FormLabel>
              <FormControl>
                <Input placeholder={t.fields.title.placeholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="websiteText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.fields.websiteText.label}</FormLabel>
              <FormControl>
                <Input placeholder={t.fields.websiteText.placeholder} {...field} />
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
              <FormLabel>{t.fields.website.label}</FormLabel>
              <FormControl>
                <Input placeholder={t.fields.website.placeholder} {...field} />
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
              <FormLabel>{t.fields.address.label}</FormLabel>
              <FormControl>
                <Input placeholder={t.fields.address.placeholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />    
        <FormField
          control={form.control}
          name="youtubeUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube URL</FormLabel>
              <FormControl>
                <Input placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ" {...field} />
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
                <FormLabel>{t.fields.date.label}</FormLabel>
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
                        {field.value ? format(field.value, "PPP", { locale }) : <span>{t.fields.date.placeholder}</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      locale={locale}
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
                <FormLabel>{t.fields.time.label}</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="imageUrls"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.fields.imageUrls.label}</FormLabel>
              <FormControl>
                <Textarea placeholder={t.fields.imageUrls.placeholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />   
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.fields.code.label}</FormLabel>
              <FormControl>
                <Input placeholder={t.fields.code.placeholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
            {onCancel && <Button type="button" variant="outline" className="w-full" onClick={onCancel}>{t.buttons.cancel}</Button>}
            <Button type="submit" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              {activity?.id ? t.buttons.save : t.buttons.add}
            </Button>
        </div>
      </form>
    </Form>
  );
}
