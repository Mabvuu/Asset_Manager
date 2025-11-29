"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Assets() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data } = await supabase
        .from("assets")
        .select("*")
        .eq("owner_id", user.id);

      setAssets(data || []);
    };
    load();
  }, );

  const createAsset = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("assets").insert({
      name,
      owner_id: user.id
    });

    setName("");
    location.reload();
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-xl font-bold">My Assets</h1>

      <input
        className="border p-2"
        placeholder="Asset Name"
        value={name}
        onChange={e=>setName(e.target.value)}
      />

      <button onClick={createAsset} className="bg-black text-white p-2 ml-2">
        Create
      </button>

      <ul className="mt-6 space-y-2">
        {assets.map(a => (
          <li key={a.id} className="border p-2">{a.name}</li>
        ))}
      </ul>
    </div>
  );
}
