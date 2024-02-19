import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIconIcon } from '@mui/icons-material';
import { UserRegister } from '../components/Auth/UserRegister.js';
import { AdminRegister } from '../components/Auth/AdminRegister.js';
import { PageContainer } from '../components/PageContainer.js';
import { ManageTeam } from '../components/Auth/ManageTeam.js';

export const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const panel = searchParams.get('panel');

  return (
    <PageContainer>
      <Accordion
        expanded={panel === 'registerUser'}
        onChange={() => navigate('?panel=registerUser')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIconIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography>Register New User</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <UserRegister />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={panel === 'registerAdmin'}
        onChange={() => navigate('?panel=registerAdmin')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIconIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography>Register Admin</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AdminRegister />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={panel === 'manageTeam'}
        onChange={() => navigate('?panel=manageTeam')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIconIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography>Manage Team</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ManageTeam />
        </AccordionDetails>
      </Accordion>
    </PageContainer>
  );
};
