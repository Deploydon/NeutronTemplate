"use client";
import { useChain } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";
import { CHAIN_NAME, CONTRACT } from "@/config";

export function useGlobal() {
  const { getCosmWasmClient } = useChain(CHAIN_NAME);

  const getValue = async () => {
    try {
      const readClient = await getCosmWasmClient();
      var state = await readClient.queryContractSmart(CONTRACT, {
        global: {},
      });
      return state;
    } catch (err) {
      console.log("Get global err:", err);
      return null;
    }
  };

  const query = useQuery({
    queryKey: ["global"],
    queryFn: getValue,
    enabled: true,
    cacheTime: 1000 * 60 * 5,    
    refetchInterval: 180_000,  
    staleTime: 160_000,        
  });
  return { value: query.data, query: query };
}
