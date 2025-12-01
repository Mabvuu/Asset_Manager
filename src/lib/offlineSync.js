// src/lib/offlineSync.js
import localforage from 'localforage';

localforage.config({ name: 'asset-mvp' });

export async function queueAction(action) {
  const q = (await localforage.getItem('queue')) || [];
  q.push({ action, created_at: Date.now() });
  await localforage.setItem('queue', q);
}

export async function getQueue() {
  return (await localforage.getItem('queue')) || [];
}

export async function clearQueue() {
  await localforage.setItem('queue', []);
}
