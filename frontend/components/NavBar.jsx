"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import WalletButton from "@/components/WalletButton";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import GithubStarButton from "@/components/GithubStarButton";



export default function NavBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSidebarItemClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <nav className="select-none z-40 relative md:top-2 flex items-center justify-between p-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 shadow-lg md:rounded-lg my-0 mb-4 md:max-w-5xl md:mx-auto">
        <div className="flex items-center space-x-2">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white focus:outline-none md:hidden">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          <Link href="/" className="text-2xl font-semibold text-white flex items-center space-x-2 relative">
            <div className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Logo" width={32} height={32} />
              <span>Neutron Template</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4 relative">
          <div className="flex space-x-2 z-50">
            <Link
              href="/help"
              className="hidden md:inline-flex text-white hover:text-yellow-300 transition-colors duration-200 font-bold text-lg px-2 py-2 bg-gray-700 hover:bg-gray-800 rounded-md shadow-md"
            >
              Help
            </Link>
          </div>
          <WalletButton />
        </div>
      </nav>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              ref={sidebarRef}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-64 bg-gray-800 z-50 flex flex-col items-start pt-8 md:hidden"
            >
              <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 text-white">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <motion.h2 initial={{ x: "-100%" }} animate={{ x: 0 }} transition={{ delay: 0.2, type: "spring", stiffness: 120 }} className="text-white text-3xl font-bold mb-4 self-center">
                <Image src="/logo.png" alt="Logo" width={64} height={32} />
              </motion.h2>
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.3 }} className="w-full h-px bg-gray-600 mb-6" />
              <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} transition={{ delay: 0.4, type: "spring", stiffness: 120 }} className="flex flex-col space-y-6 w-full flex-grow">
                <Link href="/" className="text-white text-2xl font-bold pl-8" onClick={handleSidebarItemClick}>
                  Dashboard
                </Link>

                <Link href="/help" className="text-white text-2xl font-bold pl-8" onClick={handleSidebarItemClick}>
                  Help
                </Link>
              </motion.div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
