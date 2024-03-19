# WindingTree Market Protocol MVP

This project is an MVP based on the WindingTree Market Protocol, aimed at demonstrating the potential of creating decentralized market solutions.

## Tech Stack

- **Smart Contracts**: Solidity
- **Frontend**: TypeScript, React, @windingtree/sdk
- **Backend**: TypeScript, Node.js, tRPC.js, LevelDB, @windingtree/sdk
- **Blockchain**: Ethereum

## Documentation

Additional documentation can be found in the `/docs` directory.

## Repository Setup

First, you need to clone the MVP repository to your local machine or development environment. Open your terminal, and execute the following command:

```bash
git clone git@github.com:windingtree/mvp.git ./<your-project-directory>
cd <your-project-directory>
```

Replace `<your-project-directory>` with the name of your project directory.

## Installing Dependencies

The project uses `pnpm` for managing dependencies. Install all required dependencies by running:

```bash
pnpm install
```

Ensure you have `pnpm` installed; if not, follow the installation instructions on the official pnpm website.

## Configuring the Local Environment

Copy the example environment files to a new `.env` files, which you'll need to configure according to your setup:

```bash
cp ./packages/server/.env.example ./packages/server/.env
cp ./packages/node/.env.example ./packages/node/.env
cp ./packages/dapp-client/.env.example ./packages/dapp-client/.env
cp ./packages/dapp-supplier/.env.example ./packages/dapp-supplier/.env
```

### Server Configuration

```ini
SERVER_PORT=33333
SERVER_ID=""
SERVER_PR_KEY=""
SERVER_PB_KEY=""
```

Keys generation can be started by the following command:

```bash
pnpm gen:key
```

As result you will get something like this:

```ini
SERVER_ID="QmXH7wT21maJx9TrAk3neP45CeD3X5E8QnPLUH6AEYFxRt"
SERVER_PR_KEY="CAISIQKx/mfSakZuFh2x9YJh276O5gI+SX8FLvMH3uC4jRvkkQ=="
SERVER_PB_KEY="CAISIJCpUNDUly32nN2HFDeYNFsqRdOXCUV5K6x9CZnnI4A2"
```

> Important! The private key of the server is a confidential information. Do not publish this key anywhere. Compromising this key will allow evil parties to fake p2p traffic between clients, servers and supplier nodes.

## Supplier Node configuration

```ini
NODE_TOPIC="<should be common between a node and client>"
NODE_CHAIN="gnosisChiado"
NODE_ENTITY_SIGNER_MNEMONIC="<will be generated during a setup procedure in the Supplier's Dapp>"
NODE_ENTITY_ID="<will be generated during a setup procedure in the Supplier's Dapp>"
NODE_ENTITY_OWNER_ADDRESS="<the supplier's entity owner>"
NODE_SERVER_ADDRESS="<see details below>"
NODE_ENTITY_OFFER_GAP=0.5
NODE_API_CORS="http://localhost:5174"
NODE_RESTART_MAX_COUNT=10
NODE_RESTART_EVERY_TIME_SEC=5
NODE_QUEUE_MAX_RETRIES=20
NODE_QUEUE_RETRIES_DELAY=2000
```

To get the value of `NODE_SERVER_ADDRESS` you have to use the following command:

1. For local environment (testing):

```bash
pnpm gen:address --env local --id QmXH7wT21maJx9TrAk3neP45CeD3X5E8QnPLUH6AEYFxRt --address 127.0.0.1 --port 33333
```

You will get something like this:

```text
/ip4/127.0.0.1/tcp/33333/ws/p2p/QmXH7wT21maJx9TrAk3neP45CeD3X5E8QnPLUH6AEYFxRt
```

2. For production environment

```bash
pnpm gen:address --env prod --id QmXH7wT21maJx9TrAk3neP45CeD3X5E8QnPLUH6AEYFxRt --address coordinator.windingtree.com
```

Address of the server in production looks like:

```text
/dns4/coordinator.windingtree.com/tcp/443/wss/p2p/QmXH7wT21maJx9TrAk3neP45CeD3X5E8QnPLUH6AEYFxRt
```

## Supplier's Dapp configuration

```ini
VITE_CHAIN="gnosisChiado"
VITE_WC_PROJECT_ID="<see guidelines of WalletConnect project registration above>"
VITE_SERVER_IP="127.0.0.1" # 46.101.211.99 in production
VITE_SERVER_PORT=33333 # 443 in production
VITE_SERVER_ID="server id generated above"
```

## Client's Dapp configuration

```ini
VITE_CHAIN="gnosisChiado"
VITE_NODE_TOPIC="<must be equal to NODE_TOPIC defined above>"
VITE_WC_PROJECT_ID="<see guidelines of WalletConnect project registration above>"
VITE_SERVER_ADDRESS="<must be equal to NODE_SERVER_ADDRESS defined above>"
```

## Building the Project

Compile the project's packages with:

```bash
pnpm run build
```

## Smart Contracts

The smart contracts are central to the MVP. Follow the specific setup instructions in the [smart contracts repository](https://github.com/windingtree/contracts).

## Coordination Server

The coordination server facilitates communication between different parts of the MVP. Launch it with:

```bash
pnpm run start:server:dev
```

## Supplier Node and Dapp

The supplier node acts as the backend for suppliers, while the supplier Dapp provides a user interface. Start these with:

```bash
pnpm run start:node:dev
pnpm run start:manager
```

## Client Dapp

The client Dapp is the frontend for the end-users. Get it running with:

```bash
pnpm run start:client
```

## Linting and Testing

Run linting scripts and tests using the following command:

```bash
pnpm run lint
pnpm run test
```

To run code test coverage use the following command:

```bash
pnpm run coverage
```

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.
