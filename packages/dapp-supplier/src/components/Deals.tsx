import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  SxProps,
  Typography,
} from '@mui/material';
import { ContentCopy as CopyIcon } from '@mui/icons-material';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { centerEllipsis, copyToClipboard } from '@windingtree/sdk-react/utils';
import { DealRecord, DealStatus } from '@windingtree/sdk-types';
import { DateTime } from 'luxon';
import { RequestQuery } from 'mvp-shared-files';
import { getDealStatusColor } from '../utils/deals.js';
import { Page } from '../utils/types.js';
import { Price } from './Price.js';
import { DealView } from './DealView.js';
import { Pagination } from './Pagination.js';

interface DealsProps {
  deals?: DealRecord<RequestQuery, OfferOptions>[];
  page: Page;
  onPageChange: (newPage: Page) => void;
  sx?: SxProps;
}

export const Deals = ({ deals, page, onPageChange, sx }: DealsProps) => {
  const [dealStates, setDealStates] = useState<Record<string, DealStatus>>({});
  const [selectedDeal, setSelectedDeal] = useState<
    DealRecord<RequestQuery, OfferOptions> | undefined
  >();

  useEffect(() => {
    if (deals && deals.length > 0) {
      const newDealStates: Record<string, DealStatus> = {};
      deals.forEach((d) => {
        newDealStates[d.offer.id] = d.status;
      });
      setDealStates(newDealStates);
    }
  }, [deals]);

  if (!deals || deals.length === 0) {
    return (
      <Box sx={sx}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography>Deals loading...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={sx}>
      {deals && deals.length > 0 && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container sx={{ borderBottom: '1px solid grey' }}>
                {[
                  { label: 'Offer Id', size: 2 },
                  { label: 'Created', size: 2 },
                  { label: 'Buyer', size: 3 },
                  { label: 'Price', size: 2 },
                  { label: 'Status', size: 2 },
                  { label: 'Action', size: 1 },
                ].map((header, i) => (
                  <Grid item xs={header.size} key={i}>
                    <Typography
                      variant="subtitle2"
                      component="div"
                      style={{ textAlign: 'left' }}
                    >
                      {header.label}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {deals.map((d, index) => (
              <Grid item xs={12} key={index}>
                <Grid container>
                  <Grid item xs={2}>
                    <Typography
                      onClick={() => setSelectedDeal(() => d)}
                      sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      {centerEllipsis(d.offer.payload.id, 3)}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography>
                      {DateTime.fromSeconds(Number(d.created)).toISODate()}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack direction="row" alignItems="center" spacing={0}>
                      <Typography
                        title={d.buyer}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => copyToClipboard(d.buyer)}
                      >
                        {centerEllipsis(d.buyer, 3)}
                      </Typography>
                      <CopyIcon
                        sx={{ width: 15, height: 15, cursor: 'pointer' }}
                        onClick={() => copyToClipboard(d.buyer)}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={2}>
                    <Price deal={d} />
                  </Grid>
                  <Grid item xs={2}>
                    <Typography
                      sx={{
                        color: getDealStatusColor(dealStates[d.offer.id]),
                      }}
                    >
                      {DealStatus[dealStates[d.offer.id]]}
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography></Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Pagination
            page={page}
            onChange={(newPage) => onPageChange({ ...page, ...newPage })}
            sx={{
              marginTop: 1,
              paddingTop: 1,
              borderTop: '1px solid grey',
            }}
          />
        </>
      )}

      <DealView
        deal={selectedDeal}
        onClose={() => setSelectedDeal(undefined)}
      />
    </Box>
  );
};
