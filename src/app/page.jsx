// src/app/page.jsx
export default function Home() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Asset Management MVP</h1>
      <p className="mb-4">Invite-only asset tracker with optional NFT minting (thirdweb + Polygon Mumbai).</p>
      <div className="space-x-2">
        <a className="px-4 py-2 bg-indigo-600 text-white rounded" href="/login">Login</a>
        <a className="px-4 py-2 border rounded" href="/invite">Request Invite</a>
      </div>
    </section>
  );
}
