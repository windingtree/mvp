import { getEnvVar } from 'mvp-shared-files/utils';
import { Chain } from 'viem';
import { gnosisChiado, hardhat } from 'viem/chains';

export const targetChain = getEnvVar('VITE_CHAIN', 'string');

export const chain: Chain = targetChain === 'hardhat' ? hardhat : gnosisChiado;

if (!chain) {
  throw new Error('Invalid targetChain name');
}

export const wcProjectId = getEnvVar('VITE_WC_PROJECT_ID', 'string');

export const serverIp = getEnvVar('VITE_SERVER_IP', 'string');

export const serverPort = getEnvVar('VITE_SERVER_PORT', 'number');

export const serverId = getEnvVar('VITE_SERVER_ID', 'string');
