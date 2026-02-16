// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyC-MR3MlLNH6INo8r3mQwjIn_reZfA9Wug',
    authDomain: 'botnoivoice-1ff7a.firebaseapp.com',
    databaseURL:
      'https://botnoivoice-1ff7a-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'botnoivoice-1ff7a',
    storageBucket: 'botnoivoice-1ff7a.appspot.com',
    messagingSenderId: '822010349951',
    appId: '1:822010349951:web:a5f190b6e9cfa7329db24a',
    measurementId: 'G-D7QFJK7Y14',
  }

const app = initializeApp(firebaseConfig);
let auth = getAuth(app);

export {auth};