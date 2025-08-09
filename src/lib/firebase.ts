// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6B5Y5GzSCxppxvSSXaQyewQSkO6IZI70",
  authDomain: "astral-web-460708-r4.firebaseapp.com",
  projectId: "astral-web-460708-r4",
  storageBucket: "astral-web-460708-r4.firebasestorage.app",
  messagingSenderId: "897609218391",
  appId: "1:897609218391:web:027300ab8b1f1276a1a612",
  measurementId: "G-E5R0KDGE93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);