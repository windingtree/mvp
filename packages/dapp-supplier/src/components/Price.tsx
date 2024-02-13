import { SxProps, Typography } from '@mui/material';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { DealRecord } from '@windingtree/sdk-types';
import { RequestQuery } from 'mvp-shared-files';
import { useState, useEffect } from 'react';
import { parsePrice } from '../utils/prices.js';
import { createLogger } from '@windingtree/sdk-logger';

const logger = createLogger('Price');

interface PriceProps {
  deal: DealRecord<RequestQuery, OfferOptions>;
  sx?: SxProps;
}

export const Price = ({ deal, sx }: PriceProps) => {
  const [price, setPrice] = useState<string>('');

  useEffect(() => {
    const getPrice = async () => {
      try {
        const res = await parsePrice(deal.price, deal.asset);
        setPrice(res);
      } catch (err) {
        logger.error('getPrice', err);
        setPrice('');
      }
    };
    getPrice();
  }, [deal]);

  return <Typography sx={sx}>{price}</Typography>;
};
