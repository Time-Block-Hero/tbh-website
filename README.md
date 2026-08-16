# Time-Block Hero Website

Time-Block Hero 的世界观展示站与本地设计工具仓库。项目目前包含世界档案、开发中心、奇兽图鉴，以及受密码保护的卡牌编辑器。

## 本地启动

卡牌编辑器需要通过项目自带的本地服务运行，才能把修改写回 JSON，并在英文卡名变化时同步重命名插画目录和文件。

需要 Node.js 18 或更高版本；本地服务本身不依赖第三方 npm 包。

```bash
cd tbh-website
node tools/card-editor-server.mjs --port 4317
```

然后打开：

- 中文主页与卡牌编辑器：<http://127.0.0.1:4317/>
- 英文主页：<http://127.0.0.1:4317/index-en.html>
- 奇兽图鉴：<http://127.0.0.1:4317/bestiary.html>

直接双击 `index.html` 仍可用于只读预览和浏览器本地草稿，但不能可靠地写回项目文件或重命名实体插画。正式设计请始终使用本地端口。

## 卡牌编辑器

编辑器当前支持：

- 主列表使用 Board View，详情编辑使用 Hand View。
- 可收集与不可收集卡牌分开展示；衍生卡位于父卡详情页。
- 添加、删除主卡和衍生卡。
- 按编号模式拖拽卡牌并插入目标位置；保存后自动重新编号。
- 按费用升序或降序浏览；视图排序不会修改卡牌 ID。
- 随从与法术使用不同字段和布局；随从种族支持多选。
- 卡名颜色表示稀有度：普通白色、稀有蓝色、史诗紫色、传说橙色。
- 多插画方案、正式插画选择、画面描述精修标记和 `artRequest`。
- 保存时同步写入项目 JSON，并重新生成直接打开网页所需的备用数据。

## 数据与文件约定

| 路径 | 用途 |
| --- | --- |
| `data/cards.json` | 卡牌设计的项目数据源 |
| `card-editor-data.js` | 自动生成的离线备用数据；不要手工编辑 |
| `card_layout_ref/layout.json` | Board View 与 Hand View 布局参数 |
| `assets/card-template/` | 卡框、属性图标、箭头等模板资产 |
| `assets/card-art/` | 正式卡牌插画及候选版本 |
| `formal_card_ref.json` | 游戏侧卡牌表参考 |

插画使用英文卡名生成的 slug 作为稳定索引：

```text
assets/card-art/<english-name-slug>/<english-name-slug>-01.png
assets/card-art/<english-name-slug>/<english-name-slug>-02.png
```

例如：

```text
assets/card-art/space-soldier/space-soldier-01.png
```

请通过本地编辑器修改已绑定插画的英文名，使 JSON 引用、目录名和文件名一起更新。卡牌编号会随设计顺序变化，因此不用于命名插画。

## 插画工作流

查看仍有生成需求的卡牌：

```bash
node tools/artwork-workflow.mjs request-queue
```

登记一张已经生成的插画：

```bash
node tools/artwork-workflow.mjs register CARD_ID /absolute/path/to/image.png
```

选择正式插画：

```bash
node tools/artwork-workflow.mjs select CARD_ID artwork-variant-id
```

重新生成离线备用数据：

```bash
node tools/build-card-editor-fallback.mjs
```

项目还提供两个 Codex skills：

- `.agents/skills/polish-artwork-description/`：根据世界观与派系设定精修画面描述。
- `.agents/skills/artwork-generation/`：按照 `artRequest` 批量生成、保存并登记卡图。

## 本地验证

提交改动前至少运行：

```bash
node --check card-editor.js
node --check tools/card-editor-server.mjs
node tools/build-card-editor-fallback.mjs
git diff --check
```

随后通过 <http://127.0.0.1:4317/> 手动检查卡牌列表、详情渲染、保存、拖拽重排和视图排序。

## GitHub 协作约定

1. 从最新主分支创建描述清晰的功能分支，并遵循团队约定的分支命名方式。
2. 一次提交只处理一个清晰主题；不要把无关资产和格式化混入同一提交。
3. 先在本地服务中完成测试，再提交 Pull Request。
4. 修改 `data/cards.json` 时，同时提交重新生成的 `card-editor-data.js`。
5. 插画、卡牌英文名和插画索引应在同一提交中更新，避免出现断开的路径。
6. 在 `CHANGELOG.md` 的 `Unreleased` 区域记录面向设计师或玩家的行为变化。
7. 不要提交密码、令牌、个人配置或系统生成文件。

卡图目前随仓库管理。随着资产继续增长，团队可以统一迁移到 Git LFS 或外部对象存储；不要由单个贡献者在一个 PR 中单方面更换资产存储方案。

## 版本记录

详见 [CHANGELOG.md](CHANGELOG.md)。
