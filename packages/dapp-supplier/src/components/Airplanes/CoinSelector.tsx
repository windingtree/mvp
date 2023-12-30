import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import {
  StableCoin,
  useProtocolConfig,
} from '../../hooks/useProtocolConfig.js';

export interface CoinSelectorProps {
  coin?: StableCoin;
  onChange(coin?: StableCoin): void;
  disabled?: boolean;
}

export const CoinSelector = ({
  coin,
  onChange,
  disabled,
}: CoinSelectorProps) => {
  const { stableCoins } = useProtocolConfig();

  return (
    <FormControl fullWidth>
      <InputLabel id="coin-select-label">Stablecoin</InputLabel>
      {stableCoins.length === 0 && (
        <Alert severity="warning">
          Connect your wallet to load stablecoins
        </Alert>
      )}
      {stableCoins.length > 0 && (
        <Select
          labelId="coin-select-label"
          id="coin-select"
          label="Stablecoin"
          value={coin?.address ?? ''}
          disabled={disabled}
          onChange={(e) =>
            onChange(stableCoins?.find((s) => s.address === e.target.value))
          }
        >
          {stableCoins.map((s, index) => (
            <MenuItem value={s.address} key={index}>
              {s.symbol} {s.permit ? '(permit)' : ''}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
};
