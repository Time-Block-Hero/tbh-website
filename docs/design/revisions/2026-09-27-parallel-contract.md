# 电能与卡牌更新：T1 来源及并行接口约定

所属任务：[T1 #78](https://github.com/Time-Block-Hero/time-block-hero-unified/issues/78)。批准规格与后续验收：[总任务 #77](https://github.com/Time-Block-Hero/time-block-hero-unified/issues/77)。

本文件固定后续任务的输入输出与所有权，不声明电能、转化或绿色数值已经实现。具体新增类型名、序列化字段和协议版本由对应任务落实，并在各自 PR 中提供编译及兼容性证据。

## 设计来源

- Website 基线提交：`ce357dcdfc332bb06662abfc62e6e4f2aee212e7`，134 张设计。
- 用户批准输入的 cards 原始字节 SHA-256：`54d95a1888a938869b29ff3af924db6b3d6e8eb67dacee4180532ec15c0e63fa`，140 张。
- 本阶段仅为六张新卡补充 `englishName` 和 `artworkKey`。准备后 cards SHA-256：`3910f554fd3a9067ad02054fac719898ad8bf81743d3ee8cefe1c0012609d12d`。
- [逐字段差异](2026-09-27-electricity-cards.json)：新增6张、修改23张、相对上述134张基线删除0张；所有既有 UID、展示编号、父子关系保持。
- 「黑手物流」货运站仅精简文案，依据 ACT-008 仍默认每回合发动一次。不能删除其次数限制。
- 维拉、革命日与两种烬白设计解除本轮来源排除，奥古斯都计划为新增 Token；恢复收录不表示已有执行实现。
- 六张新卡的图片请求仍各为1，其他历史请求不变。T5 修改美术字段后 cards 字节摘要会改变，须重新生成镜像并使用新的正式提交导出。

| 新卡 | 英文名 | artworkKey |
| --- | --- | --- |
| 领域防护罩 | Domain Shield | domain-shield |
| 护甲军需官 | Armor Quartermaster | armor-quartermaster |
| 战线曙光 | Dawn of the Frontline | dawn-of-the-frontline |
| 大将狐尼克 | General Foxnick | general-foxnick |
| 守护光罩 | Guardian Halo | guardian-halo |
| 奥古斯都计划 | Project Augustus | project-augustus |

正式来源必须用已提交完整 SHA 导出，验证 cards、历史 bridge 及来源修订各自原始字节摘要。最终 SHA 在 T1 PR 与 Issue 验收记录中登记，避免在包含自身的提交中填写自引用 SHA。设计预览继续是 dirty，不得作为生产导入凭据。Rules 接收方需在 T2/T3/T4 的来源迁移中验证修订与逐卡差异；本 PR 不重写旧 PASS、历史排除和旧作者源。

## 电能：T2 的权威纯查询

现有 `EffectValueQuery.Evaluate` 处理法伤与泛化 `EffectProvidedValue`，后者不能直接更名为电能。复用 `ContinuousEffectQuery` / `ContinuousEffectScopeQuery` 的范围与启用判断、`ContinuousStatQuery` 的属性查询及 `EffectiveArrowQuery` 的箭头查询。

T2 提供接收权威上下文和明确卡牌实例、返回当前有效电能整数的纯查询：不写状态、不消费额度、不执行计划、不抽样随机数。电能由当前有效光环与未到期实例修正叠加，范围包含供电者自身，采用既有控制、沉默、建造与生命周期规则。`ElectricityQuery.Evaluate` 仅为建议名称，尚非可调用 API。

受益声明须定位到具体语义项：采矿收入、学院回合末进度增量、军工厂/机器人的已点亮箭头层数、哨塔攻击与射程。不存在声明的项目不受益；未知声明应由编译器拒绝。供电量、学院阈值/完成奖励、核电站亡语不受电能增强。移除旧供电牌泛化加值，避免重复计算。超载的电能修正显式于本回合结束到期。

结算与文本投影必须复用同一纯求值入口和效果表达式；UI 不另行决定加法、乘法顺序。T2 交付查询、表达式/字段身份及测试，T6 接入文本绑定。

## 生命周期：T4 的实例与事实合同

当前 `TransformCard` 和 `FormShift` 共用 `TransformRuleHandler` / `CardFormPolicy.Apply` 并发出 `CardFormShifted`。这不满足本轮两种语义的区别，T4 必须拆开：

- **Transform 转化**：创建目标定义的新实例与入场身份；目标按初始状态初始化，重新接受当前有效外部光环，触发目标适用入场。旧伤势、护甲、增益、进度、行动额度和已用耐久不拷贝；旧锁定和待处理引用不自动转嫁。保留格子、拥有者、当前控制关系作为转化上下文，不留下可再利用的原卡副本。
- **FormShift 普通变身**：保留原实例及批准范围内的状态，不刷新行动额度；形态属于修正，逆向转区清除，弃牌堆保留原卡。目标新增进度依定义初始化，永久修正的既有例外保持。不得从“是否新实例”推导额外的入场裁定或改写未批准规则。
- 转化须记录可序列化的新旧实例/定义关系。占格替换、初始化和事实提交完成后，才进入后续死亡扫描和触发处理。被替代的离场不能再次作用于新维拉。
- 维拉入场检查当前友方控制的同定义计划，建造中也算存在；敌方计划不阻止放置。多次入场按权威顺序看到此前已经成功放置的计划。

必须审查的现有路径：`TransferCardRuleHandler`、`CardTransferMutation`、`AttributeRuleHandler` 死亡处理、`TimeStopMergeRuleHandler` 湮灭及 `SettlementKernel` 死亡扫描。仅修改普通转区不足以覆盖致死、消灭、湮灭、回手、洗回和移除。旧事实快照不能随当前形态还原而被改写。

双方革命日同批湮灭的落位冲突，以及“敌方单位/敌方随从”目标域是否等价，按 #81 收集最小局面并核对现行规则；若无法唯一裁决则记录并请求裁定，不静默扩大目标或增加离场例外。溢出3点令每个合法相邻敌方对象各受3点，不均分。

## 绿色数值：T6 的只读投影合同

复用 Rules `Runtime/Shared/Protocol/Projection/CardTextContextDto.cs` → `ProjectionService.Snapshot.cs` → Presentation `CardTextFormatter.cs` 链路。现有 DTO 只有保留上下文，不足以表达逐数字变更。

T6 在现有上下文中增加语义片段集合，最小含义如下（字段名待实现固定）：

- 稳定槽位身份，以及卡定义 UID / 文本绑定版本；
- 编译期唯一定位的数字片段范围或等价定位；
- 服务器从实际表达式求得的当前值、基准值与法伤/电能影响信息；
- 此数字是否因指定加成实际改变的高亮标识。

绑定关联卡 UID、效果/进度 ID、表达式或语义字段与文本槽位；编译器验证身份、定位、源表达式与覆盖。禁止按卡名或第几个数字推测受益。客户端仅转义、格式化和着色，不求值、不从大小变化猜测加成来源。

验收样例：耀斑连射未保留且法伤+2，基础6显示8并标绿，保留系数4不变；学院电能+2，进度+1显示+3并标绿，箭头6、循环3、完成奖励减少1不变。未知目标/事件相关数值不伪造确定结果，纯定义预览使用基础文本。

`TimeStopVisibilityEpochPolicy`、`FrozenPublicEntityFact`、`FrozenVisibleHandCardFact`、序列化/克隆/快照与增量同时保存片段；对手冻结视角不得查询实时加成。刷新键覆盖实例、当前定义、绑定版本、片段定位/值/高亮及旧保留注释。转化、变身、切换视角和回放均使不匹配旧绑定失效；每次从原始文案渲染。绑定版本不匹配时回退基础文本并记录诊断，不能错用旧槽位。

## 并行写入与交接

| 写入范围 | 唯一责任方 |
| --- | --- |
| 电能查询、来源/受益词汇、8张电能卡与对应求值 | T2 |
| 转化/变身、离场替代、新旧实例事实、维拉/烬白内容 | T4 |
| 其他17张卡效果与必要通用机制 | T3 |
| 数值绑定模型、CardTextContextDto、投影与冻结文本、Presentation 渲染 | T6，分别在 Rules 与 Presentation 提交 |
| 各卡表达式与稳定效果标识 | 对应 T2/T3/T4 卡牌负责人；T6消费并协调绑定增量 |
| 公共schema/decoder注册、内容版本、生成catalog、测试总清单 | 主协调者串行整合各任务最小增量 |
| cards.json、图片登记与网站镜像 | T1/T5协调者串行写入 |

T2/T4 不另造文本 DTO，不同时修改 T6 拥有的投影文件。跨任务新增共享状态字段由拥有者提交并同步消费者；独立工作目录不能代替接口约定。T6 可在接口定稿后并行开发，真实数值验收仍等待对应规则。T7 在首批功能可运行时接本地包联调，最终用固定候选 SHA 对齐依赖并完整验收。T1 不启动 T2–T7 的实现。
