# Coordination Server Implementation

This article outlines the simplest implementation of the coordination server in the MVP, leveraging the extensive functionality provided by the `@windingtree/sdk-server` package from the [WindingTree SDK](https://github.com/windingtree/sdk).

## Server Environment

Detailed setup and configuration instructions for the coordination server are provided [here](./setup.md#server-configuration).

## Server Instantiation

The following TypeScript code snippet demonstrates how to instantiate the coordination server:

```typescript
import { ServerOptions, createServer } from '@windingtree/sdk-server';
import { levelStorage } from '@windingtree/sdk-storage';

const options: ServerOptions = {
  port: '<SERVER_PORT>', // Specify the server port
  peerKey: {
    id: '<SERVER_ID>', // Unique server identifier
    privKey: '<SERVER_PRIVATE_KEY>', // Server's private key
    pubKey: '<SERVER_PUBLIC_KEY>', // Server's public key
  },
  messagesStorageInit: levelStorage.createInitializer({
    path: './server.db', // Path to the server database
  }),
};
const server = createServer(options);

// Preparation steps before starting the server

// Start the server
await server.start();
```

## Deployment

For production environments, the coordination server is configured to accept connections on port `443`. A reverse proxy, set up with `nginx`, routes all requests from the external `443` port to the internal `33333` port, which the coordination server uses to accept connections.

Below is a segment of the `nginx` configuration facilitating this setup:

```nginx
# Reverse proxy configuration for the coordination server
server {
  listen 443 ssl; # Listen on port 443 with SSL
  server_name coordinator.windingtree.com; # Server name

  # SSL configuration
  ssl_certificate /path/to/coordinator.windingtree.com/fullchain.pem; # Path to SSL certificate
  ssl_certificate_key /path/to/coordinator.windingtree.com/privkey.pem; # Path to SSL certificate key
  include /path/to/letsencrypt/options-ssl-nginx.conf; # Let's Encrypt SSL options
  ssl_dhparam /path/to/letsencrypt/ssl-dhparams.pem; # Diffie-Hellman parameters for SSL

  # Proxy settings and WebSocket connection support
  location / {
    proxy_pass http://localhost:33333; # Proxy pass to the coordination server
    proxy_http_version 1.1; // Use HTTP/1.1
    proxy_set_header Upgrade $http_upgrade; # Headers for WebSocket upgrading
    proxy_set_header Connection 'upgrade'; # Maintain the upgrade connection
    proxy_set_header Host $host; # Forward the host header
    proxy_cache_bypass $http_upgrade; # Bypass the cache for WebSocket connections
  }
}
```

The complete `nginx` configuration is available in the `./setup/nginx.mvp.conf` file within the project repository.
