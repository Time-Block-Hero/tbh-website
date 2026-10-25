# Chibi 三维验收与图集交接

用户指定洛岚九帧原图是本轮比例与画风基准。卡牌插画只约束人物身份、装备、种族和职业，不能把原卡图的成人比例、复杂背景或姿势直接复刻到小人里。本页是美术候选验收，不表示已替换生产游戏资产。

## 本地查看

```sh
node tools/card-editor-server.mjs --port 4328
```

打开 `http://127.0.0.1:4328/chibi-review.html`，也可附 `?unit=SA-015` 直达一个角色。页面使用原生 WebGL；实体三维底座、透视镜头、纸片和接地阴影均为实时绘制，没有 CDN、外部字体或第三方运行时依赖。

- 每个底座为 3×3，单格宽度 1。脚点固定在中心格世界坐标中央。
- 当前小人和右侧洛岚共用镜头、动作与朝向。右侧固定高度 1.10 格，滑杆只调整左侧候选，便于比较。
- 1.10 是完整名义图格高度。洛岚第一帧可见宽度约 0.83 格，加纸边约 0.85 格；不会把长枪、飘发和尾巴硬缩进同一宽度。
- 默认正对镜头；可切固定倾角检查真正纸片在三维中的站法。拖拽旋转，滚轮缩放，双击复位。
- 待机三张、移动三张、受伤 / 攻击 / 发动效果各一张。可暂停、逐帧、重播、左右翻转，关闭轻量程序动作来单看原画。没有彩蛋待机。
- 未重绘的单位标注“待重绘 · 当前显示旧稿”，不会计入新稿数量。需修正的图集不能被记为合格新稿。

## 素材职责

Presentation 拥有游戏运行资产。Website 的 `assets/chibi-review/` 是审阅镜像，独立于正式卡图、旧 Chibi 与旧立绘。`data/cards.json` 是只读身份目录，页面与导入器均不修改卡牌设计或执行数据。

`data/chibi-review.json` 的 `baseline` 保留洛岚原始图片 SHA-256；`entries` 按持久 UID 对应其余单位。状态为：

| 状态 | 含义 |
| --- | --- |
| `pending` | 尚无本轮新稿；页面明确展示旧稿供尺寸比较 |
| `generated` | 已导入本轮新稿，无格线切断；仍待人工美术审阅 |
| `needs-fix` | 图格不能无损分隔或缺帧；显示问题素材以便修正 |
| `reviewed` | 经审阅后手工登记，程序不能自动授予 |
| `golden` | 唯一用户指定基准，仅用于 `baseline` |

每张候选提供原生透明 RGBA `atlas.png`，3×3 行优先：待机 0–2、移动 3–5、受伤 6、攻击 7、发动效果 8。不要通过改色、重采样或逐帧缩放制造一致性。

## 导入

```sh
python3 tools/import-chibi-review.py \
  --generated-root /absolute/path/to/generated \
  --source-roster /absolute/path/to/source-roster.json
```

Python 需要 Pillow。生成目录为 `<cardId>/atlas.png`，可另有 `<cardId>/metadata.json`。源 roster 的每条须有 `id`、`uid`，可有 `selectedArtId`；根节点可有 `styleReferenceSha256`。可用 `--only SA-015,SC-000` 限定导入，不存在原图的条目继续 pending。

导入器只读取 alpha，原图字节原样复制。优先在 1/3、2/3 名义格线 ±60 px 内寻找零可见像素分隔线；无法找到就标记 `needs-fix`。输出 `layout.frames[].rect` 使用图片左下原点；`pivot` 是每帧脚点的归一化坐标。全部帧按 `nominalCellHeight=sourceHeight/3` 共用同一像素比例，实际 rect 大小可不同，因此不产生动作间身体忽大忽小。

默认脚点取 alpha>160 的底部轮廓，飞行姿态、飘带或外伸武器需要人工查看。可在 metadata 提供下面的显式覆盖；`xCuts` 左起、`yCuts` 上起，均含图像边界：

```json
{
  "layoutOverrides": {
    "xCuts": [0, 418, 846, 1254],
    "yCuts": [0, 438, 839, 1254],
    "pivots": { "3": { "x": 0.54, "y": 0.04 } }
  }
}
```

覆盖只修订几何元数据，不修改原图。不要用 pivot 掩盖裁切掉的枪、头发或手脚；这种情况应重画或修订原始布局。

## 验收

```sh
node --check chibi-review.js
node --check chibi-review-renderer.js
node tools/validate-chibi-review.mjs
node --test tools/tests/chibi-review.test.mjs
```

自动校验覆盖当前全部 Minion UID、原始 SHA、透明 PNG、九帧裁切、脚点、五类动作及状态；不把这些检查当作画风审阅。浏览器人工检查所有动作、翻向后脚点、拖动与滚轮、单 / 双棋盘、搜索 / 职业筛选、待重绘提示和新稿原色。旧图入口始终保留。
