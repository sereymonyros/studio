
"use client";

import { db } from "@/lib/firebase";
import type { Activity } from "@/lib/types";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

const ACTIVITIES_COLLECTION = "activities";

export async function getActivities(): Promise<Activity[]> {
  // Using mock data for demonstration purposes as requested.
  // The Firestore fetching logic is commented out below and can be restored later.
  const mockActivities: Activity[] = [
    {
      id: 'mock-1',
      title: 'Hike Camelback Mountain',
      title_km: 'ឡើងភ្នំខេមែលបេក',
      date: '2024-08-15',
      time: '08:00',
      address: 'Echo Canyon Trailhead, Phoenix, AZ',
      website: 'https://www.phoenix.gov/parks/trails/locations/camelback-mountain',
      phoneNumber: '602-262-7275'
    },
    {
      id: 'mock-2',
      title: 'Lunch at Matt\'s Big Breakfast',
      title_km: 'អាហារថ្ងៃត្រង់នៅ Matt\'s Big Breakfast',
      date: '2024-08-15',
      time: '12:30',
      address: '825 N 1st St, Phoenix, AZ 85004',
      website: 'https://www.mattsbigbreakfast.com/',
      phoneNumber: '602-254-1074'
    },
    {
      id: 'mock-3',
      title: 'Visit the Desert Botanical Garden',
      title_km: 'ទស្សនាសួនរុក្ខសាស្ត្រវាលខ្សាច់',
      date: '2024-08-16',
      time: '10:00',
      address: '1201 N Galvin Pkwy, Phoenix, AZ 85008',
      website: 'https://dbg.org/',
      phoneNumber: '480-941-1225'
    },
    {
      id: 'mock-4',
      title: 'Grand Canyon South Rim Tour',
      title_km: 'ដំណើរកម្សាន្ត Grand Canyon South Rim',
      date: '2024-08-17',
      time: '09:00',
      address: 'Grand Canyon Village, AZ 86023',
    },
    {
      id: 'mock-5',
      title: 'Dinner at El Tovar Dining Room',
      title_km: 'អាហារពេលល្ងាចនៅបន្ទប់ទទួលទានអាហារ El Tovar',
      date: '2024-08-17',
      time: '19:00',
      address: 'Grand Canyon Village, AZ 86023',
      website: 'https://www.grandcanyonlodges.com/dining/el-tovar-dining-room/',
    }
  ];
  
  const q = query(collection(db, ACTIVITIES_COLLECTION), orderBy("date"), orderBy("time"));
  const querySnapshot = await getDocs(q);
  const activities: Activity[] = [];
  querySnapshot.forEach((doc) => {
    activities.push({ id: doc.id, ...doc.data() } as Activity);
  });

  // Combine mock data with firestore data for demonstration
  const allActivities = [...mockActivities, ...activities.filter(a => !mockActivities.find(m => m.id === a.id))];

  return allActivities.sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return a.time.localeCompare(b.time);
  });
}

export async function addActivity(activity: Omit<Activity, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, ACTIVITIES_COLLECTION), activity);
  return docRef.id;
}

export async function updateActivity(activity: Activity): Promise<void> {
  const { id, ...activityData } = activity;
  if (id.startsWith('mock-')) {
    console.log("Mock data update - this would write to a DB in a real app:", activity);
    return;
  }
  const activityRef = doc(db, ACTIVITIES_COLLECTION, id);
  await updateDoc(activityRef, activityData);
}

export async function deleteActivity(id: string): Promise<void> {
   if (id.startsWith('mock-')) {
    console.log("Mock data delete - this would write to a DB in a real app:", id);
    return;
  }
  const activityRef = doc(db, ACTIVITIES_COLLECTION, id);
  await deleteDoc(activityRef);
}
