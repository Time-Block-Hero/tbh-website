/* Canonical race/branch organization. Source dossiers stay in bestiary-data.js. */
(() => {
  'use strict';
  const records = window.TBH_BESTIARY_RECORDS;
  const source = id => { const r = records.find(r => r.id === id); if (!r) throw new Error(`Missing bestiary source: ${id}`); return r; };
  const pair = (zh, en) => ({ zh, en });
  const races = [
    { id:'wildlife', ...pair('奇兽','Wildlife'), note:pair('自然奇兽的轮廓、结构、材质与成长连续性。','Silhouette, anatomy, materials and continuity across life stages.') },
    { id:'machine', ...pair('机械','Mechanical life'), note:pair('按机体谱系分别定义结构；天使与机灵不共享同一套解剖。','Define each chassis lineage separately; Angels and Sprites do not share one anatomy.') },
    { id:'crystal', ...pair('晶灵','Crystal spirits'), sourceId:'crystal-spirit', note:pair('共振意识与轨道晶体是共性；具体颜色、几何与轨道由分支定义。','Resonant consciousness and orbital crystals are shared; geometry, color and orbits belong to individual branches.') },
    { id:'avatar', ...pair('兽裔','Avatar kin'), sourceId:'avatar', note:pair('智慧人格与连贯解剖优先。职业服饰属于个体，不自动成为全族特征。','Preserve intelligent identity and coherent anatomy. Occupation and clothing belong to individuals, not the whole lineage.') },
    { id:'nebula', ...pair('星云生命','Nebular life'), sourceId:'nebula-manifestation', note:pair('通过意志核心、宇宙尺度与空间效应定型；各分支独立确定轮廓。','Define will-cores, cosmic scale and spatial effects; each branch has its own silhouette.') },
    { id:'calamity', ...pair('灾厄生命','Calamity manifestations'), sourceId:'hollow-null', note:pair('图鉴归类不改变其因果异常本质。以下是并列表现，不是成长或进化阶段。','This catalog grouping does not make causal anomalies biological. The branches are parallel expressions, not growth or evolution stages.') },
  ];
  const entries = [];
  const addSource = (id, raceId, names) => {
    const s = source(id);
    entries.push({ id, raceId, sourceId:id, sourceKind:'dossier', names:names || pair(s.zhName,s.enName), designStatus:'documented', traits:pair(s.zhTraits,s.enTraits), summary:pair(s.zhSummary,s.enSummary), illustration:s.illustration, concept:s.concept, specimens:s.specimens || [], forms:s.knownForms || [], avoid:pair([],[]), gaps:pair([],[]) });
  };
  ['puru-beast','star-shell-packbeast','borrowed-time-mayfly','navigation-sailbeast','sun-amber-swarm','rust-eater-clawbeast','echo-homing-beast','riftsurf-diver','duskbell-matriarch'].forEach(id=>addSource(id,'wildlife'));
  addSource('celestial-angel','machine',pair('天使','Angels'));
  addSource('celestial-sprite','machine',pair('机灵','Sprites'));
  const edit = id => entries.find(e=>e.id===id);
  edit('duskbell-matriarch').gaps = pair(['现有档案将其描述为高龄雌性形态；所属具体谱系仍待整理。'],['The existing dossier describes an aged female form; its exact parent lineage remains unresolved.']);
  edit('celestial-angel').avoid = pair(['不得添加双腿或脚、巨大裸露胸腔、普通巨型机器人比例。','武装不得压过仿生面容、光环与无腿悬浮的主轮廓。'],['No legs, feet, large exposed chest cavity or generic giant-robot proportions.','Weapons must remain subordinate to the face, halo and legless hovering silhouette.']);
  edit('celestial-angel').variation = pair('翼系、悬浮容器与职能模块可变；必须保留仿生面容、紧凑核心、陶瓷躯干及光环。','Wings, lower vessels and role modules may vary; preserve the biomimetic face, compact core, ceramic torso and halo.');
  edit('celestial-sprite').avoid = pair(['不得添加腿、脚、轮子、毛皮或接地行走姿态。','不能把感知耳鳍画成兔耳，不能用成长或变形替代职能换装。'],['No legs, feet, wheels, fur or ground-contact walking poses.','Sensor fins are not rabbit ears; role changes are not growth or metamorphosis.']);
  edit('celestial-sprite').variation = pair('换装仅限背包接口、工具手与小型货舱，核心轮廓和悬浮结构保持一致。','Job variants may change backpack hardpoints, tool hands and compact cargo pods; preserve the core silhouette and hover chassis.');
  const add = (id,raceId,zh,en,options={}) => entries.push({id,raceId,names:pair(zh,en),sourceKind:'branch',designStatus:'incomplete',traits:pair([],[]),avoid:pair([],[]),gaps:pair(['独立设定板、尺度与可变化范围未完成。'],['Dedicated concept sheet, scale and allowed variation remain incomplete.']),illustration:null,concept:null,specimens:[],forms:[],...options});
  add('wandering-crystal','crystal','游荡晶灵','Wandering crystal spirit',{
    sourceId:'crystal-spirit', sourceArtworkKeys:['orbital-crystal-spirit'], designStatus:'card-reference',
    summary:pair('以现有「轨道晶灵」作为个体参考；游荡晶灵是分支名，卡牌名保持不变。','The existing Orbital Crystal Spirit is an individual reference. The branch name does not rename the card.'),
    traits:pair(['参考个体以不规则透明核心承载光子意识。','四至六块独立晶体沿倾斜轨道运动，仅由共振光迹连接。','参考个体没有面孔、肢体或人形解剖。'],['The reference carries photon consciousness inside an irregular translucent core.','Four to six separate crystals follow inclined orbits, connected only by resonance trails.','The reference has no face, limbs or humanoid anatomy.']),
    avoid:pair(['不得把参考个体的晶体数量与配色自动推广为全分支标准。'],['Do not generalize this individual’s crystal count or palette to the whole branch.'])
  });
  add('oracle-crystal','crystal','谕晶','Oracle crystal spirit',{
    sourceId:'crystal-spirit',sourceArtworkKeys:['oracle-crystal-spirit'],designStatus:'card-reference',
    summary:pair('现有谕晶以晶体轨道暂时形成的概率透镜表达意识与推演；分支设定板待完成。','The current Oracle expresses thought through orbital alignment forming a probability lens; a branch concept sheet remains incomplete.'),
    traits:pair(['现有个体具有琥珀与玫瑰色四面体意识核心。','七片刀刃状、板片状晶体沿交错倾斜轨道运动。','通过折射与轨道对齐呈现概率透镜，不能用卡牌或 UI 替代。'],['The current individual has an amber-and-rose tetrahedral consciousness core.','Seven blade-like and plate-like crystals follow interlocking inclined orbits.','Show the probability lens through refraction and alignment, not literal cards or UI.'])
  });
  add('deer-avatar','avatar','鹿形兽人','Deer kin',{
    sourceId:'avatar',sourceArtworkKeys:['creation-grove-healer'],designStatus:'card-reference',
    summary:pair('以「造物之森疗愈师」的完整鹿类拟人形象为现有参考；个体装束与职业不属于全族规范。','The Creation Grove Healer supplies the existing complete anthropomorphic deer reference; its costume and occupation are not lineage-wide rules.'),
    traits:pair(['连贯的鹿类口鼻、大耳、鹿毛与浅色面部纹样。','参考个体具有分趾手端、蹄足与短鹿尾。','衣物接缝与活动空间适配对应解剖。'],['Coherent deer muzzle, large ears, coat and pale facial markings.','The reference has cloven hand tips, hooved legs and a short deer tail.','Clothing seams and movement clearance fit the anatomy.']),
    avoid:pair(['不得用人脸加兽耳替代既有鹿类拟人结构。','青色头毛、疗愈师外套与法杖仅是现有个体示例。'],['Do not replace the established deer anatomy with a human face and animal ears.','Teal head fur, healer coat and staff belong to the existing individual only.'])
  });
  add('fox-avatar','avatar','狐兽人','Fox kin',{sourceId:'avatar'});
  add('elven-avatar','avatar','精灵种','Elven kin',{sourceId:'avatar'});
  const ray=source('nebula-manifestation').knownForms[0];
  add('ray-nebula','nebula','鳐状星云','Ray-shaped nebula',{
    sourceId:'nebula-manifestation',sourceFormName:ray.zhName,sourceArtworkKeys:['starfaring-omen-great-ray'],designStatus:'card-reference',summary:pair(ray.zhDescription,ray.enDescription),
    traits:pair(['宽阔中央体、巨翼轮廓、尾迹与紧凑青白意志核心。','最新巨鳐个体要求高密度星云层次与清晰连续外轮廓，不能处理成稀薄纱幕。','通过微小舰船或空间站表现巨构尺度。'],['Broad central body, immense wings, trailing wake and compact cyan-white will-core.','The current Great Ray requires dense nebular layers and a crisp continuous contour, not a faint veil.','Use tiny ships or stations to establish megastructure scale.']),
    avoid:pair(['不要添加动物面孔、眼睛、嘴、皮肤或普通器官。','鳐状轮廓属于此分支，不是所有星云生命的统一解剖。'],['No animal face, eyes, mouth, skin or ordinary organs.','The ray silhouette belongs to this branch, not all nebular life.'])
  });
  add('bear-nebula','nebula','熊状星云','Bear-shaped nebula',{sourceId:'nebula-manifestation'});
  add('primordial-sun','nebula','原始太阳','Primordial sun',{sourceId:'nebula-manifestation'});
  const hollow=source('hollow-null');
  [['common-hollow-null','普通空亡体','Common Hollow-Null','迷离的空亡体','lost-hollow-null'],['flying-hollow-null','飞翔型空亡体','Flying Hollow-Null','飞翔型空亡体',null],['roaring-hollow-null','大型空亡体（咆哮型）','Large Hollow-Null (roaring form)','咆哮型空亡体',null],['hollow-time-lord','空亡时主','Hollow Time Lord','空亡时主','hollow-time-lord']].forEach(([id,zh,en,formName,key])=>{
    const form=hollow.knownForms.find(f=>f.zhName===formName);if(!form)throw new Error(`Missing form ${formName}`);
    add(id,'calamity',zh,en,{sourceId:'hollow-null',sourceFormName:formName,sourceArtworkKeys:key?[key]:[],designStatus:'documented',summary:pair(form.zhDescription,form.enDescription),traits:pair([form.zhDescription],[form.enDescription]),concept:form.concept,gaps:pair([],[]),avoid:pair(['不得画成稳定的自然物种、成长阶段或进化链。','因果空洞必须表现为现实缺失，不是黑色皮肤、烟雾或普通传送门。'],['Do not depict a stable natural species, growth stage or evolution chain.','The causal void is missing reality, not black skin, smoke or an ordinary portal.'])});
  });
  // Fingerprints of card briefs reviewed for the extracted branch traits.
  const sourceBriefHashes={
  "orbital-crystal-spirit": "7494f869443b8880c1f83e2ab56122e45ce5a98a2f89c30ca92d5538e8d4e8af",
  "oracle-crystal-spirit": "3f0afd3df7f3777d67642590c08aa2b8c9317d14ea3f5cd38ff595859ec34c79",
  "starfaring-omen-great-ray": "30cc4ecfc21754f44d8547300e810ec8a919e4627ba07659e5193f6c54057331",
  "creation-grove-healer": "02e5a941c4b4bd9f77f1d8c73d80d4360506b1ca27c26dffc36f646a955c17ba",
  "lost-hollow-null": "efcfaa9beead16551234684f19351e39718e96805785235d0cdf4ace5cc81cf7",
  "hollow-time-lord": "9cb9c55f898f3f57e62f6a67646100e3582d08f7678f26276627d956a84530df"
};
  for(const e of entries)e.sourceBriefHashes=Object.fromEntries((e.sourceArtworkKeys||[]).map(k=>[k,sourceBriefHashes[k]]));
  const aliases={'crystal-spirit':'race:crystal',avatar:'race:avatar','nebula-manifestation':'race:nebula','hollow-null':'race:calamity'};
  window.TBH_BESTIARY_CATALOG={races,entries,aliases};
})();
