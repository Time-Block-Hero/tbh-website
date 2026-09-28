# 六张新卡插画验收

关联：https://github.com/Time-Block-Hero/time-block-hero-unified/issues/82 。基于 T1 `e493b8b09a4c39378e3876b00b4ea6d9348401a0`，本层只改美术字段和同步产物。

- 六张新卡：领域防护罩、护甲军需官、战线曙光、大将狐尼克、守护光罩、奥古斯都计划。
- 使用内置图像生成与 Industrial Sci-Fi Anime 留存风格参考；奥古斯都计划额外沿用革命日机体身份。相邻 `.txt` 为登记的画面描述。仅风格参考，不继承参考角色身份。
- 每张独立生成一幅正式结果，通过 `tools/artwork-workflow.mjs register` 登记到英文 artwork key。战线曙光首版因误沿用参考角色外形弃用，重做结果为正式图。
- 全部为竖版 PNG；图内无卡框、文字或数值。六项 `artRequest` 均为 0；历史八项请求原样保留。
- 全140张规则字段、稳定 UID、英文名、衍生关系及收集身份相对 T1 均未改变。

## 验证

2026-09-27，本地 HTTP 编辑器逐张查看正式选图、方形 Board 缩略图和 Hand 卡面：主体、面部或效果作用区在裁切后可辨识，文本/数值没有遮挡主体；奥古斯都计划从维拉的衍生列表打开，革命日既有图保持原样。

`npm test`：79/79 通过（HTTP 保存/重开测试需要本地回环权限）；`npm run build`、`node tools/sync-cards-from-data.mjs`、`git diff --check` 通过。同步产物与正式选图一致。当前浏览器禁止直接导航本地文件，未把 HTTP 检查称为 file:// 浏览器验收；离线数据由现有 VM 测试检查。

本次验收终点为 website 编辑器；未将网站图片导入 Unity Assets 包。合并及最终美术选择由用户审阅。
