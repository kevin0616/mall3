'use client'

import Link from "next/link";

function Homepage() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Main Content */}
      <main className="flex-1 flex justify-center items-center">
        <h1 className="text-3xl font-semibold">Welcome to the Homepage!</h1>
      </main>
    </div>
  );
}

export default Homepage;