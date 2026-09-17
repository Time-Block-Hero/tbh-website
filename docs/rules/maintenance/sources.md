---
title: 来源与确认记录
id: maintenance/sources
status: draft
---

**规则正文待整理。** 本页记录已经确认的范围和资料的使用边界，不复制讨论全文或程序实现说明。

## 本轮已确认决策

- 使用同一 Wiki 维护通用游戏规则、标准对战，以及未来实际设计的新模式。
- 星能运营、卡组成长、棋盘对弈、回合流程和商店购买是所有模式共享的核心。
- 卡牌种类及每类属性归入游戏要素；状态变化另章定义。
- 当前资源生成机制归入标准对战的对局自动逻辑；保留对局规则自行引发变化的通用结算约定。
- 本版取消高度维度，不据此自行确定飞行、占格或拾取的替代玩法。
- 关键词统一由词条定义，正文链接引用；“入场”先建立待裁定入口。
- 规则只使用游戏语言，但结算必须精确到可依据初始局面、选择和随机结果复刻整局。
- 目录重建已完成；用户随后授权逐章起草：先形成完整草案，再交用户审阅，通过问答与批注修改，一章确认后再推进下一章。

## 参考材料

- [旧《正式规则书与结算手册》](https://github.com/Time-Block-Hero/time-block-hero-unified/blob/7d93d85f1027407853aa63d3d1b7905bf0d76ab2/Developer_docs/Time-Block%20Heroes%20Official%20Rulebook.zh-CN.md)
- [旧《中文规则书》](https://github.com/Time-Block-Hero/time-block-hero-unified/blob/7d93d85f1027407853aa63d3d1b7905bf0d76ab2/Developer_docs/Time-Block%20Heroes%20Rulebook.zh-CN.md)
- [当前开发者文档入口](https://github.com/Time-Block-Hero/time-block-hero-unified/blob/7d93d85f1027407853aa63d3d1b7905bf0d76ab2/Developer_docs/current-game-logic/README.zh-CN.md)

以上仅为只读参考。旧文档混合了设计、历史和实现信息；现有实现用于对照，不能替代玩法裁定。每个新条款确认后，再补充准确来源与替代关系。

## 目录交付记录

本次目录重建的范围与验收记录见[任务 #42](https://github.com/Time-Block-Hero/time-block-hero-unified/issues/42)。目录获准不表示具体玩法获准。后续第一章起草的新增授权也记录在该任务中；草案未审定的事项保留在[待裁定问题](pending.md)。

## 第一章来源

本章为待审阅草案，采用以下资料与编辑性澄清；本表不表示条款已确认。

| 条款 | 依据与整理方式 |
| --- | --- |
| GEN-001 | 本次对话确认的通用核心与标准模式边界；将共用规则与模式补充的关系整理成连续正文。 |
| GEN-002 | 旧长版前言“文档约定”；补充“不能”和“除非”的阅读说明，不赋予它们新的绝对优先权。 |
| GEN-003 | 旧长版前言“规则优先级”第 1–4 层；将提示与表现单独说明。仅真正冲突时比较优先级、区别来源层级和执行顺序，是为消除歧义所作的待审阅澄清。 |
| GEN-004 | 旧长版的明确改写用语和默认结算原则；用“无视箭头需求”的限定范围解释，未确定具体放置条件。 |
| GEN-005 | 本次对话确认的关键词唯一来源及链接方式。 |
| GEN-006 | 旧长版“本回合”“本次结算”约定；将旧程序术语改写为行动及其后续处理，并对照回合语义文档的双方操作边界。延迟到其他时点的效果不自动延长本次结算，是避免过度扩大旧定义的待审阅澄清。 |

旧长版的程序结构不进入本章。来源固定为上方链接中的 unified 提交；当前规则实现按该项目引用的规则包版本核对，不能用规则包仓库较新的提交替代。

## 第一章实现核对

只读核对基线：unified `7d93d85`，其引用的规则包为 `2b0ec49079cbf7e0708100d02a356618d77c00ca`。本次是源代码检查，未运行游戏，不代表整套优先关系已通过对局验收。

当前放置流程先形成基础合法位置，再加入效果提供的额外位置；时停阶段最后仍会排除非友方领地的位置。因此，即使假设某效果授予领地外放置许可，这个最后的限制仍会排除相应格子。这个局部行为不能证明所有机制都采用“禁止优先”，也不能证明旧文档的来源优先关系已普遍实现。

证据：[放置位置检查](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/BoardRuleQueries.Placement.cs#L22-L44)、[额外放置许可](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/ContinuousPlacementQuery.cs#L110-L122)。

旧内容中的“军团登陆艇”虽写有领地外放置文字，但在上述版本仍标记为未实现、不能正常构筑准入；因此不把它作为当前可用卡的裁定案例。证据：[内容定义及未实现说明](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Resources/TimeBlockRules/GameContent/v1/game-content.json#L1442-L1468)、[构筑准入检查](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Core/Decks/DeckConstructionPolicy.cs#L281-L286)。

本轮尚未找到足以确立所有规则通用优先关系的实现依据；需要用户确认的事项仍见[第一章审阅事项](pending.md#第一章审阅事项)。
