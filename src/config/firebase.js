// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCithKgs85DvqjJ8nzj7Wv3WYfHiTALxz0",
  authDomain: "wecare-cosmic.firebaseapp.com",
  projectId: "wecare-cosmic",
  storageBucket: "wecare-cosmic.firebasestorage.app",
  messagingSenderId: "314582419105",
  appId: "1:314582419105:web:826bef31624c64800d52e0",
  measurementId: "G-LS09XKEDB2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
export default app;