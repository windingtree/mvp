import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Alert,
} from '@mui/material';
import { ExpandMore as ExpandMoreIconIcon } from '@mui/icons-material';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useConfig } from '@windingtree/sdk-react/providers';
import { CustomConfig } from '../../main.js';
import { AddDeposit } from './AddDeposit.js';

export const SupplierManage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const panel = searchParams.get('panel');
  const { supplierId } = useConfig<CustomConfig>();

  if (!supplierId) {
    return (
      <>
        <Alert severity="warning">
          <Link to="setup/register">Register</Link> or{' '}
          <Link to="setup/view">add</Link> your entity Id first.
        </Alert>
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
          <Typography>Manage the supplier's Node signer</Typography>
        </AccordionSummary>
        <AccordionDetails></AccordionDetails>
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
          <Typography>Manage the supplier's entity state</Typography>
        </AccordionSummary>
        <AccordionDetails></AccordionDetails>
      </Accordion>
    </>
  );
};
