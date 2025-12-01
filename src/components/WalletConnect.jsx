// src/components/WalletConnect.jsx
'use client';
import { useState } from 'react';

export default function WalletConnect({ assetId }) {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [msg, setMsg] = useState('');

  async function connect() {
    setMsg('');
    if (!window.ethereum) {
      setMsg('Install MetaMask or another EVM wallet');
      return;
    }
    try {
      setLoading(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAddress(accounts?.[0] ?? null);
    } catch (err) {
      console.error('wallet connect err', err);
      setMsg('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  }

  async function mint() {
    setMsg('');
    if (!address) {
      setMsg('Connect wallet first');
      return;
    }

    const metadata = {
      name: `Asset NFT ${assetId ?? ''}`,
      description: 'Ownership proof for an asset',
    };

    setMinting(true);
    try {
      const res = await fetch('/api/mint-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: address, metadata, assetId }),
      });

      // read text first — server might return HTML (404 page) or JSON
      const text = await res.text();

      // try parse JSON safely
      let json;
      try {
        json = text ? JSON.parse(text) : null;
      } catch (parseErr) {
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 300)}`);
      }

      if (!res.ok) {
        throw new Error(json?.error || `HTTP ${res.status}`);
      }

      const tokenId = json?.tokenId ?? json?.data?.tokenId ?? json?.data?.tx?.receipt?.transactionHash;
      setMsg(tokenId ? `Mint successful — tokenId: ${tokenId}` : 'Mint succeeded');
      // you can navigate or update UI here
    } catch (err) {
      console.error('mint error', err);
      setMsg('Mint failed: ' + (err?.message || 'Unknown error'));
    } finally {
      setMinting(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>Wallet: {address ?? 'Not connected'}</div>

      {msg && <div className="text-sm text-gray-700">{msg}</div>}

      <div className="flex gap-2">
        <button
          onClick={connect}
          className="px-3 py-2 border rounded"
          disabled={loading || !!address}
        >
          {loading ? 'Connecting…' : address ? 'Connected' : 'Connect'}
        </button>

        <button
          onClick={mint}
          className="px-3 py-2 bg-indigo-600 text-white rounded disabled:opacity-60"
          disabled={minting || !address}
        >
          {minting ? 'Minting…' : 'Mint NFT'}
        </button>
      </div>
    </div>
  );
}
