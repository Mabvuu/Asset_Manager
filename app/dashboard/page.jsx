
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { getUserRole } from "../../lib/getRole";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/");

      setUserEmail(user.email || "");
      const r = await getUserRole();
      setRole(r);
    };
    load();
  }, []);

  if (role === null) return null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">Signed in as: {userEmail}</p>

      {role === "admin" && <p className="mt-4">ADMIN PANEL</p>}
      {role === "user" && <p className="mt-4">USER PANEL</p>}

      <button onClick={async () => { await supabase.auth.signOut(); router.push("/"); }} className="mt-4 bg-red-500 text-white p-2">
        Logout
      </button>
    </div>
  );
}
