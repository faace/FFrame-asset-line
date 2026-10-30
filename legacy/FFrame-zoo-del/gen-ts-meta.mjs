import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

const dir = 'assets/game/bundles/ZooHome';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

for (const f of files) {
  const metaPath = path.join(dir, f + '.meta');
  if (fs.existsSync(metaPath)) continue;
  const uuid = crypto.randomUUID();
  const meta = {
    ver: '4.0.24',
    importer: 'typescript',
    imported: true,
    uuid,
    files: [],
    subMetas: {},
    userData: {},
  };
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n', 'utf8');
  console.log('已生成 meta:', f, uuid);
}
