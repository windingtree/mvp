import { Container } from '@mui/material';
import { Welcome } from '../components/Auth/Welcome.js';

export const HomePage = () => {
  return (
    <Container sx={{ paddingTop: 2 }}>
      <Welcome />
    </Container>
  );
};
