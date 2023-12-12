import { useState, useCallback } from 'react';
import { Address, useContractRead, useWalletClient } from 'wagmi';
import {
  Hex,
  Hash,
  zeroAddress,
  TypedDataDomain,
  slice,
  hexToNumber,
} from 'viem';
import { erc20_6PermitABI, erc20_18PermitABI } from '@windingtree/contracts';

// export type PermitSignature = {
// 	r: Hex;
// 	s: Hex;
// 	v: bigint;
// };

export interface UsePermitHookProps {
  owner?: Address;
  verifyingContract: Address;
  spender: Address;
  decimals: 6 | 18;
  version: string;
  value: bigint;
  deadline: bigint;
}

export interface UsePermitHook {
  sign: () => Promise<Hash>;
  deadline: bigint;
  signature?: Hash;
  error?: string;
}

export const usePermit = ({
  owner = zeroAddress,
  verifyingContract,
  spender,
  decimals = 18,
  version,
  value,
  deadline,
}: UsePermitHookProps): UsePermitHook => {
  const abi = decimals === 6 ? erc20_6PermitABI : erc20_18PermitABI;
  const [signature, setSignature] = useState<Hash | undefined>();
  const [error, setError] = useState<string | undefined>();
  const { data: walletClient } = useWalletClient();
  const chainId = walletClient?.chain.id;
  const { data: nonce } = useContractRead({
    chainId,
    address: verifyingContract,
    // @ts-ignore
    abi,
    functionName: 'nonces',
    args: [owner],
  });
  const { data: name } = useContractRead({
    chainId,
    address: verifyingContract,
    // @ts-ignore
    abi,
    functionName: 'name',
  });

  const sign = useCallback(async () => {
    try {
      if (!walletClient) {
        throw new Error('walletClient is not ready');
      }

      setError(undefined);

      const types = {
        Permit: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      };

      const domain: TypedDataDomain = {
        name,
        version,
        chainId,
        verifyingContract,
      };

      const message = {
        owner,
        spender,
        value,
        nonce,
        deadline,
      };

      const signature = await walletClient.signTypedData({
        account: owner,
        message,
        domain,
        primaryType: 'Permit',
        types,
      });
      // const [r, s, v] = [
      //   slice(signature, 0, 32),
      //   slice(signature, 32, 64),
      //   slice(signature, 64, 65),
      // ];
      // const permitSignature = { r, s, v: BigInt(hexToNumber(v)) };

      setSignature(signature);

      return signature;
    } catch (err) {
      setError((err as Error).message ?? 'Unknown usePermit error');
      throw err;
    }
  }, [
    chainId,
    deadline,
    name,
    nonce,
    owner,
    spender,
    value,
    verifyingContract,
    version,
    walletClient,
  ]);

  return {
    sign,
    deadline,
    signature,
    error,
  };
};
