<<<<<<< HEAD

import './index.css'
import App from './App.jsx'
import ReactDOM from 'react-dom/client'
import React from 'react'

ReactDOM.createRoot(document.getElementById('root')).render(

    <App />
 
)
=======
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import AppWrapper from "./router";
import AuthContextProvider from "./contexts/AuthContext.jsx";
import LanguageContextProvider from "./contexts/LanguageContext.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <LanguageContextProvider>
    <AuthContextProvider>
      <AppWrapper />
    </AuthContextProvider>
  </LanguageContextProvider>
);
>>>>>>> 61.CompleteStripe
