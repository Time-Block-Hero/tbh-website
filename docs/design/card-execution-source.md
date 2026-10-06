# 卡牌执行单一源（schema 5）

中央任务：[Unified #123](https://github.com/Time-Block-Hero/time-block-hero-unified/issues/123)，父任务 #61。

`data/cards.json` 是唯一手工维护的卡牌设计和执行定义。`executionSchemaVersion=21` 复用 Rules 当前语言，不创建另一套 DSL。`shared.statuses` 保存生产共享状态；每卡 `execution.abilities / continuousEffects / plans` 直接保存现有 schema21 数组，保持标识与顺序。

## 权威字段与映射

| 输入 | 编译文档字段 / 处理 |
| --- | --- |
| `uid` | `card.id` 和 `card.uid`；永不使用展示编号作执行身份 |
| `id` | `card.displayId`；重排不改能力/计划标识 |
| `parentUid, collectionKind, nameKey, englishName, cardType, classId, rarity, costAmount, durability, rulesText` | 同名直接复制 |
| `attack, health, movement, tribes` | 随从同名复制；非随从固定 `0,0,0,[]` |
| `collectable, costResource` | 普通卡同名复制；Hero 的 runtime collectable=false，界面资源分类 Hero 映射 Star（不改设计字段） |
| `arrows` | Permanent 原样复制；OneTime 不生成永久箭头，使用原有 Consumable arrowRules；其方向集合必须与设计 arrows 一致 |
| `tags` 与 `execution.keywordTags` | 有序去重合并；后者只承载卡文已经声明的原生关键词，不能覆盖设计属性 |
| `execution.runtimeSupport` | `card.runtimeSupport` |
| `execution.properties` | 仅执行字段白名单，见下文；不允许覆盖原生字段 |
| `execution.abilities / continuousEffects / plans` | bundle 同名数组原样深拷贝 |
| `shared.statuses` | 通用内存编译文档的 `statuses` 数组 |
| 美术 | 调用方提供当前 Presentation 绑定的 `artPaths[uid]`，无绑定为 null 以走既有默认图；禁止读取网站旧 artPath |

`properties` 白名单：`constructionTarget, runtimeSupportNote, upgradeToCardId, upgradeToCardIds, placeCost, arrowRules, quantitizedCardTags, continuousEffectRefs, grantableContinuousEffectRefs, abilityRefs, textValueBindings, attackRange, progressEffects`。未知字段拒绝，数值属性无通用覆盖入口。

一次性迁移来源为 Website `a198c4b0c21886501adbabeba22eda4ed019600f` 与 Rules `a46014e674da86c47831a27b4dbbaa62f728bd5b`。逐卡 UID、原 bundle 规范摘要、原生差异、设计/执行摘要见 `revisions/2026-10-05-execution-migration.json`。英雄词汇、一次性箭头及六张卡的附加原生关键词均作为显式通用映射处理，无逐 UID 运行时分支。

## 审阅与安全编辑

`reviewedDesignHash` 是固定语义字段集合的 canonical JSON SHA-256：UID、父子/收集关系、类型、阵营、稀有度、collectable、成本、攻击/生命/移动/耐久、箭头、种族、tags、卡文。对象键按字典顺序排序，数组保持顺序，缺省字段用 null。排除显示编号、中英文名、美术和 execution。名称是展示字段，改名不使执行失效。

`executionHash` 对完整 execution 去除 reviewedDesignHash 后执行相同规范化；改变效果必须重新做内容场景验证并记录新的摘要。更新 hash 本身不是语义审阅或运行证据。迁移报告是冻结审阅证据，不是第二个可编辑卡牌源。

普通表单编辑保留 execution/shared。修改语义字段后可保存草稿，但提示待复核；正式导出拒绝陈旧绑定及非 Implemented 卡牌。新增/衍生卡分配新 UID，execution 一律 Planned，清空父卡计划和能力。删除其他执行定义引用的卡会显示具体路径。旧 schema 草稿隔离到浏览器独立键，保留原数据并提供“导出 JSON”入口，不能直接覆盖 schema5。旧 schema4 的历史导出/测试仍可读取，但不能编译成当前生产文档。

## 对 Unified 的接口

唯一映射在 `tools/card-execution.mjs` 的 `toAuthoringDocument`。消费者调用源 checkout 同一提交的 CLI，避免维护第二份 Python 映射：

```sh
node tools/export-executable-cards.mjs --input data/cards.json --options /tmp/content-options.json --output /tmp/authoring.json
```

options 包含 `contentId, contentVersion, source, artPaths`。source 必须由消费管线填入 Rules 的明确来源合同。CLI 不允许跳过生产校验。输出为 `authoringVersion, schemaVersion, contentId, contentVersion, source, statuses, cardBundles`，传给 Rules 的 `compile_authoring_document(document)`。Website 检查源结构、陈旧审阅、身份与卡牌引用；Rules 的所有权/词汇/循环/orphan 验证和 C# loader 仍必须执行。Node 导出成功不等于游戏执行验收完成。

`export-card-designs.mjs` 的 schema5 导出为 envelope schema2，保留每卡 execution、executionSha256、shared，并包含完整 `sourceDataset` 以供同一 adapter 消费。固定 commit 导出严格校验执行；dirty 导出允许待实现草稿，仍标记 commit=null/dirty=true，不能作为发布证据。`formal_card_ref.json` 是生成的开发预览，不是正式发布源。

## 验证记录

原始 Website 的 `card-electricity-revision` 用例漏记 `db210674` 的四卡调整。`revisions/2026-10-05-baseline-test-repair.json` 补齐精确 before/after，保留原断言强度，未改变生产设计。

浏览器验收使用独立 `/tmp` 数据副本：新建卡、保存卡文、待复核提示、新建衍生卡、重载通过；持久化后两张新卡均 Planned 且无父卡执行标识，147张原执行内容及 shared 完全保留。浏览器下载事件捕获超时，完整导出往返由 Node 测试验证；不宣称浏览器下载验收通过。资源采用隔离副本的受限路径，因此本检查不代替 Presentation 视觉验收。

2026-10-05 用户裁决已落实：MCC-012-01（蜂群无人机幻影）的原生 `durability` 从0改为1，
与已有卡文和旧 Rules bundle 一致。通过现有 `designHash` API 重新绑定审阅，恢复 Implemented；
没有新增原生字段覆盖，也没有修改其他卡牌玩法。迁移报告保留最初的差异和待决原因于
`differences` / `resolutions.reason`，在 `resolutions` 记录裁决，当前 `unresolved` 为空。
全部147个 bundle 与冻结 Rules 原 bundle 逐结构等价，共享 statuses 保持一致，正式源校验解封。
这项迁移等价检查不代替 Unified 对最终候选的运行和游戏验收。
