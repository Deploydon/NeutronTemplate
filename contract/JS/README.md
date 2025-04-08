# Neutron Local Testing

Part of the Local Testing package.

See more here: https://github.com/Deploydon/LocalTesting/

----

Just a mini nodejs setup to easily make code to test specific contract features. 

Below are some random notes / instructions

This already assumes you are running Cosmospark locally with an rpc on port. If not, change it in config.js

The .env.example already contains the seed of a pre-funded Cosmospark address. Just rename it to .env. 


I typically drop this folder within my Contract folder. It defaults to grabing your wasm file from ../artifacts/contract.wasm. Update in config accordingly.

## Install Packages
```
npm install
cp .env.example .env
```

## Update Config
config.js looks like below:
```
module.exports = {
  RPC: "http://localhost:26657"
  USDC_DENOM: "ibc/B559A80D62249C8AA07A380E2A2BEA6E5CA9A6F079C912C3A9E9B494105E4F81",
  WASM_PATH: "../artifacts/contract.wasm",
  CONTRACT_ADDRESS: "", 
  FORCE_ADDRESS: null
};
 
 ```
The RPC is pre-configured to the local cosmospark address. 
WASM_PATH is your contract for deploying/migrating. If you are only using this for querying/executing an existing contract you can just leave it blank. 

CONTRACT_ADDRESS: Set the contract address. This will be output after you deploy

FORCE_ADDRESS: If your neutron binary has signature checking off, you can specify any address here to mimic. Your execs will originate from this users address.


## Deploy

```
node deploy.js
```

Will grab your wasm from the path specified in config, deploy and output the contract address. Update your config.js with this

## Migrate

```
node migrate.js
```

This will migrate your current configured contract with the wasm.

## Execute

exec.js just has two placeholder functions. One to transfer, and one to interact with a contract. Just update accordingly and uncomment the one to run. Absolute mess I know. Should just have cli args. 

```
node exec.js
```

## Query

The query.js file is structured similar to exec. Just add the contract query params and run

```
node query.js
```




