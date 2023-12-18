// Format decimals
export const fixedDecimals = (
  value: string | undefined,
  decimals: number = 2,
) => parseFloat(value || '0').toFixed(decimals);
