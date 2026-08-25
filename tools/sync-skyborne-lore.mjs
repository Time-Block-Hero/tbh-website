import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appPath = path.join(root, "app.js");
let app = fs.readFileSync(appPath, "utf8");

const biblePattern = /const WORLD_BIBLE_MD_ZH = ("(?:[^"\\]|\\.)*");/;
const match = app.match(biblePattern);
if (!match) throw new Error("Could not locate WORLD_BIBLE_MD_ZH in app.js.");

let bible = JSON.parse(match[1]);
bible = bible.replace(
  "| 2448 | 外环航线时代 | 猎空同盟于边境航道起义，冲击帝国统治下的銀河秩序。 |",
  "| 2448 | 边境起义时代 | 猎空同盟在星系边境发动起义，将探险航路拓展为反抗军殖民网络，以冒险发现资源、以开拓建立据点、以征服守住自由疆域。 |",
);

const factionHeading = "### 猎空同盟";
const nextFactionHeading = "### 自由航商会";
const factionStart = bible.indexOf(factionHeading);
const factionEnd = bible.indexOf(nextFactionHeading, factionStart + factionHeading.length);
if (factionStart < 0 || factionEnd < 0) throw new Error("Could not locate Skyborne faction section in World Bible.");

const factionSection = `### 猎空同盟

**关键词：** 星系边境、反抗军文明、冒险远征、殖民开拓、征服扩张、深绿暗红工业朋克  
**口号：** 边境不属于帝国，它属于敢于抵达的人。

猎空同盟是生长于星系边境的反抗军文明。其成员包括摆脱 Astra Imperium 统治的殖民者、探险家、开拓工匠、义体医生、流亡军人，以及主动投奔自由领土的边境居民。他们不是依赖固定母星的国家，而是由移动舰城、前线据点、新殖民地和远征航路连接起来的扩张型文明。

猎空同盟通过三个彼此相连的过程维持运转：**冒险**负责发现未知航路、遗迹、资源与宜居地；**开拓**负责把发现转化为矿站、工坊、补给港和可长期生活的殖民地；**征服**负责击退帝国军团、清除边境威胁，并把新据点纳入反抗军的自由疆域。征服并非为了掠夺，而是为了让探索成果能够存续，让边境居民不再受帝国配额与征税体系控制。

其视觉语言以深森林绿为主色、暗血红为识别色，结合炭黑钢材、改造舰体、危险义体、回收军械、外露铆钉、焊缝和战地维修痕迹。工业朋克并非装饰，而是边境资源有限、装备必须反复改造的现实结果。不同远征军团拥有各自传统，但都服从反抗帝国与扩张自由领土的共同目标。

**卡牌气质：** 敌后部署、越境行动、探索收益、建立据点、回收资源、前线征服、义体强化与高机动协同。

`;
bible = `${bible.slice(0, factionStart)}${factionSection}${bible.slice(factionEnd)}`;

const characterStart = bible.indexOf(factionHeading, factionStart + factionSection.length);
const characterEnd = bible.indexOf(nextFactionHeading, characterStart + factionHeading.length);
if (characterStart < 0 || characterEnd < 0) throw new Error("Could not locate Skyborne character section in World Bible.");
let characters = bible.slice(characterStart, characterEnd);
characters = characters
  .replace("猎空船团长", "猎空同盟前线统帅")
  .replace("红发朋克舰长，非法静域义眼", "红发朋克反抗军统帅，非法静域义眼")
  .replace("她更像一个“海盗”，或者说一个游侠，并不喜欢循规蹈矩。", "她更像一个边境游侠，不喜欢循规蹈矩，却始终把开拓自由领土视为同盟的责任。")
  .replace(
    "red-haired anime space pirate captain girl, black green red cyberpunk outfit, illegal chrono cyber-eye, flight jacket, starship bridge, confident grin, sci-fi punk card game art, no text",
    "red-haired anime frontier resistance commander, deep forest green and dark oxblood red industrial-punk uniform, illegal chrono cyber-eye, rebuilt command armor, mobile fleet-city bridge, confident defiance, no text",
  )
  .replace(
    "lazy anime cybernetic engineer boy, black green red space pirate palette, messy hair, mechanical arms, portable surgery tools, hacker visor, punk starship workshop, no text",
    "lazy anime cybernetic resistance doctor, deep forest green and dark oxblood red industrial-punk palette, messy hair, mechanical arms, portable surgery tools, hacker visor, frontier field workshop, no text",
  )
  .replace(
    "legendary anime space pirate captain, black green red veteran coat, cybernetic old starship captain energy but youthful stylization, rugged sci-fi punk, dramatic bridge lighting, no text",
    "legendary elderly frontier resistance commander, white beard, deep forest green and dark oxblood red worn command uniform, cybernetic fittings, rugged industrial sci-fi punk, abandoned mobile fleet-city bridge, dignified dramatic lighting, no text",
  )
  .replace("船团不需要贵族，但需要有人把门劈开。", "同盟不需要贵族，但需要有人把门劈开。")
  .replace(
    "anime plasma blade duelist, black green red pirate armor, agile boarding fighter, glowing star saber, punk spaceship corridor, fierce expression, no text",
    "anime plasma star-blade resistance breacher, deep forest green and dark oxblood red industrial armor, agile frontier conquest fighter, glowing star saber, fortified colony corridor, fierce expression, no text",
  );
bible = `${bible.slice(0, characterStart)}${characters}${bible.slice(characterEnd)}`;
bible = bible.replace(
  "猎空同盟突出非法义体与登舰装备",
  "猎空同盟突出非法义体、边境开拓装备与反抗军标识",
);

app = app.replace(biblePattern, `const WORLD_BIBLE_MD_ZH = ${JSON.stringify(bible)};`);
app = app.replace(/^\s+(?:3[1-9]|4[0-8]): .*\n/gm, "");
fs.writeFileSync(appPath, app);
console.log("Updated embedded Skyborne Alliance world-bible lore and removed obsolete pirate-era prompt entries.");
