import { useEffect, useState } from 'react';
import { Alert } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useDealsManager } from '@windingtree/sdk-react/providers';
import { RequestQuery } from 'mvp-shared-files';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { DealRecord } from '@windingtree/sdk-types';
import { Hash } from 'viem';
import { OfferDetails } from '../components/OfferDetails.js';
import { createLogger } from '@windingtree/sdk-logger';
import { CheckIn } from '../components/CheckIn.js';
import { PageContainer } from 'mvp-shared-files/react';

const logger = createLogger('DetailsPage');

export const DetailsPage = () => {
  const [searchParams] = useSearchParams();
  const offerId = searchParams.get('offerId') as Hash;
  const { dealsManager } = useDealsManager<RequestQuery, OfferOptions>();
  const [deal, setDeal] = useState<
    DealRecord<RequestQuery, OfferOptions> | undefined
  >();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setError(undefined);

    if (offerId) {
      dealsManager
        ?.getById(offerId)
        .then((deal) => setDeal(() => deal))
        .catch((err) => {
          logger.error('setDeal', err);
          setError(
            err.message ?? 'Unknown error curred during fetching of the deal',
          );
        });
    } else {
      setError('offerId required');
    }
  }, [dealsManager, offerId]);

  return (
    <PageContainer>
      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}

      <OfferDetails offer={deal?.offer} sx={{ marginBottom: 4 }} />
      <CheckIn dealsManager={dealsManager} deal={deal} />
    </PageContainer>
  );
};
