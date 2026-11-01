(() => {
  "use strict";
  const C=globalThis.TbhChibiContract,P=globalThis.TbhChibiPublished,$=id=>document.getElementById(id),clone=v=>structuredClone(v);
  const names={idle:"待机",move:"移动",hit:"受伤",attack:"攻击",effect:"发动效果"};
  const factions={Neutral:"中立",SkyborneAlliance:"苍穹联合",SolarChurch:"太阳教会",AstraImperium:"星界帝国",MachineHeaven:"机械天国"};
  const DRAFT=`tbh-chibi-workbench-v1:${location.pathname}`;
  const frameAt=(clip,t)=>clip.frames[clip.loop?Math.floor(t*clip.fps)%clip.frames.length:Math.min(Math.floor(t*clip.fps),clip.frames.length-1)];
  async function load(url){const r=await fetch(url,{cache:"no-store"});if(!r.ok)throw new Error(`无法读取 ${url}`);return r.json();}
  function download(value,name,type="application/json"){const blob=value instanceof Blob?value:new Blob([typeof value==="string"?value:JSON.stringify(value,null,2)+"\n"],{type});const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  async function start(){
    const [cards,review]=await Promise.all([load("./data/cards.json"),load("./data/chibi-review.json")]);
    let state=null;try{state=await load("./api/chibi/state");}catch{}
    let data=state?.dataset||await load("./data/chibi-workbench.json"),saved=clone(data),revision=state?.revision,reviewRevision=state?.reviewRevision,savedRevision=revision,savedReviewRevision=reviewRevision,writable=Boolean(state?.projectWrite),dirty=false,saving=false;
    let published=null;try{published=await load("./data/chibi-published.json");}catch{}
    let previewSource=published?"published":"author";$("previewSource").value=previewSource;
    C.validate(data,review,cards,{allowStale:true});
    const units=cards.cards.filter(c=>c.cardType==="Minion"),arts=new Map(C.sources(review).map(e=>[e.uid,e])),stage=new globalThis.TbhPaperStage($("stage"));
    let selected,art,config,entry,action="idle",elapsed=0,playing=true,manual=null,previous=0,frame=0,lastFrame=-1,image=null,imageBox=null,selectionToken=0;
    stage.onError=message=>{$("stageError").hidden=false;$("stageError").textContent=message;};
    const status=message=>{$("saveStatus").textContent=message;};
    const cfg=uid=>data.entries.find(e=>e.uid===uid);
    const stale=()=>config?.atlasSha256!==art?.atlasSha256;
    function remember(){try{localStorage.setItem(DRAFT,JSON.stringify({dataset:data,baseRevision:revision,reviewRevision}));}catch{status("浏览器草稿空间不足，请导出配置备份");}}
    function changed(){dirty=true;remember();status(writable?"未保存更改":"静态预览 · 更改保留在浏览器，须导出配置");apply();drawPreview();}
    function publicationInfo(){
      const unit=published?.units.find(u=>u.uid===selected?.uid),fresh=unit&&!stale()&&P.current(unit,art,C.resolve(art,config,data.defaults),C.stableStringify);
      $("publicationStatus").textContent=unit?`${published.units.length} 套已发布 · ${fresh?"与当前配置一致":"当前配置尚未发布"}`:"此单位尚未发布";
      $("publicationDetail").textContent=unit?`${unit.processing.exclusionRectCount?"已离线修补":"无需修补"} · PNG ${unit.atlasSha256.slice(0,12)} · ${previewSource==="published"?"正在播放游戏产物":"正在编辑原稿校准"}`:"保存配置后发布，才能在这里展示可直接导入游戏的素材。";
      $("downloadPublishedPng").disabled=!unit;$("downloadPublishedBundle").disabled=!unit;$("publish").disabled=!writable;
      $("height").disabled=previewSource==="published";
    }
    async function setPreview(value){previewSource=value;$("previewSource").value=value;if(value==="published")$("authorPanel").open=false;await select(selected);}
    function apply(){
      $("rebase").hidden=!stale();$("status").textContent=stale()?"素材已变化 · 校准待重新绑定":art.status==="golden"?"洛岚 · 黄金基准":"图集候选 · 参数可编辑";
      $("status").dataset.status=stale()?"needs-fix":art.status;
      if(stale()){entry={...art,heightInTiles:art.display?.heightInTiles||1.1};status("旧校准未应用：请查看新图后显式重新绑定");}
      else entry={...art,...C.resolve(art,config,data.defaults)};
      if(previewSource==="published"){
        if(published?.units.some(u=>u.uid===selected.uid)){entry=P.entry(published,selected.uid);$("status").textContent="游戏发布版 · 修补已烘焙";}
        else{previewSource="author";$("previewSource").value="author";status("此单位没有发布产物，已显示原稿校准");}
      }
      publicationInfo();
      if(stage.actors[0])stage.actors[0].entry=entry;
      updateFrame();
    }
    function controls(){
      $("scaleNumber").value=config.scale;$("height").min="0.1";$("height").max="8";$("height").step="0.01";$("height").value=config.scale;$("height").setAttribute("aria-valuetext",`${config.scale.toFixed(2)} 格`);$("heightValue").textContent=`${config.scale.toFixed(2)} 格`;
      for(const k of ["X","Y","Z"])$("offset"+k).value=config.offset[k.toLowerCase()];$("sizeClass").value=config.sizeClass;$("bodyKind").value=config.bodyKind;$("exportReady").checked=config.exportReady;$("sourceFacing").checked=config.artworkFacesRight;
      $("promptBase").value=config.prompt.base||"";$("promptNotes").value=config.prompt.notes||"";$("promptAction").value=config.prompt.actions?.[action]||"";
      $("inheritedPrompt").textContent=[data.defaults.prompt.style,`${action}: ${data.defaults.prompt.actions?.[action]||""}`,data.defaults.prompt.negative].filter(Boolean).join("\n\n");frameControls();if(previewSource==="published"){const height=entry.heightInTiles;$("height").value=height;$("height").setAttribute("aria-valuetext",`${height.toFixed(2)} 格`);$("heightValue").textContent=`${height.toFixed(2)} 格`;}
    }
    function frameControls(){
      const a=config.actions[action]||{},f=config.frames[String(frame)]||{},p=entry?.layout.frames[frame]?.pivot||art.layout.frames[frame].pivot;
      $("actionFps").value=a.fps??art.layout.clips[action].fps;for(const k of ["X","Y"]){$("action"+k).value=a.offset?.[k.toLowerCase()]||0;$("frame"+k).value=f.offset?.[k.toLowerCase()]||0;$("anchor"+k).value=p[k.toLowerCase()].toFixed(4);}
      $("frameLabel").textContent=`${names[action]} · 原图帧 ${frame+1} / 9`;
      drawPreview();
    }
    function drawPreview(){
      const canvas=$("anchorPreview"),ctx=canvas.getContext("2d");ctx.clearRect(0,0,canvas.width,canvas.height);imageBox=null;if(!image||!entry)return;
      const r=art.layout.frames[frame].rect,p=entry.layout.frames[frame].pivot,scale=Math.min((canvas.width-30)/r.width,(canvas.height-30)/r.height),w=r.width*scale,h=r.height*scale,x=(canvas.width-w)/2,y=(canvas.height-h)/2;
      ctx.drawImage(image,r.x,art.layout.sourceHeight-r.y-r.height,r.width,r.height,x,y,w,h);ctx.strokeStyle="#597582";ctx.strokeRect(x,y,w,h);const ax=x+p.x*w,ay=y+(1-p.y)*h;ctx.strokeStyle="#ffa95c";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ax-10,ay);ctx.lineTo(ax+10,ay);ctx.moveTo(ax,ay-10);ctx.lineTo(ax,ay+10);ctx.stroke();imageBox={x,y,w,h};
    }
    function updateFrame(){if(!entry)return;const clip=entry.layout.clips[action],b=(stage.actors[1]?.entry||review.baseline).layout.clips[action],duration=Math.max(1.6,clip.frames.length/clip.fps+.65),t=clip.loop?elapsed:elapsed%duration;frame=manual===null?frameAt(clip,t):clip.frames[Math.min(manual,clip.frames.length-1)];stage.action=action;stage.elapsed=t;stage.frameIndices=[frame,manual===null?frameAt(b,t):b.frames[Math.min(manual,b.frames.length-1)]];$("frame").max=clip.frames.length-1;$("frame").value=clip.frames.indexOf(frame);$("frameInfo").textContent=`${clip.frames.indexOf(frame)+1} / ${clip.frames.length} 帧 · ${clip.fps}fps`;if(frame!==lastFrame){lastFrame=frame;frameControls();}}
    function setAction(next){action=next;elapsed=0;manual=null;lastFrame=-1;for(const b of $("actions").children)b.setAttribute("aria-pressed",String(b.dataset.action===action));apply();controls();}
    async function select(card){const token=++selectionToken;selected=card;art=arts.get(card.uid);config=cfg(card.uid);lastFrame=-1;elapsed=0;manual=null;image=null;$("stageError").hidden=true;$("unitName").textContent=card.nameKey;$("identity").textContent=`${factions[card.classId]} / ${card.id}`;$("activeLabel").textContent=card.nameKey;$("cardLink").href=`./card-editor.html?unit=${encodeURIComponent(card.uid)}`;$("cardArtDescription").textContent=card.artDescription||"此卡暂无画面描述";$("provenance").textContent=previewSource==="published"?"游戏发布产物 · SHA 校验后显示 · 九帧共用尺寸 / 锚点 / 动作配置":"原色图集 · 每套九帧共用尺寸 · 保存参数不会修改卡牌设计";const url=new URL(location.href);url.searchParams.set("unit",card.uid);history.replaceState(null,"",url);apply();controls();
      try{const baselineEntry=previewSource==="published"&&published?.units.some(u=>u.uid===review.baseline.uid)?P.entry(published,review.baseline.uid):review.baseline;await Promise.all([stage.setActor(0,entry),stage.setActor(1,baselineEntry)]);if(token!==selectionToken)return;const nextImage=new Image();nextImage.onload=()=>{if(token===selectionToken){image=nextImage;drawPreview();}};nextImage.src=`${art.atlasSrc}?v=${art.atlasSha256}`;}catch(e){stage.onError(e.message);}renderList();
    }
    function renderList(){const q=$("search").value.trim().toLowerCase(),f=$("faction").value,s=$("availability").value;$("unitList").replaceChildren();let count=0;for(const c of units){const a=arts.get(c.uid);if((f&&f!==c.classId)||(s&&s!==a.status)||(q&&!`${c.id} ${c.nameKey} ${c.englishName}`.toLowerCase().includes(q)))continue;count++;const button=document.createElement("button");button.className="unit-item";button.dataset.status=a.status;button.setAttribute("aria-pressed",String(selected?.uid===c.uid));const thumb=document.createElement("span");thumb.className="thumb";const im=document.createElement("img"),r=a.layout.frames[0].rect,k=Math.min(42/r.width,52/r.height);im.src=`${a.atlasSrc}?v=${a.atlasSha256}`;im.loading="lazy";im.alt="";Object.assign(im.style,{width:`${a.layout.sourceWidth*k}px`,height:`${a.layout.sourceHeight*k}px`,left:`${-r.x*k+(44-r.width*k)/2}px`,top:`${-(a.layout.sourceHeight-r.y-r.height)*k+(54-r.height*k)/2}px`});thumb.append(im);const label=document.createElement("span"),name=document.createElement("strong"),meta=document.createElement("small");name.textContent=c.nameKey;meta.textContent=`${c.id} · ${cfg(c.uid)?.exportReady?"选定导出":"未选定"}`;label.append(name,meta);button.append(thumb,label);button.onclick=()=>select(c);$("unitList").append(button);}$("resultCount").textContent=`显示 ${count} / ${units.length} 个单位`;}
    async function save(){if(saving)return;if(!writable){remember();status("当前为静态页面，已保留浏览器草稿；请导出配置JSON");return;}try{C.validate(data,review,cards,{allowStale:true});saving=true;$("save").disabled=true;const snapshot=clone(data);const r=await fetch("./api/chibi/save",{method:"POST",headers:{"Content-Type":"application/json","X-TBH-Chibi":"1"},body:JSON.stringify({dataset:snapshot,baseRevision:revision,reviewRevision})});const result=await r.json();if(!r.ok)throw new Error(result.error);saved=snapshot;revision=result.revision;reviewRevision=result.reviewRevision;savedRevision=revision;savedReviewRevision=reviewRevision;dirty=C.stableStringify(data)!==C.stableStringify(saved);if(!dirty)localStorage.removeItem(DRAFT);status(dirty?"已保存较早快照；仍有新更改待保存":"已保存到项目 · 刷新后保留");}catch(e){remember();status(`${e.message}；草稿已保留，可导出配置`);}finally{saving=false;$("save").disabled=false;}}
    async function runtimeExport(format,all){if(dirty){status("请先保存当前更改，再导出运行素材");return;}if(!writable){status("静态页面请导出配置；运行包用本地工作台或CLI生成");return;}status("正在校验与打包…");try{const r=await fetch("./api/chibi/export",{method:"POST",headers:{"Content-Type":"application/json","X-TBH-Chibi":"1"},body:JSON.stringify({baseRevision:revision,format,uids:all?null:[selected.uid]})});if(!r.ok){const e=await r.json();throw new Error(e.error);}download(await r.blob(),format==="manifest"?`${selected.id}-manifest.json`:"tbh-chibi-runtime.tar");status("导出完成；游戏与线上网站未自动更新");}catch(e){status(e.message);}}
    $("previewSource").onchange=()=>setPreview($("previewSource").value).catch(e=>status(e.message));
    $("publish").onclick=async()=>{
      if(dirty){status("请先保存校准更改，再发布游戏素材");return;}
      $("publish").disabled=true;status("正在校验、离线修补并发布全部素材…");
      try{const response=await fetch("./api/chibi/publish",{method:"POST",headers:{"Content-Type":"application/json","X-TBH-Chibi":"1"},body:JSON.stringify({baseRevision:revision,reviewRevision})}),result=await response.json();if(!response.ok)throw new Error(result.error);published=result.published;await setPreview("published");status("游戏素材已发布到本地网站 · 可下载或导入 Unity；线上部署与游戏更新需单独执行");}
      catch(e){status(e.message);}finally{publicationInfo();}
    };
    $("downloadPublishedPng").onclick=async()=>{try{const e=P.entry(published,selected.uid);download(new Blob([await P.imageBytes(e)],{type:"image/png"}),`${selected.id}-${selected.uid}.png`);status("已下载发布 PNG，哈希校验通过");}catch(e){status(e.message);}};
    $("downloadPublishedBundle").onclick=async()=>{try{download(await P.unitBundle(published,selected.uid),`${selected.id}-chibi-runtime.tar`);status("已下载本单位 PNG + 运行清单；这是子集包，不可替代完整生产 Catalog");}catch(e){status(e.message);}};
    for(const [value,label] of Object.entries(factions)){const o=document.createElement("option");o.value=value;o.textContent=label;$("faction").append(o);}
    $("coverage").textContent=`${units.length} 个单位 · ${review.entries.length} 套新图集 · 洛岚黄金基准。具体图集仍保留审阅状态。`;
    for(const id of ["search","faction","availability"])$(id).oninput=renderList;
    for(const b of $("actions").children)b.onclick=()=>setAction(b.dataset.action);
    $("play").onclick=()=>{playing=!playing;manual=null;$("play").textContent=playing?"暂停":"播放";};$("replay").onclick=()=>{elapsed=0;manual=null;playing=true;$("play").textContent="暂停";};
    $("frame").oninput=()=>{manual=Number($("frame").value);playing=false;$("play").textContent="播放";updateFrame();};$("flip").onclick=()=>{stage.facing*=-1;$("flip").textContent=stage.facing===1?"朝向：右":"朝向：左";};
    $("orientation").onchange=()=>stage.orientation=$("orientation").value;$("motion").onchange=()=>stage.motion=$("motion").checked;$("resetView").onclick=()=>stage.reset();$("compare").onclick=()=>{stage.compare=!stage.compare;$("compare").setAttribute("aria-pressed",String(stage.compare));$("baselineLabel").style.display=stage.compare?"":"none";stage.reset();};
    $("authorPanel").ontoggle=()=>{if($("authorPanel").open&&previewSource!=="author")setPreview("author");stage.showGuides=$("authorPanel").open&&$("guides").checked;drawPreview();};$("guides").onchange=()=>stage.showGuides=$("guides").checked&&$("authorPanel").open;
    function numeric(id,min,max,write){$(id).oninput=()=>{const n=Number($(id).value);if($(id).value===""||!Number.isFinite(n)||n<min||n>max)return;if(/^(anchor|frame)[XY]$/.test(id)){manual=entry.layout.clips[action].frames.indexOf(frame);playing=false;$("play").textContent="播放";}write(n);changed();};}
    for(const id of ["height","scaleNumber"])numeric(id,.1,8,n=>{config.scale=n;$("height").value=n;$("height").setAttribute("aria-valuetext",`${n.toFixed(2)} 格`);$("scaleNumber").value=n;$("heightValue").textContent=`${n.toFixed(2)} 格`;});
    for(const k of ["X","Y","Z"])numeric("offset"+k,-4,4,n=>config.offset[k.toLowerCase()]=n);
    const actionRecord=()=>config.actions[action]||(config.actions[action]={});const frameRecord=()=>config.frames[String(frame)]||(config.frames[String(frame)]={});
    numeric("actionFps",1,24,n=>actionRecord().fps=n);
    for(const k of ["X","Y"]){numeric("action"+k,-4,4,n=>{const a=actionRecord();a.offset={x:0,y:0,...a.offset,[k.toLowerCase()]:n};});numeric("frame"+k,-4,4,n=>{const f=frameRecord();f.offset={x:0,y:0,...f.offset,[k.toLowerCase()]:n};});numeric("anchor"+k,0,1,n=>{frameRecord().anchor={...entry.layout.frames[frame].pivot,[k.toLowerCase()]:n};drawPreview();});}
    $("anchorPreview").onclick=event=>{if(!imageBox)return;const bounds=event.currentTarget.getBoundingClientRect(),x=(event.clientX-bounds.left)*event.currentTarget.width/bounds.width,y=(event.clientY-bounds.top)*event.currentTarget.height/bounds.height,b=imageBox;if(x<b.x||x>b.x+b.w||y<b.y||y>b.y+b.h)return;manual=entry.layout.clips[action].frames.indexOf(frame);playing=false;$("play").textContent="播放";frameRecord().anchor={x:(x-b.x)/b.w,y:1-(y-b.y)/b.h};changed();frameControls();};
    $("resetFrame").onclick=()=>{delete config.frames[String(frame)];changed();frameControls();};$("shareAnchor").onclick=()=>{config.anchor={...entry.layout.frames[frame].pivot};delete frameRecord().anchor;changed();frameControls();};$("resetAnchor").onclick=()=>{config.anchor=null;for(const f of Object.values(config.frames))delete f.anchor;changed();frameControls();};
    $("bodyKind").onchange=()=>{config.bodyKind=$("bodyKind").value;changed();};$("sizeClass").onchange=()=>{config.sizeClass=$("sizeClass").value;changed();};$("preset").onclick=()=>{const targets={small:.85,standard:1.08,heavy:1.35,colossal:1.65,floating:1.12},box=art.analysis?.frameMetrics?.[0]?.opaqueBoundsTopOrigin;if(box)config.scale=targets[config.sizeClass]*art.layout.nominalCellHeight/(box[3]-box[1]);else config.scale=targets[config.sizeClass];config.scale=Math.max(.1,Math.min(8,config.scale));changed();controls();};
    $("sourceFacing").onchange=()=>{config.artworkFacesRight=$("sourceFacing").checked;changed();};$("exportReady").onchange=()=>{config.exportReady=$("exportReady").checked;changed();renderList();};$("rebase").onclick=()=>{config.atlasSha256=art.atlasSha256;config.frames={};config.exportReady=false;changed();controls();status("已绑定新图；逐帧覆盖已清空，请重新检查后选定导出并保存");};
    $("promptBase").oninput=()=>{config.prompt.base=$("promptBase").value;changed();};$("promptNotes").oninput=()=>{config.prompt.notes=$("promptNotes").value;changed();};$("promptAction").oninput=()=>{config.prompt.actions={...config.prompt.actions,[action]:$("promptAction").value};changed();};
    $("copyPrompt").onclick=async()=>{const content=C.assembledPrompt(config,data.defaults);try{await navigator.clipboard.writeText(content);status("已复制整套生成提示词");}catch{download(content,`${selected.id}-prompt.txt`,"text/plain");status("已导出提示词文本");}};
    $("save").onclick=save;$("revert").onclick=()=>{data=clone(saved);revision=savedRevision;reviewRevision=savedReviewRevision;dirty=false;localStorage.removeItem(DRAFT);select(selected);status("已还原本次载入或保存时的配置");};
    $("exportConfig").onclick=()=>download(data,"chibi-workbench.json");$("importConfig").onchange=async event=>{try{const file=event.target.files[0];if(!file)return;if(file.size>4*1024*1024)throw new Error("配置文件超过4MB");const next=JSON.parse(await file.text());C.validate(next,review,cards,{allowStale:true});data=next;config=cfg(selected.uid);changed();controls();renderList();status("配置已导入草稿；检查后点击保存");}catch(e){status(`导入失败：${e.message}`);}finally{event.target.value="";}};
    $("exportManifest").onclick=()=>runtimeExport("manifest",false);$("exportBundle").onclick=()=>runtimeExport("bundle",true);
    let recovery=null;try{recovery=JSON.parse(localStorage.getItem(DRAFT));}catch{}$("recoverDraft").hidden=!recovery;$("recoverDraft").onclick=()=>{try{C.validate(recovery.dataset,review,cards,{allowStale:true});data=clone(recovery.dataset);const recovered=C.recoveryContext(recovery,revision,reviewRevision),conflict=recovered.conflict;revision=recovered.revision;reviewRevision=recovered.reviewRevision;config=cfg(selected.uid);changed();controls();renderList();status(conflict?"草稿基于旧磁盘版本；导出配置以合并，保存不会覆盖新版本":"已恢复未保存草稿；检查后保存");}catch(e){status(e.message);}};
    const requested=new URL(location.href).searchParams.get("unit");await select(units.find(c=>c.uid===requested||c.id===requested)||units[0]);status(writable?"已连接本地项目 · 显式保存配置":"静态预览 · 可导入/导出配置，未连接磁盘保存");
    let raf;function tick(now){const dt=previous?Math.min(.1,(now-previous)/1000):0;previous=now;if(playing&&!document.hidden)elapsed+=dt*Number($("speed").value);if(!document.hidden){updateFrame();stage.render();}raf=requestAnimationFrame(tick);}raf=requestAnimationFrame(tick);addEventListener("pagehide",()=>{cancelAnimationFrame(raf);stage.dispose();},{once:true});addEventListener("beforeunload",e=>{if(dirty){remember();e.preventDefault();e.returnValue="";}});
  }
  start().catch(e=>{$("coverage").textContent=`无法载入：${e.message}`;$("stageError").hidden=false;$("stageError").textContent=e.message;});
})();
