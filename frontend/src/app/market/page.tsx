'use client'

import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Header from "@/components/Header";
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import LogicABI from '../../abis/MallLogic.json';
import ProductsABI from '../../abis/MallProducts.json';
import { Contract, Interface, JsonRpcProvider, formatEther } from 'ethers';
import { sepolia } from 'viem/chains';
import { useRouter } from 'next/navigation';

type Product = {
  id: number;
  seller: string;
  price: bigint;
  name: string;
  description: string;
  image: string;
};

function ListsPage() {
  const { client } = useSmartWallets();
  const { authenticated } = usePrivy();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<number | null>(null);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const provider = new JsonRpcProvider("https://sepolia.infura.io/v3/a8dd2e6448dc46359a8c9e391e5ca6d8");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!process.env.NEXT_PUBLIC_PRODUCTS_ADDRESS) {
        setLoading(false);
        return;
      }

      try {
        const contract = new Contract(
          process.env.NEXT_PUBLIC_PRODUCTS_ADDRESS as `0x${string}`,
          ProductsABI,
          provider
        );
        const items = await contract.getProducts();
        const parsed = items.map((item: any) => ({
          id: Number(item[0]),
          seller: item[1],
          price: BigInt(item[2].toString()),
          name: item[3],
          description: item[4],
          image: item[5],
        }));
        setProducts(parsed);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const buy = async (product: Product) => {
    setBuyError(null);
    setTxHash(null);

    if (!authenticated) {
      router.push('/login');
      return;
    }
    if (!client) {
      setBuyError("Smart wallet not ready yet.");
      return;
    }
    if (!process.env.NEXT_PUBLIC_LOGIC_ADDRESS) {
      setBuyError("Missing NEXT_PUBLIC_LOGIC_ADDRESS in .env.");
      return;
    }

    setBuyingId(product.id);
    try {
      const iface = new Interface(LogicABI);
      const calldata = iface.encodeFunctionData("createPending", [product.seller, 3600]);
      const hash = await client.sendTransaction({
        chain: sepolia,
        to: process.env.NEXT_PUBLIC_LOGIC_ADDRESS as `0x${string}`,
        value: product.price,
        data: calldata as `0x${string}`,
      });
      setTxHash(String(hash));
    } catch (err) {
      console.error("Buy failed:", err);
      setBuyError("Transaction failed. Please try again.");
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center px-10 py-20 bg-gray-50">
        <div className="w-full max-w-6xl">
          {loading ? (
            <div className="text-gray-600">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-gray-600">No products available yet.</div>
          ) : (
            <div className="grid grid-cols-2 gap-12">
              {buyError && (
                <div className="col-span-2 text-red-600">
                  {buyError}
                </div>
              )}
              {txHash && (
                <div className="col-span-2 text-green-700 break-all">
                  Transaction submitted: {txHash}
                </div>
              )}
              {products.map((product) => (
                <div key={product.id} className="grid grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2 text-black">{product.name}</h2>
                    <p className="text-gray-600 mb-2">{formatEther(product.price)} ETH</p>
                    <p className="text-gray-600 mb-6">{product.description}</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => buy(product)}
                        disabled={!authenticated || !client || buyingId === product.id}
                        className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
                      >
                        {buyingId === product.id ? "Processing..." : "Buy"}
                      </button>
                    </div>
                  </div>
                  <div>
                    <img
                      src={product.image}
                      className="w-full h-64 object-cover rounded-xl shadow"
                      alt={product.name}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ListsPage;
