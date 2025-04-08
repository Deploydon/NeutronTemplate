"use client";

//Handles the query and chain provider

import { ChainProvider } from "@cosmos-kit/react";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { chains, assets } from "chain-registry";
import { GasPrice } from "@cosmjs/stargate";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { CHAIN_NAME, RPC, WALLET_CONNECT_ID, META } from "@/config";
const selectedChain = chains.find((chain) => chain.chain_name === CHAIN_NAME);

import "@interchain-ui/react/styles";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      cacheTime: 1000 * 60 * 60 * 1,
      staleTime: 1000 * 60 * 60 * 0.5,
    },
  },
});

export default function Providers({ children }) {
  const signerOptions = {
    signingCosmwasm: (chain) => {
      switch (chain.chain_name) {
        case "neutron":
          return {
            gasPrice: GasPrice.fromString("0.05untrn"),
          };
      }
    },
    preferredSignType: (chain) => {
      return "protobuf";
    },
  };

  var wallets = [keplrWallets[0], leapWallets[0]];
  var walletConnectOptions = null;

  if (WALLET_CONNECT_ID && WALLET_CONNECT_ID !== "") {
    //Only adding mobile wallets if wallet conenct id is set so we dont errror
    wallets.push(keplrWallets[1]);
    wallets.push(leapWallets[1]);
    walletConnectOptions = {
      signClient: {
        projectId: WALLET_CONNECT_ID,
        relayUrl: "wss://relay.walletconnect.org",
        metadata: {
          name: META.title,
          description: META.description,
          url: META.url,
          icons: [META.logo],
        },
      },
    };
  }

  return (
    <ChainProvider
      chains={[selectedChain]}
      assetLists={assets}
      wallets={wallets}
      signerOptions={signerOptions}
      walletConnectOptions={walletConnectOptions}
      endpointOptions={{
        endpoints: {
          neutron: {
            rpc: [RPC],
          },
        },
      }}
      allowedIframeParentOrigins={["https://daodao.zone"]}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ChainProvider>
  );
}
