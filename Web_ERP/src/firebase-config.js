import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD2KJqHyT84ErCFpWKUSLEFXdvnQ1s9SfQ",
    authDomain: "maa-motors-erp.firebaseapp.com",
    projectId: "maa-motors-erp",
    storageBucket: "maa-motors-erp.firebasestorage.app",
    messagingSenderId: "96761506330",
    appId: "1:96761506330:web:3f21d94d95d3135af27fa3",
    measurementId: "G-NHHVNH1B6W"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();
export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

// Enable Persistence with Multi-Tab Synchronization
db.enablePersistence({ synchronizeTabs: true }).catch(err => {
    if (err.code === 'failed-precondition') console.warn("Multiple tabs open, persistence fallback enabled.");
    else if (err.code === 'unimplemented') console.warn("Browser doesn't support persistence.");
});

// Set Auth Persistence to LOCAL for Offline Session Handling
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(err => console.warn("Auth persistence error:", err));

export { firebase, firebaseConfig };
