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
      <Header />

      <main className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-20">
        <div className="w-full max-w-md bg-white rounded-xl shadow p-10">
          <h2 className="text-3xl font-semibold mb-6 text-center text-black">Login</h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black text-black"
              onChange={(e) => setEmail(e.currentTarget.value)}
              value={email}
              type="email"
            />
          </div>
          <button
            onClick={() => sendCode({ email })}
            className="w-full bg-black text-white py-2 rounded-lg mb-6 hover:opacity-90"
          >
            Send OTP
          </button>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">OTP Code</label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black text-black"
              onChange={(e) => setCode(e.currentTarget.value)}
              value={code}
              type="text"
            />
          </div>
          <button
            onClick={loginandcreate}
            className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90"
          >
            Login
          </button>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;