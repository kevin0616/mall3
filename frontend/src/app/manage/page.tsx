'use client'

import { useEffect, useState } from 'react'
import { useLoginWithEmail, usePrivy, useCreateWallet, useSendTransaction } from '@privy-io/react-auth'
import Header from "@/components/Header"
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets'
import LogicABI from '../../abis/MallLogic.json'
import { ethers, Interface } from 'ethers'
import { sepolia } from 'viem/chains'
import AddPopup from './addPopup'

function ListsPage() {
  const { client } = useSmartWallets()
  const { user, authenticated } = usePrivy()
  const [popup, setPopup] = useState(false)

  const buy = (price: string) => {
    console.log(price)
    onSendTransaction(price)
  }

  const remove = (id: string) => {

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
          <div className="grid grid-cols-5 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-2">A Pear</h2>
              <p className="text-gray-600 mb-2">$20</p>
              <p className="text-gray-600 mb-2">description</p>
              <img
                src="/pear.jpg"
                className="w-full h-40 object-cover rounded-xl shadow"
                alt=""
              />
              <button onClick={(e) => {remove('20')}} className="my-2 py-2">
                  Remove
              </button>
            </div>
            <div
            onClick={() => {setPopup(!popup)}}
            className="flex justify-center items-center rounded-xl cursor-pointer hover:bg-gray-100 transition text-6xl text-gray-400">
            +
            </div>
          </div>
          {popup &&
          <div>
            <AddPopup onClose={() => {setPopup(!popup)}}/>
          </div>
          }
        </div>
      </main>
    </div>
  );
}

export default ListsPage;