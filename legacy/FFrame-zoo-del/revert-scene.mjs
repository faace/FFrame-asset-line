import fs from 'fs';
import { execSync } from 'child_process';

// 还原 ScZooHome.scene 到 git 版本
execSync('git checkout -- assets/game/bundles/ZooHome/ScZooHome.scene', { stdio: 'inherit' });
const scene = JSON.parse(fs.readFileSync('assets/game/bundles/ZooHome/ScZooHome.scene', 'utf8'));
const canvas = scene.find(o => o && o.__type__ === 'cc.Node' && o._name === 'Canvas');
console.log('场景已还原，Canvas 子节点:', canvas._children.map(c => scene[c.__id__]._name));
