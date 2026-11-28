# 本轮内容执行合同（schema22）

关联：[合同#168](https://github.com/Time-Block-Hero/time-block-hero-unified/issues/168)、[内容#173](https://github.com/Time-Block-Hero/time-block-hero-unified/issues/173)。本页描述Website与Rules的内容接口；玩法主定义仍在Wiki，生产定义仅在`data/cards.json`。

- 原版/升级由stable UID绑定：`upgradeOfUid`、`tripleUpgradeUid`。`canTriple:false`用于明确不可升级，原英雄、升级版与事件也不得普通三连。旧`upgradeToCardIds`继续表示效果选项，不能作为三连映射。
- Event `costAmount:0`，`eventUnique`明确唯一属性；正文监听`EventResolved`，合成正文监听产物`CardSynthesized`，均以`WhileHostExists`/`Self`持续效果承载。获得入口为`CardObtained`。
- `ShopService`隐式作用于冻结的SourceController。`operation`为`GrantRefresh`（正整数`amount`）、`DiscountCurrent`（减价正整数`amount`）、`DiscountRound`（本回合减价正整数`amount`）、`FreeNextRefresh`（无amount）、`QueueRefreshFilter`（`costLessThan`或`costGreaterThan`正整数；仅其一）。成功主动刷新才消耗排队效果。
- `UpgradeHero`空参数：同玩家英雄原地变为对应升级定义，保留英雄身份、占格和已有消耗，按属性差值调整，不算三连。
- `OwnedZones`选择明确`zones:[DrawPile,DiscardPile,Hand,Battlefield]`；返回该玩家当前控制的卡实例，以稳定实例去重。卡文写随从时过滤`cardType:Minion`；未明示排除英雄就不扩大过滤。战略置顶不允许英雄离场（目标过滤`isHero:false`）。
- `AddModifier`的`ArrowLayer/UnlitDirections/LightRandom`支持`arrowKind:Consumable|Permanent`（缺省Permanent），永久配置使用`lifetime:{type:CardPermanent}`。一次点亮1方向；点亮2方向由连续两步表达，各步重新读取合法方向。
- 永久箭头需求零：`AddModifier`，`channel:RuleParameter`、`rule:RequiredPlacementArrowCount`、`operation:Set`、`value:0`、`lifetime:{type:CardPermanent}`。
- 永久基础攻击/生命/速度沿现有`GrowCardBase`；三连需继承所有永久额外增长。金扳手升级的`ModifierBatch`用`CardPermanent`生命周期，旧`Permanent`仍保留旧逆向重置语义。
- 下一回合额外抽牌沿现有`ScheduleDraw amount`；置顶沿`TransferCard destinationZone:DrawPile,destinationPosition:Top`，包括牌堆内重排。
- 决战时刻沿现有`CreateCard durability:3,buffPersistence:PermanentCardOverride`，默认获得目的地显式写DiscardPile。
- 家园卫士持续贡献`AttackRule`，`rule:OwnTerritoryOnly`；双击为`Windfury`。所有英雄判断及原始费用通过定义/实例状态，不用生产UID分支。

以上为跨仓库共同实现的接口，不表示只有结构校验就已通过真实结算验收。完整编译、Rules合成fixture与Unified真实卡接受测试须使用相同source revisions。
