
"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    if (isRegister) {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) return alert(error.message);
      alert("Account created. Check email for confirmation if enabled. Now login.");
      setIsRegister(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return alert(error.message);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-6 border rounded space-y-4 w-80 bg-white">
        <h1 className="text-xl font-bold text-center">{isRegister ? "Register" : "Login"}</h1>

        <input className="border p-2 w-full" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="border p-2 w-full" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />

        <button onClick={handleAuth} className="bg-black text-white w-full p-2" disabled={loading}>
          {loading ? "Please wait..." : (isRegister ? "Register" : "Login")}
        </button>

        <button onClick={()=>setIsRegister(!isRegister)} className="text-sm underline w-full">
          {isRegister ? "Go to Login" : "Go to Register"}
        </button>
      </div>
    </div>
  );
}
