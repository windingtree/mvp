# WindingTree Market Protocol Supplier Node Specification

## Introduction

### Overview

### Objectives

## Technical Requirements

### Technology Stack

- Node.js (LTS)
- Typescript
- tRPC
- @windingtree/sdk

## Architecture and Design

### System Architecture

```mermaid
graph TB
server[Coordination Server]
dapp[Supplier Manger Dapp]
contract[Smart contract]
ipfs[IPFS storage]

subgraph node[Supplier Node]
  contractApi[Contract Interface]
  protocolCtrl[Protocol Controller]
  serviceCtrl[Service Controller]
  apiCtrl[API Controller]
  tasksQueue[Tasks Queue]

  subgraph sysDb[System Database]
    tasks[Tasks]
    transactions[Transactions]
  end

  subgraph authDb[Auth Database]
    users[Users]
    sessions[Sessions]
  end

  subgraph serviceDb[Service Database]
    tours[Tours]
    slots[Time Slots]
    passengers[Passengers]
  end
end
```

## Use Cases and Algorithms

### Node States

```mermaid
stateDiagram
  [*] --> Start
  Start --> initConfig
  initConfig --> protocolInit
  initConfig --> apiInit
  initConfig --> handleStopSignal
  protocolInit --> protocolOperation
  apiInit --> processApiCalls
  handleStopSignal --> protocolStop
  protocolStop --> [*]
```

### Protocol Flow

#### Protocol Initialization

```mermaid
sequenceDiagram
  participant main as Main Controller
  participant contractApi as Contract Interface
  participant tasksQueue as Tasks Queue
  participant protocolCtrl as Protocol Controller
  participant txDb as Transactions DB
  participant contract as Smart Contract

  main ->> main: Config Initialization
  main ->> contractApi: Start Contract API<br>Initialization
  contractApi ->> contractApi: Blockchain clients<br> Initialization
  main ->> tasksQueue: Tasks Queue<br>Initialization
  tasksQueue ->> tasksQueue: Load Tasks Store
  tasksQueue ->> tasksQueue: Start Queue
  main ->> protocolCtrl: Start protocol<br>connections handling
  protocolCtrl ->> protocolCtrl: Connect to<br>the protocol server

  loop Protocol subscription
    alt Income request
      protocolCtrl ->> protocolCtrl: Request validation
      protocolCtrl ->> protocolCtrl: Request parsing
    end
  end

  loop Deal claiming task
    Note over tasksQueue: This is an infinite task<br>that starts with the Node start<br>and stops with the Node stop
    tasksQueue ->> tasksQueue: Get latest block number
    tasksQueue ->> contractApi: Get Deals<br>from latest known block
    contractApi ->> contract: Request Deals events
    contract ->> contract: Executes request
    contract -->> contractApi: Deals events
    alt Deals found
      tasksQueue ->> tasksQueue: Process deal claim<br>(See flow details)
    end
    tasksQueue ->> tasksQueue: Save latest block
  end

  loop Deal tx status monitor task
    Note over tasksQueue: Tx status monitoring task<br>created during dial claim
    tasksQueue ->> contractApi: Get Deal claim tx status
    contractApi ->> contract: Request Deal tx status
    contract ->> contract: Executes request
    contract -->> contractApi: Deal tx status
    alt Deal claimed
      tasksQueue ->> txDb: Update deal claim tx status
      tasksQueue ->> tasksQueue: Remove task
    end
  end

  loop Deal check-out task
    Note over tasksQueue: Such tasks are created<br>during the "Deal Check-in flow"
    alt Check-out required
      tasksQueue ->> tasksQueue: Process check-out<br>(See flow details)
    end
  end
```

#### Offers Flow

```mermaid
sequenceDiagram
  participant server as Coordination Server
  participant protocolCtrl as Protocol Controller
  participant serviceCtrl as Service Controller
  participant serviceDb as Service Database

  protocolCtrl -->> server: Subscription<br>to protocol requests
  server ->> protocolCtrl: Requests

  loop Protocol subscription
    alt Income request
      protocolCtrl ->> protocolCtrl: Request validation
      protocolCtrl ->> protocolCtrl: Request parsing
      protocolCtrl ->> serviceCtrl: Get available time slots
      serviceCtrl ->> serviceDb: Get available time slots
      serviceDb ->> serviceDb: Executes search
      serviceDb -->> serviceCtrl: Available time slots
      serviceCtrl -->> protocolCtrl: Available time slots

      loop Received time slots
        protocolCtrl ->> protocolCtrl: Build offer payload
        protocolCtrl ->> protocolCtrl: Sign payload
        protocolCtrl ->> server: Offer publishing
      end
    end
  end
```

#### Deals Claim

> This flow starts during the [Protocol Initialization flow](#protocol-initialization)

```mermaid
sequenceDiagram
  participant tasksQueue as Tasks Queue
  participant contractApi as Contract Interface
  participant txDb as Transactions DB
  participant contract as Smart Contract

  tasksQueue ->> tasksQueue: Start deal claim procedure
  tasksQueue ->> contractApi: Check the deal status

  alt Deal already claimed
    tasksQueue ->> tasksQueue: End procedure
  else Deal not been claimed
    tasksQueue ->> contractApi: Request deal claim tx sending
    contractApi ->> contract: Send deal claim tx
    contract ->> contract: Execute tx
    contract -->> contractApi: Tx receipt
    contractApi -->> tasksQueue: Tx receipt
    tasksQueue ->> txDb: Save tx status
    txDb ->> txDb: Updates tx store
    tasksQueue ->> tasksQueue: Creates tx status<br>monitor task
  end
```

#### Deals Check-In

#### Deals Check-Out

### Dapp Auth Flow (Admin)

### Dapp Auth Flow (Manager)

### Customer Check-In Flow

### Customer Check-Out Flow

### Refund Flow

## API and Integration

### External API Interfaces

### Integration Overview

## Security

### Overview of Security Features

## Development and Deployment

### Development Guidelines

### Deployment Process
