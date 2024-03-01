import { useEffect, useState } from 'react';
import { configABI, kinds } from '@windingtree/contracts';
import { useAccount, useContractRead } from 'wagmi';
import { fetchToken } from '@wagmi/core';
import {
  type Erc20Token,
  contractsConfig,
  stableCoins as stableCoinsConfig,
} from 'mvp-shared-files';
import { Address, Hash, toHex } from 'viem';
import { targetChain } from '../config.js';

export interface StableCoin extends Erc20Token {
  name: string;
  symbol: string;
}

export interface UseProtocolConfigHook {
  loading: boolean;
  minDeposit?: bigint;
  lifAddress?: Address;
  stableCoins: StableCoin[];
}

export const useProtocolConfig = (): UseProtocolConfigHook => {
  const { isConnected } = useAccount();
  const [stableCoins, setStableCoins] = useState<StableCoin[]>([]);

  const { data: minDeposit, isLoading: isLoadingMinDeposit } = useContractRead({
    address: contractsConfig[targetChain].config.address,
    abi: configABI,
    functionName: 'getMinDeposit',
    args: [kinds['supplier'] as Hash],
    watch: true,
  });

  const { data: lifAddress, isLoading: isLoadingLifAddress } = useContractRead({
    address: contractsConfig[targetChain].config.address,
    abi: configABI,
    functionName: 'getAddress',
    args: [toHex('asset', { size: 32 })],
    watch: true,
  });

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    try {
      const updateTokens = async () => {
        const tokens = (
          (
            await Promise.allSettled(
              stableCoinsConfig[targetChain].map((t) =>
                fetchToken({
                  address: t.address,
                }).then((s) => ({
                  ...t,
                  name: s.name,
                  symbol: s.symbol,
                })),
              ),
            )
          ).filter(
            (p) => p.status === 'fulfilled',
          ) as unknown as PromiseFulfilledResult<StableCoin>[]
        ).map((p) => p.value);

        setStableCoins(() => tokens);
      };

      updateTokens();
    } catch (err) {
      console.error(err);
    }
  }, [isConnected]);

  return {
    loading: isLoadingMinDeposit || isLoadingLifAddress,
    minDeposit,
    lifAddress,
    stableCoins,
  };
};
