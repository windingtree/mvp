import { configABI, kinds } from '@windingtree/contracts';
import { useContractRead } from 'wagmi';
import { contractsConfig } from 'mvp-shared-files';
import { Address, Hash, toHex } from 'viem';

interface UseProtocolConfigHook {
  loading: boolean;
  minDeposit?: bigint;
  lifAddress?: Address;
}

export const useProtocolConfig = (): UseProtocolConfigHook => {
  const { data: minDeposit, isLoading: isLoadingMinDeposit } = useContractRead({
    address: contractsConfig.config.address,
    abi: configABI,
    functionName: 'getMinDeposit',
    args: [kinds['supplier'] as Hash],
    watch: true,
  });

  const { data: lifAddress, isLoading: isLoadingLifAddress } = useContractRead({
    address: contractsConfig.config.address,
    abi: configABI,
    functionName: 'getAddress',
    args: [toHex('asset', { size: 32 })],
    watch: true,
  });

  return {
    loading: isLoadingMinDeposit || isLoadingLifAddress,
    minDeposit,
    lifAddress,
  };
};
