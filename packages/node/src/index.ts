import { main as nodeRun } from './controllers/nodeController.js';
import { createLogger } from '@windingtree/sdk-logger';
import { config } from './common/config.js';

const logger = createLogger('MvpIndex');
config.init();

/** Let's go */
export default nodeRun().catch((error) => {
  logger.trace('🚨 Internal application error', error);
  process.exit(1);
});
