import { useContractRead } from 'wagmi';
import { Address, zeroAddress } from 'viem';
import { contractsConfig } from 'mvp-shared-files';
import { erc20_18PermitABI } from '@windingtree/contracts';
import { formatBalance } from '@windingtree/sdk-react/utils';

export const LifBalance = ({ address }: { address?: Address }) => {
  const { data } = useContractRead({
    address: contractsConfig.token.address,
    abi: erc20_18PermitABI,
    functionName: 'balanceOf',
    enabled: Boolean(address),
    args: [address ?? zeroAddress],
    watch: true,
  });

  if (!address) {
    return null;
  }

  return <>{formatBalance(BigInt(data?.toString() || '0'), 2)} LIF</>;
};
