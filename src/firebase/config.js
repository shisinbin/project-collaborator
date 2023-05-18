import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDG-z_uOUlR1JhKhTA_rvQLPEYuBidjb4Q',
  authDomain: 'thedojosite-a2479.firebaseapp.com',
  projectId: 'thedojosite-a2479',
  storageBucket: 'thedojosite-a2479.appspot.com',
  messagingSenderId: '966961270190',
  appId: '1:966961270190:web:40bc161a7a4972c06f4c3f',
};

// init firebase
firebase.initializeApp(firebaseConfig);

// init services
const projectFirestore = firebase.firestore(); // the firestore db
const projectAuth = firebase.auth(); // the authentication
const projectStorage = firebase.storage(); // the storage

// timestamp - this returns a function,
// when invoked, i.e. timestamp(), it will create a Firebase timestamp data property
const timestamp = firebase.firestore.Timestamp;

export { projectFirestore, projectAuth, projectStorage, timestamp };
