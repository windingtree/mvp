import { useEffect, useMemo, useState } from 'react';
import { Alert, Grid, Typography, Button } from '@mui/material';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { OfferData } from '@windingtree/sdk-types';
import { isExpired } from '@windingtree/sdk-utils/time';
import { copyToClipboard } from '@windingtree/sdk-react/utils';
import { RequestQuery } from 'mvp-shared-files';
import { useSearchParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import { useSearchProvider } from '../providers/SearchProvider/SearchProviderContext.js';
import { ParsedPrice, parsePayment } from '../utils/offer.js';
import { useAccount, useBlockNumber } from 'wagmi';
import { Book } from '../components/Book.js';
import { OfferDetails } from '../components/OfferDetails.js';
import { PageContainer } from 'mvp-shared-files/react';
import { createLogger } from '@windingtree/sdk-logger';

const logger = createLogger('OfferPage');

export const OfferPage = () => {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('requestId');
  const offerId = searchParams.get('offerId');
  const { requests } = useSearchProvider();
  const [offer, setOffer] = useState<
    OfferData<RequestQuery, OfferOptions> | undefined
  >();
  const [offerLoading, setOfferLoading] = useState<boolean>(true);
  const [prices, setPrices] = useState<ParsedPrice[]>([]);
  const { address, isConnected } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [selectedPaymentOpt, setSelectedPaymentOpt] = useState<
    ParsedPrice | undefined
  >();

  useEffect(() => {
    setOfferLoading(true);

    if (requestId && offerId) {
      const request = requests.find((r) => r.data.id === requestId);

      if (request) {
        setOffer(() => request.offers.find((o) => o.id === offerId));
      }
    } else {
      setOffer(undefined);
    }
  }, [requestId, offerId, requests]);

  useEffect(() => {
    if (offer) {
      parsePayment(offer.payment, 'object', address)
        .then((p) => {
          setPrices(() => p);
        })
        .catch((err) => logger.error('setPrices', err));
    } else {
      setPrices([]);
    }
  }, [address, offer, blockNumber]);

  const expired = useMemo(
    () => (offer ? isExpired(offer.expire) : false),
    [offer],
  );

  return (
    <PageContainer>
      {!offerLoading && !offer && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          Offer not found or expired
        </Alert>
      )}
      {offer && expired && (
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          Expired at{' '}
          {DateTime.fromSeconds(parseInt(offer.expire.toString())).toFormat(
            'yyyy/MM/dd mm:ss',
          )}
        </Alert>
      )}
      {(!address || !isConnected) && (
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          Please connect your wallet
        </Alert>
      )}
      {offer && (
        <>
          <OfferDetails offer={offer} />
          <Grid
            container
            spacing={2}
            sx={{
              marginTop: 2,
              marginBottom: 1,
              borderBottom: '1px solid rgba(0,0,0,0.2)',
            }}
          >
            <Grid item xs={6}>
              <Typography variant="subtitle1">Token</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle1" textAlign="right">
                Price
              </Typography>
            </Grid>
            <Grid item xs={3} />
          </Grid>
          {selectedPaymentOpt && (
            <Grid
              container
              spacing={2}
              sx={{
                marginBottom: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Grid item xs={6}>
                <Typography>
                  <span
                    title="copy address to clipboard"
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => copyToClipboard(selectedPaymentOpt.token)}
                  >
                    {selectedPaymentOpt.symbol}
                  </span>{' '}
                  ({selectedPaymentOpt.balance})
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography textAlign="right">
                  {selectedPaymentOpt.price}
                </Typography>
              </Grid>
              <Grid item xs={3}></Grid>
            </Grid>
          )}
          {!selectedPaymentOpt &&
            prices.map((item, index) => (
              <Grid
                container
                spacing={2}
                key={index}
                sx={{
                  marginBottom: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Grid item xs={6}>
                  <Typography>
                    <span
                      title="copy address to clipboard"
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => copyToClipboard(item.token)}
                    >
                      {item.symbol}
                    </span>{' '}
                    ({item.balance})
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography textAlign="right">{item.price}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    variant="contained"
                    disabled={
                      expired || !address || Boolean(selectedPaymentOpt)
                    }
                    onClick={() => setSelectedPaymentOpt(item)}
                  >
                    Book
                  </Button>
                </Grid>
              </Grid>
            ))}

          {selectedPaymentOpt && address && (
            <Book
              address={address}
              offer={offer}
              price={selectedPaymentOpt}
              onCancel={() => setSelectedPaymentOpt(undefined)}
            />
          )}
        </>
      )}
    </PageContainer>
  );
};
