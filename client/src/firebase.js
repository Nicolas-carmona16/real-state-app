// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-34263.firebaseapp.com",
  projectId: "real-estate-34263",
  storageBucket: "real-estate-34263.appspot.com",
  messagingSenderId: "489918713713",
  appId: "1:489918713713:web:6f469582881aba7cb470d0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);