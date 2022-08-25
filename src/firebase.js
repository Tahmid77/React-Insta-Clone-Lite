import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'

firebase.initializeApp({
    apiKey: "AIzaSyA5vPG2YYh9wyWTIvERwQioKw-t_S5Tduo",
    authDomain: "instagram-clone-react-50b8f.firebaseapp.com",
    projectId: "instagram-clone-react-50b8f",
    storageBucket: "instagram-clone-react-50b8f.appspot.com",
    messagingSenderId: "366533166250",
    appId: "1:366533166250:web:2a1e52143b15f6fda97cd3",
    measurementId: "G-1HSTXT3TMG"
  });

  const db = firebase.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db,auth,storage,firebase};