# mall3  
*A Web3 marketplace that offer Web2 user experience*

## Features  
- Email login (create smart account automatically)  
- Gasless checkout via Paymaster
- Cancellation Period Provided
- On-chain order & payment processing
- On-chain product managing  
- Product listing + catalog + order history  

## Architecture & Tech Stack  
- Frontend: Next.js + React + TailwindCSS
- Smart Contracts: Solidity
- Paymaster + Account Abstraction (EIP-4337)  
- Wallet Infra: Privy, Pimlico
- Storage / Metadata: Pinata

## Getting Started / Installation  

```bash
git clone https://github.com/kevin0616/mall3.git  
cd mall3  

# enter frontend & run program
cd frontend  
npm install  
npm run dev  

# deploy contracts  
cd ../contracts  
# deploy mallLogicV2.sol

# .env setup
NEXT_PUBLIC_APP_ID='privy-app-id'
NEXT_PUBLIC_LOGIC_ADDRESS='mallLogicV2-contract-address'
NEXT_PUBLIC_SELLER_ADDRESS='seller-address'(will be removed))
