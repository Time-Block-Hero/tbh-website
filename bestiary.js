const bestiaryRecords = [
  {
    id: "puru-beast",
    group: "wildlife",
    status: "confirmed",
    accent: "#70e5dc",
    zhName: "噗噜兽",
    enName: "Puru Beast",
    zhSubtitle: "温顺的磁结节群居兽",
    enSubtitle: "Gentle magnetic-nodule herd animal",
    zhSummary: "一种与星际物流文明形成稳定共生关系的温顺外星群居兽。它们不是被制造出来的运输工具，而是凭借强健身体、社会性与背部磁结节，自然进入了港口和航线生态。",
    enSummary: "A gentle alien herd species that has formed a stable partnership with interstellar logistics. Puru Beasts were never engineered as cargo tools; their strength, social nature, and dorsal magnetic nodules made them natural companions of ports and trade routes.",
    zhClass: "自然生命 · 奇兽",
    enClass: "Natural life · Wildlife",
    zhHabitat: "轨道港、温带殖民地、货运栖息舱",
    enHabitat: "Orbital ports, temperate colonies, freight habitats",
    zhDiet: "高纤维外星植料与矿物盐",
    enDiet: "Fibrous alien forage and mineral salts",
    zhActivity: "昼行 · 群居 · 可驯养",
    enActivity: "Diurnal · Social · Trainable",
    zhEcology: "野生噗噜兽会以家庭群为单位迁徙，成年个体围成松散外圈，让幼兽在内部休息。背部磁结节能感知局部磁场并吸附轻量矿物，在人类港口中则可连接不会刺穿皮肤的模块化货架。",
    enEcology: "Wild Puru travel in family herds. Adults form a loose outer ring while calves rest within. Their dorsal nodules sense local magnetic fields and collect light minerals; in human ports they accept modular racks that attach without piercing the skin.",
    zhRelations: "自由航商会把成年噗噜视为可靠的货运伙伴，并为跨航线个体登记休息周期与家庭关系。幼兽好奇、奔跑速度惊人，常成为货运站事故报告里最无害却最频繁的主角。",
    enRelations: "The Free Trade Guild treats mature Puru as logistics partners and records rest cycles and family bonds across routes. Juveniles are curious and unexpectedly fast, making them frequent—but usually harmless—subjects of port incident reports.",
    zhTraits: ["海泡绿短毛与暖奶油色面罩", "珊瑚色内侧的柔性高耸感知耳鳍", "四至六枚珍珠质背部磁结节", "带青色星形高光的深色眼睛", "情绪增强时变亮的青色面颊星斑", "成年个体通过普通生长变得更长、更宽、更沉稳"],
    enTraits: ["Seafoam coat with a warm cream facial mask", "Tall flexible sensory ear-fins with coral inner surfaces", "Four to six pearlescent dorsal magnetic nodules", "Dark eyes with cyan star-shaped catchlights", "Cyan cheek freckles that brighten with emotion", "Adults grow longer, broader, heavier, and calmer without metamorphosis"],
    tagsZh: ["群居", "港口共生", "磁场感知", "货运伙伴", "温顺"],
    tagsEn: ["Herd", "Port symbiosis", "Magnetic sense", "Cargo partner", "Gentle"],
    illustration: "./assets/creature-concepts/puru-beast/illustration.png",
    concept: "./assets/creature-concepts/puru-beast/concept-sheet.png",
    specimens: [
      { src: "./assets/card-art/rampaging-puru-beast/rampaging-puru-beast-01.png", zh: "横行噗噜兽 · 青年个体", en: "Rampaging Puru · Young adult" },
      { src: "./assets/card-art/cargo-puru-beast/cargo-puru-beast-01.png", zh: "货运噗噜兽 · 成年工作个体", en: "Cargo Puru · Mature worker" }
    ]
  },
  {
    id: "borrowed-time-mayfly",
    group: "wildlife",
    status: "confirmed",
    accent: "#9edcff",
    zhName: "借时蜉蝣",
    enName: "Borrowed-Time Mayfly",
    zhSubtitle: "在数分钟里度过数十年的静域昆虫",
    enSubtitle: "A stasis insect that lives decades within minutes",
    zhSummary: "栖息于废弃静域设施附近的米级昆虫。成虫在外界只存活数分钟，却会在自己的主观时间中经历漫长成年期；整个族群能在一次站内晨曦里完成羽化、求偶与死亡。",
    enSummary: "Meter-scale insects found around abandoned stasis facilities. Adults survive only minutes to outside observers while experiencing decades of subjective adulthood; a colony can emerge, mate, and die within one station dawn.",
    zhClass: "自然生命 · 时域适应种",
    enClass: "Natural life · Temporal-adapted",
    zhHabitat: "废弃静域发生器、冷却池与时间残响区",
    enHabitat: "Abandoned stasis generators, cooling pools, temporal echoes",
    zhDiet: "幼体滤食冷却池微生物；成虫几乎不摄食",
    enDiet: "Larvae filter cooling-pool microbes; adults barely feed",
    zhActivity: "集体羽化 · 极短外部寿命",
    enActivity: "Mass emergence · Extremely brief external life",
    zhEcology: "幼体长期潜伏在静域冷却液形成的浅池中，只在残余界膜达到特定振幅时同时羽化。翅膜上的同心环不是机械刻度，而是组织在不同时间速率下留下的生长纹。",
    enEcology: "Larvae remain in shallow pools formed by stasis coolant and emerge together only when remnant field membranes reach a specific amplitude. Concentric wing rings are not machinery but growth marks laid down at different temporal rates.",
    zhRelations: "零秒学派利用蜉蝣羽化时间判断废墟是否仍有活动时痕；黑市则会捕捉成虫制作非法静域校准器。离开原生场域后，它们通常会迅速失去时间稳定性。",
    enRelations: "Zero-Second researchers use emergence timing to detect active time scars. Black markets trap adults for illegal stasis calibration, though the insects rapidly lose temporal stability outside their native field.",
    zhTraits: ["珍珠质分节外骨骼", "四片带同心生长环的透明翅膜", "同一个体不同年龄阶段的相位残影", "细长尾丝和可感知界膜振动的触角"],
    enTraits: ["Pearlescent segmented exoskeleton", "Four transparent wings with concentric growth rings", "Phase echoes of the same animal at different ages", "Long tail filaments and membrane-sensitive antennae"],
    tagsZh: ["静域", "集体羽化", "主观长寿", "短命", "环境指示种"],
    tagsEn: ["Stasis", "Mass emergence", "Subjective longevity", "Short-lived", "Indicator species"],
    illustration: "./assets/creature-concepts/borrowed-time-mayfly/illustration.png",
    concept: "./assets/creature-concepts/borrowed-time-mayfly/concept-sheet.png"
  },
  {
    id: "navigation-sailbeast",
    group: "wildlife",
    status: "confirmed",
    accent: "#78cfff",
    zhName: "航灯帆兽",
    enName: "Navigation Sailbeast",
    zhSubtitle: "沿恒星风迁徙的活体航标",
    enSubtitle: "A living beacon that migrates on stellar wind",
    zhSummary: "巨型真空适应生物，能够展开三叶式生物光帆并顺恒星风跨越航区。腹部发光器官会持续校正安全方向，令迁徙群成为天然的深空航标。",
    enSummary: "A gigantic vacuum-adapted organism whose three-lobed living sails carry it across regions on stellar wind. Ventral photophores continually align toward safer corridors, turning migrations into natural deep-space beacons.",
    zhClass: "自然生命 · 真空迁徙种",
    enClass: "Natural life · Vacuum migrant",
    zhHabitat: "恒星风通道、轨道巨构外缘、低尘航区",
    enHabitat: "Stellar-wind corridors, megastructure rims, low-dust routes",
    zhDiet: "带电尘埃、恒星风粒子与稀薄气体",
    enDiet: "Charged dust, stellar particles, and trace gas",
    zhActivity: "长距离迁徙 · 小群活动",
    enActivity: "Long migration · Small groups",
    zhEcology: "帆兽通过宽阔而薄的三叶帆膜收集带电粒子，同时借光压和磁场改变轨迹。幼体跟随成年个体腹部的青琥珀色灯列学习迁徙路线。它们不会在真空中像鱼一样摆动游泳。",
    enEcology: "Sailbeasts gather charged particles with broad three-lobed membranes, steering through radiation pressure and magnetic fields. Juveniles learn migration paths by following cyan-amber ventral light rows. They do not swim through vacuum like fish.",
    zhRelations: "航商测绘船通常保持距离伴飞，以迁徙群判断航道季节性变化；擅自改变灯列或驱赶兽群被视为会危及整条航线的重罪。",
    enRelations: "Guild survey craft accompany herds at a respectful distance to read seasonal route changes. Spoofing their light rows or driving away a migration is treated as a crime against the entire corridor.",
    zhTraits: ["梭形脊骨与明显腹部龙骨", "三叶式半透明生物帆", "青色与琥珀色腹部光点", "柔性矿物质皮肤和低阻力头部"],
    enTraits: ["Spindle body with a pronounced ventral keel", "Three-lobed translucent living sails", "Cyan and amber ventral photophores", "Flexible mineral skin and a low-drag head"],
    tagsZh: ["恒星风", "迁徙", "活体航标", "真空生态", "航商保护"],
    tagsEn: ["Stellar wind", "Migration", "Living beacon", "Vacuum ecology", "Guild protection"],
    illustration: "./assets/creature-concepts/navigation-sailbeast/illustration.png",
    concept: "./assets/creature-concepts/navigation-sailbeast/concept-sheet.png"
  },
  {
    id: "star-shell-packbeast",
    group: "wildlife",
    status: "confirmed",
    accent: "#8ee8e8",
    zhName: "星壳驮兽",
    enName: "Star-Shell Packbeast",
    zhSubtitle: "背负矿脉与微型生态的六足重兽",
    enSubtitle: "A six-legged giant carrying ore and micro-ecology",
    zhSummary: "生活在小行星矿区的六足重型食矿兽。其层叠背甲会静电吸附宇宙尘埃，并在长期休息时缓慢结晶出低纯度星能矿。",
    enSummary: "A massive six-legged mineral grazer of asteroid belts. Its layered dorsal shell electrostatically gathers cosmic dust and slowly crystallizes low-grade star-energy deposits while the animal rests.",
    zhClass: "自然生命 · 食矿巨兽",
    enClass: "Natural life · Mineral grazer",
    zhHabitat: "小行星矿带、低重力荒原、露天采矿营地",
    enHabitat: "Asteroid belts, low-gravity barrens, open mining camps",
    zhDiet: "硅酸盐、含铁岩屑与微量星能矿",
    enDiet: "Silicates, ferrous rubble, and trace star ore",
    zhActivity: "缓慢群居 · 长时间静止",
    enActivity: "Slow herds · Long stationary periods",
    zhEcology: "六条承重腿把重量分散到松散地表，楔形头部从岩层中刮取矿物。老年个体的背甲沟槽会积聚水分、苔状生物和结晶体，逐渐形成可随迁徙移动的小型生态岛。",
    enEcology: "Six load-bearing legs spread weight across loose terrain while a wedge-shaped head scrapes minerals from rock. Grooves on old animals collect moisture, moss-like growth, and crystals, becoming moving ecological islands.",
    zhRelations: "负责任的矿工只收集背甲最外层的成熟晶簇，并在兽群移动前拆除脚手架。过度采掘会损坏保温甲层，曾引发多起殖民地禁采令。",
    enRelations: "Responsible miners harvest only mature outer crystals and remove scaffolds before a herd moves. Deep extraction damages insulating shell layers and has prompted several colonial mining bans.",
    zhTraits: ["低伏的长躯干与三对承重腿", "楔形掘食头部", "可吸附尘埃的层状矿物背甲", "老年背甲上的晶簇与共生植被"],
    enTraits: ["Low elongated body with three pairs of load-bearing legs", "Wedge-shaped grazing head", "Layered mineral shell that collects dust", "Crystals and symbiotic growth on old shells"],
    tagsZh: ["食矿", "星能结晶", "采矿共生", "六足", "移动生态岛"],
    tagsEn: ["Mineral grazer", "Star crystallization", "Mining symbiosis", "Six-legged", "Moving ecosystem"],
    illustration: "./assets/creature-concepts/star-shell-packbeast/illustration.png",
    concept: "./assets/creature-concepts/star-shell-packbeast/concept-sheet.png"
  },
  {
    id: "sun-amber-swarm",
    group: "wildlife",
    status: "confirmed",
    accent: "#ffab45",
    zhName: "日珀蜂群",
    enName: "Sun-Amber Swarm",
    zhSubtitle: "把日冕热量筑成琥珀蜂巢的群落昆虫",
    enSubtitle: "Colonial insects that build hives from coronal heat",
    zhSummary: "栖息在戴森环散热结构上的辐射摄食昆虫。工蜂把过量热能固化进橙金色日珀蜂房，使蜂巢同时成为群落育幼区与天然热沉。",
    enSummary: "Radiation-feeding insects that inhabit Dyson heat structures. Workers lock excess heat into amber combs, making each hive both a nursery and a living thermal sink.",
    zhClass: "自然生命 · 群落昆虫",
    enClass: "Natural life · Colonial insect",
    zhHabitat: "戴森环外缘、日冕采集塔、散热井",
    enHabitat: "Dyson rims, coronal collectors, thermal shafts",
    zhDiet: "高能粒子、热辐射与金属表面微生物",
    enDiet: "Energetic particles, thermal radiation, surface microbes",
    zhActivity: "恒温群落 · 工蜂轮班",
    enActivity: "Thermoregulated colony · Worker shifts",
    zhEcology: "工蜂以半透明陶瓷翅膜散热，并将吸收的能量传入蜂房。蜂后很少暴露在直射日光下，始终被低温琥珀层和护理蜂包围。它们只有在热沉结构遭到破坏时才会集体防卫。",
    enEcology: "Workers shed heat through translucent ceramic wings and transfer gathered energy into the comb. The queen remains under cooler amber layers and nurse workers, and the colony mounts a mass defense only when its thermal structure is damaged.",
    zhRelations: "烈阳教会把大型蜂巢视为太阳允许生命靠近的证据；环带工程师则会在不破坏育幼区的前提下，引导蜂群为旧散热塔降温。",
    enRelations: "The Solar Church regards great hives as proof that the sun permits life to draw near. Ring engineers guide colonies into old heat towers without disturbing brood chambers.",
    zhTraits: ["黑色与象牙色节甲", "沿甲片流动的橙色日冕纹", "半透明陶瓷翅膜", "储存热量的蜂窝状日珀结构"],
    enTraits: ["Black and ivory segmented armor", "Orange coronal lines between plates", "Translucent ceramic wings", "Honeycomb sun-amber structures that store heat"],
    tagsZh: ["戴森环", "群落", "热沉", "日冕摄食", "烈阳圣兽"],
    tagsEn: ["Dyson ring", "Colony", "Heat sink", "Coronal feeding", "Solar sacred fauna"],
    illustration: "./assets/creature-concepts/sun-amber-swarm/illustration.png",
    concept: "./assets/creature-concepts/sun-amber-swarm/concept-sheet.png"
  },
  {
    id: "rust-eater-clawbeast",
    group: "wildlife",
    status: "confirmed",
    accent: "#e58f62",
    zhName: "食锈螯兽",
    enName: "Rust-Eater Clawbeast",
    zhSubtitle: "吞食工业废料并留下陶瓷补丁的废墟清道夫",
    enSubtitle: "A ruin scavenger that leaves ceramic repairs behind",
    zhSummary: "黑午裂变后扩散于工业遗迹的八肢甲壳兽。它们以锈蚀金属和失效纳米材料为食，并排出高强度浅色陶瓷浆，常在觅食过程中意外封住舰体裂缝。",
    enSummary: "Eight-limbed arthropods that spread through industrial ruins after the Black Noon. They consume rusted metal and dead nanomaterial, then extrude strong pale ceramic slurry that often seals hull breaches by accident.",
    zhClass: "自然生命 · 工业腐食种",
    enClass: "Natural life · Industrial scavenger",
    zhHabitat: "坠毁舰体、废弃工厂、裂变城市下层",
    enHabitat: "Wrecked ships, abandoned factories, lower ruin cities",
    zhDiet: "氧化金属、失效纳米机群与复合材料",
    enDiet: "Oxidized metal, dead nanomachines, composites",
    zhActivity: "夜行群落 · 沿锈蚀带觅食",
    enActivity: "Nocturnal colony · Follows corrosion fronts",
    zhEcology: "前方巨螯先压碎金属，口器再筛选可消化的氧化物。无法吸收的陶瓷成分会在腹部腺体中重排，成为黏附力极强的修补浆。幼体通常生活在成年个体留下的陶瓷孔洞中。",
    enEcology: "Massive foreclaws crush metal before mouthparts sort digestible oxides. Ceramic residue is reorganized in abdominal glands into highly adhesive repair slurry. Juveniles shelter in ceramic cavities left by adults.",
    zhRelations: "Astra 回收队会利用声振诱导群落清理大型残骸，但禁止把它们带入仍运行的船坞——食锈螯兽无法区分报废金属和暂时停机的设备。",
    enRelations: "Astra salvage teams use vibration lures to guide colonies through large wrecks, but ban them from active docks: clawbeasts cannot distinguish scrap from machinery that is merely powered down.",
    zhTraits: ["八条关节肢与两枚前置陶瓷巨螯", "锈红甲壳和浅色陶瓷背板", "成列青色感知坑", "腹部陶瓷浆分泌器官"],
    enTraits: ["Eight jointed limbs and two forward ceramic crushing claws", "Rust-red shell with pale ceramic plates", "Rows of cyan sensory pits", "Abdominal ceramic-slurry organ"],
    tagsZh: ["工业废墟", "腐食", "陶瓷修复", "群落", "回收利用"],
    tagsEn: ["Industrial ruins", "Scavenger", "Ceramic repair", "Colony", "Salvage"],
    illustration: "./assets/creature-concepts/rust-eater-clawbeast/illustration.png",
    concept: "./assets/creature-concepts/rust-eater-clawbeast/concept-sheet.png"
  },
  {
    id: "echo-homing-beast",
    group: "wildlife",
    status: "confirmed",
    accent: "#78dcff",
    zhName: "回声归巢兽",
    enName: "Echo Homing Beast",
    zhSubtitle: "以胸腔共鸣追寻出生行星的盲眼迁徙兽",
    enSubtitle: "An eyeless migrant that follows its birthworld's resonance",
    zhSummary: "没有视觉器官的群居四足兽，通过多层胸腔共鸣膜感知行星引力的微弱回声。它们一生都能指出出生地的方向，即使那颗星球已经毁灭。",
    enSummary: "Eyeless social quadrupeds that sense faint planetary gravity echoes through layered chest membranes. They point toward their birthworld throughout life, even after that world has been destroyed.",
    zhClass: "自然生命 · 引力感知种",
    enClass: "Natural life · Gravitational sensor",
    zhHabitat: "迁徙舰、月面谷地、低干扰观测站",
    enHabitat: "Migration ships, lunar valleys, quiet observatories",
    zhDiet: "高蛋白苔类、盐藓与培养饲料",
    enDiet: "Protein moss, salt lichen, cultivated forage",
    zhActivity: "晨昏鸣唱 · 集体定向",
    enActivity: "Twilight calling · Collective orientation",
    zhEcology: "群体会在固定时刻排列朝向同一方向，通过喉部与肋骨间的青色膜片发出低频鸣声。幼兽先模仿成年个体，随后逐渐锁定属于自己的出生地回声。",
    enEcology: "At fixed times the herd aligns in one direction and sounds low calls through cyan membranes between throat and ribs. Calves imitate adults before gradually locking onto the echo of their own birthplace.",
    zhRelations: "早期殖民舰曾把它们当作失灵时仍可靠的活体罗盘；如今幸存者也会饲养来自失落家园的兽群，让每日归巢鸣唱成为纪念仪式。",
    enRelations: "Early colony ships kept them as living compasses that survived instrument failure. Survivors now maintain herds from lost worlds, turning each daily homing call into an act of remembrance.",
    zhTraits: ["无眼的暖象牙色面甲", "午夜蓝皮毛与定向耳冠", "胸腹两组青色共鸣腔", "适合长途迁徙的细长四肢"],
    enTraits: ["Eyeless warm-ivory facial shield", "Midnight coat and directional ear crown", "Cyan resonant chambers in throat and ribs", "Long limbs suited to migration"],
    tagsZh: ["引力回声", "归巢", "群居", "活体罗盘", "纪念仪式"],
    tagsEn: ["Gravity echo", "Homing", "Herd", "Living compass", "Memorial"],
    illustration: "./assets/creature-concepts/echo-homing-beast/illustration.png",
    concept: "./assets/creature-concepts/echo-homing-beast/concept-sheet.png"
  },
  {
    id: "riftsurf-diver",
    group: "wildlife",
    status: "confirmed",
    accent: "#5fbfff",
    zhName: "裂潮潜兽",
    enName: "Riftsurf Diver",
    zhSubtitle: "沿时间裂隙边缘进行受控相位潜跃的六肢兽",
    enSubtitle: "A six-limbed animal that phase-dives along time rifts",
    zhSummary: "能够短暂离开当前时刻、沿裂隙边缘滑行的六肢生物。它们的身体结构始终连贯，相位过程也高度可控，因此与解剖矛盾的空亡体有本质区别。",
    enSummary: "A six-limbed animal that briefly leaves the present moment to glide along a rift edge. Its anatomy remains coherent and its phase sequence controlled, making it fundamentally different from contradictory Hollow-Nulls.",
    zhClass: "自然生命 · 裂隙边缘种",
    enClass: "Natural life · Rift-edge species",
    zhHabitat: "低强度裂隙、封锁线外缘、时潮暗流",
    enHabitat: "Low-intensity rifts, blockade edges, temporal currents",
    zhDiet: "裂隙浮游生物与相位化有机碎屑",
    enDiet: "Rift plankton and phase-shifted organic debris",
    zhActivity: "伏击与潜跃 · 独居或母幼同行",
    enActivity: "Ambush and phase-diving · Solitary or mother-young pairs",
    zhEcology: "压力翼能读取裂隙边缘的时序梯度，叉状感知冠负责选择重新进入现实时的落点。潜跃不是随机消失，而是依次经过数个可预测的缺席阶段。",
    enEcology: "Pressure vanes read temporal gradients while the forked sensory crown selects a safe point of return. A dive is not random disappearance but a sequence of predictable absent phases.",
    zhRelations: "猎空同盟的走私船会跟随成年个体穿越封锁区，幼兽也偶尔在温暖货舱里筑巢。试图用诱饵强迫潜兽改道往往会让整条裂隙路径失去稳定参照。",
    enRelations: "Raider smugglers follow adults through blockades, and juveniles sometimes nest in warm cargo holds. Forcing a diver off course can remove the only stable reference along an entire rift path.",
    zhTraits: ["完整连贯的细长六肢身体", "叉状前额感知冠", "成对半透明压力翼", "黑曜蓝皮肤与浅色因果条纹", "相位转换时出现青色轮廓"],
    enTraits: ["Coherent elongated six-limbed anatomy", "Forked frontal sensory crown", "Paired translucent pressure vanes", "Obsidian-blue skin with pale causal stripes", "Cyan edges during phase transition"],
    tagsZh: ["裂隙", "相位潜跃", "六肢", "走私航路", "受控时间适应"],
    tagsEn: ["Rift", "Phase dive", "Six-limbed", "Smuggler route", "Controlled temporal adaptation"],
    illustration: "./assets/creature-concepts/riftsurf-diver/illustration.png",
    concept: "./assets/creature-concepts/riftsurf-diver/concept-sheet.png"
  },
  {
    id: "duskbell-matriarch",
    group: "wildlife",
    status: "confirmed",
    accent: "#e4a95e",
    zhName: "暮钟牧母",
    enName: "Duskbell Matriarch",
    zhSubtitle: "在灾变前鸣钟并护住整个迁徙牧群的巨型母兽",
    enSubtitle: "A giant matriarch that warns and shelters a migrating herd",
    zhSummary: "迁徙巨兽群中极少出现的高龄母体。它的空腔冠与胸部共鸣器能在时间灾害发生前读出地层和大气中的异常，并以钟鸣让幼兽静止、牧群结阵。",
    enSummary: "A rare elder female within migratory megafauna herds. Hollow crown chambers and thoracic resonators detect pre-rift anomalies in ground and atmosphere, then sound a bell-call that stills calves and draws the herd into formation.",
    zhClass: "自然生命 · 传奇巨型牧兽",
    enClass: "Natural life · Legendary herd megafauna",
    zhHabitat: "殖民地旷野、迁徙走廊、裂隙高发平原",
    enHabitat: "Colonial plains, migration corridors, rift-prone steppe",
    zhDiet: "耐辐射草本、矿盐与共生地衣",
    enDiet: "Radiation-tolerant grasses, mineral salts, symbiotic lichen",
    zhActivity: "黄昏迁徙 · 灾变预警",
    enActivity: "Dusk migration · Disaster warning",
    zhEcology: "牧母并非独立物种的女王，而是极少数活到足够年龄、共鸣冠完全发育的雌性。钟鸣发生时，幼兽会钻入其腹侧和披甲下方，成年群体则环绕形成朝外的防护阵列。",
    enEcology: "A matriarch is not a separate queen caste, but a rare female old enough for her resonant crown to fully develop. At the bell-call calves shelter beneath her mantle while adults form an outward-facing ring.",
    zhRelations: "边境殖民地会保留牧群的传统迁徙路线，并把第一声暮钟视为比官方传感器更可信的撤离信号。猎杀牧母常导致区域内整支兽群失去灾害记忆。",
    enRelations: "Frontier colonies preserve traditional migration lanes and trust the first dusk bell more than official sensors. Killing a matriarch can erase generations of disaster memory from a regional herd.",
    zhTraits: ["极为宽厚的四足巨兽体型", "带多层共鸣腔的镂空冠", "深石板色层叠保护披甲", "灰白厚皮与琥珀色共鸣器", "能容纳幼兽的腹侧庇护空间"],
    enTraits: ["Enormous broad four-legged body", "Hollow crown with layered resonant chambers", "Deep-slate protective mantle", "Ash-ivory hide with amber resonators", "Ventral shelter space for calves"],
    tagsZh: ["巨型牧兽", "灾变预警", "护幼", "迁徙记忆", "传奇"],
    tagsEn: ["Megafauna", "Disaster warning", "Calf shelter", "Migration memory", "Legendary"],
    illustration: "./assets/creature-concepts/duskbell-matriarch/illustration.png",
    concept: "./assets/creature-concepts/duskbell-matriarch/concept-sheet.png"
  },
  {
    id: "crystal-spirit",
    group: "sapient",
    status: "umbrella",
    accent: "#9ef4ff",
    zhName: "晶灵",
    enName: "Crystal Spirit",
    zhSubtitle: "以晶格稳定光子与电磁共振的智慧生命总类",
    enSubtitle: "A sapient umbrella stabilized by crystalline resonance",
    zhSummary: "晶灵的真正意识是晶格中自组织的光子与电磁共振，而非某一块会说话的矿石。普通星能矿只可能成为容器，绝不自动等同于有意识的晶灵。",
    enSummary: "A Crystal Spirit's mind is self-organizing photon and electromagnetic resonance stabilized in a lattice, not a talking rock. Ordinary star ore may become a vessel but is never automatically conscious.",
    zhClass: "智慧生命总类 · 共振生命",
    enClass: "Sapient umbrella · Resonant life",
    zhHabitat: "晶体母星、星能矿脉、人工共振庭院",
    enHabitat: "Living crystal worlds, star-ore veins, resonance gardens",
    zhDiet: "吸收光、电磁能与结构化共振",
    enDiet: "Light, electromagnetic energy, structured resonance",
    zhActivity: "长期观察 · 低速迁移 · 智慧交流",
    enActivity: "Long observation · Slow migration · Sapient exchange",
    zhEcology: "每个晶灵都有承载意识的核心，以及沿倾斜轨道运动的独立晶体。高阶晶灵会通过“晶火点燃”赋予合适晶格以智慧。普通个体多为和平观察者；神谕晶灵读取的是多个可能未来，而非唯一命运。",
    enEcology: "Every spirit has a consciousness-bearing core and separate crystals moving on inclined atom-like orbits. Higher spirits kindle suitable lattices into awareness. Most are peaceful observers; Oracle Spirits read possible futures rather than a single fate.",
    zhRelations: "人类常把晶灵误判为资源、神谕装置或装饰性矿物。自由航商会已开始承认能自主签约的晶灵个体，但关于无形共振生命的法律人格仍存在巨大争议。",
    enRelations: "Humans often misclassify Crystal Spirits as resources, oracle devices, or decorative minerals. The Guild recognizes self-contracting individuals, but legal personhood for diffuse resonance minds remains disputed.",
    zhTraits: ["意识核心与独立轨道晶体", "仅由光和共振连接的分离结构", "不要求面孔、肢体、固定矿物或固定颜色", "通过轨道姿态、折射和响应光表达意识"],
    enTraits: ["Consciousness-bearing core and independent orbital crystals", "Separated structures joined only by light and resonance", "No required face, limbs, mineral, or color", "Awareness expressed through orbit, refraction, and responsive light"],
    zhConceptNote: "晶灵并非单一物种外形。需要先确定普通观察者、神谕晶灵、点燃者等子类，再分别建立概念图，避免把某一种晶格结构误设为全族标准。",
    enConceptNote: "Crystal Spirits have no single species silhouette. Observer, Oracle, and Kindler subtypes should be defined before separate concept sheets are created, so one lattice pattern does not become a false universal standard.",
    tagsZh: ["智慧生命", "光子意识", "晶火点燃", "轨道晶体", "总类待拆分"],
    tagsEn: ["Sapient", "Photonic mind", "Crystal kindling", "Orbital crystals", "Umbrella pending"],
    illustration: "./assets/card-art/orbital-crystal-spirit/orbital-crystal-spirit-01.png",
    concept: null,
    specimens: [
      { src: "./assets/card-art/oracle-crystal-spirit/oracle-crystal-spirit-01.png", zh: "神谕晶灵 · 已知高阶个体", en: "Oracle Spirit · Known high-order individual" }
    ]
  },
  {
    id: "avatar",
    group: "sapient",
    status: "umbrella",
    accent: "#a8f0a0",
    zhName: "兽裔",
    enName: "Avatar",
    zhSubtitle: "由神树分配适应性显化基因的人类后裔总类",
    enSubtitle: "Human descendants assigned adaptive manifestations by the God Tree",
    zhSummary: "兽裔首先是拥有社会、文化与人格的人，而不是可按动物外形成批分类的奇兽。神树为每个个体分配独立而永久的适应性基因，显化可呈动物、龙族或精灵型。",
    enSummary: "Avatars are people with culture, society, and individual identity—not wildlife sorted by animal appearance. The God Tree assigns each person a permanent adaptive manifestation that may be animal, draconic, or elf-like.",
    zhClass: "智慧人类分支 · 显化生命",
    enClass: "Sapient human lineage · Manifested life",
    zhHabitat: "造物之森及跨星域兽裔聚落",
    enHabitat: "The Creation Grove and Avatar settlements across space",
    zhDiet: "依个体显化与人类基础生理而变化",
    enDiet: "Varies by manifestation and human baseline physiology",
    zhActivity: "完整社会活动 · 个体差异极大",
    enActivity: "Full social life · Extreme individual variation",
    zhEcology: "显化基因来自同一棵神圣神树，却不会简单继承父母外形。功能性适应可能包括夜视、保温皮毛、平衡尾、感压角、攀爬足或抗辐射鳞片。一旦表达，显化通常会伴随个体终生。",
    enEcology: "Manifestation genes originate from one sacred God Tree but do not simply copy parental appearance. Adaptations may include low-light vision, thermal fur, balancing tails, pressure horns, climbing feet, or radiation-resistant scales, and usually remain for life.",
    zhRelations: "外部社会常将兽裔浪漫化、商品化或误判为动物。图鉴只记录其生物学原则，不以“习性”替代文化，不把任何单一个体当作整个族群的标准代表。",
    enRelations: "Outside societies often romanticize, commodify, or animalize Avatars. This archive records biological principles without replacing culture with 'instinct' or treating any one person as a universal representative.",
    zhTraits: ["保留清晰的智慧人格与社会行为", "显化可为完整兽型拟人、龙族型或克制的精灵型", "全身解剖应与功能性适应保持一致", "服装与装备会为尾、角、耳、爪及足型重新设计"],
    enTraits: ["Clearly sapient personality and social behavior", "Manifestations may be full furry, draconic, or restrained elf-like forms", "Whole-body anatomy follows functional adaptation", "Clothing and equipment adapt to tails, horns, ears, claws, and feet"],
    zhConceptNote: "兽裔是拥有大量独立显化谱系的文明人群。需要先选定具体子类与角色——例如鹿型疗愈师、龙型重装者或精灵型侦察者——再生成插画与概念图。",
    enConceptNote: "Avatars are a civilization containing many distinct manifestation lineages. A concrete subtype and person—such as a deer healer, draconic heavy, or elf-like scout—must be chosen before illustration and concept work.",
    tagsZh: ["智慧人类", "神树", "适应性显化", "个体化", "总类待拆分"],
    tagsEn: ["Sapient human", "God Tree", "Adaptive manifestation", "Individualized", "Umbrella pending"],
    illustration: "./assets/card-art/creation-grove-healer/creation-grove-healer-01.png",
    concept: null
  },
  {
    id: "nebula-manifestation",
    group: "cosmic",
    status: "boundary",
    accent: "#b684ff",
    zhName: "星云体",
    enName: "Nebula Manifestation",
    zhSubtitle: "宇宙法则在局部现实中的执行投影",
    enSubtitle: "A local projection through which cosmic law acts",
    zhSummary: "星云体不是政治帝国，也不是普通太空动物，而是宇宙观察和执行自身法则的局部显化。战场上出现的形体只是真正宇宙尺度存在的有限投影。",
    enSummary: "Nebula Manifestations are neither a political empire nor ordinary space animals. They are local forms through which the universe observes and enforces its own laws; battlefield bodies are limited projections of cosmic-scale beings.",
    zhClass: "边界存在 · 宇宙法则投影",
    enClass: "Boundary entity · Projection of cosmic law",
    zhHabitat: "引力异常、恒星诞生区、时间裂隙修正带",
    enHabitat: "Gravity anomalies, stellar nurseries, temporal correction zones",
    zhDiet: "不适用；通过局部法则维持投影",
    enDiet: "Not applicable; projection sustained by local law",
    zhActivity: "执行原则 · 超越常规道德判断",
    enActivity: "Executes principles beyond ordinary morality",
    zhEcology: "每个显化体执行一个原则，例如引力、恒星诞生、距离、守恒、坍缩或时间异常修正。其外缘由星云、尘埃和星光组成并持续消散，紧凑的明亮意志核心维持局部形体。",
    enEcology: "Each manifestation executes a principle such as gravity, stellar birth, distance, conservation, collapse, or temporal correction. Nebulae, dust, and stars dissolve at its edges while a compact brilliant will-core sustains the local body.",
    zhRelations: "凡人只能根据事件结果推测星云体的原则，无法假定它们友善或敌对。星航恶兆—巨鳐是已知显化个体之一，其形体和行为不能被视为整个总类的统一标准。",
    enRelations: "Mortals infer a manifestation's principle from outcomes and cannot assume friendship or hostility. The Starfaring Omen—Great Ray is one known individual, not a universal body plan for the entire class.",
    zhTraits: ["紧凑明亮的意志核心", "由星云、尘埃与星体组成的半透明形体", "引力弧与空间透镜效应", "以舰船、空间站或世界作为尺度参照", "轮廓可从巨鳐、环体到抽象星群完全不同"],
    enTraits: ["Compact brilliant will-core", "Translucent body of nebulae, dust, and stars", "Gravitational arcs and spatial lensing", "Ships, stations, or worlds as scale cues", "Silhouettes range from rays and ring-beings to abstract clusters"],
    zhConceptNote: "星云体同样是原则驱动的总类。本页保留已确认个体插画；后续概念图应按具体法则执行者分别制作，而不是建立统一物种解剖。",
    enConceptNote: "Manifestations are also principle-driven umbrellas. This page retains a confirmed individual illustration; future sheets should be made per executed law rather than as universal species anatomy.",
    tagsZh: ["宇宙法则", "投影", "意志核心", "巨型存在", "非生物"],
    tagsEn: ["Cosmic law", "Projection", "Will-core", "Vast entity", "Non-biological"],
    illustration: "./assets/card-art/starfaring-omen-great-ray/starfaring-omen-great-ray-02.png",
    concept: null,
    specimens: [
      { src: "./assets/card-art/starfaring-omen-great-ray/starfaring-omen-great-ray-01.png", zh: "星航恶兆—巨鳐 · 观测记录 A", en: "Starfaring Omen—Great Ray · Record A" }
    ]
  },
  {
    id: "hollow-null",
    group: "anomaly",
    status: "boundary",
    accent: "#8f75ff",
    zhName: "空亡体",
    enName: "Hollow-Null",
    zhSubtitle: "矛盾时间线被压缩后产生的因果残骸",
    enSubtitle: "Causal debris formed from compressed contradictory timelines",
    zhSummary: "空亡体并不构成自然物种。它们是互相矛盾的时间状态在裂隙中被压缩后形成的因果残骸，以破坏结构、顺序与记忆中的秩序来增加熵。",
    enSummary: "Hollow-Nulls are not a natural species. They are causal debris created when contradictory timeline states are compressed inside a rift, increasing entropy by destroying order in structures, sequences, and memory.",
    zhClass: "边界存在 · 因果异常",
    enClass: "Boundary entity · Causal anomaly",
    zhHabitat: "时间裂隙、黑午遗迹、空亡时主灾区",
    enHabitat: "Time rifts, Black Noon ruins, Time-Lord disasters",
    zhDiet: "不摄食物质；消耗因果与结构秩序",
    enDiet: "Consumes causal and structural order, not matter",
    zhActivity: "不连续移动 · 失序扩散",
    enActivity: "Discontinuous movement · Entropic spread",
    zhEcology: "所有空亡体都围绕不反射任何光线的因果空洞组织形体。肢体可能同时占据矛盾位置，组织同时生长与侵蚀，附近直线、光照和行动顺序都会断裂。力量越高，代表失稳程度越强，而非肉体更结实。",
    enEcology: "Every Hollow-Null organizes around a causal void that reflects no light. Limbs occupy contradictory positions, tissue grows and erodes at once, and nearby lines, lighting, and action order break. Greater power means greater instability, not tougher flesh.",
    zhRelations: "击杀普通空亡体只能清除局部残骸。每场大型“时亡灾变”都有一名空亡时主作为稳定吸引子；摧毁时主会让因果空洞坍缩、从属个体消散并恢复局部时间。",
    enRelations: "Destroying ordinary Hollow-Nulls clears only local debris. Every major Time-Death catastrophe is anchored by a Hollow Time Lord; killing that attractor collapses the causal void, disperses lesser forms, and allows local time to resume.",
    zhTraits: ["完全不反光的中央因果空洞", "互不对齐的解剖或材质碎片", "同一肢体的矛盾时间位置", "同时生长和侵蚀的表面", "断帧式移动与破碎环境线条"],
    enTraits: ["Perfectly lightless central causal void", "Misaligned anatomical and material fragments", "Contradictory temporal positions of the same limb", "Simultaneous growth and erosion", "Frame-skipping movement and broken environmental lines"],
    zhConceptNote: "空亡体没有稳定物种谱系。图鉴保留事件记录和视觉识别原则，但每个形体都应从其具体因果矛盾与灾变环境推导。",
    enConceptNote: "Hollow-Nulls have no stable species lineage. The archive preserves event records and recognition rules, while each form must derive from its particular contradiction and disaster environment.",
    tagsZh: ["因果残骸", "空洞", "熵增", "时间灾变", "非生物"],
    tagsEn: ["Causal debris", "Void", "Entropy", "Temporal disaster", "Non-biological"],
    illustration: "./assets/card-art/lost-hollow-null/lost-hollow-null-01.png",
    concept: null,
    specimens: [
      { src: "./assets/card-art/hollow-time-lord/hollow-time-lord-01.png", zh: "空亡时主 · 时亡灾变核心", en: "Hollow Time Lord · Time-Death anchor" }
    ]
  }
];

const isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");
const copy = {
  all: isEnglish ? "All records" : "全部档案",
  wildlife: isEnglish ? "Natural wildlife" : "自然奇兽",
  sapient: isEnglish ? "Sapient umbrellas" : "智慧总类",
  cosmic: isEnglish ? "Cosmic projections" : "宇宙投影",
  anomaly: isEnglish ? "Causal anomalies" : "因果异常",
  confirmed: isEnglish ? "Confirmed species" : "已确认物种",
  umbrella: isEnglish ? "Umbrella taxonomy" : "总类待拆分",
  boundary: isEnglish ? "Boundary record" : "边界档案",
  recordCount: (count) => isEnglish ? `${count} records found` : `检索到 ${count} 份档案`,
  noRecords: isEnglish ? "No matching records." : "没有符合条件的档案。",
  classification: isEnglish ? "Classification" : "档案分类",
  habitat: isEnglish ? "Known habitat" : "已知栖息地",
  diet: isEnglish ? "Energy / diet" : "能量与食性",
  activity: isEnglish ? "Activity" : "活动模式",
  ecology: isEnglish ? "Ecology and behavior" : "生态与生活习性",
  relations: isEnglish ? "Relationship with civilization" : "与文明的关系",
  traits: isEnglish ? "Recognition traits" : "识别特征",
  artArchive: isEnglish ? "Visual archive" : "视觉档案",
  artArchiveNote: isEnglish
    ? "Illustrations record behavior in context; concept sheets lock anatomy, material, scale, and life-stage continuity."
    : "插画记录环境中的真实行为；概念图用于锁定解剖、材质、尺度与年龄连续性。",
  illustration: isEnglish ? "Ecology illustration" : "生态叙事插画",
  concept: isEnglish ? "Species concept sheet" : "物种概念图",
  portrait: isEnglish ? "Portrait archive" : "竖幅档案",
  sheet: isEnglish ? "Artbook sheet" : "设定板",
  pendingTitle: isEnglish ? "Concept generation deferred" : "概念图暂缓生成",
  pendingDefault: isEnglish
    ? "This record covers multiple body plans. Define a concrete subtype before creating a canonical concept sheet."
    : "该档案涵盖多种形体，需要先确定具体子类，再制作具有约束力的概念图。",
  knownSpecimens: isEnglish ? "Known specimens and prior artwork" : "已知个体与既有插画",
  viewImage: isEnglish ? "Open full image" : "查看原图"
};

const filters = ["all", "wildlife", "sapient", "cosmic", "anomaly"];
const listEl = document.querySelector("#bestiaryList");
const detailEl = document.querySelector("#bestiaryDetail");
const filterEl = document.querySelector("#bestiaryFilters");
const searchEl = document.querySelector("#bestiarySearch");
const countEl = document.querySelector("#bestiaryResultCount");
const lightbox = document.querySelector("#bestiaryLightbox");

let activeFilter = "all";
let activeRecord = bestiaryRecords[0];

function text(record, zhKey, enKey) {
  return record[isEnglish ? enKey : zhKey] || "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function searchableText(record) {
  return [
    record.zhName, record.enName, record.zhSubtitle, record.enSubtitle,
    record.zhSummary, record.enSummary, record.zhClass, record.enClass,
    record.zhHabitat, record.enHabitat, record.zhDiet, record.enDiet,
    record.zhActivity, record.enActivity, ...(record.tagsZh || []), ...(record.tagsEn || [])
  ].join(" ").toLowerCase();
}

function visibleRecords() {
  const query = searchEl.value.trim().toLowerCase();
  return bestiaryRecords.filter((record) => {
    const groupMatches = activeFilter === "all" || record.group === activeFilter;
    const searchMatches = !query || searchableText(record).includes(query);
    return groupMatches && searchMatches;
  });
}

function statusLabel(record) {
  return copy[record.status] || record.status;
}

function renderFilters() {
  filterEl.innerHTML = filters.map((filter) => `
    <button class="bestiary-filter ${filter === activeFilter ? "is-active" : ""}" data-filter="${filter}" type="button">
      ${escapeHtml(copy[filter])}
    </button>`).join("");
}

function renderList() {
  const records = visibleRecords();
  countEl.textContent = copy.recordCount(records.length);
  if (!records.some((record) => record.id === activeRecord.id) && records.length) activeRecord = records[0];
  if (!records.length) {
    listEl.innerHTML = `<div class="bestiary-empty">${escapeHtml(copy.noRecords)}</div>`;
    detailEl.innerHTML = "";
    return;
  }
  listEl.innerHTML = records.map((record) => `
    <button
      class="bestiary-record-card ${record.id === activeRecord.id ? "is-active" : ""}"
      style="--record-accent:${record.accent}"
      data-record="${record.id}"
      type="button"
    >
      <img src="${record.illustration}" alt="" loading="lazy" />
      <span class="bestiary-record-copy">
        <span>${escapeHtml(statusLabel(record))}</span>
        <strong>${escapeHtml(text(record, "zhName", "enName"))}</strong>
        <small>${escapeHtml(text(record, "zhSubtitle", "enSubtitle"))}</small>
      </span>
    </button>`).join("");
  renderDetail();
}

function imageButton(src, label, kind, extraClass = "") {
  return `
    <button class="bestiary-art-button ${extraClass}" data-lightbox-src="${src}" data-lightbox-label="${escapeHtml(label)}" type="button" aria-label="${escapeHtml(`${copy.viewImage}: ${label}`)}">
      <img src="${src}" alt="${escapeHtml(label)}" loading="lazy" />
      <span class="bestiary-art-caption"><span>${escapeHtml(label)}</span><small>${escapeHtml(kind)}</small></span>
    </button>`;
}

function renderDetail() {
  const record = activeRecord;
  const name = text(record, "zhName", "enName");
  const secondaryName = isEnglish ? record.zhName : record.enName;
  const traits = isEnglish ? record.enTraits : record.zhTraits;
  const tags = isEnglish ? record.tagsEn : record.tagsZh;
  const specimens = record.specimens || [];
  const conceptNote = text(record, "zhConceptNote", "enConceptNote") || copy.pendingDefault;
  detailEl.style.setProperty("--record-accent", record.accent);
  detailEl.innerHTML = `
    <div class="bestiary-detail-hero">
      <img src="${record.illustration}" alt="${escapeHtml(`${name} ${copy.illustration}`)}" />
      <div class="bestiary-detail-title">
        <div class="bestiary-detail-meta">
          <span>${escapeHtml(statusLabel(record))}</span>
          <span>${escapeHtml(text(record, "zhClass", "enClass"))}</span>
        </div>
        <h3>${escapeHtml(name)}</h3>
        <div class="english-name">${escapeHtml(secondaryName)}</div>
        <p class="summary">${escapeHtml(text(record, "zhSummary", "enSummary"))}</p>
      </div>
    </div>
    <div class="bestiary-body">
      <div class="bestiary-facts">
        ${[
          [copy.classification, text(record, "zhClass", "enClass")],
          [copy.habitat, text(record, "zhHabitat", "enHabitat")],
          [copy.diet, text(record, "zhDiet", "enDiet")],
          [copy.activity, text(record, "zhActivity", "enActivity")]
        ].map(([label, value]) => `<div class="bestiary-fact"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}
      </div>
      <div class="bestiary-copy-grid">
        <section class="bestiary-copy-section">
          <span>FIELD NOTE 01</span>
          <h4>${escapeHtml(copy.ecology)}</h4>
          <p>${escapeHtml(text(record, "zhEcology", "enEcology"))}</p>
        </section>
        <section class="bestiary-copy-section">
          <span>FIELD NOTE 02</span>
          <h4>${escapeHtml(copy.relations)}</h4>
          <p>${escapeHtml(text(record, "zhRelations", "enRelations"))}</p>
        </section>
      </div>
      <section class="bestiary-copy-section">
        <span>MORPHOLOGY</span>
        <h4>${escapeHtml(copy.traits)}</h4>
        <ul class="bestiary-traits">${traits.map((trait) => `<li>${escapeHtml(trait)}</li>`).join("")}</ul>
      </section>
      <section class="bestiary-art-section">
        <div class="bestiary-art-header">
          <div><span>VISUAL RECORD</span><h4>${escapeHtml(copy.artArchive)}</h4></div>
          <p>${escapeHtml(copy.artArchiveNote)}</p>
        </div>
        <div class="bestiary-art-pair">
          ${imageButton(record.illustration, `${name} · ${copy.illustration}`, copy.portrait)}
          ${record.concept
            ? imageButton(record.concept, `${name} · ${copy.concept}`, copy.sheet, "is-concept")
            : `<div class="bestiary-concept-pending"><div><strong>${escapeHtml(copy.pendingTitle)}</strong><p>${escapeHtml(conceptNote)}</p></div></div>`}
        </div>
      </section>
      ${specimens.length ? `
        <section class="bestiary-art-section">
          <div class="bestiary-art-header"><div><span>SPECIMEN ARCHIVE</span><h4>${escapeHtml(copy.knownSpecimens)}</h4></div></div>
          <div class="bestiary-specimens">
            ${specimens.map((specimen) => {
              const label = isEnglish ? specimen.en : specimen.zh;
              return `<button class="bestiary-specimen" data-lightbox-src="${specimen.src}" data-lightbox-label="${escapeHtml(label)}" type="button"><img src="${specimen.src}" alt="${escapeHtml(label)}" loading="lazy" /><span>${escapeHtml(label)}</span></button>`;
            }).join("")}
          </div>
        </section>` : ""}
      <div class="bestiary-tag-row">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
    </div>`;
}

function selectRecord(id, updateHash = true) {
  const record = bestiaryRecords.find((item) => item.id === id);
  if (!record) return;
  activeRecord = record;
  renderList();
  if (updateHash) history.replaceState(null, "", `#${record.id}`);
}

function openLightbox(src, label) {
  const image = lightbox.querySelector("img");
  image.src = src;
  image.alt = label;
  lightbox.querySelector("p").textContent = label;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightbox.querySelector(".bestiary-lightbox-close").focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightbox.querySelector("img").src = "";
  document.body.style.overflow = "";
}

filterEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  renderFilters();
  renderList();
});

searchEl.addEventListener("input", renderList);

listEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-record]");
  if (button) selectRecord(button.dataset.record);
});

detailEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-lightbox-src]");
  if (button) openLightbox(button.dataset.lightboxSrc, button.dataset.lightboxLabel || "");
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox || event.target.closest(".bestiary-lightbox-close")) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
});

const initialId = window.location.hash.replace(/^#/, "");
const initialRecord = bestiaryRecords.find((record) => record.id === initialId);
if (initialRecord) activeRecord = initialRecord;
document.querySelector("#confirmedCount").textContent = String(bestiaryRecords.filter((record) => record.status === "confirmed").length).padStart(2, "0");
renderFilters();
renderList();
