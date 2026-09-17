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
- 关键词统一由词条定义，正文链接引用；关键词与展开文本同等有效。入场、保留、移除、建造与圣盾的讨论结果已录入，未定边界另标。
- 规则只使用游戏语言，但结算必须精确到可依据初始局面、选择和随机结果复刻整局。
- 目录重建已完成；默认逐章起草与审阅。本次用户明确授权更新第一章，并一并起草第二、第三、第四章，完成后集中审阅。
- 先判断规则或效果的适用性和有效性，再应用有效且明确适用的例外，仅改写明示部分。废弃旧稿按模式、卡牌、关键词／状态、基础规则划分的来源等级。
- 效果描述行为，关键词简写效果规则，状态记录持续条件、标记或累计数值；状态并非另一个优先级。

## 参考材料

- [旧《正式规则书与结算手册》](https://github.com/Time-Block-Hero/time-block-hero-unified/blob/7d93d85f1027407853aa63d3d1b7905bf0d76ab2/Developer_docs/Time-Block%20Heroes%20Official%20Rulebook.zh-CN.md)
- [旧《中文规则书》](https://github.com/Time-Block-Hero/time-block-hero-unified/blob/7d93d85f1027407853aa63d3d1b7905bf0d76ab2/Developer_docs/Time-Block%20Heroes%20Rulebook.zh-CN.md)
- [当前开发者文档入口](https://github.com/Time-Block-Hero/time-block-hero-unified/blob/7d93d85f1027407853aa63d3d1b7905bf0d76ab2/Developer_docs/current-game-logic/README.zh-CN.md)

以上仅为只读参考。旧文档混合了设计、历史和实现信息；现有实现用于对照，不能替代玩法裁定。每个新条款确认后，再补充准确来源与替代关系。

## 目录交付记录

本次目录重建的范围与验收记录见[任务 #42](https://github.com/Time-Block-Hero/time-block-hero-unified/issues/42)。目录获准不表示具体玩法获准。后续第一章起草的新增授权也记录在该任务中；草案未审定的事项保留在[待裁定问题](pending.md)。

## 第一章来源

本章保留草稿状态；其中 GEN-003 至 GEN-005 的核心原则已经用户确认，其余细节继续审阅。

| 条款 | 依据与整理方式 |
| --- | --- |
| GEN-001 | 本次对话确认的通用核心与标准模式边界；将共用规则与模式补充的关系整理成连续正文。 |
| GEN-002 | 旧长版前言“文档约定”；补充“不能”和“除非”的阅读说明，不赋予它们新的绝对优先权。 |
| GEN-003 | 本次对话已确认有效性先判断、明确例外优先于相应默认处理；替代旧长版及初稿的来源等级。规则高于提示与表现保留。 |
| GEN-004 | 用户确认例外仅改写明确部分；护甲、圣盾、保留及箭头例子用于说明范围，不越权确定词条全部边界。 |
| GEN-005 | 用户确认关键词是效果规则简写，与展开文本同等有效；效果与状态定义同本次讨论。 |
| GEN-006 | 旧长版“本回合”“本次结算”约定；将旧程序术语改写为行动及其后续处理，并对照回合语义文档的双方操作边界。延迟到其他时点的效果不自动延长本次结算，是避免过度扩大旧定义的待审阅澄清。 |

旧长版的程序结构不进入本章。来源固定为上方链接中的 unified 提交；当前规则实现按该项目引用的规则包版本核对，不能用规则包仓库较新的提交替代。

## 第一章实现核对

只读核对基线：unified `7d93d85`，其引用的规则包为 `2b0ec49079cbf7e0708100d02a356618d77c00ca`。本次是源代码检查，未运行游戏，不代表整套优先关系已通过对局验收。

当前放置流程先形成基础合法位置，再加入效果提供的额外位置；时停阶段最后仍会排除非友方领地的位置。因此，即使假设某效果授予领地外放置许可，这个最后的限制仍会排除相应格子。这个局部行为不能证明所有机制都采用“禁止优先”，也不能证明旧文档的来源优先关系已普遍实现。

证据：[放置位置检查](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/BoardRuleQueries.Placement.cs#L22-L44)、[额外放置许可](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/ContinuousPlacementQuery.cs#L110-L122)。

旧内容中的“军团登陆艇”虽写有领地外放置文字，但在上述版本仍标记为未实现、不能正常构筑准入；因此不把它作为当前可用卡的裁定案例。证据：[内容定义及未实现说明](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Resources/TimeBlockRules/GameContent/v1/game-content.json#L1442-L1468)、[构筑准入检查](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Core/Decks/DeckConstructionPolicy.cs#L281-L286)。

新版宪法原则依据用户明确决定，不以实现是否已经符合决定其有效性。实现核对仅说明与新设计的差距；剩余边界见[第一章审阅事项](pending.md#第一章审阅事项)。


## 第二至第四章来源与核对

本轮用户要求三章一并完成后审阅；以下均为草案来源，不表示实现自动获得设计批准。旧规则以同一 unified 提交固定，卡牌字段以 website 当前 `data/cards.json` 为准。本次起草时的卡表有 90 张随从和 47 张魔法（后续资源牌类型决定以用户确认的新规则为准）；英雄使用随从类型另加英雄身份，未修改任何卡牌设计数据。

| 章节／主题 | 旧资料 | 本稿整理方式 |
| --- | --- | --- |
| 第二章对象与属性 | 长版第 66–197 行；短版第 175–194 行 | 区分控制／拥有、职业／身份；最初类型草案采用现行卡表的随从与魔法，现已由用户确认的三类规则替代。缺少属性不解释为数值为零。 |
| 第二章区域与空间 | 长版第 238–314 行 | 保留牌堆循环与区域区分；依据用户决定移除高度，拾取物共存最初为待审阅方案，现已由资源牌新规则确认。 |
| 第二章状态 | 用户关于耀斑连射、建造与圣盾的说明 | 状态可记录累计量；卡牌因保留增强不代表自带保留。 |
| 第三章回合 | 长版第 318–545 行；短版第 147–154 行 | 用较新回合说明与固定实现核对五步顺序，明确旧清理顺序冲突。 |
| 第四章放置与移动 | 长版第 752–805 行；短版第 307–318 行 | 保留明示放置成本为草案，注明当前未接入；移动明确逐格及中止，自动选路规则未定。 |
| 第四章攻击与推进 | 长版第 807–836 行；短版第 330–332 行 | 反击列冲突；推进暂保留短版可选耗 1 点，与当前自动免费明确区分。 |
| 第四章主动能力 | 长版第 480–486 行；较新的成本与失败说明 | 草案采用选择后付费、再反制，注明旧文差异。 |

### 第二章实现证据

- [类型定义](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Core/Cards/CardType.cs#L3-L7)与[卡牌属性](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Core/Cards/CardDefinition.cs#L19-L74)。
- [空间距离与方向](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/BoardRuleQueries.cs#L334-L414)。旧高度判断仍存在，不作为新规则依据。
- [中立职业的拾取限制](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/PickupCollectionPolicy.cs#L41-L45)。
- [公开数量与本方可见内容](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Application/ProjectionService.Snapshot.cs#L117-L160)；[时停信息处理](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Application/ProjectionService.Snapshot.cs#L180-L217)。缺少展示不等于禁止查看。

### 第三章实现证据

- [回合开始处理](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Match/RoundStartCommandHandler.cs#L14-L132)：刷新、自动机制、抽牌及后续触发。
- [阶段权限和行动顺序](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/PhasePolicy.cs#L35-L155)：时停指定能力、时动窗口与放置数／完成顺序／席位。
- [回合结束顺序](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Execution/Resolution/ResolutionRunner.RoundEndCycleWork.cs#L98-L125)与[手牌、魔法清理](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/TurnMaintenanceRuleHandler.cs#L70-L125)。
- [回合语义文档](https://github.com/Time-Block-Hero/time-block-hero-unified/blob/7d93d85f1027407853aa63d3d1b7905bf0d76ab2/Developer_docs/current-game-logic/architecture/05-match-round-semantics.zh-CN.md)。若泛称临时单位清理与固定代码不一致，不自动写成所有衍生物消失。

### 第四章实现证据

- [普通放置](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Match/PlaceCardCommandHandler.cs#L16-L84)与[放置规则](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/CardPlacementPolicy.cs#L22-L64)：直接入场和计数；未执行旧文独立放置成本。
- [逐格路径处理](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Execution/Resolution/ResolutionRunner.PathMoveWork.cs#L30-L69)：途中失去来源、偏离路线或遇阻时停止。
- [攻击扣次与取消](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/AttackRuleHandler.cs#L91-L171)及[战斗伤害与反击](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/ResolveAttackRuleHandler.cs#L38-L99)。
- [当前自动免费推进](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/AdvanceAfterKillRuleHandler.cs#L34-L57)：不等于本稿已确认设计。
- [能力选择、重验与成本](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Execution/Resolution/ResolutionRunner.AbilityActivationWork.cs#L127-L260)、[反制与成功发动](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/EffectActivationRuleHandler.cs#L85-L143)及[较新成本说明](https://github.com/Time-Block-Hero/time-block-hero-unified/blob/7d93d85f1027407853aa63d3d1b7905bf0d76ab2/Developer_docs/current-game-logic/domain/04-costs-and-failure.zh-CN.md)。

本轮只读检查源码，没有运行 Unity 对局，也没有修改 unified 或规则包。规则文档的构建与链接检查不能代替游戏实现验收。所有待审阅选择见[问题汇总](pending.md)。


## 资源牌类型修订

来源为用户对第二章的本轮明确修订，不是旧文提炼或对现行程序的归纳：

- 基础类型改为随从牌、法术牌、资源牌；“遗失的智慧”从原法术分类改为资源牌。
- 资源可与其他卡牌共存；玩家放置／移动进入时触发其拾取效果，收益结算给触发的玩家；后续问答确认，仅无玩家控制的野怪移动不触发，玩家控制的中立职业随从可拾取。
- 拾取完毕后移出游戏；后续问答确认，无论有无拥有者，都不进入任何玩家虚空；未拾取的场上资源跨回合保留。
- 资源通常不进入玩家卡组循环；若效果使其进入，则可以正常放置，保留共存特性，支持先放资源再叠牌拾取。

用户进一步明确资源为一次性收益载体：拾取后本体消失，只留下效果结果，不将已拾取资源作为玩家持有卡或虚空中的卡继续保留。

规则正文、拾取词条、回合末清理和审阅记录已同步。原两类方案与一概按中立职业排除拾取的默认描述已撤下；剩余边界见[资源牌审阅项](pending.md#资源牌剩余边界)。本轮范围仅为 Wiki 和生成文件，卡牌数据、编辑器类型支持与游戏实现未迁移，不能据新规则文字声称实现已经支持资源类型。


## 玩家与控制关系的出处

第二章 2.1 的“拥有者”“控制者”、默认二者相同及友敌关系，来源为[旧长版第 2.2—2.4 节](https://github.com/Time-Block-Hero/time-block-hero-unified/blob/7d93d85f1027407853aa63d3d1b7905bf0d76ab2/Developer_docs/Time-Block%20Heroes%20Official%20Rulebook.zh-CN.md#L72-L84)。旧文分别定义卡牌归属与当前操作、友方关系，不能由此忽略新版尚待裁定的生命周期规则。

原稿的“改变控制权不改变拥有者”“控制权变化不改变职业”是编辑者依据独立概念作出的归纳，不是旧文明确写出的两项规则，也尚未得到用户确认。现已从正文的断言中撤下并记录此边界，后续在控制权章节审阅。

## 第二章结构与实例属性修订

用户确认随从、法术、资源须为平级小节；卡牌信息只描述原始定义，当前数值、耐久、建造进度与使用记录等属于进入游戏后的实例。资源由效果生成时必须使用无任何卡牌的空格，不能因共存能力而生成到已有卡牌或资源上。特殊手牌放置与生成保持区分。

按用户要求，为十二章加入分级小节编号，并在第二章加入棋盘空间图与区域状态迁移图。图示只表达当前条款，不自动新增未审阅的迁移边。第三、第四章此次仅增加编号，规则正文保持原待审阅内容。
