// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC20SscgbsgjJucbgwEbt-8EHgKl35lSDQ",
  authDomain: "react-path-finding.firebaseapp.com",
  projectId: "react-path-finding",
  storageBucket: "react-path-finding.appspot.com",
  messagingSenderId: "773954020665",
  appId: "1:773954020665:web:983d69aa31dc2d754674e8",
  measurementId: "G-71T5KHD8NK",
  databaseURL: "https://react-path-finding-default-rtdb.firebaseio.com/"  // Add the database URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database };
