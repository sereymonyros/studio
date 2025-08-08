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
  const q = query(collection(db, ACTIVITIES_COLLECTION), orderBy("date"), orderBy("time"));
  const querySnapshot = await getDocs(q);
  const activities: Activity[] = [];
  querySnapshot.forEach((doc) => {
    activities.push({ id: doc.id, ...doc.data() } as Activity);
  });
  return activities;
}

export async function addActivity(activity: Omit<Activity, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, ACTIVITIES_COLLECTION), activity);
  return docRef.id;
}

export async function updateActivity(activity: Activity): Promise<void> {
  const { id, ...activityData } = activity;
  const activityRef = doc(db, ACTIVITIES_COLLECTION, id);
  await updateDoc(activityRef, activityData);
}

export async function deleteActivity(id: string): Promise<void> {
  const activityRef = doc(db, ACTIVITIES_COLLECTION, id);
  await deleteDoc(activityRef);
}
