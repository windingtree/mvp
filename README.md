# WindingTree Market Protocol MVP

This project is an MVP based on the WindingTree Market Protocol, aimed at demonstrating the potential of creating decentralized market solutions.

## Tech Stack

- **Smart Contracts**: Solidity
- **Frontend**: TypeScript, React, @windingtree/sdk
- **Backend**: TypeScript, Node.js, tRPC.js, LevelDB, @windingtree/sdk
- **Blockchain**: Ethereum

## Documentation

Additional documentation can be found in the `/docs` directory.

## Setup and Installation

### Clone the repository:

```bash
git clone git@github.com:windingtree/mvp.git ./<your-project-directory>
cd <your-project-directory>
```

### Install dependencies using pnpm:

```bash
pnpm install
```

### Build packages

```bash
pnpm build
```

## Development

### Smart Contracts

- For contracts setup follow this repository: https://github.com/windingtree/contracts

### Coordination server

- Start the protocol coordination server:

```bash
pnpm start:server
```

### Supplier Node

- Start the protocol supplier Node server:

```bash
pnpm start:node
```

### Supplier Dapp

- Start the protocol supplier web application:

```bash
pnpm start:dapp-supplier
```

### Client Dapp

- Start the protocol client web application:

```bash
pnpm start:dapp-client
```

## Linting and Testing

Run linting scripts and tests using the following command:

```bash
pnpm lint
pnpm test
```

To run code test coverage use the following command:

```bash
pnpm coverage
```

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.
