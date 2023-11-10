import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBVHlEfgtaTKp-N5tCofTGBVOMnrw5HUV8",
  authDomain: "app-teste-3cd23.firebaseapp.com",
  projectId: "app-teste-3cd23",
  storageBucket: "app-teste-3cd23.appspot.com",
  messagingSenderId: "638034914734",
  appId: "1:638034914734:web:ae7b8e3a1b2d242544ac3f"
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);