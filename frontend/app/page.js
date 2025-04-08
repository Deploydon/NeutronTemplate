"use client";
import GithubStarButton from "@/components/GithubStarButton";
import { CHAIN_NAME, BASE_DENOM } from "@/config";
import { useChain } from "@cosmos-kit/react";
import { useUserBalance } from "@/hooks";

export default function Home() {
  const { status, address } = useChain(CHAIN_NAME);
  const { value: balance, query: balanceQuery } = useUserBalance(BASE_DENOM, address);
  const ConnectedView = () => {
    return (
      <div>
        <p>Address: {address}</p>
        <p>Balance: {balanceQuery.isLoading ? <span className="animate-pulse">Loading...</span> : <>{balance} NTRN</>}</p>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gray-900 rounded-lg text-gray-400">
      <GithubStarButton />
      <p className="text-gray-400 mb-2">A simple template for getting started with Neutron. Contains the front end and everything needed to connect a wallet and interact with the sample contract.</p>
      <hr />
      Wallet Status: {status}
      <div className="mt-2">{status === "Connected" ? <ConnectedView /> : <div className="flex items-center">Please connect wallet.</div>}</div>
    </div>
  );
}
