import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-firestore'
import 'firebase/firebase-database'

const config = {
  apiKey: "AIzaSyAXkMe2Ht0pKBMH6N_Hmcrx-Wh7O3PU5-g",
  authDomain: "todo-list-6884e.firebaseapp.com",
  projectId: "todo-list-6884e",
  storageBucket: "todo-list-6884e.appspot.com",
  messagingSenderId: "269698087594",
  appId: "1:269698087594:web:800a0b25b95c166efc6ed3",
  measurementId: "G-ENDDKG3F4T"
}

const firebaseApp = firebase.initializeApp(config);

export default firebaseApp;
