"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [dept, setDept] = useState("");

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/login");
    };
    check();
  },);

  const addCategory = async () => {
    await supabase.from("categories").insert({ name });
    setName("");
  };

  const addDepartment = async () => {
    await supabase.from("departments").insert({ name: dept });
    setDept("");
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-xl font-bold">Admin Panel</h1>

      <div>
        <input className="border p-2" placeholder="Category"
          value={name} onChange={e=>setName(e.target.value)} />
        <button className="bg-black text-white p-2 ml-2" onClick={addCategory}>
          Add Category
        </button>
      </div>

      <div>
        <input className="border p-2" placeholder="Department"
          value={dept} onChange={e=>setDept(e.target.value)} />
        <button className="bg-black text-white p-2 ml-2" onClick={addDepartment}>
          Add Department
        </button>
      </div>
    </div>
  );
}
