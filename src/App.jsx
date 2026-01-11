import { Outlet } from "react-router-dom";
import "./App.css";

import Navbar from "./main/navbar"


function App() {
 

  return (
    
     
      <div className="text-[#0d0d1b] dark:text-white font-display overflow-x-hidden min-h-screen" style={{ background: "linear-gradient(to bottom, #B7CBF3, #EBE9FF)" }} >
        {/* Navigation */}
        <Navbar/>

        {/* Main Content */}
        <Outlet/>
        
        {/* Nested routes like /login will render here */}
        
      </div>
   
    
  );
}

export default App;
