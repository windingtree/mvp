import { useCallback, useState } from 'react';
import {
  Button,
  IconButton,
  FormLabel,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { parseUnits, formatUnits } from 'viem';
import { CoinSelector } from './CoinSelector.js';
import { StableCoin } from '../../hooks/useProtocolConfig.js';
import { PriceOption } from './type.js';

interface PricesProps {
  onChange(prices: PriceOption[]): void;
  prices: PriceOption[];
  disabled?: boolean;
}

export const Prices = ({ onChange, prices, disabled = false }: PricesProps) => {
  const [optionCoin, setOptionCoin] = useState<StableCoin | undefined>();
  const [optionPrice, setOptionPrice] = useState<string>('');
  const [optionPriceTouched, setOptionPriceTouched] = useState<boolean>(false);

  const resetAddForm = useCallback(() => {
    setOptionCoin(undefined);
    setOptionPrice('');
    setOptionPriceTouched(false);
  }, []);

  const handleAddOption = useCallback(() => {
    if (optionPrice.length > 0 && optionCoin) {
      const gwei = parseUnits(String(optionPrice), optionCoin.decimals);
      onChange([
        ...prices,
        {
          coin: optionCoin,
          price: gwei,
        },
      ]);
    }
    resetAddForm();
  }, [onChange, optionCoin, optionPrice, prices, resetAddForm]);

  const handleDeleteOption = useCallback(
    (index: number) => {
      onChange(prices.filter((_, i) => i !== index));
    },
    [onChange, prices],
  );

  return (
    <>
      <Stack spacing={2}>
        <FormLabel>
          <Typography variant="h6">Prices per hour</Typography>
        </FormLabel>
        {prices.length > 0 && (
          <Paper sx={{ padding: 2 }}>
            <Grid
              container
              sx={{ width: '100%', borderBottom: '1px solid grey' }}
            >
              <Grid item xs={3} sx={{ minWidth: '25%', maxWidth: '33.333%' }}>
                <Typography variant="caption">Token</Typography>
              </Grid>
              <Grid item xs={3} sx={{ minWidth: '25%', maxWidth: '33.333%' }}>
                <Typography variant="caption">Price</Typography>
              </Grid>
              <Grid item xs flexGrow={1}></Grid>
            </Grid>
            {prices.map((p, index) => (
              <Grid
                key={index}
                container
                alignItems="center"
                sx={{
                  width: '100%',
                  borderBottom: '1px solid rgba(0,0,0,0.2)',
                }}
              >
                <Grid item xs={3} sx={{ minWidth: '25%', maxWidth: '33.333%' }}>
                  <Typography variant="body1">{p.coin.symbol}</Typography>
                </Grid>
                <Grid item xs={3} sx={{ minWidth: '25%', maxWidth: '33.333%' }}>
                  <Typography variant="body1">
                    {formatUnits(p.price, p.coin.decimals)}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs
                  flexGrow={1}
                  display="flex"
                  justifyContent="flex-end"
                >
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteOption(index)}
                    disabled={disabled}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Paper>
        )}
        <Typography variant="subtitle2" color="CaptionText">
          Add new option
        </Typography>
        <Stack direction="row" spacing={2}>
          <CoinSelector
            coin={optionCoin}
            onChange={setOptionCoin}
            disabled={disabled}
          />
          <TextField
            label="Price"
            type="text"
            name="price"
            placeholder="Copy your price per hour here"
            required
            fullWidth
            value={optionPrice}
            error={optionCoin && optionPriceTouched && optionPrice.length === 0}
            helperText={
              optionCoin && optionPriceTouched && optionPrice.length === 0
                ? 'Price cannot be 0'
                : ''
            }
            onChange={(e) => setOptionPrice(e.target.value)}
            onBlur={() => setOptionPriceTouched(true)}
            disabled={disabled}
          />
          <Button
            variant="outlined"
            size="small"
            disabled={!optionCoin || optionPrice.length === 0 || disabled}
            onClick={handleAddOption}
          >
            Add
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
