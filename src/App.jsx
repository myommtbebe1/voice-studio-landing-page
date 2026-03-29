
import { Outlet } from "react-router-dom";
import "./App.css";

import Navbar from "./main/navbar"
import ScrollToTopButton from "./components/ScrollToTopButton";


function App() {
 

  return (
    
     
      <div className="text-[#0d0d1b] dark:text-white font-display overflow-x-hidden min-h-screen"  >
        {/* Navigation */}
        <Navbar/>

        {/* Main Content — pt offsets fixed navbar height */}
        <main className="pt-[72px]">
          <Outlet/>
          <ScrollToTopButton/>
        </main>
        
        {/* Nested routes like /login will render here */}
        
      </div>
   
    
  );
}

export default App;

