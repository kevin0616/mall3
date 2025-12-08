import { useEffect, useState } from 'react';
import {  usePrivy } from '@privy-io/react-auth';
import Header from "@/components/Header";
import { ethers, Interface, JsonRpcProvider } from 'ethers';
import LogicABI from '../../abis/MallLogic.json'
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { sepolia } from 'viem/chains';

interface HistoryListProps {
  history: any[];
}

function sellerTable({ history }: HistoryListProps) {
    const { client } = useSmartWallets();
    const { user, authenticated } = usePrivy();

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

    const Collect = async (idx: number) => {
        console.log(`collecting ${idx}`)
        alert('Are you sure to collect this transaction?')
        const iface = new Interface(LogicABI);
        const calldata = iface.encodeFunctionData("collect", [idx]);
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

    return (
        <table className="table-auto w-full">
            <thead>
            <tr className="bg-gray-400 text-white">
                <th className="border border-gray-300 px-2 py-1">Buyer</th>
                <th className="border border-gray-300 px-2 py-1">Price</th>
                <th className="border border-gray-300 px-2 py-1">Date</th>
                <th className="border border-gray-300 px-2 py-1">Status</th>
            </tr>
            </thead>
            <tbody>
            {history.filter((item: any) => {
                return item[2] == user?.smartWallet?.address && (item[5] == 1 || item[5] == 3)
                }).map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-2 py-1">
                        {row[1]}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                        {row[3]}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                        {Convert(row[4])}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                        {row[5] == 1 ? <button onClick={() => Collect(row[0])}>Collect</button> : <label>Finished</label> }
                        
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default sellerTable;