'use client'

import { useEffect, useState } from 'react';
import { useLoginWithEmail, usePrivy, useCreateWallet, useSendTransaction } from '@privy-io/react-auth';
import Header from "@/components/Header";

function ListsPage() {
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

  const {sendTransaction} = useSendTransaction();
  const onSendTransaction = async () => {
    sendTransaction({
      to: '0xB6BcAb170Bc08b7C285389a18caEAEdE0D63b09E',
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <main className="flex-1 flex flex-col justify-center items-center">
        <h1 className="text-3xl font-semibold">Welcome to the Listspage!</h1>
        
        <ul className="w-1/2 divide-y divide-gray-200">
        <li className="p-3 hover:bg-gray-100 cursor-pointer">
            Item 1
            <div>
                <button onClick={onSendTransaction}>Send Transaction</button>
            </div>
        </li>
        <li className="p-3 hover:bg-gray-100 cursor-pointer">
            Item 2
        </li>
        <li className="p-3 hover:bg-gray-100 cursor-pointer">
            Item 3
        </li>
        </ul>
      </main>
    </div>
  );
}

export default ListsPage;