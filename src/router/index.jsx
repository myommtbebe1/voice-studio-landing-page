import { Navigate, createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import {AuthContext} from "../contexts/AuthContext.jsx"

import React, { useContext } from "react";
import App from "../App.jsx";
import Register from "../main/Register.jsx";
import LoginForm from "../main/LoginForm.jsx";
import Home from "../main/home.jsx"
import VoiceStudio from "../main/voicestudiopage/voicestudio.jsx"


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
                element: isAuthenticated ? <VoiceStudio/> : <Navigate to="/login"/>,
            }
          ]
          
        },
        
        
      ]);
      
   
    return (
        authReady ? <RouterProvider router={router}/> : null
    )
  };
  


