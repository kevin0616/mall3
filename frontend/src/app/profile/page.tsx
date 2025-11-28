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
      <main className="flex-1 flex justify-center items-center">
        <h1 className="text-3xl font-semibold">Welcome to the Profile Page!</h1>
      </main>
    </div>
  );
}

export default LoginPage;