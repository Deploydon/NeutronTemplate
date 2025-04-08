require("dotenv").config();
const { GasPrice, defaultRegistryTypes } = require("@cosmjs/stargate");
const { DirectSecp256k1HdWallet, Registry } = require("@cosmjs/proto-signing");
const { MsgExecuteContract, MsgStoreCode, MsgMigrateContract, MsgInstantiateContract } = require("cosmjs-types/cosmwasm/wasm/v1/tx");
const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
const { FORCE_ADDRESS, RPC } = require("./config");
const seed = process.env.seed;

const myRegistry = new Registry([
  ...defaultRegistryTypes,
  ["/cosmwasm.wasm.v1.MsgExecuteContract", MsgExecuteContract],
  ["/cosmwasm.wasm.v1.MsgStoreCode", MsgStoreCode],
  ["/cosmwasm.wasm.v1.MsgMigrateContract", MsgMigrateContract],
  ["/cosmwasm.wasm.v1.MsgInstantiateContract", MsgInstantiateContract],
]);

async function instrumentWallet(wallet, accounts) {
  const currentAccounts = await wallet.getAccounts();
  const accWPrivKeys = await wallet.getAccountsWithPrivkeys();
  wallet.getAccounts = async () => {
    const acc = currentAccounts[0];
    return [
      ...currentAccounts,
      ...accounts.map((a) => ({
        ...acc,
        address: a,
      })),
    ];
  };
  wallet.getAccountsWithPrivkeys = async () => {
    const acc = accWPrivKeys[0];
    return [
      ...accWPrivKeys,
      ...accounts.map((a) => ({
        ...acc,
        address: a,
      })),
    ];
  };
}

async function getClient(seedOverride = null, senderAddress = null) {
  var useSeed = seedOverride || seed;
  var myAddress = null;
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(useSeed, {
    prefix: "neutron",
  });

  if (FORCE_ADDRESS) {
    senderAddress = FORCE_ADDRESS;
  }

  if (senderAddress) {
    await instrumentWallet(wallet, [senderAddress]);
    myAddress = senderAddress;
  } else {
    const [{ address }] = await wallet.getAccounts();
    myAddress = address;
  }

  console.log("My address:", myAddress);
  const gasPrice = GasPrice.fromString("0.05untrn");
  const options = { gasPrice, registry: myRegistry };

  const signingClient = await SigningCosmWasmClient.connectWithSigner(RPC, wallet, options);
  return { wallet, signingClient, myAddress };
}
module.exports = {
  getClient,
};
