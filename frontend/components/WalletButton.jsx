"use client";
import { useChain } from "@cosmos-kit/react";
import { useState, useEffect, useContext } from "react";
import { CHAIN_NAME } from "@/config";
export default function WalletButton({}) {
  const { connect, openView, status, username, wallet } = useChain(CHAIN_NAME);

  const handleClick = (e) => {
    e.preventDefault();
    if (status === "Connected") {
      openView();
    } else {
      connect();
    }
  };

  const buttonText = status === "Connected" ? username : "Connect Wallet";

  return (
    <div className="flex items-center justify-center bg-green-800 text-white rounded-lg shadow-md space-x-2">
      {status === "Connected" ? (
        <>
          <span className="p-2 text-sm font-semibold">{username}</span>
          <button
            onClick={handleClick}
            className="p-1 hover:bg-gray-700 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
              />
            </svg>
          </button>
        </>
      ) : (
        <button
          onClick={handleClick}
          className="w-full max-w-[13rem] md:max-w-[16rem] bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
        >
          {status === "Connecting" ? (
            <span className="animate-pulse">Connecting...</span>
          ) : (
            <span>{buttonText}</span>
          )}
        </button>
      )}
    </div>
  );
}
