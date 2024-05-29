import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsQDTFYgkdUPsT65xjF574Y8a3JWUVni0",
  authDomain: "dv300-term2.firebaseapp.com",
  projectId: "dv300-term2",
  storageBucket: "dv300-term2.appspot.com",
  messagingSenderId: "523570035139",
  appId: "1:523570035139:web:f55cdc8954ad5fac752576"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)