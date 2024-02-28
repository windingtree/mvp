import type { Address } from 'viem';
import type { GenericQuery, Contracts } from '@windingtree/sdk-types';
export interface RequestQuery extends GenericQuery {
  date: string; // ISO 8601 without minutes: `YYYY-MM-DD`
}

export interface Erc20Token {
  address: Address;
  decimals: number;
  permit: boolean;
}

export const contractsConfig: Record<string, Contracts> = {
  hardhat: {
    config: {
      name: 'Config',
      version: '1',
      address: '0x3Aa5ebB10DC797CAC828524e59A333d0A371443c',
    },
    entities: {
      name: 'EntitiesRegistry',
      version: '1',
      address: '0x59b670e9fA9D0A427751Af201D676719a970857b',
    },
    market: {
      name: 'Market',
      version: '1',
      address: '0x09635F643e140090A9A8Dcd712eD6285858ceBef',
    },
    token: {
      name: 'LifToken',
      version: '1',
      address: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
    },
  },
  gnosisChiado: {
    config: {
      name: 'Config',
      version: '1',
      address: '0x098b1d12cAfE7315C77b6d308A62ce02806260Ee',
    },
    entities: {
      name: 'EntitiesRegistry',
      version: '1',
      address: '0x4bB51528C83844b509E1152EEb05260eE1bf60e6',
    },
    market: {
      name: 'Market',
      version: '1',
      address: '0xDd5B6ffB3585E109ECddec5293e31cdc1e9DeD57',
    },
    token: {
      name: 'LifToken',
      version: '1',
      address: '0x4d60F4483BaA654CdAF1c5734D9E6B16735efCF8',
    },
  },
};

export const stableCoins: Record<string, Erc20Token[]> = {
  hardhat: [
    {
      address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      decimals: 6,
      permit: false,
    },
    {
      address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
      decimals: 6,
      permit: true,
    },
    {
      address: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
      decimals: 18,
      permit: false,
    },
    {
      address: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
      decimals: 18,
      permit: true,
    },
  ],
  gnosisChiado: [
    {
      address: '0x8CB96383609C56af1Fe44DB7591F94AEE2fa43b2',
      decimals: 6,
      permit: false,
    },
    {
      address: '0x4556d5C1486d799f67FA96c84F1d0552486CAAF4',
      decimals: 6,
      permit: true,
    },
    {
      address: '0x4EcB659060Da61D795D777bb21BAe3599b301C66',
      decimals: 18,
      permit: false,
    },
    {
      address: '0xF54784206A53EF19fd3024D8cdc7A6251A4A0d67',
      decimals: 18,
      permit: true,
    },
  ],
};
