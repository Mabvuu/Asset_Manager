"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import NavBar from "../components/NavBar";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideNav = pathname === "/login" || pathname === "/register";

  return (
    <html lang="en">
      <body>
        {!hideNav && <NavBar />}
        {children}
      </body>
    </html>
  );
}
