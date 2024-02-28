import 'dotenv/config';
import { getEnvVar } from 'mvp-shared-files/utils';

export const serverPort = getEnvVar('SERVER_PORT', 'number');

export const id = getEnvVar('SERVER_ID', 'string');

export const privKey = getEnvVar('SERVER_PR_KEY', 'string');

export const pubKey = getEnvVar('SERVER_PB_KEY', 'string');

export const serverPeerKey = {
  id,
  privKey,
  pubKey,
} as const;
