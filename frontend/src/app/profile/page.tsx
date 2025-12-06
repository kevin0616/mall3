'use client'

import { useEffect, useState } from 'react';
import {  usePrivy } from '@privy-io/react-auth';
import Header from "@/components/Header";
import { ethers, Interface, JsonRpcProvider } from 'ethers';
import LogicABI from '../../abis/MallLogic.json'
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { sepolia } from 'viem/chains';

function ProfilePage() {
    const { client } = useSmartWallets();
    const { user, authenticated } = usePrivy();
    const [balance, setBalance] = useState('')
    const provider = new JsonRpcProvider("https://sepolia.infura.io/v3/a8dd2e6448dc46359a8c9e391e5ca6d8");
    const [history, setHistory] = useState<any[]>([])

    useEffect(() => {
        const fetchBalance = async () => {
            if(authenticated){
                try {
                    //const result = await provider.getBalance(user?.wallet?.address as `0x${string}`)
                    //setBalance(result.toString())
                    const result = await provider.getBalance(user?.smartWallet?.address as `0x${string}`)
                    setBalance(result.toString())
                    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_LOGIC_ADDRESS as `0x${string}`, LogicABI, provider);
                    const payments = await contract.getPayments();
                    const data = payments
                    /*.filter((item: any) => {
                        return item[0] == user?.smartWallet?.address
                    })*/
                    .map((item: any) => {
                        return Array.from(item);
                    });
                    console.log(data)
                    setHistory(data);
                } catch (err) {
                    console.error("Error fetching balance:", err);
                }
            }
        };

        fetchBalance();
        
    }, [authenticated]);

    const Convert = (timestamp: number) => {
        const date = new Date(Number(timestamp) * 1000)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours() - 1).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const Cancel = async (idx: number) => {
        console.log(`cancelling ${idx}`)
        alert('Are you sure to cancel this transaction?')
        const iface = new Interface(LogicABI);
        const calldata = iface.encodeFunctionData("cancel", [idx]);
        client!.sendTransaction({
            chain: sepolia,
            to: process.env.NEXT_PUBLIC_LOGIC_ADDRESS as `0x${string}`,
            data: calldata as `0x${string}`,
            /*calls: [
                // Approve transaction
                {
                    to: process.env.NEXT_PUBLIC_LOGIC_ADDRESS as `0x${string}`,
                    value: BigInt(price),
                    data: calldata as `0x${string}`,
                },
                // Transfer transaction
                {
                    to: process.env.NEXT_PUBLIC_LOGIC_ADDRESS as `0x${string}`,
                    value: BigInt(price),
                    data: calldata as `0x${string}`,
                }
            ]*/
        }).then((txHash: String) => {
            console.log(txHash);
        });
    }

    const Confirm = (idx: number) => {
        console.log(`confirming${idx}`)
        alert("Are you sure to confirm this transaction")
    }

    return (
        <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 flex flex-col items-center px-6 py-16 bg-gray-50">
            <div className="w-full max-w-5xl space-y-10">
            <div className="relative bg-white shadow rounded-xl p-8">
                <div className="absolute -top-5 left-6 px-3 py-1 rounded-md text-3xl font-semibold">
                Info
                </div>
                <div className="mt-4 space-y-3 text-gray-700 text-lg">
                <div><span className="font-medium">Balance:</span> {user ? balance : ''}</div>
                <div><span className="font-medium">Email:</span> {user?.email?.address}</div>
                {/* <div><span className="font-medium">Address:</span> {user?.wallet?.address}</div> */}
                <div><span className="font-medium">Address:</span> {user?.smartWallet?.address}</div>

                </div>
            </div>
            <div className="relative bg-white shadow rounded-xl px-5 py-8">
                <div className="absolute -top-4 left-6 px-3 py-1 rounded-md text-3xl font-semibold">
                History
                </div>

                <table className="table-auto w-full">
                <thead>
                <tr className="bg-gray-400 text-white">
                    <th className="border border-gray-300 px-2 py-1">Seller</th>
                    <th className="border border-gray-300 px-2 py-1">Price</th>
                    <th className="border border-gray-300 px-2 py-1">Date</th>
                    <th className="border border-gray-300 px-2 py-1">Status</th>
                    <th className="border border-gray-300 px-2 py-1"></th>
                    <th className="border border-gray-300 px-2 py-1"></th>
                </tr>
                </thead>
                <tbody>
                {history.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-100">
                        <td className="border border-gray-300 px-2 py-1">
                            {row[1]}
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                            {row[2]}
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                            {Convert(row[3])}
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                            {row[4]}
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                            <button onClick={() => Cancel(idx)}>Cancel</button>
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                            <button onClick={() => Confirm(idx)}>Confirm</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>

            </div>
        </main>
        </div>
    );
}

export default ProfilePage;