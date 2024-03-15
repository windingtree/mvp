# Implementation of the Supplier's Node Management Dapp

The Supplier's Node Management Dapp serves as a crucial interface within the WindingTree Market Protocol ecosystem, enabling efficient management of supplier operations such as organization registration, node setup, account management, property listings, deal oversight, and streamlined check-ins. This guide elaborates on the Dapp's implementation, emphasizing its core initialization, routing strategy, custom hooks, and specialized components.

## Core Dapp Initialization

### Web3Modal Setup

The following snippet outlines the integration of Web3Modal with Wagmi for blockchain connection management, ensuring a user-friendly and secure web3 experience.

```typescript
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/react'
import { WagmiConfig } from 'wagmi';

const wagmiConfig = defaultWagmiConfig({
  chains: [chain],
  projectId: wcProjectId,
  metadata: {
    name: 'WTMP',
    description: 'WindingTree Market Protocol MVP',
    url: 'https://mvp.windingtree.com',
    icons: ['<icon URL>'],
  },
});

createWeb3Modal({
  wagmiConfig,
  chains: [chain],
  projectId: wcProjectId,
});

root.render(
  <WagmiConfig config={wagmiConfig}>
    <App />
  </WagmiConfig>,
);
```

### Config Provider Setup

This provider enriches the application with the capability to manage and retrieve configuration variables (uses localStorage), offering adaptability across different operational settings.

```typescript
import { ConfigProvider } from '@windingtree/sdk-react/providers';

root.render(
  <ConfigProvider>
    <App />
  </ConfigProvider>,
);
```

### Node Provider Setup

Facilitates the connection and interaction with the Supplier's Node, ensuring fluid communication with backend services.

```typescript
import { NodeProvider } from '@windingtree/sdk-react/providers';

root.render(
  <NodeProvider>
    <App />
  </NodeProvider>,
);
```

### Contracts Provider Setup

Connects the Dapp with the protocol's smart contracts, streamlining blockchain interactions for operational efficiency.

```typescript
import { ContractsProvider } from '@windingtree/sdk-react/providers';
import { contractsConfig } from 'mvp-shared-files';

root.render(
  <ContractsProvider contractsConfig={contractsConfig['gnosisChiado']}>
    <App />
  </ContractsProvider>,
);
```

## Dapp Router

Utilizes `react-router-dom` for intuitive navigation across pages. Routes that require authorization are configured with the custom proxy component `RequireAuth`.

Here is an example of such a route configuration (see details in the `./packages/dapp-supplier/src/routes.ts`):

```javascript
{
  path: 'airplanes',
  element: (
    <RequireAuth admin hideSelector>
      <AirplanesPage />
    </RequireAuth>
  ),
}
```

## Custom Hooks

### useIpfs

Integrates with Particle's IPFS API for decentralized storage management, employing Axios for RESTful API calls.

```typescript
import axios from 'axios';
import { useIpfsConfig } from './hooks/useConfig';

export function useIpfs() {
  const ipfsConfig = useIpfsConfig();

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const result = await axios.post(`${ipfsConfig.url}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${ipfsConfig.serverKey}`,
      },
    });

    return result.data;
  };

  return { uploadImage };
}
```

### useEntity

Fetches and normalizes entity information from smart contracts for use within the Dapp.

### useProtocolConfig

Retrieves and normalizes protocol configuration variables from smart contracts.

## Custom Components

### QrReader

Incorporates QR code scanning functionalities into the application, supporting diverse device cameras for a user-friendly experience. This component uses the popular QR codes reading library `@zxing/browser`.

## The Dapp Use Cases

1. **Supplier Organization Registration**: [Registers the supplier organization within the protocol's smart contract](./imp.manager.config.md).
2. **Node Configuration**: [Assists in configuring the node setup](./imp.manager.config.md).
3. **Users Registration**: [Facilitates the registration of administrative and manager accounts](./imp.manager.config.md).
4. **Property Management**: [Enables the creation and management of supplier properties (e.g., airplanes), restricted to the organization owner with wallet access](./imp.manager.prop.md).
5. **Check-In Procedure**: [Enables managers to perform check-ins without wallet access, optimized for mobile devices](./imp.manager.checkin.md).

## Dapp Deployment

Deploying the Supplier's Node Management Dapp to a production environment requires careful consideration to ensure secure and accessible service. A common approach involves utilizing `nginx` as a reverse proxy, which not only simplifies SSL/TLS management but also offers robust handling of static content and redirection policies for enhanced security.

### Setting Up Nginx as a Reverse Proxy

The provided `nginx` configuration demonstrates a secure deployment strategy, redirecting HTTP traffic to HTTPS and serving the Dapp's static content securely over SSL:

```nginx
# Redirect HTTP traffic to HTTPS
server {
    listen 80;
    server_name node.windingtree.com;

    location / {
        return 301 https://$host$request_uri;
    }
}

# Configuration for HTTPS
server {
    listen 443 ssl;
    server_name node.windingtree.com;

    # SSL certificate configuration
    ssl_certificate /path/to/node.windingtree.com/fullchain.pem;
    ssl_certificate_key /path/to/node.windingtree.com/privkey.pem;
    include /path/to/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /path/to/letsencrypt/ssl-dhparams.pem;

    # Root directory where the Dapp is located
    root /var/www/node;

    # Serve static content, defaulting to index.html on empty routes
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

This configuration ensures that all incoming HTTP traffic is automatically redirected to HTTPS, leveraging Let's Encrypt for SSL certificates. The `root` directive points to the directory where the Dapp's build artifacts are stored, enabling `nginx` to serve the Dapp's static files. The `try_files` directive attempts to serve the requested file or directory and defaults to `index.html`, facilitating client-side routing.

> **SSL Certificates**: Ensure your SSL certificates are renewed regularly to prevent service interruptions. Automating this process with tools like `certbot` can significantly reduce manual overhead.

---

This guide provides an in-depth look into the distinct aspects of the Supplier's Node Management Dapp's implementation, shedding light on its approach to initializing core functionalities, managing routes, leveraging custom hooks for operational efficiency, and integrating specific components for enhanced tasks. It's crucial to note that while this documentation highlights several key specifics, it doesn't encompass all facets of application implementation. Further exploration and customization may be needed to fully adapt the Dapp to specific operational requirements or to integrate additional features beyond the scope covered here.
