---
title: 来源与确认记录
id: maintenance/sources
status: draft
---

本页记录已经确认的范围、草案来源和资料的使用边界，不复制讨论全文或程序实现说明。

## 本轮已确认决策

**编写依据的黄金准则：** 用户在本次规则审阅中明确确认的修正优先于旧 Rulebook、开发文档和当前实现；后续章节必须承接这些决定。新的明确修正替代同一问题的旧决定，未确认的提案不能自行升格。程序实现用于说明现状，不能推翻已确认设计。

这是规则书的来源与维护约定，不是游戏内“模式、卡牌、关键词、状态”的优先级；游戏内裁定仍依[第一章](../common/principles.md)。编号、流程图、平行类型描述、章节归属及逐章审阅要求已持久化到 Wiki 源码目录的 AGENTS.md。

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

以下保留初稿的取材记录；其中阶段权限、时动结构、窗口外选择和回合末取样已由下方“第三章本轮审阅修订”替代。实现证据不自动等于当前规则。

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
- 资源可与其他卡牌共存；玩家放置／移动进入时触发其拾取效果，收益结算给触发的玩家；后续问答确认，拾取资格按玩家控制关系判断；本轮进一步统一为“无控制者的卡牌不触发拾取”。
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


## 第三章本轮审阅修订

本次用户明确修订第三章，并确认两项追问：窗口外未指定自动方式时默认从合法选项随机选择；第四种收集属性为英雄卡。

- 回合开始刷新移动、攻击及按回合统计的效果次数；抽牌引发效果不等待玩家选择。
- 操作窗口按玩家判断：同步时停／购买双方都开；每人独立时动仅本人开；声明完成后关闭，阶段结束和回合结束没有窗口。
- 今后的起始效果优先采用时停阶段开始。原稿统一“回合开始效果”节点撤下；需要在抽牌前生效的额外数量修正不能机械后移。
- 时停是冻结及独立部署机制，冻结对手的战场、星能和手牌量等。双方合法同格放置在结束时统一湮灭进弃牌堆，先应用有效例外。原稿遗漏了这一设计。
- 每位玩家有自己的时动阶段；正常 N 人每回合 N 个。原稿的单一阶段／双窗口模型被替代，行动顺序小节移动为 3.4.1。
- 进入回合结束的同一瞬间固定全部玩家手牌清单，后续效果新生成或抽到的手牌不追加。法术回合末清理，随从和资源通常留场。
- 收集属性完整定义集中在 2.3.1；“衍生卡不因身份自动消失”只在这里解释，回合结束引用该处。

本稿将冻结基准明确放在时停开始效果之前，以避免开始效果结果是否提前揭示的歧义；这是流程细化，仍随第三章审阅。湮灭的事件交互和多重冲突顺序没有借实现补造。

### 时停主动能力的卡面核查

只读检查当前网站 137 张卡牌，未找到明确允许玩家在时停主动发动的卡面。先前草案把旧开发文档和实现的允许阶段当作设计依据，证据不足，现已撤下许可。

- [刺客-J、预判投弹](https://github.com/Time-Block-Hero/tbh-website/blob/05bd9a49875b18a33398d0e7dde5b2dc85406a27/data/cards.json#L343-L390)均为“入场”加“慢速”，不是时停主动能力。
- [科学纪元驱魔师](https://github.com/Time-Block-Hero/tbh-website/blob/05bd9a49875b18a33398d0e7dde5b2dc85406a27/data/cards.json#L295-L305)在时停响应对方法术，是触发反制，不能证明主动许可。
- [空亡时主](https://github.com/Time-Block-Hero/tbh-website/blob/05bd9a49875b18a33398d0e7dde5b2dc85406a27/data/cards.json#L1084-L1094)为击杀奖励提供额外时动阶段与时停计数修正。
- [裂隙惘生德雷克](https://github.com/Time-Block-Hero/tbh-website/blob/05bd9a49875b18a33398d0e7dde5b2dc85406a27/data/cards.json#L1329-L1339)明确允许非己方领土放置，并免于时停重合湮灭。此处采用卡表的“惘生”名称，对应本次讨论的德雷克。

较新开发文档曾记录时停启动能力，并将共享格冲突列为未支持范围；这些是实现历史，不能覆盖本轮用户确认的规则。未运行游戏，也未宣称新规则已经由现有实现支持。

### 旧卡阶段文案的后续核对

当前卡表中的诺亚、皇子阿列斯塔、星能采矿场、米拉-10K 等仍有回合开始触发；重型军用驮兽涉及额外抽牌数量，训练服务机群涉及抽牌累计后赋予起始收益。这些文本须逐项区分“时停开始触发”与“抽牌前的数量修正”，本轮不修改卡牌数据。

探险者航线写“时动阶段开始时”而没有限定主语，需结合新的每人独立阶段语义明确。英雄卡作为第四收集属性已由用户确认，但编辑器目前仍用收集布尔、英雄标签与衍生编号表达；未进行数据或工具迁移。

## 区域迁移与平行生命周期修订

- 用户确认任意其他区域进入虚空均属移除，战场进入弃牌堆包含随从死亡与法术清理。
- 用户确认 modifier 按“虚空 → 商店 → 弃牌堆 → 牌堆 → 手牌 → 战场”裁定：正向保留、逆向清除并恢复原始状态。排序不是必须逐站经过的合法迁移路线。
- 第二章补齐随从、法术、资源相同的生成、共存、收益、持续、离场及卡组循环条目；同步第六章与关键词引用。
- 流程与状态图改用 Markdown Mermaid 源码，补入商店与全部移除来源；棋盘空间插图继续使用 SVG。
- 额外卡组的排序、具体实例数据如何初始化及转移触发顺序保留待细化；未修改游戏实现或卡牌数据。

## 第四章行动修订的来源与确认

- 用户将操作窗口定义与图示移到 4.1.1；3.1.1 仅保留链接。
- 建造中以用户“仅生命值有效”为准，攻击、移动能力、箭头及效果关闭／置零，完成后解锁。原消息关闭清单重复出现“生命值”，编辑暂按“移动能力”的笔误理解，已向用户说明。
- 用户确认明示放置成本方案；入场目标选择、拾取时序及成本改变放置条件的问题另行讨论。
- 用户将拾取主体统一为玩家控制的卡牌，收益给其控制者；无控制者的卡牌不触发。旧稿关于中立职业的额外说明来自旧实现限制，不属于用户设计，已从规则正文删除。
- 用户确认普通移动由玩家选终点、系统选路线；瞬移花费 1 行动点；冲撞四向直线逐格付费、遇阻或额度耗尽停止。
- 用户取消击杀推进，删除正文 ACT-007；后续移动依普通移动规则。主动能力默认每回合一次，随从与法术一致；攻击目标限定非己方随从。

入场时序的实现参照来自 unified 引用的规则包 `2b0ec49079cbf7e0708100d02a356618d77c00ca`：普通放置先使卡牌入场，入场触发正文中再选目标；拾取本体提前转入虚空，入场触发先于拾取收益。该资源处理已与确认规则冲突，因此不能整段照搬。实现没有独立放置成本环节，也不能回答支付后箭头改变的问题。证据见[放置处理](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Match/PlaceCardCommandHandler.cs)、[拾取处理](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/PickupCollectionPolicy.cs#L77-L118)和[事件顺序](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Execution/Settlement/SettlementEventLifecycle.cs#L99-L104)。


## 第五至第七章起草与核对

用户本次明确授权一并起草第五、六、七章，完成后集中审阅。章节起草不表示其中新增裁定已获批准；已确认规则继续优先，新增方案在正文和待裁定页分别标明。本轮仍仅修改 website Wiki，没有修改卡表或游戏实现，也没有运行 Unity 对局。

### 第五章：星能、商店与购买

旧长版的经济、商店和购买章节提供默认候选数、刷新、购买与牌组循环的草案依据；用户确认的区域正逆向规则及明示放置成本覆盖旧版不一致处理。

- [商店候选生成](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/ShopOfferPolicy.cs)：实现先将旧候选送回额外卡组，再将新候选移入商店。旧文“展示不消耗”不能直接等同于实体始终留在额外卡组；5.2.2 将此区别列为 ECO-R01，未擅自为额外卡组添加 modifier 排序。
- [阶段权限](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/PhasePolicy.cs)：当前刷新次数和剩余候选条件仅作为 5.3 草案参考。候选生成也不能据当前程序概括为全部组合等概率随机。
- [购买交易](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Match/PurchaseTransaction.cs)、[完成购买](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Match/PurchaseTransaction.Commit.cs)、[购买结算](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Execution/Resolution/ResolutionRunner.PurchaseWork.cs)：付款、购买前取消、成功事实及支付后续有专门顺序。正文将该顺序作为待审阅草案，未把它扩展成所有行动的通用支付规则。支付后对象或目的地失效的实现失败路径不能替代玩法裁定。

### 第六章：伤害、状态与生命周期

用户确认的随从死亡进入弃牌堆、资源拾取后消失、建造封锁和区域正逆向 modifier 处理均直接保留。旧文关于英雄离场例外、资源进入虚空及进场统一重置的处理不覆盖这些决定。

- [伤害](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/DamageRuleHandler.cs)与[治疗](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/HealRuleHandler.cs)：当前依次处理圣盾、护甲和生命，仅实际生命伤害产生受伤事实。零伤害、溢出伤害的计数及相关触发资格仍列为待审阅细则。
- [有效属性变化](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/EffectiveAttributeSynchronizer.cs)：最大生命降低时截断当前值，与旧短版等量扣减不同；6.2 使用具体例子呈现差异，保留 LIF-R01。
- [死亡处理](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/AttributeRuleHandler.cs)：当前先离场再产生死亡事件，且这里没有完成新规则要求的通用死亡转弃牌堆；旧长版则先处理死亡效果再离场。当时 6.3 将先离场列为提案；用户随后确认先清理本体、再结算死亡效果，见下方死亡修订记录。此确认不声称新死亡规则已实现。
- [生成](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/CreateCardRuleHandler.cs)、[从牌堆放置](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/PlaceFromPileRuleHandler.cs)与[变形](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Server/Domain/Rules/TransformRuleHandler.cs)：分别说明新实例、既有牌移动和原实例变形的区别。复制继承什么、变形保留什么及新入场行动额度仍待裁定。

控制权变化不自动改变拥有者、职业或全部实例状态的描述，保持“供审阅的默认方案”，未将此前撤回的归纳重新写成已确认规则。耐久退出行为也未借当前实现补定。

### 第七章：效果与时序

旧长版的结算、选择、成本和后续触发章节提供发生前改写、完成后触发、嵌套处理后返回的草案基础；正文去除工程结构，直接描述玩家可观察的步骤。操作窗口、窗口外合法随机、主动能力默认次数及明确例外原则沿用用户决定。

同时触发排序、来源离场后的触发资格、多项成本插入、死亡与受伤触发先后及强制循环终止没有借内部编号或失败保护机制定成游戏规则。7.5.3 的“持续变化 → 拾取 → 入场效果”是供审阅方案；它与当前实现的入场先于拾取收益不同，也没有得到用户确认。资源本体在拾取完成后消失则是已确认规则。

第五至第七章的全部问题集中列于[待裁定问题](pending.md)。流程图表达正文中的步骤与提案，不以图示箭头赋予额外行动权限。


## 卡牌效果设计与通用结算拆章修订

用户本轮明确指出原第七章混合了两个主题。现拆为第七章“卡牌效果设计”和第八章“通用结算逻辑”，后续章节顺延；原 `effects` 页面 ID 留给通用结算，新效果设计页为 `card-effects`。正文仍待审阅，原来源记录保留当时章号与取材过程，不表示旧提案继续生效。

### 本轮明确修正

- 操作窗口条款由 RND-010 改为 ACT-010，归属第四章；旧编号不再作为现行编号。
- 攻击可选当前攻击范围内的非己方随从，常规随从默认范围 1；反击以受击者自己的攻击范围检查攻击者。范围已确认，其余反击状态与重验时点继续审阅。
- 删除星能段落中无关的护甲说明；购买步骤的“该拷贝”改为“这张牌”，不改变同名不同实例的含义。
- 删除与图 2-B 重复的图 5-B，经济章直接引用区域图；图 2-B 补齐商店上货和刷新退回。
- 用户随后明确选择“采用区域划分，退回时保留 modifier”：未陈列牌在额外卡组、已陈列牌在商店；刷新退回并洗牌，再取最多五张。第二、五、六章及图 2-B 同步确认，刷新退回保留修正；不据此擅自确定额外卡组的一般排序或其他转区继承。

### 第七、八章的新主要依据

上一稿第七章主要沿旧长版提炼，再以固定实现核对局部行为；没有充分采用以下两份文档。此次按用户要求重新阅读，并以其概念边界组织草稿：

- [唯一术语表：效果／能力及事件目录](https://github.com/Time-Block-Hero/time-block-hero-unified/blob/7d93d85f1027407853aa63d3d1b7905bf0d76ab2/Developer_docs/current-game-logic/reference/00-typed-terminology.zh-CN.md#L68-L225)：用于区分主动、触发、持续、替换，以及声明／成功／取消、实际伤害／抵挡等事实。术语表描述当前实现，不覆盖本对话确认的窗口、资源类型或入场定义。
- [时点架构审计：能力设计维度与时点模型](https://github.com/Time-Block-Hero/time-block-hero-unified/blob/7d93d85f1027407853aa63d3d1b7905bf0d76ab2/Developer_docs/effect-timing-architecture-review.zh-CN.md#L138-L253)：用于分离工作方式、结果、作用范围、期限与限次，并将各行动的独立时序、整体变化、待结算触发与检查节点翻译为游戏语言。

时点审计自身标为重构决策草案。其 5.3 明确不应立即递归执行刚发现的触发；新 8.5 据此撤下旧 EFF-005 的默认，保留整体变化范围、新触发插入位置及返回点供玩法裁定。原结算条款 EFF 编号改为 SET，设计条款独立使用 DES；原分类 EFF-001 已被新设计目录替代。

两份资料也不能混用成一套所谓现行完备规则：审计附录曾写入指令能力实现，较新的术语表已明确其删除，因此新设计目录不将指令能力列为正式第五类。审计还记录不同成本路径的触发处理尚未统一；不得把这两条工程路径分别变成玩家规则。术语表当前允许的时停主动阶段不覆盖用户已明确取消的时停主动能力。

当前实现只作为可复查证据，仍按 unified 所引用的规则包 `2b0ec49079cbf7e0708100d02a356618d77c00ca` 只读核对。新第七章列的是设计选项与必要说明，不是程序字段、穷举批准全集或实现支持承诺；新第八章也没有照搬程序内部编号作为触发顺序。所有新增玩法仍保持审阅边界。


## 死亡定义、死亡顺序与主定义归并

本轮依据用户直接反馈修订，未用旧文或当前实现替代决定：

- 死亡由当前生命降至 0 或以下，或明确“消灭”判定；直接将卡牌从战场移入弃牌堆、献祭随从不算死亡。离场目的地不能反推原因。
- 6.3.1 的先清理本体、后结算死亡效果由提案转为确认。保留死亡格供“在其所在格召唤僵尸”使用；本体不再占格。受伤触发能否先救回、多个死亡与胜负检查排序、其他离场前数值仍未定。
- 普查所有导航页面，将拾取、建造、操作窗口、主动次数、回合末快照、抽牌、商店区域与刷新、修正继承及持续贡献的重复定义改为主定义引用。完整归属见[规则主定义索引](index.md#规则主定义索引)。
- 三类卡牌的平级生命周期、放置与移动的各自案例及必要流程图继续保留。历史来源记录不删除，但旧死亡顺序提案不再作为未决选择。

本轮只改规则文档和生成数据，不迁移游戏实现，也不把整章草案自动批准为正式规则。


## 第七章设计手册与字典子页

用户指出原设计目录不能直接帮助作者设计四类效果，并确认改为设计指南、四类独立模板和共享字典。此轮按该结构实施：模板分别列出必填、条件必填、默认引用、完整教学实例与含糊写法修正；共享参数按事件、对象与范围、选择、条件、成本、结果与贡献、期限、次数拆成八页。

内容仍以用户确认规则为最高依据，参考此前已记录的唯一术语表与时点架构审计，将其表达维度翻译成游戏语言，不复制程序枚举、接口或优先级编号。事件角色、存在期限与生效条件、统计对象／期间／消耗事实均单独填写；已取消时停主动能力不回归，资源和死亡仍依最新定义。

战地修复、时动供能、据点指挥和前线补给均为教学设计，未写入卡表。模板内容齐全不表示通用时序已全部决定；每个示例明确引用未决交互，新增选项仍按具体条目的规则边界审阅。原第七章页面 ID 保留，迁移的深链接记录于编写交接文件规定的重定向表。

## 建造归属、放置顺序与中立卡交叉审阅

2026-09-17，用户明确要求建造作为特殊放置在 4.2 定义；已移至 4.2.3，12.6 保留查阅入口。第二章进一步直述额外卡组与商店为两个独立区域，刷新退回保留 modifier 的既有决定不变。

用户确认放置时先结算入场效果，再结算拾取。4.2.2 维护主定义，8.5.3 只跟进未定交互；此前来源记录中的“持续变化 → 拾取 → 入场效果”是未获批准的旧提案，现已被此决定取代。目标选择、嵌套排序与中途离场仍未由这项相对顺序决定。

用户提出拥有者与控制者合并、另可记录创建者；本轮根据真实卡牌支持该方向，仍将跨玩家转区、默认离场接收方、临时归还与已产生效果归属列为 LIF-R05。没有将这一提案悄然写成全部边界已定的通则。

按用户要求，逐张交叉审阅网站卡表中的全部 49 张中立牌，含 36 张可收集与 13 张不可收集。来源指纹、单卡覆盖、实际冲突和可复现的歧义用例见[中立卡牌交叉审阅](neutral-card-audit.md)。未修改卡牌数据或游戏实现；没有以旧实现压过资源牌、冻结时停等已确认规则。

## 第七章按实际内容结构重写

用户指出 7.2–7.5 的设计结构与现有设计不符，要求直接核对 unified 正在使用的卡牌数据，并确认彻底修正结构与字典展示。本轮据此撤下“四种平级模板”的组织方案。

### 直接核对的内容版本

- unified 的 rules 依赖锁定 `2b0ec49079cbf7e0708100d02a356618d77c00ca`。[实际加载入口](https://github.com/Time-Block-Hero/time-block-hero-unified/blob/7d93d85f1027407853aa63d3d1b7905bf0d76ab2/Assets/Scripts/Battle/Bootstrap/GameManager.cs#L51-L56)指定 `TimeBlockRules/GameContent/v1/game-content`，并不是名为 cards.json 的独立运行文件，也不是 reference-v1 测试内容。
- [运行内容](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Resources/TimeBlockRules/GameContent/v1/game-content.json)：schemaVersion 20，104 cards、26 abilities、62 continuousEffects、89 plans、10 statuses。卡牌引用能力及持续效果；主动能力目前只有 Activated；触发和结算替换位于持续效果的 contributions 中。
- [持续效果定义](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Content/Schema/ContinuousEffects/ContinuousEffectDefinitionData.cs)区分 lifetime、activeCondition、affectedScope、contributions。[作用定义](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Runtime/Content/Schema/ContinuousEffects/ContributionDefinitionData.cs)对应触发、结算替换、属性修正、数值修正、移动规则和放置规则六类。
- [单卡作者源示例：星能石](https://github.com/Time-Block-Hero/tbh-rules-engine/blob/2b0ec49079cbf7e0708100d02a356618d77c00ca/Authoring~/Authoring/v1/cards/FNG-014.card.json)包含 card、abilities、continuousEffects、plans；当前入场能力通过持续效果向自身提供触发，然后引用执行内容。该运行 ID 与网站设计表不同，引用按名称与版本匹配，不进行身份迁移。

### 前稿的问题与本次边界

此前编辑使用术语表中的四个概念，又采用时点架构审计 §4.1 提议的四类能力形状，自行扩写了四套平级必填模板与虚构教学卡。[现行术语表 §3](https://github.com/Time-Block-Hero/time-block-hero-unified/blob/7d93d85f1027407853aa63d3d1b7905bf0d76ab2/Developer_docs/current-game-logic/reference/00-typed-terminology.zh-CN.md#L70-L105)实际已说明触发／替换由持续效果提供，旧稿没有忠实保留该关系。审计的重构提案不能当成运行结构，也不能当成用户已确认玩法。

本轮将组织关系翻译成游戏设计语言，不要求读者填写程序优先级、引用 ID 或执行节点。触发可以观察发生前和发生后节点；它执行内容，替换则直接改写匹配结算。持续效果的受影响对象不自动等于触发事件对象或执行目标；主动的限次与外层发生次数条件也不混成一个通用字段。

旧运行内容仍有时停主动、充能成本、旧资源类型及旧死亡／区域处理等差异；它们不因结构被采用而恢复。用户确认的时动主动、星能、资源牌、死亡原因、入场先于拾取等继续作为玩法依据。正文示例只采用能与已确认规则兼容的具体维度，未定交互仍引用审阅表。

7.6 改为按类别横向比较词条，复杂边界按需展开，词条保留固定链接及独立搜索。本次只修改网站 Wiki 和必要渲染支持，未改网站卡表、unified 或规则包实现。

## 耐久状态与进度效果

用户确认剩余耐久，以及“一张牌累计被打出几次”等跨卡组循环的实例记录，不随逆向转区清除 modifier 重置。耐久只对具有该机制的卡牌适用；战场实际进入弃牌堆时减 1，之后检查耗尽并移除至虚空。正文主定义为 6.2.4–6.2.5；中立卡审阅 N-02 已更新，原始卡表耐久字段冲突仍单独保留。

对机械天国全部 22 张当前设计逐张阅读后，将累计机制统一描述为「进度」：累计只改状态、不进入效果连锁，达标才产生完成触发。用户明确确认循环扣除目标并保留余量、多次跨阈值产生相应次数的完成效果，登记完成时立即扣除或标记。一次性进度以完成状态停止自然重复。7.4.1 将其归为触发效果特例，6.2.6 维护状态与完成规则；建造不被自动合并。

用户确认「超越进制」的目标值比例向上取整，并在补充问答中确认降低后立即检查已有进度、按新目标扣除。用户确认外部直接触发进度效果不改变原进度，并明确要求「借时蜉蝣」「集群主脑-埃米莉丝」将触发对象改为进度效果。本次卡表改动仅限 MCC-010、MCC-005 的这两条文案，保留原成本、方向、范围、随机方式与三项目标数量；网站当前编辑器离线数据与人物快照随源表生成，未修改 unified 或规则包。生成时发现 formal_card_ref.json 与 ReferenceDocs/cards (1).json 仍采用旧卡表身份，相同数字 ID 对应不同卡牌，且找不到这两张牌的同名条目；本轮未迁移这两份历史参考表，避免按旧 ID 覆盖其他卡牌。

有效计数区域、跨区／变形保留、外部触发已完成任务以及同一牌多项进度的选取等尚未完整裁定，统一见 LIF-R09／LIF-R10。不因采用新机制就将这些缺口默认为已决定。

## 被保留的回合数

用户明确要求新增这一实例状态：回合结束实际被保留在手牌中时 +1，手牌回到牌堆或被弃置等区域逆向转移清零。按已确认正逆向通则，手牌打出到战场保留计数，供入场及其他效果读取；它与跨卡组循环保留的耐久、整局打出次数不同。

参照当前烈阳教会设计中的太阳雨、见习阳炎射击、日珀蜂蜜、耀斑连射与耀变星能石，6.2.7 维护统一计数；第二、三章、保留关键词与次数字典只引用。烈阳圣女、烈阳恩典、高等阳炎术的“视作”效果，以及唱诗班诗童等保留触发的交互，单独列为 LIF-R11，不将本次累计／重置决定扩成未经确认的触发或到期排序。卡牌数据与游戏实现未修改。

## 状态保留类型与机械天国进度卡文

用户要求明确状态的两种转区政策并梳理特殊状态／buff。本轮以「跨区保留型状态」和「逆向重置型状态」命名：只决定区域转移时是否保留记录，与到期、消耗、原生能力和持续来源的有效性分开。已确认耐久、整局打出次数跨区保留；保留回合数逆向归零。后天攻击、护甲、圣盾、保留等修正采用既有 modifier 处理，不自动删除卡面原生能力。无法由现有规则确定的初始化和完成标记在速查表标明待裁定。

用户在本轮问答中确认：普通进度的当前值默认逆向转区归零，特殊任务明确写保留例外；迷离之剑-烬白的拾取变身进度为一次性。

按当前网站权威卡表的名称与 ID 一起核对，13 张累计卡改为循环进度格式，迷离之剑改为一次性进度，超越进制明确作用于进度目标及向上取整，共 15 张卡的 rulesText 更新。采用 `[循环／一次性进度：目标] 计数：……。完成：……。`，保留原有奖励、阈值、目标与附加能力；不改卡牌数值字段、身份或美术。借时蜉蝣上一轮的直接触发文案保持，集群主脑保留随机触发三个进度效果。

仅生成当前编辑器备用数据、人物及图鉴快照；两份旧身份参考表继续保留，未按重排的数字 ID 迁移。游戏仓库与可执行效果实现不在本次范围。
