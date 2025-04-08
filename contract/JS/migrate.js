require("dotenv").config();
const fs = require("fs");
const { AccessConfig, AccessType } = require("cosmjs-types/cosmwasm/wasm/v1/types");
const { getClient } = require("./lib");

const { WASM_PATH, CONTRACT_ADDRESS } = require("./config");

async function migrateContract() {
  const { wallet, signingClient, myAddress } = await getClient();

  const wasmByteCode = new Uint8Array(fs.readFileSync(WASM_PATH));

  if (!CONTRACT_ADDRESS) {
    console.error("Contract address not set in config.js. No contract to migrate.");
    process.exit(1);
  }

  console.log("Uploading and migrating Contract:", CONTRACT_ADDRESS);

  const instantiatePermission = AccessConfig.fromPartial({
    permission: AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES,
    addresses: [myAddress],
  });

  var uploaded = await signingClient.upload(myAddress, wasmByteCode, "auto", "", instantiatePermission);
  console.log("Upload successful. New code ID:", uploaded.codeId);

  const migrateMsg = {};
  await signingClient.migrate(myAddress, CONTRACT_ADDRESS, uploaded.codeId, migrateMsg, "auto");
  console.log("Migration successful");
}

async function main() {
  await migrateContract();
}

main();
