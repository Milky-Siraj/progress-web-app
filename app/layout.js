"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AuthProvider from "@/components/AuthProvider";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Conditionally render Sidebar based on the current pathname
  const hideSidebar =
    pathname === "/" || pathname === "/404" || pathname.includes("/not-found");

  return (
    <AuthProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex h-screen">
            {/* Only show the sidebar if not on login or not-found page */}
            {!hideSidebar && <Sidebar />}
            <div
              className={`flex-1 overflow-y-auto ${
                !hideSidebar ? "bg-gray-800" : ""
              } text-white min-h-screen`}
            >
              {children}
            </div>
          </div>
          <ToastContainer />
        </body>
      </html>
    </AuthProvider>
  );
}
