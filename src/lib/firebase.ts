import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "gen-lang-client-0545920377",
  appId: "1:608389293870:web:9b2d6ecc78f643c1d3bcbf",
  apiKey: "AIzaSyA57DZOvxurZ2obs-TmODJNOTLDt_DCY3w",
  authDomain: "gen-lang-client-0545920377.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-ff24a4e8-3478-4b54-b850-78cf9ae1a730",
  storageBucket: "gen-lang-client-0545920377.firebasestorage.app",
  messagingSenderId: "608389293870",
  measurementId: "",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
