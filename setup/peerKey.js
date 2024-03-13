import { generateKeyPair } from '@libp2p/crypto/keys';
import { toString } from 'uint8arrays/to-string';

// Generate secp256k1 private key
const keyPair = await generateKeyPair('secp256k1');

// eslint-disable-next-line no-undef
console.log(`
SERVER_ID="${await keyPair.id()}"
SERVER_PR_KEY="${toString(keyPair.public.bytes, 'base64pad')}"
SERVER_PB_KEY="${toString(keyPair.bytes, 'base64pad')}"
`);
