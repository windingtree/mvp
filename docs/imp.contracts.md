# The WindingTree Market Protocol Smart Contracts

You can find the smart contract code and utilities in the official contracts repository: https://github.com/windingtree/contracts.

Below are some helpful notes and guidelines for setting up, configuring, and deploying the contracts. All contracts are developed with the latest stable version of the Solidity language and can be deployed on any EVM-compatible blockchain networks.

## Setup

```bash
git clone git@github.com:windingtree/contracts.git ./wt-contracts
cd ./wt-contracts
pnpm install
pnpm build
```

## Environment Configuration

Below is an example `.env` file for an MVP-related deployment.

```ini
# Network-specific node URI: "ETH_NODE_URI_" + networkName.toUpperCase()
ETH_NODE_URI_CHIADO=https://rpc.chiadochain.net

# Network-specific mnemonic: "MNEMONIC_" + networkName.toUpperCase()
MNEMONIC_CHIADO="<contract owner account mnemonic>"

# CoinMarketCap API key for gas reports (optional)
COINMARKETCAP_API_KEY=""

# Etherscan API key
ETHERSCAN_API_KEY=abc
```

## Hardhat Configuration

You can find the Hardhat framework configuration file at the root of the repository folder, named `./hardhat.config.ts`. Most options can remain default, but pay special attention to the network configuration. Adapt the following example for your needs if you plan to deploy on a network other than `chiado`.

```json
chiado: { // Network name
  url: "https://rpc.chiadochain.net", // Use an RPC from Alchemy, Infura, or another provider
  gasPrice: 1000000000, // Set the gas price value that's current for your network
  accounts: accounts("chiado"), // Assumes you have defined MNEMONIC_CHIADO in your environment
  verify: {
    etherscan: {
      apiUrl: "https://blockscout.com/gnosis/chiado", // Blockchain explorer API URL for your network
    },
  },
},
```

## Deployment Configuration

To deploy smart contracts on a network other than `chiado`, while using the default configuration, simply add the name of your network to the file `./deploy/002.ts` at line 56:

```typescript
if (!['chiado', '<add your network name here>'].includes(network.name)) {
  return;
}
```

> If you're deploying to the Mainnet, you may want to disable lines related to the deployment of test tokens, including the test LIF token. Alternatively, add instructions for deploying your custom tokens.

## Deployment

Execute the following command from the root of the repository:

> Ensure the wallet account specified in `.env` via `MNEMONIC_CHIADO` has sufficient funds for transactions.

```bash
pnpm hardhat --network chiado deploy
```

After deployment, a `./deployments/chiado/*` directory will be created in the root repository folder. Preserve this directory for future contract upgrades.

Deployments and upgrades are managed by the `hardhat-deploy` plugin. Learn more about its functionality here: https://github.com/wighawag/hardhat-deploy.

## Contracts Verification

It's recommended to verify contracts using the Sourcify service. Learn more about this verification method here: https://docs.sourcify.dev/docs/how-to-verify/#hardhat. Hardhat integrates Sourcify verification, so simply run:

```bash
pnpm hardhat --network chiado sourcify
```

After verification, you can check the status on the blockchain explorer. For example, here's a verified Market contract on the official Gnosis Chiado blockchain explorer: https://gnosis-chiado.blockscout.com/address/0xF54784206A53EF19fd3024D8cdc7A6251A4A0d67?tab=read_proxy

## Upgrades

> Ensure you've retained the `./deployments/chiado/*` directory created during the initial contract deployment.

To deploy changes to a contract, use the same command as for the initial deployment, and verify the contract with Sourcify as before.

## Preparing for MVP Usage

### Chiado Testnet and Native Tokens

Find official Chiado Testnet documentation [here](https://docs.gnosischain.com/concepts/networks/chiado). To add this testnet to your Metamask wallet, go to the Chiado Testnet documentation, click on the "Add to Metamask" link, and confirm in your Metamask wallet.

You'll need some test **xDAI** for transactions on Chiado. Obtain these tokens from the [official Gnosis Chiado faucet](https://faucet.chiadochain.net) by entering your wallet address, selecting xDAI, and completing the captcha. You'll receive 1 xDAI shortly.

### Test Stablecoins

For transactions in the MVP, we utilize ERC-20-compatible tokens. The list of these tokens is available in [our smart contracts repository](https://github.com/windingtree/contracts#testing-tokens-1).

To mint a token, navigate to the Chiado Blockchain explorer using links from the token list and interact with the smart contract. Here's a quick guide for **STABLE6** token:

- Visit the proxy tab: https://gnosis-chiado.blockscout.com/address/0xcC28A4e6DEF318A1b88CF34c4F2Eeb2489995513?tab=write_proxy
- Find the `mint` function (item 7)
- Enter your wallet address in the `to` field and the amount in WEI in the `amount` field (use an Ethereum Unit Converter for the correct WEI value)
- Click `write` and confirm the transaction in Metamask.

After the transaction, the tokens will appear in your wallet. It's advisable to mint both **STABLE6** and **STABLE18** tokens for comprehensive testing.
