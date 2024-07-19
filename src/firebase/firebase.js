import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
import {getAuth} from 'firebase/auth';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtXqjTi1oh8yoN9uS5oR6Zjs7DQdyUNHw",
  authDomain: "smart-gate-63101.firebaseapp.com",
  projectId: "smart-gate-63101",
  storageBucket: "smart-gate-63101.appspot.com",
  messagingSenderId: "23675971726",
  appId: "1:23675971726:web:6e7a658cd5757b6af7c1df",
  measurementId: "G-WZV1CVTMWL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app);


export { app, auth,db };
