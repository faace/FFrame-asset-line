# ZooV7 控件图

当前采用 `history/v8`。成品是同目录的 `ctrl.png` 和 `ctrl.json`。

## 引用

- 风格块：`style/ZooV7/style.md`
- 母版提示词：`style/ZooV7/控件/history/v7/ui-sheet-v7.prompt.txt`
- 母版图：`style/ZooV7/控件/history/v7/ui-sheet-v7.png`
- 视觉参考：`style/动物园效果图.v06.png`

## 参数

- 脚本：`tools/draw-zoo-v7-ctrl.mjs`
- 画布 2048×2048。在显示尺寸上画硬边，最近邻放大 2 倍。空白像素 alpha 为 0。
- 不把 v7 的 1024 图放大。v7 按钮写的是 288×80，和 2 倍规则不一致，只作风格对照。
- 名单上的槽是 21 个（票面写了 20，把名字数一遍是 21）。另有 10 个空槽，`reserved` 为 true，图上不画。

## 历史

- `history/v1` 到 `history/v7`：1024 母版。v1 只有提示词。v7 是风格母版，不是最终图。
- `history/v8`：采用。2 倍尺寸的脚本重画。
