'use client'

import { useEffect, useState } from 'react'
import { useLoginWithEmail, usePrivy, useCreateWallet, useSendTransaction } from '@privy-io/react-auth'
import Header from "@/components/Header"
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets'
import ProductsABI from '../../abis/MallProducts.json'
import { ethers, Interface, JsonRpcProvider } from 'ethers'
import { sepolia } from 'viem/chains'
import AddPopup from './addPopup'

function ListsPage() {
  const { client } = useSmartWallets()
  const { user, authenticated } = usePrivy()
  const provider = new JsonRpcProvider("https://sepolia.infura.io/v3/a8dd2e6448dc46359a8c9e391e5ca6d8")
  const [popup, setPopup] = useState(false)
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
      const fetchData = async () => {
          if(authenticated){
              try {
                  const contract = new ethers.Contract(process.env.NEXT_PUBLIC_PRODUCTS_ADDRESS as `0x${string}`, ProductsABI, provider);
                  const products = await contract.getProducts();
                  const data = products
                  /*.filter((item: any) => {
                      return item[0] == user?.smartWallet?.address
                  })*/
                  .map((item: any) => {
                      return Array.from(item);
                  });
                  console.log(data)
                  setProducts(data);
              } catch (err) {
                  console.error("Error fetching data:", err);
              }
          }
        };

        fetchData();
        
    }, [authenticated]);

  const remove = (id: string) => {
    console.log("removing ", id)
    const iface = new Interface(ProductsABI)
    const calldata = iface.encodeFunctionData("remove", [Number(id)])
    client!.sendTransaction({
      chain: sepolia,
      to: process.env.NEXT_PUBLIC_PRODUCTS_ADDRESS as `0x${string}`,
      data: calldata as `0x${string}`,
    }).then((txHash: String) => {
        console.log(txHash);
        window.location.reload()
    })
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Please login to view your products
            </h2>
            <p className="text-gray-600">
              You need to be logged in to manage your listings.
            </p>
          </div>
        </main>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <main className="flex-1 flex flex-col items-center px-10 py-20 bg-gray-50">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-5 gap-12">
            
            {products.filter((item: any) => {
                return item[1] == user?.smartWallet?.address && item[6] == false
                }).map((row, idx) => (
                  <div key={row[0] ?? idx}>
                    <h2 className="text-2xl font-semibold mb-2 text-black">{row[3]}</h2>
                    <p className="text-gray-600 mb-2">${Number(row[2])}</p>
                    <p className="text-gray-600 mb-2 h-10">{row[4]}</p>
                    <img
                      src={row[5]}
                      className="w-full h-40 object-cover rounded-xl shadow"
                      alt=""
                    />
                    <button onClick={(e) => {remove(row[0])}} className="my-2 py-2">
                        Remove
                    </button>
                  </div>
            ))}

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
