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
- 随从与法术使用不同字段和布局；随从种族支持多选，“建筑”用于有生命值的非生物随从。
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

### 如何让 Codex 调用 skills

打开本仓库作为工作区后，Codex 会读取可用 skill 的名称和用途。Skill 有两种触发方式：

1. **显式调用（团队协作推荐）**：在提示词中直接写 `$polish-artwork-description` 或 `$artwork-generation`。
2. **自然语言调用**：直接描述符合 skill 用途的任务，由 Codex 根据 skill 的 `description` 自动选择。

在支持 Skills picker 的 ChatGPT 界面中，也可以输入 `@` 后选择对应 skill。下方示例统一使用 `$skill-name`，这样 PR、issue 和团队聊天里的意图最明确。普通、不支持 Agent Skills 的独立 LLM 不会因为看到这段文字就自动加载本仓库的 skills；必须先让 agent 打开本仓库并发现 `.agents/skills/`。

#### Demo 1：精修一张卡的画面描述

```text
$polish-artwork-description

请精修 FNG-017「横行噗噜兽」的画面描述。
保留我已经写下的主体和动作，结合卡牌稀有度、奇兽设定与效果补全环境、构图、光线和色彩。
只更新 artDescription 和 artDescriptionNeedsPolish，不要生成图片，也不要修改任何玩法数据。
完成后告诉我修改前后的主要差异。
```

#### Demo 2：批量精修所有待处理描述

```text
请使用 $polish-artwork-description，处理 data/cards.json 中所有
artDescriptionNeedsPolish=true 的卡牌。

按卡牌 ID 顺序执行；传奇卡如果缺少明确的角色身份、事件或构图，先停下来和我 brainstorm，
不要自行补完。不要生成卡图，不要修改费用、数值、效果、ID 或父子关系。
```

不写 skill 名也可以触发同一工作流，例如：

```text
请根据 Time-Block Hero 的世界观和派系设定，把 FNG-024 的简单画面描述
精修成可用于卡图生成的完整 prompt，但先不要生成图片。
```

#### Demo 3：为一张卡生成多个候选插画

先在卡牌编辑器中填写英文名、保存完整画面描述，并把 `artRequest` 设置为需要的数量。例如需要 3 张候选图，就设置为 `3`。

```text
$artwork-generation

FNG-024 的画面描述已经确认，artRequest=3。
请只为这张卡生成 3 个独立插画方案，使用项目默认 Industrial Sci-Fi Anime 风格。
生成后按英文名规则保存并逐张登记到编辑器，但不要替换已有的正式插画选择。
最后汇报每个 variant ID、文件路径和剩余 artRequest。
```

#### Demo 4：处理完整的卡图请求队列

```text
请使用 $artwork-generation 处理 data/cards.json 中所有 artRequest>0 的卡牌。

生成前检查英文名、画面描述和精修 flag；需要精修的卡先调用
$polish-artwork-description。传奇卡若不满足清晰度要求，列为 blocked 并等待我确认。
成功的图片立即保存和登记，失败的任务保留 request 数量，最后给出成功、阻塞和剩余队列汇总。
```

#### Demo 5：明确要求并行批量生成

```text
$artwork-generation

请批量处理当前 art requests。可以把不同卡牌分给并行 worker，最多使用 3 个 worker；
同一张卡的所有 variant 交给同一个 worker。worker 只生成并保存各自目录的图片，
由主任务在全部返回后串行登记 JSON，避免数据竞争。不要覆盖任何现有文件或正式插画选择。
```

#### Demo 6：先规划，不立即生成

```text
请使用 $artwork-generation 读取当前 request queue，但先不要调用图像生成。
请列出卡牌 ID、英文名、稀有度、请求数量、描述是否已精修，以及预计生成的文件名。
等我确认清单后再开始。
```

### 两个 skills 的职责边界

- `$polish-artwork-description` 只负责文字 prompt；它不会生成图片，也不会修改玩法数据。
- `$artwork-generation` 以 `artRequest` 为准确数量来源，并要求非空英文名和已完成的画面描述。
- 如果生成队列里仍有待精修卡牌，Artwork Generation 会先调用 Polish Artwork Description。
- 传奇卡描述不够明确时，工作流会暂停该卡并请求设计师确认，而不是静默编造设定。
- 新图片会追加为候选 variant；已有正式插画不会被自动覆盖。
- 并行模式最多使用 3 个生成 worker；JSON 与备用数据仍由主任务串行登记。

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
