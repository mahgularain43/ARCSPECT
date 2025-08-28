// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCiMjksSF_JY_YqFADiu3g6t8FZfkgJzXA",
  authDomain: "arcspec-t.firebaseapp.com",
  projectId: "arcspec-t",
  // add other config keys as provided by Firebase console
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
