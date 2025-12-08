'use client'

import { useEffect, useState } from 'react';
import { useLoginWithEmail, usePrivy, useCreateWallet, useSendTransaction } from '@privy-io/react-auth';
import Header from "@/components/Header";
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import LogicABI from '../../abis/MallLogic.json'
import { ethers, Interface } from 'ethers';

import { sepolia } from 'viem/chains';

function ListsPage() {
  const { client } = useSmartWallets();
  const { user, authenticated } = usePrivy();
  const buy = (price: string) => {
    console.log(price)
    onSendTransaction(price)
  }

  const {sendTransaction} = useSendTransaction();
  const onSendTransaction = async (price: string) => {
    const payee = process.env.NEXT_PUBLIC_SELLER_ADDRESS
    const iface = new Interface(LogicABI);
    const calldata = iface.encodeFunctionData("createPending", [payee, 3600]);
    client!.sendTransaction({
        chain: sepolia,
        to: process.env.NEXT_PUBLIC_LOGIC_ADDRESS as `0x${string}`,
        value: BigInt(price),
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

    /*const payee = '0xA33dC84074cDD703ACDf16ddeFf3831aB8eDd7d9'
    const iface = new Interface(LogicABI);
    const calldata = iface.encodeFunctionData("createPending", [payee]);
    const tx = await sendTransaction({
      to: process.env.NEXT_PUBLIC_LOGIC_ADDRESS,
      data: calldata,
      value: price,
    },{
    sponsor: true
  });
    console.log('Transaction result:', tx);*/
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <main className="flex-1 flex flex-col items-center px-10 py-20 bg-gray-50">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">A Pear</h2>
              <p className="text-gray-600 mb-6">
                $20
              </p>

              <div className="flex gap-3">
                <button onClick={(e) => {buy('20')}} className="px-4 py-2 bg-black text-white rounded-md">
                  Buy
                </button>
                <button className="px-4 py-2 bg-black text-white rounded-md">
                  Add to cart
                </button>
              </div>
            </div>

            <div>
              <img
                src="/pear.jpg"
                className="w-full h-64 object-cover rounded-xl shadow"
                alt=""
              />
            </div>
            <div>
              <img
                src="/watermelon.jpg"
                className="w-full h-64 object-cover rounded-xl shadow"
                alt=""
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">A Watermelon</h2>
              <p className="text-gray-600 mb-6">
                $25
              </p>

              <div className="flex gap-3">
                <button onClick={(e) => {buy('25')}} className="px-4 py-2 bg-black text-white rounded-md">
                  Buy
                </button>
                <button className="px-4 py-2 bg-black text-white rounded-md">
                  Add to cart
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default ListsPage;