'use client'

import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { useState } from "react";

function Header() {
    const { user, authenticated, logout } = usePrivy();

    return (
        <div>
            <header className="flex justify-between items-center p-4 bg-gray-100 shadow">
            <div className="relative">
                <div className="text-xl font-bold">
                    Mall3
                </div>
            </div>
            <div className="flex gap-10 items-center justify-center">
                <Link href="/market">
                    Market
                </Link>
                <Link href="/profile">
                    Profile
                </Link>
            { !authenticated ? 
            (
                <Link href="/login">
                    <button>Login</button>
                </Link>  
            ):(  
                <button onClick={logout}>Logout</button>
            )
            }
            </div>
            </header>
        </div>
  );
}

export default Header;