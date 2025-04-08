require("dotenv").config();
const fs = require("fs");
const { getClient } = require("./lib");
const { coin } = require("@cosmjs/stargate");
const { CONTRACT_ADDRESS, USDC_DENOM } = require("./config");

//transfer balance test
async function execTransfer() {
  const to = "neutron1q5qqlqecr8dstm4w7e4k8anhqctjhc6evzqzv2";
  const amount = 5;
  const denom = "untrn";
  const { wallet, signingClient, myAddress } = await getClient(null, null);

  const fee = {
    amount: [coin(1000000, "untrn")],
    gas: "30000000",
  };

  const sent = await signingClient.sendTokens(myAddress, to, [coin(amount * 1_000_000, denom)], fee);
  console.log("Sent", sent);
}

async function execContract() {
  const { wallet, signingClient, myAddress } = await getClient();

  const msg = {
    user_counter: {},
  };

  const funds = [];
  //  const funds = [coin(100 * 1_000_000, USDC_DENOM)];
  const executeResult = await signingClient.execute(myAddress, CONTRACT_ADDRESS, msg, "auto", "", funds);
  console.log(executeResult);
  console.log("Done. Total events: ", executeResult.events.length);
}

async function main() {
  // await execTransfer();
  await execContract();
}

main();

// Usually I just copy/paste and add additional function calls in my main I comment out back and forth.
