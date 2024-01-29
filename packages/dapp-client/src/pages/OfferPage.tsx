import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Container,
  Grid,
  Card,
  CardMedia,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { OfferData } from '@windingtree/sdk-types';
import { isExpired } from '@windingtree/sdk-utils/time';
import { copyToClipboard } from '@windingtree/sdk-react/utils';
import { RequestQuery } from 'mvp-shared-files';
import { useSearchParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import { useSearchProvider } from '../providers/SearchProvider/SearchProviderContext.js';
import { MuiMarkdown, getOverrides } from 'mui-markdown';
import { ParsedPrice, parsePayment } from '../utils/offer.js';
import { useAccount, useBlockNumber } from 'wagmi';
import { createLogger } from '@windingtree/sdk-logger';

const logger = createLogger('OfferPage');

export const OfferPage = () => {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('requestId');
  const offerId = searchParams.get('offerId');
  const { requests } = useSearchProvider();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [offer, setOffer] = useState<
    OfferData<RequestQuery, OfferOptions> | undefined
  >();
  const [offerLoading, setOfferLoading] = useState<boolean>(true);
  const [prices, setPrices] = useState<ParsedPrice[]>([]);
  const { address, isConnected } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

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
        .catch(logger.error);
    } else {
      setPrices([]);
    }
  }, [address, offer, blockNumber]);

  const expired = useMemo(
    () => (offer ? isExpired(offer.expire) : false),
    [offer],
  );

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4, paddingBottom: 4 }}>
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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5} md={4} lg={3}>
              {isSmallScreen && (
                <Typography variant="h5" component="h2" gutterBottom>
                  Cool Airplane
                </Typography>
              )}
              <Card sx={{ maxWidth: '100%', mb: 2 }}>
                <CardMedia
                  component="img"
                  image={offer.options.airplane.media[0].thumbnail}
                  alt={offer.options.airplane.name}
                  sx={{ width: '100%', height: 'auto' }}
                />
              </Card>
              <Grid container spacing={1}>
                {offer.options.airplane.media
                  .slice(0, 4)
                  .map((media, index) => (
                    <Grid item xs={3} sm={2} md={1.5} lg={1} key={index}>
                      <Card>
                        <CardMedia
                          component="img"
                          image={media.thumbnail}
                          sx={{ width: '100%', height: 'auto' }}
                        />
                      </Card>
                    </Grid>
                  ))}
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">Duration: 1h</Typography>
                <Typography variant="body2">Capacity: 3</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={7} md={8} lg={9}>
              {!isSmallScreen && (
                <Typography variant="h5" component="h2" gutterBottom>
                  Cool Airplane
                </Typography>
              )}
              <Box>
                <MuiMarkdown
                  overrides={{
                    ...getOverrides({}),
                    span: {
                      component: Typography,
                      props: {
                        variant: 'body2',
                        color: 'text.secondary',
                      },
                    },
                  }}
                >
                  {offer.options.airplane.description}
                </MuiMarkdown>
              </Box>
            </Grid>
          </Grid>
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
          {/* Rows */}
          {prices.map((item, index) => (
            <Grid
              container
              spacing={2}
              key={index}
              sx={{ marginBottom: 1, display: 'flex', alignItems: 'center' }}
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
                <Button variant="contained" disabled={expired || !address}>
                  Book
                </Button>
              </Grid>
            </Grid>
          ))}
        </>
      )}
    </Container>
  );
};
