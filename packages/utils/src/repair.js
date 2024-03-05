/* eslint-disable no-undef */
import { ClassicLevel } from 'classic-level';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .scriptName('leveldb-repair')
  .option('db', {
    describe: 'Path to the LevelDB database directory to be repaired',
    demandOption: true,
    type: 'string',
  })
  .help()
  .parse();

console.log(`Repairing database at path: ${argv.db}`);

ClassicLevel.repair(argv.db, (err) => {
  if (err) {
    console.error('Repair error:', err);
  } else {
    console.log('Database successfully repaired.');
  }
});
