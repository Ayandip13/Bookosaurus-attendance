// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // <-- IMPORTANT

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBH8huvOmBKyP_7uQK9Vzto_UvsQrD34mE",
  authDomain: "attendancetrack-b12cc.firebaseapp.com",
  projectId: "attendancetrack-b12cc",
  storageBucket: "attendancetrack-b12cc.firebasestorage.app",
  messagingSenderId: "464880667794",
  appId: "1:464880667794:web:955a626e8345e40993ea4b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it
export const db = getFirestore(app); // <-- THIS FIXES YOUR ERROR
