# Chibi 人物工坊

`chibi.html` 是人物动作与显示参数的正式编辑入口。首页导航、人物档案和卡牌编辑器均可进入；卡牌与工坊按持久 UID 互相定位。旧 `chibi-review.html` 保留查询参数后转到工坊，`chibi-gallery.html` 保留旧稿回看，页头与入口均明确标注“历史试稿（已停用，非游戏素材）”。卡牌详情只提供两个带 UID 的链接，不加载旧十二帧图集或后台动画。

## 使用

```sh
node tools/card-editor-server.mjs --port 4329
```

打开 `http://127.0.0.1:4329/chibi.html`。也可用 `?unit=<UID>`；旧卡号深链会解析到当前 UID。

1. 默认查看「游戏发布版」：读取持久发布清单与通过 SHA-256 校验的真实透明 PNG；可直接下载当前 PNG 或含 PNG/清单的单位运行包。展开编辑或切换「原稿与校准」后再调试，未保存/未发布配置不会冒充游戏发布版。
2. 从左侧选择单位，在真实 3×3 棋盘上拖动旋转、滚轮缩放，与固定洛岚基准比较。动作只有待机、移动、受伤、攻击、发动效果；支持暂停、逐帧和朝向切换。
3. 展开“编辑人物”，调整整套尺寸、棋盘 XYZ、动作 FPS / XY、逐帧 XY。点击原图中的落脚点设置该帧锚点；青色十字是格中心，橙色十字是当前显示锚点。原图画布保持像素比例，透明底方便观察留白。
4. 点击“保存配置”，刷新后保留。人物身份、五个动作提示词和制作备注独立保存；空动作提示词继承统一规范。“复制整套生成提示词”包含风格、身份、五动作、备注和负面要求。

未保存内容会保留为浏览器草稿。恢复草稿不继承较新磁盘版本的写入权：如配置或素材版本变化，会提示冲突并拒绝覆盖。可导出旧草稿，刷新读取当前配置后比较合并。静态托管没有文件写入 API，页面明确显示静态模式；可下载、导入配置，不能假装保存到仓库。

## 数据边界

| 文件 | 职责 |
| --- | --- |
| `data/cards.json` | 只读身份与卡牌画面描述；工坊不修改设计或执行字段 |
| `data/chibi-review.json`、`assets/chibi-review/` | 原图路径、SHA-256、检测 rect / pivot 与候选审阅状态；原 PNG 字节不变 |
| `data/chibi-workbench.json` | 按 UID 保存的校准与未来生成提示词 |
| `chibi-workbench-contract.js` | 浏览器、API、CLI 共用的校验及解析函数 |
| `data/chibi-published.json`、`assets/chibi-published/` | 已发布 schema 2 快照与离线修补 PNG；不覆盖原稿 |
| `assets/chibi-prompts/` | 历史生成来源，区别于工坊中未来使用的可编辑提示词 |

`exportReady` 只表示选作运行导出素材，不授予美术审阅通过，也不发布网站或更新游戏。图集 SHA 改变时旧校准不会继续应用；显式“重新绑定”清空逐帧覆盖并取消导出选择，需重新检查、选定并保存。

## 坐标与尺寸

- 单格宽度为 1；`scale` 是名义图格高度的格单位数。`pixelToTile = scale / nominalCellHeight`。整套九帧共用这一比例，绝不逐帧拉伸。体型分类仅组织配置，“应用体型建议”是显式操作。
- `offset` 为棋盘世界 XYZ；Y 向上，X/Z 同时移动接地阴影，阴影仍在棋盘平面。浮空高度用 `offset.y` 明确设置，`bodyKind` 不额外缩放或抬高。
- `frames["i"].anchor` > 单位 `anchor` > 原图检测 `pivot`。锚点为每个 frame rect 内、左下原点的归一化 XY。
- `actions[name].offset` 与 `frames["i"].offset` 相加，单位为格，作用于面向镜头的纸片 XY；X 随原画翻向镜像。棋盘世界偏移不镜像。
- `artworkFacesRight` 记录原画默认朝向；预览选择的朝向由它计算实际 UV 翻转。
- `excludedRects` 保留原洛岚唯一已确认的独立剑尖例外，是 frame rect 内部、左下原点的像素区域，不能转成 atlas 绝对坐标。新稿不得用遮罩隐藏跨格缺陷。
- 动作按固定顺序：idle `[0,1,2]`、move `[3,4,5]` 循环；hit `[6]`、attack `[7]`、effect `[8]` 非循环。没有隐藏的往返播放或彩蛋待机。工坊对非循环动作定时重播，便于审稿。

## 本地保存 API

`GET /api/chibi/state` 返回配置及配置/素材原始文件 SHA revision。`POST /api/chibi/save` 只写固定工作台文件，要求 `baseRevision`、`reviewRevision` 匹配当前文件；通过同源、本机、JSON、自定义请求头检查后，串行校验、临时文件写入并原子替换。版本冲突返回 409，保留磁盘原文件。客户端提交路径不会被用于选择写入位置。

`POST /api/chibi/export` 按保存版本即时编译输出单个 manifest 或包含 manifest 与已处理 PNG 的 `.tar`。`POST /api/chibi/publish` 另要求配置与 review revision 同时匹配，与保存共用串行队列及同源校验；写入静态发布快照。派生图按 SHA 命名、先写完图再原子替换清单，失败不破坏上一版。原稿配置与游戏发布快照明确区分。大包建议使用 CLI，避免浏览器同时持有全部图片字节。

## 导出给游戏

```sh
# 校验当前选定的全部单位，不写文件
node tools/export-chibi-workbench.mjs --check

# 导出已选定的运行资产
node tools/export-chibi-workbench.mjs --out /absolute/chibi-runtime

# 独立新目录内导出指定 UID，仅用于局部预览
node tools/export-chibi-workbench.mjs --uids <UID>,<UID> --out /absolute/chibi-subset

# 已有运行包更新；保留 Unity 的匹配 .meta / GUID
node tools/export-chibi-workbench.mjs --out /absolute/chibi-runtime --overwrite
```

默认导出 `exportReady=true` 的单位；显式请求未选定、未知或素材过期的 UID 会报错。全部未选定也会报错。**生产 Catalog 的安装应验证完整预期 UID 集合；子集包不能替代完整生产包。** 导出子集到新目录检查，集成由 Presentation/Unified 管理。

导出器先校验整份配置、源清单及 PNG SHA，再写原子目录包。`--overwrite` 保留匹配的 `manifest.json.meta`、`atlases.meta`、每张 PNG 的 `.meta`；输出目录自身的外部 `.meta` 不动。未知文件、旧包多余 PNG、未知目录或符号链接都会在修改前拒绝，避免子集导出抹掉完整资产或用户文件。无明确覆盖参数时拒绝已有目录。

`manifest.json` 含 Website commit、review/workbench/golden SHA，以及各单位最终 height、世界 offset、frame rect / pivot / offset、五动作 FPS、bodyKind、朝向和完整解析提示词（style / negative / base / notes / actions）。每单位包含 calibration SHA。schemaVersion 为 2，`source.processingVersion` 与各单位 `processing.version` 均为 `chibi-alpha-bake-v1`。`sourceAtlasSha256` 记录原稿，`atlasSha256` 记录实际游戏 PNG，`calibrationSha256` 对最终单位（含派生图 SHA 与处理统计）计算。`processing.repairs` 记录源帧编号及左下原点矩形（仅来源审计，不供运行时遮罩）；`processing.exclusionRectCount` 记录修补矩形数；`alphaClearedPixels` 是实际由非零 alpha 改为 0 的像素数，重叠区域不重复计数。运行 layout 不再携带 `excludedRects`。当前仅洛岚 effect 帧移除 1459 个非零 alpha 像素，其余 98 张 PNG 逐字节不变。

离线修补使用 frame 内左下原点整数坐标，先转为 atlas 像素位置；只清 alpha，保留 RGB、sRGB 等 PNG 元数据及其余像素。若修补区域与另一帧共享像素则拒绝发布，不能为一帧误删另一帧内容。原稿/检测配置保留该编辑信息，未来可重新生成；游戏只消费处理后的 PNG，不再运行修补矩形检测。普通九帧裁切、PNG 透明度、白纸边、阴影及比例/offset 不受影响。

```sh
# 将全部选定的游戏素材发布到网页（原稿不变）
node tools/publish-chibi-workbench.mjs
# 验证网页快照与当前保存的配置/产物一致
node tools/publish-chibi-workbench.mjs --check
```

网页静态清单的 `units` 与运行包完全相同；顶层 `webAtlasSources` 将未修改 PNG 指向现有原稿，派生图指向按 hash 命名的新 PNG，避免再复制整套约 594 MB。网页验证图像哈希后才显示/下载；若原稿路径被替换，旧发布清单会报错，不能静默显示另一张图。源 SHA 与游戏 PNG SHA 可分别追溯。浏览器单单位 `.tar` 包可用于局部导入验证；全部生产 Catalog 仍要求完整 UID 集合，使用 CLI 或本地工坊导出完整包。

保存配置不自动发布；本地“发布”不等同于部署远程网站或更新已安装游戏。静态网站可播放已发布产物并下载 PNG/单单位运行包，修改配置须回到本地保存、发布并通过游戏导入校验。

## 验证

```sh
node --test tools/tests/chibi-workbench.test.mjs tools/tests/chibi-alpha-bake.test.mjs tools/tests/card-chibis.test.mjs
npm test
node --check chibi-workbench.js
node --check chibi-review-renderer.js
node --check card-editor.js
node tools/export-chibi-workbench.mjs --check
git diff --check
```

针对性测试覆盖坐标优先级、固定整套比例、动作帧顺序、过期哈希、完整提示词、草稿版本、跨源写入拒绝、真实 HTTP 保存刷新、冲突不覆盖、确定性导出、无修补 PNG 字节、真实洛岚 alpha 坐标和原稿保留、PNG 损坏拒绝、交叠帧修补拒绝、发布冲突、静态 tar 下载与 Unity GUID 保留。浏览器验证应在临时 `--root` 数据副本做保存试验，正式配置只读观察，避免覆盖其他协作者校准。
