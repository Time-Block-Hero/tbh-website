# 幕间：卡牌与信息交互样片

本页记录 2026-10-25 用户授权的设计候选，入口 `hud-demo.html`。使用现有正式卡图与最新 Chibi，风格延续科幻纸艺舞台；尚未替换 Unity 正式 HUD，也不是权威规则实现。

任务：[H03 动效](https://github.com/Time-Block-Hero/tbh-presentation-ui/issues/140)、[S04 箭头](https://github.com/Time-Block-Hero/tbh-presentation-ui/issues/99)、[H06 记录](https://github.com/Time-Block-Hero/tbh-presentation-ui/issues/143)，总任务 [Unified #146](https://github.com/Time-Block-Hero/time-block-hero-unified/issues/146)。相关功能 C01–C03/C08–C09、S01–S03/S10、Q01–Q05 仅覆盖本样片明确展示的子范围，不能整项勾选。

## 使用

运行 `node tools/card-editor-server.mjs --port 4331`，打开 `http://127.0.0.1:4331/hud-demo.html`。

- 悬停手牌抬升、邻牌让位；拖到场中、双击或 Enter 出牌。
- D 抽牌；右键、Delete 或拖到右下角弃牌。Esc 在落定前取消并回到源区域。
- 点击牌库/弃牌堆查看；S 打开商会，购买的卡牌飞入弃牌堆。
- 默认五格，购买后不即时补货。刷新每轮一次、默认免费，未购卡回到牌源后重新陈列并补空位；已购卡不回到商店。此演示使用固定牌序以便比较，不模拟真实随机算法。
- 顶部可选「轻盈」「纸牌」两种节奏；重置恢复本次演示状态。遵循系统减少动态设置。
- 单位信息提供「徽章／刻度／铭牌」三种排版，默认 HP 和可发动提示；悬停或聚焦展开攻击、生命、行动、护甲及效果说明。
- 左侧只显示最近卡图，悬停/聚焦展开记录，点击固定；记录随抽牌、使用、弃置、购买更新。
- 箭头视觉对照独立控制时停、叠加和一次性消耗：青色永续、琥珀一次性、紫色用途受限。数值与能力名称为标明的演示夹具，不作为当前卡表规则。光只表示放置支持，最终落点资格仍由真实服务决定。

## 实现和验证边界

`hud-demo-state.js` 是可撤销的本地视觉事务：动画落定才更新区域；取消、重复回调和重置后的旧回调均不能重复提交。没有网络游戏指令、存档写入或卡表修改。卡图从 `data/cards.json` 的正式选择解析；不复制图片文件。

动画参考重点来自 [Mega Crit 官方《Slay the Spire 2》页面](https://store.steampowered.com/app/2868840/Slay_the_Spire_2/)实机截图：手牌扇形、焦点牌抬升、低对比背景与稳定牌堆入口。具体时长是本样片自主设计，未声称复现该游戏内部参数。

针对性测试：`node --test tools/tests/hud-demo*.test.mjs`（12 项）。完整网站回归：`node --test tools/tests/*.test.mjs`（126 项）。浏览器验收需覆盖抽取、放大、出牌/取消、购买/余额不足/售空/免费刷新、牌区查看、记录展开、三种信息方案、箭头消费与时动关灯。通过工程检查不等于用户美术验收。

Unity 的真实箭头修正由 Presentation/Rules/Unified 独立 PR 交付；网页样片不宣称已经接入游戏。后续需选定信息样式、卡牌动效与商会设计后，按照现有 K2/K3 只读合同接入正式 HUD。
