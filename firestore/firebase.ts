// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: "tracktivity-ed944.appspot.com",
  messagingSenderId: "585185398205",
  appId: "1:585185398205:web:706beaa231eea24b4096d4",
  measurementId: "G-LPRXMF1EPV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
export const db = getFirestore(app);
// const auth = getAuth(app);

console.log('process.env.FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
export { app, firestore, storage };

console.log('process.env.FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY);