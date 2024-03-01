import { useEffect, useState } from 'react';
import { entitiesRegistryABI, kinds } from '@windingtree/contracts';
import { contractsConfig } from 'mvp-shared-files';
import { useContractRead } from 'wagmi';
import { Address, Hash, zeroHash } from 'viem';
import { targetChain } from '../config.js';

const kindsIndex = Object.entries(kinds).reduce<Record<Hash, string>>(
  (a, v) => ({
    ...a,
    [v[1]]: v[0],
  }),
  {},
);

export interface UseEntityHook {
  data: {
    kind?: string;
    owner?: Address;
    signer?: Address;
    deposit?: bigint;
    status?: boolean;
  };
  isLoading: boolean;
  error?: string;
}

export const useEntity = (supplierId?: Hash): UseEntityHook => {
  const {
    data,
    isLoading: infoLoading,
    error: infoError,
  } = useContractRead({
    address: contractsConfig[targetChain].entities.address,
    abi: entitiesRegistryABI,
    functionName: 'getEntity',
    enabled: Boolean(supplierId),
    args: [supplierId || (zeroHash as Hash)],
    watch: true,
    staleTime: 2_000,
  });
  const [localData, setLocalData] = useState<typeof data | undefined>();
  const {
    data: deposit,
    isLoading: depositLoading,
    error: depositError,
  } = useContractRead({
    address: contractsConfig[targetChain].entities.address,
    abi: entitiesRegistryABI,
    functionName: 'balanceOfEntity',
    enabled: Boolean(supplierId),
    args: [supplierId || zeroHash],
    watch: true,
  });
  const [localDeposit, setLocalDeposit] = useState<
    typeof deposit | undefined
  >();
  const error = [infoError, depositError].reduce(
    (a, v) => (v ? `${a}\n${v.message}` : a),
    '',
  );

  useEffect(() => {
    if (data && infoError) {
      setLocalData(undefined);
    } else {
      setLocalData(data);
    }
  }, [data, infoError]);

  useEffect(() => {
    if (deposit && depositError) {
      setLocalDeposit(undefined);
    } else {
      setLocalDeposit(deposit);
    }
  }, [deposit, depositError]);

  return {
    data: {
      kind: kindsIndex[localData?.kind ?? zeroHash],
      owner: localData?.owner,
      signer: localData?.signer,
      status: localData?.enabled,
      deposit: localDeposit,
    },
    isLoading: infoLoading || depositLoading,
    error: error !== '' ? error : undefined,
  };
};
