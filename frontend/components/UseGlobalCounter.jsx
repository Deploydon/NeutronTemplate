"use client";
import { CHAIN_NAME } from "@/config";
import { useChain } from "@cosmos-kit/react";
import { useExec } from "@/hooks/useExec";
import { useGlobal, useConfig } from "@/hooks";
import React from "react";

export default function GlobalCounter() {
  const { address } = useChain(CHAIN_NAME);
  const { value: global, query: globalQuery } = useGlobal();
  const { value: config, query: configQuery } = useConfig();
  const { incrementGlobalCounter, resetGlobalCounter } = useExec();

  const incrementGlobal = () => {
    incrementGlobalCounter.mutate(null, {
      onSuccess: (data) => {
        console.log("Global counter incremented successfully:", data);
        globalQuery.refetch();
      },
    });
  };

  const resetGlobal = () => {
    console.log("Reset global counter");
    resetGlobalCounter.mutate(null, {
      onSuccess: (data) => {
        console.log("Global counter reset successfully:", data);
        globalQuery.refetch();
      },
    });
  };

  const isAdmin = address === config?.admin;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-200 mb-4">Global Counter</h2>
      <div className="flex flex-col items-center">
        <div className="text-5xl font-bold text-purple-400 mb-4">{globalQuery.isLoading ? <span className="animate-pulse">Loading...</span> : global?.counter || 0}</div>
        <div className="text-gray-400 mb-4 text-center text-sm">
          <p className="italic">Anyone can increment this counter</p>
          {global?.last_user && (
            <p className="mt-1">
              Last updated by: <span className="font-mono text-xs">{global.last_user}</span>
            </p>
          )}
          {global?.last_action && <p className="mt-1">Last updated: {new Date(parseInt(global.last_action) / 1000000).toLocaleString()}</p>}
        </div>
        <button
          onClick={incrementGlobal}
          disabled={incrementGlobalCounter.isPending}
          className={`${
            incrementGlobalCounter.isPending ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 hover:scale-105"
          } text-white font-bold py-2 px-6 rounded-full transition duration-200 ease-in-out transform mb-3`}
        >
          {incrementGlobalCounter.isPending ? "Pending..." : "Increment Global Counter"}
        </button>
        <button
          onClick={resetGlobal}
          disabled={!isAdmin || resetGlobalCounter.isPending}
          className={`${
            !isAdmin ? "bg-gray-500 cursor-not-allowed" : resetGlobalCounter.isPending ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 hover:scale-105"
          } text-white text-xs py-2 px-3 rounded-full transition duration-200 ease-in-out transform`}
        >
          {resetGlobalCounter.isPending ? "Resetting..." : "Reset Global Counter"}
        </button>
        {!isAdmin && <p className="text-gray-400 mt-2 text-center text-xs italic">Only the contract admin can reset the counter</p>}
      </div>
    </div>
  );
}
