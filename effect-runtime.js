const runtimeCases = [
  {
    id: "simple-damage",
    group: "Triggered",
    title: "普通伤害：发动后打一个目标",
    code: "OnCast -> Select -> Damage",
    summary: "最基础的三段式效果。旧的 Trigger / Scope / Effect 会被展开成 Select + Apply 两条命令。",
    nodes: [
      { kind: "trigger", label: "Trigger", title: "OnCast", body: "玩家点击棋盘上的卡牌效果按钮，事件系统创建一次 EffectResolution。" },
      { kind: "command", label: "Select", title: "选择目标", body: "ScopeQuery 找到 EnemyBattlefield{Minion}，SelectionPolicy 让玩家选 1 个。" },
      { kind: "action", label: "Apply", title: "Damage{2}", body: "DamageAction 构建伤害事件，检查护盾、免疫、减伤等替换规则。" },
      { kind: "runtime", label: "Ledger", title: "记录结果", body: "ResultLedger 记录实际伤害、死亡对象和由本次 Apply 直接产生的事件。" },
      { kind: "runtime", label: "Flush", title: "刷新规则", body: "如果单位死亡或状态改变，ContinuousEffectSystem 与 ModifierSystem 在安全点刷新。" }
    ],
    notes: [
      "简单效果仍然可以在表里读作：OnCast + Scope + Effect。",
      "真正运行时会拆成命令，这样后续才能插入代价、分支、循环和结果引用。",
      "默认统计口径应该绑定到本次 Apply 的结果，而不是整段连锁里所有间接死亡。"
    ]
  },
  {
    id: "rocket",
    group: "Triggered",
    title: "瞬发火箭弹：先选落点，再支付距离费用",
    code: "Anchor -> Cost -> Area Damage",
    summary: "玩家点选的不是最终受击者，而是一个区域锚点。系统再从锚点派生 3x3 范围目标。",
    nodes: [
      { kind: "trigger", label: "Trigger", title: "OnCast", body: "效果进入结算队列，Source 是这张火箭弹。" },
      { kind: "command", label: "Select", title: "选择落点 Anchor", body: "ReachableGrid 根据射程和距离费用列出可选格子，玩家选一个 aimGrid。" },
      { kind: "command", label: "SetVariable", title: "计算 chargeCost", body: "从 source.grid 到 aimGrid 的距离计算需要消耗多少 Charge。" },
      { kind: "command", label: "PayCost", title: "支付充能", body: "SpendResource{Charge: chargeCost}，失败则后续分支不执行。" },
      { kind: "command", label: "Branch", title: "费用是否成功", body: "costPaid == true 时进入伤害分支，否则效果到此结束。" },
      { kind: "command", label: "Select", title: "派生 3x3 目标", body: "Rectangular{centre: aimGrid, h:3, w:3, filter: Enemy}，Selection = ALL。" },
      { kind: "action", label: "Apply", title: "Damage{2}", body: "对范围内所有敌方目标同时结算伤害，并保存 damageResult。" }
    ],
    notes: [
      "OutputRole 很关键：第一次选择是 Anchor，不是 Target。",
      "复杂效果最好先完成必要选择，再进入不可逆 cost 的 commit point。",
      "这种图能帮你检查：玩家到底点的是单位、格子、范围中心，还是代价对象。"
    ]
  },
  {
    id: "exile-space",
    group: "Triggered",
    title: "放逐太空：移除一张手牌来抽牌",
    code: "PayCost -> Branch -> Draw",
    summary: "这是因果式效果：必须成功支付代价，才执行收益。",
    nodes: [
      { kind: "trigger", label: "Trigger", title: "OnPlace", body: "卡牌放置入场，触发入场效果。" },
      { kind: "command", label: "Select", title: "选择代价牌", body: "Scope = HandCards{Me}，OutputRole = CostTarget。" },
      { kind: "command", label: "PayCost", title: "Remove costCard", body: "把选中的手牌送入 Removed / Void 区域，返回 costPaid。" },
      { kind: "command", label: "Branch", title: "检查 costPaid", body: "只有 true 才进入收益分支；false 不抽牌。" },
      { kind: "action", label: "Apply", title: "DrawCard{1}", body: "SourceController 抽 1 张牌，ResultLedger 记录抽牌来源。" }
    ],
    notes: [
      "PayCost 和 Apply 很像，但语义不同：PayCost 是门槛，Apply 是收益或状态改变。",
      "如果设计允许支付后无目标也失败，必须在 FailurePolicy 里显式写出。",
      "Removed / Void 和弃牌堆不是一回事，后续效果引用区域时要严格区分。"
    ]
  },
  {
    id: "defile",
    group: "Triggered",
    title: "亵渎式循环：全场打 1，有死亡就重复",
    code: "Repeat DoWhile",
    summary: "每一轮都重新读取当前局面，所以新召唤、死亡、离场都会影响下一轮目标。",
    nodes: [
      { kind: "trigger", label: "Trigger", title: "OnCast", body: "创建一次外层 EffectResolutionId。" },
      { kind: "command", label: "Repeat", title: "DoWhile", body: "进入循环体，MaxIterations 作为异常安全阀。" },
      { kind: "command", label: "Select", title: "全场随从", body: "BattlefieldGlobal{CardType:Minion}，Selection = ALL，每轮重新取一次。" },
      { kind: "action", label: "Apply", title: "Damage{1}", body: "对当前所有随从造成 1 点伤害，保存 damageResult。" },
      { kind: "command", label: "SetVariable", title: "deathCount", body: "CountDeathsCausedBy{damageResult} 统计本轮伤害直接导致的死亡数。" },
      { kind: "command", label: "ContinueIf", title: "deathCount > 0", body: "若本轮有人死亡，则回到 Repeat 开始下一轮；否则结束。" }
    ],
    notes: [
      "Repeat 不是复制一段静态目标列表，而是每轮重新执行 ScopeQuery。",
      "deathCount 的统计范围必须清楚，否则亡语、反伤、额外召唤会把结果搅乱。",
      "MaxIterations 是防止异常无限循环的工程安全阀。"
    ]
  },
  {
    id: "replay",
    group: "Triggered",
    title: "沙德沃克式重放：触发本局战吼历史",
    code: "Replay History",
    summary: "Replay 从历史记录中取出程序，再按规则重新执行。它需要明确快照、顺序、来源和目标策略。",
    nodes: [
      { kind: "trigger", label: "Trigger", title: "OnPlace", body: "当前卡牌入场，准备重放本局战吼。" },
      { kind: "command", label: "Replay", title: "读取历史", body: "HistorySource = ResolvedBattlecriesThisGame。" },
      { kind: "runtime", label: "Snapshot", title: "拍摄历史快照", body: "Replay 开始时固定列表，避免把自己或后续新增战吼卷进本次重放。" },
      { kind: "runtime", label: "TargetPolicy", title: "重新选目标", body: "原目标失效时，根据策略重选、随机合法目标或跳过。" },
      { kind: "runtime", label: "Queue", title: "创建子结算", body: "每个被重放的战吼作为子 EffectResolution 执行，同时保留父子归属。" },
      { kind: "runtime", label: "Ledger", title: "统一归档", body: "日志能看出这是沙德沃克外层结算下的第几条子效果。" }
    ],
    notes: [
      "Replay 最容易出问题的是：历史快照、目标失效、来源归属和递归记录。",
      "重放产生的小效果可以触发监听，但仍应挂在同一个外层归属链里。",
      "这类效果必须靠 ResultLedger 和 EffectResolutionId 保持可追踪。"
    ]
  },
  {
    id: "divine-shield",
    group: "Continuous",
    title: "圣盾：状态 + 伤害替换规则",
    code: "AddContinuousEffect{DivineShield}",
    summary: "圣盾不是简单 bool。它是一个挂在 Host 上的持续性效果，贡献 StatusMarker 和 ReplacementRule。",
    nodes: [
      { kind: "trigger", label: "Trigger", title: "获得圣盾", body: "可能来自战吼、法术、装备或初始关键词。" },
      { kind: "action", label: "Apply", title: "AddContinuousEffect", body: "去 NamedContinuousEffectRegistry 找 DivineShield 模板，创建实例。" },
      { kind: "runtime", label: "Host", title: "挂到目标身上", body: "HostBinding = Target，Lifetime = UntilConsumed。" },
      { kind: "runtime", label: "Contribution", title: "贡献两类规则", body: "StatusMarker{DivineShield} 用于 UI；ReplacementRule 用于拦截下一次伤害。" },
      { kind: "runtime", label: "IncomingDamage", title: "伤害到来", body: "ReplacementRuleResolver 检查目标身上的替换规则。" },
      { kind: "action", label: "Prevent", title: "阻止伤害并消耗", body: "PreventDamage + ConsumeSelf，随后移除这个 ContinuousEffectInstance。" }
    ],
    notes: [
      "StatusMarker 负责显示，不应该独自承担规则。",
      "ReplacementRule 负责改变即将发生的事件，比如防止伤害。",
      "圣盾被消耗后，Host 上的实例消失，UI marker 也随之移除。"
    ]
  },
  {
    id: "aura",
    group: "Continuous",
    title: "3x3 光环：范围内海盗 +1 攻击",
    code: "Continuous Aura",
    summary: "光环不应该每帧 Update。移动、入场、离场等事件只标 dirty，在规则安全点统一重算。",
    nodes: [
      { kind: "trigger", label: "Enter", title: "Host 入场", body: "卡牌自带 ContinuousEffectDefinition，挂在 Self 上。" },
      { kind: "runtime", label: "Lifetime", title: "WhileHostInBattlefield", body: "只要 Host 还在战场，这个持续效果实例就存在。" },
      { kind: "runtime", label: "AffectedScope", title: "Rectangular 3x3", body: "以 Host.grid 为中心，找范围内 Species:Pirate 的单位。" },
      { kind: "runtime", label: "Contribution", title: "Modifier ATK +1", body: "向受影响目标贡献 Modifier，而不是直接改 target.Attack。" },
      { kind: "runtime", label: "Dirty", title: "移动或区域变化", body: "UnitMoved / UnitEnteredZone / UnitLeftZone 标记持续效果 dirty。" },
      { kind: "runtime", label: "Flush", title: "安全点重算", body: "清空旧贡献，重新 EvaluateScope，再让 ModifierSystem 计算最终攻击力。" }
    ],
    notes: [
      "光环读取的是当前棋盘状态，因此 Host 或目标移动都会改变受影响集合。",
      "不要直接把攻击力写死到单位字段，后续沉默、离场、范围变化会很难回滚。",
      "第一版可以全量重算，后续再做局部 dirty 和依赖图优化。"
    ]
  },
  {
    id: "taunt",
    group: "Continuous",
    title: "距离嘲讽：范围内敌人只能攻击自己",
    code: "Constraint AttackTargetRestriction",
    summary: "这类效果不改变数值，而是贡献合法性约束。攻击前先刷新，再求合法目标交集。",
    nodes: [
      { kind: "runtime", label: "Host", title: "嘲讽来源在场", body: "ContinuousEffectInstance 挂在提供约束的单位身上。" },
      { kind: "runtime", label: "Scope", title: "Distance{Enemy, 3}", body: "查找距离 Host 3 格内的敌方随从。" },
      { kind: "runtime", label: "Contribution", title: "Constraint", body: "AttackTargetRestriction，LegalTargets = {Host}。" },
      { kind: "runtime", label: "CanExecute", title: "攻击合法性检查", body: "攻击前 FlushContinuousEffects，收集攻击者身上的所有限制。" },
      { kind: "runtime", label: "Intersect", title: "求合法目标", body: "原始合法目标与所有 restriction 的允许集合取交集。" },
      { kind: "action", label: "Attack", title: "执行攻击", body: "若多个嘲讽源同时影响，攻击者只能在这些合法 Host 中选择。" }
    ],
    notes: [
      "Constraint 通常在普通数值 modifier 之后生效。",
      "禁止类规则优先于允许类规则。",
      "多个限制冲突时，需要在规则层定义求交集或优先级。"
    ]
  }
];

const kindLabels = {
  trigger: "Trigger",
  command: "Command",
  action: "Apply",
  runtime: "Runtime"
};

const state = {
  activeId: runtimeCases[0].id
};

const tabsEl = document.querySelector("#runtimeCaseTabs");
const headEl = document.querySelector("#runtimeFlowHead");
const canvasEl = document.querySelector("#runtimeFlowCanvas");
const detailEl = document.querySelector("#runtimeDetailPanel");

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function activeCase() {
  return runtimeCases.find((item) => item.id === state.activeId) || runtimeCases[0];
}

function renderTabs() {
  tabsEl.innerHTML = runtimeCases.map((item) => {
    const active = item.id === state.activeId ? "is-active" : "";
    return `
      <button class="runtime-case-tab ${active}" type="button" data-runtime-id="${escapeHtml(item.id)}">
        <span>${escapeHtml(item.group)}</span>
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.code)}</small>
      </button>
    `;
  }).join("");
}

function renderHead(item) {
  headEl.innerHTML = `
    <div>
      <span class="section-kicker">${escapeHtml(item.group)} LOGIC</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary)}</p>
    </div>
    <code>${escapeHtml(item.code)}</code>
  `;
}

function renderCanvas(item) {
  canvasEl.innerHTML = item.nodes.map((node, index) => `
    <div class="runtime-flow-step">
      <div class="runtime-node node-${escapeHtml(node.kind)}">
        <span>${escapeHtml(node.label || kindLabels[node.kind])}</span>
        <strong>${escapeHtml(node.title)}</strong>
        <small>${escapeHtml(node.body)}</small>
      </div>
      ${index < item.nodes.length - 1 ? `<div class="runtime-connector" aria-hidden="true"><span></span></div>` : ""}
    </div>
  `).join("");
}

function renderDetail(item) {
  const nodeCards = item.nodes.map((node, index) => `
    <div class="runtime-detail-row">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <div>
        <strong>${escapeHtml(node.title)}</strong>
        <p>${escapeHtml(node.body)}</p>
      </div>
    </div>
  `).join("");

  detailEl.innerHTML = `
    <div class="runtime-detail-head">
      <span class="section-kicker">DETAIL TRACE</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary)}</p>
    </div>
    <div class="runtime-detail-list">${nodeCards}</div>
    <div class="runtime-note-block">
      <span>设计检查点</span>
      <ul>
        ${item.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
      </ul>
    </div>
  `;
}

function renderAll() {
  const item = activeCase();
  renderTabs();
  renderHead(item);
  renderCanvas(item);
  renderDetail(item);
}

tabsEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-runtime-id]");
  if (!button) return;
  state.activeId = button.dataset.runtimeId;
  renderAll();
});

renderAll();
