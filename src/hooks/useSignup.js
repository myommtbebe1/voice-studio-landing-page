import React, { useState } from 'react'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import {auth} from '../firebase/index'

export default function useSignup() {

  const[error,setError]=useState(null);
  const[loading,setLoading]=useState(false);
  
  const signUp=async(email,password)=>{
        try{
            setLoading(true);
            setError(null);
            let res=await createUserWithEmailAndPassword(auth,email,password);
            setLoading(false);
            return res.user
        }catch(e){
            setLoading(false);
            // Store only the message so React doesn't try to render an Error object
            setError(e?.message || "Sign up failed")
        }
    
   
  }


  return {error,loading,signUp}
}
