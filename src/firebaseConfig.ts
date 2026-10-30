import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import configData from '../firebase-applet-config.json';

const activeConfig = configData || {
  apiKey: "AIzaSyDemo-GearLoop-DGU-Key12345678",
  authDomain: "gearloop-dgu.firebaseapp.com",
  projectId: "gearloop-dgu-prod",
  storageBucket: "gearloop-dgu.appspot.com",
  messagingSenderId: "492956416957",
  appId: "1:492956416957:web:9c84e92a83"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let isConfigured = true;

try {
  if (!getApps().length) {
    app = initializeApp(activeConfig);
  } else {
    app = getApp();
  }

  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization notice:', error);
  if (!getApps().length) {
    app = initializeApp(activeConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
  isConfigured = false;
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  hd: 'dgu.ac.in' // DBS Global University domain hint
});

export { app, auth, db, isConfigured };
export default app;
