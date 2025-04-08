# Neutron Template

(Readme Pending)


This repo aims to be a base starting point for building NextJS apps that interact with Neutron. It is essentially what I use for everything I build, generally copying the base structure between projects. It has evolved/improved over time. I finally took the time to mash together the core into a shareable repo. 

View it live here: [https://NeutronTemplate.Deploydon.com](https://NeutronTemplate.Deploydon.com)


What it includes:
- NextJS 15 with Tailwind.
- [CosmosKit](https://github.com/cosmology-tech/cosmos-kit) - For wallet connecting. Defaults to enabling Keplr/Leap with placeholders for enabling mobile after getting a [Reown/WalletConnect](https://cloud.reown.com/) Project Key 
- [Tanstack](https://github.com/TanStack/query) - For hooks to make caching and fetching chain data much easier
- Complete Cosmwasm contract you can build/deploy on your own for the frontend to interact with.


The sample contract has a few execute/query functions:
- Users can increment a value stored in their state
- Users can deposit / withdraw NTRN. Stored in their state
- Users can increment a global counter
- Only the admin can reset the global counter



Frontend Features:
- Connecting wallet
- Hooks to fetch users wallet balance, contract states, etc
- Full UI for incrementing users value, global value and depositing/withdrawing.

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