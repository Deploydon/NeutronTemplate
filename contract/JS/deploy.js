require("dotenv").config();
const { GasPrice, defaultRegistryTypes, coin } = require("@cosmjs/stargate");
const fs = require("fs");
const { AccessConfig, AccessType } = require("cosmjs-types/cosmwasm/wasm/v1/types");

const { getClient } = require("./lib");

const { WASM_PATH, CONTRACT_ADDRESS } = require("./config");

if (CONTRACT_ADDRESS) {
  console.error("Contract address already set in config file. No need to deploy.");
  console.log("Clear the current contract address in config if you want to redeploy.");
  process.exit(1);
}

async function migrateContract() {
  const { wallet, signingClient, myAddress } = await getClient();
  const wasmByteCode = new Uint8Array(fs.readFileSync(WASM_PATH));

  console.log("Uploading...");

  const instantiatePermission = AccessConfig.fromPartial({
    permission: AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES,
    addresses: [myAddress],
  });

  var uploaded = await signingClient.upload(myAddress, wasmByteCode, "auto", "", instantiatePermission);
  var codeID = uploaded.codeId;
  console.log("Upload successful. New code ID:", uploaded.codeId);

  console.log("Instantiating...");
  var instantiateMsg = {};

  const fee = {
    amount: [coin(300000, "untrn")],
    gas: "30000000",
  };

  var instantiated = await signingClient.instantiate(myAddress, codeID, instantiateMsg, "Neutron Template", fee, {
    admin: myAddress,
  });

  console.log("Instantiated:", instantiated);
  const contractAddr = instantiated.contractAddress;

  console.log("Contract address:", contractAddr);
  console.log("Update config.js with this address.");
}

async function main() {
  await migrateContract();
}

main();
