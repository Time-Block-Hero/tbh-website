# Changelog

本文件记录 Time-Block Hero 网站与设计工具中对协作者可见的变化。格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Website organization

- 重整第二章平级卡牌类型及卡牌信息／实例属性，确认资源空格生成，补充棋盘与区域状态图；十二章增加分级编号且保留语义锚点。
- 按用户确认新增资源牌为第三种基础类型，统一 Wiki 的共存、拾取、回合末留场、移出游戏及卡组循环例外规则。
- 更新规则总则为已确认的“有效性先判断、明确例外改写默认”原则；补全第二至第四章待审阅草案、关联关键词及旧文／固定实现分歧记录。
- 开始逐章编写规则正文：第一章总则形成带稳定条款编号的待审阅草案，附来源与未决优先级边界；草稿提示同时适用于提纲与已起草正文。

- 按已确认大纲重建规则 Wiki：五组导航、十二章及维护附录，回合流程与商店购买归入通用规则，标准对战单列自动资源逻辑；关键词统一链接到词条，正文保持待裁定草稿。

- Organized the inline bestiary into six collapsible race groups and 23 branches, preserving all source dossiers and separating shared principles from individual art references.
- Added explicit incomplete entries, branch design constraints and production-reference routing for future consistent assets.

- Unified the card-editor workspace with the new archive theme while preserving card rendering and operations.
- Made all four setting sections collapsible within one page and added in-place civilization dossiers.
- Rebuilt the complete cosmic bestiary inside the setting page; old bestiary URLs redirect to the corresponding inline entry.

- Rebuilt the setting archive around four class concepts, 22 current-design character dossiers and the preserved cosmic bestiary.
- Added a hierarchical Markdown rules Wiki with 18 explicitly unfinished pages.
- Moved the unchanged card editor to its own ungated page and removed the obsolete Development Center and story presentation.
- Added dossier templates with concept sheet, illustration and chibi slots.


后续功能、修复和数据迁移应先记录在这里，并在发布或合并里程碑时移动到新的版本段落。

### Added

- 随从种族多选列表新增“建筑”，用于拥有生命值但不属于生物的单位。

### Data

- 合并帝国与教会势力的最新卡牌设计，并保留本地中立卡牌的效果文本更新。
- 更新烈阳教会卡牌的插画。
- 以最新 `data/cards.json` 为唯一权威来源，将全部 136 张卡牌同步到网站卡牌库、游戏侧参考、文档镜像和离线备用数据；猎空同盟现有 23 张卡牌均已写入。
- 将猎空同盟重新定义为星系边境的反抗军文明，以冒险、开拓与征服维持文明运转；视觉语言调整为深绿、暗红与工业朋克。
- 重写洛岚、德雷克两形态、阿尔德、尼克斯、星石劫掠者、猎空冒险者、军团登陆艇、空亡时主、迷离的空亡体与幼崽噗噜兽的美术描述，并清理旧海盗概念及旧“冲撞噗噜兽”名称留下的英文名与插画索引。
- 依照最新生物图鉴重写迷离型、飞翔型、咆哮型与空亡时主的卡牌美术描述，并将裂隙惘生德雷克从“遭到感染”修正为矛盾时间状态压缩形成的特殊因果异常。

### Changed

- 旧的 `formal_card_ref.json` 迁移入口改为单向调用权威数据同步脚本，避免过时参考表反向覆盖最新卡牌。
- 与当前规则文本不一致的旧结构化运行时效果已标记为待重新实现，防止游戏侧继续执行过时效果。
- 通过本地服务删除卡牌时，同步删除该卡及其衍生卡对应的实体卡图包；JSON 写入失败时恢复已暂存的卡图目录。

### Fixed

- 当浏览器草稿与仓库 `data/cards.json` 不同时，卡牌编辑器会询问加载来源；若选择仓库版本，首次保存前会再次警告覆盖风险，确认后继续自动保存本地草稿。

### Documentation

- 依据设计反馈将天庭机灵改为无腿、无轮、常态悬浮的可爱小机器人，并用同心悬浮环与矢量鳍表现累计移动后的速度成长。
- 将天使机体从冷酷战斗机器人方向退回“意识飞升载体”定位，新增八套神性候选方案；正式骨架在设计师选定前保持待定，不提前覆盖为官方形象。
- 将械心天庭的「天使机体」与「天庭机灵」纳入中英双语宇宙生物图鉴，新增人工机体谱系筛选、生态档案、统一设定板与叙事插画。
- 为后续卡图生成锁定两类机体的家族不变量：天使共享头壳、胸核、骨盆、关节和四翼轨；机灵共享面罩、感知耳鳍、学习核心及步行／轮滑／悬浮步态模块。
- 明确 `data/cards.json` 是唯一权威卡牌数据源，并记录生成文件的统一同步命令。
- 新增并校准空亡体形象模板：以生物图鉴为权威，定义因果空洞、矛盾位置、断帧移动、平行灾难表现与时主稳定吸引子，取消统一物种解剖和进化阶梯；同时登记噗噜兽幼崽的稳定物种特征。
- 为画面描述精修与卡图生成 skills 新增显式调用、自然语言调用、单卡、批量、并行和仅规划模式的对话示例。
- 明确主卡与衍生卡只共享角色身份和设定，不得复用相近的镜头、姿势与构图。
- 将“动漫插画＋科幻设计”设为卡图生成的强制验收门槛；写实摄影、PBR 商品渲染、通用 3D、泛奇幻和 Q 版结果不得登记为正式卡图。

## [0.1.0] - 2026-08-16

首次建立正式版本记录的本地开发基线。

### Added

- 将卡牌编辑器设为与世界档案、开发中心平级的受保护页面。
- 新增基于 Node.js 的本地卡牌编辑服务，可将网页修改写回项目 JSON。
- 新增 Board View 主列表与 Hand View 详情渲染。
- 新增主卡和衍生卡的添加、删除与管理。
- 新增可收集/不可收集切换、势力筛选、类型筛选和搜索。
- 新增费用视图排序；排序不会修改卡牌 ID。
- 新增多插画方案、正式插画选择、`artRequest` 和画面描述精修标记。
- 新增画面描述精修与卡图生成 Codex skills。
- 新增奇兽图鉴页面与中英文入口。

### Changed

- 卡牌 ID 改用势力、收集状态、顺序和衍生序号组成的正式规则；初始英雄使用 `000`。
- 主卡拖拽由两两交换改为目标位置插入，并重新编号受影响卡牌。
- 插画改用英文卡名 slug 命名；英文名变化时同步更新目录、文件和 JSON 引用。
- 随从和法术使用不同字段与 Hand View 布局；法术不再显示攻击、移动、生命和种族。
- 随从种族改为预设多选。
- 稀有度改由卡名颜色表示：普通白色、稀有蓝色、史诗紫色、传说橙色。
- 编辑器 Board View 增加仅供设计参考的左上角费用标记。
- Hand View 效果文字区域加宽，法术效果区增加可用高度。
- 主列表移除卡图下方重复的卡名与编号信息。

### Fixed

- 修复直接打开本地 HTML 时 JSON `fetch` 失败导致卡牌列表为空的问题。
- 保存失败时回滚插画目录改名，避免 JSON 与实体文件路径不一致。
- 长卡名在预览中自动缩小字号，避免换行或遮挡属性区域。
- 卡牌重新编号时同步迁移衍生卡、插画 variant 和正式插画选择关系。

### Data

- 以 `formal_card_ref.json` 为正式卡牌表参考完成网页数据迁移。
- 登记现有卡图及其英文名索引，并将已满足的 `artRequest` 归零。
- 保留 `card_layout_ref/layout.json` 作为后续布局微调的数据源。
