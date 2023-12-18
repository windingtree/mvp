import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIconIcon } from '@mui/icons-material';
import { UserRegister } from '../components/Auth/UserRegister.js';
import { AdminRegister } from '../components/Auth/AdminRegister.js';

export const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const panel = searchParams.get('panel');

  return (
    <Container sx={{ paddingTop: 1, paddingBottom: 20 }}>
      <Accordion
        expanded={panel === 'registerUser'}
        onChange={() => navigate('?panel=registerUser')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIconIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography>Register new user</Typography>
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
          <Typography>Register admin</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AdminRegister />
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};
