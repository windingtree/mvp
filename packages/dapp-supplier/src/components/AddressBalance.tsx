import { useEffect, useState } from 'react';
import { useBalance, useNetwork } from 'wagmi';
import { Address } from 'viem';
import { fixedDecimals } from '../utils/format.js';

export const AddressBalance = ({ address }: { address?: Address }) => {
  const { chain } = useNetwork();
  const { data, error } = useBalance({
    address,
    formatUnits: 'ether',
    enabled: Boolean(address),
    watch: true,
    staleTime: 2_000,
  });
  const [localData, setLocalData] = useState<typeof data | undefined>();

  useEffect(() => {
    if (data && error) {
      setLocalData(undefined);
    } else {
      setLocalData(data);
    }
  }, [data, error]);

  if (!address) {
    return null;
  }

  return (
    <>
      {fixedDecimals(localData?.formatted)} {chain?.nativeCurrency.symbol}
    </>
  );
};
