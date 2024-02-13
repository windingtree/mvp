import { QrReader } from './index.js';

export default (
  <>
    <QrReader onSuccess={(code) => console.log('CODE:', code)} />
  </>
);
