import { Alert } from '@mui/material';
import { Link } from 'react-router-dom';

export const NoSupplierAlert = () => (
  <Alert severity="warning">
    <Link to="/supplier/setup/register">Register</Link> or{' '}
    <Link to="/supplier/setup/view">add</Link> your entity Id first.
  </Alert>
);
