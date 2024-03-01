import { useEffect, useState } from 'react';
import { entitiesRegistryABI } from '@windingtree/contracts';
import { formatBalance } from '@windingtree/sdk-react/utils';
import { contractsConfig } from 'mvp-shared-files';
import { Hash, zeroHash } from 'viem';
import { useContractRead } from 'wagmi';
import { targetChain } from '../config.js';

export const DepositBalance = ({ supplierId }: { supplierId: Hash }) => {
  const { data, error } = useContractRead({
    address: contractsConfig[targetChain].entities.address,
    abi: entitiesRegistryABI,
    functionName: 'balanceOfEntity',
    enabled: Boolean(supplierId),
    args: [supplierId || zeroHash],
    watch: true,
  });
  const [localData, setLocalData] = useState<typeof data | undefined>();

  useEffect(() => {
    if (data && error) {
      setLocalData(undefined);
    } else {
      setLocalData(data);
    }
  }, [data, error]);

  if (!supplierId) {
    return <>0.00 LIF</>;
  }

  return <>{formatBalance(BigInt(localData?.toString() || '0'), 2)} LIF</>;
};
