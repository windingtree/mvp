import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIconIcon } from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useConfig } from '@windingtree/sdk-react/providers';
import { CustomConfig } from '../../main.js';
import { AddDeposit } from './AddDeposit.js';
import { ChangeSigner } from './ChangeSigner.js';
import { NoSupplierAlert } from '../NoSupplierAlert.js';
import { ToggleEntity } from './ToggleEntity.js';

export const SupplierManage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const panel = searchParams.get('panel');
  const { supplierId } = useConfig<CustomConfig>();

  if (!supplierId) {
    return (
      <>
        <NoSupplierAlert />
      </>
    );
  }

  return (
    <>
      <Accordion
        expanded={panel === 'deposit'}
        onChange={() => navigate('setup/manage?panel=deposit')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIconIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography>Manage LIF deposit of the entity</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AddDeposit supplierId={supplierId} />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={panel === 'signer'}
        onChange={() => navigate('setup/manage?panel=signer')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIconIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography>Change the supplier's Node signer</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ChangeSigner supplierId={supplierId} />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={panel === 'state'}
        onChange={() => navigate('setup/manage?panel=state')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIconIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography>Toggle the supplier's entity status</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ToggleEntity supplierId={supplierId} />
        </AccordionDetails>
      </Accordion>
    </>
  );
};
