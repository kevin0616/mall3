'use client'

import Link from "next/link";

function Homepage() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-semibold">Welcome to Mall3!</h1>
          <div className="flex flex-col p-5 gap-5 items-center">
            <label className="text-xl font-semibold">Get started by <Link href="./login" className="text-blue-500">Login</Link> and we will create a wallet for you!</label>
            <label className="text-xl font-semibold">Want to buy something?...  Go to <Link href="./market" className="text-blue-500">Market</Link></label>
            <label className="text-xl font-semibold">Want to sell something?...  Go to <Link href="./manage" className="text-blue-500">Manage</Link></label>
          </div>
      </main>
    </div>
  );
}

export default Homepage;