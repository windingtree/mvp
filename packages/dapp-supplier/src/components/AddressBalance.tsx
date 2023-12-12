import { useBalance, useNetwork } from 'wagmi';
import { Address } from 'viem';
import { fixedDecimals } from '../utils/format.js';

export const AddressBalance = ({ address }: { address: Address }) => {
  const { chain } = useNetwork();
  const { data } = useBalance({
    address,
    formatUnits: 'ether',
    enabled: Boolean(address),
    watch: true,
  });

  if (!address) {
    return null;
  }

  return (
    <>
      ({fixedDecimals(data?.formatted)} {chain?.nativeCurrency.symbol})
    </>
  );
};
