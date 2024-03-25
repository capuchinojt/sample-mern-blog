// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "capuchinojt-mern-blog.firebaseapp.com",
  projectId: "capuchinojt-mern-blog",
  storageBucket: "capuchinojt-mern-blog.appspot.com",
  messagingSenderId: "584285606167",
  appId: "1:584285606167:web:01b1a7f561803a1df96752",
  measurementId: "G-CWDKQ2LS74"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
