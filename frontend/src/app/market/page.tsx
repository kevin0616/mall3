'use client'

import { Fragment, useEffect, useState } from 'react'
import { useLoginWithEmail, usePrivy, useCreateWallet, useSendTransaction } from '@privy-io/react-auth'
import Header from "@/components/Header"
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets'
import LogicABI from '../../abis/MallLogic.json'
import ProductsABI from '../../abis/MallProducts.json'
import { ethers, Interface, JsonRpcProvider } from 'ethers'
import { sepolia } from 'viem/chains'
import { useRouter } from 'next/navigation'

function ListsPage() {
  const { client } = useSmartWallets()
  const { user, authenticated } = usePrivy()
  const provider = new JsonRpcProvider("https://sepolia.infura.io/v3/a8dd2e6448dc46359a8c9e391e5ca6d8")
  const [products, setProducts] = useState<any[]>([])
  const router = useRouter()


  const buy = (price: number, seller: string) => {
    if(!authenticated){
      alert("Please login first")
      router.push('/login')
    } 
    const iface = new Interface(LogicABI);
    const calldata = iface.encodeFunctionData("createPending", [seller, 3600]);
    client!.sendTransaction({
        chain: sepolia,
        to: process.env.NEXT_PUBLIC_LOGIC_ADDRESS as `0x${string}`,
        value: BigInt(price),
        data: calldata as `0x${string}`,
    }).then((txHash: String) => {
        console.log(txHash)
    })
  }

  useEffect(() => {
      const fetchData = async () => {
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
          
      };

      fetchData();
          
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <main className="flex-1 flex flex-col items-center px-10 py-20 bg-gray-50">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-2 gap-12">
            {products.filter((item: any) => {
                return item[6] == false
                }).map((row, idx) => (
                  <Fragment key={idx}>
                    {idx % 2 == 0 ? (
                      <>
                        <div>
                          <h2 className="text-2xl font-semibold mb-2">{row[3]}</h2>
                          <p className="text-gray-600 mb-2">${Number(row[2])}</p>
                          <p className="text-gray-600 mb-2 h-10">{row[4]}</p>
                          <button onClick={(e) => {buy(Number(row[2]), row[1])}} className="px-4 py-2 bg-black text-white rounded-md">
                            Buy
                          </button>
                        </div>
                        <div>
                          <img
                            src={row[5]}
                            className="w-full h-64 object-cover rounded-xl shadow"
                            alt=""
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <img
                            src={row[5]}
                            className="w-full h-64 object-cover rounded-xl shadow"
                            alt=""
                          />
                        </div>
                        <div>
                          <h2 className="text-2xl font-semibold mb-2">{row[3]}</h2>
                          <p className="text-gray-600 mb-2">${Number(row[2])}</p>
                          <p className="text-gray-600 mb-2 h-10">{row[4]}</p>
                          <button onClick={(e) => {buy(Number(row[2]), row[1])}} className="px-4 py-2 bg-black text-white rounded-md">
                            Buy
                          </button>
                        </div>
                      </>
                    )}
                  </Fragment>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ListsPage;