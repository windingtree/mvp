import { fetchToken } from '@wagmi/core';
import { Address, formatUnits } from 'viem';

export async function parsePrice(
  price: bigint,
  asset: Address,
  decimals: number = 2,
): Promise<string> {
  const token = await fetchToken({ address: asset });
  return `${parseFloat(formatUnits(price ?? BigInt(0), token.decimals)).toFixed(
    decimals,
  )} ${token.symbol}`;
}
