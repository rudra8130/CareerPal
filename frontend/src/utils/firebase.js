
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "fresherai-e211b.firebaseapp.com",
  projectId: "fresherai-e211b",
  storageBucket: "fresherai-e211b.firebasestorage.app",
  messagingSenderId: "501192942383",
  appId: "1:501192942383:web:3362a76e6d5a2f22c477da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth , provider}