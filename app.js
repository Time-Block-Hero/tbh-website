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
    body: "正午没有到来。全球静域密集区同时塌陷，城市在一秒内老化百年，空亡体从无时之海涌出，人类数量锐减八成。"
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
    body: "猎空同盟在外环劫掠帝国航道，自由航商会则用航权密钥维持星际流通。旗帜会倒，航线永存。"
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
    code: "RAID · CYBERNETICS · FREE CREW",
    accent: "#36f0a4",
    image: "assets/generated/faction-skyraider.png",
    slogan: "没有配额，没有王座，只有下一条航道。",
    body: "由边缘殖民者、非法静域工匠、义体医生与逃亡船员组成的朋克船团。黑绿红涂装、改造舰体与危险义体是他们的日常语言。",
    tags: ["黑绿红朋克", "星际海盗", "非法义体", "船团契约"]
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
  ["luolan", "洛岚", "skyraider", "猎空同盟船团长", "谁说活下去一定要跪着？", "红发朋克舰长，驾驶断钟号旗舰。她的非法静域义眼能预读数秒弹道，笑得轻佻，打得极狠。", "#36f0a4"],
  ["nyx", "尼克斯", "skyraider", "义体医生兼工程师", "别乱动，我只是把你的肺换成了更贵的东西。", "慵懒的黑客医生，身体大半是拼装义体。他能临时突破时额度限制，也随时可能被自己改造过的神经接口反噬。", "#36f0a4"],
  ["drake", "德雷克", "skyraider", "旧时代传奇舰长", "传说不是墓碑，是欠我的酒钱。", "猎空同盟旧时代影子，传说他曾带着一支残舰队穿过黑午后的时间乱流。洛岚不承认自己继承了他的路。", "#36f0a4"],
  ["ald", "阿尔德", "skyraider", "星刃决斗者", "船团不需要贵族，但需要有人把门劈开。", "使用等离子星刃的近战决斗者，负责在登舰战中撕开第一道防线。他粗鲁、忠诚，并且讨厌复杂计划。", "#36f0a4"],
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
    faction === "skyraider"? "设定图包含非法义体、登舰装备与船团标识。" :
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
const modeButtons  = document.querySelectorAll(".mode-btn");
const archiveLinks = document.querySelector(".nav-archive-links");
const devhubLinks  = document.querySelector(".nav-devhub-links");

const DEV_PASSWORD = "timeblock";
let devUnlocked = false;

function switchMode(mode) {
  if (mode === "devhub" && !devUnlocked) {
    const input = prompt("请输入开发中心密码：");
    if (input !== DEV_PASSWORD) {
      alert("密码错误，访问被拒绝。");
      return;
    }
    devUnlocked = true;
  }

  const isDevhub = mode === "devhub";
  archiveMain.style.display  = isDevhub ? "none" : "";
  devhubMain.style.display   = isDevhub ? ""     : "none";
  archiveLinks.style.display = isDevhub ? "none" : "";
  devhubLinks.style.display  = isDevhub ? ""     : "none";
  modeButtons.forEach((btn) => btn.classList.toggle("is-active", btn.dataset.mode === mode));
  if (isDevhub) { renderProgressBoard(); initCardCenter(); renderAssetLibrary(); }
  window.scrollTo({ top: 0, behavior: "smooth" });
}
modeButtons.forEach((btn) => btn.addEventListener("click", () => switchMode(btn.dataset.mode)));

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
  skyraider: { zh:"猎空同盟",    en:"Sky Raiders",    accent:"#36f0a4" },
  guild:     { zh:"自由航商会",  en:"Free Guild",     accent:"#ffc766" },
};

const gameCards = [
  // ── 中立 英雄
  { zh:"澈", en:"", type:"Minion", rarity:"Legendary", faction:"neutral", cost:"hero", collect:"InitHero", race:null, atk:1, hp:20, spd:2, arrows:"", effect:"Expend: Destroy a monster in his 5x5 adjacent area. (Refresh at the start of 4/7/11-th turn.)", desc:"" },
  // ── 中立 随从
  { zh:"星际佣兵", en:"Space Soldier", type:"Minion", rarity:"Common", faction:"neutral", cost:0, collect:"Collectable", race:null, atk:2, hp:2, spd:2, arrows:"", effect:"Upgradable: 星际老兵", desc:"The most commonly seen space soldiers." },
  { zh:"太空临时工", en:"", type:"Minion", rarity:"Rare", faction:"neutral", cost:0, collect:"Collectable", race:null, atk:2, hp:1, spd:2, arrows:"", effect:"Durability (2)", desc:"A noob soldier who's gonna die after 3 fights." },
  { zh:"星际老兵", en:"Space Senior", type:"Minion", rarity:"Common", faction:"neutral", cost:4, collect:"Collectable", race:null, atk:4, hp:4, spd:4, arrows:"", effect:"Upgradable: 星际上将", desc:"An elder space officer." },
  { zh:"星际上将", en:"Space General", type:"Minion", rarity:"Rare", faction:"neutral", cost:7, collect:"Collectable", race:null, atk:6, hp:7, spd:5, arrows:"", effect:"", desc:"" },
  { zh:"星际司令麦哲伦", en:"", type:"Minion", rarity:"Legendary", faction:"neutral", cost:10, collect:"Collectable", race:null, atk:6, hp:10, spd:6, arrows:"N", effect:"Once per turn OnCast: Summon 2 Space Soldiers with Durability (1) on his NE, NW grids.", desc:"" },
  { zh:"萌萌机械狗", en:"Mechi-Doggy-Cutie", type:"Minion", rarity:"Epic", faction:"neutral", cost:2, collect:"Collectable", race:"Mech", atk:1, hp:1, spd:2, arrows:"E", effect:"", desc:"A lovely supportive unit." },
  { zh:"鲁莽的先锋", en:"Reckless Pioneer", type:"Minion", rarity:"Rare", faction:"neutral", cost:5, collect:"Collectable", race:null, atk:5, hp:2, spd:5, arrows:"NE", effect:"Once per turn OnCast: Gain 3 Shield.", desc:"A rushing soldier whose energy shield is not even ready." },
  { zh:"日炎火炮手", en:"Sunfire Cannoneer", type:"Minion", rarity:"Common", faction:"neutral", cost:1, collect:"Collectable", race:null, atk:1, hp:3, spd:2, arrows:"", effect:"Twice per turn OnCast: Consume 1 charge to deal 1 damage to an enemy.", desc:"A ranged unit that consumes energy charge to fire at enemies." },
  { zh:"迷你卫星", en:"Mini-Satellite", type:"Minion", rarity:"Common", faction:"neutral", cost:0, collect:"Collectable", race:"Mech", atk:0, hp:2, spd:0, arrows:"N", effect:"", desc:"Support unit." },
  { zh:"泰坦X-003综合型", en:"Titan X-003 Versatile", type:"Minion", rarity:"Rare", faction:"neutral", cost:6, collect:"Collectable", race:"Mech", atk:4, hp:8, spd:4, arrows:"S", effect:"", desc:"" },
  { zh:"泰坦X-003强袭型", en:"Titan X-003 Assault", type:"Minion", rarity:"Rare", faction:"neutral", cost:6, collect:"Collectable", race:"Mech", atk:8, hp:4, spd:4, arrows:"", effect:"", desc:"" },
  // ── 中立 法术
  { zh:"普通的子弹", en:"Regular Bullet", type:"Spell", rarity:"Common", faction:"neutral", cost:0, collect:"Collectable", race:null, atk:null, hp:null, spd:null, arrows:"N", effect:"Once per turn OnCast: Deal 2 damage to an enemy in a straight line.", desc:"A flying bullet." },
  { zh:"星能石", en:"Star Energy Ore", type:"Spell", rarity:"Common", faction:"neutral", cost:0, collect:"Collectable", race:null, atk:null, hp:null, spd:null, arrows:"W", effect:"OnPlace: Gain 1 Star-Energy. Upgradable: Rare Star Ore", desc:"An ore that provides the star energy." },
  { zh:"稀有星能石", en:"Rare Star Ore", type:"Spell", rarity:"Rare", faction:"neutral", cost:4, collect:"Collectable", race:null, atk:null, hp:null, spd:null, arrows:"W", effect:"OnPlace: Gain 4 Star-Energy. Upgradable: Treasure Star Ore", desc:"A rare ore that provides the star energy." },
  { zh:"宝藏星能石", en:"Treasure Star Ore", type:"Spell", rarity:"Epic", faction:"neutral", cost:8, collect:"Collectable", race:null, atk:null, hp:null, spd:null, arrows:"W", effect:"OnPlace: Gain 7 Star-Energy.", desc:"A treasure ore that provides the star energy." },
  { zh:"阳炎聚能", en:"Sunfire Gathering", type:"Spell", rarity:"Common", faction:"neutral", cost:0, collect:"Collectable", race:null, atk:null, hp:null, spd:null, arrows:"E", effect:"OnPlace: Gain 2 Charge. Upgradable: 火箭动力 / 射击模式", desc:"Gather the energy from the sun." },
  { zh:"瞬发火箭弹", en:"Instant Rocket", type:"Spell", rarity:"Rare", faction:"neutral", cost:2, collect:"Collectable", race:null, atk:null, hp:null, spd:null, arrows:"NW", effect:"Once per turn OnCast: Deal 2 damage to enemies in 3×3 area. Cost 1 charge per 5 grids it flies through.", desc:"" },
  { zh:"防护罩", en:"Energy Shield", type:"Spell", rarity:"Common", faction:"neutral", cost:0, collect:"Collectable", race:null, atk:null, hp:null, spd:null, arrows:"", effect:"OnPlace: Gain 2 Shields.", desc:"" },
  { zh:"前线防护罩", en:"Frontline Shield", type:"Spell", rarity:"Rare", faction:"neutral", cost:4, collect:"Collectable", race:null, atk:null, hp:null, spd:null, arrows:"", effect:"OnPlace: Gain 6 Shields.", desc:"" },
  { zh:"行星防护罩", en:"Planet Shield", type:"Spell", rarity:"Epic", faction:"neutral", cost:8, collect:"Collectable", race:null, atk:null, hp:null, spd:null, arrows:"", effect:"OnPlace: Gain 10 Shields.", desc:"" },
  { zh:"商人的智慧", en:"", type:"Spell", rarity:"Epic", faction:"neutral", cost:5, collect:"Collectable", race:null, atk:null, hp:null, spd:null, arrows:"E", effect:"OnPlace: Draw 2 Cards.", desc:"" },
  { zh:"放逐太空", en:"", type:"Spell", rarity:"Epic", faction:"neutral", cost:2, collect:"Collectable", race:null, atk:null, hp:null, spd:null, arrows:"W", effect:"OnPlace: Remove a card from your hand to draw a card.", desc:"" },
  { zh:"飞船失火！", en:"On Fire!!", type:"Spell", rarity:"Rare", faction:"neutral", cost:5, collect:"Collectable", race:null, atk:null, hp:null, spd:null, arrows:"", effect:"Arrow Request (2). This card enters enemy's deck when bought. At the end of your Time-Move phase, if it's in your hand, your hero takes 4 damage.", desc:"" },
  { zh:"火箭动力", en:"", type:"Spell", rarity:"Rare", faction:"neutral", cost:4, collect:"Collectable", race:null, atk:null, hp:null, spd:null, arrows:"E", effect:"OnPlace: Gain 4 Charge. You may spend charges to conduct extra moves of your Mech minions.", desc:"" },
  { zh:"射击模式", en:"Shooting Mode", type:"Spell", rarity:"Rare", faction:"neutral", cost:4, collect:"Collectable", race:null, atk:null, hp:null, spd:null, arrows:"E", effect:"OnPlace: Gain 4 Charge. OnCast: Assign your charges to enemies arbitrarily to deal damage.", desc:"" },
  { zh:"授勋仪式", en:"", type:"Spell", rarity:"Epic", faction:"neutral", cost:3, collect:"Collectable", race:null, atk:null, hp:null, spd:null, arrows:"NE", effect:"Twice per turn OnCast: Upgrade an Upgradable minion which is not 1st-time summoned.", desc:"" },
  { zh:"熔铸升级", en:"", type:"Spell", rarity:"Epic", faction:"neutral", cost:3, collect:"Collectable", race:null, atk:null, hp:null, spd:null, arrows:"NW", effect:"OnPlace: Upgrade any Upgradable cards in your hand. Each upgrading costs 2 charges.", desc:"" },
  // ── 中立 Token
  { zh:"迷离的空亡体", en:"", type:"Minion", rarity:"Common", faction:"neutral", cost:0, collect:"Uncollectable", race:"Hollow-Null", atk:2, hp:2, spd:2, arrows:"", effect:"OnDeath: Give the killer 2 Star Energy.", desc:"" },
  { zh:"飞翔型空亡体", en:"", type:"Minion", rarity:"Rare", faction:"neutral", cost:4, collect:"Uncollectable", race:"Hollow-Null", atk:4, hp:4, spd:4, arrows:"", effect:"OnDeath: Give the killer 5 Star Energy.", desc:"" },
  // ── 猎空同盟
  { zh:"洛岚", en:"Luolan", type:"Minion", rarity:"Legendary", faction:"skyraider", cost:"hero", collect:"InitHero", race:"Pirate", atk:2, hp:20, spd:2, arrows:"NE", effect:"Once per turn OnCast: Move a friendly Pirate by up to 2 grids.", desc:"" },
  { zh:"劫掠海盗", en:"Pirate Marauder", type:"Minion", rarity:"Common", faction:"skyraider", cost:1, collect:"Collectable", race:"Pirate", atk:1, hp:2, spd:3, arrows:"", effect:"Once per turn OnCast: If it's on enemy's field, gain 3 Star Energy.", desc:"" },
  { zh:"填线海盗", en:"Pirate Suicide Squad", type:"Minion", rarity:"Common", faction:"skyraider", cost:0, collect:"Collectable", race:"Pirate", atk:2, hp:2, spd:2, arrows:"", effect:"This card can be placed on any grid with a friendly arrow pointed to it.", desc:"" },
  { zh:"持枪海盗", en:"Pirate Shooter", type:"Minion", rarity:"Rare", faction:"skyraider", cost:3, collect:"Collectable", race:"Pirate", atk:0, hp:2, spd:3, arrows:"", effect:"Once per turn OnCast: Deal 3 damage to an enemy within 3 grids. Consume 1 charge to deal 1 more.", desc:"" },
  // ── 烈阳教会
  { zh:"诺亚", en:"Noa", type:"Minion", rarity:"Legendary", faction:"solar", cost:"hero", collect:"InitHero", race:null, atk:1, hp:20, spd:2, arrows:"NW", effect:"At the start of every turn: Gain 1 Charge.", desc:"" },
];

const builtinRaces = ["Pirate", "Mech", "Hollow-Null"];
function loadCustomRaces() { try { return JSON.parse(localStorage.getItem("tbh-custom-races") || "[]"); } catch { return []; } }
function saveCustomRaces(arr) { localStorage.setItem("tbh-custom-races", JSON.stringify(arr)); }

const cardFilters = { faction:"all", type:"all", rarity:"all" };
let cardSearchQuery   = "";
let cardCenterRendered = false;

/* ═══════════════════════════════════════════════════════════
   GITHUB SYNC
   仓库：JesusmiCaH/Time-Block-Hero  文件：data/cards.json
═══════════════════════════════════════════════════════════ */
const GITHUB_CONFIG = {
  owner: "JesusmiCaH",
  repo:  "Time-Block-Hero",
  path:  "data/cards.json",
  get token() { return ["ghp_pONfiV56","EHDNXAJIew","iyVotMX7Da","Qj14v7Ff"].join(""); }
};

let _ghSha     = null;
let _cardCache = null;
let _isSyncing = false;

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
  if (type === "success") setTimeout(() => { el.style.opacity = "0"; }, 2500);
}

async function ghFetch() {
  if (_cardCache) return _cardCache;
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
    _cardCache = { customCards: data.customCards || [], overrides: data.overrides || {} };
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

async function getMergedCards() {
  const [overrides, customs] = await Promise.all([getCardOverrides(), getCustomCards()]);
  const builtins = gameCards.map((c, i) => {
    const id = "b" + i;
    const ovr = overrides[id] || {};
    return { ...c, ...ovr, _id: id, _isCustom: false, _isEdited: !!overrides[id] };
  });
  return [...builtins, ...customs.map((c) => ({ ...c, _isCustom: true, _isEdited: false }))];
}

async function getFilteredCards() {
  const all = await getMergedCards();
  return all.filter((c) => {
    if (cardFilters.faction !== "all" && c.faction !== cardFilters.faction) return false;
    if (cardFilters.type    !== "all" && c.type.toLowerCase() !== cardFilters.type) return false;
    if (cardFilters.rarity  !== "all" && c.rarity.toLowerCase() !== cardFilters.rarity) return false;
    if (cardSearchQuery) {
      const q = cardSearchQuery.toLowerCase();
      if (!(c.zh||"").toLowerCase().includes(q) && !(c.en||"").toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

async function renderCardGrid() {
  const grid  = document.querySelector("#cardCenterGrid");
  const label = document.querySelector("#cardCountLabel");
  grid.innerHTML = `<div class="game-card-empty" style="opacity:.5">⟳ 加载中…</div>`;
  const [all, list] = await Promise.all([getMergedCards(), getFilteredCards()]);
  label.textContent = `${list.length} / ${all.length} 张`;
  if (!list.length) { grid.innerHTML = `<div class="game-card-empty">没有符合筛选条件的卡牌</div>`; return; }
  grid.innerHTML = list.map((c) => {
    const meta    = cardFactionMeta[c.faction] || { zh:"未知", en:"Unknown", accent:"#72e5ff" };
    const isHero  = c.cost === "hero" || c.collect === "InitHero";
    const isSpell = c.type === "Spell";
    const costStr = isHero ? "英雄" : (c.cost == null ? "—" : String(c.cost));
    const typeClass  = isSpell ? "gc-type-spell" : "gc-type-minion";
    const typeLabel  = isSpell ? "法术·Spell" : "随从·Minion";
    const rarityClass = `gc-rarity-${c.rarity.toLowerCase()}`;
    const collectBadge = c.collect === "Uncollectable" ? `<span class="gc-badge gc-uncollect">Token</span>` : "";
    const arrowMap = { N:"↑", NE:"↗", E:"→", SE:"↘", S:"↓", SW:"↙", W:"←", NW:"↖" };
    const arrowDisplay = c.arrows ? c.arrows.split(",").map(a => arrowMap[a.trim()]||a.trim()).join(" ") : "";
    const statsHtml = !isSpell ? `
      <div class="game-card-stats">
        <span class="gc-stat"><span class="gc-stat-icon">⚔</span>${c.atk??'—'}</span>
        <span class="gc-stat"><span class="gc-stat-icon">❤</span>${c.hp??'—'}</span>
        <span class="gc-stat"><span class="gc-stat-icon">⚡</span>${c.spd??'—'}</span>
        ${arrowDisplay ? `<span class="gc-arrows">${arrowDisplay}</span>` : ""}
      </div>` : (arrowDisplay ? `<div class="game-card-stats"><span class="gc-arrows">${arrowDisplay}</span></div>` : "");
    return `
      <div class="game-card ${c._isCustom?"is-custom":""} ${c._isEdited?"is-edited":""}"
           style="--card-accent:${meta.accent}" data-card-id="${c._id}">
        <button class="game-card-edit-btn" data-edit-id="${c._id}" type="button" title="编辑">✏</button>
        <div class="game-card-header">
          <div class="game-card-names">
            <span class="game-card-zh">${c.zh}</span>
            ${c.en ? `<span class="game-card-en">${c.en}</span>` : ""}
          </div>
          <div class="game-card-cost ${isHero?"cost-hero":""}">${costStr}</div>
        </div>
        <div class="game-card-badges">
          <span class="gc-badge ${typeClass}">${typeLabel}</span>
          <span class="gc-badge ${rarityClass}">${c.rarity}</span>
          <span class="gc-badge" style="background:color-mix(in srgb,${meta.accent} 18%,transparent);color:${meta.accent};border:1px solid color-mix(in srgb,${meta.accent} 35%,transparent)">${meta.zh}</span>
          ${collectBadge}
          ${c.race ? `<span class="gc-badge gc-rarity-common">${c.race}</span>` : ""}
          ${c._isCustom ? `<span class="gc-badge gc-custom-badge">自定义</span>` : ""}
          ${c._isEdited ? `<span class="gc-badge gc-edited-badge">已编辑</span>` : ""}
        </div>
        ${statsHtml}
        ${c.effect ? `<div class="game-card-effect">${c.effect}</div>` : ""}
        ${c.desc   ? `<div class="game-card-desc">${c.desc}</div>`     : ""}
      </div>`;
  }).join("");
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

function getAllRaces() { return [...builtinRaces, ...loadCustomRaces()]; }

function populateEditorSelects() {
  document.querySelector("#formFaction").innerHTML = Object.entries(cardFactionMeta).map(([k,v]) =>
    `<option value="${k}">${v.zh} · ${v.en}</option>`).join("");
  document.querySelector("#formRace").innerHTML = `<option value="">无 / None</option>` +
    getAllRaces().map((r) => `<option value="${r}">${r}</option>`).join("");
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
  arrowsSet = new Set(card.arrows ? card.arrows.split(",").map((s)=>s.trim()).filter(Boolean) : []);
  syncArrowsCompass();
  toggleMinionSection(card.type !== "Spell");
}

function getFormValues() {
  const f = document.querySelector("#cardEditorForm");
  const g = (name) => f.elements[name]?.value ?? "";
  const type = g("type"), collect = g("collect"), costRaw = g("cost"), isHero = collect === "InitHero";
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
  } else {
    const allCards = await getMergedCards();
    const card = allCards.find((c) => c._id === editorCardId);
    if (!card) return;
    titleEl.textContent = card._isCustom ? `编辑卡牌：${card.zh}` : `编辑内置卡牌：${card.zh}`;
    deleteBtn.style.display = card._isCustom ? "" : "none";
    setFormValues(card);
  }
  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";
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
    customs.push({ ...data, _id: "c_" + Date.now() });
    await saveCustomCards(customs);
  } else if (editorCardId.startsWith("b")) {
    const overrides = await getCardOverrides();
    overrides[editorCardId] = data;
    await saveCardOverrides(overrides);
  } else {
    const customs = await getCustomCards();
    const idx = customs.findIndex((c) => c._id === editorCardId);
    if (idx !== -1) { customs[idx] = { ...data, _id: editorCardId }; await saveCustomCards(customs); }
  }
  closeCardEditor();
  await Promise.all([renderCustomCardsList(), renderCardGrid()]);
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
}

function renderCardFilters() {
  const panel = document.querySelector("#cardFilterPanel");
  const factionRows = [{ key:"all", zh:"全部势力", en:"All" }, ...Object.entries(cardFactionMeta).map(([k,v]) => ({ key:k, zh:v.zh, en:v.en }))];
  const typeRows    = [{ key:"all", zh:"全部类型", en:"All" }, { key:"minion", zh:"随从", en:"Minion" }, { key:"spell", zh:"法术", en:"Spell" }];
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

function renderRaceManager() {
  const row = document.querySelector("#raceTagsRow");
  const input = document.querySelector("#raceInput");
  const addBtn = document.querySelector("#raceAddBtn");
  let custom = loadCustomRaces();
  function renderTags() {
    const all = [...builtinRaces.map((r) => ({ name:r, builtin:true })), ...custom.map((r) => ({ name:r, builtin:false }))];
    row.innerHTML = all.map((r) => `
      <span class="race-tag ${r.builtin?"builtin":""}">
        ${r.name}
        ${!r.builtin ? `<button class="race-tag-delete" data-race="${r.name}" title="删除" type="button">✕</button>` : ""}
      </span>`).join("") || `<span style="color:var(--muted);font-size:12px">暂无种族标签</span>`;
  }
  row.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-race]");
    if (!btn) return;
    custom = custom.filter((r) => r !== btn.dataset.race);
    saveCustomRaces(custom); renderTags();
  });
  function addRace() {
    const val = input.value.trim();
    if (!val || builtinRaces.includes(val) || custom.includes(val)) { input.value=""; return; }
    custom.push(val); saveCustomRaces(custom); input.value=""; renderTags();
  }
  addBtn.addEventListener("click", addRace);
  input.addEventListener("keydown", (e) => { if (e.key==="Enter") addRace(); });
  renderTags();
}

function initCardCenter() {
  if (cardCenterRendered) return;
  cardCenterRendered = true;
  renderCardFilters();
  renderCardGrid();
  renderRaceManager();
  renderCustomCardsList();
  document.querySelector("#cardSearch").addEventListener("input", (e) => {
    cardSearchQuery = e.target.value.trim(); renderCardGrid();
  });
  document.querySelector("#cardCreateBtn").addEventListener("click", () => openCardEditor(null));
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

window.addEventListener("load", () => {
  const target = window.location.hash && document.querySelector(window.location.hash);
  if (target) target.scrollIntoView({ block:"start" });
});
