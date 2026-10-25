/* A small, dependency-free WebGL stage. Geometry, perspective and paper shadows
   are rendered in world space; the source illustrations are never recoloured. */
(() => {
  "use strict";
  const add=(a,b)=>a.map((v,i)=>v+b[i]), mul=(a,n)=>a.map(v=>v*n), sub=(a,b)=>a.map((v,i)=>v-b[i]);
  const dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0), cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const norm=a=>mul(a,1/(Math.hypot(...a)||1));
  function multiply(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o;}
  function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),nf=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);}
  function lookAt(eye,target){const z=norm(sub(eye,target)),x=norm(cross([0,1,0],z)),y=cross(z,x);return {matrix:new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]),right:x,up:y};}
  function compile(gl,type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
  function program(gl,vertex,fragment){const p=gl.createProgram();const shaders=[compile(gl,gl.VERTEX_SHADER,vertex),compile(gl,gl.FRAGMENT_SHADER,fragment)];shaders.forEach(s=>gl.attachShader(p,s));gl.linkProgram(p);shaders.forEach(s=>gl.deleteShader(s));if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));return p;}
  const vertex=`attribute vec3 a_position;attribute vec4 a_color;attribute vec2 a_uv;uniform mat4 u_matrix;varying vec4 v_color;varying vec2 v_uv;void main(){gl_Position=u_matrix*vec4(a_position,1.);v_color=a_color;v_uv=a_uv;}`;
  const fragment=`precision mediump float;varying vec4 v_color;varying vec2 v_uv;uniform sampler2D u_texture;uniform int u_mode;uniform vec4 u_rect;uniform vec2 u_pixels;uniform float u_facing;uniform vec4 u_exclusion;
    vec4 sampleFrame(vec2 p){if(p.x<0.||p.y<0.||p.x>1.||p.y>1.)return vec4(0.);p.x=u_facing<0.?1.-p.x:p.x;if(u_exclusion.z>0.&&p.x>=u_exclusion.x&&p.x<=u_exclusion.x+u_exclusion.z&&p.y>=u_exclusion.y&&p.y<=u_exclusion.y+u_exclusion.w)return vec4(0.);return texture2D(u_texture,u_rect.xy+p*u_rect.zw);}
    void main(){if(u_mode==0){gl_FragColor=v_color;return;}if(u_mode==3){float d=length((v_uv-.5)*2.);gl_FragColor=vec4(.01,.035,.055,.23*pow(max(0.,1.-d),2.));return;}
    vec4 raw=sampleFrame(v_uv);if(u_mode==2){gl_FragColor=vec4(.015,.025,.045,raw.a*.19);return;}float a=raw.a;
    float rag=.84+.16*sin(v_uv.x*171.+sin(v_uv.y*133.)*3.);vec2 d=u_pixels*rag;
    a=max(a,sampleFrame(v_uv+vec2(d.x,0.)).a);a=max(a,sampleFrame(v_uv-vec2(d.x,0.)).a);a=max(a,sampleFrame(v_uv+vec2(0.,d.y)).a);a=max(a,sampleFrame(v_uv-vec2(0.,d.y)).a);
    a=max(a,sampleFrame(v_uv+d*.707).a);a=max(a,sampleFrame(v_uv-d*.707).a);a=max(a,sampleFrame(v_uv+vec2(d.x,-d.y)*.707).a);a=max(a,sampleFrame(v_uv+vec2(-d.x,d.y)*.707).a);
    if(a<.025)discard;float grain=.982+.018*sin(gl_FragCoord.x*1.7+gl_FragCoord.y*2.3);vec3 paper=vec3(.98,.985,.97)*grain;
    gl_FragColor=vec4(mix(paper,raw.rgb,raw.a),a*v_color.a);}`;
  class PaperStage {
    constructor(canvas){
      this.canvas=canvas;this.gl=canvas.getContext("webgl",{alpha:false,antialias:true,preserveDrawingBuffer:false});if(!this.gl)throw new Error("此浏览器没有开启 WebGL，无法显示三维验收场景。");
      const gl=this.gl;this.program=program(gl,vertex,fragment);this.buffer=gl.createBuffer();this.locations={};for(const n of ["a_position","a_color","a_uv"])this.locations[n]=gl.getAttribLocation(this.program,n);for(const n of ["u_matrix","u_texture","u_mode","u_rect","u_pixels","u_facing","u_exclusion"])this.locations[n]=gl.getUniformLocation(this.program,n);
      this.textures=new Map();this.actors=[null,null];this.compare=true;this.height=1.1;this.orientation="billboard";this.facing=1;this.motion=true;this.frameIndices=[0,0];this.action="idle";this.elapsed=0;this.disposed=false;this.reset();
      gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(.045,.077,.108,1);
      this.controller=new AbortController();const opt={signal:this.controller.signal};let drag=null;
      canvas.addEventListener("pointerdown",e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);},opt);
      canvas.addEventListener("pointermove",e=>{if(!drag)return;this.yaw-=(e.clientX-drag.x)*.006;this.pitch=Math.max(.25,Math.min(1.28,this.pitch+(e.clientY-drag.y)*.005));drag={x:e.clientX,y:e.clientY};},opt);
      for(const event of ["pointerup","pointercancel","lostpointercapture"])canvas.addEventListener(event,()=>{drag=null;},opt);
      canvas.addEventListener("wheel",e=>{e.preventDefault();this.distance=Math.max(4.8,Math.min(16,this.distance*Math.exp(e.deltaY*.0008)));},{...opt,passive:false});
      canvas.addEventListener("dblclick",()=>this.reset(),opt);
      this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas);this.resize();
      canvas.addEventListener("webglcontextlost",e=>{e.preventDefault();this.onError?.("三维图形上下文已丢失，请刷新页面。");},opt);
    }
    reset(){this.yaw=0;this.pitch=.69;const r=this.canvas.getBoundingClientRect();this.distance=this.compare?Math.max(6.25,10.8/Math.max(.8,r.width/r.height)):5.4;}
    resize(){const r=this.canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.max(1,Math.round(r.width*d));this.canvas.height=Math.max(1,Math.round(r.height*d));}
    async setActor(index,entry){
      const token={entry};this.actors[index]=token;if(!entry?.atlasSrc||!entry.layout)throw new Error("素材索引没有可用的图集或裁切信息");
      const textureKey=`${entry.atlasSrc}?v=${entry.atlasSha256||"legacy"}`;let texture=this.textures.get(textureKey);
      if(!texture){texture=new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{if(this.disposed)return reject(new Error("场景已关闭"));const gl=this.gl,t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);resolve(t);};image.onerror=()=>reject(new Error(`图片载入失败：${entry.atlasSrc}`));image.src=textureKey;});this.textures.set(textureKey,texture);}
      token.texture=await texture;
      // Avoid retaining all 99 GPU atlases while browsing the full roster.
      if(this.textures.size>6){for(const [src,promise] of this.textures){if(this.actors.some(a=>`${a?.entry.atlasSrc}?v=${a?.entry.atlasSha256||"legacy"}`===src))continue;this.textures.delete(src);promise.then(t=>this.gl.deleteTexture(t)).catch(()=>{});if(this.textures.size<=4)break;}}
    }
    quad(out,p0,p1,p2,p3,color,uv=[[0,0],[1,0],[1,1],[0,1]]){for(const i of [0,1,2,0,2,3])out.push(...[p0,p1,p2,p3][i],...color,...uv[i]);}
    box(out,x,y,z,w,h,d,color){const a=x-w/2,b=x+w/2,c=z-d/2,e=z+d/2;this.quad(out,[a,y,c],[a,y,e],[b,y,e],[b,y,c],[...color,1]);this.quad(out,[a,y-h,e],[a,y-h,c],[a,y,c],[a,y,e],[...mul(color,.66),1]);this.quad(out,[b,y-h,c],[b,y-h,e],[b,y,e],[b,y,c],[...mul(color,.8),1]);this.quad(out,[b,y-h,e],[a,y-h,e],[a,y,e],[b,y,e],[...mul(color,.74),1]);this.quad(out,[a,y-h,c],[b,y-h,c],[b,y,c],[a,y,c],[...mul(color,.57),1]);}
    board(out,offset,baseline){
      this.box(out,offset,-.11,0,3.23,.22,3.23,[.15,.21,.25]);this.box(out,offset,-.005,0,3.09,.105,3.09,[.24,.31,.35]);
      for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++){const center=x===0&&z===0;this.box(out,offset+x,.015,z,.968,.055,.968,center?[.31,.43,.46]:[.30+(x+z+2)%2*.018,.37,.40]);
        for(const side of [-1,1]){this.box(out,offset+x+side*.414,.019,z-.405,.025,.002,.025,[.17,.25,.29]);this.box(out,offset+x+side*.414,.019,z+.405,.025,.002,.025,[.17,.25,.29]);}
      }
      const tint=baseline?[.69,.65,.48]:[.48,.73,.70];
      for(const sx of [-1,1])for(const sz of [-1,1]){this.box(out,offset+sx*.455,.022,sz*.405,.022,.005,.12,tint);this.box(out,offset+sx*.405,.022,sz*.455,.12,.005,.022,tint);}
      for(const x of [-1,0,1]){this.box(out,offset+x,-.08,1.608,.36,.02,.018,[.48,.61,.64]);this.box(out,offset+x,-.08,-1.608,.14,.02,.018,tint);}
      for(const s of [-1,1]){this.box(out,offset+s*1.52,.021,0,.035,.025,.35,[.63,.53,.35]);this.box(out,offset+s*1.52,.021,.31,.035,.025,.075,[.63,.53,.35]);}
    }
    drawVertices(vertices,mode=0,actor=null,frame=null){if(!vertices.length)return;const gl=this.gl,l=this.locations;gl.useProgram(this.program);gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.DYNAMIC_DRAW);for(const [n,size,offset] of [["a_position",3,0],["a_color",4,12],["a_uv",2,28]]){gl.enableVertexAttribArray(l[n]);gl.vertexAttribPointer(l[n],size,gl.FLOAT,false,36,offset);}gl.uniformMatrix4fv(l.u_matrix,false,this.matrix);gl.uniform1i(l.u_mode,mode);gl.uniform1f(l.u_facing,this.facing*(actor?.entry.artworkFacesRight===false?-1:1));
      if(actor&&frame){const layout=actor.entry.layout,r=frame.rect;gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,actor.texture);gl.uniform1i(l.u_texture,0);gl.uniform4f(l.u_rect,r.x/layout.sourceWidth,r.y/layout.sourceHeight,r.width/layout.sourceWidth,r.height/layout.sourceHeight);gl.uniform2f(l.u_pixels,4.5/r.width,4.5/r.height);const exclusion=frame.excludedRects?.[0];gl.uniform4f(l.u_exclusion,exclusion?exclusion.x/r.width:-1,exclusion?exclusion.y/r.height:-1,exclusion?exclusion.width/r.width:0,exclusion?exclusion.height/r.height:0);}
      gl.drawArrays(gl.TRIANGLES,0,vertices.length/9);
    }
    drawActor(index,offset,basis){const actor=this.actors[index];if(!actor?.texture)return;const f=actor.entry.layout.frames[this.frameIndices[index]]||actor.entry.layout.frames[0],r=f.rect,p=f.pivot;const nominal=actor.entry.layout.nominalCellHeight||actor.entry.layout.frames[0].rect.height;const scale=(actor.entry.heightInTiles??(index===1?1.1:this.height))/nominal,w=r.width*scale,h=r.height*scale,spriteFacing=this.facing*(actor.entry.artworkFacesRight===false?-1:1),px=spriteFacing<0?1-p.x:p.x;
      const t=this.elapsed,enabled=this.motion,action=this.action;let rise=0,lean=0,shake=0;
      if(enabled){if(action==="move"){rise=Math.abs(Math.sin(t*10))*.035;lean=Math.sin(t*10)*.025;}else if(action==="hit"){shake=Math.sin(t*55)*.035*Math.exp(-t*6);lean=-.08*Math.exp(-t*4);}else if(action==="attack")lean=Math.sin(Math.min(t*4,1)*Math.PI)*.12;else if(action==="effect")rise=Math.sin(Math.min(t*2.5,1)*Math.PI)*.11;}
      const off=actor.entry.groundOffsetInTiles||{x:0,y:0,z:0},gx=offset+off.x,gz=off.z,ground=[gx,.027+off.y,gz],shadow=[];this.quad(shadow,[gx-.43,.024,gz-.27],[gx+.43,.024,gz-.27],[gx+.43,.024,gz+.29],[gx-.43,.024,gz+.29],[1,1,1,1]);this.gl.depthMask(false);this.drawVertices(shadow,3);
      const silhouette=[];this.quad(silhouette,[gx-w*px,.025,gz],[gx+w*(1-px),.025,gz],[gx+w*(1-px)+.18,.025,gz-h*.33],[gx-w*px+.18,.025,gz-h*.33],[1,1,1,1]);this.drawVertices(silhouette,2,actor,f);
      const right=this.orientation==="billboard"?basis.right:[1,0,0],up=this.orientation==="billboard"?basis.up:[0,.88,-.475];const base=add(ground,[shake,rise,0]);const correction=f.offsetInTiles||{x:0,y:0};const pos=(x,y)=>add(base,add(mul(right,x+lean*y+correction.x*spriteFacing),mul(up,y+correction.y)));const pad=6*scale,l=-w*px-pad,rr=w*(1-px)+pad,b=-h*p.y-pad,top=h*(1-p.y)+pad;
      const q=[];this.quad(q,pos(l,b),pos(rr,b),pos(rr,top),pos(l,top),[1,1,1,1],[[-6/r.width,-6/r.height],[1+6/r.width,-6/r.height],[1+6/r.width,1+6/r.height],[-6/r.width,1+6/r.height]]);this.drawVertices(q,1,actor,f);this.gl.depthMask(true);
      if(this.showGuides){const guide=[];this.box(guide,offset,.035,0,.32,.003,.018,[.65,.95,.87]);this.box(guide,offset,.035,0,.018,.003,.32,[.65,.95,.87]);this.gl.disable(this.gl.DEPTH_TEST);this.drawVertices(guide);const marker=[];this.quad(marker,pos(-.045,-.008),pos(.045,-.008),pos(.045,.008),pos(-.045,.008),[1,.62,.3,1]);this.quad(marker,pos(-.008,-.045),pos(.008,-.045),pos(.008,.045),pos(-.008,.045),[1,.62,.3,1]);this.drawVertices(marker);this.gl.enable(this.gl.DEPTH_TEST);}

    }
    render(){if(this.disposed)return;const gl=this.gl;gl.viewport(0,0,this.canvas.width,this.canvas.height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);const target=[0,.3,0],eye=add(target,[Math.sin(this.yaw)*Math.cos(this.pitch)*this.distance,Math.sin(this.pitch)*this.distance,Math.cos(this.yaw)*Math.cos(this.pitch)*this.distance]);const basis=lookAt(eye,target),aspect=this.canvas.width/this.canvas.height;
      // Portrait screens widen the vertical field so the same boards remain visible.
      const fov=aspect<1.25?.60/Math.max(.55,aspect/1.25):.60;this.matrix=multiply(perspective(fov,aspect,.1,50),basis.matrix);const geometry=[];
      this.box(geometry,0,-.34,0,80,.03,80,[.065,.105,.135]);this.board(geometry,this.compare?-1.9:0,false);if(this.compare)this.board(geometry,1.9,true);this.drawVertices(geometry);
      const offsets=this.compare?[-1.9,1.9]:[0];offsets.map((x,index)=>({x,index,depth:dot(sub([x,.5,0],eye),sub(target,eye))})).sort((a,b)=>b.depth-a.depth).forEach(({index,x})=>this.drawActor(index,x,basis));
    }
    dispose(){this.disposed=true;this.controller.abort();this.observer.disconnect();for(const p of this.textures.values())p.then(t=>this.gl.deleteTexture(t)).catch(()=>{});this.gl.deleteBuffer(this.buffer);this.gl.deleteProgram(this.program);}
  }
  globalThis.TbhPaperStage=PaperStage;
})();
