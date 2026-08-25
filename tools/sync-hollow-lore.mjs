import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appPath = path.join(root, "app.js");
const appEnPath = path.join(root, "app-en.js");

let app = fs.readFileSync(appPath, "utf8");
let appEn = fs.readFileSync(appEnPath, "utf8");

app = app.replace(
  "正午没有到来。全球静域密集区同时塌陷，城市在一秒内老化百年，空亡体从无时之海涌出，人类数量锐减八成。",
  "正午没有到来。全球静域密集区同时塌陷，城市在一秒内老化百年；矛盾时间线在裂隙中被压缩成空亡体与大规模时亡灾变，人类数量锐减八成。",
);
appEn = appEn.replace(
  "Noon never arrived. Stasis-dense regions around the world collapsed at once; cities aged a century in a second, Hollow Nulls poured from the Timeless Sea, and humanity lost eighty percent of its population.",
  "Noon never arrived. Stasis-dense regions around the world collapsed at once; cities aged a century in a second, while contradictory timelines compressed inside the rifts into Hollow-Nulls and major Time-Death catastrophes. Humanity lost eighty percent of its population.",
);

const biblePattern = /const WORLD_BIBLE_MD_ZH = ("(?:[^"\\]|\\.)*");/;
const match = app.match(biblePattern);
if (!match) throw new Error("Could not locate WORLD_BIBLE_MD_ZH in app.js.");

let bible = JSON.parse(match[1]);
const sectionStart = bible.indexOf("### 时痕与无时之海");
const sectionEnd = bible.indexOf("### 黑午裂变", sectionStart);
if (sectionStart < 0 || sectionEnd < 0) throw new Error("Could not locate Hollow-Null origin section in World Bible.");

const originSection = `### 时痕与无时之海

每次展开静域，都会产生本应由正常时间承载的因果成本 **时审**。当这些成本被压缩进过短的外部时间，宇宙无法完全吸收，便会压缩四维空间结构，在现实背面留下极细小的伤口。人类最初称其为 **时痕**。

当时痕汇聚到不可逆程度时，互相矛盾的时间状态会在裂隙中被强行压缩到同一因果位置。早期研究者把裂隙背后无法被正常因果描述的状态称为 **无时之海**，但它并不是已确认存在原生生态的普通空间。

**空亡体** 不是无时之海的原住民，也不构成自然物种。它们是矛盾时间线被压缩后留下的因果残骸，围绕完全不反光的因果空洞组织形体，并通过破坏结构、顺序与记忆中的秩序增加熵。迷离型、飞翔型与咆哮型是时亡灾变的平行表现，不存在自然进化关系；大型灾变只围绕一名作为稳定吸引子的空亡时主形成。

尝试进入裂隙会经历时空紊乱，物质结构变得不稳定，人体可能出现时间错位：细胞年龄不同步、记忆先于经历出现、伤口倒流或身体局部老化。幸存者若保留人格，也可能成为由自身矛盾状态构成的特殊因果异常，而非感染某种生物。

`;
bible = `${bible.slice(0, sectionStart)}${originSection}${bible.slice(sectionEnd)}`;
bible = bible.replace(
  "| 2377 | 黑午裂变 | 时痕撕开无时之海，人类文明锐减 80%，黄金时代落幕。在太阳系舰队司令莱昂·阿斯特拉的紧急指挥下，大量灾民得以幸存。 有人声称在裂隙边缘看到了伊莱恩。同年，桑切雷斯创立烈阳教，自称先知。 |",
  "| 2377 | 黑午裂变 | 矛盾时间线在时痕中被大规模压缩，空亡体与时亡灾变席卷人类文明，人口锐减 80%，黄金时代落幕。在太阳系舰队司令莱昂·阿斯特拉的紧急指挥下，大量灾民得以幸存。有人声称在裂隙边缘看到了伊莱恩。同年，桑切雷斯创立烈阳教，自称先知。 |",
);
bible = bible.replace(
  "静域累积**时审**过多后会导致**时域裂变**，静域中曾借取的时间将会在瞬间返还，且所处区域将会被撕开**时痕**，并时不时涌出**空亡体**。",
  "静域累积 **时审** 过多后会导致 **时域裂变**：静域中曾借取的时间在瞬间返还，区域被撕开 **时痕**，互相矛盾的时间状态被压缩成空亡体表现。若失稳继续扩大，整场事件可能围绕唯一的空亡时主形成大型 **时亡灾变**。",
);

app = app.replace(biblePattern, `const WORLD_BIBLE_MD_ZH = ${JSON.stringify(bible)};`);
fs.writeFileSync(appPath, app);
fs.writeFileSync(appEnPath, appEn);
console.log("Aligned Hollow-Null world lore with the Cosmic Bestiary.");
