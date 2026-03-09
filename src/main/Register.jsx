import React from "react";
import Navbar from "./navbar"
import useSignup from "../hooks/useSignup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage.js";


function Register() {
  const { t } = useLanguage();
  let{error,loading,signUp}=useSignup();
  let[email,setEmail]=useState('');
  let[password,setPassword]=useState('');
  let navigate=useNavigate();
  let registerUser = async(e)=>{
    e.preventDefault();
    let user=await signUp(email,password);
    //redirect
    if (user){
      navigate('/')
    }
  }
  return (
    <>
      <div className="w-full max-w-lg mt-16 mx-auto">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={registerUser}>
          <h1 className="text-2xl font-bold text-blue-700 my-5">{t("nav.regtitle")}</h1>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              email
            </label>
            <input
             value={email}
             onChange={e=>setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              placeholder="email"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
            value={password}
            onChange={e=>setPassword(e.target.value)}
              className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
            />
            {error && <p className="text-red-500 text-xs italic">{error}</p> }
          </div>
          <div className="flex items-center justify-between">
            <button
              className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {loading && 
              <svg className="mr-3 -ml-1 size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              }
              Register
            </button>
           
          </div>
        </form>
        
      </div>
    </>
  );
}

export default Register;

