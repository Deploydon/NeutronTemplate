"use client";

import { useChain } from "@cosmos-kit/react";
import { useMutation } from "@tanstack/react-query";
import { CHAIN_NAME, CONTRACT, BASE_DENOM, GAS_PRICE } from "@/config";
const { toUtf8 } = require("@cosmjs/encoding");
import { GasPrice } from "@cosmjs/stargate";
import toast from "react-hot-toast";
export function useExec() {
  const { address, getCosmWasmClient, getSigningCosmWasmClient } = useChain(CHAIN_NAME);

  const getClient = async () => {
    const signingClient = await getSigningCosmWasmClient();
    signingClient.gasPrice = GasPrice.fromString(`${GAS_PRICE}${BASE_DENOM}`);
    return signingClient;
  };

  const execute = async (msg, funds = []) => {
    const executeMsg = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender: address,
        contract: CONTRACT,
        msg: toUtf8(JSON.stringify(msg)),
        funds: funds,
      },
    };
    const signingClient = await getClient();
    return signingClient.signAndBroadcast(address, [executeMsg], "auto");
  };

  const incrementUserCounter = useMutation({
    mutationKey: ["incrementUserCounter", address],
    mutationFn: async () => {
      const msg = {
        user_counter: {},
      };

      return toast.promise(execute(msg), {
        loading: "Incrementing counter...",
        success: "Counter incremented successfully",
        error: "Failed to increment counter",
      });
    },
    onSuccess: (result) => {
      console.log("Increment Success:", result);
      return true;
    },
    onError: (error) => {
      console.error("Increment Error:", error);
    },
  });

  const incrementGlobalCounter = useMutation({
    mutationKey: ["incrementGlobalCounter", address],
    mutationFn: async () => {
      const msg = {
        global_counter: {},
      };

      return toast.promise(execute(msg), {
        loading: "Incrementing counter...",
        success: "Counter incremented successfully",
        error: "Failed to increment counter",
      });
    },
    onSuccess: (result) => {
      console.log("Increment Success:", result);
      return true;
    },
    onError: (error) => {
      console.error("Increment Error:", error);
    },
  });

  const resetGlobalCounter = useMutation({
    mutationKey: ["resetGlobalCounter", address],
    mutationFn: async () => {
      const msg = {
        reset_global: {},
      };

      return toast.promise(execute(msg), {
        loading: "Resetting counter...",
        success: "Counter reset successfully",
        error: "Failed to reset counter",
      });
    },
    onSuccess: (result) => {
      console.log("Reset Success:", result);
      return true;
    },
    onError: (error) => {
      console.error("Reset Error:", error);
    },
  });

  const deposit = useMutation({
    mutationKey: ["deposit", address],
    mutationFn: async ({ amount }) => {
      const msg = {
        deposit: {},
      };

      const funds = [
        {
          denom: BASE_DENOM,
          amount: Math.floor(amount * 1_000_000).toString(),
        },
      ];

      return toast.promise(execute(msg, funds), {
        loading: "Depositing...",
        success: "Deposit successful",
        error: "Failed to deposit",
      });
    },
    onSuccess: (result) => {},
    onError: (error) => {
      console.error("Deposit Error:", error);
    },
  });

  const withdraw = useMutation({
    mutationKey: ["withdraw", address],
    mutationFn: async ({ amount }) => {
      const msg = {
        withdraw: {
          amount: Math.floor(amount * 1_000_000).toString(),
        },
      };

      return toast.promise(execute(msg), {
        loading: "Withdrawing...",
        success: "Withdrawal successful",
        error: "Failed to withdraw",
      });
    },
    onSuccess: (result) => {},
    onError: (error) => {
      console.error("Withdraw Error:", error);
    },
  });

  return {
    incrementUserCounter,
    incrementGlobalCounter,
    resetGlobalCounter,
    deposit,
    withdraw,
  };
}
