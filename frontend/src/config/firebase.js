import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBd-fIY-7eUE_cbBqOnLBmqLMt1CJlWg8E",
  authDomain: "chat-app-5acdc.firebaseapp.com",
  projectId: "chat-app-5acdc",
  storageBucket: "chat-app-5acdc.firebasestorage.app",
  messagingSenderId: "885078591105",
  appId: "1:885078591105:web:156345f3d58e7d01b4af80"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);