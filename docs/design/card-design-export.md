# 卡牌设计身份与导出合同

本合同交付声明性设计数据，不编译卡牌效果，也不声明游戏已经支持这些设计。规则语义的作者化、准入及执行验收由 rules 仓库负责。

## 身份与版本

`data/cards.json` schemaVersion 4 为每张卡保存一次性分配的 UUID v4 `uid`。展示编号 `id` 可以重排，姓名、英文名和 artworkKey 可以改名；这些操作均不得重建 UID。新建卡和复制出的衍生卡分配新 UID。`parentUid` 明确为父卡 UID 或 null，关系不依赖编号字符串。

`cardType` 为 `Minion`、`Spell`、`Resource`。`collectionKind` 为 `Collectible`、`Hero`、`Token`、`NonCollectible`，分别对应 Wiki 的可收集、英雄、衍生、不可收集。兼容编辑器的 collectable 与 InitialHero 标签须与四分类一致；英雄不能因 collectable=true 被视作普通构筑卡。

`data/card-identity-migration.json` 固定原设计基线提交和原 cards 文件 SHA-256，以及137条 `baselineDisplayId → uid` 关系。它不是当前编号索引；重排后不得改写历史编号。四张排除、四张明确空效果、七张资源类型迁移以 UID 数组记录。两份智慧、两份野果分别保留身份。此文件经评审后不重新生成；后续变动必须提供明确迁移和差异记录。

`data/card-design-source-revision.json` 保存后续批准的身份与收录策略修订。历史 `issue78-20260927` 对应[统一任务 #78](https://github.com/Time-Block-Hero/time-block-hero-unified/issues/78)：保留历史 bridge 原字节，引用 `data/baselines/issue44-20260920/revision.json` 已批准的五张旧中立衍生删除记录（原 FNG-UN-004/010/011/012/013），解除维拉、革命日、烬白两形态的四 UID 排除，并固定本轮140张 UID 集合。历史137张减去5张、加上前轮2张及本轮6张，得到140张。这里的收录许可不是游戏实现或执行验收证明。

历史 `issue100-20260930` 对应[试玩来源任务 #100](https://github.com/Time-Block-Hero/time-block-hero-unified/issues/100)，保留此前140张身份与父子关系，仅新增赦免、艾诗丽、帝国之盾三个 UID，固定143张集合。逐 UID 的22项旧卡差异、3张新增完整设计、基线提交、原始源摘要及已确认解释见 [试玩设计修订](revisions/2026-09-30-playtest-cards.json)。三张新卡英文名与美术尚未完成；导出允许明确空美术，游戏fallback由内容交付登记。再次读取设计源并与该记录 `cardsSha256` 比较可检测后续编辑漂移，不能把旧冻结快照称为最新设计。

历史 `issue114-20261001` 对应[完整导入任务 #114](https://github.com/Time-Block-Hero/time-block-hero-unified/issues/114)，保留143个既有UID及父子关系，新增潜兽、光能盾特工、鱼鹰行动三个UID，完整集合为146张。原始编辑器摘要、逐字段前后值、描述性改动与实际语义决定见[本轮修订](revisions/2026-10-01-complete-card-import.json)。既有身份桥及历史记录保持。角色立绘更新与运行时效果验收分别由资产／规则仓库提供证据。

导出器独立保存已审阅修订内容的规范化摘要：单独改写修订文件不能新增删除许可或更换身份。修订必须匹配历史 bridge 原字节摘要、原始编号/UID关系、完整的批准 UID 集合及解除排除列表。增删 UID 或变更收录策略需要新的明确来源修订及对应合同审阅；卡文、数值、名称、展示编号、美术描述和插画选择修改不需要改这份身份清单，仍由 cards 原始字节摘要及接收方审阅追踪。合同不固定整份当前 cards 摘要，允许后续卡图任务正常导出。

## 正式导出

```sh
node tools/export-card-designs.mjs --commit <完整40位已提交SHA> --output /tmp/card-designs.json
```

导出器禁用 Git replace objects 后使用 `git show` 读取该提交的 cards、identity bridge，以及该提交中存在的来源修订原始字节，分别计算 SHA-256；不读取工作树中的设计草稿或修订文件，因此工作树有改动时仍可准确导出指定历史提交。指定提交必须实际含 schema 4 和 bridge。历史提交没有来源修订时保留原行为：全部137个基线 UID 必须存在，四 UID 仍排除。接收方还必须验证这些字节、已评审 bridge、来源修订与被允许的来源提交，不能仅信任 JSON 自报的 SHA。是否接受后续提交由接收方差异审阅决定。

```sh
node tools/export-card-designs.mjs --dirty --output /tmp/card-design-preview.json
```

开发预览读取工作树，明确输出 `source.commit: null`、`source.dirty: true`；禁止作为生产导入依据。不能同时指定两种模式。导出文件只能写到仓库外或仓库 artifacts 目录，不能覆盖已有受版本控制的源文件，也不能借符号链接覆盖输入。

## JSON 字段

- 顶层：`schemaVersion: 1`、`kind: "timeblock.card-designs"`、`source`、`cards`、`policy`。
- source：`repository`、`commit`、`cardsSha256`、`identityBridgeSha256`、`datasetSchemaVersion: 4`、`dirty`；存在来源修订时额外提供 `sourceRevisionPath`、`sourceRevisionId`、`sourceRevisionSha256`（该提交的修订文件原始字节摘要）。没有修订的历史导出不增加这些字段。
- 每卡：`uid`、`displayId`、`name`、`nameEn`、`cardType`、`collectionKind`、`parentUid`、`classId`、`rarity`、`costResource`、`costAmount`、`durability`、`attack`、`health`、`movement`、`arrows`、`tribes`、`tags`、`rulesText`、`artwork`。
- 非随从的 attack/health/movement 为 null，tribes 为 []；原始卡文不改写。arrows/tribes/tags 保留源顺序。
- artwork：`{key: string|null, selected: [{variantId, sourcePath}]}`。保留 selectedArtworkIds 中所有选择（兼容单个字符串或数组），每项必须唯一匹配实体 variant；sourcePath 保留 `./assets/card-art/...` 规范相对路径。缺少正式选择输出空数组，不用旧 artPath 兜底。
- policy：`excludedUids` 为固定 bridge 排除列表扣除已批准解除排除的 UID；`blankEffectUids` 为当前实际空卡文 UID；`resourceMigrationUids` 保留历史 bridge 列表（可含已批准删除的 UID，类型检查仅针对当前存在记录）。它是导入约束，不是已完成执行验收的标记。

cards 按 UID 升序输出，policy 数组排序，格式与输入字节相同时输出确定。重复/缺 UID、非法类型/收集分类、失效父引用、未完成资源类型迁移、缺少正式 variant 或路径越界均失败。

导出只使用以上白名单字段，不携带 abilities、continuousEffects、plans、abilityRefs、runtimeSupport 或 Implemented 标记。`formal_card_ref.json` 的旧文件名现只保留同格式的 dirty 设计预览；同步工具完全不读取其中的旧执行数据。生产工具应调用正式导出，不能将这个预览当作游戏内容 catalog。同步生成的 dirty 预览允许编辑器合法增删卡，保留历史 bridge 和来源修订但不回灌被删记录；显式导出按指定提交的来源修订严格检查 UID 集合，未声明删除、新增、旧身份复活、无效修订或错误身份均失败。没有修订时仍要求完整历史基线。生产导入必须拒绝 dirty，即使其声明了有效的修订摘要。

## 本地验证

运行 `node tools/sync-cards-from-data.mjs` 同步预览、镜像和页面数据；`npm run build`、`npm test` 验证生成数据及合同。新增测试包含编辑器真实重排/新建/衍生/表单路径、HTTP Resource 保存重开、拒绝非法保存、两份同名身份、选图完整性、版本来源和导出确定性。HTTP 测试需要能绑定 localhost 临时端口。

`node --test tools/tests/card-design-source-revision.test.mjs tools/tests/card-designs.test.mjs` 另行验证143张来源修订、历史删除凭据、解除四 UID 排除、未声明删除/新增/身份替换、无效修订、历史提交不受工作树修订污染，以及卡文/美术修改无需重写身份合同。Rules 接收方仍需在后续任务适配此修订、作者内容和正式验收，website 导出成功不等于已完成该适配。

本地保存使用原子读取的 cardsRevision 和显式 UID 操作（编辑、新建、删除、重排）验证变更范围；旧快照、身份互换或越权改动其他卡牌会被拒绝。失败更改单独保留为未同步恢复草稿，不覆盖最后成功草稿；编辑器恢复已确认身份并提示先导出草稿、重新加载。浏览器草稿导入只能修改既有身份的内容，不能在导入时改写 UID 与展示编号关系。

当前 `issue114-20261001-playtest147` 在146卡身份集合上新增高阶阳炎术（`6ddc36ab-de9f-4bb4-bf28-def6548454cd`），无删除或身份替换，总计147卡。13张旧卡逐字段变更、原始编辑器摘要及语义说明见[147卡试玩修订](revisions/2026-10-01-playtest147.json)。后续SC-022更名大师阳炎射击并补齐正式插画；艾诗丽改为单目标。逐字段修订见[收尾设计修订](revisions/2026-10-02-ashley-master-corona.json)。147卡身份许可不变，既有原画和99张角色立绘保持。
