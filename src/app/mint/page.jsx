// src/app/mint/page.jsx
'use client';
import WalletConnect from '../../components/WalletConnect';

export default function MintPage() {
  return (
    <div>
      <h2 className="text-2xl mb-4">Mint (Wallet)</h2>
      <WalletConnect />
    </div>
  );
}
