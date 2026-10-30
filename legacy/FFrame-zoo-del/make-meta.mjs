import fs from 'fs';
import crypto from 'crypto';

const uuid = crypto.randomUUID();
const meta = {
  ver: '1.1.50',
  importer: 'prefab',
  imported: true,
  uuid,
  files: ['.json'],
  subMetas: {},
  userData: { syncNodeName: 'PfZooHomeYard' },
};
fs.writeFileSync('assets/game/bundles/ZooHome/PfZooHomeYard.prefab.meta', JSON.stringify(meta, null, 2) + '\n', 'utf8');
console.log('uuid:', uuid);
