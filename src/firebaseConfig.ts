// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from "@firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDr9JPpD7HhCx9pDJ_tMnWGVwYekCk_w9g",
    authDomain: "samplefirebasetsx.firebaseapp.com",
    projectId: "samplefirebasetsx",
    storageBucket: "samplefirebasetsx.appspot.com",
    messagingSenderId: "195184982914",
    appId: "1:195184982914:web:0e7b765ea36d146b942d9b"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db =getFirestore(app);