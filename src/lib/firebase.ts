import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: "AIzaSyC_LX06amy8uKD2dlMV_lPDNZB5k_e0650",
  authDomain: "pure-drop-firebase.firebaseapp.com",
  projectId: "pure-drop-firebase",
  storageBucket: "pure-drop-firebase.firebasestorage.app",
  messagingSenderId: "865988656753",
  appId: "1:865988656753:web:7ac08085b721249d07a5d0",
  measurementId: "G-28LW2WRWBJ"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Analytics if in browser environment
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
