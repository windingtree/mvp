import {
  Address,
  FetchTokenResult,
  fetchToken,
  fetchBalance,
} from '@wagmi/core';
import { PaymentOption } from '@windingtree/sdk-types';
import { Hash, formatUnits } from 'viem';

const tokensCache: Record<Address, FetchTokenResult> = {};

export interface ParsedPrice {
  id: Hash;
  symbol: string;
  token: Address;
  decimals: number;
  price: string;
  balance: string;
}

export function parsePayment(
  payments: PaymentOption[],
  format: 'string',
  address?: Address,
): Promise<string[]>;
export function parsePayment(
  payments: PaymentOption[],
  format: 'object',
  address?: Address,
): Promise<ParsedPrice[]>;

// Parses prices from payment options
export async function parsePayment(
  payments: PaymentOption[],
  format: 'string' | 'object' = 'string',
  address?: Address,
): Promise<string[] | ParsedPrice[]> {
  const data = await Promise.all(
    payments.map(async (o) => {
      let token = tokensCache[o.asset];

      if (!token) {
        token = await fetchToken({ address: o.asset });
        tokensCache[o.asset] = token;
      }

      let balance: string | undefined;

      if (address) {
        const { value } = await fetchBalance({ address, token: o.asset });
        balance = parseFloat(
          formatUnits(value ?? BigInt(0), token.decimals),
        ).toFixed(2);
      }

      const price = formatUnits(o.price, token.decimals);
      const formattedPrice = parseFloat(price).toFixed(2);

      return format === 'string'
        ? `${formattedPrice} ${token.symbol}`
        : {
            id: o.id,
            symbol: token.symbol,
            token: token.address,
            decimals: token.decimals,
            price: formattedPrice,
            balance: balance ?? '0.00',
          };
    }),
  );

  return format === 'string' ? (data as string[]) : (data as ParsedPrice[]);
}
