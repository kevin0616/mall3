'use client';

import { PrivyProvider, usePrivy } from '@privy-io/react-auth';
import { ReactNode } from 'react';
import { sepolia } from "viem/chains";

interface Props {
  children: ReactNode;
}

function Loading({ children }: Props) {
  const { ready } = usePrivy();
  if (!ready) return <div>Loading Privy...</div>;
  return <>{children}</>;
}

export default function PrivyProviderWrapper({ children }: Props) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_APP_ID!}
      config={{
        loginMethods: ['email'],
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets'}
        },
        defaultChain: sepolia,
        
      }}
    >
      <Loading>{children}</Loading>
    </PrivyProvider>
  );
}
