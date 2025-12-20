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

function buyerTable({ history }: HistoryListProps) {
    const { client } = useSmartWallets();
    const { user, authenticated } = usePrivy();
    const STATUS = ["Pending", "Confirmed", "Cancelled", "Finished"]

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
        const iface = new Interface(LogicABI);
        const calldata = iface.encodeFunctionData("confirm", [idx]);
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
        <table className="table-auto w-full my-5">
            <thead>
            <tr className="bg-gray-400 text-white">
                <th className="border border-gray-300 px-1 py-1">Seller</th>
                <th className="border border-gray-300 px-1 py-1">Price</th>
                <th className="border border-gray-300 px-1 py-1">Date</th>
                <th className="border border-gray-300 px-1 py-1">Status</th>
                <th className="border border-gray-300 px-1 py-1"></th>
                <th className="border border-gray-300 px-1 py-1"></th>
            </tr>
            </thead>
            <tbody>
            {history.filter((item: any) => {
                return item[1] == user?.smartWallet?.address
                }).map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-1 py-1 text-center h-12">
                        {row[2]}
                    </td>
                    <td className="border border-gray-300 px-1 py-1 text-center">
                        {row[3]}
                    </td>
                    <td className="border border-gray-300 px-1 py-1 text-center">
                        {Convert(row[4])}
                    </td>
                    <td className="border border-gray-300 px-1 py-1 text-center">
                        { row[5] == 0 && new Date(Number(row[4]) * 1000) < new Date() ? "Confirmed" : STATUS[row[5]]}
                    </td>
                    
                    <td className="border border-gray-300 px-1 py-1 text-center">
                        {row[5] == 0 && new Date(Number(row[4]) * 1000) > new Date() ? (
                            <button onClick={() => Cancel(row[0])}>Cancel</button>
                        ) : (
                            <span className="text-gray-400">—</span>
                        )}
                    </td>
                    <td className="border border-gray-300 px-1 py-1 text-center">
                        {row[5] == 0 && new Date(Number(row[4]) * 1000) > new Date() ? (
                            <button onClick={() => Confirm(row[0])}>Confirm</button>
                        ) : (
                            <span className="text-gray-400">—</span>
                        )}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default buyerTable;