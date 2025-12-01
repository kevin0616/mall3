'use client'

import { useEffect, useState } from 'react';
import { useLoginWithEmail, usePrivy, useCreateWallet, useSendTransaction } from '@privy-io/react-auth';
import Header from "@/components/Header";
import { useRouter } from 'next/navigation';

function LoginPage() {
  const { user, authenticated } = usePrivy();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const {sendCode, loginWithCode} = useLoginWithEmail();
  const router = useRouter();
  const {createWallet} = useCreateWallet({
      onSuccess: ({wallet}) => {
          console.log('Created wallet ', wallet);
      },
      onError: (error) => {
          console.error('Failed to create wallet with error ', error)
      }
  })
  const loginandcreate = async () => {
    try {
      await loginWithCode({ code });   // 等 login 完成
      router.push('/');
    } catch (err) {
      console.error('Login failed', err);
    }
  }


useEffect(() => {
  console.log("effect")
  if (!authenticated || !user){
    console.log('return')
    console.log(authenticated, user)
    return
  } 
  console.log(user, user.wallet == undefined)
  if (user.wallet == undefined) {
    (async () => {
      console.log("START")
      try {
        const wallet = await createWallet();
        console.log('wallet created', wallet);
      } catch (err) {
        console.error('createWallet error', err);
      }
    })();
  }
  console.log(12313278)
}, [authenticated, user]);
  
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