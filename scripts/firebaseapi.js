//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyBU9_2o-OwAzNoKvtttbuJjSqvix5A9YMs",
    authDomain: "team08project.firebaseapp.com",
    projectId: "team08project",
    storageBucket: "team08project.appspot.com",
    messagingSenderId: "454792851968",
    appId: "1:454792851968:web:cf01c34f205dc04c729ee5",
    measurementId: "G-W8TKKEZXT4"
  };

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
