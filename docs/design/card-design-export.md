# 卡牌设计身份与导出合同

本合同交付声明性设计数据，不编译卡牌效果，也不声明游戏已经支持这些设计。规则语义的作者化、准入及执行验收由 rules 仓库负责。

## 身份与版本

`data/cards.json` schemaVersion 4 为每张卡保存一次性分配的 UUID v4 `uid`。展示编号 `id` 可以重排，姓名、英文名和 artworkKey 可以改名；这些操作均不得重建 UID。新建卡和复制出的衍生卡分配新 UID。`parentUid` 明确为父卡 UID 或 null，关系不依赖编号字符串。

`cardType` 为 `Minion`、`Spell`、`Resource`。`collectionKind` 为 `Collectible`、`Hero`、`Token`、`NonCollectible`，分别对应 Wiki 的可收集、英雄、衍生、不可收集。兼容编辑器的 collectable 与 InitialHero 标签须与四分类一致；英雄不能因 collectable=true 被视作普通构筑卡。

`data/card-identity-migration.json` 固定原设计基线提交和原 cards 文件 SHA-256，以及137条 `baselineDisplayId → uid` 关系。它不是当前编号索引；重排后不得改写历史编号。四张排除、四张明确空效果、七张资源类型迁移以 UID 数组记录。两份智慧、两份野果分别保留身份。此文件经评审后不重新生成；后续变动必须提供明确迁移和差异记录。

## 正式导出

```sh
node tools/export-card-designs.mjs --commit <完整40位已提交SHA> --output /tmp/card-designs.json
```

导出器禁用 Git replace objects 后使用 `git show` 读取该提交的 cards 和 identity bridge 原始字节，分别计算 SHA-256；不读取工作树中的设计草稿，因此工作树有改动时仍可准确导出指定历史提交。指定提交必须实际含 schema 4 和 bridge。接收方还必须验证这些字节、已评审 bridge 与被允许的来源提交，不能仅信任 JSON 自报的 SHA。是否接受后续提交由接收方差异审阅决定。

```sh
node tools/export-card-designs.mjs --dirty --output /tmp/card-design-preview.json
```

开发预览读取工作树，明确输出 `source.commit: null`、`source.dirty: true`；禁止作为生产导入依据。不能同时指定两种模式。导出文件只能写到仓库外或仓库 artifacts 目录，不能覆盖已有受版本控制的源文件，也不能借符号链接覆盖输入。

## JSON 字段

- 顶层：`schemaVersion: 1`、`kind: "timeblock.card-designs"`、`source`、`cards`、`policy`。
- source：`repository`、`commit`、`cardsSha256`、`identityBridgeSha256`、`datasetSchemaVersion: 4`、`dirty`。
- 每卡：`uid`、`displayId`、`name`、`nameEn`、`cardType`、`collectionKind`、`parentUid`、`classId`、`rarity`、`costResource`、`costAmount`、`durability`、`attack`、`health`、`movement`、`arrows`、`tribes`、`tags`、`rulesText`、`artwork`。
- 非随从的 attack/health/movement 为 null，tribes 为 []；原始卡文不改写。arrows/tribes/tags 保留源顺序。
- artwork：`{key: string|null, selected: [{variantId, sourcePath}]}`。保留 selectedArtworkIds 中所有选择（兼容单个字符串或数组），每项必须唯一匹配实体 variant；sourcePath 保留 `./assets/card-art/...` 规范相对路径。缺少正式选择输出空数组，不用旧 artPath 兜底。
- policy：`excludedUids`、`blankEffectUids`、`resourceMigrationUids`，来自固定 bridge。它是导入约束，不是已完成执行验收的标记。

cards 按 UID 升序输出，policy 数组排序，格式与输入字节相同时输出确定。重复/缺 UID、非法类型/收集分类、失效父引用、未完成资源类型迁移、缺少正式 variant 或路径越界均失败。

导出只使用以上白名单字段，不携带 abilities、continuousEffects、plans、abilityRefs、runtimeSupport 或 Implemented 标记。`formal_card_ref.json` 的旧文件名现只保留同格式的 dirty 设计预览；同步工具完全不读取其中的旧执行数据。生产工具应调用正式导出，不能将这个预览当作游戏内容 catalog。同步生成的 dirty 预览允许编辑器合法删除基线卡，保留历史 bridge 但不回灌被删记录；显式导出仍要求完整基线，生产导入必须拒绝 dirty。

## 本地验证

运行 `node tools/sync-cards-from-data.mjs` 同步预览、镜像和页面数据；`npm run build`、`npm test` 验证生成数据及合同。新增测试包含编辑器真实重排/新建/衍生/表单路径、HTTP Resource 保存重开、拒绝非法保存、两份同名身份、选图完整性、版本来源和导出确定性。HTTP 测试需要能绑定 localhost 临时端口。

本地保存使用原子读取的 cardsRevision 和显式 UID 操作（编辑、新建、删除、重排）验证变更范围；旧快照、身份互换或越权改动其他卡牌会被拒绝。失败更改单独保留为未同步恢复草稿，不覆盖最后成功草稿；编辑器恢复已确认身份并提示先导出草稿、重新加载。浏览器草稿导入只能修改既有身份的内容，不能在导入时改写 UID 与展示编号关系。
