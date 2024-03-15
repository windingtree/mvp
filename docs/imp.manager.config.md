# Supplier’s Node Management Dapp Configuration

This web application performs several functions:

1. Registration of the supplier organization in the smart contract of the protocol.
2. Preparing the node configuration.
3. Registration of administrative and manager accounts.
4. Create and manage a supplier property (airplanes). Only available to the organization owner, requires wallet access.
5. View the status of deals.
6. Check-in procedure. Available for managers and does not require wallets (works fine on mobile devices).

To be able connect to the Node host and use IPFS storage API you have to complete the following configurations to the Dapp.

## Supplier's Node API URI

![Node URI configuration](./assets//dapp-manager-node-uri.png)

1. Select `Setup` option in the main Dapp menu
2. Select `Node` tab in the tab bar
3. Enter your Node host URL into the form

> Default URL of the Node in the MVP is: https://node.windingtree.com/api

## IPFS storage API Credentials

![IPFS storage API Configuration](./assets//dapp-manager-node-ipfs.png)

1. Select `Setup` option in the main Dapp menu
2. Select `IPFS` tab in the tab bar
3. Head over the https://dashboard.particle.network/#/login and login into the Particle account
4. Select `Add New Project` and create one
5. Copy your Project Id and Server Key to the form

This configuration enables IPFS storage features in the Dapp and allow you to create images gallery of your property.

## Supplier's Entity Registration

![Supplier's Entity Registration](./assets//dapp-manager-register.png)

1. Select `Setup` option in the main Dapp menu
2. Select `Register` tab in the tab bar
3. Connect your wallet and chose an account you want to use as an entity owner
4. Generate the node signer mnemonic (or copy existing). This account is dedicated to sign offers, send checkin/checkout/etc transactions on behalf of the entity. This account does not have an access to funds.
5. Generate the entity account salt
6. Send transaction for the entity registration on the protocol smart contract

## Supplier's Entity Review

![Supplier's Entity Review](./assets/dapp-manager-review.png)

1. Select `Setup` option in the main Dapp menu
2. Select `View` tab in the tab bar
3. If you have registered your entity earlier and now you just want to see its state, you can copy the entity Id to the form on this page
4. Check the entity owner's balance
5. Check the node signer balance. If you need to top up this balance then copy the address by clicking on the address and top up it in the Metamask wallet using funds `send` feature.
6. Check the entity LIF tokens deposit value.
7. Check the entity status. Must be `enabled` to allow the node to process incoming clients requests and process deals as well.

## Manage The Entity's LIF Deposit

> Assume that you have connected the entity owner wallet account

1. Select `Setup` option in the main Dapp menu
2. Select `Manage` tab in the tab bar
3. Click on `Manage LIF deposit of the entity`
4. Set a value of deposit that must be equal or grater than `Minimum deposit value`. To autofill the form with minimum value click on `use this value`.
5. If you do not have test LIF tokens please follow [this guide](./imp.contracts.md#test-stablecoins).
6. Send transaction to make LIF deposit
7. When transaction will be mined you can review `Current deposit value`

## Enabling And Disabling Of The Entity

![Enabling And Disabling Of The Entity](./assets//dapp-manager-enable.png)

1. Select `Setup` option in the main Dapp menu
2. Select `Manage` tab in the tab bar
3. Click on `Toggle the supplier's entity status`
4. Review the current status of the entity
5. Toggle the status by sending transaction

## Manage The Dapp Users

### Register an Admin

> Administrative user can be registered by the entity owner only

![Register an Admin](./assets/dapp-manager-reg-admin.png)

> Assume that you have connected the entity owner wallet account

1. Select `Users` option in the main Dapp menu
2. Click on `Register Admin` tab
3. Enter login to the `Login Name` form
4. Press on `Register Admin`. You will be prompted to sign login voucher with your wallet.

### Register a Manager

![Register a Manager](./assets/dapp-manager-reg-user.png)

1. Select `Users` option in the main Dapp menu
2. Click on `Register New User` tab
3. Be sure you have logged in as admin because only admins are allowed to add new users
4. Add login name and password to the form. Later the user will be able to change his password.
5. Press on `Register`

### Users Removal

![Users Removal](./assets/dapp-manager-rm-user.png)

> You have to be logged in as admin

1. Select `Users` option in the main Dapp menu
2. Click on `Manage Team` tab
3. Review the team members and press on `Delete` icon
