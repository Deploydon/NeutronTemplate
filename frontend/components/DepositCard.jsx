"use client";
import { CHAIN_NAME, BASE_DENOM } from "@/config";
import { useChain } from "@cosmos-kit/react";
import { useState } from "react";
import { useExec } from "@/hooks/useExec";
import { useUserBalance, useUser } from "@/hooks";
import React from "react";
import Image from "next/image";

export default function DepositCard() {
  const { address } = useChain(CHAIN_NAME);
  const [amount, setAmount] = useState("1");
  const [activeTab, setActiveTab] = useState("deposit");
  const { value: balance, query: balanceQuery } = useUserBalance(BASE_DENOM, address);
  const { value: user, query: userQuery } = useUser(address);

  const { deposit, withdraw } = useExec();

  const handleDeposit = () => {
    deposit.mutate(
      { amount: parseFloat(amount) },
      {
        onSuccess: () => {
          balanceQuery.refetch();
          userQuery.refetch();
        },
      }
    );
  };

  const handleWithdraw = () => {
    withdraw.mutate(
      { amount: parseFloat(amount) },
      {
        onSuccess: () => {
          balanceQuery.refetch();
          userQuery.refetch();
        },
      }
    );
  };

  const isDepositDisabled = parseFloat(amount) > parseFloat(balance || 0);
  const isWithdrawDisabled = !user?.deposits || parseFloat(amount) > parseFloat(user?.deposits / 1_000_000 || 0);

  const formattedDeposits = user?.deposits ? user.deposits / 1_000_000 : 0;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-200 mb-4">Manage Deposits</h2>

      <div className="flex mb-4 border-b border-gray-700">
        <button
          className={`py-2 px-4 font-medium ${activeTab === "deposit" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-300"}`}
          onClick={() => setActiveTab("deposit")}
        >
          Deposit
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === "withdraw" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-300"}`}
          onClick={() => setActiveTab("withdraw")}
        >
          Withdraw
        </button>
      </div>

      {activeTab === "deposit" ? (
        <div>
          <div className="mb-4">
            <p className="text-gray-300 mb-2">
              Your Balance:
              <span className="ml-2 text-green-400 font-semibold">{balanceQuery.isLoading ? <span className="animate-pulse">Loading...</span> : `${balance || 0} NTRN`}</span>
            </p>
            <p className="text-gray-300 mb-2">
              Your Deposits:
              <span className="ml-2 text-yellow-400 font-semibold">{userQuery.isLoading ? <span className="animate-pulse">Loading...</span> : `${formattedDeposits} NTRN`}</span>
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="relative flex items-center">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="flex-grow bg-gray-700 text-white pl-10 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <div className="absolute left-2 top-0.5 h-full flex items-center">
                <Image src="/icons/NTRN.svg" width={24} height={24} alt="NTRN" />
              </div>
            </div>
            <button
              onClick={handleDeposit}
              disabled={isDepositDisabled || deposit.isPending}
              className={`${
                isDepositDisabled || deposit.isPending ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              } text-white font-bold py-2 px-4 rounded transition duration-200`}
            >
              {deposit.isPending ? "Depositing..." : "Deposit"}
            </button>
            {isDepositDisabled && <p className="text-red-400 text-sm">Insufficient balance for this deposit</p>}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <p className="text-gray-300 mb-2">
              Your Deposits:
              <span className="ml-2 text-yellow-400 font-semibold">{userQuery.isLoading ? <span className="animate-pulse">Loading...</span> : `${formattedDeposits} NTRN`}</span>
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="relative flex items-center">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="flex-grow bg-gray-700 text-white pl-10 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <div className="absolute left-2 top-0.5 h-full flex items-center">
                <Image src="/icons/NTRN.svg" width={24} height={24} alt="NTRN" />
              </div>
            </div>
            <button
              onClick={handleWithdraw}
              disabled={isWithdrawDisabled || withdraw.isPending}
              className={`${
                isWithdrawDisabled || withdraw.isPending ? "bg-gray-600 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
              } text-white font-bold py-2 px-4 rounded transition duration-200`}
            >
              {withdraw.isPending ? "Withdrawing..." : "Withdraw"}
            </button>
            {parseFloat(formattedDeposits) === 0 && <p className="text-red-400 text-sm">You have no deposits to withdraw</p>}
            {parseFloat(formattedDeposits) > 0 && isWithdrawDisabled && <p className="text-red-400 text-sm">Withdrawal amount exceeds your deposits</p>}
          </div>
        </div>
      )}
    </div>
  );
}
