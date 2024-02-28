import 'dotenv/config';
import { getEnvVar } from 'mvp-shared-files/utils';
import { Chain, gnosisChiado, hardhat } from 'viem/chains';

export const nodeTopic = getEnvVar('NODE_TOPIC', 'string');

export const targetChain = getEnvVar('NODE_CHAIN', 'string');

export const chain: Chain = targetChain === 'hardhat' ? hardhat : gnosisChiado;

if (!chain) {
  throw new Error('Invalid targetChain name');
}

export const signerMnemonic = getEnvVar(
  'NODE_ENTITY_SIGNER_MNEMONIC',
  'string',
);

export const signerPk = getEnvVar('NODE_ENTITY_SIGNER_PK', 'hex', false);

export const supplierId = getEnvVar('NODE_ENTITY_ID', 'hex');

export const entityOwnerAddress = getEnvVar(
  'NODE_ENTITY_OWNER_ADDRESS',
  'address',
);

export const serverAddress = getEnvVar('NODE_SERVER_ADDRESS', 'address');

export const cors = getEnvVar('NODE_API_CORS', 'string[]');

export const offerGap = getEnvVar(
  'NODE_ENTITY_OFFER_GAP',
  'number',
  true,
  (gap) => {
    if (gap <= 0) {
      throw new Error('NODE_ENTITY_OFFER_GAP must be greater than 0');
    }

    return gap;
  },
);

export const nodeRestartMaxCount = getEnvVar(
  'NODE_RESTART_MAX_COUNT',
  'number',
);

export const nodeRestartEveryTimeSec = getEnvVar(
  'NODE_RESTART_EVERY_TIME_SEC',
  'number',
);

export const queueMaxRetries = getEnvVar('NODE_QUEUE_MAX_RETRIES', 'number');

export const queueRetriesDelay = getEnvVar(
  'NODE_QUEUE_RETRIES_DELAY',
  'number',
);

export const requestExpiration: string = '1h';

export const offerExpiration: string = '1h';
