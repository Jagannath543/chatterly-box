// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRHVGaoVB9aDQX9Vx5wLH-h0DV2eiUFuw",
  authDomain: "react-authentication-5403e.firebaseapp.com",
  projectId: "react-authentication-5403e",
  storageBucket: "react-authentication-5403e.appspot.com",
  messagingSenderId: "863520280528",
  appId: "1:863520280528:web:96df20e4efe6ffad94f3d5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, db };
