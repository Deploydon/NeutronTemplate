"use client";
import GithubStarButton from "@/components/GithubStarButton";
import { CHAIN_NAME, BASE_DENOM } from "@/config";
import { useChain } from "@cosmos-kit/react";
import { useUserBalance, useUser } from "@/hooks";
import DepositCard from "@/components/DepositCard";
import UserCounter from "@/components/UserCounter";
import GlobalCounter from "@/components/UseGlobalCounter";

export default function Home() {
  const { status, address } = useChain(CHAIN_NAME);
  const { value: balance, query: balanceQuery } = useUserBalance(BASE_DENOM, address);
  const { value: user, query: userQuery } = useUser(address);

  const ConnectedView = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300">
              Address: <span className="text-gray-400 font-mono text-sm">{address}</span>
            </p>
            <p className="text-gray-300">
              Balance: {balanceQuery.isLoading ? <span className="animate-pulse">Loading...</span> : <span className="text-green-400 font-semibold">{balance} NTRN</span>}
            </p>
            <p className="text-gray-300">
              Last Contract Interaction:{" "}
              {userQuery.isLoading ? <span className="animate-pulse">Loading...</span> : user?.last_action ? new Date(parseInt(user.last_action) / 1000000).toLocaleString() : "None"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UserCounter />
          <GlobalCounter />
          <DepositCard />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gray-900 rounded-lg text-gray-400">
      <GithubStarButton />
      <p className="text-gray-400 mb-2">A simple template for getting started with Neutron. Contains the front end and everything needed to connect a wallet and interact with the sample contract.</p>
      <hr className="border-gray-700 my-4" />
      <div className="flex items-center mb-4">
        <span className="mr-2">Wallet Status:</span>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${status === "Connected" ? "bg-green-900 text-green-300" : "bg-yellow-900 text-yellow-300"}`}>{status}</span>
      </div>
      <div className="mt-2">
        {status === "Connected" ? (
          <ConnectedView />
        ) : (
          <div className="flex items-center justify-center p-8 bg-gray-800 rounded-lg">
            <p className="text-gray-300">Please connect your wallet to continue.</p>
          </div>
        )}
      </div>
    </div>
  );
}
