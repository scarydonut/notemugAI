import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAUljKalDDpKInMJEdHTBdBlnGB7RWjrUI",
  authDomain: "notegenius-6ae10.firebaseapp.com",
  projectId: "notegenius-6ae10",
  storageBucket: "notegenius-6ae10.firebasestorage.app",
  messagingSenderId: "237651995195",
  appId: "1:237651995195:web:4288bb14bc70c30148ca1e",
  measurementId: "G-6V4KPS97J7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
