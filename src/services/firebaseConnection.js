import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBu2C_XMz4x97AiVrvLuaxx3wYZOsplCOU",
    authDomain: "talkbot-9e959.firebaseapp.com",
    projectId: "talkbot-9e959",
    storageBucket: "talkbot-9e959.appspot.com",
    messagingSenderId: "104827553967",
    appId: "1:104827553967:web:d4f5e1daacfca9ab56ec5a",
    measurementId: "G-XZNVWYN6TJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;