"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getUserRole } from "@/lib/getRole";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return router.push("/login");

      const r = await getUserRole();
      setRole(r);
    };

    load();
  }, );

  if (!role) return null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {role === "admin" && <p>ADMIN PANEL</p>}
      {role === "user" && <p>USER PANEL</p>}

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/login");
        }}
        className="mt-4 bg-red-500 text-white p-2"
      >
        Logout
      </button>
    </div>
  );
}
