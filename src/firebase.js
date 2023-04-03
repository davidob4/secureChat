import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBleb1OCC5nT1VKyO-LIEtcB__gb1OFIto",
  authDomain: "chat-35561.firebaseapp.com",
  projectId: "chat-35561",
  storageBucket: "chat-35561.appspot.com",
  messagingSenderId: "977958279240",
  appId: "1:977958279240:web:4aee1526066a5809f5e07d"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);