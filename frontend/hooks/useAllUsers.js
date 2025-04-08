"use client";
import { useChain } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";
import { CHAIN_NAME, CONTRACT } from "@/config";


export function useAllUsers() {
  const { getCosmWasmClient } = useChain(CHAIN_NAME);

  const getValue = async () => {
    try {
      const readClient = await getCosmWasmClient();
      var state = await readClient.queryContractSmart(CONTRACT, {
        all_users: {limit: 200},
      });
      return state;
    } catch (err) {
      console.log("Get all users err:", err);
      return null;
    }
  };

  const query = useQuery({
    queryKey: ["allusers"],
    queryFn: getValue,
    enabled: true,
    cacheTime: 1000 * 60 * 5,    
    refetchInterval: 1000 * 30,  
    staleTime: 1000 * 20,        
  });
  return { value: query.data, query: query };
}
