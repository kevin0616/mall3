'use client'

import { useEffect, useState } from 'react'
import {  usePrivy } from '@privy-io/react-auth'
import Header from "@/components/Header"
import { ethers, Interface, JsonRpcProvider } from 'ethers'
import LogicABI from '../../abis/MallLogic.json'
import BuyerTable from './buyerTable'
import SellerTable from './sellerTable'

function ProfilePage() {
    const { user, authenticated } = usePrivy();
    const [balance, setBalance] = useState('')
    const provider = new JsonRpcProvider("https://sepolia.infura.io/v3/a8dd2e6448dc46359a8c9e391e5ca6d8");
    const [history, setHistory] = useState<any[]>([])
    const [isBuyer, setIsBuyer] = useState(true);

    useEffect(() => {
        const fetchBalance = async () => {
            if(authenticated){
                try {
                    const result = await provider.getBalance(user?.smartWallet?.address as `0x${string}`)
                    setBalance(result.toString())
                    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_LOGIC_ADDRESS as `0x${string}`, LogicABI, provider)
                    const payments = await contract.getPayments()
                    const data = payments
                    .map((item: any) => {
                        return Array.from(item)
                    });
                    setHistory(data)
                } catch (err) {
                    console.error("Error fetching balance:", err)
                }
            }
        };

        fetchBalance()
        
    }, [authenticated])


    if (!authenticated) {
        return (
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">
                  Please login to view your profile
                </h2>
                <p className="text-gray-600">
                  You need to be logged in to manage your profile.
                </p>
              </div>
            </main>
          </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 flex flex-col items-center px-6 py-16 bg-gray-50">
            <div className="w-full max-w-5xl space-y-10">
            <div className="relative bg-white shadow rounded-xl px-5 py-2">
                <div className="left-6 py-1 rounded-md text-3xl font-semibold">
                Info
                </div>
                <div className="mt-4 space-y-3 text-gray-700 text-lg">
                <div><span className="font-medium">Balance:</span> {user ? balance : ''}</div>
                {authenticated && <p>
                Need test ETH?  
                <a
                    href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                    target="_blank"
                    className="text-blue-600 underline"
                >
                    Get from GCW Faucet
                </a>
                </p>
                }
                <div><span className="font-medium">Email:</span> {user?.email?.address}</div>
                {/* <div><span className="font-medium">Address:</span> {user?.wallet?.address}</div> */}
                <div><span className="font-medium">Address:</span> {user?.smartWallet?.address}</div>

                </div>
            </div>
            <div className="relative bg-white shadow rounded-xl px-5 py-2">
                <div className="flex flex-row justify-between left-6 py-1 rounded-md text-3xl font-semibold">
                    History
                    <div className="flex flex-row items-center gap-2">
                        <label className="text-sm">Buyer</label>
                        <div onClick={() => setIsBuyer(!isBuyer)} className="w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition bg-gray-300">
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${isBuyer ? "translate-x-0" : "translate-x-6"}`}></div>
                        </div>
                        <label className="text-sm">Seller</label>
                    </div>
                </div>
                {!user ? <div></div> : isBuyer ? <BuyerTable history={history}/> : <SellerTable history={history}/> }
                
            </div>

            </div>
        </main>
        </div>
    );
}

export default ProfilePage;