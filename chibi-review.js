(() => {
  "use strict";
  const labels={Neutral:"中立",SkyborneAlliance:"苍穹联合",SolarChurch:"太阳教会",AstraImperium:"星界帝国",MachineHeaven:"机械天国"};
  const statusLabels={pending:"待重绘 · 当前显示旧稿","needs-fix":"新稿需修正 · 见审稿说明",generated:"新稿候选 · 待审阅",reviewed:"新稿 · 已审阅",golden:"洛岚 · 黄金基准"};
  const actions={idle:"待机",move:"移动",hit:"受伤",attack:"攻击",effect:"发动效果"};
  function frameAt(clip,seconds){const step=Math.floor(Math.max(0,seconds)*clip.fps);return clip.frames[clip.loop?step%clip.frames.length:Math.min(step,clip.frames.length-1)];}
  function pickEntry(uid,manifest,legacy){if(uid===manifest.baseline.uid)return{...manifest.baseline,status:"golden"};const entry=manifest.entries.find(e=>e.uid===uid);if(entry?.status!=="pending"&&entry?.atlasSrc&&entry?.layout)return entry;const old=legacy.entries.find(e=>e.uid===uid);return old?{...old,status:"pending"}:null;}
  globalThis.TbhChibiReview={frameAt,pickEntry};
  if(typeof document==="undefined")return;
  const $=id=>document.getElementById(id);
  async function load(url){const r=await fetch(url,{cache:"no-store"});if(!r.ok)throw new Error(`${url} (${r.status})`);return r.json();}
  async function start(){
    const [cards,manifest,legacy]=await Promise.all([load("./data/cards.json"),load("./data/chibi-review.json"),load("./data/card-chibis.json")]);
    const units=cards.cards.filter(c=>c.cardType==="Minion"),entries=new Map(units.map(c=>[c.uid,pickEntry(c.uid,manifest,legacy)]));
    const counts={generated:0,reviewed:0,pending:0,golden:0,"needs-fix":0};for(const e of entries.values())counts[e?.status||"pending"]++;
    $("coverage").textContent=`${units.length} 个单位 · ${counts.generated} 套新稿候选 · ${counts.reviewed} 套已审阅 · ${counts.pending} 套待重绘 · ${counts["needs-fix"]} 套需修正。洛岚作为固定基准。`;
    const stage=new globalThis.TbhPaperStage($("stage"));stage.onError=text=>{$("stageError").hidden=false;$("stageError").textContent=text;};
    let selected=null,entry=null,action="idle",elapsed=0,playing=true,manual=null,previous=0,generation=0,raf=0;
    for(const [value,label] of Object.entries(labels)){const o=document.createElement("option");o.value=value;o.textContent=label;$("faction").append(o);}
    await stage.setActor(1,manifest.baseline);
    const clip=e=>e?.layout.clips?.[action]||e?.layout.clips?.idle;
    function updateFrame(){if(!entry)return;const a=clip(entry),b=clip(manifest.baseline);const duration=Math.max(1.6,a.frames.length/a.fps+.65),time=a.loop?elapsed:elapsed%duration;stage.elapsed=time;stage.frameIndices=[manual===null?frameAt(a,time):a.frames[Math.min(manual,a.frames.length-1)],manual===null?frameAt(b,time):b.frames[Math.min(manual,b.frames.length-1)]];const index=a.frames.indexOf(stage.frameIndices[0]);$("frame").max=String(a.frames.length-1);$("frame").value=String(index);$("frameInfo").textContent=`${index+1} / ${a.frames.length} 帧 · ${a.fps}fps`;}
    function setAction(next){action=next;stage.action=next;elapsed=0;manual=null;for(const b of $("actions").children)b.setAttribute("aria-pressed",String(b.dataset.action===next));updateFrame();}
    async function select(card){const token=++generation;selected=card.uid;entry=entries.get(card.uid);stage.height=entry?.display?.heightInTiles||1.1;$("height").value="1";$("heightValue").textContent="1.00 ×";setAction(action);$("unitName").replaceChildren(document.createTextNode(card.nameKey));const english=document.createElement("span");english.textContent=card.englishName;$("unitName").append(english);$("identity").textContent=`${labels[card.classId]} / ${card.id}`;$("status").dataset.status=entry?.status||"pending";$("status").textContent=statusLabels[entry?.status||"pending"];
      $("activeLabel").textContent=`${card.nameKey} · ${entry?.status==="pending"?"旧稿对照":entry?.status==="golden"?"黄金基准":"本轮新稿"}`;
      $("provenance").textContent=entry?.status==="pending"?"此单位尚未完成本轮重绘。画面显示旧稿，便于比较尺寸；不会计入新稿完成数。":`固定裁切 · ${entry?.layout.frames.length||0} 帧 · ${entry?.qaNotes?.length ? entry.qaNotes.join(" ") : entry?.status === "needs-fix" ? "帧间存在透明间隔不足或边缘裁切，请先修正原稿。" : entry?.provenance?.note||"按洛岚黄金样式制作，等待美术审阅"}`;
      for(const b of $("unitList").children)b.setAttribute("aria-pressed",String(b.dataset.uid===selected));$("stageError").hidden=true;
      const url=new URL(location.href);url.searchParams.set("unit",card.id);history.replaceState(null,"",url);
      if(!entry){stage.actors[0]=null;stage.onError("这个单位没有可用素材，等待新稿导入。");return;}
      try{await stage.setActor(0,entry);if(token!==generation)return;updateFrame();}catch(error){if(token===generation)stage.onError(error.message);}
    }
    function renderList(){const q=$("search").value.trim().toLowerCase(),f=$("faction").value,s=$("availability").value;$("unitList").replaceChildren();let count=0;
      for(const c of units){const e=entries.get(c.uid);if((f&&f!==c.classId)||(s&&s!==e?.status)||(q&&!`${c.nameKey} ${c.englishName} ${c.id}`.toLowerCase().includes(q)))continue;count++;const b=document.createElement("button");b.type="button";b.className="unit-item";b.dataset.uid=c.uid;b.dataset.status=e?.status||"pending";b.setAttribute("aria-pressed",String(c.uid===selected));const thumb=document.createElement("span");thumb.className="thumb";
        if(e){const r=e.layout.frames[0].rect,scale=Math.min(42/r.width,52/r.height),im=document.createElement("img");im.src=e.atlasSrc;im.alt="";im.loading="lazy";im.style.width=`${e.layout.sourceWidth*scale}px`;im.style.height=`${e.layout.sourceHeight*scale}px`;im.style.left=`${-r.x*scale+(44-r.width*scale)/2}px`;im.style.top=`${-(e.layout.sourceHeight-r.y-r.height)*scale+(54-r.height*scale)/2}px`;thumb.append(im);}
        const text=document.createElement("span"),name=document.createElement("strong"),meta=document.createElement("small"),dot=document.createElement("span");name.textContent=c.nameKey;meta.textContent=`${c.id} · ${e?.status==="pending"?"待重绘":e?.status==="golden"?"黄金基准":e?.status==="reviewed"?"已审阅":e?.status==="needs-fix"?"需修正":"新稿候选"}`;dot.className="unit-dot";text.append(name,meta);b.append(thumb,text,dot);b.addEventListener("click",()=>select(c));$("unitList").append(b);
      }$("resultCount").textContent=`显示 ${count} / ${units.length} 个单位`;
    }
    for(const id of ["search","faction","availability"])$(id).addEventListener("input",renderList);
    for(const b of $("actions").children)b.addEventListener("click",()=>setAction(b.dataset.action));
    $("play").addEventListener("click",()=>{playing=!playing;manual=null;$("play").textContent=playing?"暂停":"播放";});
    $("replay").addEventListener("click",()=>{elapsed=0;manual=null;playing=true;$("play").textContent="暂停";});
    $("flip").addEventListener("click",()=>{stage.facing*=-1;$("flip").textContent=stage.facing===1?"朝向 ←":"朝向 →";});
    $("frame").addEventListener("input",()=>{manual=Number($("frame").value);playing=false;$("play").textContent="播放";updateFrame();});
    $("height").addEventListener("input",()=>{const multiplier=Number($("height").value);stage.height=(entry?.display?.heightInTiles||1.1)*multiplier;$("heightValue").textContent=`${multiplier.toFixed(2)} ×`;});
    $("orientation").addEventListener("change",()=>{stage.orientation=$("orientation").value;});
    $("motion").addEventListener("change",()=>{stage.motion=$("motion").checked;});
    $("resetView").addEventListener("click",()=>stage.reset());
    $("compare").addEventListener("click",()=>{stage.compare=!stage.compare;$("compare").setAttribute("aria-pressed",String(stage.compare));$("baselineLabel").hidden=!stage.compare;$("baselineLabel").style.display=stage.compare?"":"none";stage.reset();});
    function tick(now){const dt=previous?Math.min(.1,(now-previous)/1000):0;previous=now;if(playing&&!document.hidden)elapsed+=dt*Number($("speed").value);if(!document.hidden){updateFrame();stage.render();}raf=requestAnimationFrame(tick);}raf=requestAnimationFrame(tick);
    addEventListener("pagehide",()=>{cancelAnimationFrame(raf);stage.dispose();},{once:true});
    renderList();const requested=new URL(location.href).searchParams.get("unit");await select(units.find(c=>c.id===requested||c.uid===requested)||units.find(c=>entries.get(c.uid)?.status==="generated")||units.find(c=>c.uid===manifest.baseline.uid)||units[0]);
    globalThis.__CHIBI_REVIEW_STATE__={get selected(){return selected;},get action(){return action;},get counts(){return {...counts};},stage};
  }
  start().catch(e=>{$("coverage").textContent=`加载失败：${e.message}`;$("stageError").hidden=false;$("stageError").textContent=e.message;});
})();
