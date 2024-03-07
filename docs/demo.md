# How to Prepare for MVP Usage

## Ghiado Testnet

The official Chiado Testnet documentation is available [here](https://docs.gnosischain.com/concepts/networks/chiado). To add this testnet to your Metamask wallet, please navigate to the Chiado Testnet documentation page, click on the "Add to Metamask" link, and confirm this action in your Metamask wallet.

You will need some test xDAI to send transactions on Chiado. To acquire these tokens, please visit the [official Gnosis Chiado faucet](https://faucet.chiadochain.net). On this page, enter your wallet address, select xDAI from the dropdown menu, and prove that you are not a robot. You will receive 1 xDAI in your wallet shortly.

## Test Stablecoins

For selling goods in the MVP, we use a set of ERC-20-compatible tokens. You can find the list of these tokens in [our smart contracts repository here](https://github.com/windingtree/contracts#testing-tokens-1).

To mint the token you want, navigate to the Chiado Blockchain explorer using the links from the tokens list and use the built-in interface for smart contract interaction. Here is a brief guide for the STABLE6 token:

- Open the link (write proxy tab): https://gnosis-chiado.blockscout.com/address/0xcC28A4e6DEF318A1b88CF34c4F2Eeb2489995513?tab=write_proxy
- Scroll down to item 7 (mint)
- Enter your wallet address in the "to" field
- Enter the amount of tokens in WEI in the "amount" field (you can use the Ethereum Unit Converter to get the correct WEI value)
- Click on the "write" button and confirm the transaction in your Metamask wallet.

Once the transaction is minted, you will receive the desired tokens in your wallet.

It is recommended to mint both STABLE6 and STABLE18 tokens.
