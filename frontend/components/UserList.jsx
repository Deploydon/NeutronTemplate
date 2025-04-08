"use client";
import { CHAIN_NAME } from "@/config";
import { useChain } from "@cosmos-kit/react";

import { useAllUsers } from "@/hooks";
import React from "react";

export default function UserList() {
  const { address } = useChain(CHAIN_NAME);
  const { value: users, query: usersQuery } = useAllUsers();

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(parseInt(timestamp) / 1000000).toLocaleString();
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-200 mb-4">User List</h2>
      {usersQuery.isLoading ? (
        <div className="text-center py-4">
          <p className="text-gray-400 animate-pulse">Loading users...</p>
        </div>
      ) : !users || users.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-400">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Address</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Counter</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Deposits</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map(([userAddress, userData], index) => (
                <tr key={index} className={userAddress === address ? "bg-gray-700/50" : ""}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-300">
                    <span className="font-mono">{userAddress}</span>
                    {userAddress === address && <span className="ml-2 text-xs text-green-400">(You)</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{userData.counter}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {userData.deposits ? (parseInt(userData.deposits) / 1000000).toFixed(2) : "0"} NTRN
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{formatDate(userData.last_action)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
