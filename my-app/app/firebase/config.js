import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDSWu4zegPFjxsrKlg2u4z82L5euY4nkvU",
  authDomain: "audiscribe-942e8.firebaseapp.com",
  projectId: "audiscribe-942e8",
  storageBucket: "audiscribe-942e8.appspot.com",
  messagingSenderId: "835457978305",
  appId: "1:835457978305:web:eadf383478b1a81606e940",
  measurementId: "G-VXGSDLQJP6",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp;
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
export { auth, app, storage, db };
