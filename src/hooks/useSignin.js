import React, { useState } from 'react'
import { signInWithEmailAndPassword} from 'firebase/auth'
import {auth} from '../firebase/index'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

export default function useSignin() {

  const[error,setError]=useState(null);
  const[loading,setLoading]=useState(false);
  
  const signIn=async(email,password)=>{
        try{
            setLoading(true);
            setError(null);
            let res=await signInWithEmailAndPassword(auth,email,password);
            setLoading(false);
            return res.user
        }catch(e){
            setLoading(false);
            // Store only the message so React doesn't try to render an Error object
            setError(e?.message || "Sign up failed")
        }
    
   
  }

  const LoginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const res = await signInWithPopup(auth, provider);
      setLoading(false);
      return res.user;
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(err?.message || "Login failed");
      return null;
    }
  };


  return {error,loading,signIn,LoginWithGoogle}
}
