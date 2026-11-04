# 物品处理完成

28个采用图已裁切、去浅底、透明居中并打包。`icons/`保存28张128×128透明单图。`item-source-2048.png`为2048源图，`item.png`为游戏1024图集，每槽64×64。`item.plist`沿用既有名称及坐标，所有28个槽位均为对应物件，不含旧的替代图。

同步位置：`FFrame/assets/game/bundles/Skin/ZooV7/item.png`及`item.plist`；源图和清单同步至`FFrame-asset-line/style/ZooV7/物品/`。旧版游戏图和meta保存在`替换前备份/`；旧版源图在素材仓库`history/v2-batch-20261104/previous-item.*`。

验证：28个槽名与原清单一致，PNG尺寸及坐标一致，每个图标非空且未触及裁切边界，28张单图互不重复，plist与meta矩形一致，原meta/UUID不变，源图及游戏图集字节一致。`物品64像素-浅深底预览.png`供视觉检查。

可重复执行：`node ../打包物品.mjs --verify-synced`。本轮未启动Cocos Creator进行运行时预览。
