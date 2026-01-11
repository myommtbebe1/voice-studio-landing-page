import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import AppWrapper from "./router";
import AuthContextProvider from "./contexts/AuthContext.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <AppWrapper />
  </AuthContextProvider>
);
