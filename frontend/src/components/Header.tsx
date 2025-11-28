'use client'

import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { useState } from "react";

function Header() {
    const { user, authenticated, logout } = usePrivy();
    const [open, setOpen] = useState(false);

    return (
        <div>
            <header className="flex justify-between items-center p-4 bg-gray-100 shadow">
            <div className="relative">
                <div className="text-xl font-bold cursor-pointer" onClick={() => setOpen(!open)}>
                    Mall3
                </div>

                {/* Dropdown */}
                {open && (
                    <div className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                        <Link 
                            href="/"
                            className="block px-4 py-2 hover:bg-gray-100"
                        >
                            Page 1
                        </Link>
                        <Link 
                            href="/login"
                            className="block px-4 py-2 hover:bg-gray-100"
                        >
                            Page 2
                        </Link>
                    </div>
                )}
            </div>
            { !authenticated ? 
            (
                <div>
                    <Link href="/login">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Login
                        </button>
                    </Link>
                </div>
            ):(
                <div>
                    Hi, {user?.wallet?.address}
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={logout}>
                        Logout
                    </button>
                </div>
            )
            }
            </header>
        </div>
  );
}

export default Header;