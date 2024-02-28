import { main as nodeRun } from './controllers/nodeController.js';
import { createLogger } from '@windingtree/sdk-logger';

const logger = createLogger('MvpIndex');

/** Let's go */
export default nodeRun().catch((error) => {
  logger.error('🚨 Internal application error', error);
  process.exit(1);
});
