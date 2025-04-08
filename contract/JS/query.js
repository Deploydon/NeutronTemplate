require("dotenv").config();

const { getClient } = require("./lib");
const { CONTRACT_ADDRESS } = require("./config");

async function query() {
  const { wallet, signingClient: client, myAddress } = await getClient();

  console.log("My address:", myAddress);
  const result = await client.queryContractSmart(CONTRACT_ADDRESS, {
    user: {
      user: myAddress,
    },
  });
  console.log("Result:", JSON.stringify(result, null, 2));

  const globalResult = await client.queryContractSmart(CONTRACT_ADDRESS, {
    global: {},
  });
  console.log("Global Result:", JSON.stringify(globalResult, null, 2));

  const configResult = await client.queryContractSmart(CONTRACT_ADDRESS, {
    config: {},
  });
  console.log("Config Result:", JSON.stringify(configResult, null, 2));
}

async function main() {
  await query();
}

main();
