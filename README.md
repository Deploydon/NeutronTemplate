# Neutron Template

(Readme in progress)

This repo aims to be a base starting point for building NextJS apps that interact with Neutron.

View it live here: [https://NeutronTemplate.Deploydon.com](https://NeutronTemplate.Deploydon.com)


What it includes:
- NextJS 15 with Tailwind.
- [CosmosKit](https://github.com/cosmology-tech/cosmos-kit) - For wallet connecting. Defaults to enabling Keplr/Leap with placeholders for enabling mobile after getting a [Reown/WalletConnect](https://cloud.reown.com/) Project Key 
- [Tanstack](https://github.com/TanStack/query) - For hooks to make caching and fetching chain data much easier


Frontend Features:
- Connecting wallet
- Hooks to fetch users wallet balance of varying assets
 

Running the front end:

```
cd frontend
npm install
npm run dev
```


The contract folder has a very simple contract with some basic functions. (Deposit/Withdraw $NTRN by saving users deposit state, incrementing/getting a number, querying another address balance, etc.)


Compiling:
(Ensure you are setup for this, read another tutorial. May expand on this later)
```
cd contract
./buildprod.sh
```


The contract has a JS folder which is from the [LocalTesting](https://github.com/Deploydon/LocalTesting/) package. It is pre-configured to interact with this contract. It is currently configured for the Neutron Pion-1 Testnet. Create and fund a new seed phrase and update the env. The example env has a pre-loaded seedphrase for CosmoPark. If you want to test locally, refer to the Neutron Cosmopark docs: [https://docs.neutron.org/1.0/neutron/build-and-run/cosmopark/](https://docs.neutron.org/1.0/neutron/build-and-run/cosmopark/)


```
node deploy.js
node migrate.js
node exec.js
node query.js
```


Pion-1 Contract Address:
```
neutron1n9xk0jk2pznv085yevpg778kxqeq3scm6yhy332jk9cmteqlv0as5gl6p8
```

[View On Celatone](https://neutron.celat.one/pion-1/contracts/neutron1n9xk0jk2pznv085yevpg778kxqeq3scm6yhy332jk9cmteqlv0as5gl6p8)