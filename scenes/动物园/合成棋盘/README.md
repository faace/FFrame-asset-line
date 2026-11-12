# 合成棋盘素材生成档案

更新：2026-11-12。本目录是提示词、接口原图与拆分导出的长期档案；不放密钥，不包含过渡提示词。提示词文件按原文保存，后续修改时新增版本，不覆盖已归档版本。

## 归档规则

- `prompts/` 保存已采用或候选终稿提示词；中间调试、失败过渡版不收入。
- `sources/` 保存 Cubence 返回的原始图片，不用预览图替代，不做放大或覆盖。文件名对应批次。
- `exports/` 保存审阅用拆分图、统一缩放对照图及 `manifest.json`。manifest 中每个 `review_id` 记录来源文件、SHA-256、源尺寸、网格单元、裁切坐标及透明处理信息。
- 视觉认可不等同于技术规格验收通过。请求尺寸、真实返回尺寸、透明参数和状态以表格为准。
- 修改/补图时新增提示词版本及新源图；在本索引中追加记录，更新对应导出 manifest，保留旧版本用于追溯。

## 提示词、原图、导出对应关系

| 批次 | 终稿提示词 | 原始生成图 | 请求 / 实际尺寸 | 输出设置 | 状态及导出关系 |
|---|---|---|---|---|---|
| 木料 wave01 v2（旧版） | [icon-wood-wave01-v2.txt](prompts/icon-wood-wave01-v2.txt) | [wood-wave01-v2.png](sources/wood-wave01-v2.png) | 2048×2048 / 1254×1254 | 请求白底；此版已被透明重制替代 | 历史版本，不作为当前图标来源；仅保留用于追溯。`wood-wave01-v2-aligned.png` 是风格参考图，不是本提示词的生成结果。 |
| 工具与植物 wave02 | [icon-tools-plants-wave02-v1.txt](prompts/icon-tools-plants-wave02-v1.txt) | [tools-plants-v1.png](sources/tools-plants-v1.png) | 2048×2048 / 2048×2048 | `background=transparent`，PNG | 视觉方向已用于后续素材推进；技术终验仍需统一复核 alpha 与跨批描边。导出 ID：T01–T08、P01–P07、GEN-T。 |
| 动物与清洁 wave03 | [icon-animals-cleaning-wave03-v1.txt](prompts/icon-animals-cleaning-wave03-v1.txt) | [animals-cleaning-v1.png](sources/animals-cleaning-v1.png) | 2048×2048 / 1254×1254 | `background=transparent`，PNG | 视觉方向已用于后续素材推进；实际尺寸不符原生请求，alpha 有大量半透明像素，不能宣称生产验收通过。导出 ID：A01–A07、C01–C06、GEN-A、GEN-P、GEN-S。 |
| 导览与餐食 wave04 | [icon-guides-food-wave04-v1.txt](prompts/icon-guides-food-wave04-v1.txt) | [guides-food-v1.png](sources/guides-food-v1.png) | 2048×2048 / 1254×1254 | `background=transparent`，PNG | 视觉方向已用于后续素材推进；实际尺寸不符原生请求，alpha 有大量半透明像素，不能宣称生产验收通过。导出 ID：G01–G06、F01–F06、GEN-F。 |
| 木料透明重制 wave05 v3 | [icon-wood-transparent-wave05-v1.txt](prompts/icon-wood-transparent-wave05-v1.txt) | [wood-transparent-v3.png](sources/wood-transparent-v3.png) | 2048×2048 / 1254×1254 | `background=transparent`，PNG | 用户确认视觉效果并继续推进；真实 alpha 存在，但主体大量为近不透明值，且实际尺寸不足。当前导出木料来源。导出 ID：W01–W07、GEN-W。 |
| 合成页背景 v1（候选） | [ui-background-v1.txt](prompts/ui-background-v1.txt) | [background-v1.png](sources/background-v1.png) | 1152×2048 / 941×1672 | 不透明背景 | 候选，待用户审阅；尚无拆分图。 |
| 棋盘底板 v2（候选） | [ui-board-v2.txt](prompts/ui-board-v2.txt) | [board-v2.png](sources/board-v2.png) | 1600×2048 / 1108×1419 | `background=transparent`，PNG | 候选，待用户审阅；中央 alpha 约 253，外形比例与请求画布不同；尚无拆分图。 |

## 导出清单

`exports/manifest.json` 是图标拆分映射的权威清单，覆盖本次审阅用 53 个 ID。每个 ID 指向唯一源图和单元坐标，并记录裁切框、源 SHA-256、背景去除标记、散点清理数及 64px 可见范围。`exports/native-cells/` 是对应单图；`all-53-64px-dark.png` 与 `all-53-64px-light.png` 是审阅拼图，不是源图。

原始历史记录仍留在项目的 `del/merge-wave*/`，本归档与之独立；不要因 `del` 的清理策略而删除本目录。源文件已纳入 Git，可随素材仓库同步至其他电脑。
