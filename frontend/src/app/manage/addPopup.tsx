import { Interface } from "ethers";
import { useState } from "react";
import ProductsABI from '../../abis/MallProducts.json'
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { sepolia } from 'viem/chains';

interface AddPopupProps {
  onClose: () => void;
}

export default function AddPopup({onClose}: AddPopupProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState<File | null>(null)
  const [preview, setPreview] = useState("");
  const { client } = useSmartWallets();
  const JWT = process.env.NEXT_PUBLIC_JWT;

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    setImg(file);
    setPreview(URL.createObjectURL(file));
  };

  const release = async(e: React.FormEvent) => {
    e.preventDefault()
    // console.log(name, price, desc, img)
    const data = new FormData();
    if (img) {
      data.append("file", img);
    }
    try {  
      const request = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
          body: data,
        }
      )
      const response = await request.json()
      const URI = process.env.NEXT_PUBLIC_PINATA_URL + response.IpfsHash?.toString()
      const iface = new Interface(ProductsABI)
      const calldata = iface.encodeFunctionData("release", [price, name, desc, URI])
      client!.sendTransaction({
        chain: sepolia,
        to: process.env.NEXT_PUBLIC_PRODUCTS_ADDRESS as `0x${string}`,
        data: calldata as `0x${string}`,
      }).then((txHash: String) => {
          console.log(txHash);
          window.location.reload()
      })
    } catch(error) {
      console.log(error);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <form onSubmit={release} className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-semibold mb-4">Add Product</h2>

        <label className="text-sm font-medium">Product Name</label>
        <input
          required
          className="w-full border rounded-lg px-3 py-2 mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="text-sm font-medium">Price</label>
        <input
          required
          type="number"
          className="w-full border rounded-lg px-3 py-2 mb-3"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <label className="text-sm font-medium">Description</label>
        <textarea
          className="w-full border rounded-lg px-3 py-2 mb-3"
          rows={3}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <label className="text-sm font-medium">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          className="w-full mb-3 h-10"
          onChange={handleImage}
        />

        {preview && (
          <img
            src={preview}
            className="w-full h-40 object-cover rounded-lg mb-4 shadow"
          />
        )}

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>
            Cancel
          </button>
          <button type="submit">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
