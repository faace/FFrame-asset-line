const j = require('../assets/game/bundles/ZooHome/scenery.json');
const gaps = j.pieces.filter(p => !p.place);
console.log('缺 place 的件共', gaps.length, '\n');
for (const p of gaps) {
  console.log('=== ' + p.id, '(' + p.name + ') ===');
  console.log('  inQueue :', p.inQueue);
  console.log('  layer/z :', p.layer, '/', p.z);
  console.log('  order   :', p.order, ' queueIndex:', p.queueIndex);
  console.log('  png     :', JSON.stringify(p.png));
  console.log('  content :', JSON.stringify(p.content));
  console.log('  anchor  :', JSON.stringify(p.anchor));
  console.log('  refWh   :', JSON.stringify(p.refWh));
  console.log('  foot    :', JSON.stringify(p.foot));
  console.log('  scale   :', p.scale);
  console.log('  cocos   :', JSON.stringify(p.cocos));
  console.log('  masterBox:', JSON.stringify(p.masterBox));
  console.log('  note    :', p.note);
  console.log();
}
