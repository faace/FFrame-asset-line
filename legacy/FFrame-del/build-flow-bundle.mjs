// 从 ~/.agents/skills 里的真实文件拼出「工程化流程安装包」,输出到 docs/流程/
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const skills = path.join(os.homedir(), '.agents', 'skills');
const files = [
    'grilling/SKILL.md',
    'grilling/CHANGES.md',
    'spec/SKILL.md',
    'implement/SKILL.md',
    'review/SKILL.md',
];
const out = path.resolve('docs/流程/工程化流程安装包.md');

const userRules = fs.readFileSync(path.resolve('docs/流程/用户规则.md'), 'utf8')
    .replace(/\r\n/g, '\n').replace(/^# .*\n/, '').replace(/^## /gm, '### ').trim();

let md = `# 工程化流程安装包

> 用法:把本文件拖进另一台电脑的 Cursor 对话框,说「按这个文件安装」。agent 会按下面的指令把整套流程装到全局。
> 本文件由 \`del/build-flow-bundle.mjs\` 从已安装的 skill 生成,改完 skill 后重新运行即可更新。

## 给 agent 的安装指令

1. 目标目录:用户主目录下的 \`.agents/skills/\`(Windows 为 \`%USERPROFILE%\\.agents\\skills\`),不存在则创建。
2. 对下面「文件清单」逐项处理,路径相对目标目录,内容**原样**写入,不要改动、不要总结:
   - 写 \`grilling/SKILL.md\` 之前,若该文件已存在且 \`grilling/SKILL.md.orig\` 不存在,先把现有 \`SKILL.md\` 复制为 \`SKILL.md.orig\`(保留那台电脑上的原版)。
   - 其他文件直接覆盖。
3. 不要修改任何项目文件。
4. 装完后验证 5 个文件都存在,然后告诉用户:
   - 需要**手动**把下面「用户规则文本」粘贴到 Cursor 设置 → Rules → User Rules(这是应用设置,不是文件,你改不了)。
   - 在新窗口怎么开始,见「怎么用」。
5. 若当前项目的 \`.cursor/rules/00-meta.mdc\` 里有「grilling 提问方式」小节,提示用户:该内容已并入全局 grilling,可以删掉;删改前需用户确认。

## 前提与说明

- 本文件在项目 \`docs/流程/\` 下,项目通过 git 同步后即存在。项目规则(\`.cursor/rules/00-meta.mdc\` 里「grilling 收尾」一节)也随 git 同步,**无需另装**。
- 全局 skill 与用户规则不随项目同步,所以才需要本文件。三者缺一,流程会退回「直接开干」:全局 skill + 用户规则 + 项目规则。
- 可选依赖:\`ponytail-review\`、\`ponytail-debt\`(过度设计检查与收官)。若 \`~/.agents/skills/\` 里没有这两个,\`/review\` 会自动跳过那一遍,不影响主流程;想要就让用户另行安装 ponytail。
- 若某个目标文件已存在且内容与本文件不同(用户在那台电脑上改过),覆盖前先告诉用户差异,按用户决定处理;\`grilling/SKILL.md\` 例外,按第 2 步备份后覆盖。

## 安装完成后的验证清单

逐项回报给用户:

- [ ] \`~/.agents/skills/\` 下存在 \`grilling\`(含 \`SKILL.md\`、\`SKILL.md.orig\`、\`CHANGES.md\`)、\`spec\`、\`implement\`、\`review\`
- [ ] 当前项目 \`.cursor/rules/00-meta.mdc\` 含「grilling 收尾(必做)」一节
- [ ] 已提醒用户粘贴用户规则(见下一节)
- [ ] 已提醒用户**新开窗口**测试:说「我想做个 XX 功能」,应先看到小/中/大路径提议,而不是直接改代码

## 流程

\`\`\`
grilling(agent 提议 小/中/大,你拍板)
  → docs/specs/<功能>/共识.md(固定模板)     ← 这里停下,不开干
  → [你确认]
  → 大功能:/spec(spec.md 勾选清单 + tickets/)→ [你确认]
  → /implement(大功能:/implement NN,每条新开 session;中等:直接做)
  → /review(对照 spec + 项目规则;中大任务多一遍 ponytail-review,只出建议)
  → 经验总结(仅有信号:偏离 spec → 复盘.md;规则级的坑 → 走项目 #rule 流程)
  → 功能收官:/ponytail-debt
\`\`\`

- 小任务(改 bug、微调、单文件)直接做,不走流程。
- 状态只记在 \`spec.md\` 的勾选清单里。
- 项目要用别的目录或模板时,在项目规则里写一条覆盖说明即可。

## 用户规则文本(手动粘贴到 Cursor 设置 → Rules → User Rules)

> 与 \`docs/流程/用户规则.md\` 内容相同,由脚本嵌入。三段各建一条用户规则。

${userRules}

## 怎么用

- 新窗口直接描述想做的事(「我想做个 XX 功能」),上面的用户规则会让 agent 先走 grilling。想强制走流程时,开头写 \`/grilling\`。
- 共识文档写完后:大功能说 \`/spec\`;确认 ticket 后在**新窗口**说 \`/implement 01\`;中等任务直接说 \`/implement\`。
- 随时可单独说 \`/review\` 审查当前改动。
- 临时产物、临时总结已做成用户规则(不是 skill):写测试脚本/截图时 agent 会放进 \`del/\` 下按用途新建的文件夹;输入 \`#临时总结\`(可带短标题)会把本窗口的需求和尝试写到 \`docs/临时总结/日期-结果-短标题/README.md\` 并更新 \`docs/临时总结/索引.md\`,不提交。

## 文件清单
`;

for (const f of files) {
    const body = fs.readFileSync(path.join(skills, f), 'utf8').replace(/\r\n/g, '\n').replace(/\n+$/, '');
    md += `\n### \`${f}\`\n\n\`\`\`\`markdown\n${body}\n\`\`\`\`\n`;
}

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, md, 'utf8');
console.log('written', out, md.length);
