import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from
"https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firestore
const db = getFirestore(app);


// Save SOS alert
export async function saveSOSAlert(latitude, longitude, accuracy) {

    const alertData = {
        type: "SOS",
        status: "ACTIVE",

        location: {
            latitude: latitude,
            longitude: longitude,
            accuracy: accuracy
        },

        message: "Emergency SOS activated",

        createdAt: serverTimestamp()
    };

    const docRef = await addDoc(
        collection(db, "emergencyAlerts"),
        alertData
    );

    return docRef.id;
}
