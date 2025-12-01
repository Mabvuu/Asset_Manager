// src/lib/thirdwebClient.js
import dotenv from 'dotenv';
dotenv.config();

import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';

const CHAIN = process.env.THIRDWEB_CHAIN || 'polygon-mumbai';
const CONTRACT_ADDRESS = process.env.THIRDWEB_CONTRACT_ADDRESS;
const SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;

if (!SECRET_KEY) {
  // we throw lazily when trying to use server SDK to make errors explicit
  // but keep initialization tolerant so client-side imports don't crash.
  // Server API routes must check for SECRET_KEY before calling server SDK functions.
  // See docs: secret key is for server use only. :contentReference[oaicite:2]{index=2}
  // eslint-disable-next-line no-console
  console.warn('THIRDWEB_SECRET_KEY not set; server-side thirdweb calls will fail until it is set.');
}

let serverSdk = null;

/**
 * Returns a server-side Thirdweb SDK instance (requires SECRET_KEY).
 * Uses ethers provider for the target chain (Mumbai by default).
 */
export function getServerThirdwebSdk() {
  if (serverSdk) return serverSdk;
  if (!SECRET_KEY) throw new Error('Missing THIRDWEB_SECRET_KEY in env');
  // use ethers default provider for Mumbai; you may swap to an RPC of your choice
  const provider = ethers.getDefaultProvider(CHAIN === 'polygon-mumbai' ? 'https://rpc-mumbai.maticvigil.com' : undefined);
  serverSdk = new ThirdwebSDK(provider, {
    secretKey: SECRET_KEY,
  });
  return serverSdk;
}

/**
 * Helper: get contract object for the configured contract address.
 * Throws helpful error when address missing.
 */
export async function getServerContract() {
  if (!CONTRACT_ADDRESS) throw new Error('Missing THIRDWEB_CONTRACT_ADDRESS in env');
  const sdk = getServerThirdwebSdk();
  return await sdk.getContract(CONTRACT_ADDRESS);
}
