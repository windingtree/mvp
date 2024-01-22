# Contract events subscription

```typescript
const blockNumber = BigInt(34567); // This is latest known block number

const unsubscribe = await contractsManager.subscribeMarket(
  'Status', // Event name
  (logs) => {
    // Events handler
    // logs[].blockNumber - block number of the event
    // logs[].args - Event arguments
    // Status event args:
    // 1) offerId - bytes32 hash
    // 2) status - DealStatus
    // 3) sender - ETH address
  },
  blockNumber, // Block number to listen from
);
```

Every time you getting logs you have to persist maximum block number (because `logs` may contain events from multiple blocks) from logs.

Max number calculation maybe obtained this way:

```typescript
const maxBlockNumber = logs.reduce(
  (max, log) => (log.blockNumber > max ? log.blockNumber : max),
  BigInt(0),
);
```
