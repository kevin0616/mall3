'use client'

import { useEffect, useState } from 'react';
import { useLoginWithEmail, usePrivy, useCreateWallet, useSendTransaction } from '@privy-io/react-auth';
import Header from "@/components/Header";
import { ethers, JsonRpcProvider } from 'ethers';

function ProfilePage() {
    const { user, authenticated } = usePrivy();
    const { createWallet } = useCreateWallet();
    const smartWallet = user?.linkedAccounts.find((account) => account.type === 'smart_wallet');
    console.log(smartWallet?.address);
        // Logs the smart wallet's address
    console.log(smartWallet?.type);
    const [balance, setBalance] = useState('-')
    useEffect(() => {
        const fetchBalance = async () => {
            if(authenticated){
                try {
                    const provider = new JsonRpcProvider("https://sepolia.infura.io/v3/a8dd2e6448dc46359a8c9e391e5ca6d8");
                    const result = await provider.getBalance(user?.wallet?.address as `0x${string}`)
                    setBalance(result.toString())
                } catch (err) {
                    console.error("Error fetching balance:", err);
                }
            }
        };

        fetchBalance();
        
    }, [authenticated]);
    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
            <main className="w-3/4 flex-1 flex flex-col items-center mx-auto">
                <div className="w-full border rounded-lg p-4 relative mt-6">
                    <div className=" absolute -top-5 left-4 bg-white px-2 text-sm font-semibold">
                        <label className='text-3xl'>Info</label>
                    </div>
                    <div className='flex flex-col'>
                        <label>Balance: {user? balance : '-'}</label>
                        <label>Email: {user?.email?.address}</label>
                        <label>Address: {user?.wallet?.address}</label>
                    </div>
                </div>
                <div className="w-full border rounded-lg p-4 relative mt-6">
                    <div className=" absolute -top-5 left-4 bg-white px-2 text-sm font-semibold">
                        <label className='text-3xl'>History</label>
                    </div>
                    <div>
                        Your shopping history is empty
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ProfilePage;