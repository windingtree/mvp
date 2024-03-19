# The Protocol Supplier’s Node Implementation

This document provides an overview of the key aspects of implementing the Supplier's Node in the WindingTree Market Protocol network. It focuses on orchestrating node functionality, managing events, and interacting with the blockchain.

## NodeController Overview

Located in `./packages/node/src/controllers/nodeController.ts`, the NodeController orchestrates the Supplier's Node functionality within the decentralized WindingTree Market Protocol network, emphasizing efficient node management, event handling, and seamless blockchain interactions.

## Node Setup

The script leverages the protocol SDK and configurations to initialize a coordination server and node instance:

```typescript
// Import server and node creation functions from the SDK
import { createServer } from '@windingtree/sdk-server';
import { createNode, NodeOptions } from '@windingtree/sdk-node';

// Define node options and create the node
const options: NodeOptions = {
  /* Node configuration details */
};
const node = createNode<RequestQuery, OfferOptions>(options);

// Create the API server with server options
const apiServer = createServer({
  /* Server configuration details */
});
```

## Error Handling for Uncaught Exceptions

Listeners are set up to manage errors and ensure the system can shut down gracefully in case of unexpected failures:

```typescript
// Process-wide listener for unhandled promise rejections
process.once('unhandledRejection', (error) => {
  logger.trace('🛸 Unhandled rejection captured', error);
  process.exit(1);
});
```

## Job Handlers for Deals and Requests

Specific logic is instantiated for processing tasks such as offer creation and deal management:

```typescript
// Handler for processing offers and managing deal claims
const dealHandler = createJobHandler<
  OfferData<RequestQuery, OfferOptions>,
  DealHandlerOptions
>(async (offer, options) => {
  // Deal processing logic
});

// Handler for managing incoming requests
const createRequestsHandler = (
  node: Node<RequestQuery, OfferOptions>,
  options: RequestHandlerOptions,
) => {
  // Request processing logic
};
```

## Event Subscription and Message Processing

Dynamic response mechanisms are implemented for network events and blockchain log updates:

```typescript
// Node event listener for processing messages
node.addEventListener('message', (e) => {
  const { topic, data } = e.detail;
  // Logic to process incoming messages
});

// Subscribe to change status events
const unsubscribe = await subscribeChangeStatusEvent({
  // Configuration details for the subscription
});
```

## API Server Routes and Middlewares

A RESTful interface is set up for external clients to interact with the node:

```typescript
// Define API routes and middlewares
const appRouter = router({
  service: serviceRouter,
  admin: adminRouter,
  // Additional routers
});

// Start the API server with the defined routes
apiServer.start(appRouter);
```

## Custom API Router (airplanes)

For details please head over [this article](./imp.node.router.md).

## Queue Management for Task Scheduling

Asynchronous tasks are orderly executed using a configured queue system:

```typescript
// Configure the task queue
const queue = new Queue({
  storage: queueStorage,
  idsKeyName: 'jobsIds',
  concurrencyLimit: 3,
});

// Register a handler for claim tasks
queue.registerHandler(
  'claim',
  dealHandler({
    // Handler configuration
  }),
);
```

## Graceful Shutdown Procedure

A methodical shutdown process ensures that resources are cleanly released:

```typescript
// Define the shutdown process
const shutdown = () => {
  stopHandler()
    .catch((error) => {
      logger.trace('Shutdown error:', error);
      process.exit(1);
    })
    .finally(() => process.exit(0));
};

// Attach shutdown process to SIGTERM and SIGINT signals
process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);
```

## Interaction with Smart Contracts

Smart contract operations, such as offer creation and deal status updates, are facilitated through the SDK:

```typescript
// Initialize the contracts manager for smart contract operations
const contractsManager = new ProtocolContracts({
  contracts: contractsConfig[targetChain],
  // Configuration for the clients
});

// Claim a deal using the contracts manager
await contractsManager.claimDeal(offer /* Additional callbacks and options */);
```

## Deployment

For production deployment, the node is set to accept connections securely via SSL, facilitated by `nginx` as a reverse proxy:

```nginx
# SSL-enabled reverse proxy configuration for the node server
server {
  listen 443 ssl;
  server_name node.windingtree.com;

  // SSL certificate configuration
  ssl_certificate /path/to/ssl/certificate.pem;
  ssl_certificate_key /path/to/ssl/private.key;

  // Let's Encrypt SSL options and Diffie-Hellman parameter
  include /path/to/ssl/options-ssl-nginx.conf;
  ssl_dhparam /path/to/ssl/ssl-dhparams.pem;

  // WebSocket support and proxy settings
  location / {
    proxy_pass http://localhost:3456;
    // Additional proxy settings
  }
}
```

The `nginx` configuration details are outlined in the `./setup/nginx.mvp.conf` file within the project repository, ensuring secure and efficient network communications.
