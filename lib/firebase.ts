// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if config is provided and app doesn't exist
// We provide a fallback dummy config for Next.js build phase if env vars aren't present yet
const isConfigured = !!firebaseConfig.apiKey;

const app = !getApps().length
    ? initializeApp(isConfigured ? firebaseConfig : { apiKey: 'dummy-key', authDomain: 'dummy.firebaseapp.com', projectId: 'dummy-project' })
    : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, isConfigured };
