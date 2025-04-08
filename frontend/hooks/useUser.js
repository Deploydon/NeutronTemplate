"use client";
import { useChain } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";
import { CHAIN_NAME, CONTRACT } from "@/config";

export function useUser(address) {
  const { getCosmWasmClient } = useChain(CHAIN_NAME);

  const getValue = async () => {
    try {
      const readClient = await getCosmWasmClient();
      var state = await readClient.queryContractSmart(CONTRACT, {
        user: { user: address },
      });
      return state;
    } catch (err) {
      console.log("Get user err:", err);
      return null;
    }
  };

  const query = useQuery({
    queryKey: ["user", address],
    queryFn: getValue,
    enabled: !!address,
    cacheTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 30,
    staleTime: 1000 * 20,
  });
  return { value: query.data, query: query };
}
