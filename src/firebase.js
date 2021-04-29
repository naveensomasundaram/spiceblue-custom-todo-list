import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDVXdGgAxjzdi7PQXrEoBaJDyGWxf1KwiU",
  authDomain: "clones-8cfe7.firebaseapp.com",
  projectId: "clones-8cfe7",
  storageBucket: "clones-8cfe7.appspot.com",
  messagingSenderId: "999705845735",
  appId: "1:999705845735:web:5ea850d64a468396fbe742",
  measurementId: "G-TQKDGTLNHS",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };
