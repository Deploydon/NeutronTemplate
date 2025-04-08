"use client";
import { useChain } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";
import { CHAIN_NAME, BASE_DENOM } from "@/config";

export function useUserBalance(denom, overrideAddress = null) {
  const { address, getCosmWasmClient } = useChain(CHAIN_NAME);

  const getUserBalance = async () => {
    var useAddress = overrideAddress || address;
    if (!useAddress) return 0;
    try {
      const readClient = await getCosmWasmClient();
      const balance = await readClient.getBalance(useAddress, denom || BASE_DENOM);
      return parseFloat(balance?.amount / 1000000).toFixed(8) || 0;
    } catch (err) {
      console.log("Get balance err:", err);
      return 0;
    }
  };

  const userBalance = useQuery({
    queryKey: ["userBalance", address, denom, overrideAddress],
    queryFn: getUserBalance,
    enabled: !!(address || overrideAddress) && !!denom,
    cacheTime: 60000,
    refetchInterval: 30000,
    staleTime: 25000,
  });
  return { value: userBalance.data, query: userBalance };
}
