"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MoreVertical, ChevronFirst, ChevronLast, Menu } from "lucide-react";

const links = [
  { href: "/assets", text: "Assets" },
  { href: "/dashboard", text: "Dashboard" },
  { href: "/mint", text: "Mint" },
  
];

export default function NavBar() {
  // expanded controls width on md+; mobile has its own slide panel
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // apply CSS variable to :root so layout main can use it
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--sidebar-width", expanded ? "16rem" : "5rem"); // 64 / 20 in tailwind rem units
    // optional: persist user preference
    try {
      localStorage.setItem("sidebar-expanded", expanded ? "1" : "0");
    } catch {}
  }, [expanded]);

  // restore from localStorage on mount
  useEffect(() => {
    try {
      const val = localStorage.getItem("sidebar-expanded");
      if (val !== null) setExpanded(val === "1");
    } catch {}
  }, []);

  return (
    <>
      {/* DESKTOP SIDEBAR (fixed) */}
      <aside
        className={`hidden md:flex fixed left-0 top-0 z-40 flex-col h-screen border-r bg-white shadow-lg transition-all duration-200 overflow-hidden`}
        style={{ width: expanded ? "16rem" : "5rem" }}
      >
        {/* Brand + toggle */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg grid place-items-center text-white font-bold"
              style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }}
            >
              A
            </div>
            <div className={`overflow-hidden transition-all ${expanded ? "w-auto" : "w-0"}`}>
              <div className="text-lg font-semibold">AssetMVP</div>
              <div className="text-xs text-slate-400">NFT-ready</div>
            </div>
          </div>

          <button
            aria-label="toggle sidebar"
            onClick={() => setExpanded((s) => !s)}
            className="p-2 rounded-md bg-slate-50 hover:bg-slate-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-auto px-2">
          <ul className="flex flex-col gap-1 mt-2">
            {links.map((l) => (
              <li key={l.href} className="group">
                <Link
                  href={l.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-indigo-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-md grid place-items-center bg-slate-100 text-sm font-medium text-slate-700">
                    {l.text[0]}
                  </div>

                  <span
                    className={`overflow-hidden transition-all ${expanded ? "ml-3 w-auto" : "w-0"}`}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {l.text}
                  </span>

                  {/* example alert dot */}
                  {/* <span className={`ml-auto ${expanded ? "" : "hidden"}`} /> */}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer / user */}
        <div className="border-t px-3 py-3 flex items-center gap-3">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div className={`overflow-hidden transition-all ${expanded ? "w-auto" : "w-0"}`}>
            <div className="text-sm font-semibold">John Doe</div>
            <div className="text-xs text-slate-400">johndoe@gmail.com</div>
          </div>
          <div className="ml-auto">
            <MoreVertical />
          </div>
        </div>
      </aside>

      {/* MOBILE — FAB + slide-over */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-14 h-14 rounded-full shadow-xl bg-white grid place-items-center"
          aria-label="open menu"
        >
          <Menu />
        </button>
      </div>

      <div className={`fixed inset-0 z-50 md:hidden ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg grid place-items-center text-white font-bold"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }}
                >
                  A
                </div>
                <div>
                  <div className="font-bold text-lg">AssetMVP</div>
                  <div className="text-xs text-slate-400">NFT-ready</div>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full">
                ✕
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block px-3 py-3 rounded-md hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md grid place-items-center bg-slate-100 text-sm font-medium">{l.text[0]}</div>
                    <span>{l.text}</span>
                  </div>
                </Link>
              ))}
            </nav>

            <div className="mt-6 border-t pt-4">
              <Link href="/login" onClick={() => setMobileOpen(false)} className="inline-block mt-2 px-3 py-2 rounded-full bg-indigo-600 text-white text-sm">
                Login
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
