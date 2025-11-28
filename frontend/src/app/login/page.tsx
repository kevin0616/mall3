'use client'

import { useEffect, useState } from 'react';
import { useLoginWithEmail, usePrivy, useCreateWallet, useSendTransaction } from '@privy-io/react-auth';
import Header from "@/components/Header";

function LoginPage() {
  const { user, authenticated } = usePrivy();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const {sendCode, loginWithCode} = useLoginWithEmail();
  const { createWallet } = useCreateWallet();
  useEffect(() => {
  if (authenticated && user && !user.wallet) {
    createWallet().then(wallet => {
      console.log('wallet created', wallet);
    }).catch(err => {
      console.error('wallet create error', err);
    });
  }
}, [authenticated, user]);

  const loginandcreate = () => {
    loginWithCode({code})
    
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <div className="h-screen flex flex-col items-center justify-center">
        <label className="text-2xl font-bold ">Login</label>
        <div className="m-2 p-5 w-1/2 bg-blue-200 flex flex-col rounded-lg">
          <div className='flex flex-row my-3'>
            Email: <input className="border w-full" onChange={(e) => setEmail(e.currentTarget.value)} value={email} />
          </div>
          <div className='flex items-center justify-center'>
            <button onClick={() => sendCode({email})}>Send</button>
          </div>
          <div className='flex flex-row my-3'>
            OTP:<input className="border w-full" onChange={(e) => setCode(e.currentTarget.value)} value={code} />
          </div>
          <div className='flex items-center justify-center'>
            <button onClick={() => loginandcreate()}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;