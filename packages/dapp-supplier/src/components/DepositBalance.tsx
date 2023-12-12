import { entitiesRegistryABI } from '@windingtree/contracts';
import { formatBalance } from '@windingtree/sdk-react/utils';
import { contractsConfig } from 'mvp-shared-files';
import { Hash, zeroHash } from 'viem';
import { useContractRead } from 'wagmi';

export const DepositBalance = ({ supplierId }: { supplierId: Hash }) => {
  const { data } = useContractRead({
    address: contractsConfig.entities.address,
    abi: entitiesRegistryABI,
    functionName: 'balanceOfEntity',
    enabled: Boolean(supplierId),
    args: [supplierId || zeroHash],
    watch: true,
  });

  if (!supplierId) {
    return <>0.00 LIF</>;
  }

  return <>{formatBalance(BigInt(data?.toString() || '0'), 2)} LIF</>;
};
