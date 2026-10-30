import fs from 'fs';

// 你之前是直接打开 prefab 编辑的，还是通过场景里的实例？
// 证据：看 prefab 文件结构是否保持了"单一 prefab 文件"形态（557 条、根节点 _parent=null）
const arr = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/PfZooHomeYard.prefab', 'utf8').replace(/^\uFEFF/, ''));
const head = arr[0];
const root = arr[1];

console.log('第 0 条类型:', head.__type__);
console.log('根节点:', root._name, ' _parent =', root._parent);
console.log('根节点 _prefab =', JSON.stringify(root._prefab));
const pi = arr[root._prefab.__id__];
console.log('根 PrefabInfo:', JSON.stringify(pi));
console.log('\n这是标准「独立预制体文件」形态：');
console.log('  - 文件开头是 cc.Prefab，data 指向根节点');
console.log('  - 根节点 _parent = null');
console.log('  - 根 PrefabInfo.asset 指向自己（__id__: 0），instance = null');
console.log('  => 说明你是在 Creator 里直接双击打开这个 prefab 编辑的，');
console.log('     而不是通过场景里的实例。这条路本来就是对的。');
