"use client";
import { CHAIN_NAME } from "@/config";
import { useChain } from "@cosmos-kit/react";
import { useExec } from "@/hooks/useExec";
import { useUser } from "@/hooks";
import React from "react";

export default function UserCounter() {
  const { address } = useChain(CHAIN_NAME);
  const { value: user, query: userQuery } = useUser(address);
  const { incrementUserCounter } = useExec();

  const increment = () => {
    incrementUserCounter.mutate(null, {
      onSuccess: (data) => {
        console.log("Counter incremented successfully:", data);
        userQuery.refetch();
      },
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-200 mb-4">User Counter</h2>
      <div className="flex flex-col items-center">
        <div className="text-5xl font-bold text-blue-400 mb-4">{userQuery.isLoading ? <span className="animate-pulse">Loading...</span> : user?.counter || 0}</div>
        <p className="text-gray-400 mb-4 text-center text-sm italic">Only you can increment your own counter</p>
        <button
          onClick={increment}
          disabled={incrementUserCounter.isPending}
          className={`${
            incrementUserCounter.isPending ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
          } text-white font-bold py-2 px-6 rounded-full transition duration-200 ease-in-out transform`}
        >
          {incrementUserCounter.isPending ? "Pending..." : "Increment Counter"}
        </button>
      </div>
    </div>
  );
}
