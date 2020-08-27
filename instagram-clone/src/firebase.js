import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyArI7bRmCajQJ3BzOt___s4EurbiUzbF78",
    authDomain: "instagram-clone-15227.firebaseapp.com",
    databaseURL: "https://instagram-clone-15227.firebaseio.com",
    projectId: "instagram-clone-15227",
    storageBucket: "instagram-clone-15227.appspot.com",
    messagingSenderId: "28978170584",
    appId: "1:28978170584:web:a83b28c9d13ca3ede4a5ad",
    measurementId: "G-F3F22QTN2Q"
  };
  
const firebaseApp =firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db , auth , storage };