# Chibi 人物工坊

`chibi.html` 是人物动作与显示参数的正式编辑入口。首页导航、人物档案和卡牌编辑器均可进入；卡牌与工坊按持久 UID 互相定位。旧 `chibi-review.html` 保留查询参数后转到工坊，`chibi-gallery.html` 保留旧稿回看。

## 使用

```sh
node tools/card-editor-server.mjs --port 4329
```

打开 `http://127.0.0.1:4329/chibi.html`。也可用 `?unit=<UID>`；旧卡号深链会解析到当前 UID。

1. 从左侧选择单位，在真实 3×3 棋盘上拖动旋转、滚轮缩放，与固定洛岚基准比较。动作只有待机、移动、受伤、攻击、发动效果；支持暂停、逐帧和朝向切换。
2. 展开“编辑人物”，调整整套尺寸、棋盘 XYZ、动作 FPS / XY、逐帧 XY。点击原图中的落脚点设置该帧锚点；青色十字是格中心，橙色十字是当前显示锚点。原图画布保持像素比例，透明底方便观察留白。
3. 点击“保存配置”，刷新后保留。人物身份、五个动作提示词和制作备注独立保存；空动作提示词继承统一规范。“复制整套生成提示词”包含风格、身份、五动作、备注和负面要求。

未保存内容会保留为浏览器草稿。恢复草稿不继承较新磁盘版本的写入权：如配置或素材版本变化，会提示冲突并拒绝覆盖。可导出旧草稿，刷新读取当前配置后比较合并。静态托管没有文件写入 API，页面明确显示静态模式；可下载、导入配置，不能假装保存到仓库。

## 数据边界

| 文件 | 职责 |
| --- | --- |
| `data/cards.json` | 只读身份与卡牌画面描述；工坊不修改设计或执行字段 |
| `data/chibi-review.json`、`assets/chibi-review/` | 原图路径、SHA-256、检测 rect / pivot 与候选审阅状态；原 PNG 字节不变 |
| `data/chibi-workbench.json` | 按 UID 保存的校准与未来生成提示词 |
| `chibi-workbench-contract.js` | 浏览器、API、CLI 共用的校验及解析函数 |
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

`POST /api/chibi/export` 按保存版本输出单个 manifest 或包含 manifest 与原 PNG 的 `.tar`。大包建议使用 CLI，避免浏览器同时持有全部图片字节。

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

`manifest.json` 含 Website commit、review/workbench/golden SHA，以及各单位最终 height、世界 offset、frame rect / pivot / offset、五动作 FPS、bodyKind、朝向和完整解析提示词（style / negative / base / notes / actions）。每单位包含 calibration SHA。PNG 保持源文件字节，运行时无需读取 Website 仓库。

## 验证

```sh
node --test tools/tests/chibi-workbench.test.mjs tools/tests/card-chibis.test.mjs
npm test
node --check chibi-workbench.js
node --check chibi-review-renderer.js
node --check card-editor.js
node tools/export-chibi-workbench.mjs --check
git diff --check
```

针对性测试覆盖坐标优先级、固定整套比例、动作帧顺序、过期哈希、完整提示词、草稿版本、跨源写入拒绝、真实 HTTP 保存刷新、冲突不覆盖、确定性导出、原 PNG 字节、tar 格式与 Unity GUID 保留。浏览器验证应在临时 `--root` 数据副本做保存试验，正式配置只读观察，避免覆盖其他协作者校准。
