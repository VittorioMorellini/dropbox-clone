// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7VGJTHzUM06AeEzkmjeID8Olg2oWcq4A",
  authDomain: "dropbox-clone-a84cc.firebaseapp.com",
  projectId: "dropbox-clone-a84cc",
  storageBucket: "dropbox-clone-a84cc.appspot.com",
  messagingSenderId: "423398756708",
  appId: "1:423398756708:web:296d9f2b603c7d488c2a71",
  measurementId: "G-BZ63712EJ8"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { db, storage}