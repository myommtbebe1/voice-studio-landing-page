import { Navigate, createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import {AuthContext} from "../contexts/AuthContext.jsx"

import React, { useContext } from "react";
import App from "../App.jsx";
import Register from "../main/Register.jsx";
import LoginForm from "../main/LoginForm.jsx";
import Home from "../main/home.jsx";
import VoiceStudio from "../main/voicestudiopage/voicestudio.jsx";
import VoiceOver from "../main/voiceoverpage/VoiceOver.jsx";
import PricingPage from "../main/Pricingpage/PricingPage.jsx";
import PaymentPage from "../main/PaymentPage.jsx";
import ReportPage from "../main/ReportPage.jsx";

export default function AppWrapper()  {
    let  {authReady,user} = useContext(AuthContext);
    const  isAuthenticated =Boolean(user);

    const router = createBrowserRouter([
        {
          path: "/",
          element: <App/>,
          children:[
            {
              path: "",
              element:  <Home/> 
            },
            {
              path:"/register",
              element:<Register/>,
            },
            {
              path:"/login",
              element:<LoginForm/>,
            },
            {
                path:"/VoiceStudio",
                element: isAuthenticated ? <VoiceStudio/> : <Navigate to="/"/>,
            },
            {
              path:"/VoiceOver",
              element: isAuthenticated ? <VoiceOver/> : <Navigate to="/"/>,
            },
            {
              path:"/Pricing",
              element: isAuthenticated ? <PricingPage/> : <Navigate to="/"/>,
            },
         
            {
              path:"/Report",
              element: isAuthenticated ? <ReportPage/> : <Navigate to="/"/>,
            }
           
          ]
          
        },
        
        
      ]);
      
   
    return (
        authReady ? <RouterProvider router={router}/> : null
    )
  };
  


