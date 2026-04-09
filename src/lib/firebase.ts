import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrhAFeUf32DDW9PcuBeP4PrnWOcl9x964",
  authDomain: "tecnoartificial-leads-1234.firebaseapp.com",
  projectId: "tecnoartificial-leads-1234",
  storageBucket: "tecnoartificial-leads-1234.firebasestorage.app",
  messagingSenderId: "837391600005",
  appId: "1:837391600005:web:31a2eca90a6a4f23795cec"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
