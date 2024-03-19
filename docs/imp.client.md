# The Client's Dapp for the WindingTree Market Protocol

The Client's Dapp serves as an essential interface for the WindingTree Market Protocol, enabling seamless interactions between clients and suppliers through a coordination server. This application supports a range of functionalities from booking requests and deal management to direct communication with the protocol's smart contract.

## Client Dapp Use Cases

Designed for efficiency and ease of use, the Dapp facilitates:

- [Browsing and reviewing available tours](./imp.client.usecases.md#browsing-and-reviewing-available-tours)
- [Requesting and booking airplanes for tours](./imp.client.usecases.md#requesting-and-booking-airplanes-for-tours)
- [Managing booking](./imp.client.usecases.md#managing-booking)
- [Generating Check-In vouchers](./imp.client.usecases.md#generating-check-in-vouchers)

## Implementation Highlights

### Core Configuration

Sharing a structural resemblance with the Manager's Dapp, the Client Dapp utilizes a similar core configuration setup for consistency and ease of management. For an in-depth guide, please refer to the [Manager Dapp section](./imp.manager.md#config-provider-setup).

### useSearchProvider Hook

This hook manages the request flow effectively by initializing RequestsManager and DealsManager from the protocol SDK, establishing a client connection to the coordination server, and managing subscriptions to various service events throughout the flow.

```typescript
import { useState } from 'react';
import { useClient } from '@windingtree/sdk-react/providers';
import { useSearchProvider } from '../providers/SearchProvider/SearchProviderContext.js';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { RequestQuery } from 'mvp-shared-files';

const CustomRequest = () => {
  const { clientConnected } = useClient();
  const { requestsManager, requests, publish, error } = useSearchProvider();
  const [currentRequest, setCurrentRequest] = useState<ClientRequestRecord<RequestQuery, OfferOptions> | undefined>();

  return (
    <>
      <div>Connection Status: {clientConnected ? 'connected' : 'disconnected'}</div>
      <div>
        <button
          disabled={!clientConnected}
          onClick={async () => {
            try {
              const request = await publish({ date: '<YYYY-MM-DD>' });
              setCurrentRequest(() => request);
            } catch (err) {
              console.error(err);
            }
          }}
        >Send Request</button>
      </div>
      <div>
        <button
          disabled={Boolean(currentRequest)}
          onClick={() => {
            requestsManager.cancel(currentRequest?.data.id);
          }}
        >Cancel Request</button>
      </div>
      <div>Requests Count: {requests.length}</div>
      <div>
        Offers:
        <ul>
          {currentRequest?.offers.map((offer, index) => (
            <li key={index}>Id: {offer.id}</li>
          ))}
        </ul>
      </div>
      {error && <div>Request error: {error}</div>}
    </>
  );
};
```

### Booking Component

This component illustrates the booking flow implementation, providing functionality for creating and managing deals within the Dapp. The code of this component can be found here `./packages/dapp-client/src/components/Book.tsx`.

#### useDealsManager Hook

> Assume that the Dapp is connected to the wallet using Web3Modal.

Enables access to the `dealsManager` for deal operations such as creation, cancellation, etc., streamlining deal management within the Dapp.

```typescript
import { useState, useCallback } from 'react';
import { useDealsManager } from '@windingtree/sdk-react/providers';
import { useWalletClient } from 'wagmi';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { RequestQuery } from 'mvp-shared-files';

const BookingComponent = ({ offer }: BookProps) => {
  const { dealsManager } = useDealsManager<RequestQuery, OfferOptions>();
  const { data: walletClient } = useWalletClient();
  const [tx, setTx] = useState<string | undefined>();

  const dealHandler = useCallback(async () => {
    try {
      const paymentId = offer.payment[0].id; // Example for selecting a payment option
      await dealsManager.create(offer, paymentId, zeroHash, walletClient, setTx);
    } catch (err) {
      console.error(err);
    }
  }, [dealsManager, offer, walletClient]);

  return (
    <div>
      {/* Booking UI and logic */}
    </div>
  );
};
```

### Deals Cancellation

Utilizes the `dealsManager` for straightforward deal cancellation, ensuring clients can easily manage their bookings.

> More about the `dealsManager` you can find in the protocol SDK [documentation](https://windingtree.github.io/sdk/#/clients?id=making-deals).

### Check-In Voucher Generation

Facilitates the generation of Check-In vouchers, crucial for verifying and updating deal statuses at the check-in point.

In the client Dapp creation of the checkin voucher is implemented in the `CheckIn` component which code can be found here: `./packages/dapp-client/src/components/CheckIn.tsx`.

> Assume that the Dapp is connected to the wallet using Web3Modal.

```typescript
import { useState, useCallback } from 'react';
import { useDealsManager } from '@windingtree/sdk-react/providers';
import { useWalletClient } from 'wagmi';
import { QRCodeCanvas } from 'qrcode.react';
import { DealRecord } from '@windingtree/sdk-types';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { RequestQuery } from 'mvp-shared-files';

const CheckInComponent = ({ deal }: CheckInProps) => {
  const { dealsManager } = useDealsManager<RequestQuery, OfferOptions>();
  const { data: walletClient } = useWalletClient();
  const [sign, setSign] = useState<string | undefined>();

  const signatureHandler = useCallback(async () => {
    try {
      const signature = await dealsManager.checkInOutSignature(deal.offer.id, walletClient);
      setSign(signature);
    } catch (err) {
      console.error(err);
    }
  }, [dealsManager, deal, walletClient]);

  return (
    <>
      <button onClick={signatureHandler}>Create CheckIn Voucher</button>
      <div>{sign && <QRCodeCanvas value={sign} size={300} level="M" />}</div>
    </>
  );
};
```

## Dapp Deployment

### Nginx Configuration for Secure Deployment

To ensure the Client's Dapp is securely accessible, deploying it with `nginx` as a reverse proxy is recommended. The `nginx` configuration provided here outlines a secure deployment strategy, including HTTP to HTTPS redirection and SSL certificate management.

```nginx
# Redirect HTTP traffic to HTTPS
server {
    listen 80;
    server_name mvp.windingtree.com;

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS server configuration
server {
    listen 443 ssl;
    server_name mvp.windingtree.com;

    ssl_certificate /etc/letsencrypt/live/mvp.windingtree.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mvp.windingtree.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/client;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

This guide delves into the unique aspects of the Client's Dapp implementation within the WindingTree Market Protocol, spotlighting its configuration, request management, booking functionalities, and deployment strategies. While it outlines several critical components and processes, it's important to recognize that this document does not encompass every detail of application implementation. Additional customization and exploration may be necessary to fully adapt the Dapp to specific operational needs or to integrate.
