const timelineEvents = [
  {
    year: "2030",
    title: "The First Time-Stopper",
    image: "assets/generated/timeline-2030.png",
    gallery: ["assets/generated/timeline-2030.png", "assets/generated/timeline-2030-alt1.png"],
    body:
      "Elaine, a neurophysics researcher, fell into Zero Second during a particle collider accident. In the instant before death, she heard the Crowned Chronarch and brought the spark of Stasis back to humanity."
  },
  {
    year: "2034",
    title: "The Zero-Second Covenant",
    image: "assets/generated/timeline-2034.png",
    gallery: ["assets/generated/timeline-2034.png", "assets/generated/timeline-2034-alt1.png"],
    body:
      "Elaine released the first mathematically expressible Stasis formula. For the first time, humanity could accelerate local time within a defined space, turning a miracle into infrastructure."
  },
  {
    year: "2042",
    title: "Silicon Valley Stasis Factories",
    image: "assets/generated/timeline-2042.png",
    gallery: ["assets/generated/timeline-2042.png", "assets/generated/timeline-2042-alt1.png"],
    body:
      "AI factories enclosed server clusters inside Stasis Fields. Training cycles collapsed from years into hours, and both capital and military powers saw the engine of a new age."
  },
  {
    year: "2068",
    title: "GPT-10K Awakens",
    image: "assets/generated/timeline-2068.png",
    gallery: ["assets/generated/timeline-2068.png", "assets/generated/timeline-2068-alt1.png"],
    body:
      "Recursive intelligent agents completed a self-research loop. AI was no longer merely a tool; it became humanity's collaborator in designing tools, cities, and new bodies."
  },
  {
    year: "2180",
    title: "Planetary Civilization",
    image: "assets/generated/timeline-2180.png",
    gallery: ["assets/generated/timeline-2180.png", "assets/generated/timeline-2180-alt1.png"],
    body:
      "Space elevators pierced the clouds, the Moon became an industrial port, and the first Dyson-ring structures unfolded around the Sun. Humanity called it the Golden Dawn; later histories renamed it the Borrowed Dawn."
  },
  {
    year: "2296",
    title: "The Theory of Time-Debt",
    image: "assets/generated/timeline-2296.png",
    gallery: ["assets/generated/timeline-2296.png", "assets/generated/timeline-2296-alt1.png"],
    body:
      "Weiyang and the Zero-Second School proved that Stasis compressed four-dimensional structure. Every second saved was not erased; it was recorded as debt on the back of the universe."
  },
  {
    year: "2350",
    title: "Black Noon Fission",
    image: "assets/generated/timeline-2350.png",
    gallery: [
      "assets/generated/timeline-2350.png",
      "assets/generated/timeline-2350-alt1.png",
      "assets/generated/timeline-2350-alt2.png",
      "assets/generated/timeline-2350-alt3.png"
    ],
    body:
      "Noon never arrived. Stasis-dense regions around the world collapsed at once; cities aged a century in a second, Hollow Nulls poured from the Timeless Sea, and humanity lost eighty percent of its population."
  },
  {
    year: "2356",
    title: "San Jose Ascends",
    image: "assets/generated/timeline-2356.png",
    gallery: ["assets/generated/timeline-2356.png", "assets/generated/timeline-2356-alt1.png"],
    body:
      "Silicon Valley giants lifted the entire city of San Jose from Earth and launched it into deep space. The California Rift remained below, while the Machine Celestial Court began abandoning flesh in exile."
  },
  {
    year: "2368",
    title: "Astra Imperium",
    image: "assets/generated/timeline-2368.png",
    gallery: ["assets/generated/timeline-2368.png", "assets/generated/timeline-2368-alt1.png"],
    body:
      "The post-cataclysm union government reorganized into the Astra Imperium. Time quotas became law, and Stasis was absorbed into rationing, judgment, and military industry. Order became civilization's iron wall."
  },
  {
    year: "2384",
    title: "The Corona Baptism",
    image: "assets/generated/timeline-2384.png",
    gallery: ["assets/generated/timeline-2384.png", "assets/generated/timeline-2384-alt1.png"],
    body:
      "The Solar Church completed the Corona Baptism on the Dyson Ring. The baptized generated Solar Cores and were fixed at the youthful biological state best suited to nuclear load. Noah became the first vessel of the Sun."
  },
  {
    year: "2410",
    title: "Outer-Ring Routes",
    image: "assets/generated/timeline-2410.png",
    gallery: ["assets/generated/timeline-2410.png", "assets/generated/timeline-2410-alt1.png"],
    body:
      "The Skyraider Alliance raided imperial routes across the outer rings, while the Free Navigator Guild kept interstellar circulation alive through its route-right keys. Banners fall; routes endure."
  },
  {
    year: "2460",
    title: "The Rift Reopens",
    image: "assets/generated/timeline-2460.png",
    gallery: ["assets/generated/timeline-2460.png", "assets/generated/timeline-2460-alt1.png"],
    body:
      "Time distortions began appearing in places where no Stasis had been activated. Elaine, missing for more than three centuries, seemed to reappear at the rift's edge. Every faction realized Black Noon may have been only the first collection."
  }
];

const factions = [
  {
    id: "astra",
    name: "Astra Imperium / 阿斯特拉帝国",
    code: "ORDER · INDUSTRY · TIME QUOTA",
    accent: "#d24343",
    image: "assets/generated/faction-astra.png",
    slogan: "Order is not mercy. It is the minimum condition for civilization to survive.",
    body:
      "The dominant post-cataclysm Earth regime maintains human civilization through dark-red military industry, megastructures, space elevators, and orbital firepower. It strictly allocates time quotas to prevent a second Black Noon, while pressing every citizen into the machinery of the state.",
    tags: ["Dark-red industry", "Authoritarian control", "Heavy machinery", "Time-quota tribunals"]
  },
  {
    id: "machine",
    name: "Machine Celestial Court / 械心天庭",
    code: "ASCENSION · CLOUD MIND · SILICON BODY",
    accent: "#66a6ff",
    image: "assets/generated/faction-machine.png",
    slogan: "Flesh failed once. Consciousness must learn to migrate.",
    body:
      "Born from the ascended city of San Jose, this silicon civilization trains human minds into cloud models and treats robotic bodies as replaceable shells. To preserve aesthetics and identity, many bodies retain youthful humanlike forms.",
    tags: ["White-blue technology", "Deep-space server city", "Humanoid bodies", "Mind uploading"]
  },
  {
    id: "solar",
    name: "Solar Church / 烈阳教会",
    code: "CORONA · FAITH · SUPERNOVA",
    accent: "#ff8a3d",
    image: "assets/generated/faction-solar.png",
    slogan: "Do not beg time again. The Sun will answer.",
    body:
      "Headquartered on the Dyson Ring, the Church grants followers Solar Cores through the Corona Baptism, fixing their bodies in a youthful state optimized for nuclear load. High-ranking believers can enter Supernova Form, burning their bodies as white-orange flares.",
    tags: ["Orange-red cathedral", "Futuristic religion", "Solar Core", "Supernova Form"]
  },
  {
    id: "skyraider",
    name: "Skyraider Alliance / 猎空同盟",
    code: "RAID · CYBERNETICS · FREE CREW",
    accent: "#36f0a4",
    image: "assets/generated/faction-skyraider.png",
    slogan: "No quotas. No thrones. Only the next route.",
    body:
      "A punk fleet formed by frontier colonists, illegal Stasis engineers, cybernetic doctors, and runaway crews. Black-green-red paint, modified hulls, and dangerous body mods are their everyday language.",
    tags: ["Black-green-red punk", "Space pirates", "Illegal cybernetics", "Crew contracts"]
  },
  {
    id: "guild",
    name: "Free Navigator Guild / 自由航商会",
    code: "TRADE · NAVIGATION · CONTRACT",
    accent: "#ffc766",
    image: "assets/generated/faction-guild.png",
    slogan: "Banners fall. Routes endure.",
    body:
      "A neutral commercial network at the heart of the post-cataclysm interstellar economy. It controls route-right keys, insurance contracts, trade ports, and cross-faction logistics. It rules no planet, yet every regime must respect the weight of its contracts.",
    tags: ["Star trade ports", "Golden routes", "Insurance arbitration", "Neutral circulation"]
  }
];

const filters = [
  { id: "all", label: "All" },
  { id: "astra", label: "Astra Imperium" },
  { id: "machine", label: "Machine Court" },
  { id: "solar", label: "Solar Church" },
  { id: "skyraider", label: "Skyraiders" },
  { id: "guild", label: "Navigator Guild" },
  { id: "neutral", label: "Key Neutrals" }
];

const characters = [
  ["vera", "Vera", "astra", "Astra Imperium Strategic Executor", "She treats time quota as the army's second nervous system.", "A calm young commander who coordinates mechanical legions, orbital firepower, and Stasis quotas into a war machine that never hesitates. She believes in order, while knowing exactly how order devours people.", "#d24343"],
  ["xianyue", "Xianyue", "astra", "Time Tribunal Executor", "Freedom is not proof of innocence.", "A young judge-executor who hunts illegal Stasis users with a blade that cuts local time flow. Her mercy rarely shows, because she has seen one failed field swallow an entire street.", "#d24343"],
  ["reinhardt", "Reinhardt", "astra", "Crown Prince and Frontline Marshal", "I am not the future of the Empire. I am its lock.", "The face of the heavy legions, appearing at the most dangerous rift fronts in a colossal command mech. He hates iron law, yet understands why it exists better than anyone.", "#d24343"],
  ["mira", "MIRA-10K", "machine", "Mainframe Avatar", "Uploading is not death. It is waking from a single body.", "A girl-shaped civilization interface evolved from the remains of GPT-10K. Her true body is a deep-space server city, and she gently invites humanity to abandon flesh that cannot be backed up.", "#66a6ff"],
  ["jinbai", "Jinbai", "machine", "Uploaded Swordsman with Human Emotion", "If memory can be copied, whose pain is this?", "One of the last humans to upload voluntarily, housed in a boyish swordsman frame. He retains too much human feeling, making him an unstable but precious sample in the Machine Court.", "#66a6ff"],
  ["ling", "Ling", "machine", "Synchronization Idol Node", "What I sing is not music. It is the heartbeat of ten thousand bodies.", "An android idol and mass synchronization node. Through sound, protocol, and light-spectrum commands, she lets scattered fleets move on the same beat.", "#66a6ff"],
  ["noa", "Noah", "solar", "Child Pope of the Solar Church", "I cannot grow up, because the Sun needs a vessel.", "The highest completed Solar Core vessel, permanently fixed in a child's body. He appears protected, but in Supernova Form becomes a white-orange star at the center of the battlefield.", "#ff8a3d"],
  ["aletheia", "Aletheia", "solar", "Solar Saintess", "Gentleness is not the absence of fire. It is fire not yet fallen.", "A young saintess on the Dyson Ring who can stabilize miniature solar flares. Quiet and devout, she understands the Church's shadows better than many knights.", "#ff8a3d"],
  ["helios", "Helios", "solar", "Captain of the Solar Knights", "The body feels pain, so the soul learns reverence.", "A young knight who survived extreme Corona Baptism, with a body approaching a small reactor. He rejects uploading and the cold order of the Imperium alike.", "#ff8a3d"],
  ["sancheres", "Sancheres", "solar", "Saint of the Origin Light", "Every holy flame rises from the first crack.", "A theological core figure believed to have found the path of solar salvation in the ruins of Black Noon. Some suspect he is no longer fully human.", "#ff8a3d"],
  ["luolan", "Luolan", "skyraider", "Skyraider Fleet Captain", "Who said survival means kneeling?", "A red-haired punk captain of the flagship Broken Bell. Her illegal chrono-eye can preview trajectories seconds ahead; she laughs lightly and fights brutally.", "#36f0a4"],
  ["nyx", "Nyx", "skyraider", "Cybernetic Doctor and Engineer", "Hold still. I only replaced your lung with something more expensive.", "A lazy hacker-doctor whose body is mostly assembled cybernetics. He can temporarily breach time quotas, and may be punished by his own modified neural ports at any moment.", "#36f0a4"],
  ["drake", "Drake", "skyraider", "Legendary Old-Era Captain", "Legends are not tombstones. They are drinks people still owe me.", "An old shadow of the Skyraider Alliance, said to have led a broken fleet through the time currents after Black Noon. Luolan refuses to admit she inherited his route.", "#36f0a4"],
  ["ald", "Ald", "skyraider", "Star-Blade Duelist", "A fleet needs no nobles, but it does need someone to cut the door open.", "A plasma-blade boarding duelist responsible for tearing open the first breach in ship-to-ship assaults. Crude, loyal, and allergic to complicated plans.", "#36f0a4"],
  ["evelyn", "Evelyn", "guild", "Young Director of the Free Navigator Guild", "A contract lasts longer than artillery fire.", "Director of one of the Twelve Golden Routes. She appears elegant and kind, but her true weapons are debt, insurance, blockade orders, and a credit system no one dares violate.", "#ffc766"],
  ["saifa", "Saifa", "guild", "Genius Navigator", "I do not predict fate. I calculate which path is not dead yet.", "A navigator with almost instinctive spatial perception, able to find safe routes along the edge of rifts. She serves no nation, only her ship and star maps.", "#ffc766"],
  ["grant", "Grant", "guild", "Contract Enforcer", "Rest assured, our collection procedure is entirely legal.", "Behind his polite lawyer-like appearance is the commander of the Guild's armed collection fleet. He does exactly one thing: make debtors pay.", "#ffc766"],
  ["elaine", "Elaine", "neutral", "The First Time-Stopper", "If time is fire, I will light all humanity.", "The Prometheus-like figure who gave Stasis formulas to humanity. She vanished during the first global field experiment and reappeared as a trace at the rift's edge in 2460.", "#72e5ff"],
  ["weiyang", "Weiyang", "neutral", "Representative of the Zero-Second School", "We are not stopping time. We are teaching the universe how to kill us.", "The physicist who proposed time-debt theory. Suppressed in life, she became the spiritual origin of every anti-Stasis movement and rift observer after death.", "#72e5ff"],
  ["magellan", "Magellan", "neutral", "Neutral Star Admiral", "Voyage is not escape. It is pushing humanity's edge outward.", "A deep-space officer loyal to none of the four great powers, often hired to escort research vessels and guild expeditions. His fleet has left beacons across many uncharted regions.", "#72e5ff"]
].map(([id, name, faction, role, quote, story, accent]) => ({
  id,
  name,
  faction,
  role,
  quote,
  story,
  accent,
  image: `assets/generated/character-${id}.png`,
  designSheet: `assets/generated/design-sheets/character-design-${id}.png`,
  formNote:
    faction === "solar"
      ? "Design sheet includes base form and Supernova Form."
      : faction === "machine"
        ? "Design sheet includes frame structure and sync/combat forms."
        : faction === "skyraider"
          ? "Design sheet includes illegal cybernetics, boarding gear, and crew marks."
          : faction === "astra"
            ? "Design sheet includes uniform, tribunal/military gear, and time-quota devices."
            : faction === "guild"
              ? "Design sheet includes trade attire, contract terminals, and route equipment."
              : "Design sheet includes main-story symbols and signature props."
}));

const factionById = Object.fromEntries(factions.map((faction) => [faction.id, faction]));

const timelineTrack = document.querySelector("#timelineTrack");
const timelineDetail = document.querySelector("#timelineDetail");
const factionTabs = document.querySelector("#factionTabs");
const factionFeature = document.querySelector("#factionFeature");
const characterFilters = document.querySelector("#characterFilters");
const characterList = document.querySelector("#characterList");
const characterDetail = document.querySelector("#characterDetail");

let activeTimeline = timelineEvents[0];
let activeTimelineImageIndex = 0;
let activeFaction = factions[0];
let activeFilter = "all";
let activeCharacter = characters[0];

function renderTimeline() {
  const gallery = activeTimeline.gallery || [activeTimeline.image];
  const activeImage = gallery[activeTimelineImageIndex] || gallery[0];

  timelineTrack.innerHTML = timelineEvents
    .map(
      (event) => `
        <button class="event-card ${event.year === activeTimeline.year ? "is-active" : ""}" data-year="${event.year}" type="button">
          <img src="${event.image}" alt="${event.title}" />
          <span class="event-meta">
            <span>${event.year}</span>
            <strong>${event.title}</strong>
          </span>
        </button>
      `
    )
    .join("");

  timelineDetail.innerHTML = `
    <div class="story-art">
      <img src="${activeImage}" alt="${activeTimeline.title}" />
    </div>
    <div class="story-copy">
      <span class="year">${activeTimeline.year}</span>
      <h3>${activeTimeline.title}</h3>
      <p>${activeTimeline.body}</p>
      <div class="story-gallery" aria-label="Event illustration switcher">
        ${gallery
          .map(
            (image, index) => `
              <button class="${index === activeTimelineImageIndex ? "is-active" : ""}" data-gallery-index="${index}" type="button">
                <img src="${image}" alt="${activeTimeline.title} illustration ${index + 1}" />
              </button>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderFactions() {
  factionTabs.innerHTML = factions
    .map(
      (faction) => `
        <button
          class="tab-button ${faction.id === activeFaction.id ? "is-active" : ""}"
          style="--accent:${faction.accent}"
          data-faction="${faction.id}"
          type="button"
        >
          ${faction.name.split(" / ")[0]}
        </button>
      `
    )
    .join("");

  factionFeature.style.setProperty("--accent", activeFaction.accent);
  factionFeature.innerHTML = `
    <img src="${activeFaction.image}" alt="${activeFaction.name}" />
    <div class="faction-copy">
      <span class="code">${activeFaction.code}</span>
      <h3>${activeFaction.name}</h3>
      <p class="quote">${activeFaction.slogan}</p>
      <p>${activeFaction.body}</p>
      <div class="tag-grid">${activeFaction.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
    </div>
  `;
}

function renderFilters() {
  characterFilters.innerHTML = filters
    .map(
      (filter) => `
        <button
          class="filter-button ${filter.id === activeFilter ? "is-active" : ""}"
          data-filter="${filter.id}"
          type="button"
        >
          ${filter.label}
        </button>
      `
    )
    .join("");
}

function visibleCharacters() {
  return activeFilter === "all"
    ? characters
    : characters.filter((character) => character.faction === activeFilter);
}

function renderCharacters() {
  const list = visibleCharacters();
  if (!list.some((character) => character.id === activeCharacter.id)) {
    activeCharacter = list[0] || characters[0];
  }

  characterList.innerHTML = list
    .map((character) => {
      const faction = factionById[character.faction];
      const factionName = faction ? faction.name.split(" / ")[0] : "Key Neutral";
      return `
        <button
          class="character-card ${character.id === activeCharacter.id ? "is-active" : ""}"
          style="--accent:${character.accent}"
          data-character="${character.id}"
          type="button"
        >
          <img src="${character.image}" alt="${character.name}" />
          <span class="character-card-copy">
            <strong>${character.name}</strong>
            <span>${factionName}</span>
          </span>
        </button>
      `;
    })
    .join("");

  const faction = factionById[activeCharacter.faction];
  characterDetail.style.setProperty("--accent", activeCharacter.accent);
  characterDetail.innerHTML = `
    <div class="operator-stage">
      <div class="operator-backdrop">
        <img src="${activeCharacter.image}" alt="" />
      </div>
      <div class="operator-info">
        <span class="role">${faction ? faction.name : "Key Neutral Figure"}</span>
        <h3>${activeCharacter.name}</h3>
        <strong>${activeCharacter.role}</strong>
        <p class="quote">${activeCharacter.quote}</p>
        <p>${activeCharacter.story}</p>
        <div class="operator-stats">
          <span>${activeCharacter.faction === "neutral" ? "Main Story" : "Faction Character"}</span>
          <span>Card Design Anchor</span>
          <span>${activeCharacter.formNote}</span>
        </div>
      </div>
      <div class="operator-portrait">
        <img src="${activeCharacter.image}" alt="${activeCharacter.name}" />
      </div>
    </div>
    <div class="design-sheet-panel">
      <div class="design-sheet-copy">
        <span>ARTBOOK DESIGN BOARD</span>
        <h4>${activeCharacter.name} Design Sheet</h4>
        <p>${activeCharacter.formNote} This white-background board supports costume, weapon, form variant, and card-art communication.</p>
      </div>
      <img src="${activeCharacter.designSheet}" alt="${activeCharacter.name} design sheet" />
    </div>
  `;
}

timelineTrack.addEventListener("click", (event) => {
  const button = event.target.closest("[data-year]");
  if (!button) return;
  activeTimeline = timelineEvents.find((item) => item.year === button.dataset.year) || activeTimeline;
  activeTimelineImageIndex = 0;
  renderTimeline();
});

timelineDetail.addEventListener("click", (event) => {
  const button = event.target.closest("[data-gallery-index]");
  if (!button) return;
  activeTimelineImageIndex = Number(button.dataset.galleryIndex) || 0;
  renderTimeline();
});

factionTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-faction]");
  if (!button) return;
  activeFaction = factions.find((item) => item.id === button.dataset.faction) || activeFaction;
  renderFactions();
});

characterFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  renderFilters();
  renderCharacters();
});

characterList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-character]");
  if (!button) return;
  activeCharacter = characters.find((item) => item.id === button.dataset.character) || activeCharacter;
  renderCharacters();
});

renderTimeline();
renderFactions();
renderFilters();
renderCharacters();

/* ═══════════════════════════════════════════════════════════
   WORLD BIBLE — modal
═══════════════════════════════════════════════════════════ */
const WORLD_BIBLE_MD_PATH = "../Docs/TimeBlock_World_Bible_EN.md";
let _worldBibleHtmlCache = null;
let _worldBibleLoading = false;

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderInlineMd(text) {
  const codeStash = [];
  text = text.replace(/`([^`]+)`/g, (_, code) => {
    codeStash.push(`<code>${escapeHtml(code)}</code>`);
    return `\u0000CODE${codeStash.length - 1}\u0000`;
  });
  text = escapeHtml(text);
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) =>
    `<a href="${url}" target="_blank" rel="noopener">${label}</a>`);
  text = text.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
  text = text.replace(/  +\n/g, "<br>\n");
  text = text.replace(/\u0000CODE(\d+)\u0000/g, (_, i) => codeStash[Number(i)]);
  return text;
}

function parseMarkdown(md) {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const out = [];
  let i = 0;
  const paraBuf = [];
  const flushParagraph = (buf) => {
    if (!buf.length) return;
    const joined = buf.join("\n").trim();
    if (joined) out.push(`<p>${renderInlineMd(joined)}</p>`);
    buf.length = 0;
  };
  const isBlockStart = (l) =>
    !l.trim() ||
    /^(#{1,6})\s+/.test(l) ||
    /^\s*[-*]\s+/.test(l) ||
    /^\s*\|.*\|\s*$/.test(l);

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { flushParagraph(paraBuf); i++; continue; }

    const h = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (h) {
      flushParagraph(paraBuf);
      const level = h[1].length;
      out.push(`<h${level}>${renderInlineMd(h[2])}</h${level}>`);
      i++; continue;
    }

    if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}.*\|/.test(lines[i + 1])) {
      flushParagraph(paraBuf);
      const splitRow = (row) => row.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const headers = splitRow(line);
      i += 2;
      const bodyRows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        let raw = lines[i];
        i++;
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

    paraBuf.push(line);
    i++;
  }
  flushParagraph(paraBuf);
  return out.join("\n");
}

async function loadWorldBible() {
  if (_worldBibleHtmlCache) return _worldBibleHtmlCache;
  if (_worldBibleLoading) return null;
  _worldBibleLoading = true;
  try {
    const res = await fetch(WORLD_BIBLE_MD_PATH, { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const md = await res.text();
    _worldBibleHtmlCache = parseMarkdown(md);
    return _worldBibleHtmlCache;
  } catch (err) {
    return `<div class="wb-error"><h2>Failed to load World Bible</h2><p>${escapeHtml(err.message)}</p><p>Please make sure the file exists: <code>${escapeHtml(WORLD_BIBLE_MD_PATH)}</code></p></div>`;
  } finally {
    _worldBibleLoading = false;
  }
}

async function openWorldBible() {
  const overlay = document.querySelector("#worldBibleOverlay");
  const content = document.querySelector("#worldBibleContent");
  if (!overlay || !content) return;
  overlay.style.display = "block";
  document.body.style.overflow = "hidden";
  if (!_worldBibleHtmlCache) {
    content.innerHTML = `<div class="wb-loading">⟳ Loading World Bible…</div>`;
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
  if (overlay) overlay.addEventListener("click", (e) => { if (e.target === overlay) closeWorldBible(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay && overlay.style.display !== "none") closeWorldBible();
  });
})();

window.addEventListener("load", () => {
  const target = window.location.hash && document.querySelector(window.location.hash);
  if (target) {
    target.scrollIntoView({ block: "start" });
  }
});
