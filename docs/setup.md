# Project Setup

This guide will help you walk through all the steps of the MVP implementation and provide you with all the information required for building of own application on the basis of the WindingTree Market Protocol.

Before starting we have to agree on some prerequisites. First of all it is the Technical stack. Most of the protocol features are covered by the [protocol SDK](https://github.com/windingtree/sdk), so, the technical stack will be dictated by it.

## Technical stack

The WindingTree Market Protocol MVP leverages a modern and robust technical stack designed to harness the power of decentralized technologies while ensuring scalability, security, and ease of use. At the core of the MVP is Ethereum compatible blockchain platform (Gnosis Chiado Testnet), which hosts the [Smart Contracts](https://github.com/windingtree/contracts) that facilitate secure transactions and interactions within the protocol. Solidity, Ethereum's native programming language, is used to develop these contracts, ensuring transparent and tamper-proof business logic.

The backend components, including the Supplier Node and Coordination Server, are built using Node.js, a versatile JavaScript runtime that allows for efficient and scalable server-side applications. This choice supports a wide range of functionalities, from interacting with the blockchain to processing complex business workflows.

On the frontend, React is employed to develop the decentralized applications (Dapps) for both suppliers and customers. React's component-based architecture enables the creation of dynamic and responsive user interfaces, providing an engaging and seamless experience for users interacting with the protocol.

TypeScript, a statically typed superset of JavaScript, is used across the stack for developing both backend and frontend components. It brings strong typing and object-oriented programming capabilities, significantly enhancing code quality, maintainability, and developer productivity.

Lastly, the MVP utilizes LevelDB, a lightweight, single-purpose library for storage, offering fast data retrieval which is crucial for maintaining high performance in decentralized applications. This comprehensive technical stack ensures that the WindingTree Market Protocol MVP is built on a foundation that is not only cutting-edge but also reliable and adaptable for future innovations.

## WalletConnect

Integrating WalletConnect into your React-based web application is an essential step for enabling secure and seamless wallet interactions for users. WalletConnect is an open-source protocol that facilitates the connection between decentralized applications (DApps) and mobile wallets through QR code scanning or deep linking, ensuring a high level of security and user friendliness.

The integration process typically involves utilizing the Web3Modal library, a convenient wrapper that simplifies the connection process to various wallets, including those supported by WalletConnect. In a React application, you can integrate WalletConnect by setting up the Web3Modal instance with the WalletConnect provider options. This setup includes specifying your project's WalletConnect projectId, which is crucial for the connection to work correctly.

To get started with WalletConnect and obtain your projectId, you need to sign up at the WalletConnect Cloud platform. The projectId is a unique identifier for your project, necessary for initializing the WalletConnect client within your application. It links your DApp to the WalletConnect infrastructure, enabling secure communication between your application and users' wallets.

Here's a brief guideline on how to register your project on the WalletConnect platform and get the API key:

1. Visit the [WalletConnect Cloud](https://cloud.walletconnect.com) and sign up to create a new account or log in if you already have one.
2. Once logged in, navigate to the dashboard where you can create a new project.
3. After creating your project, you will be provided with a projectId. This projectId is used in your application to initialize the WalletConnect client.

Remember, when integrating WalletConnect, you should configure it with your project's domain and other optional parameters as needed. These configurations ensure that your application can successfully interact with WalletConnect's services and provide users with a smooth experience when connecting their wallets.

For more detailed instructions and examples on integrating WalletConnect with your React application, referring to the official [WalletConnect documentation](https://docs.walletconnect.com/) is recommended.

## Integrating IPFS Storage for Media Files

In the initial MVP architecture for the WindingTree Market Protocol, IPFS storage plays a pivotal role as a straightforward and scalable solution for the storage of media files. This technology is specifically leveraged within the Supplier Node Management Dapp, where its use is mandatory to achieve the MVP's objectives. However, it's worth noting that for your project, alternative storage solutions can be considered based on your specific requirements and preferences. In those components of the MVP where IPFS storage is utilized, we've chosen to integrate with the [Particle Network](https://developers.particle.network) platform.

To incorporate IPFS storage through the Particle Network into your project, begin by registering on the Particle Network platform. Upon registration, you will need to secure your project's API access credentials, which include a **Project ID** and **Server Key**. These credentials are vital for the authentication of your application's requests to the Particle Network's IPFS service, facilitating direct media file uploads to IPFS. The service is designed to support both simple file and JSON uploads, providing a robust and scalable media storage solution that's particularly beneficial for applications like the Supplier Node Management Dapp.

### Steps to Register Your Project with Particle Network and Obtain API Credentials:

1. Access the Particle Network's official website and either sign up for a new account or log in if you already possess an account.
2. Proceed to your dashboard and locate the section for creating new projects.
3. Follow the instructions provided to establish a new project.
4. Upon successful project creation, the platform will automatically generate your **Project ID** and **Server Key**.

These credentials are essential for the seamless integration and authentication of your application with the Particle Network's IPFS service. For a comprehensive guide on how to utilize these features, along with detailed documentation, please refer to the [Particle Network's documentation](https://docs.particle.network/developers/other-services/node-service/ipfs-service).

## The MVP repository setup

### Cloning the Repository

First, you need to clone the MVP repository to your local machine or development environment. Open your terminal, and execute the following command:

```bash
git clone git@github.com:windingtree/mvp.git ./<your-project-directory>
cd <your-project-directory>
```

Replace `<your-project-directory>` with the name of your project directory.

### Installing Dependencies

The project uses `pnpm` for managing dependencies. Install all required dependencies by running:

```bash
pnpm install
```

Ensure you have `pnpm` installed; if not, follow the installation instructions on the official pnpm website.

### Configuring the Local Environment

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

### Supplier Node configuration

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

### Supplier's Dapp configuration

```ini
VITE_CHAIN="gnosisChiado"
VITE_WC_PROJECT_ID="<see guidelines of WalletConnect project registration above>"
VITE_SERVER_IP="127.0.0.1" # 46.101.211.99 in production
VITE_SERVER_PORT=33333 # 443 in production
VITE_SERVER_ID="server id generated above"
```

### Client's Dapp configuration

```ini
VITE_CHAIN="gnosisChiado"
VITE_NODE_TOPIC="<must be equal to NODE_TOPIC defined above>"
VITE_WC_PROJECT_ID="<see guidelines of WalletConnect project registration above>"
VITE_SERVER_ADDRESS="<must be equal to NODE_SERVER_ADDRESS defined above>"
```

### Building the Project

Compile the project's packages with:

```bash
pnpm run build
```

### Smart Contracts

The smart contracts are central to the MVP. Follow the specific setup instructions in the [smart contracts repository](https://github.com/windingtree/contracts).

### Coordination Server

The coordination server facilitates communication between different parts of the MVP. Launch it with:

```bash
pnpm run start:server:dev
```

### Supplier Node and Dapp

The supplier node acts as the backend for suppliers, while the supplier Dapp provides a user interface. Start these with:

```bash
pnpm run start:node:dev
pnpm run start:manager
```

### Client Dapp

The client Dapp is the frontend for the end-users. Get it running with:

```bash
pnpm run start:client
```

Following these steps, you'll have a local instance of the WindingTree Market Protocol MVP running, allowing you to explore and contribute to decentralized marketplace development.
