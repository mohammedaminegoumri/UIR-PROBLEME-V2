// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // ← Remplace tout ça par ton vrai config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCg8HZ5euaV3flXz92GBuENpl6V7JWCAC4",
  authDomain: "uir-probleme-v2.firebaseapp.com",
  projectId: "uir-probleme-v2",
  storageBucket: "uir-probleme-v2.firebasestorage.app",
  messagingSenderId: "866075824594",
  appId: "1:866075824594:web:ff7c0076902ba65c4ff80b"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
