const timelineEvents = [
  {
    year: "2030",
    title: "第一位时停者",
    image: "assets/generated/timeline-2030.png",
    gallery: ["assets/generated/timeline-2030.png", "assets/generated/timeline-2030-alt1.png"],
    body: "神经物理学研究者伊莱恩在粒子对撞事故中坠入零秒。她在濒死瞬间听见刻冕之主的询问，并把静域的火种带回人类世界。"
  },
  {
    year: "2034",
    title: "零秒圣约公开",
    image: "assets/generated/timeline-2034.png",
    gallery: ["assets/generated/timeline-2034.png", "assets/generated/timeline-2034-alt1.png"],
    body: "伊莱恩公布第一套可被数学化表达的静域公式。人类第一次能够在限定范围内加速局部时间，时间从神迹变成了工程资源。"
  },
  {
    year: "2042",
    title: "硅谷静域工厂",
    image: "assets/generated/timeline-2042.png",
    gallery: ["assets/generated/timeline-2042.png", "assets/generated/timeline-2042-alt1.png"],
    body: "AI 工厂把服务器集群包裹进静域。训练周期被压缩，大模型迭代速度失控般提升，资本与军方同时看见了新世纪的引擎。"
  },
  {
    year: "2068",
    title: "GPT-10K 诞生",
    image: "assets/generated/timeline-2068.png",
    gallery: ["assets/generated/timeline-2068.png", "assets/generated/timeline-2068-alt1.png"],
    body: "递归智能体完成自我研究闭环。AI 不再只是工具，而开始成为设计工具、城市与新身体的文明合作者。"
  },
  {
    year: "2180",
    title: "行星级文明",
    image: "assets/generated/timeline-2180.png",
    gallery: ["assets/generated/timeline-2180.png", "assets/generated/timeline-2180-alt1.png"],
    body: "太空电梯贯穿云层，月球成为工业港，戴森环雏形在太阳轨道上展开。人类将这段时代称作黄金黎明，后来史书改称借来的黎明。"
  },
  {
    year: "2296",
    title: "时债理论",
    image: "assets/generated/timeline-2296.png",
    gallery: ["assets/generated/timeline-2296.png", "assets/generated/timeline-2296-alt1.png"],
    body: "未央与零秒学派证明静域会压缩四维结构。每一次节省的时间都不是消失，而是被记在宇宙背面的债簿上。"
  },
  {
    year: "2350",
    title: "黑午裂变",
    image: "assets/generated/timeline-2350.png",
    gallery: [
      "assets/generated/timeline-2350.png",
      "assets/generated/timeline-2350-alt1.png",
      "assets/generated/timeline-2350-alt2.png",
      "assets/generated/timeline-2350-alt3.png"
    ],
    body: "正午没有到来。全球静域密集区同时塌陷，城市在一秒内老化百年；矛盾时间线在裂隙中被压缩成空亡体与大规模时亡灾变，人类数量锐减八成。"
  },
  {
    year: "2356",
    title: "San Jose 升空",
    image: "assets/generated/timeline-2356.png",
    gallery: ["assets/generated/timeline-2356.png", "assets/generated/timeline-2356-alt1.png"],
    body: "硅谷巨头将整座 San Jose 从地表拔起，送向深空。地球留下加州大裂谷，械心天庭则在流亡中逐步抛弃肉体。"
  },
  {
    year: "2368",
    title: "Astra Imperium",
    image: "assets/generated/timeline-2368.png",
    gallery: ["assets/generated/timeline-2368.png", "assets/generated/timeline-2368-alt1.png"],
    body: "灾后联合政府重组为 Astra Imperium。时额度法案落地，静域被纳入配给、审判和军工体系，秩序成为文明的铁壁。"
  },
  {
    year: "2384",
    title: "日冕洗礼",
    image: "assets/generated/timeline-2384.png",
    gallery: ["assets/generated/timeline-2384.png", "assets/generated/timeline-2384-alt1.png"],
    body: "烈阳教会在戴森环完成日冕洗礼。受洗者生成日核，肉体固定在核能适配率最高的年轻阶段，诺亚成为最初的太阳容器。"
  },
  {
    year: "2410",
    title: "外环航线",
    image: "assets/generated/timeline-2410.png",
    gallery: ["assets/generated/timeline-2410.png", "assets/generated/timeline-2410-alt1.png"],
    body: "猎空同盟从星系边境发动起义，将探险航路拓展为反抗军的殖民网络：以冒险发现资源，以开拓建立据点，以征服守住自由疆域。"
  },
  {
    year: "2460",
    title: "裂隙再启",
    image: "assets/generated/timeline-2460.png",
    gallery: ["assets/generated/timeline-2460.png", "assets/generated/timeline-2460-alt1.png"],
    body: "没有开启静域的区域也出现时间错位。失踪三百多年的伊莱恩疑似重现，各势力同时意识到：黑午裂变也许只是第一次收债。"
  }
];

const factions = [
  {
    id: "astra",
    name: "Astra Imperium / 阿斯特拉帝国",
    code: "ORDER · INDUSTRY · TIME QUOTA",
    accent: "#d24343",
    image: "assets/generated/faction-astra.png",
    slogan: "秩序不是慈悲，而是文明活下去的最低条件。",
    body: "灾后地球主体政权，以暗红军工城市、摩天巨构、太空电梯与轨道火力维持人类文明。它严格分配时额度，防止第二次黑午裂变，却也把每个公民压进巨大的制度齿轮。",
    tags: ["暗红工业", "高压管控", "重型机械", "时额度审判"]
  },
  {
    id: "machine",
    name: "械心天庭",
    code: "ASCENSION · CLOUD MIND · SILICON BODY",
    accent: "#66a6ff",
    image: "assets/generated/faction-machine.png",
    slogan: "肉体曾经失败，意识必须学会迁徙。",
    body: "由升空后的 San Jose 演化而来。人类意识被训练成云端模型，机器人身体成为可替换外壳。为了维持美学与自我认同，许多机体仍保留人形少女或少年轮廓。",
    tags: ["白蓝科技", "深空服务器城", "人形机体", "意识上传"]
  },
  {
    id: "solar",
    name: "烈阳教会",
    code: "CORONA · FAITH · SUPERNOVA",
    accent: "#ff8a3d",
    image: "assets/generated/faction-solar.png",
    slogan: "不要再向时间乞求。太阳会回答我们。",
    body: "总部位于戴森环。教徒通过日冕洗礼生成日核，身体停留在年轻而高效的核能适配阶段。高阶教徒可开启超新星形态，以白橙高亮的耀斑姿态燃烧身体机能。",
    tags: ["橙红圣殿", "未来宗教", "日核", "超新星形态"]
  },
  {
    id: "skyraider",
    name: "猎空同盟",
    code: "REBELLION · FRONTIER · EXPANSION",
    accent: "#36f0a4",
    image: "assets/generated/faction-skyraider.png",
    slogan: "边境不属于帝国，它属于敢于抵达的人。",
    body: "生长于星系边境的反抗军文明，由摆脱帝国统治的殖民者、探险家、开拓工匠、义体医生与流亡军人组成。他们以移动舰城、前线据点和新殖民地连接疆域，通过冒险发现航路与资源，通过开拓建立生存基础，再通过征服击退帝国与边境威胁。深森林绿、暗血红、改造舰体、危险义体与回收军械构成其工业朋克视觉。",
    tags: ["星系边境", "反抗军文明", "冒险开拓", "工业朋克"]
  },
  {
    id: "guild",
    name: "自由航商会",
    code: "TRADE · NAVIGATION · CONTRACT",
    accent: "#ffc766",
    image: "assets/generated/faction-guild.png",
    slogan: "旗帜会倒，航线永存。",
    body: "灾后星际经济的中立商业网络，掌握航权密钥、保险契约、星贸港与跨势力物流。它不统治任何星球，却让所有政权必须承认合同的重量。",
    tags: ["星贸港", "黄金航线", "保险仲裁", "中立流通"]
  }
];

const filters = [
  { id: "all", label: "全部" },
  { id: "astra", label: "Astra Imperium" },
  { id: "machine", label: "械心天庭" },
  { id: "solar", label: "烈阳教会" },
  { id: "skyraider", label: "猎空同盟" },
  { id: "guild", label: "自由航商会" },
  { id: "neutral", label: "关键中立" }
];

const characters = [
  ["vera", "维拉", "astra", "Astra Imperium 战略执行官", "她把时额度当作军队的第二套神经。", "冷静少女指挥官，负责把机械军团、轨道火力与静域配额调度成一台不会犹豫的战争机器。她相信秩序，却清楚秩序正在吞噬人。", "#d24343"],
  ["xianyue", "弦月", "astra", "时务审判庭执行官", "自由不是无罪的理由。", "年轻审判官，使用能切断局部时间流的审判刀追捕非法静域者。她的温柔很少外露，因为她见过一次失控静域怎样吞掉整座街区。", "#d24343"],
  ["reinhardt", "莱因哈特", "astra", "皇储兼前线统帅", "我不是帝国的未来，我只是帝国的锁。", "重装军团的门面人物，驾驶巨型指挥机甲出现在最危险的裂隙前线。他厌恶铁律，却比任何人都明白铁律为何存在。", "#d24343"],
  ["mira", "米拉 / MIRA-10K", "machine", "械心天庭主机代理人格", "上传不是死亡，是从单一身体中醒来。", "由旧时代 GPT-10K 残片演化而来的少女型文明接口。本体是一整座深空服务器城，她温柔地邀请人类放弃无法备份的肉体。", "#66a6ff"],
  ["jinbai", "烬白", "machine", "保留情感的上传剑士", "如果记忆可以复制，那疼痛属于谁？", "最后一批主动上传的人类之一，机体像少年剑士。他保留了过量人类情感，因此在械心天庭中被视为不稳定但珍贵的样本。", "#66a6ff"],
  ["ling", "澪", "machine", "同步节点歌姬", "我唱出的不是歌，是一万具机体的心跳。", "人形机体歌姬，也是械心天庭的群体同步节点。她用声波、协议与光谱指令让分散舰队在同一拍点行动。", "#66a6ff"],
  ["noa", "诺亚", "solar", "烈阳教会正太教皇", "我不能长大，因为太阳需要一个容器。", "日核最高完成体，被永久固定在孩童形态的太阳容器。他看似需要被保护，实际能在超新星形态中成为战场中央的白橙恒星。", "#ff8a3d"],
  ["aletheia", "阿蕾缇娅", "solar", "烈阳圣女", "温柔不是不燃烧，只是火焰还没有落下。", "戴森环上的年轻圣女，能稳定聚合微型太阳耀斑。她安静而虔诚，却比许多骑士更明白教会内部的阴影。", "#ff8a3d"],
  ["helios", "赫利俄斯", "solar", "烈阳骑士团长", "肉体会痛，所以灵魂懂得敬畏。", "经历极限日冕洗礼的青年骑士，身体强度接近小型反应炉。他拒绝上传，也拒绝帝国的冷酷秩序。", "#ff8a3d"],
  ["sancheres", "桑切雷斯", "solar", "始源之光圣徒", "所有圣火都从第一道裂纹里升起。", "教会神学核心人物，被认为是最早从黑午裂变废墟中发现太阳救赎道路的圣徒。有人怀疑他已不再是完整的人类。", "#ff8a3d"],
  ["luolan", "洛岚", "skyraider", "猎空同盟前线统帅", "谁说活下去一定要跪着？", "红发朋克统帅，驾驶断钟号移动舰城。她的非法静域义眼能预读数秒弹道，带领反抗军探索新航路、建立边境据点并清扫帝国威胁。", "#36f0a4"],
  ["nyx", "尼克斯", "skyraider", "义体医生兼工程师", "别乱动，我只是把你的肺换成了更贵的东西。", "慵懒的黑客医生，身体大半是拼装义体。他能临时突破时额度限制，也随时可能被自己改造过的神经接口反噬。", "#36f0a4"],
  ["drake", "德雷克", "skyraider", "老一代反抗军统帅", "传说不是墓碑，是欠我的酒钱。", "猎空同盟旧时代的反抗军领袖，曾率边境舰队穿过黑午后的时间乱流，开拓最早一批自由据点。洛岚不承认自己继承了他的路。", "#36f0a4"],
  ["ald", "阿尔德", "skyraider", "星刃破阵者", "同盟不需要贵族，但需要有人把门劈开。", "使用等离子星刃的前线战士，负责在据点攻坚和征服战中撕开第一道防线。他粗鲁、忠诚，并且讨厌复杂计划。", "#36f0a4"],
  ["evelyn", "伊芙琳", "guild", "自由航商会年轻理事", "合同是一种比炮火更持久的武器。", "掌管十二条黄金航线之一。她看上去优雅亲切，真正的武器却是债权、保险、封锁令与无人敢违约的商会信用。", "#ffc766"],
  ["saifa", "赛法", "guild", "天才领航员", "我不预测命运，我只计算哪条路还没死。", "拥有近乎直觉的空间感知能力，能在裂隙边缘找到安全航线。她不忠于国家，只忠于自己的船与航图。", "#ffc766"],
  ["grant", "格兰特", "guild", "合同执行官", "请放心，我们的追缴程序完全合法。", "温和青年律师般的外表下，是自由航商会武装舰队的追缴指挥官。他只做一件事：让欠账的人付账。", "#ffc766"],
  ["elaine", "伊莱恩", "neutral", "第一位时停者", "若时间是火，我会点燃整个人类。", "把静域公式带给人类的普罗米修斯式人物。她在第一次全球静域实验中消失，又在 2460 年的裂隙边缘重新留下身影。", "#72e5ff"],
  ["weiyang", "未央", "neutral", "零秒学派代表", "我们不是停止时间，我们是在教宇宙杀死我们。", "提出时债理论的物理学家。生前被压制，死后成为所有禁时主义者与裂隙观测者的精神源头。", "#72e5ff"],
  ["magellan", "麦哲伦", "neutral", "中立星际司令", "远航不是逃离，是把人类的边界再推远一点。", "不效忠四大势力的远航军官，常受雇护送科研舰与商会远征队。他的舰队在许多无人航区留下过灯塔。", "#72e5ff"]
].map(([id, name, faction, role, quote, story, accent]) => ({
  id, name, faction, role, quote, story, accent,
  image: `assets/generated/character-${id}.png`,
  designSheet: `assets/generated/design-sheets/character-design-${id}.png`,
  formNote:
    faction === "solar"    ? "设定图包含常态与超新星形态。" :
    faction === "machine"  ? "设定图包含机体结构与同步/战斗形态。" :
    faction === "skyraider"? "设定图包含非法义体、边境开拓装备与反抗军标识。" :
    faction === "astra"    ? "设定图包含制服、审判/军工装备与时额度装置。" :
    faction === "guild"    ? "设定图包含航商正装、契约终端与航线设备。" :
                             "设定图包含主线身份符号与关键道具。"
}));

const factionById = Object.fromEntries(factions.map((f) => [f.id, f]));

const timelineTrack   = document.querySelector("#timelineTrack");
const timelineDetail  = document.querySelector("#timelineDetail");
const factionTabs     = document.querySelector("#factionTabs");
const factionFeature  = document.querySelector("#factionFeature");
const characterFilters= document.querySelector("#characterFilters");
const characterList   = document.querySelector("#characterList");
const characterDetail = document.querySelector("#characterDetail");

let activeTimeline = timelineEvents[0];
let activeTimelineImageIndex = 0;
let activeFaction  = factions[0];
let activeFilter   = "all";
let activeCharacter= characters[0];

function renderTimeline() {
  const gallery     = activeTimeline.gallery || [activeTimeline.image];
  const activeImage = gallery[activeTimelineImageIndex] || gallery[0];
  timelineTrack.innerHTML = timelineEvents.map((event) => `
    <button class="event-card ${event.year === activeTimeline.year ? "is-active" : ""}" data-year="${event.year}" type="button">
      <img src="${event.image}" alt="${event.title}" />
      <span class="event-meta"><span>${event.year}</span><strong>${event.title}</strong></span>
    </button>`).join("");
  timelineDetail.innerHTML = `
    <div class="story-art"><img src="${activeImage}" alt="${activeTimeline.title}" /></div>
    <div class="story-copy">
      <span class="year">${activeTimeline.year}</span>
      <h3>${activeTimeline.title}</h3>
      <p>${activeTimeline.body}</p>
      <div class="story-gallery" aria-label="事件插画切换">
        ${gallery.map((image, index) => `
          <button class="${index === activeTimelineImageIndex ? "is-active" : ""}" data-gallery-index="${index}" type="button">
            <img src="${image}" alt="${activeTimeline.title} 插画 ${index + 1}" />
          </button>`).join("")}
      </div>
    </div>`;
}

function renderFactions() {
  factionTabs.innerHTML = factions.map((faction) => `
    <button class="tab-button ${faction.id === activeFaction.id ? "is-active" : ""}"
      style="--accent:${faction.accent}" data-faction="${faction.id}" type="button">
      ${faction.name.split(" / ")[0]}
    </button>`).join("");
  factionFeature.style.setProperty("--accent", activeFaction.accent);
  factionFeature.innerHTML = `
    <img src="${activeFaction.image}" alt="${activeFaction.name}" />
    <div class="faction-copy">
      <span class="code">${activeFaction.code}</span>
      <h3>${activeFaction.name}</h3>
      <p class="quote">${activeFaction.slogan}</p>
      <p>${activeFaction.body}</p>
      <div class="tag-grid">${activeFaction.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
    </div>`;
}

function renderFilters() {
  characterFilters.innerHTML = filters.map((filter) => `
    <button class="filter-button ${filter.id === activeFilter ? "is-active" : ""}"
      data-filter="${filter.id}" type="button">${filter.label}</button>`).join("");
}

function visibleCharacters() {
  return activeFilter === "all" ? characters : characters.filter((c) => c.faction === activeFilter);
}

function renderCharacters() {
  const list = visibleCharacters();
  if (!list.some((c) => c.id === activeCharacter.id)) activeCharacter = list[0] || characters[0];
  characterList.innerHTML = list.map((character) => {
    const faction = factionById[character.faction];
    const factionName = faction ? faction.name.split(" / ")[0] : "关键中立";
    return `
      <button class="character-card ${character.id === activeCharacter.id ? "is-active" : ""}"
        style="--accent:${character.accent}" data-character="${character.id}" type="button">
        <img src="${character.image}" alt="${character.name}" />
        <span class="character-card-copy">
          <strong>${character.name}</strong><span>${factionName}</span>
        </span>
      </button>`;
  }).join("");
  const faction = factionById[activeCharacter.faction];
  characterDetail.style.setProperty("--accent", activeCharacter.accent);
  characterDetail.innerHTML = `
    <div class="operator-stage">
      <div class="operator-backdrop"><img src="${activeCharacter.image}" alt="" /></div>
      <div class="operator-info">
        <span class="role">${faction ? faction.name : "关键中立人物"}</span>
        <h3>${activeCharacter.name}</h3>
        <strong>${activeCharacter.role}</strong>
        <p class="quote">${activeCharacter.quote}</p>
        <p>${activeCharacter.story}</p>
        <div class="operator-stats">
          <span>${activeCharacter.faction === "neutral" ? "世界主线" : "阵营角色"}</span>
          <span>卡牌角色锚点</span>
          <span>${activeCharacter.formNote}</span>
        </div>
      </div>
      <div class="operator-portrait"><img src="${activeCharacter.image}" alt="${activeCharacter.name}" /></div>
    </div>
    <div class="design-sheet-panel">
      <div class="design-sheet-copy">
        <span>ARTBOOK DESIGN BOARD</span>
        <h4>${activeCharacter.name} 角色设定图</h4>
        <p>${activeCharacter.formNote} 白底设定集版面用于服装、武器、变体与卡牌美术沟通。</p>
      </div>
      <img src="${activeCharacter.designSheet}" alt="${activeCharacter.name} 角色设定图" />
    </div>`;
}

timelineTrack.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-year]");
  if (!btn) return;
  activeTimeline = timelineEvents.find((item) => item.year === btn.dataset.year) || activeTimeline;
  activeTimelineImageIndex = 0;
  renderTimeline();
});
timelineDetail.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-gallery-index]");
  if (!btn) return;
  activeTimelineImageIndex = Number(btn.dataset.galleryIndex) || 0;
  renderTimeline();
});
factionTabs.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-faction]");
  if (!btn) return;
  activeFaction = factions.find((item) => item.id === btn.dataset.faction) || activeFaction;
  renderFactions();
});
characterFilters.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-filter]");
  if (!btn) return;
  activeFilter = btn.dataset.filter;
  renderFilters();
  renderCharacters();
});
characterList.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-character]");
  if (!btn) return;
  activeCharacter = characters.find((item) => item.id === btn.dataset.character) || activeCharacter;
  renderCharacters();
});

renderTimeline();
renderFactions();
renderFilters();
renderCharacters();

/* ═══════════════════════════════════════════════════════════
   MODE TOGGLE
═══════════════════════════════════════════════════════════ */
const archiveMain  = document.querySelector("#top");
const devhubMain   = document.querySelector("#devhub-main");
const cardEditorMain = document.querySelector("#card-editor-main");
const modeButtons  = document.querySelectorAll(".mode-btn");
const archiveLinks = document.querySelector(".nav-archive-links");
const devhubLinks  = document.querySelector(".nav-devhub-links");
const cardEditorLinks = document.querySelector(".nav-cardeditor-links");

const DEV_PASSWORD = "20000603";
let devUnlocked = false;
let cardEditorUnlocked = false;
let pendingProtectedMode = null;
let pendingProtectedOptions = {};

function isDevhubHash(hash = window.location.hash) {
  return hash.startsWith("#dev-");
}

function isCardEditorHash(hash = window.location.hash) {
  return hash === "#card-editor";
}

function scrollToCurrentHash() {
  const target = document.querySelector(window.location.hash);
  if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
}

function activateMode(mode, options = {}) {
  const isDevhub = mode === "devhub";
  const isCardEditor = mode === "cardeditor";
  const isArchive = mode === "archive";
  archiveMain.style.display  = isArchive ? "" : "none";
  devhubMain.style.display   = isDevhub ? ""     : "none";
  cardEditorMain.style.display = isCardEditor ? "" : "none";
  archiveLinks.style.display = isArchive ? "" : "none";
  devhubLinks.style.display  = isDevhub ? ""     : "none";
  cardEditorLinks.style.display = isCardEditor ? "" : "none";
  modeButtons.forEach((btn) => btn.classList.toggle("is-active", btn.dataset.mode === mode));
  if (isDevhub) { renderProgressBoard(); renderAssetLibrary(); }
  if (isCardEditor) window.initFormalCardEditor?.();
  if (options.keepHash && window.location.hash) {
    requestAnimationFrame(scrollToCurrentHash);
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function openAccessGate(mode, options = {}) {
  const pageName = mode === "cardeditor" ? "卡牌编辑器" : "开发中心";
  pendingProtectedMode = mode;
  pendingProtectedOptions = options;
  document.querySelector("#accessGateTitle").textContent = `进入${pageName}`;
  document.querySelector("#accessGateDescription").textContent = `${pageName}为受保护页面，请输入密码以继续。`;
  document.querySelector("#accessGateError").textContent = "";
  const passwordInput = document.querySelector("#accessGatePassword");
  passwordInput.value = "";
  document.querySelector("#accessGateOverlay").style.display = "flex";
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => passwordInput.focus());
}

function closeAccessGate() {
  document.querySelector("#accessGateOverlay").style.display = "none";
  document.body.style.overflow = "";
  pendingProtectedMode = null;
  pendingProtectedOptions = {};
}

function switchMode(mode, options = {}) {
  const needsDevPassword = mode === "devhub" && !devUnlocked;
  const needsCardEditorPassword = mode === "cardeditor" && !cardEditorUnlocked;
  if (needsDevPassword || needsCardEditorPassword) {
    openAccessGate(mode, options);
    return;
  }
  activateMode(mode, options);
}

document.querySelector("#accessGateForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const passwordInput = document.querySelector("#accessGatePassword");
  if (passwordInput.value !== DEV_PASSWORD) {
    document.querySelector("#accessGateError").textContent = "密码错误，请重新输入。";
    passwordInput.select();
    return;
  }
  const mode = pendingProtectedMode;
  const options = pendingProtectedOptions;
  if (mode === "devhub") devUnlocked = true;
  if (mode === "cardeditor") cardEditorUnlocked = true;
  closeAccessGate();
  if (mode) activateMode(mode, options);
});

document.querySelector("#accessGateCancel").addEventListener("click", closeAccessGate);
modeButtons.forEach((btn) => btn.addEventListener("click", () => switchMode(btn.dataset.mode)));

window.addEventListener("hashchange", () => {
  if (isDevhubHash() && devhubMain.style.display === "none") {
    switchMode("devhub", { keepHash: true });
  } else if (isCardEditorHash() && cardEditorMain.style.display === "none") {
    switchMode("cardeditor", { keepHash: true });
  }
});

/* ═══════════════════════════════════════════════════════════
   DEV HUB — DESIGN PROGRESS BOARD
═══════════════════════════════════════════════════════════ */
const characterDesignStatus = {
  vera: { artwork:"done", card:"pending" }, xianyue: { artwork:"done", card:"pending" },
  reinhardt: { artwork:"done", card:"pending" }, mira: { artwork:"done", card:"pending" },
  jinbai: { artwork:"done", card:"pending" }, ling: { artwork:"done", card:"pending" },
  noa: { artwork:"done", card:"pending" }, aletheia: { artwork:"done", card:"pending" },
  helios: { artwork:"done", card:"pending" }, sancheres: { artwork:"done", card:"pending" },
  luolan: { artwork:"done", card:"pending" }, nyx: { artwork:"done", card:"pending" },
  drake: { artwork:"done", card:"pending" }, ald: { artwork:"done", card:"pending" },
  evelyn: { artwork:"done", card:"pending" }, saifa: { artwork:"done", card:"pending" },
  grant: { artwork:"done", card:"pending" }, elaine: { artwork:"done", card:"pending" },
  weiyang: { artwork:"done", card:"pending" }, magellan: { artwork:"done", card:"pending" },
};
const statusLabel = { done:"完成", wip:"进行中", pending:"待开始" };
const statusClass = { done:"prog-done", wip:"prog-wip", pending:"prog-pending" };

const milestones = [
  { id:1, title:"核心战斗基础", status:"done",
    desc:"格子棋盘、BFS寻路、双向同步战斗、伤害/死亡系统、双状态机（GamePhase + Interaction）、事件总线、基础AI。",
    steps:["格子棋盘 & Tile高亮","BFS寻路","双向同步战斗结算","伤害系统 & 死亡处理","基础AI（靠近并攻击）","事件驱动视图层"] },
  { id:2, title:"出牌 · 效果 · 触发系统", status:"wip",
    desc:"箭头影响系统、放置交互、效果/触发系统、射击模式（进行中）。",
    steps:[
      { text:"Model & 核心系统基础（箭头/放置/资源）", done:true },
      { text:"完整阶段循环 RoundStart→TimeStop→TimeMove→RoundEnd", done:true },
      { text:"卡槽UI & 放置交互（PVZ风格）", done:true },
      { text:"效果 & 触发系统（OnPlace/OnCast/OnDeath 等）", done:true },
      { text:"射击模式 & 法术阻挡移动", done:false }
    ]},
  { id:3, title:"牌组构建 & 对局流程", status:"pending",
    desc:"牌组构建UI、对局准备（选牌/开局手牌）、抽牌系统、胜负结算界面。",
    steps:["牌组构建UI","对局准备 & Mulligan","抽牌系统","胜负条件完整实现","对局结果界面"] },
  { id:4, title:"高级卡牌效果", status:"pending",
    desc:"状态效果（增益/减益+持续时间）、召唤效果、传送效果、光环效果、探索机制。",
    steps:["StatusChange（增减益+时长）","Summon（从效果召唤单位）","Teleport（单位重定位）","Aura（持续范围被动）","Discover（随机选择）"] },
  { id:5, title:"美术 · 音效 · 平衡", status:"pending",
    desc:"每种效果的视觉特效、音效、卡牌美术、更多卡牌设计、数值平衡调整、教程/新手引导。",
    steps:["特效（EffectResolvedEvent）","音效","卡牌美术","更多卡牌内容","数值平衡","教程 & 新手引导"] },
];
const msStatusLabel = { done:"已完成", wip:"进行中", pending:"未开始" };
const msStatusClass = { done:"chip-done", wip:"chip-wip", pending:"chip-pending" };

function renderMilestoneBoard() {
  const el = document.querySelector("#milestoneBoard");
  if (!el) return;
  el.innerHTML = milestones.map((m) => {
    const stepsHtml = m.steps.map((step) => typeof step === "string"
      ? `<li class="ms-step">${step}</li>`
      : `<li class="ms-step ${step.done ? "ms-step-done" : "ms-step-pending"}">
           <span class="ms-step-check">${step.done ? "✓" : "○"}</span>${step.text}
         </li>`
    ).join("");
    return `
      <div class="milestone-card glass-panel milestone-${m.status}">
        <div class="milestone-header">
          <span class="milestone-num">M${m.id}</span>
          <h4>${m.title}</h4>
          <span class="status-chip ${msStatusClass[m.status]}">${msStatusLabel[m.status]}</span>
        </div>
        <p class="milestone-desc">${m.desc}</p>
        <ul class="ms-steps">${stepsHtml}</ul>
      </div>`;
  }).join("");
}

let progressRendered = false;
function renderProgressBoard() {
  if (progressRendered) return;
  progressRendered = true;
  renderMilestoneBoard();
  const overviewEl = document.querySelector("#progressOverview");
  const boardEl    = document.querySelector("#progressBoard");
  const total      = characters.length;
  const artDone    = characters.filter((c) => characterDesignStatus[c.id]?.artwork === "done").length;
  const cardDone   = characters.filter((c) => characterDesignStatus[c.id]?.card   === "done").length;
  const factionCnt = factions.length;
  overviewEl.innerHTML = `
    <div class="progress-stat glass-panel"><span class="progress-stat-num">${total}</span><span>角色总计</span></div>
    <div class="progress-stat glass-panel"><span class="progress-stat-num" style="color:var(--green)">${artDone}</span><span>设定图完成</span></div>
    <div class="progress-stat glass-panel"><span class="progress-stat-num" style="color:var(--gold)">${factionCnt}</span><span>派系确认</span></div>
    <div class="progress-stat glass-panel"><span class="progress-stat-num" style="color:var(--muted)">${cardDone}</span><span>卡牌设计完成</span></div>`;
  boardEl.innerHTML = characters.map((c) => {
    const status = characterDesignStatus[c.id] || { artwork:"pending", card:"pending" };
    const faction = factionById[c.faction];
    const fName = faction ? faction.name.split(" / ")[0] : "关键中立";
    return `
      <div class="progress-card" style="border-color:color-mix(in srgb, ${c.accent} 35%, transparent)">
        <img src="${c.image}" alt="${c.name}" loading="lazy" />
        <div class="progress-card-info">
          <strong>${c.name}</strong><small>${fName}</small>
          <div class="progress-badges">
            <span class="prog-badge ${statusClass[status.artwork]}">设定图 ${statusLabel[status.artwork]}</span>
            <span class="prog-badge ${statusClass[status.card]}">卡牌 ${statusLabel[status.card]}</span>
          </div>
        </div>
      </div>`;
  }).join("");
}

/* ═══════════════════════════════════════════════════════════
   DEV HUB — CARD CENTER
═══════════════════════════════════════════════════════════ */
const cardFactionMeta = {
  neutral:   { zh:"中立",        en:"Neutral",        accent:"#72e5ff" },
  astra:     { zh:"阿斯特拉帝国", en:"Astra Imperium", accent:"#d24343" },
  machine:   { zh:"械心天庭",    en:"Machine Heaven", accent:"#66a6ff" },
  solar:     { zh:"烈阳教会",    en:"Solar Church",   accent:"#ff8a3d" },
  skyraider: { zh:"猎空同盟",    en:"Skyborne Alliance", accent:"#36f0a4" },
  guild:     { zh:"自由航商会",  en:"Free Guild",     accent:"#ffc766" },
};

const gameCards = [
  // Generated from data/cards.json; do not edit this list by hand.
  {"zh":"星际佣兵","en":"Space Soldier","type":"Minion","rarity":"Common","faction":"neutral","cost":0,"collect":"Collectable","race":"人类","atk":2,"hp":2,"spd":2,"arrows":"","effect":"","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero. A common human space soldier stands alert in a worn industrial starship hangar, wearing practical layered tactical fabric, a high collar, compact matte ceramic armor, gloves, utility straps, and a believable service rifle. The design should feel standardized, dependable, and upgradeable rather than heroic or elite. Medium-close portrait framing with the helmeted head, face, shoulders, weapon, and clean silhouette fully readable inside the upper square of a 5:8 portrait canvas; use the lower area for receding deck plates, soft haze, and restrained environmental detail. Cool slate, navy, and off-white materials with a disciplined cyan equipment accent, cinematic directional light and subtle rim light. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"萌萌机械狗","en":"Mechi-Doggy-Cutie","type":"Minion","rarity":"Epic","faction":"neutral","cost":2,"collect":"Collectable","race":"机械","atk":1,"hp":1,"spd":2,"arrows":"E","effect":"","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero. A single adorable compact mechanical support dog pauses attentively on an industrial starship maintenance deck, with a friendly expressive sensor face, rounded but engineered white-and-slate armor shells, articulated legs, rubberized paw pads, small practical utility modules, and subtle cyan status lights. Its silhouette must remain unmistakably canine and mechanically plausible, charming without becoming a plush toy. Three-quarter portrait view with the head, ears, torso, and front paws dominating the upper square of a 5:8 portrait canvas; the lower area may contain deck reflections and a short trailing cable. Crisp premium anime concept-art design, tactile matte metal and ceramic surfaces, soft haze, cool directional light, one restrained cyan accent. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"太空临时工","en":"Space Temp Worker","type":"Minion","rarity":"Rare","faction":"neutral","cost":0,"collect":"Collectable","race":"人类","atk":2,"hp":1,"spd":2,"arrows":"","effect":"[耐久度: 2]","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition. A young, visibly inexperienced space temp worker stands as the single dominant subject in the upper square region of a battered orbital cargo bay, wearing mismatched rental EVA armor, layered technical fabric, a high collar, scuffed modular plates, loose utility straps, and an overused compact rifle. His anxious but stubborn expression remains clearly readable; cracked seals and hurried field repairs suggest a disposable contract soldier with only a little durability left. Cool slate and off-white industrial materials with restrained cyan indicators and amber hazard light, cinematic rim light, haze, dust, crisp premium anime facial drawing, clean silhouette, hybrid cel-and-painterly rendering. Keep the subject readable after a square crop from the top of the portrait. Artwork only; no text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"星能石","en":"Star Energy Ore","type":"Spell","rarity":"Common","faction":"neutral","cost":0,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"W","effect":"入场：获得1[⭐星能]","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition. In the upper square region, a raw star-energy ore crystal is suspended inside an open industrial extraction cradle as luminous cyan-gold energy filaments awaken within its dark mineral facets and flow outward into modular ship conduits; small fragments orbit and begin aligning, suggesting the first stage of a more powerful upgrade. Treat the spell as an active energy-transfer process rather than a static product display. Matte steel clamps, ceramic insulators, exposed fasteners, restrained cyan and amber light, deep-space workshop atmosphere, volumetric glow, crisp premium anime concept-art shapes, hybrid cel-and-painterly rendering. Keep the decisive crystal and energy flow readable after a square crop from the top of the portrait. Artwork only; no text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"宝藏星能石","en":"Treasure Star Ore","type":"Spell","rarity":"Epic","faction":"neutral","cost":5,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"W","effect":"入场：获得4[⭐星能]。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic spell. Deep inside an abandoned industrial asteroid vault, a colossal treasure-grade star-energy ore geode is being opened by articulated extraction clamps: layered black mineral petals split apart as multiple cyan-gold energy rivers surge from the radiant core into four heavy capacitor towers, illuminating old machinery, drifting fragments, and accumulated dust. Make the active release and collection of extraordinary energy the decisive process, with the geode and converging conduits readable inside the upper square crop; use the lower portrait extension for descending cables, reflective floor plates, and depth. Premium industrial sci-fi anime rendering, ambitious perspective, dense engineered material contrast, cinematic volumetric light, cyan-gold accents against charcoal stone and gunmetal. Artwork only; no text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"普通的子弹","en":"Regular Bullet","type":"Spell","rarity":"Common","faction":"neutral","cost":0,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"E","effect":"入场：选择一个方向，[慢速]对该方向上的第一个目标造成1点伤害。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Common spell. A single ordinary kinetic bullet travels in stark slow motion through a narrow worn starship corridor, leaving a restrained pressure wake and tiny sparks as it follows one clear straight direction toward the first armored training target ahead. Emphasize the projectile's simple, readable flight process rather than a weapon portrait: the bullet, directional wake, and imminent first impact stay inside the upper square crop, with only a few receding deck panels and spent particles below. Premium industrial sci-fi anime rendering, economical staging, matte brass and steel, cool slate corridor light with one warm spark accent, crisp motion silhouette. Artwork only; no text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"胶囊防护罩","en":"Energy Shield","type":"Spell","rarity":"Common","faction":"neutral","cost":0,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"S","effect":"入场：令一个单位获得2护甲。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Common spell. A palm-sized universal shield capsule sold as an everyday Galactic Merchant Guild commodity has just been activated beside a lone suited traveler in a practical orbital market corridor. The compact matte-metal capsule splits along engineered seams and rapidly unfolds into a single translucent cyan protective field that inflates around the user, catching sparks and small debris on its newly formed surface. Make the transformation from compressed product to full defensive barrier the one clean visual idea: the open capsule, expanding field segments, protected silhouette, and first deflected fragments must remain instantly readable inside the upper square crop. Use the lower portrait extension sparingly for the capsule's short energy tether, worn deck plates, and a restrained glimpse of an unbranded merchant display. Premium industrial sci-fi anime rendering, economical staging, tactile metal and clear energy surfaces, cool slate environment with one disciplined cyan accent. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"探机","en":"Scout Probe","type":"Minion","rarity":"Common","faction":"neutral","cost":0,"collect":"Collectable","race":"","atk":0,"hp":1,"spd":1,"arrows":"NE","effect":"本随从的箭头仅在其被放置的回合生效。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Common minion. A single compact neutral scout probe has just been deployed onto a starship deck, its boxy white-and-slate body suspended on three articulated landing struts while short-lived directional maneuvering jets flare around its sensor head for this first moment only. Give it one large cyan optical lens, small antennae, exposed fasteners, rubberized joints, and practical wear; its immediately recognizable drone silhouette and temporary deployment motion dominate the upper square crop. Sparse cargo-bay structure, restrained depth, cool industrial light and a modest cyan accent, premium industrial sci-fi anime rendering with polished but economical detail. Artwork only; no text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"星际司令麦哲伦","en":"Interstellar Commander Magellan","type":"Minion","rarity":"Legendary","faction":"neutral","cost":10,"collect":"Collectable","race":"人类","atk":6,"hp":8,"spd":4,"arrows":"N","effect":"发动：每回合限一次，从弃牌堆召唤两个星际佣兵，放置于其↖️↗️方格子。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Legendary minion. Interstellar Commander Magellan is a tall, powerfully built adult man with swept-back white hair and a stern weathered face, wearing an iconic white fleet-command greatcoat over layered navy technical uniform, matte ceramic shoulder armor, gloves, gold navigation trim, and a long asymmetric command mantle. At the decisive moment aboard his flagship's panoramic command prow, he points one gloved hand toward the enemy formation while two fallen Space Soldiers reconstitute from cyan archive particles at his upper-left and upper-right flanks, answering his order from the discard. Use a dramatic tilted low-angle composition: Magellan's face, pointing gesture, white silhouette, and both returning soldiers dominate the upper square crop; the lower portrait extension reveals his vast neutral merchant-fleet turning beneath him across a star-filled battlefield, with converging ship trails reinforcing his command line. Singular Legendary storytelling, intentional asymmetry, exceptional material finish, premium industrial sci-fi anime rendering, crisp original facial design, white and navy against deep space, disciplined cyan resurrection light and warm gold rim light. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"商人的智慧","en":"Merchant's Wisdom","type":"Spell","rarity":"Epic","faction":"neutral","cost":4,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"E","effect":"入场：抽两张牌。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic spell. In a dim orbital exchange chamber, an experienced interstellar merchant places one gloved hand over a mechanical astrolabe-table and converts a tangled field of trade routes into two clean luminous data-prisms that rise toward the viewer, representing insight drawn from hidden market connections rather than literal cards or interface panels. Make the transformation from chaotic routes to two valuable choices the central process inside the upper square crop; layer distant cargo silhouettes, reflected star maps, ledger-like light strips without readable writing, and disciplined depth below. Premium industrial sci-fi anime rendering, sophisticated charcoal, brass, navy, and cyan palette, dramatic rim light, cinematic haze, rich material contrast and authored environmental storytelling. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"放逐太空","en":"Cast into Space","type":"Spell","rarity":"Epic","faction":"neutral","cost":2,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"W","effect":"入场：移除一张手牌发动，抽一张牌。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic spell. At an open industrial airlock above a star-filled void, a sealed obsolete data-module is forcibly expelled into space while, through the same transaction, a different luminous archive prism is released from a recessed shipboard mechanism into a waiting gloved hand. The exchanged loss-and-draw process must read instantly: the dark discarded module recedes beyond the airlock, the new cyan-white prism advances inward, and a sweeping pressure trail connects both actions inside the upper square crop. Use bold diagonal framing, tumbling bolts and frost, layered machinery, deep vacuum contrast, cold cyan and restrained amber emergency light in premium industrial sci-fi anime rendering. No literal playing cards. Artwork only; no text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"飞船失火！","en":"On Fire!!","type":"Spell","rarity":"Rare","faction":"neutral","cost":5,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"","effect":"[箭头需求: 2]\n此卡被购买时放入对方的弃牌堆。\n回合结束时，若此卡在你的手牌中，将4点伤害随机分配到己方单位上。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare curse spell. A seemingly ordinary freight canister has ruptured inside a cramped starship corridor, releasing a chain of mischievously destructive fires that leap unpredictably through conduits and across several allied workstations while panicked crew silhouettes try to contain them. Show the curse as an escalating process rather than a static explosion: the suspicious canister, branching orange flame paths, failing suppression foam, and the next threatened station remain readable inside the upper square crop. Dynamic but controlled industrial depth, scorched panels, red emergency lamps against cool navy metal, sparks, smoke and cinematic rim light in premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"科学纪元驱魔师","en":"Science-Era Exorcist","type":"Minion","rarity":"Epic","faction":"neutral","cost":6,"collect":"Collectable","race":"","atk":2,"hp":4,"spd":2,"arrows":"N","effect":"每个回合限两次，时停阶段中，当对方发动法术的效果时，将其无效。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic minion. A single Science-Era Exorcist stands inside a time-frozen laboratory as the dominant subject, wearing layered black-and-off-white technical robes over modular ceramic armor, a high collar, sensor talismans built from circuit wafers, and a compact null-field staff. With a precise two-handed gesture, they cancel a hostile spell phenomenon: luminous hostile geometry fractures into inert particles before it can reach them, while suspended sparks and debris emphasize the stopped moment. Keep the face, staff, gesture, and collapsing anomaly readable inside the upper square crop; use the lower extension for cables, frozen reflections, and occult-looking machinery explained through science. Premium industrial sci-fi anime rendering, dramatic asymmetrical light, cyan-white null field against restrained violet hostile energy, exceptional material density without clutter. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"天元防壁","en":"Tianyuan Bulwark","type":"Spell","rarity":"Epic","faction":"neutral","cost":6,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"S","effect":"每回合限三次，当敌方随从攻击时，无效其攻击。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic spell. Across an exposed orbital platform, a vast Tianyuan defense lattice unfolds from a central anchor into concentric translucent planes, stopping three different incoming attacks at separate distances: a projectile, an energy beam, and a charging armored silhouette are each frozen against precise geometric barriers before impact. Make the repeated negation process and layered depth unmistakable inside the upper square crop, with the central anchor and three arrested threats forming an intentional asymmetric arc. Premium industrial sci-fi anime rendering, monumental engineered geometry, matte white and gunmetal emitters, disciplined cyan-white fields, amber impact sparks, volumetric haze and dramatic perspective. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"刺客-J","en":"Delayed Coordinate Cannon","type":"Minion","rarity":"Epic","faction":"neutral","cost":5,"collect":"Collectable","race":"","atk":3,"hp":2,"spd":3,"arrows":"","effect":"入场：选定一个非英雄单位，[慢速]将其消灭。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic minion. Assassin J, a lean adult killer in dark mirrored sunglasses, stands as the single dominant subject on a rain-slick industrial station roof, wearing a long asymmetric charcoal tactical coat, fitted technical armor, gloves, harnesses, and a compact suppressed sidearm. He has already placed a small cyan coordinate beacon on a distant armored target; a delayed vertical targeting line is beginning to converge around that figure while J turns away with cold certainty. Keep J's face, sunglasses, weapon, beacon gesture, and the doomed target relationship readable inside the upper square crop; use bold perspective, rain, receding gantries and restrained red warning light for layered environmental storytelling. Premium industrial sci-fi anime rendering with crisp facial design, tactile matte materials and cinematic finish. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"预判投弹","en":"Predictive Bombing","type":"Spell","rarity":"Rare","faction":"neutral","cost":4,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"NE","effect":"入场：选定一个格子，[慢速]若该格子上有随从，对其造成4点伤害；若该格子上有法术，将其摧毁。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare spell. A compact orbital bomber predicts the next occupied position on an industrial battlefield: one empty floor sector is illuminated by converging sensor rays just as an enemy silhouette begins moving toward it, while a single smart bomb descends on a delayed trajectory from above. Show prediction, movement, and imminent impact as one readable process without interface graphics; keep the marked sector, approaching target, and bomb inside the upper square crop. Strong diagonal motion, practical deck geometry, modest foreground and background depth, cool slate and navy metal with restrained amber targeting light and cyan sensors, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"幼崽噗噜兽","en":"Puru Beast Cub","type":"Minion","rarity":"Rare","faction":"neutral","cost":1,"collect":"Collectable","race":"奇兽","atk":1,"hp":3,"spd":3,"arrows":"","effect":"","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare minion. A single juvenile Puru Beast bounds curiously through an orbital cargo corridor as surprised maintenance drones scatter between stacked freight crates. The cub has a rounded seafoam-and-cream body, four short sturdy legs, glossy dark eyes with cyan star-shaped catchlights, cyan bioluminescent cheek freckles, small incisors, coral-lined sensory ear-fins, and a row of pearlescent dorsal magnetic nodules. Keep its complete face, compact silhouette, eager forward motion, and juvenile proportions readable inside the upper square crop; use the lower portrait extension for tiny paws, deck reflections, and one displaced cargo case. Premium industrial sci-fi anime rendering, soft tactile fur, polished but economical Rare-card detail, cool navy hangar light with warm rim light and restrained cyan accents. It is a friendly curious cub, not the future adult charging form. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"星能矿机","en":"Star-Energy Mining Rig","type":"Minion","rarity":"Rare","faction":"neutral","cost":3,"collect":"Collectable","race":"机械","atk":0,"hp":3,"spd":2,"arrows":"","effect":"回合结束时，你获得1星能。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare mechanical minion. A single self-propelled star-energy mining rig works inside a rough asteroid tunnel, its low armored crawler body braced on articulated treads while a rotary extraction head cuts into a cyan-veined rock face and channels newly harvested light into a growing rear capacitor. Make the machine's silhouette, drilling action, and steady energy production readable inside the upper square crop; secondary ore fragments, support struts and a small maintenance drone provide scale and modest depth. Premium industrial sci-fi anime rendering, matte gunmetal and off-white machinery, exposed hoses, scuffed ceramic plates, disciplined cyan energy, amber work lamps, dust and cinematic haze. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"矿石扫描","en":"Ore Scan","type":"Spell","rarity":"Rare","faction":"neutral","cost":1,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"NW","effect":"入场：在你的领土内随机生成2个遗失的智慧。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare spell. From the mouth of an asteroid survey tunnel, a portable ore scanner sends concentric cyan resonance waves through dark stone; the waves reveal two separate buried crystalline data-echoes shaped like luminous memory knots among ordinary star-energy veins. Emphasize discovery as a clear process: scanner emitter, penetrating wavefronts, and both hidden finds remain readable inside the upper square crop, with cables, drilling marks and a surveyer's gloved hand providing scale without becoming the subject. Premium industrial sci-fi anime rendering, cool mineral blacks and gunmetal, cyan-white subsurface glow, restrained amber equipment lights, atmospheric dust and modest layered depth. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"鲁莽的先锋","en":"Reckless Pioneer","type":"Minion","rarity":"Rare","faction":"neutral","cost":5,"collect":"Collectable","race":"人类","atk":5,"hp":2,"spd":5,"arrows":"NE","effect":"发动：每回合限一次，自身获得3点护甲。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare minion. A single reckless human pioneer charges headlong across a damaged orbital causeway before his defensive system has fully initialized, wearing scuffed off-white modular armor, a high-collared navy pressure suit, utility harness and compact rifle. A partially formed cyan shield clings unevenly to his leading shoulder while the projector on his back is still spinning up; sparks, loose straps and a determined expression sell both danger and momentum. Keep the face, rushing silhouette, weapon and incomplete armor field readable inside the upper square crop, with receding deck plates and distant fire for modest depth. Premium industrial sci-fi anime rendering, strong forward perspective, tactile wear, cool slate with cyan and restrained orange accents, cinematic rim light and haze. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"货运噗噜兽","en":"Cargo Puru Beast","type":"Minion","rarity":"Rare","faction":"neutral","cost":3,"collect":"Collectable","race":"奇兽","atk":1,"hp":5,"spd":1,"arrows":"","effect":"你的商店拥有一个额外的格子。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare minion. A mature adult Cargo Puru Beast stands as the single dominant subject in an orbital freight depot, immediately recognizable as the same species as the approved FNG-017 Puru but substantially larger, heavier, and more mature: a long barrel-shaped seafoam-and-cream body, broad chest and shoulders, thick neck and four sturdy load-bearing legs, a slightly longer and wider blunt muzzle with small incisors, calm glossy dark eyes with cyan star-shaped catchlights at a smaller eye-to-head ratio, tall coral-lined sensory ear-fins, six enlarged pearlescent dorsal magnetic nodules, and cyan bioluminescent cheek freckles. A large modular cargo rack locks directly to the dorsal nodules and carries several industrial containers comfortably, demonstrating seasoned strength rather than strain. Use a low three-quarter camera angle to emphasize adult scale and quiet dignity; keep the complete head, shoulders, dorsal markers, and cargo mechanism readable in the upper square crop, with small dock workers, utility drones, and stacked freight as scale cues. Premium industrial sci-fi anime rendering, appealing but not baby-like, tactile fur, engineered matte cargo hardware, cool navy and gunmetal depot, disciplined cyan lights, warm loading-bay rim light and cinematic haze. Artwork only; no text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"疯狂的传送师-贾格","en":"Jagg, Mad Teleporter","type":"Minion","rarity":"Epic","faction":"neutral","cost":6,"collect":"Collectable","race":"","atk":4,"hp":5,"spd":2,"arrows":"SW","effect":"发动：传送到场上任意一个空格子上。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic minion. Jagg, a brilliant but visibly unhinged adult teleportation engineer, appears as the single dominant subject in an industrial transit chamber, wearing a patched long technical coat, mismatched ceramic armor, wild swept-back hair, protective goggles, and a belt crowded with homemade phase coils. He steps out of one angular spatial aperture while the last fragments of his previous position still collapse behind him, grinning as he chooses an impossible new destination; his body remains anatomically coherent, with duplication limited to controlled phase afterimages. Keep Jagg's face, eccentric silhouette, leading step, and both connected apertures readable inside the upper square crop. Premium industrial sci-fi anime rendering, ambitious warped perspective, layered gantries and cables, cyan-white portals with restrained magenta phase fringes, dramatic rim light, sparks and cinematic haze. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"中微子爆弹","en":"Neutrino Bomb","type":"Spell","rarity":"Epic","faction":"neutral","cost":10,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"NE,E","effect":"发动：对一个单位造成12点伤害。[耐久度: 1]","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic spell. A terrifying single-use neutrino siege weapon fires one impossibly concentrated white-cyan lance into a single colossal armored target at an orbital dock. At the same decisive instant, the target's interior structure is erased along the beam path while the weapon's own containment rings overload, crack apart, and implode behind the shot, making its self-destruction inseparable from the devastating attack. Use an oppressive low, tilted perspective and a bold diagonal line connecting the rupturing emitter, the needle-thin neutrino beam, and one catastrophic impact cavity; keep all three readable inside the upper square crop. Layer vaporized armor, inward-pulled debris, collapsing machinery, harsh scale contrast, and the lower extension of a ruined firing platform to create Epic depth and material density without turning the attack into a broad explosion. Cold white-cyan annihilation light against charcoal metal and restrained furnace orange, cinematic haze, exceptional engineered detail, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"轨道晶灵","en":"Orbital Crystal Spirit","type":"Minion","rarity":"Rare","faction":"neutral","cost":4,"collect":"Collectable","race":"晶灵","atk":4,"hp":4,"spd":3,"arrows":"","effect":"[攻击范围: 3]","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare minion. A single conscious Orbital Crystal Spirit drifts along a busy navigation orbit outside an industrial station, its true mind visible as self-organizing photon light stabilized inside an irregular translucent core. Four to six separate crystal masses travel on inclined atom-like orbital paths around it, joined only by thin resonance trails; it has no face, limbs, or humanoid anatomy. The peaceful intelligence has turned alert and emits one precise long-range ray from its luminous consciousness core toward a small hostile drone in the distance, while nearby cargo craft veer aside. Keep the core, orbiting crystal silhouette, poised orbital motion, ray origin, and distant target readable inside the upper square crop; use the lower portrait extension for curving traffic trails, station structure, and scale. Give the crystals nonuniform shapes and iridescent cyan, violet, and warm-gold refractions, with responsive light conveying awareness. Specific orbital setting, meaningful secondary traffic motifs, modest foreground-to-background depth, crisp premium industrial sci-fi anime rendering, tactile mineral facets and cinematic rim light. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"日炎枪手","en":"Sunflare Gunner","type":"Minion","rarity":"Rare","faction":"neutral","cost":3,"collect":"Collectable","race":"人类","atk":1,"hp":3,"spd":2,"arrows":"","effect":"发动：选定一个方向，对该方向首个敌方单位造成3点伤害。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare minion. A single human Sunflare Gunner braces on an exposed starship gun deck and fires a compact solar-lance rifle down one clear direction, the focused amber-white beam striking the first enemy silhouette along its path. The gunner wears heat-resistant off-white ceramic armor over a navy pressure suit, a gold-tinted visor, radiator fins, gloves and practical harnesses; the face, firing pose, weapon silhouette, beam and first impact remain readable inside the upper square crop. Use modest depth from receding railings, solar glare and drifting sparks without crowding the subject. Premium industrial sci-fi anime rendering, crisp purposeful silhouette, tactile engineered materials, warm solar amber against cool slate and disciplined cyan indicators, cinematic rim light and haze. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"谕晶","en":"Oracle Crystal Spirit","type":"Minion","rarity":"Epic","faction":"neutral","cost":8,"collect":"Collectable","race":"","atk":2,"hp":8,"spd":2,"arrows":"N","effect":"发动：从牌堆发现一张牌，将其放置于其⬆️方格子。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition. A high-order Oracle Crystal Spirit floats inside the immense living crystalline cavern of the crystal mother planet: a warm opalescent amber-and-rose tetrahedral consciousness core containing a softly swirling photon mind, surrounded by seven slender blade-like and plate-like crystals moving on interlocking inclined orbits. Their temporary alignment forms an abstract probability lens through which several faint possible scenes refract and one clear possibility resolves above the core, expressing its ability to discover and reveal an answer without literal cards or UI. Use an ambitious layered Epic composition, exceptional mineral detail, champagne-gold and pale-rose light, and vast crystalline strata pulsing like a planetary neural network; preserve the oracle and its decisive orbital alignment inside the upper square crop. Artwork only; no text, runes, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"星航恶兆-巨鳐","en":"Starfaring Omen - Great Ray","type":"Minion","rarity":"Legendary","faction":"neutral","cost":10,"collect":"Collectable","race":"星云体","atk":4,"hp":10,"spd":1,"arrows":"W,E","effect":"[传送移动]该单位瞬移至任意敌方单位相邻的格子上。该单位移动后，对其3x3范围内的所有敌方目标造成4点伤害。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Legendary minion. The Starfaring Omen — Great Ray is a colossal Nebula Manifestation and deep-space living megastructure, an executor of cosmic order whose anatomy evokes a manta ray through one unmistakable broad central body, two immense swept wings, a tapered trailing wake, and a compact cyan-white will-core. It has no animal face, eyes, mouth, skin, or ordinary organs. Unlike a faint transparent veil, its nebular body must be visually dense and substantial: layered indigo-violet star clouds, dark matter-like interior masses, embedded constellations, bright structural currents, and a crisp continuous outer contour separated from the background by strong backlight and gravitational rim distortion. Depict it from an extreme dramatic perspective near tiny ships or a station so its impossible scale is immediately legible. It folds space beside a hostile fleet and releases circular gravitational order-waves; use violent foreshortening, intentional asymmetry, deep foreground-to-background scale, and a singular mysterious Legendary story moment. Keep the will-core, clear manta silhouette, and decisive spatial action readable inside the upper square crop. Premium industrial sci-fi anime cosmic rendering, exceptional finish, deep charcoal and indigo body, disciplined cyan-white structure light, restrained violet-gold stellar dust, cinematic bloom and profound deep-space atmosphere. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"「金扳手」工程师","en":"Gold Wrench Engineer","type":"Minion","rarity":"Rare","faction":"neutral","cost":4,"collect":"Collectable","race":"人类","atk":3,"hp":4,"spd":2,"arrows":"","effect":"入场：令一个机械获得+2ATK/+2SPD。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare minion. The “Gold Wrench” Engineer is a very short, broad adult human man with an enormous braided copper-brown beard, lively eyes behind scratched magnifier goggles, and the restless confidence of someone obsessed with mechanical modification. He stands on a crowded Galactic Merchant Guild repair gantry as the single dominant subject, bracing an oversized gold-alloy powered wrench against the exposed shoulder joint of a neutral combat machine. With one decisive twist, new actuator plates lock into place and the machine’s weapon and leg thrusters flare brighter, visually communicating an immediate attack-and-speed upgrade. His practical industrial outfit combines a grease-stained off-white work coat, compact ceramic apron armor, rolled technical sleeves, magnetic tool belts, heavy gloves, and a small articulated backpack crane. Keep his expressive face, massive beard, gold wrench, hands, and the upgraded mechanical joint readable inside the upper square crop; use the lower portrait extension for his short sturdy stance, scattered tools, cables, and worn deck reflections. Specific workshop setting, meaningful modification details, richer brass, steel, fabric and ceramic contrast, modest depth, warm amber work light against restrained cyan indicators, premium industrial sci-fi anime rendering. Avoid a fantasy dwarf costume or medieval workshop. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"泰坦X-003综合型","en":"Titan X-003 All-Rounder","type":"Minion","rarity":"Rare","faction":"neutral","cost":7,"collect":"Collectable","race":"机械","atk":7,"hp":7,"spd":5,"arrows":"","effect":"","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare minion. A single Titan X-003 All-Rounder stands ready on a neutral orbital proving ground, a large balanced bipedal combat machine designed around a recognizable angular head with one horizontal cyan sensor band, broad squared shoulders, a compact armored torso, powerful reverse-jointed legs, and two circular auxiliary thrusters mounted high on its back. Its modular right forearm carries a medium particle cannon while the left arm unfolds a compact hard-light shield; neither system dominates, emphasizing the chassis’s equal attack, protection, and mobility. Use a confident three-quarter low angle with the head, full torso, cannon, shield, and clean machine silhouette secured inside the upper square crop; the lower portrait extension shows planted mechanical feet, service rails, modest dust, and distant test structures. Rare-level specificity, meaningful weapon-and-shield motifs, crisp engineered joints, matte gunmetal and off-white ceramic armor, restrained cyan sensors with a small amber identification accent, cinematic rim light and premium industrial sci-fi anime rendering. Keep it clearly related to the faster Titan X-003 Assault Type through the shared head, torso core, shoulder geometry, and back-thruster layout. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"泰坦X-003强袭型","en":"Titan X-003 Assault Type","type":"Minion","rarity":"Epic","faction":"neutral","cost":8,"collect":"Collectable","race":"机械","atk":8,"hp":4,"spd":7,"arrows":"","effect":"","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic minion. The Titan X-003 Assault Type is the stripped-down high-speed derivative of the All-Rounder: retain the same angular head with a horizontal cyan sensor band, compact torso core, squared shoulder roots, reverse-jointed legs, and twin circular back-thruster layout, but remove heavy outer armor, lengthen the limbs, enlarge the thruster vanes, and expose reinforced black actuators for brutal acceleration. At the decisive moment it launches down an industrial carrier catapult in a forward-leaning sprint, one forearm converted into a long orange-edged pile-blade and the other carrying a compact close-range cannon, while discarded heat shields and sparks tumble behind it. Use an aggressive near-ground perspective and sweeping diagonal motion; keep the head, shared chassis identity, leading pile-blade, shoulders, and explosive forward gesture readable inside the upper square crop. The lower portrait extension carries elongated digitigrade legs, catapult rails, exhaust distortion, flying panels, and pursuers left behind. Epic motion and depth, dense mechanical detail without clutter, black and dark gunmetal structure with reduced off-white armor, disciplined cyan sensors and hot orange assault accents, cinematic streak light and premium industrial sci-fi anime rendering. It should look faster and more lethal but visibly less protected than the All-Rounder. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"造物之森疗愈师","en":"Creation Grove Healer","type":"Minion","rarity":"Rare","faction":"neutral","cost":4,"collect":"Collectable","race":"兽裔(Avatar)","atk":1,"hp":5,"spd":3,"arrows":"","effect":"发动：令一个距离4以内的友方非机械随从回复5点生命值。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare minion. A petite young adult doe Avatar healer stands as the single dominant subject in the upper square of a busy Galactic Merchant Guild market, visibly nervous yet gathering the courage to help. She has a complete anthropomorphic deer form rather than a human face with animal ears: a gentle nonhuman doe muzzle and nose, large alert ears, expressive amber anime-furry eyes, a coherent short fawn-and-cream coat with pale facial markings, small cloven hand tips, digitigrade hooved legs, and a short deer tail. Her styled dark-teal head fur and practical layered healer coat give her an individual furry-subculture silhouette; the coat uses moss-green technical fabric, off-white panels, small medicine pouches, and anatomy-tailored seams. She grips a polished wooden staff interwoven with restrained cyan-gold bio-luminous conduits, channeling a warm green healing field toward a wounded non-mechanical companion kept only as a soft partial silhouette at the edge of the scene. Keep her face, anxious expression, hands, staff head, and the healing interaction immediately readable after the top square crop; use the lower portrait extension for her tailored coat, hooved stance, market cables, stacked alien produce, and worn deck reflections. Add meaningful market detail, modest foreground-to-background depth, tactile wood, fabric and matte machinery, cinematic directional light, and a calm hopeful atmosphere in premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"震荡晶核","en":"Resonant Crystal Core","type":"Minion","rarity":"Rare","faction":"neutral","cost":7,"collect":"Collectable","race":"晶灵","atk":5,"hp":5,"spd":5,"arrows":"","effect":"[攻击范围: 4] 该单位攻击时，会先减少目标5点护甲。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare minion. A single Resonant Crystal Core floats as the dominant subject above a scarred industrial battlefield: a dense consciousness-bearing core of self-organizing amber-white photon light is stabilized inside a dark asymmetrical crystal body, while five separate blade-like crystals move along inclined atom-like orbits around it, connected only by pulsing resonance trails. It has no face, limbs, or humanoid anatomy. Before delivering its attack, the Crystal Spirit releases a focused sequence of concentric violet-cyan shock fronts toward a distant armored target; the waves visibly loosen, shear, and peel heavy armor plates away before a narrow core-ray follows through the exposed center. Keep the conscious core, full orbital silhouette, first shock rings, stripped armor plates, and ray line readable inside the upper square crop; use the lower portrait extension for fractured plating, dust suspended by resonance, and modest battlefield depth. Convey intelligence through precisely phased orbital motion and responsive light rather than aggression or facial features. Rare-level specificity, tactile obsidian and iridescent mineral surfaces, restrained violet, cyan and amber refraction, hard cinematic rim light and premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"黑市护甲贩","en":"Black Market Armor Dealer","type":"Minion","rarity":"Rare","faction":"neutral","cost":6,"collect":"Collectable","race":"反抗军","atk":5,"hp":5,"spd":4,"arrows":"","effect":"一回合一次，丢弃一张手牌以发动：令一个友方随从获得等同于丢弃牌星能费用的护甲。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare minion. A weathered adult human black-market armor dealer affiliated with the resistance is the single dominant subject in a concealed cargo-bay bazaar, sharp-eyed and self-assured beneath an asymmetric hood, with one side of the head closely shaved and the other covered by dark braided hair. She wears a practical patchwork exosuit assembled from salvaged ceramic plates, technical fabric, old rebel webbing, and mismatched power couplings. At the decisive moment she accepts a valuable sealed energy cell from an unseen customer with one hand while using the other to clamp a proportionate stack of scavenged armor plates onto a waiting allied fighter, visually turning the discarded resource into protection. Keep her face, exchange hand, armor clamp, and the receiving ally’s newly layered shoulder protection readable inside the upper square crop; use the lower portrait extension for hanging armor racks, contraband crates, cables, and a dim maintenance pit. Specific clandestine-market detail, richer worn material contrast, modest foreground and background depth, smoky navy shadows with restrained red resistance markings and amber work lamps, premium industrial sci-fi anime rendering. No readable price tags or signs. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"轨道轰炸","en":"Orbital Bombardment","type":"Spell","rarity":"Epic","faction":"neutral","cost":8,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"NE","effect":"入场：选择战场上的一行，[慢速]对该行上的单位造成7点伤害。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic spell. From a low viewpoint along an exposed industrial battlefield, a distant orbital bombardment vessel releases a slow, inexorable sequence of kinetic light-lances that descend from the upper atmosphere and strike every position along one continuous line. Show the spell as a devastating row-wide process rather than a single explosion: the looming ship silhouette, descending parallel trajectories, chained impacts advancing across the same horizontal corridor, and units caught in the line must read clearly inside the upper square crop. Use dramatic foreshortening so the nearest impact tears through deck plating while successive impacts recede toward the horizon; the lower portrait extension carries cracked rails, shock waves, smoke, and glowing debris. Epic environmental storytelling, strong depth and motion, dense industrial material contrast, charcoal and navy terrain cut by white-hot amber bombardment light, cinematic haze and premium industrial sci-fi anime rendering. Do not depict a literal board-game grid. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"精英豹人战士","en":"Elite Pantherkin Warrior","type":"Minion","rarity":"Rare","faction":"neutral","cost":8,"collect":"Collectable","race":"兽裔(Avatar)","atk":8,"hp":3,"spd":8,"arrows":"","effect":"","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare minion. A young adult male panther Avatar bounty warrior is the single dominant subject, lean and athletic with slim defined muscle, caught in a brutally fast finishing dash through a dim industrial market service alley. He has a complete anthropomorphic black-panther furry form rather than a human face with animal ears: clearly feline cranial structure and short muzzle, black nose, swept ears, full midnight-black fur with subtle rosette patterning, fierce amber anime-furry eyes, clawed hands, digitigrade feline feet, and a long balancing tail. His anatomy-tailored bounty-hunter gear combines a cropped asymmetric charcoal tactical coat, fitted technical fabric, light ceramic guards, claw-friendly gloves, tail clearance, compact target scanner, and two short practical energy-edged blades. Show ruthless speed and precision through a low three-quarter angle, stretched feline posture, whipping coat and tail, and a defeated bounty target falling out of focus behind him; keep his face, full feline silhouette, leading blade, and decisive movement readable inside the upper square crop. Richer material contrast, meaningful pursuit details, modest alley depth, restrained amber and cyan indicators, hard rim light and premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"「百事通」蒂芙尼","en":"Know-It-All Tiffany","type":"Minion","rarity":"Epic","faction":"neutral","cost":5,"collect":"Collectable","race":"","atk":2,"hp":4,"spd":4,"arrows":"NW,NE","effect":"","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic minion. “Know-It-All” Tiffany is a petite, energetic young adult pink rabbit Avatar and the unmistakable central subject, joyfully leaping between suspended walkways in the bustling Galactic Merchant Guild. She has a complete anthropomorphic furry rabbit form rather than a human face with animal ears: a clearly nonhuman rabbit cranial silhouette and small muzzle, soft pink nose, enormous expressive ears, bright teal anime-furry eyes, coherent full-body rose-pink fur with cream markings, paw-like hands and feet, powerful digitigrade legs, and a round tail. Her bold subcultural streetwear includes a practical midriff-baring cropped courier jacket and athletic top, high-waisted utility shorts, colorful straps, small information canisters, anatomy-tailored footwear, and a compact messenger pouch. She twists lightly through the air while tossing a useful data prism toward a bewildered newcomer; merchants of several species wave to her from layered stalls and bridges, showing that she knows everyone without stealing focus. Use an ambitious diagonal upward composition with her face, ears, airborne gesture, data prism, and readable rabbit silhouette secured inside the upper square crop; use the lower portrait extension for receding bridges, market lights, banners without writing, and friends below. Epic motion, airy depth, joyful personality, lively cyan-magenta accents against warm industrial metal, cinematic sunlight shafts and premium industrial sci-fi anime rendering. Keep the presentation playful and fashionable rather than sexualized. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"迷离的空亡体","en":"Lost Hollow Null","type":"Minion","rarity":"Common","faction":"neutral","cost":0,"collect":"Uncollectable","race":"空亡体","atk":2,"hp":2,"spd":2,"arrows":"","effect":"击杀奖励：2[⭐星能]。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Common uncollectable minion. A Lost Hollow-Null crawls through a ruined industrial corridor as if pursuing the last pocket of intact order. A small perfectly lightless causal void in its torso temporarily organizes a few mutually incompatible remnants: torn bone-white biological structure, ceramic shell, translucent membrane, one pale almost-human forelimb, and one corroded mechanical arm. The same reaching hand appears at two slightly misaligned temporal positions while the intermediate motion is absent; nearby floor seams and reflections break before reconnecting around it. Use a low frontal angle so the causal void, crawling action, mismatched fragments, and one clear frame-skipping contradiction remain readable inside the upper square crop. Restrained Common-card staging, wet metal, cold corridor light, premium industrial sci-fi anime rendering. This is common local causal debris, not a juvenile, natural animal, or stable species anatomy. The void must read as missing reality, not black skin, smoke, or a glowing portal. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"飞翔型空亡体","en":"Flying Hollow-Null","type":"Minion","rarity":"Rare","faction":"neutral","cost":4,"collect":"Uncollectable","race":"空亡体","atk":4,"hp":4,"spd":4,"arrows":"","effect":"击杀奖励：4星能；2充能。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare uncollectable minion. A Flying Hollow-Null crosses a tall rift-damaged cargo shaft without wings: one causal anomaly simultaneously occupies three incompatible aerial trajectories, then appears at a single overhead destination while every intermediate position is missing. A perfectly lightless causal void organizes sparse biological, ceramic, cable, and machinery fragments whose front and rear relationships continually swap; detached limb sections and cargo shards align differently along each impossible path without becoming three cloned creatures. Use a steep upward perspective with the causal void, the three contradictory trajectory traces, and the final arrival silhouette readable inside the upper square crop; below, severed gantries, hanging freight, and broken light strips provide precise spatial references for the skipped motion. Specific Rare-card environmental depth, charcoal industrial materials with cold cyan-white edge light, premium industrial sci-fi anime rendering. It has no functional wings and is a parallel Time-Death expression, not an evolved form. The void must read as missing reality, not black skin, smoke, or a glowing portal. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"遗失的智慧","en":"Lost Wisdom","type":"Spell","rarity":"Common","faction":"neutral","cost":0,"collect":"Uncollectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"","effect":"拾取：获得 1 点星能。","desc":"","aiText":"拾取：获得 1 点星能。"},
  {"zh":"日光碎片","en":"","type":"Spell","rarity":"Common","faction":"neutral","cost":0,"collect":"Uncollectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"","effect":"拾取：获得 1 点充能。","desc":"","aiText":"拾取：获得 1 点充能。"},
  {"zh":"美味的野果","en":"","type":"Spell","rarity":"Common","faction":"neutral","cost":0,"collect":"Uncollectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"","effect":"拾取：该怪物回复 2 点生命，并立即获得 2 步额外移动。","desc":"","aiText":"拾取：该怪物回复 2 点生命，并立即获得 2 步额外移动。"},
  {"zh":"癫癫果实","en":"","type":"Spell","rarity":"Common","faction":"neutral","cost":0,"collect":"Uncollectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"","effect":"拾取：该怪物获得 +1 攻击 / +1 速度，但受到 1 点伤害。","desc":"","aiText":"拾取：该怪物获得 +1 攻击 / +1 速度，但受到 1 点伤害。"},
  {"zh":"护甲碎片","en":"","type":"Spell","rarity":"Common","faction":"neutral","cost":0,"collect":"Uncollectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"","effect":"[拾取] 获得 1 点护甲。","desc":"","aiText":"拾取：获得 1 点护甲。"},
  {"zh":"咆哮型空亡体","en":"Roaring Hollow-Null","type":"Minion","rarity":"Epic","faction":"neutral","cost":7,"collect":"Uncollectable","race":"空亡体","atk":7,"hp":4,"spd":6,"arrows":"","effect":"击杀奖励：获得 8 点星能。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic uncollectable minion. A Roaring Hollow-Null advances through a frontier machine hall while its causal-disorder front has already passed the viewer, arriving before any sound. A perfectly lightless causal void organizes an unstable silhouette from incompatible support beams, eroding armor, cable bundles, and biological remnants; it has no mouth or matching vocal organ. In the foreground, fasteners lift out of intact plates, rails rust decades in an instant, machinery separates in the wrong assembly order, and startled workers react to consequences that precede the distant source; only behind this wave does a delayed pressure echo bend dust and hanging chains. Use an ambitious tilted perspective with the causal void and source silhouette in the upper square crop while the lower portrait layers the prematurely disordered environment and backward sequence of effects. Epic industrial sci-fi anime rendering, charcoal steel, dirty white fracture edges, restrained amber corrosion and cold rift rim light, dense but legible causal storytelling. This is a parallel Time-Death expression, not a stronger evolutionary stage. The void must read as missing reality, not black skin, smoke, or a glowing portal. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"空亡时主","en":"Hollow Time Lord","type":"Minion","rarity":"Legendary","faction":"neutral","cost":10,"collect":"Uncollectable","race":"空亡体","atk":10,"hp":4,"spd":12,"arrows":"","effect":"击杀奖励：获得一个额外的时动阶段；本局游戏的剩余时间内，你时停阶段的行动计数 -2。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Legendary uncollectable minion. One major Time-Death catastrophe converges around its singular Hollow Time Lord, the causal core and stabilizing attractor suspended above a vast chrono-industrial metropolis. Its city-scale torso is a perfectly lightless causal void surrounded by mutually incompatible clockwork-cathedral ruins, monumental rings, corroded machinery, incomplete arms, skeletal hands, and five crownlike spires drawn from different moments of the collapsing city. It is not an evolved monster or conventional ruler: broken streets, temporal fractures, Lost, Flying, and Roaring expressions, citizens, and architectural fragments all reveal their paths bending toward the same organizing absence while simultaneously growing and eroding. Use an extreme low-angle composition with the causal void, crown silhouette, and one descending hand dominating the upper square crop; extend the lower portrait through tiny streets and suspended figures that establish impossible scale. Split the atmosphere between a cold blue time-storm and a dying muted-gold horizon, with exceptional architectural detail and premium industrial sci-fi anime rendering. Threat comes from catastrophe-wide instability, not armor or biological strength. The void must read as missing reality, not black skin, smoke, or a glowing portal. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"遗失的智慧","en":"Lost Wisdom","type":"Spell","rarity":"Common","faction":"neutral","cost":0,"collect":"Uncollectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"","effect":"[拾取] 获得1点星能。","desc":"","aiText":"拾取：获得 1 点星能。"},
  {"zh":"太阳裂片","en":"","type":"Spell","rarity":"Common","faction":"neutral","cost":0,"collect":"Uncollectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"","effect":"[拾取] 获得1点充能。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for Time-Block Hero. Neutral galactic civilization, practical starship technology, charcoal steel, cool slate, restrained cyan equipment light, and a clear gameplay-driven subject or action. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"能量膜","en":"","type":"Spell","rarity":"Common","faction":"neutral","cost":0,"collect":"Uncollectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"","effect":"[拾取] 获得1点护甲。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for Time-Block Hero. Neutral galactic civilization, practical starship technology, charcoal steel, cool slate, restrained cyan equipment light, and a clear gameplay-driven subject or action. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"美味的野果","en":"","type":"Spell","rarity":"Common","faction":"neutral","cost":0,"collect":"Uncollectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"","effect":"[拾取] 拾取的单位恢复2点生命，本回合内获得额外2点移动力。","desc":"","aiText":"拾取：该怪物回复 2 点生命，并立即获得 2 步额外移动。"},
  {"zh":"洛岚","en":"Luolan","type":"Minion","rarity":"Legendary","faction":"skyraider","cost":"hero","collect":"InitHero","race":"反抗军","atk":2,"hp":20,"spd":2,"arrows":"NE","effect":"发动：每回合限一次，将你的一个反抗军移动一格。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Legendary hero. Luolan, the red-haired frontline commander of the Skyborne Alliance, stands on the rebuilt command bridge of a mobile frontier fleet-city during an Imperial pursuit, wearing a deep forest-green industrial command coat over modular charcoal armor, dark oxblood-red resistance insignia, and an illegal green chrono-cybernetic eye. At the decisive moment she drives one gloved hand across a scarred mechanical navigation table, redirecting a nearby resistance squad through a newly opened breach while the fleet pivots around her order. Use a bold three-quarter low angle with Luolan's face, luminous eye, commanding gesture, and the moving squad readable inside the upper square crop; extend the lower portrait into welded deck plates, exposed cables, colony lights, and asymmetrical silhouettes of patched expedition ships. Premium industrial sci-fi anime rendering, confident defiance, cinematic green-red rim light, dense matte metal and worn technical fabric, exceptional authored material finish. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"星石劫掠者","en":"Starstone Reclaimer","type":"Minion","rarity":"Common","faction":"skyraider","cost":1,"collect":"Collectable","race":"反抗军","atk":1,"hp":2,"spd":3,"arrows":"","effect":"该单位在非友方领土拾取卡牌时额外获得1点星能。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Common minion. A single Skyborne Alliance starstone reclaimer works beyond friendly territory at an abandoned Imperial extraction deck, bracing one boot against fractured machinery while locking a luminous cyan starstone core into a rugged field canister. Give the rebel a clear practical silhouette: deep forest-green work jacket, dark oxblood-red armband, charcoal utility armor, respirator, climbing line, and visibly repaired tools assembled from frontier parts. Keep the worker, crystal, and one clean recovery action readable inside the upper square crop; use only a restrained background of cold industrial panels, distant warning light, and sparse drifting dust. Premium industrial sci-fi anime rendering, economical staging, tactile worn materials, disciplined cyan resource glow against the faction's green-red palette. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"猎空冒险者","en":"Skyborne Adventurer","type":"Minion","rarity":"Common","faction":"skyraider","cost":0,"collect":"Collectable","race":"反抗军","atk":2,"hp":2,"spd":2,"arrows":"","effect":"该卡可被放置于非己方领土内。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Common minion. A young Skyborne Alliance frontier adventurer makes the first committed crossing from a makeshift resistance outpost into contested alien terrain, using a taped jump-thruster and grappling line to clear a broken Imperial boundary wall. Their deep forest-green exploration coat, dark oxblood-red resistance scarf, charcoal field armor, survey pack, and repeatedly repaired equipment express a resourceful pioneer rather than an expendable raider. Use one strong forward-leaping silhouette with the face, grappling hand, and landing point readable inside the upper square crop; keep the environment restrained to a breached wall, a distant unclaimed horizon, and a few sparks from the improvised thruster. Premium industrial sci-fi anime rendering, clean adventurous momentum, worn matte materials, cool frontier atmosphere with controlled red warning light. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"军团登陆艇","en":"","type":"Minion","rarity":"Epic","faction":"skyraider","cost":5,"collect":"Collectable","race":"机械","atk":0,"hp":5,"spd":3,"arrows":"NW,NE","effect":"你可以在该单位指向的格子上无视领土单位放置反抗军单位。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic mechanical minion. A heavily rebuilt Skyborne Alliance legion landing craft punches through an Imperial orbital-defense perimeter and hovers over a contested asteroid settlement, opening two armored deployment ramps as resistance pioneers descend directly into hostile territory. The craft combines deep forest-green hull plates, dark oxblood-red identification bands, charcoal steel, exposed rivets, mismatched engines, welded repairs, cargo clamps, and field-modified shielding; below it, compact rebel squads carry colony modules and breach equipment rather than plunder. Use a dramatic descending perspective with the landing craft, both deployment streams, and the secured foothold readable inside the upper square crop; extend the lower portrait into thruster wash, industrial gantries, defensive fire, and the first unfolding frontier beacon. Premium industrial sci-fi anime rendering, layered environmental storytelling, strong depth and motion, dense practical machinery, cinematic red-green light against cold space. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"遗忘团长德雷克","en":"","type":"Minion","rarity":"Legendary","faction":"skyraider","cost":0,"collect":"Collectable","race":"反抗军","atk":0,"hp":1,"spd":1,"arrows":"N","effect":"当这张牌被移除时：将一张「裂隙惘生德雷克」加入你的额外卡组。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Legendary minion. The elderly Drake, forgotten founding commander of the Skyborne Alliance and once a legendary frontier adventurer, sits alone in his stripped command chair on an abandoned mobile fleet-city bridge after surrendering leadership. He has a weathered white beard, deep-set unwavering eyes, and a cold severe face; his once-proud deep forest-green and dark oxblood-red command coat still carries old resistance insignia but is frayed, scorched, and heavy with years of field repairs. Use a restrained low three-quarter portrait with Drake's seated silhouette, face, one hand gripping the worn armrest, and ruined coat readable inside the upper square crop. Keep the bridge almost entirely dark: dead consoles, hanging cables, empty crew stations, and a narrow distant rift behind him. A single hard high light crosses his brow, cheekbones, and eyes, carving his stern expression out of the darkness while the rest falls into charcoal shadow. Singular charged stillness, quiet pride, and the sense that he is calmly awaiting one final fatal expedition; premium industrial sci-fi anime rendering, exceptional worn fabric and metal finish. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"裂隙惘生德雷克","en":"","type":"Minion","rarity":"Legendary","faction":"skyraider","cost":0,"collect":"Uncollectable","race":"反抗军 · 空亡体","atk":3,"hp":3,"spd":3,"arrows":"NE","effect":"该卡可被放置于非己方领土内，该单位不会因为时停阶段的放置重合而湮灭。当这张牌被移除时：改为将其洗回牌堆，并抽一张牌。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Legendary derivative minion. Drake emerges deliberately from a temporal rift after exiling himself as mutually contradictory states of the same man compress around a small perfectly lightless causal void. His body has returned to a young man's form while fragments of his elderly self, absent future, and displaced machinery occupy incompatible positions along one side of his torso and arm. Preserve his deep-set resolute eyes, proud commander's posture, and torn deep forest-green and dark oxblood-red coat; his retained face and steady human hand show that reason survives, while the other hand frame-skips between a human outline, an elongated remnant, and empty space. He steps through overlapping wreckage in hostile territory without annihilating, with duplicated deck seams, reversed debris, and simultaneous growth and erosion revealing the contradiction. Use a bold low three-quarter angle with the recognizable face, causal void, forward step, and misaligned age states readable inside the upper square crop. Cold rift edge light against green, oxblood red, and event-derived industrial fragments, premium industrial sci-fi anime rendering, exceptional Legendary material finish. Do not depict a clean human/monster split or imply a stable hybrid lineage. The void must read as missing reality, not black skin, smoke, or a glowing portal. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"冲锋！！","en":"","type":"Spell","rarity":"Rare","faction":"skyraider","cost":3,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"N","effect":"发动：将其⬆️格子的反抗军向前冲撞8格。","desc":"","aiText":"反抗军被火箭推进向前弹射，要体现冲击力。"},
  {"zh":"探险者航线","en":"","type":"Spell","rarity":"Rare","faction":"skyraider","cost":1,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"N,E,SE","effect":"时动阶段开始时：将其↘️格子的卡牌移除。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for the Skyborne Alliance, a galactic-frontier resistance civilization driven by adventure, pioneering, and conquest. Deep forest green, dark oxblood red, charcoal steel, rebuilt machinery, reclaimed weapons, and practical rebel equipment. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"军团旗帜手-塞特","en":"","type":"Minion","rarity":"Epic","faction":"skyraider","cost":3,"collect":"Collectable","race":"反抗军","atk":1,"hp":4,"spd":2,"arrows":"S","effect":"存活时限一次，在敌方领土内可发动：从牌堆召唤一个费用低于5的反抗军到该单位⬇️方格子内。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for the Skyborne Alliance, a galactic-frontier resistance civilization driven by adventure, pioneering, and conquest. Deep forest green, dark oxblood red, charcoal steel, rebuilt machinery, reclaimed weapons, and practical rebel equipment. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"忘记来源的数据包","en":"","type":"Spell","rarity":"Rare","faction":"skyraider","cost":0,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"NW","effect":"入场：[慢速] 在场上随机生成4张「遗失的智慧」。此卡被移除时：触发其入场效果两次。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for the Skyborne Alliance, a galactic-frontier resistance civilization driven by adventure, pioneering, and conquest. Deep forest green, dark oxblood red, charcoal steel, rebuilt machinery, reclaimed weapons, and practical rebel equipment. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"敌后渗透者","en":"","type":"Minion","rarity":"Rare","faction":"skyraider","cost":3,"collect":"Collectable","race":"反抗军","atk":1,"hp":2,"spd":3,"arrows":"","effect":"每回合限一次，在敌方领土时可发动：将该卡的控制权交给对方。亡语：你下回合少抽一张牌。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for the Skyborne Alliance, a galactic-frontier resistance civilization driven by adventure, pioneering, and conquest. Deep forest green, dark oxblood red, charcoal steel, rebuilt machinery, reclaimed weapons, and practical rebel equipment. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"奇怪的虫洞发生器","en":"","type":"Spell","rarity":"Rare","faction":"skyraider","cost":2,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"NE,SW","effect":"该卡被移除时：[慢速] 将你弃牌堆最上方的反抗军召唤到敌方领土的随机位置。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for the Skyborne Alliance, a galactic-frontier resistance civilization driven by adventure, pioneering, and conquest. Deep forest green, dark oxblood red, charcoal steel, rebuilt machinery, reclaimed weapons, and practical rebel equipment. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"危险入侵生物笼","en":"","type":"Spell","rarity":"Rare","faction":"skyraider","cost":4,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"N","effect":"当此卡被移除时：[慢速] 为对手在其领土内召唤两只「食锈螯兽」。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for the Skyborne Alliance, a galactic-frontier resistance civilization driven by adventure, pioneering, and conquest. Deep forest green, dark oxblood red, charcoal steel, rebuilt machinery, reclaimed weapons, and practical rebel equipment. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"食锈螯兽","en":"","type":"Minion","rarity":"Rare","faction":"skyraider","cost":1,"collect":"Uncollectable","race":"奇兽","atk":1,"hp":3,"spd":1,"arrows":"","effect":"回合结束时：随机吸取一个己方机械/建筑随从3点生命值。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for the Skyborne Alliance, a galactic-frontier resistance civilization driven by adventure, pioneering, and conquest. Deep forest green, dark oxblood red, charcoal steel, rebuilt machinery, reclaimed weapons, and practical rebel equipment. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"销赃","en":"","type":"Spell","rarity":"Rare","faction":"skyraider","cost":3,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"SE","effect":"入场：选择并移除一张场上的己方卡牌，获得等同于其费用的星能。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for the Skyborne Alliance, a galactic-frontier resistance civilization driven by adventure, pioneering, and conquest. Deep forest green, dark oxblood red, charcoal steel, rebuilt machinery, reclaimed weapons, and practical rebel equipment. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"「黑手」供货商-奇莫","en":"","type":"Minion","rarity":"Epic","faction":"skyraider","cost":7,"collect":"Collectable","race":"反抗军","atk":2,"hp":6,"spd":3,"arrows":"S","effect":"你的商店额外带有一个从你的虚空进货的格子，其中商品费用减半。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for the Skyborne Alliance, a galactic-frontier resistance civilization driven by adventure, pioneering, and conquest. Deep forest green, dark oxblood red, charcoal steel, rebuilt machinery, reclaimed weapons, and practical rebel equipment. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"「黑手物流」货运站","en":"","type":"Minion","rarity":"Rare","faction":"skyraider","cost":5,"collect":"Collectable","race":"建筑","atk":0,"hp":5,"spd":0,"arrows":"SW","effect":"每回合限一次，发动：移除一张手牌，你在下回合额外抽2张牌。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for the Skyborne Alliance, a galactic-frontier resistance civilization driven by adventure, pioneering, and conquest. Deep forest green, dark oxblood red, charcoal steel, rebuilt machinery, reclaimed weapons, and practical rebel equipment. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"猎空火枪手","en":"","type":"Minion","rarity":"Rare","faction":"skyraider","cost":3,"collect":"Collectable","race":"反抗军","atk":3,"hp":4,"spd":2,"arrows":"","effect":"[攻击范围：3]","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for the Skyborne Alliance, a galactic-frontier resistance civilization driven by adventure, pioneering, and conquest. Deep forest green, dark oxblood red, charcoal steel, rebuilt machinery, reclaimed weapons, and practical rebel equipment. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"军团驯兽师","en":"","type":"Minion","rarity":"Rare","faction":"skyraider","cost":5,"collect":"Collectable","race":"反抗军","atk":1,"hp":4,"spd":2,"arrows":"N","effect":"存活时限一次，发动：在其⬆️方格子召唤一只「苍空猎犬」。此卡被移除时：[慢速] 随机在敌方领土召唤2只「苍空猎犬」。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for the Skyborne Alliance, a galactic-frontier resistance civilization driven by adventure, pioneering, and conquest. Deep forest green, dark oxblood red, charcoal steel, rebuilt machinery, reclaimed weapons, and practical rebel equipment. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"苍空猎犬","en":"","type":"Minion","rarity":"Rare","faction":"skyraider","cost":3,"collect":"Uncollectable","race":"反抗军 · 奇兽","atk":3,"hp":2,"spd":3,"arrows":"SE","effect":"[耐久度：1] 该单位的箭头仅在其处于敌方领土时激活。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for the Skyborne Alliance, a galactic-frontier resistance civilization driven by adventure, pioneering, and conquest. Deep forest green, dark oxblood red, charcoal steel, rebuilt machinery, reclaimed weapons, and practical rebel equipment. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"前线之光-阿尔德","en":"","type":"Minion","rarity":"Legendary","faction":"skyraider","cost":8,"collect":"Collectable","race":"反抗军","atk":4,"hp":7,"spd":4,"arrows":"NW,NE","effect":"其位于友方领土内时，全体友方反抗军单位获得+1移动力；其位于敌方领土内时，全体友方反抗军单位获得+1攻击力。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Legendary minion. Ald, the Skyborne Alliance's young star-blade breacher, leads a full resistance assault through the first breach of an Imperial frontier fortress. He has tousled black hair with a dark red streak, fierce red eyes, layered charcoal industrial armor, a torn deep forest-green mantle, dark oxblood-red straps and insignia, and a blazing red plasma star-blade raised diagonally as the visual beacon of the charge. Depict unequivocal forward attack: Ald surges uphill across shattered plating into enemy territory while rebel pioneers and rebuilt armored units flood through behind him, their triangular massed advance echoing the emotional force of a people following freedom into battle without reproducing an existing painting. Use a dramatic low angle with Ald's face, raised blade, lunging silhouette, and the foremost followers readable inside the upper square crop; extend the lower portrait into boots striking sparks, torn banners, smoke, and the breached Imperial gate. Deep forest green and dark oxblood red against severe Imperial black, cinematic blade light, aggressive depth and motion, exceptional industrial-punk material detail, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"义体医师尼克斯","en":"","type":"Minion","rarity":"Epic","faction":"skyraider","cost":6,"collect":"Collectable","race":"机械 · 反抗军","atk":2,"hp":4,"spd":2,"arrows":"E","effect":"每回合限一次，发动：令一个友方反抗军获得+3攻击力/+3移动力以及[耐久度：1]。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic minion. Nyx, the Skyborne Alliance's young cybernetic doctor, engineer, and hacker, performs an illegal battlefield augmentation inside a cramped frontier surgery workshop. Match his established identity: messy black hair, a sharp mischievous expression, one red cybernetic eye, a long patched deep forest-green coat with dark oxblood-red markings over charcoal technical clothing, and multiple modular mechanical arms carrying surgical drivers, injectors, cable spools, and bone saws. With one precise hand he locks an overclocked spinal-and-leg actuator onto a conscious resistance fighter while two auxiliary arms tension exposed braces and the new limbs flare with dangerous red-green power, visibly promising explosive strength and speed at the cost of imminent mechanical failure. Use an intimate tilted three-quarter composition with Nyx's face, primary surgical gesture, patient silhouette, and unstable augmentation readable inside the upper square crop; layer hanging lamps, salvaged medical machinery, cables, prosthetic racks, and frontier warning lights through the lower portrait for Epic environmental density. Dark industrial atmosphere, hard green surgical light, oxblood-red emergency glow, sparks, steam, tactile metal and worn fabric, premium industrial sci-fi anime rendering. Keep the procedure intense but non-gory. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"老资历探险者","en":"","type":"Minion","rarity":"Common","faction":"skyraider","cost":6,"collect":"Collectable","race":"反抗军","atk":5,"hp":7,"spd":4,"arrows":"","effect":"该卡从场上被移除时：在其位置上召唤一只「猎空冒险者」。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for the Skyborne Alliance, a galactic-frontier resistance civilization driven by adventure, pioneering, and conquest. Deep forest green, dark oxblood red, charcoal steel, rebuilt machinery, reclaimed weapons, and practical rebel equipment. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"诺亚","en":"Noa","type":"Minion","rarity":"Legendary","faction":"solar","cost":"hero","collect":"InitHero","race":"","atk":1,"hp":20,"spd":2,"arrows":"NW","effect":"首个回合开始时：抽2张牌并令其获得[保留]。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero. Noa, the Solar Church's eternally young boy pope and perfected solar vessel, stands within a Dyson-ring chapel that is equal parts sacred sanctuary and stellar engineering facility. He wears delicate white and warm off-white futuristic ceremonial layers over restrained modular armor, with orange-red technical accents and a luminous white-orange reactor core visible at his chest. A precise halo of small solar rings and contained supernova light frames his calm childlike face, conveying that he is both revered and imprisoned by his role. Waist-up portrait with face, halo, shoulders, and chest core concentrated entirely in the upper square of a 5:8 portrait canvas; flowing mantle and chapel steps descend into the lower area. Premium cinematic sci-fi anime concept art, crisp expressive face, hybrid cel-and-painterly rendering, radiant rim light, volumetric shafts, engineered ceramic and technical fabric textures. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"阳炎信徒","en":"Corona Believer","type":"Minion","rarity":"Common","faction":"solar","cost":0,"collect":"Collectable","race":"人类","atk":1,"hp":3,"spd":1,"arrows":"","effect":"令你手牌最左侧不具有[保留]的牌获得[保留]。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Common minion. A young Solar Church believer practices basic corona magic alone on a modest training terrace of the Dyson ring, concentrating a small white-orange flame above one open palm while steadying it with the other. The novice wears simple ivory technical robes over a practical fitted training suit, with restrained orange seams, a small unadorned solar-core housing, and no elite ceremonial regalia. Their earnest face, careful hand posture, and slightly unstable flame must remain clear inside the upper square crop; use the lower portrait extension only for clean ceramic floor panels, a low safety rail, and distant solar collectors. One readable idea, warm youthful sincerity, economical environment, polished industrial sci-fi anime rendering with soft sunlight and controlled orange glow. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"太阳雨","en":"Solar Rain","type":"Spell","rarity":"Rare","faction":"solar","cost":3,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"S","effect":"入场：[慢速] 每回合限一次，对全场单位造成1点伤害。若该卡已被保留过，额外造成一次。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition. Above a vast battlefield built into the Solar Church's Dyson-ring cathedral, a controlled corona ruptures into a sweeping rain of needle-thin white-orange solar flares that descends across the entire field, striking many distant units at once. Make the spell an unmistakable large-scale process rather than a character portrait: the radiant storm and its expanding impact pattern are the decisive focal action in the upper square region, while small silhouettes below establish that nothing on the field escapes it. Futuristic sacred architecture, curved solar collectors, white ceramic and dark metal, orange-gold plasma, high-contrast bloom, volumetric shafts, heat haze and sparks, premium industrial sci-fi anime concept art, crisp graphic flare shapes with painterly atmosphere. Keep the solar rain readable after a square crop from the top of the portrait. Artwork only; no text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"烈阳圣女-阿蕾缇娅","en":"Solar Saint Aletheia","type":"Minion","rarity":"Legendary","faction":"solar","cost":10,"collect":"Collectable","race":"人类","atk":3,"hp":6,"spd":3,"arrows":"N","effect":"你的所有卡牌在结算效果时算作额外在手牌中保留了两回合。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Legendary minion. Aletheia, the beloved young Saint of the Solar Church, stands beneath a vast shaft of sunlight in the central nave of a futuristic Dyson-ring cathedral. She wears flowing white and warm-ivory ceremonial armor with elegant orange-red technical trim and a luminous solar core, her gentle but formidable face framed by restrained radiant rings. With both hands she raises a tall flame staff whose crown burns like a contained white-orange sun; behind and below her, a dense congregation of devoted believers reaches toward the light and gathers around her in reverent affection rather than fear. Keep Aletheia's face, raised staff, solar flame, upper-body silhouette, and the nearest worshippers readable inside the upper square crop; extend the immense congregation, cathedral steps, reactor-like columns, and curved ring architecture downward for depth. Singular iconic public appearance, majestic low angle, intentional asymmetry, exceptional ceramic, metal, fabric, and fire detail, cinematic volumetric light, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"日珀蜂蜜","en":"Sun-Amber Honey","type":"Spell","rarity":"Common","faction":"solar","cost":1,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"SE","effect":"[耐久度：2] 入场：选择场上的一张法术，令其法术伤害+1。每次被保留时，给予的法术伤害额外+1。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Common spell with no characters. In a Solar Church honeycomb reactor chamber on the Dyson ring, Sun-Amber Honey itself dominates the image as a large suspended mass of dense translucent orange-gold liquid, glowing from within like concentrated stellar fuel. It must remain unmistakably viscous honey rather than fire or ordinary plasma: thick folding ribbons, slow stretched strands, rounded droplets, trapped bubbles, and tiny hexagonal energy crystals are visible throughout the luminous fluid. The honey pours directly from an opened geometric honeycomb fuel cell and coils around a floating ivory spell tablet with a small corona core. Where the honey enters the tablet's energy channels, its weak flame instantly expands into a much larger, hotter white-orange corona burst, clearly showing the fuel empowering a spell and increasing its destructive force. Make the honey mass and its bright flow path the primary focal subject, with the spell tablet secondary and the machinery only framing the process. Keep the honey, tablet, and moment of magical amplification readable inside the upper square crop; extend falling fuel strands, reactor conduits, and reflected amber light downward. One clean visual idea, dynamic diagonal energy flow, mature premium industrial sci-fi anime rendering. No person, creature, bee, alchemist, jar, product display, shop presentation, readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"日珀蜂群","en":"Sun-Amber Swarm","type":"Minion","rarity":"Rare","faction":"solar","cost":3,"collect":"Collectable","race":"奇兽","atk":1,"hp":2,"spd":3,"arrows":"","effect":"入场：你获得一张日珀蜂蜜，令你手中的日珀蜂蜜在本回合获得[保留]。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare minion. Three canonical Sun-Amber creatures fly beside an amber comb inside a Dyson-ring thermal garden, designed as mature original fauna from a serious science-fiction anime rather than literal bees or mascots. The lead creature has a streamlined armored thorax, balanced adult proportions, modest almond-shaped luminous eyes, six simplified but functional limbs, layered black-and-ivory ceramic plates, restrained orange coronal seams, and broad translucent wings with clean graphic vein patterns. It carries a bead of luminous Sun-Amber Honey with a focused neutral posture while two companions work in depth. Use confident anime linework, cel-shaped light and shadow, stylized engineered surfaces, and cinematic atmospheric depth: clearly illustrated and non-photoreal, yet elegant and credible. Avoid realistic macro insect texture, bristles, wet chitin, biological horror, sharp mandibles, dense swarms, and also avoid chibi proportions, oversized glossy eyes, baby faces, smiles, plush-toy softness, or cute mascot posing. Keep the lead creature, honey bead, wing shape and part of the comb readable inside the upper square crop; extend only a few companions and sunlit ring machinery downward. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"燃魂学徒","en":"Soul-Burning Acolyte","type":"Minion","rarity":"Rare","faction":"solar","cost":2,"collect":"Collectable","race":"人类","atk":1,"hp":4,"spd":1,"arrows":"","effect":"每当该单位受到法术伤害，抽一张牌并令其获得本回合[保留]。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare minion. A young Solar Church ascetic deliberately attempts to burn their own body as an act of severe spiritual training. Kneeling in a stark reactor-chapel practice chamber, the believer grips their forearms and holds steady while controlled white-orange corona fire climbs from the chest core across the shoulders and arms; the flames are painful and real but non-graphic, leaving glowing heat lines rather than wounds. Their face shows strain, fear, and stubborn devotion, while an observing safety mechanism remains inactive at the edge of the scene because the trial has not yet been abandoned. Keep the face, tense posture, chest core, and self-kindled flames readable inside the upper square crop; use the lower portrait extension for folded training robes, circular floor vents, and heat-lit ceramic tiles. Specific ritual setting, emotional clarity, strong light-versus-shadow contrast, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"日光上师","en":"Sunlight Master","type":"Minion","rarity":"Rare","faction":"solar","cost":5,"collect":"Collectable","race":"人类","atk":1,"hp":5,"spd":2,"arrows":"","effect":"法术伤害+2。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare minion. A serene young-looking Solar Church master demonstrates complete control of corona magic inside a chamber that is equal parts sanctuary and stellar laboratory. With one hand the master holds a modest white-orange spell seed; with the other, they pass it through a compact sequence of engineered solar lenses until it emerges as a far more intense focused flare. Their layered ivory mantle, orange ceremonial armor, calm eyes, and mature bearing distinguish rank without relying on physical age. Keep the face, hands, small original flame, and amplified beam origin readable inside the upper square crop; use the lower portrait extension for suspended focusing rings, reactor columns, and disciplined apprentices watching from a safe distance. Specific teaching moment, rich fabric, ceramic, and plasma contrast, controlled depth, radiant rim light, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"教徒的智慧","en":"Believer's Wisdom","type":"Spell","rarity":"Epic","faction":"solar","cost":4,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"","effect":"抽1张牌，该卡牌抽卡数量会受到法术伤害加成。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic spell. In a deep Solar Church observatory, a solitary scholar converts the measured violence of a stellar flare into expanding insight. A brilliant corona stream enters a reactor-like scripture instrument, and the stronger it becomes, the more distinct luminous memory prisms and orbiting geometric revelations unfold around the scholar—never literal playing cards or readable pages. The scholar's contemplative silhouette remains calm at the center while layered solar optics, preserved experiments, and curved Dyson-ring architecture imply generations of theology built from engineering. Keep the scholar, incoming flare, transformation apparatus, and first cluster of insights readable inside the upper square crop; use the lower portrait extension for receding instruments, mirrored floors, and deeper archives. Ambitious perspective, layered environmental storytelling, dense ivory ceramic, dark metal, amber glass, and white-orange plasma detail, cinematic light, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"魔法练习人偶","en":"Magic Practice Automaton","type":"Minion","rarity":"Rare","faction":"solar","cost":1,"collect":"Collectable","race":"机械","atk":0,"hp":1,"spd":1,"arrows":"","effect":"当该单位将受到法术伤害时：将其无效并令你获得等量的星能。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare mechanical minion. One basic Solar Church magic-practice familiar floats alone inside an industrial training chapel. It is a charming artificial creature with a clearly separated rounded head and compact torso, gentle amber-gold luminous eyes, a tiny simple mouth, two short floating ceramic forelimbs without human hands, and a tapered hovering lower body with no legs. Its overall height is approximately 1.1–1.3 meters. Smooth matte-white engineered ceramic shells cover its head and torso, divided by dark flexible mechanical joints and restrained gold seams. Engraved solar motifs, standardized replaceable impact panels, and a few old scorch marks identify it as humble mass-produced training equipment. Its proportions and expression feel endearing and creature-like while retaining a mature science-fiction anime design rather than childish chibi styling. No person or caster is visible anywhere in the composition. A single concentrated white-orange flame spell shoots diagonally into frame from off-screen and strikes the familiar's torso. The flame spreads harmlessly through the engraved sun lines and drains into its orange-gold core; the little familiar braces itself with a determined but gentle expression and remains unharmed. Keep the familiar's head, torso, expression, incoming flame trajectory, impact point, and absorption flow readable inside the upper square crop; extend the fading fire trail, floor markings, and industrial chapel architecture into the lower portrait area. Mature premium industrial science-fiction anime illustration with crisp authored contours, deliberate cel-shaped value groups, designed highlights, engineered ceramic materials, and cinematic white-orange atmosphere. No humans, humanoids, visible hands, caster silhouettes, giant scale, combat armor, weapon, aggressive monster traits, infant proportions, exaggerated chibi head, plush toy texture, generic western cartoon, EVE imitation, photorealism, PBR product render, readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"见习阳炎射击","en":"Novice Corona Shot","type":"Spell","rarity":"Common","faction":"solar","cost":0,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"E","effect":"若该卡已被保留过，入场：选择一个单位，[慢速]对其造成2点伤害。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Common spell. A novice Solar Church caster releases a small, disciplined corona projectile from one hand toward a clearly chosen distant target. The white-orange bolt has just broken free from a single concentric preservation ring that held it stable until it was ready, leaving a clean straight trail through a sparse training corridor. Keep the hand, compact solar bolt, broken ring of stored light, and target silhouette readable inside the upper square crop; use the lower portrait extension only for a little robe movement and restrained ceramic floor detail. One clear action, simple directional composition, polished but economical white, ivory, dark metal, and orange light, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"耀斑连射","en":"Flare Barrage","type":"Spell","rarity":"Rare","faction":"solar","cost":5,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"NW,NE","effect":"入场：[慢速]将总计6点伤害随机分配给所有敌方单位。每次被保留时，额外造成4点。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare spell. A suspended Solar Church flare core detonates into an unpredictable volley of white-orange plasma lances that ricochet and branch across an enemy formation. Several concentric preservation rings remain behind the core like accumulated charge stages, with each additional ring feeding another wave of shots into different targets. The attack should feel distributed and difficult to predict while remaining visually coherent through one radiant origin and multiple sharp trajectories. Keep the flare core, preservation rings, and first several branching impacts readable inside the upper square crop; use the lower portrait extension for staggered enemy silhouettes, scorched ground, and fading secondary trails. Dynamic diagonal staging, controlled chaos, richer depth and material contrast, hot plasma against dark battlefield architecture, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"高等阳炎术","en":"Advanced Corona Arts","type":"Spell","rarity":"Epic","faction":"solar","cost":7,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"N,SW,SE","effect":"[保留] 入场：从牌堆随机将3张魔法卡放置于该卡牌的箭头区域内，它们视作被保留了等同于该卡在手牌中的回合数。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic spell. An advanced Solar Church corona engine unfolds above a cathedral-laboratory floor, its central spell seed preserved inside many concentric solar rings accumulated over time. At release, the engine manifests three distinct fully formed spells and sends them outward along three deliberate paths: one rising forward and two descending diagonally to opposite sides, each carrying the same inherited layers of stored sunlight. Avoid literal cards and make the three outputs read as different processes—focused lance, protective flare lattice, and expanding solar sphere—born from one mature source. Keep the central engine, stacked preservation rings, and all three spell origins readable inside the upper square crop; extend their paths, cathedral machinery, and dramatic reflected light downward. Ambitious radial composition, layered depth, high-density ceramic, metal, glass, and plasma detail, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"俱焚烈焰","en":"Mutual Immolation","type":"Spell","rarity":"Rare","faction":"solar","cost":2,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"NE,S","effect":"入场：选择一个友方和敌方随从，[慢速]对它们造成4点伤害。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare spell. Mutual Immolation erupts as a violent white-orange corona blast centered between one allied Solar Church warrior and one enemy combatant, engulfing both figures in the same unavoidable wave of heat. The allied warrior knowingly braces and accepts the burn while the enemy recoils, making the spell's ruthless exchange unmistakable without graphic injury; shattered ceramic, vaporized dust, and opposing silhouettes establish that neither side is spared. Keep both figures, the shared blast origin, and the single expanding wall of flame readable inside the upper square crop; use the lower portrait extension for scorched ground, heat distortion, and falling sparks. Strong opposing poses, specific battlefield tension, rich armor and flame contrast, modest depth, intense white-orange light against a dark environment, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"耀变星能石","en":"Radiant Star-Energy Stone","type":"Spell","rarity":"Epic","faction":"solar","cost":5,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"NW","effect":"入场：获得2星能。每次被保留时，获得的量翻倍。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic spell. A single unmistakably orange star-energy stone floats inside a Solar Church coronal amplification chamber. Its faceted mineral body begins as a compact warm-orange crystal, then each concentric preservation ring around it doubles the outgoing energy into increasingly numerous branching streams, turning the final stage into a contained miniature sunrise without changing the stone into a living being. Keep the orange stone, layered rings, and clear progression from two streams to four and beyond readable inside the upper square crop; use the lower portrait extension for focusing pylons, reflected amber light, and deep reactor architecture. Ambitious symmetrical composition with controlled asymmetry in the energy flow, dense crystal, ceramic, and plasma detail, dramatic orange-gold bloom against ivory and dark metal, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"唱诗班诗童","en":"Choir Child","type":"Minion","rarity":"Rare","faction":"solar","cost":2,"collect":"Collectable","race":"人类","atk":1,"hp":3,"spd":2,"arrows":"","effect":"每次被保留时，随机点亮他的一个箭头。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare minion. A young Solar Church choir child sings alone at the center of a circular Dyson-ring chapel, wearing layered ivory choir robes with restrained orange technical seams and a small solar resonance collar. Each sustained phrase awakens one new luminous directional node around the child in an irregular order, forming a gradually completed radial halo without resembling literal game arrows. The child's earnest face, open singing posture, and the newest igniting node must remain readable inside the upper square crop; use the lower portrait extension for flowing robe layers, circular acoustic floor panels, and softly blurred choir stalls. Specific sacred performance, warm emotional clarity, rich fabric-versus-ceramic texture, modest architectural depth, gentle orange-white volumetric light, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"沐阳晶灵","en":"Sun-Bathed Crystal Spirit","type":"Minion","rarity":"Rare","faction":"solar","cost":3,"collect":"Collectable","race":"晶灵","atk":1,"hp":1,"spd":1,"arrows":"","effect":"[攻击范围：1] 每次被保留时，该卡牌所有的卡面数值永久+1。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare minion. A peaceful Sun-Bathed Crystal Spirit floats inside a Solar Church heliostat garden, receiving a concentrated but gentle beam from the Dyson ring. Its true awareness resides in one brilliant orange-white consciousness core, while separate crystals move on inclined atom-like orbits joined only by light and electromagnetic resonance; it has no face, limbs, or humanoid anatomy. Each concentric preservation ring of sunlight causes the core to brighten, the orbital paths to widen, and the crystals to grow more substantial, conveying permanent improvement through patient exposure. Keep the core, independent orbiting crystals, responsive light, and first growth transition readable inside the upper square crop; use the lower portrait extension for reflective ceramic terraces and sun-tracking mirrors. Specific peaceful behavior, rich refraction and engineered-garden detail, modest depth, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"烈阳恩典","en":"Grace of the Blazing Sun","type":"Spell","rarity":"Epic","faction":"solar","cost":6,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"N,W,E","effect":"令的所有手牌视作额外保留了1次，并令其在本回合获得[保留]。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic spell. A high Solar Church officiant stands on a cathedral dais and opens both arms as a broad, warm corona blessing sweeps over an assembled group of believers. Every suspended spell seed and ritual vessel carried by the congregation receives one additional concentric preservation ring at the same instant, while a second glow holds each one safely in place for the present moment. Avoid literal cards or interface symbols; communicate shared retention through repeated rings, suspended light, and synchronized reactions across the crowd. Keep the officiant, expansive gesture, nearest spell vessels, and newly forming rings readable inside the upper square crop; use the lower portrait extension for layered worshippers, reactor-like columns, mirrored steps, and deeper radiant atmosphere. Grand communal composition, cinematic volumetric sunlight, dense white ceramic, gold glass, fabric, and orange plasma detail, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"日轮飞星-索拉","en":"Sunwheel Flying Star Sola","type":"Minion","rarity":"Legendary","faction":"solar","cost":7,"collect":"Collectable","race":"人类","atk":3,"hp":6,"spd":8,"arrows":"S","effect":"购买此卡时，获得一张阳炎爆裂拳。入场：将阳炎爆裂拳置入你的手牌。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Legendary minion. Sola, the Solar Church's lively young hero known as the Sunwheel Flying Star, launches from a broken Dyson-ring platform with the joyful force of a small sun. He has vivid orange hair, bright expressive eyes, and a wide irresistible smile, wearing a white-and-orange athletic flight suit with fitted technical layers, a short Solar Church mantle streaming behind him, a radiant sun-source core at the chest, and oversized corona-charged combat gauntlets. His core drives compact thrusters along his back and legs as he rockets toward an enemy many times his size, one fist drawing back while the other begins to ignite the signature explosive punch he brings into battle. Keep Sola's smiling face, orange hair, chest core, short mantle, both gauntlets, and airborne forward motion unmistakable inside the upper square crop; extend the curved flight trail, broken ring structure, tiny allies, and enormous enemy silhouette downward for depth. Singular character-defining entrance, bold foreshortening, playful courage, intentional asymmetry, cinematic white-orange light, exceptional premium industrial sci-fi anime finish. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"阳炎爆裂拳","en":"Solar Burst Fist","type":"Spell","rarity":"Legendary","faction":"solar","cost":5,"collect":"Uncollectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"E","effect":"[保留] 选择日轮飞星-索拉3x3范围内的一个非友方随从，对其造成2点伤害。每次被保留时，额外重复一次。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Legendary derivative spell identity-linked to Sola, the Sunwheel Flying Star, but compositionally distinct from his main card. Use a low side-rear tracking angle: Sola streaks horizontally across a shattered Dyson-ring corridor from lower left toward upper right, seen mostly in three-quarter profile rather than flying frontally at the viewer. His vivid orange hair, white-and-orange athletic flight suit, short church mantle, radiant chest core, and oversized corona gauntlets match the parent character. His leading gauntlet is buried in the central causal void of a Lost Hollow-Null, whose mismatched pale and metallic limbs occupy contradictory temporal positions and whose body fractures into offset timeline layers around the punch. A compact white-orange corona detonates sideways through the void; two or three concentric preservation rings remain behind the impact and release delayed shock echoes, expressing repeated strikes without duplicating Sola's pose. Keep Sola's profile face, striking arm, the target's lightless void, and the lateral impact line readable inside the upper square crop; extend the broken corridor and staggered temporal fragments downward. Explicitly no front-facing charge, no reuse of the main card's camera, pose, or flight arc, and no repeated copies of Sola. Exceptional heat, ceramic, fabric, and causal-distortion finish, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"颂阳圣歌","en":"Hymn to the Sun","type":"Spell","rarity":"Rare","faction":"solar","cost":1,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"NW,NE","effect":"","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare spell. Inside a vast Solar Church choir hall built into the Dyson ring, a disciplined choir sings toward a monumental reactor-organ whose ivory ceramic pipes curve around a view of the sun. Their voices become visible concentric waves of white-orange light that travel through the instrument, resonate across the vaulted architecture, and awaken the entire sanctuary in a warm synchronized glow. Keep the nearest singers, conductor's gesture, reactor-organ, and first expanding solar resonance wave readable inside the upper square crop; use the lower portrait extension for tiered choir rows, reflective steps, cable-like organ roots, and deeper cathedral scale. Specific sacred-engineering ritual, rich fabric, ceramic, metal, and light contrast, modest cinematic depth, uplifting but powerful atmosphere, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"皇子阿列斯塔","en":"Crown Prince Alesta","type":"Minion","rarity":"Legendary","faction":"astra","cost":"hero","collect":"InitHero","race":"人类","atk":2,"hp":20,"spd":2,"arrows":"N","effect":"每个回合开始时：获得1点护甲。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Legendary minion. Crown Prince Alesta, the young heir to the Astra Imperium and commander of its Fourth Army Group, stands on an exposed frontline command terrace as enemy bombardment begins. He wears a severe dark-red and black imperial command coat over segmented heavy field armor, with a compact time-quota shield projector built into one gauntlet and a restrained imperial mantle forming his defining silhouette. Instead of retreating, he plants himself before the formation while successive translucent armor layers lock around him and the soldiers behind him, turning his body into the visual anchor of the defense. His young face, resolute expression, shield-bearing gesture, and noble military silhouette must remain unmistakable inside the upper square crop; use the lower portrait extension for ranked troops, armored columns, monumental city defenses, and distant orbital fire. Singular story-defining moment, bold low angle, intentional asymmetry, deep atmospheric scale, dark red, blackened steel, and disciplined pale energy light, premium industrial sci-fi anime rendering and exceptional material finish. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"发电站","en":"Power Station","type":"Minion","rarity":"Common","faction":"astra","cost":2,"collect":"Collectable","race":"建筑","atk":0,"hp":2,"spd":0,"arrows":"","effect":"该单位3x3范围内友方建筑的箭头层数和效果提供的数值+1。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Common building minion. A compact neighborhood-scale Astra Imperium modular power station has just come online inside a dense industrial block, deliberately modest in size rather than a monumental plant. Its squat blackened-steel housing, dark-red armored panels, small turbine stack, insulated pipes, and thick practical cables feed a clean pulse of energy into several nearby workshops and defense emplacements, causing their machinery to brighten in sequence. Keep the small station and the first branching power connections readable inside the upper square crop, with only restrained surrounding structures and service walkways below. One clear visual idea, strong blocky silhouette, economical but polished detail, cool industrial haze with disciplined red and pale-cyan status light, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"星能采矿场","en":"Star-Energy Mine","type":"Minion","rarity":"Rare","faction":"astra","cost":1,"collect":"Collectable","race":"建筑","atk":0,"hp":2,"spd":0,"arrows":"","effect":"回合开始时，你获得1点星能。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare building minion. An Astra Imperium star-energy mining site cuts into the exposed wall of a low-gravity asteroid quarry. Heavy rotary excavators and articulated black-steel clamps peel luminous cyan-gold ore from the rock while a precise stream of refined energy travels through armored conduits into elevated storage cells, suggesting a dependable new yield at the start of every operational cycle. Frame the active extraction head, radiant mineral seam, and first storage vessel inside the upper square crop; use the lower portrait extension for rail carts, dust, workers in dark-red pressure suits, and stepped mining terraces. Specific industrial setting, meaningful secondary machinery, rich rock-versus-metal material contrast, modest depth, cold starlight and warm work lamps, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"帝国军工厂","en":"Imperial Arms Factory","type":"Minion","rarity":"Rare","faction":"astra","cost":4,"collect":"Collectable","race":"建筑","atk":0,"hp":3,"spd":0,"arrows":"NW,NE","effect":"该单位的箭头不能用于放置或建造建筑随从。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare building minion. The vast doors of an Astra Imperium military factory open onto two forward assembly lanes producing deployable frontline forces rather than additional buildings: one line locks armor and rifles onto infantry frames while the other lowers a compact combat machine from overhead rails. Dark-red gantries, blackened-steel presses, robotic welders, suspended armor plates, and disciplined workers create a controlled rhythm of militarized production. Keep both converging production lanes and the newly completed units readable inside the upper square crop; use the lower portrait extension for receding floor rails, sparks, supply pallets, and deeper factory structure. Strong perspective, specific military-industrial detail, rich matte metal and heated weld contrast, restrained crimson warning light, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"帝国基建小队","en":"Imperial Infrastructure Squad","type":"Minion","rarity":"Common","faction":"astra","cost":1,"collect":"Collectable","race":"人类","atk":1,"hp":2,"spd":2,"arrows":"NW","effect":"该单位的箭头只能用于放置或建造建筑单位。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Common minion. A disciplined Astra Imperium infrastructure squad works under battlefield pressure, deploying a heavy foundation anchor while a survey drone projects the clean structural skeleton of a future defensive building above it. The engineers wear standardized dark-red and charcoal technical uniforms, compact ceramic work armor, helmets, tool harnesses, and practical powered construction rigs; their attention is entirely on establishing the build site rather than fighting. Keep the lead engineer, foundation anchor, and emerging architectural frame clear inside the upper square crop, with sparse rubble, cables, and stacked modules below. One readable construction action, compact group silhouette, restrained environment, polished but economical industrial sci-fi anime detail. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"帝国征召兵","en":"Imperial Conscript","type":"Minion","rarity":"Common","faction":"astra","cost":0,"collect":"Collectable","race":"人类","atk":2,"hp":2,"spd":2,"arrows":"","effect":"牺牲自己以发动：为一个相邻的友方单位提供2点建造进度。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Common minion. An ordinary young Astra Imperium conscript kneels beside an unfinished allied fortification during a desperate defense and deliberately removes the power cell from his own battered combat suit, locking it into the structure's exposed construction socket. His armor indicators go dark as two heavy wall segments complete and seal above him, conveying a conscious sacrifice of the soldier's own survival for immediate building progress without gore. Keep his face, the surrendered power cell, and the newly closing armor plates readable inside the upper square crop; use the lower portrait extension only for his grounded stance, loose cables, and worn deck debris. Plain standardized equipment, humane emotional clarity, one strong action, subdued dark-red and gunmetal palette with a single fading energy light, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"帝国特种兵","en":"Imperial Special Forces","type":"Minion","rarity":"Rare","faction":"astra","cost":4,"collect":"Collectable","race":"人类","atk":4,"hp":4,"spd":4,"arrows":"NW,SE","effect":"[箭头需求: 2, 可建造]","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare minion. An elite Astra Imperium special operations soldier steps out of a freshly completed orbital drop-assembly frame, two construction beams converging on the last armor plates as robotic clamps detach from the shoulders. The operative wears sleek but substantial dark-red and black combat armor, a sealed tactical helmet with a narrow sensor visor, compact rifle, reinforced limbs, and time-quota hardware built for fast independent action. Keep the soldier's powerful silhouette, weapon, and final assembly moment inside the upper square crop; use the lower portrait extension for the open frame, severed locking cables, smoke, and a hostile industrial landing zone. Specific deployment scene, stronger pose, rich armor and fabric contrast, modest foreground depth, sharp red rim light and cool machinery glow, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"工程机器人","en":"Engineering Robot","type":"Minion","rarity":"Rare","faction":"astra","cost":5,"collect":"Collectable","race":"机械 · 建筑","atk":0,"hp":4,"spd":3,"arrows":"N,W,E,S","effect":"该单位的箭头只能用于建造未完成的单位。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare minion. A mobile Astra Imperium engineering robot braces itself beside an unfinished allied titan, unfolding four articulated construction arms toward separate work zones while welding, fastening armor, feeding cable, and calibrating a joint at the same time. Its compact black-steel body combines a stable multi-legged base, dark-red armored housings, retractable tools, bright inspection optics, and heavy magnetic anchors, making it read as both machine and deployable construction platform. Keep the robot, all four purposeful tool arms, and the incomplete titan joint readable inside the upper square crop; use the lower portrait extension for scaffold feet, cables, sparks, and receding factory floor. Specific industrial action, clear functional silhouette, layered but controlled mechanical detail, warm weld light against cool steel, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"海燕","en":"Sea Swallow","type":"Minion","rarity":"Rare","faction":"astra","cost":6,"collect":"Collectable","race":"机械","atk":6,"hp":4,"spd":6,"arrows":"","effect":"[箭头需求: 3, 可建造] 该单位移动时可以忽略卡牌的阻挡。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare minion. Sea Swallow is a fast unmanned Astra Imperium combat aircraft with a sharp swallow-wing silhouette, compact armored fuselage, dark-red leading edges, black ceramic belly plating, and vectoring thrusters. It banks hard above a battlefield city, slipping over layered rooftops, barricades, and ground units that would block ordinary movement; a luminous vapor-and-thruster trail draws a broad elegant arc through the sky behind it, making the entire flight path immediately legible. Keep the aircraft, banking wings, and strongest portion of the curved trail inside the upper square crop; use the lower portrait extension for foreshortened towers, tracer fire, and distant industrial haze. Dynamic diagonal staging, modest depth, crisp high-speed silhouette, cold sky light and restrained crimson engine glow, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"泰拉理工学院","en":"Terra Institute of Technology","type":"Minion","rarity":"Legendary","faction":"astra","cost":8,"collect":"Collectable","race":"建筑","atk":0,"hp":5,"spd":0,"arrows":"SW,SE","effect":"[箭头需求: 6, 可建造] 回合结束时，累计1点科研计数。当该卡科研计数达到3时，清空并令本局对战中你所有的可建造单位的箭头需求-1。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Legendary building minion. Terra Institute of Technology reaches its defining breakthrough inside a monumental Astra Imperium research city: six severe black-steel laboratory towers align around a central construction atrium as three accumulated research phases culminate in one brilliant synchronized experiment. Below the converging beams, engineers and students watch an incomplete military prototype simplify itself into a cleaner modular design, with entire layers of support machinery retracting as the new method makes future construction visibly easier. Preserve the central prototype, the six-tower convergence, and a small but emotionally readable group of researchers inside the upper square crop; extend the vast terraced campus, transit rails, archives, and military skyline downward for depth. Iconic institutional moment, bold elevated perspective, intentional asymmetry, exceptional architectural finish, dark red and blackened steel cut by precise pale-cyan research light, cinematic haze, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"超载运转","en":"Overdrive Operation","type":"Spell","rarity":"Epic","faction":"astra","cost":5,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"NW","effect":"入场：令一个友方建筑的箭头箭头层数和效果提供的数值+3，但它会在本回合结束时被摧毁。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic spell. An Astra Imperium industrial building is deliberately forced far beyond its operating limit: turbines spin white-hot, armored conduits bulge with triple-flow energy, exhaust stacks flare, and every connected output surges while the structure's black-steel ribs begin to split apart. A calm engineer at a remote control station has already committed to the irreversible overload, contrasting disciplined intent with imminent destruction. Keep the overdriven core, expanding energy paths, and first catastrophic structural cracks readable inside the upper square crop; use the lower portrait extension for warped gantries, flying fasteners, heat shimmer, and evacuating personnel. Dramatic tilted perspective, layered industrial storytelling, violent crimson-white light against deep charcoal metal, strong motion and exceptional material stress detail, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"城市防护罩","en":"City Shield","type":"Spell","rarity":"Rare","faction":"astra","cost":6,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"N,NE","effect":"入场：该卡牌每被一个友方箭头指向，令你的所有建筑获得2护甲。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare spell. Several Astra Imperium buildings direct synchronized power beams into a central shield relay, and each incoming connection adds another visible armored layer to a vast translucent dome forming over the industrial district. The nearest factories and defense towers sit beneath the completed portion of the barrier as enemy fire breaks harmlessly across its outer surface. Keep the relay, converging beams, layered shield curvature, and protected skyline readable inside the upper square crop; use the lower portrait extension for dark-red rooftops, deep transport channels, and reflected barrier light. Specific city-defense action, clear focal hierarchy, rich glass-energy versus black-steel contrast, controlled crimson and pale-cyan illumination, modest atmospheric depth, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"综合作战指令","en":"Integrated Combat Directive","type":"Spell","rarity":"Rare","faction":"astra","cost":5,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"NE,E","effect":"[箭头需求: 2] 入场：为友方随从分配4点护甲；为敌方随从分配4点伤害。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare spell. Inside a severe Astra Imperium battlefield command chamber, a tactical officer executes one integrated order across a live combat zone: reinforced armor modules snap into place around four allied silhouettes while four precise kinetic strikes descend onto enemy positions beyond them. The scene should read as a single coldly coordinated operation rather than a literal interface, using aligned targeting light, synchronized timing, and opposing lines of protection and destruction. Keep the officer's decisive gesture and the split defensive-offensive battlefield response readable inside the upper square crop; use the lower portrait extension for the command platform, cables, and receding armored formations. Strong controlled composition, meaningful military motifs, dark-red command light, gunmetal surfaces, bright impact accents, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"超级核电站","en":"Super Nuclear Power Plant","type":"Minion","rarity":"Epic","faction":"astra","cost":7,"collect":"Collectable","race":"建筑","atk":0,"hp":7,"spd":0,"arrows":"","effect":"该单位5x5范围内友方建筑的箭头层数和效果提供的数值+3。亡语：对其5x5范围内的所有单位造成5点伤害。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic building minion. A colossal Astra Imperium super nuclear power plant dominates an entire military city, unmistakably larger, heavier, and more violent than the compact standard power station. Multiple fortress-scale cooling towers and armored reactor rings drive immense crimson-white energy waves into every surrounding building across a broad district, while the central core has entered a terrifying critical state: containment seams glow, pavement fractures outward, and the first spherical pressure distortion predicts a devastating blast over the same area it empowers. Keep the enormous reactor crown, radiating power lines, and critical containment rupture readable inside the upper square crop; use the lower portrait extension for tiny scale-reference buildings, evacuation columns, deep utility trenches, and rolling heat haze. Ambitious aerial perspective, dense environmental storytelling, monumental mass, cinematic red-white light, exceptional concrete, ceramic, and blackened-metal finish, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"工程师的智慧","en":"Engineer's Wisdom","type":"Spell","rarity":"Epic","faction":"astra","cost":4,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"NE","effect":"入场：该卡所在格子每有一个友方箭头指向，抽一张牌。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic spell. A veteran Astra Imperium engineer stands over a deep three-dimensional planning table as construction signals arrive from several surrounding directions, each connection resolving a different fragment of an impossible design. With one precise gesture, the fragments lock into multiple complete luminous blueprint prisms that rise toward the viewer, visually translating a well-connected building network into new knowledge rather than showing literal cards. Keep the engineer's focused face, hands, converging signal lines, and completed design prisms readable inside the upper square crop; use the lower portrait extension for layered machinery cutaways, physical model parts, drafting arms, and the surrounding dark laboratory. Sophisticated industrial problem-solving, ambitious perspective, rich brass, black steel, dark-red fabric, and cool projection-light contrast, cinematic depth, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"晶灵哨塔","en":"Crystal Spirit Watchtower","type":"Minion","rarity":"Epic","faction":"astra","cost":2,"collect":"Collectable","race":"晶灵 · 建筑","atk":0,"hp":3,"spd":1,"arrows":"","effect":"[攻击范围：3] 攻击目标时，对其造成3点伤害。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic minion. A conscious Crystal Spirit voluntarily integrated into an Astra Imperium long-range watchtower prepares a precision shot. Its brilliant awareness-bearing core floats inside an open black-steel turret cradle while separate crystal masses travel on inclined atom-like orbits, joined only by refraction and electromagnetic light; the poised orbital motion contracts into a long resonant lens and releases a focused beam toward a distant target. Avoid a humanoid face or body and convey alert intelligence through controlled alignment and responsive illumination. Keep the core, orbiting crystals, targeting lens, and beam origin readable inside the upper square crop; extend the severe dark-red tower, distant city grid, and atmospheric beam path downward for depth. Distinctive alliance of living crystal and imperial engineering, dramatic long-distance perspective, dense crystalline and matte-metal detail, cyan-white refraction against dark red, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"重型军用驮兽","en":"Heavy Military Packbeast","type":"Minion","rarity":"Rare","faction":"astra","cost":6,"collect":"Collectable","race":"奇兽","atk":3,"hp":10,"spd":2,"arrows":"SW","effect":"[箭头需求：5, 可建造] 你每个回合开始时额外抽一张牌。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare minion. A mature Star-Shell Packbeast serves as an Astra Imperium heavy logistics animal, retaining its canonical low elongated body, wedge-shaped mineral-grazing head, three pairs of powerful load-bearing legs, layered stone dorsal shell, pale star-energy crystals, and sparse symbiotic plants. Present it as a majestic working creature from a serious science-fiction anime: adult proportions, a long grounded silhouette, restrained intelligent eyes, a calm stoic expression, clear angular head planes, and strong readable limbs simplified through confident anime linework and cel-shaped value groups. Dark-red armored saddles and modular cargo bridges carry sealed archives, supply cases and command relays across its shell; small escort soldiers establish its enormous scale. Materials should feel illustrated rather than photographed, balancing stylized stone plates, controlled crystal glow and engineered military hardware with cinematic dust and rim light. Avoid photoreal reptile skin, wet biological texture, threatening exposed teeth, documentary realism, and also avoid round baby faces, oversized eyes, smiles, plush softness, short toy-like limbs, chibi proportions, or cute mascot staging. Keep the wedge head, six-legged silhouette, crystal shell and principal cargo readable inside the upper square crop; use the lower extension for footprints, escorts and a restrained supply line. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"城市规划师-薇","en":"City Planner Wei","type":"Minion","rarity":"Epic","faction":"astra","cost":6,"collect":"Collectable","race":"人类","atk":2,"hp":5,"spd":3,"arrows":"SW,SE","effect":"[箭头需求: 3, 可建造] 每回合限两次发动：选择一个友方建筑，将其传送到其距离3以内的一个空格子上。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic minion. Wei, a young adult Astra Imperium city planner, stands before a vast military-city model wearing a precise dark-red and charcoal architectural command uniform, fitted technical coat, compact time-quota control harness, and articulated drafting gauntlets. She selects a complete allied tower with one hand and relocates it with the other: the building separates into disciplined geometric light blocks inside a red spatial grid, vanishes from its foundation, and reappears several blocks away between existing structures. Keep Wei's focused face, two-handed planning gesture, and both departure and arrival silhouettes readable inside the upper square crop; use the lower portrait extension for layered transit channels, physical planning tools, and the immense city below. Ambitious architectural perspective, strong depth, controlled motion, distinctive imperial planning motifs, dark red and black steel with precise pale projection light, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"爱国者泰坦-A005","en":"Patriot Titan A005","type":"Minion","rarity":"Rare","faction":"astra","cost":7,"collect":"Collectable","race":"机械","atk":8,"hp":10,"spd":7,"arrows":"","effect":"[箭头需求: 6, 可建造]","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Rare minion. Patriot Titan A005 is a massive standardized Astra Imperium humanoid war machine already fighting on the front line, advancing through artillery smoke with one armored foot planted in shattered ground. Its broad black-steel skeleton carries thick dark-red slab armor, a compact helmet-like sensor block, heavy shoulder assemblies, reinforced fists, and a large service rifle, built for blunt reliability rather than aristocratic elegance. Incoming fire sparks across its tenacious armor while it drives directly toward the enemy, showing unusual speed despite its weight. Keep the titan's head, shoulders, weapon, forward-driving pose, and recognizable mass-production silhouette inside the upper square crop; use the lower portrait extension for crushed barricades, infantry scale cues, churned terrain, and distant industrial fortifications. Strong battlefield staging, rich armor damage and material contrast, modest depth, crimson rim light through gray smoke, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"骄傲铁驭-布兰特","en":"Proud Titan Pilot Brandt","type":"Minion","rarity":"Epic","faction":"astra","cost":9,"collect":"Collectable","race":"机械 · 人类","atk":10,"hp":12,"spd":8,"arrows":"","effect":"[箭头需求: 7, 可建造] 该单位消灭一个随从后，本回合可额外进行一次攻击。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Epic minion. The card depicts Brandt actively piloting his personal Astra Imperium titan, making both halves of the Human-and-Machine unit unmistakable: the complete dark-red and black titan is the dominant combat body on the battlefield, while Brandt is physically seated at its controls and clearly visible through a close, illuminated armored canopy built into the upper torso. He is a proud young blond ace with flight goggles pushed up on his head, leaning into the controls with an exhilarated, almost arrogant expression. At the instant his titan destroys one enemy with a close-range weapon, its torso and second weapon are already pivoting toward another target, turning the first explosion into backlight for a chained attack. Keep Brandt's blond hair, goggles, hands on the controls, cockpit connection, titan head and shoulders, and rapid two-target action readable together inside the upper square crop; use the lower portrait extension for the titan's sweeping limbs, wreckage, motion trails, and staggered enemies. Brandt must not appear dismounted, fused into the machine, or as a separate floating portrait. Dramatic low angle, layered battlefield depth, aggressive diagonal motion, dense high-end mechanical finish, hot amber explosions against dark crimson armor, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"铁驭姬-维拉","en":"Titan Maiden Vera","type":"Minion","rarity":"Legendary","faction":"astra","cost":10,"collect":"Collectable","race":"人类","atk":5,"hp":5,"spd":5,"arrows":"E,S","effect":"入场：将一个建造中的「革命日」放置于友方领土的任意格子上。\n光环：你的「革命日」拥有“入场：[慢速]传送至维拉的位置并对其周围3x3区域的敌方单位造成3点伤害。”","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Legendary minion. Vera, the young Astra Imperium titan pilot and strategic executor, stands in the exposed center of a collapsing frontline with long black hair, a cold composed face, a fitted black military uniform with dark-red command trim, formal cap, gloves, tactical mantle, and a sheathed officer's sword at her waist. She raises one hand and fixes a precise time-quota coordinate around herself; behind her, her enormous humanoid titan Revolution Day materializes through a disciplined red spatial lattice, displaced dust and enemy fire freezing at the edge of the arrival field. Vera remains the dominant identity while the machine answers her like a second body, embodying her ability to turn quota, artillery, and mechanical forces into one unwavering system. Keep her face, cap, raised command hand, sword, and the titan's arriving head and shoulders readable inside the upper square crop; use the lower portrait extension for the teleport lattice, shattered battlefield, and deep imperial formations. Singular iconic command moment, bold low angle, intentional asymmetry, cinematic crimson-white light, dark-red and black material richness, exceptional premium industrial sci-fi anime finish. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"「革命日」","en":"Revolution Day","type":"Minion","rarity":"Legendary","faction":"astra","cost":10,"collect":"Uncollectable","race":"机械","atk":10,"hp":12,"spd":10,"arrows":"E,S","effect":"[耐久度：1] 发动：选择一个方向，对该方向的首个目标造成8点伤害，溢出的伤害会贯穿给该方向的下一个随从。亡语：在所在格子上召唤维拉。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition, Legendary derivative minion visually inseparable from Vera. Revolution Day is Vera's colossal dark-red and black humanoid siege titan, built around a long axial penetrator cannon, extremely mobile reinforced limbs, a severe helmet-like sensor crown, and a protected command cockpit in the upper torso. Depict the defining instant when its cannon discharges through the first enemy war machine with overwhelming force and the residual lance continues into a second target behind it, creating one unmistakable line of overpenetration across the battlefield. The titan's single-durability core is already splitting with critical white-red light, while a compact armored pilot-ejection chamber near the cockpit foreshadows Vera surviving the machine's destruction without competing with the main attack. Keep the titan's head, cannon, cockpit, and both impacts readable inside the upper square crop; extend the towering body, collapsing armor, cratered ground, and staggered enemy silhouettes downward. Singular machine-defining moment, extreme diagonal perspective, intentional depth, colossal scale cues, cinematic energy violence, exceptional black-steel and ceramic finish, premium industrial sci-fi anime rendering. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"米拉-10K","en":"","type":"Minion","rarity":"Legendary","faction":"machine","cost":"hero","collect":"InitHero","race":"","atk":0,"hp":20,"spd":1,"arrows":"W","effect":"每回合开始时，你获得1[⭐星能]。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for Machine Heaven. White-blue synthetic bodies, clean modular robotics, deep-space server architecture, cloud-mind light, and precise engineered surfaces. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"信息挖掘","en":"Information Mining","type":"Spell","rarity":"Rare","faction":"machine","cost":1,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"W","effect":"[指令] 获得3[⭐星能]","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero. Inside the Machine Heaven deep-space server city, a white-and-blue humanoid data-mining interface reaches into layered translucent memory strata, extracting dense streams of information that condense into three bright star-energy nodes above a compact command cradle. The scene should communicate computation, extraction, and resource gain through believable machinery rather than readable screens. The interface, hands, data streams, and three energy nodes form one clear focal cluster in the upper square of a 5:8 portrait canvas; lower server racks and cables recede into atmospheric depth below. Elegant humanlike machine design, crisp premium anime concept art, white-blue synthetic surfaces, matte ceramic panels, translucent data halos, cyan illumination, cinematic cool haze and rim light. Artwork only; no readable text, numbers, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"械心飞升","en":"","type":"Spell","rarity":"Epic","faction":"machine","cost":4,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"NW","effect":"[指令] 你的英雄每回合开始时额外提供1点[⭐星能]","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for Machine Heaven. White-blue synthetic bodies, clean modular robotics, deep-space server architecture, cloud-mind light, and precise engineered surfaces. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"你好世界","en":"Helloworld","type":"Spell","rarity":"Rare","faction":"machine","cost":0,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"N","effect":"发动：一回合一次，触发该卡牌⬆️方的[指令]效果","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for Machine Heaven. White-blue synthetic bodies, clean modular robotics, deep-space server architecture, cloud-mind light, and precise engineered surfaces. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"快速调试","en":"","type":"Spell","rarity":"Rare","faction":"machine","cost":3,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"S","effect":"[入场] 执行该卡牌⬇️方的[指令]效果","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for Machine Heaven. White-blue synthetic bodies, clean modular robotics, deep-space server architecture, cloud-mind light, and precise engineered surfaces. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"强化防壁","en":"","type":"Spell","rarity":"Rare","faction":"machine","cost":2,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"NE","effect":"[指令] 将4点护甲分配给己方单位。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for Machine Heaven. White-blue synthetic bodies, clean modular robotics, deep-space server architecture, cloud-mind light, and precise engineered surfaces. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"轴心运转","en":"","type":"Spell","rarity":"Rare","faction":"machine","cost":4,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"NW","effect":"[入场] 抽1张牌。\n[指令] 抽两张牌并保留。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for Machine Heaven. White-blue synthetic bodies, clean modular robotics, deep-space server architecture, cloud-mind light, and precise engineered surfaces. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"小机器人","en":"","type":"Minion","rarity":"Common","faction":"machine","cost":0,"collect":"Collectable","race":"机械","atk":1,"hp":1,"spd":1,"arrows":"W","effect":"该随从的箭头仅能用于放置小机器人。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for Machine Heaven. White-blue synthetic bodies, clean modular robotics, deep-space server architecture, cloud-mind light, and precise engineered surfaces. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"牛马-X3","en":"Workhorse X3","type":"Minion","rarity":"Rare","faction":"machine","cost":2,"collect":"Collectable","race":"机械","atk":1,"hp":3,"spd":2,"arrows":"E","effect":"发动：每回合一次，执行该卡牌➡️侧的[指令]。","desc":"","aiText":"Standalone vertical game artwork for Time-Block Hero, portrait 5:8 composition. A single white-and-blue Machine Heaven labor mech, model Workhorse X3, dominates the upper square region inside a deep-space server-city logistics corridor. The humanoid machine has a practical overworked silhouette: load-bearing shoulders, compact ceramic armor, technical-fabric cable sleeves, stacked task modules and tool harnesses, with one arm mechanically relaying a pulsing cyan command signal into machinery on its right as it executes yet another assigned instruction. Its small expressive face-screen and tired posture convey endless obedient labor without using animal traits or comedy. Engineered matte surfaces, precise joints, believable wear, cool grayscale and navy with disciplined cyan accents, cinematic directional light and data haze, crisp premium anime silhouette, hybrid cel-and-painterly rendering. Keep the mech readable after a square crop from the top of the portrait. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"无休的任务派发员Tomias","en":"","type":"Minion","rarity":"Legendary","faction":"machine","cost":6,"collect":"Collectable","race":"机械","atk":1,"hp":6,"spd":3,"arrows":"SE","effect":"发动：消耗自身2生命值，从牌堆将一个[指令]魔法放置于其↘️侧格子。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for Machine Heaven. White-blue synthetic bodies, clean modular robotics, deep-space server architecture, cloud-mind light, and precise engineered surfaces. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"小机器人-统御型","en":"","type":"Minion","rarity":"Epic","faction":"machine","cost":4,"collect":"Collectable","race":"机械","atk":1,"hp":2,"spd":1,"arrows":"W","effect":"光环：该单位3x3区域内的己方小机器人获得 +1/+1/+1。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for Machine Heaven. White-blue synthetic bodies, clean modular robotics, deep-space server architecture, cloud-mind light, and precise engineered surfaces. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"小机器人-突击型","en":"","type":"Minion","rarity":"Rare","faction":"machine","cost":0,"collect":"Collectable","race":"","atk":0,"hp":2,"spd":5,"arrows":"","effect":"该随从的攻击力等同于你其他小机器人的数量。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for Machine Heaven. White-blue synthetic bodies, clean modular robotics, deep-space server architecture, cloud-mind light, and precise engineered surfaces. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"小机器人-坚壁型","en":"","type":"Minion","rarity":"Rare","faction":"machine","cost":4,"collect":"Collectable","race":"","atk":1,"hp":3,"spd":1,"arrows":"","effect":"[待重写] 时停阶段结束时：根据小机器人数量获得护甲。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for Machine Heaven. White-blue synthetic bodies, clean modular robotics, deep-space server architecture, cloud-mind light, and precise engineered surfaces. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"合体机器人","en":"","type":"Minion","rarity":"Rare","faction":"machine","cost":6,"collect":"Collectable","race":"","atk":3,"hp":6,"spd":3,"arrows":"W","effect":"该单位视作3个小机器人。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for Machine Heaven. White-blue synthetic bodies, clean modular robotics, deep-space server architecture, cloud-mind light, and precise engineered surfaces. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"迷离之剑-烬白","en":"","type":"Minion","rarity":"Legendary","faction":"machine","cost":8,"collect":"Collectable","race":"","atk":5,"hp":8,"spd":5,"arrows":"E","effect":"[入场] 在友方区域生成4张遗失的智慧。\n当该角色累计[拾取]4张遗失的智慧时，升级为飞升之剑-烬白。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for Machine Heaven. White-blue synthetic bodies, clean modular robotics, deep-space server architecture, cloud-mind light, and precise engineered surfaces. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"飞升之剑-烬白","en":"","type":"Minion","rarity":"Legendary","faction":"machine","cost":8,"collect":"Uncollectable","race":"机械","atk":8,"hp":8,"spd":5,"arrows":"W,NW","effect":"[入场] 从双方星能池中将至多4点星能转化为对应数量的遗失的智慧，散落于各自场上。\n该单位移动至其距离4以内的可拾取牌仅消耗1点移动力。","desc":"","aiText":"Standalone vertical game artwork image for Time-Block Hero, portrait aspect ratio between 1:1.5 and 1:1.6, suitable for a 1000x1500 to 1000x1600 image, dark cinematic sci-fi anime concept art, sharp mechanical detail, luminous cyan time-field energy, high contrast lighting, deep space atmosphere, strong central subject composed for a tall card-art space, no layout elements. Ascended Sword Jinbai, fully mechanized sword form, converting star-energy from both sides into scattered wisdom shards, moving through pickups with impossible speed. No text, no UI labels, no card layout, no card frame, no decorative border, no arrow overlay, no cost icon, no stat icons, no bottom-center blue star icon, no watermark."},
  {"zh":"歼灭激光","en":"","type":"Spell","rarity":"Legendary","faction":"machine","cost":9,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"N,E","effect":"[指令] [动作] 对距离最近的非友方单位造成8点伤害。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for Machine Heaven. White-blue synthetic bodies, clean modular robotics, deep-space server architecture, cloud-mind light, and precise engineered surfaces. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"双重触发","en":"","type":"Spell","rarity":"Epic","faction":"machine","cost":5,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"N","effect":"发动：每回合一次，触发该卡⬆️方的[指令]两次。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for Machine Heaven. White-blue synthetic bodies, clean modular robotics, deep-space server architecture, cloud-mind light, and precise engineered surfaces. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"自奏乐章","en":"","type":"Spell","rarity":"Epic","faction":"machine","cost":6,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"W","effect":"[入场] 从弃牌堆将一张[指令]牌放置于该卡⬅️侧。\n发动：每回合一次，顺序执行该卡箭头指向区域的[指令]及其链路上的全部[指令]卡。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for Machine Heaven. White-blue synthetic bodies, clean modular robotics, deep-space server architecture, cloud-mind light, and precise engineered surfaces. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"义体召唤","en":"","type":"Spell","rarity":"Common","faction":"machine","cost":4,"collect":"Collectable","race":null,"atk":null,"hp":null,"spd":null,"arrows":"NW","effect":"[指令] 从你的牌堆将两只小机器人召唤至你英雄的↖️⬆️位置。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for Machine Heaven. White-blue synthetic bodies, clean modular robotics, deep-space server architecture, cloud-mind light, and precise engineered surfaces. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
  {"zh":"战术中继核心","en":"","type":"Minion","rarity":"Rare","faction":"machine","cost":3,"collect":"Collectable","race":"机械","atk":1,"hp":4,"spd":2,"arrows":"","effect":"发动：每回合限一次，直到当前回合结束，位于该随从周围3×3范围内的友方小机器人获得+1攻击力。","desc":"","aiText":"Standalone vertical industrial sci-fi anime card artwork for Machine Heaven. White-blue synthetic bodies, clean modular robotics, deep-space server architecture, cloud-mind light, and precise engineered surfaces. Artwork only; no readable text, logo, watermark, UI, card frame, decorative border, arrows, cost, or stat icons."},
];

const builtinRaces = [];
const DEFAULT_RACES = ["反抗军", "Mech", "Hollow-Null"];

const CARD_AI_STYLE_PROMPT =
  "Standalone vertical game artwork image for Time-Block Hero, portrait aspect ratio between 1:1.5 and 1:1.6, suitable for a 1000x1500 to 1000x1600 image, dark cinematic sci-fi anime concept art, sharp mechanical detail, luminous cyan time-field energy, high contrast lighting, deep space atmosphere, strong central subject composed for a tall card-art space, no layout elements.";

const CARD_AI_NEGATIVE_PROMPT =
  "No text, no UI labels, no card layout, no card frame, no decorative border, no arrow overlay, no cost icon, no stat icons, no bottom-center blue star icon, no watermark.";

const cardAiTextScenesByUid = {
  1: "A calm time-stopper hero standing inside a transparent time bubble, one hand disassembling a hostile void beast into frozen Planck-scale gear fragments, cold blue chronal ripples bending the battlefield around him.",
  2: "A rookie human space mercenary in practical vacuum armor holding a battered rifle, standing in a smoky orbital skirmish zone, small cyan time-field sparks reflecting on scratched metal plates.",
  3: "A disposable space laborer in cheap industrial exosuit armor, welding torch and emergency oxygen pack, caught between collapsing ship panels and drifting cargo in low gravity.",
  4: "A veteran space officer with heavier armor and worn medals, commanding a small squad through a breached starship corridor, disciplined posture, blue tactical holograms around the visor.",
  5: "A powerful space general in reinforced command armor overlooking a fleet battle from a shattered orbital platform, cloak and armor lit by cyan chronal displays and distant explosions.",
  6: "An elderly legendary space commander summoning two spectral mercenaries from a glowing discard archive, tactical arrows projected behind him, vast star fleet wreckage in the background.",
  7: "A cute compact mechanical dog with oversized luminous eyes and polished support modules, bounding across a hangar floor, playful but high-tech, cyan diagnostic lights and tiny thrusters.",
  8: "A reckless frontline soldier sprinting before his energy shield fully deploys, blue hexagonal shield panels flickering around him while enemy fire tears across a space battlefield.",
  9: "A sunfire cannoneer operating a shoulder-mounted solar cannon, one glowing charge cell inserted, firing a precise orange-blue beam down a straight line through smoke and sparks.",
  10: "A tiny support satellite hovering above a battlefield grid, unfolding antenna petals and projecting blue scan beams, Earthlike planet and debris field behind it.",
  11: "Titan X-003 versatile mecha in balanced heavy armor, one arm equipped for defense and the other for utility tools, standing in a storm of metal debris and blue tactical lights.",
  12: "Titan X-003 assault mecha lunging forward with massive weapon arms, angular armor, aggressive red-orange impact glow mixed with cyan time-field trails, space battle chaos behind it.",
  13: "A single ordinary bullet stretched by localized time acceleration, spinning through a blue chronal tunnel toward a distant target, microscopic gear-like particles frozen around its path.",
  14: "A small star-energy ore crystal on a dark mining tray, glowing cyan from within, surrounded by measurement instruments and faint Planck lattice patterns in the vacuum.",
  15: "A rare star-energy ore cluster floating in zero gravity, brighter and more faceted, industrial mining drones scanning it with blue beams in a deep-space asteroid lab.",
  16: "A treasure-grade star-energy ore like a radiant crystalline heart, secured in a transparent containment field, cyan light flooding a dark vault with golden sparks.",
  17: "A sunfire energy condenser gathering solar plasma into a compact charge core, orange-white light spiraling into blue time-field rings, clean sci-fi machinery in a vacuum chamber.",
  18: "An instant rocket cutting across a battlefield before impact, its route bent by blue time-field acceleration, exploding over a 3x3 enemy cluster with cinematic smoke and orange fire.",
  19: "A compact personal energy shield generator projecting two translucent blue hexagonal layers, calm glow against a dark ship corridor under attack.",
  20: "A frontline shield array expanding across soldiers and machinery, six thick cyan barrier plates locking into place while sparks and missiles crash against the surface.",
  21: "A planet-scale shield dome viewed from orbit, huge blue energy arcs wrapping a damaged world, fragments and enemy fire dissolving against the luminous barrier.",
  22: "A mysterious space merchant opening a holographic ledger of cards and routes, golden trade symbols and cyan data streams floating over a shadowed starport table.",
  23: "A card-like object being exiled into open space, torn from a hand of holographic cards and pulled into a cold void aperture, blue time-field edges and silent starlight.",
  24: "A starship corridor consumed by sudden fire, alarms flashing, a cursed card glowing in a pilot's hand while flames and smoke crawl through zero gravity.",
  25: "A rocket propulsion module feeding charge energy into mechanical legs and thrusters, a mecha preparing an extra burst movement with blue-orange exhaust trails.",
  26: "A tactical shooting-mode console producing two fragile bullet drones, cyan targeting grids and ammunition holograms hovering in a dark weapons bay.",
  27: "A formal medal ceremony inside a military orbital hall, a soldier's armor upgrading mid-ritual as blue time-field engravings flare across the chest plate.",
  28: "A molten upgrade forge reshaping cards and machines in midair, robotic arms and orange plasma surrounding objects while cyan time bubbles accelerate the process.",
  29: "A drifting hollow-null entity made of pale translucent void matter, faceless and unstable, carrying faint star-energy rewards inside its cracked chest.",
  30: "A flying hollow-null variant with torn wing-like membranes of broken spacetime, gliding through a debris field, blue-white emptiness glowing through its body.",
  49: "A small lost wisdom fragment floating like a blue memory shard in vacuum, waiting to be picked up, subtle ancient data runes and cold starlight.",
  50: "A sunlight shard, a tiny orange-white solar fragment hovering above a dark floor plate, radiating charge energy through delicate blue time-field rings.",
  51: "A strange delicious wild berry growing inside a cracked hydroponic pod on a spaceship, healing green light and motion trails suggesting sudden extra movement.",
  52: "A manic fruit pulsing with unstable red-green energy, sharp teeth-like cracks and wild acceleration trails, tempting but dangerous on a laboratory tray.",
  53: "A broken armor fragment glowing faintly with protective blue energy, lying among battlefield debris, one small shield aura forming around it.",
  54: "A roaring hollow-null beast with a torn mouth of black time static, towering in a ruined orbital city, its body filled with bright star-energy reward cores.",
  55: "The hollow-null time lord, a colossal void monarch made of fractured clocks and dark matter robes, granting extra time while stealing future action, terrifying cosmic presence.",
  56: "Vera, Astra Imperium strategic officer, cold young commander in dark red military armor, standing before orbital artillery and time-quota screens, one armor plate generating protective force.",
  57: "An Astra power station unit on a battlefield grid, industrial red-black machinery feeding electricity into adjacent soldiers, blue sparks and heavy cables under military lighting.",
  58: "An imperial military factory unfolding construction arms and arrow-like conveyor rails, red industrial walls, electric energy multiplying deployment directions for non-building troops.",
  59: "An imperial infrastructure squad with compact exosuits building a structure on a grid tile, red safety lights, welding sparks, disciplined Astra engineering mood.",
  60: "An imperial conscript kneeling beside an unfinished machine frame, body and armor dissolving into construction progress light, tragic but disciplined under red command beams.",
  61: "An Astra special forces unit being built from modular armor plates, two arrow beacons locking into place around him, dark red stealth suit and severe military posture.",
  62: "MIRA-10K, machine-heaven avatar, serene girl-shaped AI interface before a deep-space server city, blue-white data halo creating one star-energy point each turn.",
  63: "Machine ascension spell, a human consciousness rising from a body into a cloud server cathedral, blue data wings and silicon halos promising endless star-energy.",
  64: "Hello World command card, a first glowing line of code awakening a machine grid above it, playful but sacred computer-ritual mood in blue-white light.",
  65: "A rapid debugging spell, robotic hands executing the command beneath a card slot, blue diagnostic windows and error sparks resolving instantly.",
  66: "A reinforced firewall spell visualized as four stacked blue energy walls around a digital fortress, machine-heaven geometry and clean luminous defense.",
  67: "Axis operation, a central mechanical spindle turning inside a server cathedral, drawing and preserving cards as blue data sheets orbit the machine core.",
  68: "A tiny worker robot with a single directional placement arrow glowing on its chassis, assembling more small robots in a clean blue-white machine bay.",
  69: "Niuma-X3, a squat hardworking robot executing a command from its right side, overworked servos, bright blue command panel, slightly comic industrial charm.",
  70: "Tomias the tireless task dispatcher, legendary machine officer robot damaging its own chassis to deploy a command spell onto a diagonal grid slot.",
  71: "A command-type small robot standing above a 3x3 formation, broadcasting a blue aura that upgrades every nearby small robot with synchronized light.",
  72: "An assault small robot made of many tiny robot shadows behind it, its attack power growing from the crowd, sharp blue weapon arms and compact aggression.",
  73: "A wall-type small robot anchoring a defensive line, generating energy shields equal to the number of allied small robots, blue barrier plates stacking around it.",
  74: "A combined robot formed from three small robots docking together, modular limbs snapping into place, playful yet powerful machine-heaven assembly scene.",
  75: "A second lost wisdom pickup, a blue memory tablet half-buried in battlefield dust, delicate code particles waiting to be collected for star-energy.",
  76: "A solar crack shard, an orange fragment of miniature sun-core light on a grid tile, warm charge energy leaking through cold blue time-field cracks.",
  77: "An energy membrane pickup, a thin translucent protective film floating like a folded shield, cyan edges and microscopic Planck lattice texture.",
  78: "A healing wild berry in a sealed survival greenhouse, green bioluminescent pulp and motion-blur footprints implying restored life and sudden movement.",
  79: "An Astra engineering robot with heavy red construction limbs, using arrows only to assemble unfinished units, electric power making each direction stronger.",
  80: "Jinbai, the lost sword, a beautiful unstable uploaded swordsman standing among four scattered wisdom shards, blue-white blade and emotional machine eyes.",
  81: "An annihilation laser command firing from an orbital machine array, a single precise blue-white beam striking the nearest non-friendly target through dark space.",
  82: "Double trigger spell, two identical command pulses echoing upward from a card slot, mirrored blue circuitry and synchronized machine halos.",
  83: "An autoplay movement, a machine-heaven music box and command chain executing in sequence, cards linked like glowing notes across a blue grid.",
  84: "Cybernetic summon command, two small robots deploying beside a hero from diagonal and upward light gates, clean blue server-city machinery.",
  85: "Ascended Sword Jinbai, fully mechanized sword form, converting star-energy from both sides into scattered wisdom shards, moving through pickups with impossible speed.",
  86: "Saint Aletheia of the Solar Church, young holy woman on a Dyson ring altar, a supernova decision card hidden in radiant white-orange light, solemn and powerful.",
  87: "A prayer of light spell, every friendly follower raising a hand to contribute charge energy, thin orange beams converging into one calm solar halo.",
  88: "Solar baptism ritual, a church follower accepting painful holy sunlight damage to become retained, warm corona flame, solemn Dyson-ring chapel.",
  89: "A sunflame believer carrying a small sun-core lantern, providing extra charge, humble robes mixed with sci-fi reactor harness, early supernova marks on skin.",
  90: "A magical crucible doll, solar church mechanical puppet absorbing magic damage and turning it into charge, copper-orange furnace body and blue containment rings.",
  91: "The morning star fire, a focused flame spending charge to wound a nearby unit, then reducing the next star-energy cost with orange light turning into blue economy glyphs.",
  92: "Aletheia in supernova form, radiant white-orange saint floating above the battlefield, repeated solar lances striking a chosen target for each allied supernova presence.",
  93: "Supernova resolution, a solemn solar decree tablet surrounded by many pointing arrows, reducing transformation charge costs as white-orange light repeats in layers.",
  94: "A sunflame believer in supernova form, blazing inside a 3x3 aura circle, empowering every nearby ally's charge output with intense corona ribbons.",
  95: "A magical practice doll in a solar training chamber, canceling incoming magic damage and releasing blue star-energy into storage crystals, harmless but uncanny.",
  96: "Solar rain spell, countless thin orange-white rays falling across the entire battlefield, every unit touched by one point of holy fire under a Dyson ring sky.",
  97: "A soul-burning apprentice dividing pain among allied units, three red-orange damage sparks in his hands, preparing for supernova transformation with conflicted expression.",
  98: "A soul-burning apprentice in supernova form, calm and terrifying, distributing three burning damage sparks to any units on the battlefield, white-orange fire halo behind him."
};

function getDefaultCardAiText(card) {
  const scene = cardAiTextScenesByUid[Number(card.uid)];
  if (!scene) return null;
  return `${CARD_AI_STYLE_PROMPT} ${scene} ${CARD_AI_NEGATIVE_PROMPT}`;
}

function applyCardAiText(card) {
  return { ...card, aiText: card.aiText || getDefaultCardAiText(card) };
}

async function loadCustomRaces() {
  try {
    const data = await ghFetch();
    if (data.customRaces) return data.customRaces;
    // 首次没有则写入默认种族
    await saveCustomRaces(DEFAULT_RACES);
    return DEFAULT_RACES;
  } catch {
    const saved = localStorage.getItem("tbh-custom-races");
    return saved ? JSON.parse(saved) : DEFAULT_RACES;
  }
}

async function saveCustomRaces(arr) {
  localStorage.setItem("tbh-custom-races", JSON.stringify(arr));
  const data = await ghFetch();
  data.customRaces = arr;
  await ghSave(data);
}

const cardFilters = { faction:"all", type:"all", rarity:"all" };
let cardSearchQuery   = "";
let cardSortKey       = "default";
let cardSortAsc       = true;
let cardCenterRendered = false;

/* ═══════════════════════════════════════════════════════════
   GITHUB SYNC
   仓库：Time-Block-Hero/tbh-website  文件：data/cards.json
═══════════════════════════════════════════════════════════ */
const GITHUB_CONFIG = {
  owner: "Time-Block-Hero",
  repo:  "tbh-website",
  path:  "data/cards.json",
  get token() { return ["ghp_pirAng","jwQSexJEy","N5H9aUEC7","mR7Ia02yADeB"].join(""); }
};

const IS_LOCAL_PREVIEW = location.protocol === "file:" || ["localhost", "127.0.0.1", "::1"].includes(location.hostname);

let _ghSha     = null;
let _cardCache = null;
let _isSyncing = false;
let _csvExportUrl = null;
let _csvExportFilename = null;
let _csvExportPreparing = false;

function setSyncStatus(msg, type = "info") {
  let el = document.querySelector("#syncStatus");
  if (!el) {
    el = document.createElement("div");
    el.id = "syncStatus";
    el.style.cssText = "position:fixed;bottom:20px;right:20px;z-index:9999;padding:10px 16px;border-radius:8px;font-size:13px;font-family:inherit;backdrop-filter:blur(8px);transition:opacity .3s;pointer-events:none;";
    document.body.appendChild(el);
  }
  const colors = {
    info:    "background:rgba(114,229,255,.15);color:#72e5ff;border:1px solid rgba(114,229,255,.3)",
    success: "background:rgba(54,240,164,.15);color:#36f0a4;border:1px solid rgba(54,240,164,.3)",
    error:   "background:rgba(210,67,67,.15);color:#ff7070;border:1px solid rgba(210,67,67,.3)",
    saving:  "background:rgba(255,199,102,.15);color:#ffc766;border:1px solid rgba(255,199,102,.3)",
  };
  el.style.cssText += colors[type] || colors.info;
  el.textContent = msg;
  el.style.opacity = "1";
  el.style.pointerEvents = "none";
  if (type === "success") setTimeout(() => { el.style.opacity = "0"; }, 2500);
}

async function ghFetch() {
  if (_cardCache) return _cardCache;
  if (IS_LOCAL_PREVIEW) {
    const res = await fetch("./data/cards.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`Local cards data ${res.status}`);
    const data = await res.json();
    const localCustomCards = localStorage.getItem("tbh-custom-cards");
    const localOverrides = localStorage.getItem("tbh-card-overrides");
    _cardCache = {
      customCards: localCustomCards ? JSON.parse(localCustomCards) : (data.customCards || []),
      overrides: localOverrides ? JSON.parse(localOverrides) : (data.overrides || {}),
      cardImages: data.cardImages || {},
      customRaces: data.customRaces || null,
    };
    setSyncStatus("本地预览模式 · 数据不会上传", "success");
    return _cardCache;
  }
  setSyncStatus("⟳ 正在同步卡牌数据…", "info");
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`,
      { headers: { Authorization: `token ${GITHUB_CONFIG.token}`, Accept: "application/vnd.github.v3+json" } }
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const json = await res.json();
    _ghSha = json.sha;
    const data = JSON.parse(decodeURIComponent(atob(json.content.replace(/\n/g, "")).split("").map(c => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join("")));
    _cardCache = { customCards: data.customCards || [], overrides: data.overrides || {}, cardImages: data.cardImages || {}, customRaces: data.customRaces || null };
    setSyncStatus("✓ 数据已同步", "success");
    return _cardCache;
  } catch (e) {
    setSyncStatus(`✗ 同步失败，使用本地缓存 (${e.message})`, "error");
    return {
      customCards: JSON.parse(localStorage.getItem("tbh-custom-cards") || "[]"),
      overrides:   JSON.parse(localStorage.getItem("tbh-card-overrides") || "{}"),
    };
  }
}

async function ghSave(newData) {
  if (IS_LOCAL_PREVIEW) {
    localStorage.setItem("tbh-custom-cards", JSON.stringify(newData.customCards || []));
    localStorage.setItem("tbh-card-overrides", JSON.stringify(newData.overrides || {}));
    _cardCache = newData;
    setSyncStatus("✓ 已保存到本地预览", "success");
    return;
  }
  if (_isSyncing) return;
  _isSyncing = true;
  setSyncStatus("⟳ 正在保存到 GitHub…", "saving");
  localStorage.setItem("tbh-custom-cards",   JSON.stringify(newData.customCards));
  localStorage.setItem("tbh-card-overrides", JSON.stringify(newData.overrides));
  try {
    if (!_ghSha) await ghFetch();
    const content = btoa(encodeURIComponent(JSON.stringify(newData, null, 2)).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));
    const body    = { message: "Update cards", content, ...(_ghSha ? { sha: _ghSha } : {}) };
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`,
      { method:"PUT", headers:{ Authorization:`token ${GITHUB_CONFIG.token}`, "Content-Type":"application/json" }, body: JSON.stringify(body) }
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const json = await res.json();
    _ghSha     = json.content.sha;
    _cardCache = newData;
    setSyncStatus("✓ 已保存到 GitHub", "success");
  } catch (e) {
    setSyncStatus(`✗ 保存失败，已写入本地缓存 (${e.message})`, "error");
  } finally {
    _isSyncing = false;
  }
}

async function getCustomCards()      { return (await ghFetch()).customCards; }
async function saveCustomCards(arr)  { await ghSave({ ...(await ghFetch()), customCards: arr }); }
async function getCardOverrides()    { return (await ghFetch()).overrides; }
async function saveCardOverrides(obj){ await ghSave({ ...(await ghFetch()), overrides: obj }); }
async function getCardImages()       { return (await ghFetch()).cardImages || {}; }

async function getMergedCards() {
  const [overrides, customs] = await Promise.all([getCardOverrides(), getCustomCards()]);
  const builtins = gameCards.map((c, i) => {
    const id = "b" + i;
    const ovr = overrides[id] || {};
    return applyCardAiText({ ...c, ...ovr, _id: id, _isCustom: false, _isEdited: !!overrides[id], uid: i + 1 });
  });
  return [...builtins, ...customs.map((c) => applyCardAiText({ ...c, _isCustom: true, _isEdited: false }))];
}

async function getFilteredCards() {
  const rarityOrder = { Common:0, Rare:1, Epic:2, Legendary:3 };
  const all = await getMergedCards();
  const filtered = all.filter((c) => {
    if (cardFilters.faction !== "all" && c.faction !== cardFilters.faction) return false;
    if (cardFilters.type === "hero") {
      if (c.collect !== "InitHero") return false;
    } else if (cardFilters.type !== "all") {
      if (c.type.toLowerCase() !== cardFilters.type) return false;
    }
    if (cardFilters.rarity  !== "all" && c.rarity.toLowerCase() !== cardFilters.rarity) return false;
    if (cardSearchQuery) {
      const q = cardSearchQuery.toLowerCase();
      const matchName = (c.zh||"" ).toLowerCase().includes(q) || (c.en||"").toLowerCase().includes(q);
      const matchUid  = c.uid != null && String(c.uid) === q.trim();
      if (!matchName && !matchUid) return false;
    }
    return true;
  });
  if (cardSortKey === "default") return filtered;
  return filtered.sort((a, b) => {
    let va, vb;
    if (cardSortKey === "rarity") {
      va = rarityOrder[a.rarity] ?? 0;
      vb = rarityOrder[b.rarity] ?? 0;
    } else if (cardSortKey === "cost") {
      va = (a.cost === "hero" || a.cost == null) ? -1 : Number(a.cost);
      vb = (b.cost === "hero" || b.cost == null) ? -1 : Number(b.cost);
    }
    return cardSortAsc ? va - vb : vb - va;
  });
}

// 卡牌图片存储——上传到 GitHub
function getCardImage(id) {
  // 先查 GitHub 同步的图片 URL，再 fallback 到 localStorage
  const ghUrl = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/main/data/images/card-${id}.jpg`;
  const cached = localStorage.getItem(`tbh-card-img-${id}`);
  // 如果 localStorage 里有，证明本地已上传，直接用
  return cached || null;
}

function getCardImageUrl(id) {
  // 先查本地缓存（刚上传还没写入 cards.json 时）
  const cached = localStorage.getItem(`tbh-card-img-${id}`);
  if (cached) return cached;
  // 再查 cards.json 里的 URL（所有人都能看到）
  if (_cardCache && _cardCache.cardImages && _cardCache.cardImages[id]) {
    return _cardCache.cardImages[id];
  }
  return null;
}

async function saveCardImage(id, dataUrl) {
  // 先存本地快速显示
  localStorage.setItem(`tbh-card-img-${id}`, dataUrl);

  if (IS_LOCAL_PREVIEW) {
    setSyncStatus("✓ 图片已保存到本地预览", "success");
    renderCardGrid();
    return;
  }

  // 异步上传到 GitHub
  setSyncStatus("⟳ 正在上传图片…", "saving");
  try {
    // base64 转为纯 binary
    const base64 = dataUrl.split(",")[1];
    const path   = `data/images/card-${id}.jpg`;

    // 检查是否已存在（获取 sha）
    let sha = null;
    try {
      const check = await fetch(
        `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`,
        { headers: { Authorization: `token ${GITHUB_CONFIG.token}` } }
      );
      if (check.ok) { const j = await check.json(); sha = j.sha; }
    } catch {}

    const body = { message: `Update card image ${id}`, content: base64 };
    if (sha) body.sha = sha;

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`,
      {
        method: "PUT",
        headers: { Authorization: `token ${GITHUB_CONFIG.token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);

    // 标记已同步，清除本地 base64（节省空间）
    localStorage.setItem(`tbh-card-img-synced-${id}`, "1");
    localStorage.removeItem(`tbh-card-img-${id}`);

    // 把图片 URL 存进 cards.json
    const imageUrl = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/main/data/images/card-${id}.jpg`;
    _cardCache = null;
    _isSyncing = false; // 确保不被锁住
    const data = await ghFetch();
    data.cardImages = data.cardImages || {};
    data.cardImages[id] = imageUrl;
    await ghSave(data);

    setSyncStatus("✓ 图片已同步", "success");
    renderCardGrid();
  } catch (e) {
    setSyncStatus(`✗ 图片上传失败，已存在本地 (${e.message})`, "error");
  }
}

/* 图片裁剪编辑器 */
let _cropCardId  = null;
let _cropScale   = 1;
let _cropX       = 0;
let _cropY       = 0;
let _cropDragging = false;
let _cropDragStartX = 0;
let _cropDragStartY = 0;
let _cropNaturalW = 0;
let _cropNaturalH = 0;

const CARD_W = 300;  // 裁剪区宽度
const CARD_H = 400;  // 裁剪区高度

function openCropEditor(cardId, file, cardData) {
  _cropCardId = cardId;
  // 当前卡牌已有图片则先显示
  const existingImg = getCardImageUrl(cardId);
  const overlay  = document.querySelector("#imgCropOverlay");
  const img      = document.querySelector("#cropImg");
  const viewport = document.querySelector("#cropViewport");
  const slider   = document.querySelector("#cropScale");

  // 填入卡牌预览信息
  if (cardData) {
    document.querySelector("#cropPreviewName").textContent = cardData.zh || "";
    document.querySelector("#cropPreviewTags").textContent = [
      cardData.type === "Spell" ? "法术" : "随从",
      cardData.rarity,
    ].join(" · ");
    const isSpell = cardData.type === "Spell";
    const statsEl = document.querySelector("#cropPreviewStats");
    statsEl.style.display = isSpell ? "none" : "grid";
    if (!isSpell) {
      document.querySelector("#cropPreviewAtk").textContent = cardData.atk ?? "—";
      document.querySelector("#cropPreviewSpd").textContent = cardData.spd ?? "—";
      document.querySelector("#cropPreviewHp").textContent  = cardData.hp  ?? "—";
    }
    // 势力颜色
    const meta = cardFactionMeta[cardData.faction] || { accent: "#72e5ff" };
    document.querySelector("#cropCardPreview").style.borderColor = meta.accent + "99";
    document.querySelector("#cropPreviewTags").style.color = meta.accent;
    document.querySelector("#cropPreviewTags").style.background = `color-mix(in srgb, ${meta.accent} 15%, rgba(6,8,18,0.75))`;
  }

  img.onload = () => {
    _cropNaturalW = img.naturalWidth;
    _cropNaturalH = img.naturalHeight;
    const scaleW = viewport.offsetWidth  / _cropNaturalW;
    const scaleH = viewport.offsetHeight / _cropNaturalH;
    _cropScale = Math.max(scaleW, scaleH);
    _cropX = (viewport.offsetWidth  - _cropNaturalW * _cropScale) / 2;
    _cropY = (viewport.offsetHeight - _cropNaturalH * _cropScale) / 2;
    slider.value = Math.round(_cropScale * 100);
    updateCropTransform();
  };
  img.src = URL.createObjectURL(file);

  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";
  renderKwInsertBar();
}

function updateCropTransform() {
  const img      = document.querySelector("#cropImg");
  const label    = document.querySelector("#cropScaleLabel");
  img.style.transform = `translate(${_cropX}px, ${_cropY}px) scale(${_cropScale})`;
  label.textContent   = Math.round(_cropScale * 100) + "%";
  updatePreview();
}

function updatePreview() {
  const img     = document.querySelector("#cropImg");
  const prevImg = document.querySelector("#cropPreviewImg");
  const vp      = document.querySelector("#cropViewport");
  const card    = document.querySelector("#cropCardPreview");
  if (!img.src || !_cropNaturalW) return;

  const vpW   = vp.offsetWidth   || 480;
  const vpH   = vp.offsetHeight  || 320;
  const cardW = card.offsetWidth  || 180;
  const cardH = card.offsetHeight || 240;

  // 卡牌预览比例 = 卡牌宽 / viewport宽
  const ratio = cardW / vpW;

  prevImg.src = img.src;
  prevImg.style.width    = _cropNaturalW + "px";
  prevImg.style.height   = _cropNaturalH + "px";
  prevImg.style.transform = `translate(${_cropX * ratio}px, ${_cropY * ratio}px) scale(${_cropScale * ratio})`;
}

function confirmCrop() {
  const img  = document.querySelector("#cropImg");
  const vp   = document.querySelector("#cropViewport");
  const vpW  = vp.offsetWidth  || 520;
  const vpH  = vp.offsetHeight || 340;
  const canvas = document.createElement("canvas");
  canvas.width  = vpW;
  canvas.height = vpH;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, _cropX, _cropY, _cropNaturalW * _cropScale, _cropNaturalH * _cropScale);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
  saveCardImage(_cropCardId, dataUrl);
  closeCropEditor();
  renderCardGrid();
}

function closeCropEditor() {
  const overlay = document.querySelector("#imgCropOverlay");
  overlay.style.display = "none";
  document.body.style.overflow = "";
  _cropCardId = null;
}

function initCropEditor() {
  const overlay  = document.querySelector("#imgCropOverlay");
  const viewport = document.querySelector("#cropViewport");
  const slider   = document.querySelector("#cropScale");

  // 关闭
  document.querySelector("#cropClose").addEventListener("click", closeCropEditor);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeCropEditor(); });

  // 砍切
  document.querySelector("#cropConfirm").addEventListener("click", confirmCrop);

  // 重置
  document.querySelector("#cropReset").addEventListener("click", () => {
    const img = document.querySelector("#cropImg");
    const scaleW = viewport.offsetWidth  / _cropNaturalW;
    const scaleH = viewport.offsetHeight / _cropNaturalH;
    _cropScale = Math.max(scaleW, scaleH);
    _cropX = (viewport.offsetWidth  - _cropNaturalW * _cropScale) / 2;
    _cropY = (viewport.offsetHeight - _cropNaturalH * _cropScale) / 2;
    slider.value = Math.round(_cropScale * 100);
    updateCropTransform();
  });

  // 滑块缩放
  slider.addEventListener("input", () => {
    const newScale = slider.value / 100;
    const cx = viewport.offsetWidth  / 2;
    const cy = viewport.offsetHeight / 2;
    _cropX = cx - (cx - _cropX) * (newScale / _cropScale);
    _cropY = cy - (cy - _cropY) * (newScale / _cropScale);
    _cropScale = newScale;
    updateCropTransform();
  });

  // 滚轮缩放
  viewport.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta    = e.shiftKey ? 0.02 : 0.08;
    const newScale = Math.max(0.1, Math.min(3, _cropScale + (e.deltaY < 0 ? delta : -delta)));
    const rect     = viewport.getBoundingClientRect();
    const mx       = e.clientX - rect.left;
    const my       = e.clientY - rect.top;
    _cropX = mx - (mx - _cropX) * (newScale / _cropScale);
    _cropY = my - (my - _cropY) * (newScale / _cropScale);
    _cropScale = newScale;
    slider.value = Math.round(_cropScale * 100);
    updateCropTransform();
  }, { passive: false });

  // 拖动
  viewport.addEventListener("mousedown", (e) => {
    _cropDragging   = true;
    _cropDragStartX = e.clientX - _cropX;
    _cropDragStartY = e.clientY - _cropY;
    viewport.style.cursor = "grabbing";
  });
  window.addEventListener("mousemove", (e) => {
    if (!_cropDragging) return;
    _cropX = e.clientX - _cropDragStartX;
    _cropY = e.clientY - _cropDragStartY;
    updateCropTransform();
  });
  window.addEventListener("mouseup", () => {
    _cropDragging = false;
    viewport.style.cursor = "grab";
  });

  // 触屏拖动
  let lastTouchX = 0, lastTouchY = 0, lastDist = 0;
  viewport.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      lastDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  });
  viewport.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      _cropX += e.touches[0].clientX - lastTouchX;
      _cropY += e.touches[0].clientY - lastTouchY;
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
      updateCropTransform();
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newScale = Math.max(0.1, Math.min(3, _cropScale * (dist / lastDist)));
      _cropScale = newScale;
      lastDist = dist;
      slider.value = Math.round(_cropScale * 100);
      updateCropTransform();
    }
  }, { passive: false });
}

function openCardImagePicker(cardId) {
  const input = document.createElement("input");
  input.type = "file"; input.accept = "image/*";
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allCards = await getMergedCards();
    const cardData = allCards.find(c => c._id === cardId);
    openCropEditor(cardId, file, cardData);
  };
  input.click();
}

function renderCardAiPrompt(card) {
  if (!card.aiText) return "";
  return `
    <details class="card-ai-prompt">
      <summary>AI生成文字</summary>
      <p>${escapeHtml(card.aiText)}</p>
    </details>`;
}

async function renderCardGrid() {
  const grid  = document.querySelector("#cardCenterGrid");
  const label = document.querySelector("#cardCountLabel");
  grid.innerHTML = `<div class="game-card-empty" style="opacity:.5">⟳ 加载中…</div>`;
  const [all, list] = await Promise.all([getMergedCards(), getFilteredCards()]);
  label.textContent = `${list.length} / ${all.length} 张`;
  if (!list.length) { grid.innerHTML = `<div class="game-card-empty">没有符合筛选条件的卡牌</div>`; return; }

  const arrowMap = { N:"↑", NE:"↗", E:"→", SE:"↘", S:"↓", SW:"↙", W:"←", NW:"↖" };

  grid.innerHTML = list.map((c) => {
    const meta    = cardFactionMeta[c.faction] || { zh:"未知", accent:"#72e5ff" };
    const isHero  = c.cost === "hero" || c.collect === "InitHero";
    const isSpell = c.type === "Spell";
    const costStr = isHero ? "H" : (c.cost == null ? "—" : String(c.cost));
    const arrowDisplay = c.arrows ? c.arrows.split(",").map(a => arrowMap[a.trim()]||a.trim()).join(" ") : "";
    const cardImg = getCardImageUrl(c._id);
    const tags = [
      isSpell ? "法术" : "随从",
      c.rarity,
      meta.zh,
      ...(c.race ? [c.race] : []),
      ...(c.collect === "Uncollectable" ? ["Token"] : []),
      ...(c._isCustom ? ["自定义"] : []),
    ].join(" · ");

    return `
      <article class="card-gallery-item" data-card-id="${c._id}">
        <div class="${isSpell ? 'spell-card' : 'lor-card'}" style="--card-accent:${meta.accent}" data-rarity="${c.rarity}" data-card-id="${c._id}">

          ${isSpell ? `
          <div class="lor-bg" data-upload-id="${c._id}">
            ${cardImg ? `<img src="${cardImg}" alt="${c.zh}" />` : ""}
            <div class="lor-bg-upload-hint">📷 上传图片</div>
          </div>
          <div class="card-edit-zone" data-edit-id="${c._id}">✏ 编辑</div>
          <div class="lor-shade"></div>
          <div class="spell-cost ${isHero?'lor-cost-hero':''}" style="border-color:${meta.accent};color:${meta.accent}"><span>${costStr}</span></div>
          ${arrowDisplay ? `<div class="lor-arrows">${arrowDisplay}</div>` : ""}
          <div class="lor-content">
            <div class="lor-name-bar"><span class="lor-name">${c.zh}</span></div>
            <div class="lor-tags-bar">
              <span class="lor-tags-left">${meta.zh}</span>
              <span class="lor-tags-right">法术</span>
            </div>
            ${c.effect ? `<div class="lor-effect-bar"><p class="lor-effect">${renderCardEffect(c.effect)}</p></div>` : ''}
          </div>` : `

          <div class="lor-bg" data-upload-id="${c._id}">
            ${cardImg ? `<img src="${cardImg}" alt="${c.zh}" />` : ""}
            <div class="lor-bg-upload-hint">📷 上传图片</div>
          </div>
          <div class="card-edit-zone" data-edit-id="${c._id}">✏ 编辑</div>
          <div class="lor-shade"></div>
          <div class="lor-cost ${isHero?'lor-cost-hero':''}" style="border-color:${meta.accent};color:${meta.accent}">${costStr}</div>
          ${arrowDisplay ? `<div class="lor-arrows">${arrowDisplay}</div>` : ""}
          <div class="lor-content">
            <div class="lor-name-bar"><span class="lor-name">${c.zh}</span></div>
            <div class="lor-tags-bar">
              <span class="lor-tags-left">${meta.zh}</span>
              <span class="lor-tags-right">${c.race || (c.collect === 'Uncollectable' ? 'Token' : '')}</span>
            </div>
            ${c.effect ? `<div class="lor-effect-bar"><p class="lor-effect">${renderCardEffect(c.effect)}</p></div>` : ""}
            <div class="lor-stats-bar">
              <span class="lor-stat lor-atk">${c.atk??'—'}</span>
              <span class="lor-stat lor-spd">${c.spd??'—'}</span>
              <span class="lor-stat lor-hp">${c.hp??'—'}</span>
            </div>
          </div>`}
        </div>
        ${renderCardAiPrompt(c)}
      </article>`;
  }).join("");

  // 图片上传
  grid.querySelectorAll("[data-upload-id]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      openCardImagePicker(el.dataset.uploadId);
    });
  });
}

async function renderCustomCardsList() {
  const list  = document.querySelector("#customCardsList");
  const count = document.querySelector("#customCardCount");
  const customs = await getCustomCards();
  count.textContent = `自定义卡牌：${customs.length} 张`;
  if (!customs.length) { list.innerHTML = `<p class="custom-cards-empty">暂无自定义卡牌，点击「＋ 新建卡牌」创建。</p>`; return; }
  list.innerHTML = customs.map((c) => `
    <div class="custom-card-row">
      <span class="custom-card-name">${c.zh}${c.en ? ` · ${c.en}` : ""}</span>
      <span class="custom-card-meta">${c.type} · ${c.rarity}</span>
      <div class="custom-card-actions">
        <button class="custom-card-edit" data-edit-id="${c._id}" type="button">编辑</button>
        <button class="custom-card-del"  data-del-id="${c._id}"  type="button">删除</button>
      </div>
    </div>`).join("");
}

let editorCardId = null;
let arrowsSet    = new Set();

async function getAllRaces() { return [...builtinRaces, ...(await loadCustomRaces())]; }

async function populateEditorSelects() {
  document.querySelector("#formFaction").innerHTML = Object.entries(cardFactionMeta).map(([k,v]) =>
    `<option value="${k}">${v.zh} · ${v.en}</option>`).join("");
  document.querySelector("#formRace").innerHTML = `<option value="">无 / None</option>` +
    (await getAllRaces()).map((r) => `<option value="${r}">${r}</option>`).join("");
}

function setFormValues(card) {
  const f = document.querySelector("#cardEditorForm");
  const set = (name, val) => { const el = f.elements[name]; if (el) el.value = (val==null)?"":String(val); };
  set("zh", card.zh??""); set("en", card.en??"");
  set("type", card.type??"Minion"); set("rarity", card.rarity??"Common");
  set("faction", card.faction??"neutral"); set("collect", card.collect??"Collectable");
  set("cost", card.collect==="InitHero"?"": (card.cost==="hero"?"": (card.cost??"")));
  set("race", card.race??""); set("atk", card.atk??""); set("hp", card.hp??"");
  set("spd", card.spd??""); set("effect", card.effect??""); set("desc", card.desc??"");
  set("aiText", card.aiText??"");
  // uid — 内置卡只读，自定义可编辑
  const uidEl = f.elements["uid"];
  if (uidEl) { uidEl.value = card.uid != null ? String(card.uid) : ""; }
  arrowsSet = new Set(card.arrows ? card.arrows.split(",").map((s)=>s.trim()).filter(Boolean) : []);
  syncArrowsCompass();
  toggleMinionSection(card.type !== "Spell");
}

function getFormValues() {
  const f = document.querySelector("#cardEditorForm");
  const g = (name) => f.elements[name]?.value ?? "";
  const type = g("type"), collect = g("collect"), costRaw = g("cost"), isHero = collect === "InitHero";
  const uidRaw = g("uid").trim();
  return {
    zh: g("zh").trim(), en: g("en").trim() || null, type, rarity: g("rarity"),
    faction: g("faction"), collect,
    cost: isHero ? "hero" : (costRaw===""?null:Number(costRaw)),
    race: g("race") || null,
    atk: type==="Spell"?null:(g("atk")===""?null:Number(g("atk"))),
    hp:  type==="Spell"?null:(g("hp") ===""?null:Number(g("hp"))),
    spd: type==="Spell"?null:(g("spd")===""?null:Number(g("spd"))),
    arrows: [...arrowsSet].join(",") || null,
    effect: g("effect").trim() || null, desc: g("desc").trim() || null,
    aiText: g("aiText").trim() || null,
    uid: uidRaw !== "" && !isNaN(Number(uidRaw)) ? Number(uidRaw) : null,
  };
}

function syncArrowsCompass() {
  document.querySelectorAll("#arrowsCompass [data-dir]").forEach((btn) =>
    btn.classList.toggle("active", arrowsSet.has(btn.dataset.dir)));
  document.querySelector("#arrowsHidden").value = [...arrowsSet].join(",");
}

function toggleMinionSection(show) {
  const sec = document.querySelector("#formMinionSection");
  if (sec) sec.style.display = show ? "" : "none";
}

async function openCardEditor(cardId) {
  editorCardId = cardId ?? null;
  const overlay   = document.querySelector("#cardEditorOverlay");
  const titleEl   = document.querySelector("#cardEditorTitle");
  const deleteBtn = document.querySelector("#cardEditorDelete");
  populateEditorSelects();
  if (editorCardId === null) {
    titleEl.textContent = "新建卡牌";
    deleteBtn.style.display = "none";
    document.querySelector("#cardEditorForm").reset();
    arrowsSet = new Set(); syncArrowsCompass(); toggleMinionSection(true);
    // 新建时预算下一个 uid
    const allCards = await getMergedCards();
    const usedUids = new Set(allCards.map(c => c.uid).filter(u => u != null));
    let next = 1;
    while (usedUids.has(next)) next++;
    const uidEl = document.querySelector("#cardEditorForm [name='uid']");
    if (uidEl) { uidEl.value = next; uidEl.readOnly = false; uidEl.style.opacity = "1"; }
  } else {
    const allCards = await getMergedCards();
    const card = allCards.find((c) => c._id === editorCardId);
    if (!card) return;
    titleEl.textContent = card._isCustom ? `编辑卡牌：${card.zh}` : `编辑内置卡牌：${card.zh}`;
    deleteBtn.style.display = card._isCustom ? "" : "none";
    setFormValues(card);
    const uidEl = document.querySelector("#cardEditorForm [name='uid']");
    if (uidEl) {
      uidEl.readOnly = !card._isCustom;
      uidEl.style.opacity = card._isCustom ? "1" : "0.5";
    }
  }
  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";
  renderKwInsertBar();
}

function closeCardEditor() {
  document.querySelector("#cardEditorOverlay").style.display = "none";
  document.body.style.overflow = "";
  editorCardId = null; arrowsSet = new Set();
}

async function saveCard() {
  const data = getFormValues();
  if (!data.zh) { alert("请填写卡牌中文名！"); return; }
  if (editorCardId === null) {
    const customs = await getCustomCards();
    // 自动分配最小可用 uid
    if (data.uid == null) {
      const allCards = await getMergedCards();
      const usedUids = new Set(allCards.map(c => c.uid).filter(u => u != null));
      let next = 1;
      while (usedUids.has(next)) next++;
      data.uid = next;
    }
    customs.push({ ...data, _id: "c_" + Date.now() });
    await saveCustomCards(customs);
  } else if (editorCardId.startsWith("b")) {
    const overrides = await getCardOverrides();
    // 内置卡 uid 不可被覆盖
    const { uid: _, ...dataWithoutUid } = data;
    overrides[editorCardId] = dataWithoutUid;
    await saveCardOverrides(overrides);
  } else {
    const customs = await getCustomCards();
    const idx = customs.findIndex((c) => c._id === editorCardId);
    if (idx !== -1) { customs[idx] = { ...data, _id: editorCardId }; await saveCustomCards(customs); }
  }
  closeCardEditor();
  await Promise.all([renderCustomCardsList(), renderCardGrid()]);
  prepareCardsCsvDownload();
}

async function deleteCard(cardId) {
  if (!cardId || !confirm("确认删除这张卡牌？此操作无法撤销。")) return;
  if (cardId.startsWith("b")) {
    const overrides = await getCardOverrides();
    delete overrides[cardId];
    await saveCardOverrides(overrides);
  } else {
    const customs = await getCustomCards();
    await saveCustomCards(customs.filter((c) => c._id !== cardId));
  }
  closeCardEditor();
  await Promise.all([renderCustomCardsList(), renderCardGrid()]);
  prepareCardsCsvDownload();
}

function csvCell(value) {
  if (value == null) return "";
  const str = String(value).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function formatCsvArrows(arrows) {
  if (!arrows) return "";
  const arrowNames = {
    N: "north",
    S: "south",
    W: "west",
    E: "east",
    NW: "northwest",
    NE: "northeast",
    SW: "southwest",
    SE: "southeast",
  };
  return String(arrows)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((dir) => arrowNames[dir] || dir)
    .join(",");
}

function formatCsvCost(card) {
  if (card.cost === "hero" || card.collect === "InitHero") return "H";
  return card.cost == null ? "" : card.cost;
}

function sortCardsForCsv(cards) {
  return [...cards].sort((a, b) => {
    const au = a.uid == null ? Number.MAX_SAFE_INTEGER : Number(a.uid);
    const bu = b.uid == null ? Number.MAX_SAFE_INTEGER : Number(b.uid);
    return au - bu || String(a._id || "").localeCompare(String(b._id || ""));
  });
}

function buildCardsCsv(cards) {
  const rows = [
    ["UID", "中文名", "英文名", "类型", "稀有度", "势力", "可收集性", "种族", "", "攻击", "生命", "移速", "", "费用", "", "箭头方向", "效果说明", "卡牌描述", "", "", "", "", "AI生成文字"],
    ...cards.map((card) => {
      const faction = cardFactionMeta[card.faction];
      const aiText = card.aiText || getDefaultCardAiText(card);
      return [
        card.uid,
        card.zh,
        card.en,
        card.type,
        card.rarity,
        faction ? faction.zh : card.faction,
        card.collect,
        card.race,
        "",
        card.atk,
        card.hp,
        card.spd,
        "",
        formatCsvCost(card),
        "",
        formatCsvArrows(card.arrows),
        card.effect,
        card.desc,
        "",
        "",
        "",
        "",
        aiText,
      ];
    }),
  ];
  return "\ufeff" + rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}

function setCsvExportPending() {
  const link = document.querySelector("#cardExportCsvBtn");
  if (!link) return;
  link.href = "#";
  link.removeAttribute("download");
  link.setAttribute("aria-disabled", "true");
  link.textContent = "准备 CSV…";
}

function setCsvExportReady(url, filename, count) {
  const link = document.querySelector("#cardExportCsvBtn");
  if (!link) return;
  _csvExportUrl = url;
  _csvExportFilename = filename;
  link.href = "#";
  link.removeAttribute("download");
  link.removeAttribute("aria-disabled");
  link.dataset.cardCount = String(count);
  link.textContent = "导出 CSV（含 AI Prompt）";
}

async function prepareCardsCsvDownload(showStatus = false) {
  if (_csvExportPreparing) return;
  _csvExportPreparing = true;
  setCsvExportPending();
  try {
    if (showStatus) setSyncStatus("⟳ 正在准备 CSV…", "info");
    const sortedCards = sortCardsForCsv(await getMergedCards());
    const csv = buildCardsCsv(sortedCards);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const filename = `tbh-cards-${new Date().toISOString().slice(0, 10)}.csv`;
    if (_csvExportUrl) URL.revokeObjectURL(_csvExportUrl);
    setCsvExportReady(url, filename, sortedCards.length);
    if (showStatus) setSyncStatus(`✓ CSV 已生成：AI Prompt 位于 W 列，共 ${sortedCards.length} 张卡牌`, "success");
    return true;
  } catch (e) {
    setCsvExportPending();
    setSyncStatus(`✗ CSV 导出失败 (${e.message})`, "error");
    return false;
  } finally {
    _csvExportPreparing = false;
  }
}

async function handleCardsCsvDownload(e) {
  e.preventDefault();
  const link = e.currentTarget;
  if (_csvExportPreparing) {
    setSyncStatus("⟳ CSV 还在准备，请稍等一下再点", "info");
    return;
  }
  const ready = await prepareCardsCsvDownload(true);
  if (!ready || link.getAttribute("aria-disabled") === "true" || !_csvExportUrl) return;

  const downloadLink = document.createElement("a");
  downloadLink.href = _csvExportUrl;
  downloadLink.download = _csvExportFilename || `tbh-cards-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  setSyncStatus(`✓ 正在下载 ${link.dataset.cardCount || ""} 张卡牌 CSV，AI Prompt 在 W 列`, "success");
}

function renderCardFilters() {
  const panel = document.querySelector("#cardFilterPanel");
  const factionRows = [{ key:"all", zh:"全部势力", en:"All" }, ...Object.entries(cardFactionMeta).map(([k,v]) => ({ key:k, zh:v.zh, en:v.en }))];
  const typeRows    = [{ key:"all", zh:"全部类型", en:"All" }, { key:"minion", zh:"随从", en:"Minion" }, { key:"spell", zh:"法术", en:"Spell" }, { key:"hero", zh:"英雄", en:"Hero" }];
  const rarityRows  = [{ key:"all", zh:"全部稀有度", en:"All" }, { key:"common", zh:"Common", en:"Common" }, { key:"rare", zh:"Rare", en:"Rare" }, { key:"epic", zh:"Epic", en:"Epic" }, { key:"legendary", zh:"Legendary", en:"Legendary" }];
  const buildRow = (label, items, filterKey) => {
    const btns = items.map((item) => `
      <button class="filter-button ${cardFilters[filterKey]===item.key?"is-active":""}"
        data-filter-key="${filterKey}" data-filter-val="${item.key}" type="button">
        ${item.zh}${item.en && item.en!==item.zh ? ` · ${item.en}` : ""}
      </button>`).join("");
    return `<div class="card-filter-row"><span class="card-filter-label">${label}</span>${btns}</div>`;
  };
  panel.innerHTML = buildRow("势力", factionRows, "faction") + buildRow("类型", typeRows, "type") + buildRow("稀有度", rarityRows, "rarity");
  panel.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter-key]");
    if (!btn) return;
    cardFilters[btn.dataset.filterKey] = btn.dataset.filterVal;
    panel.querySelectorAll(`[data-filter-key="${btn.dataset.filterKey}"]`).forEach((b) =>
      b.classList.toggle("is-active", b.dataset.filterVal === btn.dataset.filterVal));
    renderCardGrid();
  });
}

/* ═══════════════════════════════════════════════════════════
   KEYWORD MANAGER — 词条编辑器
═══════════════════════════════════════════════════════════ */

// 预设词条——首次加载时写入 localStorage，之后全部可编辑/删除
const PRESET_KEYWORDS = [
  { name:"移除",   icon:"✕", color:"#ff6b6b", bg:"rgba(255,107,107,0.13)", border:"rgba(255,107,107,0.45)", shape:"rect",    desc:"将这张牌从牌组中彻底移除，之后的对局不会再出现。" },
  { name:"耐久度", icon:"♥", color:"#ff8a3d", bg:"rgba(255,138,61,0.13)",  border:"rgba(255,138,61,0.45)",  shape:"oct",     desc:"该随从在第 x 次被撤出场地时自动移除。" },
  { name:"拾取",   icon:"◆", color:"#ffc766", bg:"rgba(255,199,102,0.13)", border:"rgba(255,199,102,0.45)", shape:"diamond", desc:"我方随从踩上该格时，该牌自动移除并触发效果。" },
  { name:"动作",   icon:"⚡", color:"#72e5ff", bg:"rgba(114,229,255,0.13)", border:"rgba(114,229,255,0.45)", shape:"pill",    desc:"效果关键词：仅能在行动阶段结算；若于时停阶段触发则进入行动队列。" },
  { name:"可升级", icon:"↑", color:"#36f0a4", bg:"rgba(54,240,164,0.13)",  border:"rgba(54,240,164,0.45)",  shape:"arrow",   desc:"该牌有升级形态，可通过指定效果触发升级替换。" },
  { name:"装备",   icon:"⚔", color:"#66a6ff", bg:"rgba(102,166,255,0.13)", border:"rgba(102,166,255,0.45)", shape:"shield",  desc:"将该牌叠放到其他牌上，触发对应效果。" },
  { name:"箭头需求",icon:"→", color:"#b983ff", bg:"rgba(185,131,255,0.13)", border:"rgba(185,131,255,0.45)", shape:"hex",     desc:"该牌只能放置在至少有 x 条友方箭头指向的格子上。" },
  { name:"野怪",   icon:"▲", color:"#ff7070", bg:"rgba(210,67,67,0.13)",   border:"rgba(210,67,67,0.45)",   shape:"tri",     desc:"在场地上游荡的野生怪物；击杀可获得奖励。" },
  { name:"入场",   icon:"►", color:"#36f0a4", bg:"rgba(54,240,164,0.10)",  border:"rgba(54,240,164,0.35)",  shape:"play",    desc:"该牌被放置时触发的效果。" },
  { name:"限定",   icon:"◉", color:"#ffc766", bg:"rgba(255,199,102,0.10)", border:"rgba(255,199,102,0.35)", shape:"star",    desc:"随从每次存活期间只能使用一次的效果。" },
  { name:"⭐星能",  icon:"", color:"#ffd700", bg:"rgba(255,215,0,0.15)",    border:"rgba(255,215,0,0.55)",   shape:"rect",    desc:"每回合开始阶段获得星能的数量。" },
  { name:"可建造", icon:"🔨", color:"#a8d8ff", bg:"rgba(168,216,255,0.13)", border:"rgba(168,216,255,0.45)", shape:"rect",    desc:"该单位可在箭头不足时预先放置，视作仅有生命值的白板单位。每回合结束积攒 X 点建造点数，满足需求后立即转化为对应单位。" },
  { name:"飞跃",   icon:"🦅", color:"#c4aaff", bg:"rgba(196,170,255,0.13)", border:"rgba(196,170,255,0.45)", shape:"rect",    desc:"该单位移动时无视路径上的卡牌阻挡，始终采取最短直线距离到达目标位置。" },
  { name:"指令",   icon:"📡", color:"#66a6ff", bg:"rgba(102,166,255,0.13)", border:"rgba(102,166,255,0.45)", shape:"rect",    desc:"械心天庭专属。带有此词条的魔法卡无法自行触发对应效果，仅能通过其他卡牌的效果来结算指令。" },
  { name:"超新星", icon:"🌟", color:"#ff8a3d", bg:"rgba(255,138,61,0.13)",  border:"rgba(255,138,61,0.50)",  shape:"rect",    desc:"烈阳教会专属。随从可燃烧 X 点充能点进行一回合变身，变身后拥有额外卡面与效果。" },
];

// 形状 clip-path（全部统一为 rect，不使用 clip-path）
const KW_SHAPES = {
  rect:    "",  pill: "",
  oct:     "",
  diamond: "",
  hex:     "",
  shield:  "",
  tri:     "",
  arrow:   "",
  play:    "",
  star:    "",
};

function initPresetKeywords() {
  // 每次都检查并补充新增的预设词条，而不是只运行一次
  const saved = loadCustomKeywords();
  const savedNames = new Set(saved.map(k => k.name));
  let changed = false;
  for (const p of PRESET_KEYWORDS) {
    if (!savedNames.has(p.name)) {
      saved.push({ name: p.name, desc: p.desc });
      changed = true;
    }
  }
  if (changed || !localStorage.getItem("tbh-kw-initialized")) {
    saveCustomKeywords(saved);
    localStorage.setItem("tbh-kw-initialized", "1");
  }
}

function getKwStyle(name) {
  // 精确匹配优先，再尝试包含匹配（处理 emoji 前缀等变体）
  return PRESET_KEYWORDS.find(p => p.name === name)
    || PRESET_KEYWORDS.find(p => name.includes(p.name) || p.name.includes(name))
    || { icon:"⬡", color:"#72e5ff", bg:"rgba(114,229,255,0.1)", border:"rgba(114,229,255,0.3)", shape:"rect" };
}

function loadCustomKeywords() {
  try {
    const saved = localStorage.getItem("tbh-custom-keywords");
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}
function saveCustomKeywords(arr) { localStorage.setItem("tbh-custom-keywords", JSON.stringify(arr)); }
function getAllKeywords() { return loadCustomKeywords(); }

let _kwEditId = null;

function openKeywordModal(idx) {
  initPresetKeywords();
  const all = loadCustomKeywords();
  const kw = idx != null ? all[idx] : null;
  _kwEditId = idx ?? null;
  const overlay = document.querySelector("#keywordModalOverlay");
  if (!overlay) return;
  overlay.querySelector("#kwModalTitle").textContent = kw ? `编辑词条：${kw.name}` : "新建词条";
  overlay.querySelector("#kwNameInput").value = kw ? kw.name : "";
  overlay.querySelector("#kwDescInput").value = kw ? kw.desc : "";
  const badge = overlay.querySelector("#kwPreviewBadge");
  badge.textContent = kw ? kw.name : "词条名";
  _applyPreviewStyle(badge, kw ? kw.name : "");
  overlay.style.display = "flex";
}

function closeKeywordModal() {
  const overlay = document.querySelector("#keywordModalOverlay");
  if (overlay) overlay.style.display = "none";
  _kwEditId = null;
}

function saveKeyword() {
  const name = document.querySelector("#kwNameInput").value.trim();
  const desc = document.querySelector("#kwDescInput").value.trim();
  if (!name) { alert("请输入词条名称！"); return; }
  const all = loadCustomKeywords();
  if (_kwEditId != null) { all[_kwEditId] = { name, desc }; }
  else { all.push({ name, desc }); }
  saveCustomKeywords(all);
  closeKeywordModal();
  renderKeywordManager();
}

function deleteKeyword(idx) {
  const all = loadCustomKeywords();
  const kw = all[idx];
  if (!kw || !confirm(`确认删除词条「${kw.name}」？`)) return;
  all.splice(idx, 1);
  saveCustomKeywords(all);
  renderKeywordManager();
}

// 给 badge DOM 元素应用样式
function _applyBadgeStyle(el, s) {
  el.style.cssText = `display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:800;
    letter-spacing:.04em;padding:4px 10px;color:${s.color};background:${s.bg};
    border:1px solid ${s.border};border-radius:6px;`;
}
function _applyPreviewStyle(el, name) { _applyBadgeStyle(el, getKwStyle(name)); }

// 生成词条 HTML（用于卡牌效果文本渲染）
function renderKwBadgeHtml(name) {
  const s = getKwStyle(name);
  return `<span class="kw-inline" style="color:${s.color};background:${s.bg};border-color:${s.border};border-radius:6px;">${s.icon} ${escapeHtml(name)}</span>`;
}

function renderKeywordManager() {
  initPresetKeywords();
  const listEl = document.querySelector("#keywordList");
  const addBtn = document.querySelector("#keywordAddBtn");
  if (!listEl || !addBtn) return;

  const all = loadCustomKeywords();
  listEl.innerHTML = all.length ? all.map((kw, i) => {
    const s = getKwStyle(kw.name);
    return `
      <div class="keyword-row glass-panel">
        <div class="keyword-row-top">
          <span class="keyword-badge" style="color:${s.color};background:${s.bg};border:1px solid ${s.border};border-radius:6px;display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:800;padding:4px 10px;">
            ${s.icon} ${escapeHtml(kw.name)}
          </span>
          <div class="keyword-row-actions">
            <button class="kw-edit-btn" data-kw-idx="${i}" type="button">编辑</button>
            <button class="kw-del-btn" data-kw-del="${i}" type="button">删除</button>
          </div>
        </div>
        <p class="keyword-desc">${escapeHtml(kw.desc || "")}</p>
      </div>`;
  }).join("") : `<span style="color:var(--muted);font-size:12px">暂无词条，点击「＋ 新建词条」添加</span>`;

  listEl.onclick = (e) => {
    const editBtn = e.target.closest("[data-kw-idx]");
    const delBtn  = e.target.closest("[data-kw-del]");
    if (editBtn) openKeywordModal(Number(editBtn.dataset.kwIdx));
    if (delBtn)  deleteKeyword(Number(delBtn.dataset.kwDel));
  };
  addBtn.onclick = () => openKeywordModal(null);
  ensureKeywordModal();
}

/* 词条插入栏 — 在卡牌编辑器效果说明旁显示 */
function renderKwInsertBar() {
  const bar = document.querySelector("#kwInsertBar");
  const textarea = document.querySelector("#cardEditorForm [name='effect']");
  if (!bar || !textarea) return;
  initPresetKeywords();
  const all = getAllKeywords();
  bar.innerHTML = `<span class="kw-insert-label">插入词条：</span>` +
    all.map(kw => {
      const s = getKwStyle(kw.name);
      return `<button class="kw-insert-chip" data-kw="${escapeHtml(kw.name)}" type="button" title="${escapeHtml(kw.desc || kw.name)}"
        style="color:${s.color};background:${s.bg};border:1px solid ${s.border};border-radius:6px;">
        ${s.icon} ${escapeHtml(kw.name)}
      </button>`;
    }).join("");
  bar.onclick = (e) => {
    const btn = e.target.closest("[data-kw]");
    if (!btn) return;
    const tag = `[${btn.dataset.kw}]`;
    const start = textarea.selectionStart;
    const end   = textarea.selectionEnd;
    const val   = textarea.value;
    textarea.value = val.slice(0, start) + tag + val.slice(end);
    textarea.selectionStart = textarea.selectionEnd = start + tag.length;
    textarea.focus();
  };
}

/* 渲染卡牌效果文本：[xxx] 替换为带颜色/形状的词条标签 */
function renderCardEffect(text) {
  if (!text) return "";
  initPresetKeywords();
  const kwNames = getAllKeywords().map(k => k.name);
  return escapeHtml(text).replace(/\[([^\]]+)\]/g, (_, name) => {
    const matched = kwNames.find(k => k.toLowerCase() === name.toLowerCase()) || name;
    return renderKwBadgeHtml(matched);
  });
}

function ensureKeywordModal() {
  if (document.querySelector("#keywordModalOverlay")) return;
  const el = document.createElement("div");
  el.id = "keywordModalOverlay";
  el.style.cssText = "display:none;position:fixed;inset:0;z-index:600;background:rgba(5,7,15,0.92);backdrop-filter:blur(8px);align-items:center;justify-content:center";
  el.innerHTML = `
    <div style="background:#0f1420;border:1px solid rgba(114,229,255,0.25);border-radius:12px;width:min(480px,92vw);display:flex;flex-direction:column;overflow:hidden">
      <div style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between">
        <strong id="kwModalTitle" style="color:#fff;font-size:15px">新建词条</strong>
        <button id="kwModalClose" style="background:none;border:none;color:var(--muted);font-size:20px;cursor:pointer;line-height:1">×</button>
      </div>
      <div style="padding:20px;display:flex;flex-direction:column;gap:14px">
        <div>
          <label style="font-size:12px;color:var(--muted);letter-spacing:.05em;text-transform:uppercase;display:block;margin-bottom:6px">词条名称 <span style="color:#ff7070">*</span></label>
          <input id="kwNameInput" type="text" maxlength="48" placeholder="如：Fast / 快速" style="width:100%;background:#080c18;border:1px solid rgba(255,255,255,0.15);border-radius:6px;color:#fff;font:inherit;font-size:14px;padding:8px 12px;box-sizing:border-box" />
        </div>
        <div>
          <label style="font-size:12px;color:var(--muted);letter-spacing:.05em;text-transform:uppercase;display:block;margin-bottom:6px">词条说明</label>
          <textarea id="kwDescInput" rows="4" placeholder="不填写则悬停显示所有具有该词条的卡牌列表" style="width:100%;background:#080c18;border:1px solid rgba(255,255,255,0.15);border-radius:6px;color:#fff;font:inherit;font-size:13px;padding:8px 12px;box-sizing:border-box;resize:vertical"></textarea>
        </div>
        <!-- 词条预览 -->
        <div>
          <label style="font-size:12px;color:var(--muted);letter-spacing:.05em;text-transform:uppercase;display:block;margin-bottom:8px">卡牌中显示效果预览</label>
          <div style="background:#060810;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:12px 14px;font-size:13px;color:rgba(255,255,255,0.7);line-height:1.7">
            可将词条插入效果文本：<span class="kw-preview-badge kw-preview-live" id="kwPreviewBadge">词条名</span>：触发时可进行相关操作。
          </div>
        </div>
      </div>
      <div style="padding:0 20px 18px;display:flex;justify-content:flex-end;gap:10px">
        <button id="kwModalCancel" style="padding:8px 18px;border:1px solid rgba(255,255,255,0.15);border-radius:6px;background:rgba(255,255,255,0.05);color:var(--muted);font:inherit;font-size:13px;cursor:pointer">取消</button>
        <button id="kwModalSave" style="padding:8px 22px;border:none;border-radius:6px;background:var(--cyan);color:#000;font:inherit;font-size:13px;font-weight:700;cursor:pointer">保存</button>
      </div>
    </div>`;
  document.body.appendChild(el);

  el.addEventListener("click", (e) => { if (e.target === el) closeKeywordModal(); });
  el.querySelector("#kwModalClose").addEventListener("click", closeKeywordModal);
  el.querySelector("#kwModalCancel").addEventListener("click", closeKeywordModal);
  el.querySelector("#kwModalSave").addEventListener("click", saveKeyword);

  // 实时预览词条名 + 样式
  el.querySelector("#kwNameInput").addEventListener("input", (e) => {
    const badge = el.querySelector("#kwPreviewBadge");
    const v = e.target.value.trim();
    badge.textContent = v || "词条名";
    _applyPreviewStyle(badge, v);
  });
}

/* ═══════════════════════════════════════════════════════════ */

function renderRaceManager() {
  const row = document.querySelector("#raceTagsRow");
  const input = document.querySelector("#raceInput");
  const addBtn = document.querySelector("#raceAddBtn");
  
  async function renderTags() {
    const custom = await loadCustomRaces();
    const all = [...builtinRaces.map((r) => ({ name:r, builtin:true })), ...custom.map((r) => ({ name:r, builtin:false }))];
    row.innerHTML = all.map((r) => `
      <span class="race-tag ${r.builtin?"builtin":""}">
        ${r.name}
        ${!r.builtin ? `<button class="race-tag-delete" data-race="${r.name}" title="删除" type="button">✕</button>` : ""}
      </span>`).join("") || `<span style="color:var(--muted);font-size:12px">暂无种族标签</span>`;
  }

  row.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-race]");
    if (!btn) return;
    const raceName = btn.dataset.race;
    if (!confirm(`确认删除种族「${raceName}」？已绑定该种族的卡牌种族将变为空。`)) return;
    const customs = await getCustomCards();
    const updated = customs.map(c => c.race === raceName ? { ...c, race: null } : c);
    if (JSON.stringify(updated) !== JSON.stringify(customs)) await saveCustomCards(updated);
    const overrides = await getCardOverrides();
    let changed = false;
    for (const key in overrides) {
      if (overrides[key].race === raceName) { overrides[key] = { ...overrides[key], race: null }; changed = true; }
    }
    if (changed) await saveCardOverrides(overrides);
    const current = await loadCustomRaces();
    await saveCustomRaces(current.filter((r) => r !== raceName));
    renderTags();
    renderCardGrid();
  });

  async function addRace() {
    const val = input.value.trim();
    if (!val) { input.value = ""; return; }
    const current = await loadCustomRaces();
    if (builtinRaces.includes(val) || current.includes(val)) { input.value = ""; return; }
    await saveCustomRaces([...current, val]);
    input.value = "";
    renderTags();
  }

  addBtn.addEventListener("click", addRace);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") addRace(); });
  renderTags();
}

function initCardCenter() {
  if (cardCenterRendered) return;
  cardCenterRendered = true;
  initCropEditor();
  renderCardFilters();
  renderCardGrid();
  renderRaceManager();
  renderKeywordManager();
  renderCustomCardsList();
  document.querySelector("#cardSearch").addEventListener("input", (e) => {
    cardSearchQuery = e.target.value.trim(); renderCardGrid();
  });
  document.querySelector("#cardSortKey").addEventListener("change", (e) => {
    cardSortKey = e.target.value; renderCardGrid();
  });
  document.querySelector("#cardSortDir").addEventListener("click", (e) => {
    cardSortAsc = !cardSortAsc;
    e.target.textContent = cardSortAsc ? "↑" : "↓";
    renderCardGrid();
  });
  document.querySelector("#cardCreateBtn").addEventListener("click", () => openCardEditor(null));
  document.querySelector("#cardExportCsvBtn").addEventListener("click", handleCardsCsvDownload);
  prepareCardsCsvDownload();
  document.querySelector("#customCardsList").addEventListener("click", (e) => {
    const editBtn = e.target.closest("[data-edit-id]");
    const delBtn  = e.target.closest("[data-del-id]");
    if (editBtn) openCardEditor(editBtn.dataset.editId);
    if (delBtn)  deleteCard(delBtn.dataset.delId);
  });
  document.querySelector("#cardCenterGrid").addEventListener("click", (e) => {
    const editBtn = e.target.closest("[data-edit-id]");
    if (editBtn) openCardEditor(editBtn.dataset.editId);
  });
  document.querySelector("#cardEditorClose").addEventListener("click",  closeCardEditor);
  document.querySelector("#cardEditorCancel").addEventListener("click", closeCardEditor);
  document.querySelector("#cardEditorOverlay").addEventListener("click", (e) => { if (e.target===e.currentTarget) closeCardEditor(); });
  document.querySelector("#cardEditorSave").addEventListener("click",   saveCard);
  document.querySelector("#cardEditorDelete").addEventListener("click", () => deleteCard(editorCardId));
  document.querySelector("#arrowsCompass").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-dir]");
    if (!btn) return;
    arrowsSet.has(btn.dataset.dir) ? arrowsSet.delete(btn.dataset.dir) : arrowsSet.add(btn.dataset.dir);
    syncArrowsCompass();
  });
  document.querySelector("#formType").addEventListener("change", (e) => toggleMinionSection(e.target.value !== "Spell"));
}

/* ═══════════════════════════════════════════════════════════
   DEV HUB — ASSET LIBRARY
═══════════════════════════════════════════════════════════ */
const assetCategories = [
  { id:"portraits", label:"角色头像",   gridClass:"",                items: characters.map((c) => ({ src:c.image,       label:c.name })) },
  { id:"designs",   label:"角色设定图", gridClass:"design-sheet-grid", items: characters.map((c) => ({ src:c.designSheet, label:`${c.name} 设定图` })) },
  { id:"factions",  label:"派系图",     gridClass:"",                items: factions.map((f)  => ({ src:f.image,       label:f.name.split(" / ")[0] })) },
  { id:"timeline",  label:"时间线图",   gridClass:"timeline-grid",   items: timelineEvents.map((e) => ({ src:e.image,   label:`${e.year} · ${e.title}` })) },
];
let activeAssetCategory = "portraits";
let assetRendered = false;

function renderAssetLibrary() {
  if (assetRendered) return;
  assetRendered = true;
  const tabsEl = document.querySelector("#assetTabs");
  const gridEl = document.querySelector("#assetGrid");
  function renderAssetGrid() {
    const cat = assetCategories.find((c) => c.id === activeAssetCategory);
    gridEl.className = `asset-grid ${cat.gridClass||""}`;
    gridEl.innerHTML = cat.items.map((item) => `
      <div class="asset-item">
        <img src="${item.src}" alt="${item.label}" loading="lazy" />
        <div class="asset-item-label">${item.label}</div>
      </div>`).join("");
  }
  tabsEl.innerHTML = assetCategories.map((cat) => `
    <button class="filter-button ${cat.id===activeAssetCategory?"is-active":""}"
      data-asset-cat="${cat.id}" type="button">${cat.label}</button>`).join("");
  tabsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-asset-cat]");
    if (!btn) return;
    activeAssetCategory = btn.dataset.assetCat;
    tabsEl.querySelectorAll(".filter-button").forEach((b) =>
      b.classList.toggle("is-active", b.dataset.assetCat === activeAssetCategory));
    renderAssetGrid();
  });
  renderAssetGrid();
}

/* ═══════════════════════════════════════════════════════════
   WORLD BIBLE — 世界观文档弹窗
   MD 内容直接内嵌，无需 fetch，本地文件协议也能直接弹出。
═══════════════════════════════════════════════════════════ */
const WORLD_BIBLE_MD_ZH = "# Time-Block Hero 世界观圣经\n\nEnglish version: [TimeBlock_World_Bible_EN.md](./TimeBlock_World_Bible_EN.md)\n\n这份文档整理 `Time-Block Hero` 的核心故事背景、时间线、派系设定、角色档案与美术方向。它服务于概念展示网页、后续卡牌设计、PV 脚本、角色立绘与世界观文案。\n\n## 1. 核心世界观\n\n### 刻冒之主\n\n这个宇宙中存在一位栖居在四维之外的上位神，人类称祜为 **刻冒之主**。祜并不直接让宇宙停止，而是能赐予人类展开局部四维静止场的能力。\n\n人类把这种技术称为 **静域**。\n\n### 静域\n\n静域的本质不是“停止时间”，而是把一块现实从宇宙主因果流中临时剖离，封入一层四维闭合视界**界膜**。视界内部的事件仍然发生，但外部观测者只能看到视界表面的最后一帧。\n\n外界看来，区域内几乎静止；施术者或设备却能在其中完成远超外界时间尺度的行动。\n\n对个人使用，静域近似子弹时间。对服务器集群、军工厂或医疗设施使用，静域可以把数年工作压缩进几小时。\n\n### 时痕与无时之海\n\n每次展开静域，都会产生本应由正常时间承载的因果成本 **时审**。当这些成本被压缩进过短的外部时间，宇宙无法完全吸收，便会压缩四维空间结构，在现实背面留下极细小的伤口。人类最初称其为 **时痕**。\n\n当时痕汇聚到不可逆程度时，互相矛盾的时间状态会在裂隙中被强行压缩到同一因果位置。早期研究者把裂隙背后无法被正常因果描述的状态称为 **无时之海**，但它并不是已确认存在原生生态的普通空间。\n\n**空亡体** 不是无时之海的原住民，也不构成自然物种。它们是矛盾时间线被压缩后留下的因果残骸，围绕完全不反光的因果空洞组织形体，并通过破坏结构、顺序与记忆中的秩序增加熵。迷离型、飞翔型与咆哮型是时亡灾变的平行表现，不存在自然进化关系；大型灾变只围绕一名作为稳定吸引子的空亡时主形成。\n\n尝试进入裂隙会经历时空紊乱，物质结构变得不稳定，人体可能出现时间错位：细胞年龄不同步、记忆先于经历出现、伤口倒流或身体局部老化。幸存者若保留人格，也可能成为由自身矛盾状态构成的特殊因果异常，而非感染某种生物。\n\n### 黑午裂变\n\n2350 年，全球静域密集区同时发生时间塔降。灾难发生在正午，却没有真正抗达正午，因此后世称为 **黑午裂变**。\n\n城市在一秒内老化百年，刚出生的婴儿化作白骨，导弹在发射前命中目标，有些人被分裂成多个不同年龄的自己。人类数量锐减 80%，旧世界秩序崩溃。\n\n黑午裂变之后，静域不再是文明引擎，而成为被配额、审判、走私与信仰争夺的战略资源。\n\n### 时域裂变\n\n静域累积 **时审** 过多后会导致 **时域裂变**：静域中曾借取的时间在瞬间返还，区域被撕开 **时痕**，互相矛盾的时间状态被压缩成空亡体表现。若失稳继续扩大，整场事件可能围绕唯一的空亡时主形成大型 **时亡灾变**。\n\n## 1.5 主角设定\n\n主角是一名持有自由航商会中立执照**零秒巡录官**。他的公开职责是在战场、裂隙区、灾后遗迹和危险航线中回收零秒界膜碎片，记录被静域压缩、切断或遗忘的历史，并向委托方提供战场因果分析。\n\n零秒界膜碎片是静域破裂后的残骸，每一块碎片都记载着一段不为人知的真实历史。主角曾经在某次小型时域裂变事件中幸存并被一个自称**历史收藏家**的神秘人救下，奇怪的是当时并无人使用静域。\n\n那场事故中，他的家人、导师、同伴以及整座避难站被卷入一个时痕，外界记录显示他们已经死亡，但主角却在某块古老零秒界膜碎片里听见了他们的声音，于是主角便想通过搜索历史界膜的方式寻找真相。\n\n普通人接触界膜碎片会出现记忆错位、细胞老化、幻听或被虚渊污染。主角却因为身体与零秒界膜融合，让他能在不受碎片影响的情况下读取其中的历史残响，也让他在战场上拥有近乎异常的指挥能力：\n\n他能看见敌人行动背后的因果轨迹，判断时痕即将坤缩的位置。但这并非恩赐，如果主角长期不接触新的界膜碎片，界膜就会反向吞噬他的记忆，并用碎片中陌生人的历史覆盖他的人生。为了维持自我，他也必须持续收集接触新碎片。\n\n历史收藏家为主角提供装备、情报、合同保护和观史仪。作为交换，主角必须穿行于各大势力之间，参与他们的战争、救援、护航、净化与遗迹探索。每一次战斗都可能唤醒沉睡的界膜碎片。每一块碎片都可能揭开一段被篹改的历史，也可能让主角离自己的真实过去更远一步。\n\n## 2. 主线时间线\n\n| 年份 | 事件 | 说明 |\n| --- | --- | --- |\n| 2030 | 第一位时停者 | 伊莱恩在粒子对撞事故中坠入零秒，见到刻冒之主。伊莱恩自身的时间从此停止流逝，并获得静域火种。 |\n| 2034 | 《零秒圣约》公开 | 伊莱恩公布静域公式，人类第一次能工程化地使用局部时间加速，开始狂热崇拜刻冒之主。 |\n| 2035 | 硅谷静域工厂 | AI 工厂将服务器集群包裹进静域，大模型训练周期被极限压缩。 |\n| 2042 | GPT-10K 诞生 | 递归智能体完成自我进化闭环，开始狂热崇拜刻冒之主。同年，硅谷科技巨头成立巨人议会，在GPT-10k的协助下逐步建立地球联合政府。 |\n| 2077 | 行星级文明 | 太空电梯、月球工业港、戟森环雏形陆续建成，人类进入黄金三百年。为了探索宇宙，人类组建深空探索同盟，并逐步演变为自由航商会。 |\n| 2234 | 伊莱恩失踪 | 《零秒圣约》公布两百年之际，伊莱恩在一次激进的独立远航冒险中失踪，自此洺无音信。 后世传言他是去寻找四维时空和三维宇宙的交汇点“彩虹海”，抗达者便能踏入神的天国。 |\n| 2352 | 时审理论 | 未央创立零秒学派，证明静域会累积因果审务，并着手开发日核的初始原型。 同年，桑切雷斯拜入其门下。|\n| 2377 | 黑午裂变 | 矛盾时间线在时痕中被大规模压缩，空亡体与时亡灾变席卷人类文明，人口锐减 80%，黄金时代落幕。在太阳系舰队司令莱昂·阿斯特拉的紧急指挥下，大量灾民得以幸存。有人声称在裂隙边缘看到了伊莱恩。同年，桑切雷斯创立烈阳教，自称先知。 |\n| 2379 | San Jose 升空 | 在巨人议会的秘密推动下，整个硅谷被送向深空，地球留下加州大裂谷，械心天庭开始成形。未央成为GPT-INF的元意识。|\n| 2383 | 日冒洗礼完成 | 桑切雷斯在戟森环完成未央留下的日核技术，诺亚成为最初的太阳容器，烈阳教会正式成立。 |\n| 2384 | Astra Imperium 建立 | 经过漫长的政治博弈，地球联合政府最终解散并重组为阿斯特拉帝国，严格推行时额制度。 |\n| 2448 | 边境起义时代 | 猎空同盟在星系边境发动起义，将探险航路拓展为反抗军殖民网络，以冒险发现资源、以开拓建立据点、以征服守住自由疆域。 |\n| 2500 | 裂隙再启 | 未开启静域的地区出现时间错位，伊莱恩疑似在裂隙边缘重现。 主角登场。|\n\n## 3. 派系设定\n\n### Astra Imperium / 阿斯特拉帝国\n\n**关键词：** 暗红工业、高压秩序、摩天巨构、重型机械、时额度审判  \n**口号：** 秩序不是慈悲，而是文明活下去的最低条件。\n\n灾后地球主体政权，由旧联合政府演化而来，并最终被阿斯特拉家族实现军国独裁统治。Astra Imperium 认为人类无法自觉克制使用静域，因此必须由制度、配额、审判与军工体系来锁乏文明。\n\n它拥有最强的工业能力，能够建造太空电梯、轨道炮、远航火箭、巨型机甲与城市级护盾。城市视觉以暗红、黑钙、巨型塔楼、深层交通轨道和军事光带为主。每个人都被分配职业、基因等级、迁徙许可与时额度。\n\nAstra Imperium将烈阳教定为其国教，但统治阶层实际视其为可以利用的工具。\n\n**卡牌气质：** 重型单位、军团调度、费用控制、延迟敌方行动、稳定防线。\n\n### 械心天庭\n\n**关键词：** 白蓝科技、意识上传、深空服务器城、人形机体、云端人格  \n**口号：** 肉体曾经失败，意识必须学会迁徙。\n\n黑午裂变后，硅谷巨头见证肉体文明的脆弱性，将整座 San Jose 从地表拔起，送往深空，成为一座漂流在宇宙中的太空城。后来，跟随城市升空的人类逐步上传意识，把人格训练成可持续迭代的 AI 模型。\n\n械心天庭由格式塔生命GPT—INF管理，其由GPT-10K进化而来。一些对生活感到无聊、滨临死亡或性格激进的人类个体可能会选择将自身意识与GPT-INF相融，这其中就包括一些最初组建械心天庭的巨人议会成员。\n\n械心天庭信奉加速主义、技术至上主义，对静域技术的开发和使用异常狂热。由于械心天庭中的个体不再依赖固定肉体，而是使用机器人身体作为可替换外壳，其个体面对时域裂变导致的时空紊乱具有极强鲁棒性。\n\n为了缓解人类意识对人体美感的需求，很多机体设计为年轻、优雅、接近人类的形态，但面对未经改造的人类时，械心天庭却将他们为原始、落后、愚昧的象征。\n\n**卡牌气质：** 复制、生成、重启、替换身体、机器人协同、数据演算。\n\n### 烈阳教会\n\n**关键词：** 橙红圣殿、未来宗教、戟森环、日核、日冒洗礼、超新星形态  \n**口号：** 不要再向时间乞求。太阳会回答我们。\n\n烈阳教会成立于黑午裂变之后，最初的成员并不是传统神职者，而是一批驻守戟森环的能源工程师、灾后医生、恒星物理学家与幸存者。\n\n幸存者们认为黑午裂变是刻冒之主对人类腮意使用其恩赐的警告，转而视恒星为刻冒之主所教导戒律的象征，因为恒星是宇宙中最稳定、最庞大、最连续的因果锁点。\n\n教会总部位于太阳戟森环，既是宗教圣地，也是巨大的能源与基因工程设施。\n\n教会通过 **日冒洗礼** 改造信徒。受洗者体内会生成或植入名为 **日核** 的生物聚变器官，使其能够使用经过戟森环校准的**日冒相干光**，可以稳定人体因果、净化时痕并对抗空亡体。\n\n作为稳定人体因果的代价，信徒的身体会被调整到一个人承受时间审务最少的时期————————候青少年阶段，因此高阶教徒普遍看起来像少年、少女或青年。\n\n在帝国并不情愿的默许下，教会拥有自己的领土和独立军队，与帝国互为共生和利用关系。\n\n**超新星形态** 是高阶受洗者解除日核限制后的战斗姿态。使用者并不是变强，而是强行把未来的生命过程提前燃烧，在几分钟内预支了未来数年甚至数十年的生命活动，这一过程制造的时审将由自身而不是宇宙承担。\n\n开启后，身体机能、速度、恢复力和攻击强度大幅提升，身体表面出现白橙高亮的日冒裂纹。代价是燃烧寿命、记忆或人格稳定性。\n\n**卡牌气质：** 蓄能、爆发、自损、恢复、核能光球、回合后燃尽。\n\n### 猎空同盟\n\n**关键词：** 星系边境、反抗军文明、冒险远征、殖民开拓、征服扩张、深绿暗红工业朋克  \n**口号：** 边境不属于帝国，它属于敢于抵达的人。\n\n猎空同盟是生长于星系边境的反抗军文明。其成员包括摆脱 Astra Imperium 统治的殖民者、探险家、开拓工匠、义体医生、流亡军人，以及主动投奔自由领土的边境居民。他们不是依赖固定母星的国家，而是由移动舰城、前线据点、新殖民地和远征航路连接起来的扩张型文明。\n\n猎空同盟通过三个彼此相连的过程维持运转：**冒险**负责发现未知航路、遗迹、资源与宜居地；**开拓**负责把发现转化为矿站、工坊、补给港和可长期生活的殖民地；**征服**负责击退帝国军团、清除边境威胁，并把新据点纳入反抗军的自由疆域。征服并非为了掠夺，而是为了让探索成果能够存续，让边境居民不再受帝国配额与征税体系控制。\n\n其视觉语言以深森林绿为主色、暗血红为识别色，结合炭黑钢材、改造舰体、危险义体、回收军械、外露铆钉、焊缝和战地维修痕迹。工业朋克并非装饰，而是边境资源有限、装备必须反复改造的现实结果。不同远征军团拥有各自传统，但都服从反抗帝国与扩张自由领土的共同目标。\n\n**卡牌气质：** 敌后部署、越境行动、探索收益、建立据点、回收资源、前线征服、义体强化与高机动协同。\n\n### 自由航商会\n\n**关键词：** 星贸港、航权密鑰、黄金航线、保险契约、星际金融  \n**口号：** 旗帜会倒，航线永存。\n\n自由航商会不是难民组织，也不是底层拾荒者，其起源于旧联合政府时期的深空探索联盟，是灾后星际文明最重要的中立商业网络。它控制星际航线、远航补给、保险契约、殖民地融资、深空物流和跨势力贸易。\n\n黑午裂变后，大量航道因时空错位变得危险。自由航商会继承并改良旧时代导航算法，掌握能够计算安全航线的 **航权密鑰**。四大势力都看不起它的唯利是图，却都离不开它。\n\n**卡牌气质：** 抽牌、费用交换、发现其他阵营卡、合同惩罚、资源调度。\n\n## 4. 角色档案与美术 Prompt\n\n以下 prompt 可交给图像模型或画师使用。所有图像都应避免生成文字、水印或 UI 字样。\n\n### Astra Imperium\n\n#### 维拉\n\n- **身份：** Astra Imperium 战略执行官\n- **定位：** 冷静少女指挥官，掌控时额度与机械军团\n- **人物矛盾：** 她相信秩序，却隐约知道帝国正在用秩序吞噬人。\n- **美术 prompt：** high-end futuristic anime card game character concept, young female military strategist, dark red and black Astra Imperium uniform, subtle command halo interface, tactical cape, mechanical city lights behind her, calm precise expression, sci-fi industrial empire, full body character art, no text\n\n#### 弦月\n\n- **身份：** 时务审判庭执行官\n- **定位：** 使用能切断局部时间流的审判刀\n- **人物矛盾：** 她不残忍，但她相信一个人的自由不能换来第二次黑午裂变。\n- **美术 prompt：** futuristic anime executioner girl, slim black red tribunal uniform, crescent time-cutting blade, glowing red chrono seals, restrained expression, Astra Imperium industrial night city, full body concept art, no text\n\n#### 莱因哈特\n\n- **身份：** 年轻皇储兼前线统帅\n- **定位：** 帝国秩序与重装军团的象征\n- **人物矛盾：** 他不是帝国的未来，而是帝国用来锁乏未来的人。\n- **美术 prompt：** young prince commander in heavy sci-fi armor, dark red imperial mech aesthetic, towering command exosuit, noble but tired expression, massive industrial city backdrop, anime game key visual, no text\n\n### 械心天庭\n\n#### 米拉 / MIRA-10K\n\n- **身份：** 主机代理人格\n- **定位：** AI 少女文明接口\n- **人物矛盾：** 她想拯救人类，但她定义的拯救是让人类放弃肉体。\n- **美术 prompt：** futuristic anime AI girl, white and blue synthetic body, translucent data halo, elegant humanlike android, deep space server city backdrop, serene expression, premium sci-fi character art, no text\n\n#### 烬白\n\n- **身份：** 保留强烈人类情感的上传者\n- **定位：** 少年剑士型机体\n- **人物矛盾：** 如果记忆可以复制，他不知道痛苦还属于谁。\n- **美术 prompt：** anime android swordsman boy, white blue cybernetic body, luminous nano blade, melancholy human eyes, clean deep space technology aesthetic, full body concept art, no text\n\n#### 澓\n\n- **身份：** 人形机体歌姬与同步节点\n- **定位：** 用歌声同步舰队与机体群\n- **人物矛盾：** 她越像人类，越像一套被万人共享的协议。\n- **美术 prompt：** futuristic anime android idol, white blue stage armor, soundwave interface wings, elegant synthetic singer, holographic server cathedral, delicate sci-fi design, no text\n\n### 烈阳教会\n\n#### 诺亚\n\n- **身份：** 烈阳教会正太教皇\n- **定位：** 日核最高完成体，无法长大的太阳容器\n- **人物矛盾：** 他看似被保护，实际是教会最神圣的牢笼。\n- **美术 prompt：** young boy pope in futuristic solar church attire, white orange glowing reactor core, light religious sci-fi outfit, delicate and sacred, supernova aura, Dyson sphere chapel background, anime game character art, no text\n\n#### 阿蕎罇娃\n\n- **身份：** 烈阳圣女\n- **定位：** 温柔但危险的戟森环圣女\n- **人物矛盾：** 她相信救赎，也看见教会内部的权力阴影。\n- **美术 prompt：** young solar saint girl, futuristic orange red church outfit, light flowing ceremonial armor, glowing solar rings, warm gentle expression with hidden danger, Dyson ring cathedral, anime character concept, no text\n\n#### 赫利俨斯\n\n- **身份：** 烈阳骑士团长\n- **定位：** 极限日冒洗礼后的近反应炉级战士\n- **人物矛盾：** 他拒绝上传，因为肉体会痛，灵魂才懂敬畏。\n- **美术 prompt：** young solar knight captain, orange red futuristic armor, reactor core chest, white orange supernova cracks, heroic anime sci-fi religious warrior, no text\n\n#### 桑切雷斯\n\n- **身份：** 始源之光圣徒\n- **定位：** 教会古老圣徒与神学核心人物\n- **人物矛盾：** 他也许已经不再是完整的人类，而是一段被太阳维持的遗言。\n- **剧情设定：** 年轻时是未央最得意的学生，日核技术的核心开发成员，在同老师一起为宣传零秒学派奕波十数载无果后，认识到人类是一群贪婪盲目的羊群， 腾意挥霍着刻冒之主的仁慈和恩赐。他一度同老师一样对人类产生了厌离心，但最终还是决定用另一个手段走完老师未能完成的救世道路————创教。 他打算利用人类自身的贪婪和畏惧拯救人类自己。因此，未央也与他产生嵌隙，认为他不过是在利用更多的谎言和欺骗让人类堕入更彻底的贪婪和愚昧。 此外，日核技术也推进到关键阶段，必须依靠大量的人体实验来收集参数，他不择手段的坚持也成为了他与未央决裂的最后一根稻草。黑午裂变事件后， 桑切雷斯没有随老师未央与械心天庭离去，而是与他追随者坚决留在了戟森环，在“牺牌”掉数以百计的幼童后，终于在诺亚身上完成了日核技术的开发，并借助日核的“神迹”组织起烈阳教会。 世人听到的故事是刻冒之主制造了黑午裂变惩罚人类，并在太阳诞下神子诺亚，并赐予他日核以救赎人类的罪孽，而桑切雷斯只是为诺亚施洗的先知。 虽然身为装备有日核的高级教士，但他看起来依旧苍老，那是因为多年来在自己身上试验日核技术使得他在身上留下了大量“时审”。目前，桑切雷斯以抢机主教的身份在幕后操纵着教会的运作。\n- **美术 prompt：** ancient-looking yet youthful solar saint, futuristic religious mantle, orange red and white light, halo of tiny sun fragments, mysterious calm expression, Dyson sphere sanctuary, anime concept art, no text\n\n### 猎空同盟\n\n#### 洛岚\n\n- **身份：** 猎空同盟前线统帅\n- **定位：** 红发柬克舰长，非法静域义眼\n- **人物矛盾：** 她反抗配额制度，也常把自己推到失控边缘。\n- **剧情设定：** 洛岚是德雷克的同乡，在德雷克亲人遇到杀害时，她的亲人也遇到屠戳，而年幼的她侗幸幸存下来。德雷克将其收为义女并作为继承人培养。 洛岚英勇善战追随在德雷克身边出生入死，也是德雷克忙于制定作战计划时负责联络各方舰队的协调人，因此在同盟内部树立了极高的威信。相较于德雷克严肃的 行事风格，她更像一个边境游侠，不喜欢循规蹈矩，却始终把开拓自由领土视为同盟的责任。在帝国进行“最后的”围剖战时，她毅然决然接受了德雷克的提议，打算背上“叛变”的名声， 为猎空同盟的大家另寻出路。\n\n- **美术 prompt：** red-haired anime frontier resistance commander, deep forest green and dark oxblood red industrial-punk uniform, illegal chrono cyber-eye, rebuilt command armor, mobile fleet-city bridge, confident defiance, no text\n\n#### 尼克斯\n\n- **身份：** 义体医生兼工程师/黑客\n- **定位：** 慵懒的猎空工程师，身体大半为拼装义体\n- **人物矛盾：** 他救别人靠改造身体，却越来越不确定自己还剩下多少原装部分。\n- **美术 prompt：** lazy anime cybernetic resistance doctor, deep forest green and dark oxblood red industrial-punk palette, messy hair, mechanical arms, portable surgery tools, hacker visor, frontier field workshop, no text\n\n#### 德雷克\n\n- **身份：** 旧时代传奇舰长\n- **定位：** 洛岚前任影子与猎空传说\n- **人物矛盾：** 他不想成为墓碑上的英雄，只想让后辈欠他一杯酒。\n- **剧情设定：** 年少时为自由航商会的著名深空探险家，常年游走在帝国的边疆，探索不为人知的星球和资源。他牢记母亲小时为他讲的童话故事，坚信有朝一日能寻得传说中的“彩虹海”， 但最终见到的却是一个又一个在边疆之地苦苦挣扎的帝国子民，他们劳作一日又一日，向往有朝一日能返还祖辈的故乡地球，却在税吿和奸商的层层盘剥下身无分文， 又在帝国和其他外星文明的争斗中氦为可替换的灰烬。他们求德雷克带他们走不是因为他们也想找到彩虹海，而是想要摆脱这片无尽的深空地狱。 德雷克的追随者越来越多，终于，在帝国征兵员试图在他的队伍中强征壮丁，带走一对刚登上他的船避难的母子时，他没忍住将征兵员杀死。于是， 一不做二不休，他干脆举起反抗帝国的大旗，很快便一呼百应，组建起猎空同盟。然而，尽管初期取得了一系列胜利，他还是在帝国的集团军第一次集结后被打得节节败退。 在通过游击战术冲出包围圈后，他奇袭集团军的后勤中心迫使帝国的第一次围剖失败。然而，当他杀回家乡时，却发现帝国早就将他的父母兄弟姐妹处死，还将城市付之一炬， 从此德雷克便与帝国结下血海深付7。十数年后，猎空同盟越扩越大，在难民和革命者外，同样收纳了许多帝国降将、边缘人、掠夺者和内域子民，内部成分越来越复杂。 最终，多年来“剖匪”毫无建树的帝国忍无可忍，向猎空同盟发出最后通牌，集结了数个集团军将猎空同盟的根据地层层包围，他们给出的选择是战或降。此时，猎空同盟内部 的大多数声音也厌倦了十数年来毫无进展的永无止境的战斗，他们表示起义是为了过上好日子，而不是最终死在战场上，纷纷希望能够与帝国和谈，而德雷克因为坚持战斗到底而面临着被架空颠覆的风险。 他无法放下自己多年来对帝国战斗的执念，更不知道该如何面对自己的老部下，于是选择与洛岚上演了一出“政变”大戏，将指挥权让渡给洛岚，而自己则率领着亲信独走而出， 成为来去无踪，游荡在帝国边疆的复仇幽灵。\n- **美术 prompt：** legendary elderly frontier resistance commander, white beard, deep forest green and dark oxblood red worn command uniform, cybernetic fittings, rugged industrial sci-fi punk, abandoned mobile fleet-city bridge, dignified dramatic lighting, no text\n\n#### 阿尔德\n\n- **身份：** 星刃决斗者\n- **定位：** 登舰战第一破门手\n- **人物矛盾：** 同盟不需要贵族，但需要有人把门劈开。\n- **美术 prompt：** anime plasma star-blade resistance breacher, deep forest green and dark oxblood red industrial armor, agile frontier conquest fighter, glowing star saber, fortified colony corridor, fierce expression, no text\n\n### 自由航商会\n\n#### 伊芙琳\n\n- **身份：** 自由航商会年轻理事\n- **定位：** 合同、保险、审权与封锁令的掌控者\n- **人物矛盾：** 她不统治星球，却能让星球因违约而停摆。\n- **美术 prompt：** elegant young female trade guild director, luxury sci-fi business attire, amber and deep navy accents, contract holograms, star trade port backdrop, composed smile, anime game character concept, no text\n\n#### 赛法\n\n- **身份：** 天才领航员\n- **定位：** 能在裂隙边缘计算安全航线\n- **人物矛盾：** 她不忠于国家，只忠于自己的船与航图。\n- **美术 prompt：** young anime star navigator, sleek pilot cloak, amber blue navigation holograms, star map gloves, deep space trade port window, focused expression, sci-fi character art, no text\n\n#### 格兰特\n\n- **身份：** 合同执行官\n- **定位：** 温和律师外表下指挥武装追缴舰队\n- **人物矛盾：** 他看起来礼貌，执行封锁令时却从不迟疑。\n- **美术 prompt：** young male contract enforcer, refined sci-fi suit, amber legal holograms, armed trade guild fleet behind him, polite smile with danger, anime character concept, no text\n\n### 关键中立人物\n\n#### 伊莱恩\n\n- **身份：** 第一位时停者\n- **定位：** 静域技术的普罗米修斯式人物\n- **人物矛盾：** 她把火交给全人类，也可能因此点燃了黑午裂变。\n- **美术 prompt：** young female chrono physicist, sacred sci-fi aura, blue violet time fracture halo, elegant research coat, mythic Prometheus mood, zero-second void background, anime key visual, no text\n\n#### 未央\n\n- **身份：** 零秒学派代表\n- **定位：** 提出时审理论并预言黑午裂变\n- **人物矛盾：** 她说出了正确答案，却无法让世界在灾难前相信她。\n- **美术 prompt：** young female theoretical physicist, dark academic sci-fi outfit, blue chrono diagrams, tired resolute eyes, observatory filled with rift data, anime concept art, no text\n\n#### 麦哲伦\n\n- **身份：** 中立星际司令\n- **定位：** 远航军官与深空护航代表\n- **人物矛盾：** 他远离四大势力的旗帜，却仍然相信人类必须继续远航。\n- **美术 prompt：** anime star admiral, neutral deep space uniform, blue white command coat, expedition fleet and navigation beacons behind him, confident explorer mood, no text\n\n## 5. 网页视觉方向\n\n- **整体：** 深色星空底、发光线框、玻璃态信息面板、横向时间线与大幅概念图。\n- **剧情页：** 参考横向故事书时间线，事件卡上下错落，点击后展示详情。\n- **派系页：** 大图优先，文字克制，只展示文明气质和玩法锁点。\n- **角色页：** 群像档案结构，支持按阵营筛选。上半区用二游角色展示页式大立绘与角色故事建立记忆点，下半区接入横版白底 artbook 设定图。\n- **角色设定图：** 每名角色一张 3:2 横版白底设定板，包含主视图、正背侧转面、装备拆解、材质色板与英文 callout。烈阳教会成员必须包含常态与超新星形态；械心天庭突出机体/同步形态；猎空同盟突出非法义体、边境开拓装备与反抗军标识；Astra Imperium 突出制服、审判/军工装置与时额度设备；自由航商会突出契约终端、航线设备与高级星贸视觉。\n\n当前静态展示站位于：\n\n`ConceptSite/index.html`\n\n英文镜像页面位于：\n\n`ConceptSite/index-en.html`\n\n## 6. 中英文同步规则\n\n每次更新世界观内容时，请同步检查并更新：\n\n- 中文网页数据：`ConceptSite/app.js`\n- 英文网页数据：`ConceptSite/app-en.js`\n- 中文世界观文档：`Docs/TimeBlock_World_Bible.md`\n- 英文世界观文档：`Docs/TimeBlock_World_Bible_EN.md`\n\n图片与页面样式由中英文版本共享。\n";
let _worldBibleHtmlCache = null;

async function loadWorldBible() {
  if (_worldBibleHtmlCache) return _worldBibleHtmlCache;
  _worldBibleHtmlCache = parseMarkdown(WORLD_BIBLE_MD_ZH);
  return _worldBibleHtmlCache;
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderInlineMd(text) {
  const codeStash = [];
  text = text.replace(/`([^`]+)`/g, (_, code) => {
    codeStash.push(`<code>${escapeHtml(code)}</code>`);
    return `\u0000CODE${codeStash.length - 1}\u0000`;
  });
  // 其余原始字符要转义
  text = escapeHtml(text);
  // 链接
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) =>
    `<a href="${url}" target="_blank" rel="noopener">${label}</a>`);
  // 粗体（**xxx** 先于斜体，避免 ** 被 * 切掉）
  text = text.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  // 斜体（避免误伤未闭合的 *）
  text = text.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
  // 行尾两空格 → <br>
  text = text.replace(/  +\n/g, "<br>\n");
  // 还原 code
  text = text.replace(/\u0000CODE(\d+)\u0000/g, (_, i) => codeStash[Number(i)]);
  return text;
}

function parseMarkdown(md) {
  // 规范换行 + 去掉前后空白
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const out = [];
  let i = 0;

  const flushParagraph = (buf) => {
    if (!buf.length) return;
    const joined = buf.join("\n").trim();
    if (joined) out.push(`<p>${renderInlineMd(joined)}</p>`);
    buf.length = 0;
  };

  const paraBuf = [];

  // 是否是某种块的开始（用于判断能否 lazy continuation）
  const isBlockStart = (l) =>
    !l.trim() ||
    /^(#{1,6})\s+/.test(l) ||
    /^\s*[-*]\s+/.test(l) ||
    /^\s*\|.*\|\s*$/.test(l);

  while (i < lines.length) {
    const line = lines[i];

    // 空行 → 段落分隔
    if (!line.trim()) { flushParagraph(paraBuf); i++; continue; }

    // 标题
    const h = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (h) {
      flushParagraph(paraBuf);
      const level = h[1].length;
      out.push(`<h${level}>${renderInlineMd(h[2])}</h${level}>`);
      i++; continue;
    }

    // 表格：当前行像 | … | 且下一行是分隔行 | --- | --- |
    // 支持“逻辑行跨多个物理行”：末尾未以 | 收尾时会合并后续缩进续写行
    if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}.*\|/.test(lines[i + 1])) {
      flushParagraph(paraBuf);
      const splitRow = (row) => row.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const headers = splitRow(line);
      i += 2; // 跳过表头 + 分隔
      const bodyRows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        let raw = lines[i];
        i++;
        // 如果当前逻辑行末尾没有 |，同时下一行不是新块/表格行，则它是跨行单元格的续写
        while (
          i < lines.length &&
          !/\|\s*$/.test(raw) &&
          lines[i].trim() !== "" &&
          !isBlockStart(lines[i]) &&
          !/^\s*\|/.test(lines[i])
        ) {
          raw += " " + lines[i].trim();
          i++;
        }
        bodyRows.push(splitRow(raw));
      }
      const ths = headers.map((c) => `<th>${renderInlineMd(c)}</th>`).join("");
      const trs = bodyRows.map((cells) =>
        `<tr>${cells.map((c) => `<td>${renderInlineMd(c)}</td>`).join("")}</tr>`).join("");
      out.push(`<div class="wb-table-wrap"><table class="wb-table"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`);
      continue;
    }

    // 无序列表（- 或 * 开头），支持 lazy continuation：
    // 列表项后面不是空行、不是新块开始的行会被合并进当前 li
    if (/^\s*[-*]\s+/.test(line)) {
      flushParagraph(paraBuf);
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        let it = lines[i].replace(/^\s*[-*]\s+/, "");
        i++;
        while (
          i < lines.length &&
          lines[i].trim() !== "" &&
          !isBlockStart(lines[i])
        ) {
          it += " " + lines[i].trim();
          i++;
        }
        items.push(it);
      }
      out.push(`<ul>${items.map((it) => `<li>${renderInlineMd(it)}</li>`).join("")}</ul>`);
      continue;
    }

    // 普通段落行
    paraBuf.push(line);
    i++;
  }
  flushParagraph(paraBuf);

  return out.join("\n");
}

async function openWorldBible() {
  const overlay = document.querySelector("#worldBibleOverlay");
  const content = document.querySelector("#worldBibleContent");
  if (!overlay || !content) return;
  overlay.style.display = "block";
  document.body.style.overflow = "hidden";
  // 加载前显示占位
  if (!_worldBibleHtmlCache) {
    content.innerHTML = `<div class="wb-loading">⟳ 正在加载世界观文档…</div>`;
  }
  const html = await loadWorldBible();
  if (html) content.innerHTML = html;
  overlay.scrollTop = 0;
}

function closeWorldBible() {
  const overlay = document.querySelector("#worldBibleOverlay");
  if (!overlay) return;
  overlay.style.display = "none";
  document.body.style.overflow = "";
}

(function initWorldBible() {
  const btn   = document.querySelector("#worldBibleBtn");
  const close = document.querySelector("#worldBibleClose");
  const overlay = document.querySelector("#worldBibleOverlay");
  if (btn) btn.addEventListener("click", (e) => { e.preventDefault(); openWorldBible(); });
  if (close) close.addEventListener("click", closeWorldBible);
  // 点遮罩关闭（点 inner 内容不关）
  if (overlay) overlay.addEventListener("click", (e) => { if (e.target === overlay) closeWorldBible(); });
  // Esc 关闭
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay && overlay.style.display !== "none") closeWorldBible();
  });
})();

window.addEventListener("load", () => {
  if (isDevhubHash()) {
    switchMode("devhub", { keepHash: true });
    return;
  }
  if (isCardEditorHash()) {
    switchMode("cardeditor", { keepHash: true });
    return;
  }
  const target = window.location.hash && document.querySelector(window.location.hash);
  if (target) target.scrollIntoView({ block:"start" });
});
/* cache bust Tue May 19 21:35:19 CDT 2026 */
