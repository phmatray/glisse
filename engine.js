// engine.js — Korg Kaossilator (KO-1, 2007) recréé sur Web Audio. Aucune référence au DOM.
// Données transcrites du manuel KO-1 et des deux fiches (scale list / gate arpeggiator list).
'use strict';
const KO1 = (() => {

// ---------------------------------------------------------------- données
// [affichage, nom, demi-tons depuis la tonique] — 0 = OFF (hauteur continue, non quantifiée)
const SCALES = [
  ['OFF','Off (continu)',null],
  ['CHR','Chromatic',[0,1,2,3,4,5,6,7,8,9,10,11]],
  ['ION','Ionian',[0,2,4,5,7,9,11]],
  ['DOR','Dorian',[0,2,3,5,7,9,10]],
  ['PHR','Phrygian',[0,1,3,5,7,8,10]],
  ['LYD','Lydian',[0,2,4,6,7,9,11]],
  ['MXL','Mixolydian',[0,2,4,5,7,9,10]],
  ['AEO','Aeolian',[0,2,3,5,7,8,10]],
  ['LOC','Locrian',[0,1,3,5,6,8,10]],
  ['MAB','Major Blues',[0,3,4,7,9,10]],
  ['MIB','minor Blues',[0,3,5,6,7,10]],
  ['DIM','Diminish',[0,2,3,5,6,8,9,11]],
  ['CDM','Combination Diminish',[0,1,3,4,6,7,9,10]],
  ['MAP','Major Pentatonic',[0,2,4,7,9]],
  ['MIP','minor Pentatonic',[0,3,5,7,10]],
  ['RG1','Raga Bhairav',[0,1,4,5,7,8,11]],
  ['RG2','Raga Gamanasrama',[0,1,4,6,7,9,11]],
  ['RG3','Raga Todi',[0,1,3,6,7,8,11]],
  ['SPN','Spanish Scale',[0,1,3,4,5,7,8,10]],
  ['GYP','Gypsy Scale',[0,2,3,6,7,8,11]],
  ['ARB','Arabian Scale',[0,2,4,5,6,8,10]],
  ['EGY','Egyptian Scale',[0,2,5,7,10]],
  ['HWI','Hawaiian Scale',[0,2,3,7,9]],
  ['PLG','Bali Island Pelog',[0,1,3,7,8]],
  ['JPN','Japanese Miyakobushi',[0,1,5,7,8]],
  ['RKY','Ryukyu Scale',[0,4,5,7,11]],
  ['WHL','Wholetone',[0,2,4,6,8,10]],
  ['MI3','minor 3rd Interval',[0,3,6,9]],
  ['3RD','3rd Interval',[0,4,8]],
  ['4TH','4th Interval',[0,5,10]],
  ['5TH','5th Interval',[0,7]],
  ['OCT','Octave Interval',[0]],
];
const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const KEYS = Array.from({length:25}, (_,i) => 48+i);            // C3 … C5 (MIDI)
const keyName = m => NOTE_NAMES[m%12] + (Math.floor(m/12)-1);
const LENGTHS = [1/16, 1/8, 1/4, 1/2, 1, 2, 4, 8];              // beats
const LENGTH_NAMES = ['1/16','1/8','1/4','1/2','1','2','4','8'];

// Gate arpeggiator : [longueur en ticks (48/beat), segments "gate ON" [début,fin]] — G.00 … G.49
const GATE = [
[48,[[0,9],[12,21],[24,33],[36,45]]], [48,[[0,18],[24,42]]], [36,[[0,30]]], [48,[[0,39]]], [72,[[0,60]]],
[96,[[0,84]]], [192,[[0,180]]], [36,[[0,9],[12,21]]], [36,[[0,24]]], [36,[[0,12],[24,33]]],
[36,[[0,3],[12,27]]], [48,[[0,21],[24,33],[36,45]]], [48,[[0,9],[12,21],[24,45]]], [48,[[0,9],[12,21],[36,45]]],
[48,[[0,3],[12,30],[36,39]]], [48,[[0,3],[24,45]]], [48,[[0,9],[24,33],[36,45]]], [48,[[0,3],[12,15],[24,42]]],
[48,[[0,9],[16,21],[24,36],[40,45]]], [48,[[0,9],[24,36],[40,45]]], [48,[[0,3],[24,36],[40,45]]],
[60,[[0,21],[24,40],[48,51]]], [60,[[0,24],[36,48]]], [60,[[0,9],[24,33],[48,57]]],
[72,[[0,21],[24,33],[36,45],[48,57],[60,69]]], [72,[[0,9],[12,21],[24,45],[48,69]]], [72,[[0,12],[36,60]]],
[72,[[0,12],[16,21],[40,45],[48,60],[64,69]]],
[96,[[0,9],[12,21],[36,45],[48,57],[72,81],[84,93]]], [96,[[0,9],[12,21],[24,45],[48,51],[60,69],[72,81],[84,93]]],
[96,[[0,21],[24,45],[48,51],[60,81],[84,93]]], [96,[[0,12],[36,84]]], [96,[[0,6],[36,42],[72,78]]],
[96,[[0,9],[12,21],[24,27],[36,51],[60,63],[72,87]]], [96,[[0,21],[24,27],[36,57],[60,81],[84,87]]],
[96,[[0,3],[12,27],[36,51],[60,63],[72,87]]], [96,[[0,3],[24,42],[48,51],[60,78]]],
[96,[[0,3],[24,27],[36,54],[60,63],[72,90]]], [96,[[0,30],[36,48],[72,75],[84,87]]],
[96,[[0,12],[15,21],[24,27],[39,51],[63,66],[72,90]]], [96,[[0,3],[15,18],[24,36],[39,60],[63,66],[72,84]]],
[96,[[0,24],[39,63],[72,87]]],
[192,[[0,36],[48,84],[96,120],[132,147],[156,171],[180,186]]], [192,[[0,24],[36,60],[72,96],[108,132],[144,165],[168,186]]],
[192,[[0,27],[48,72],[84,108],[120,144],[156,180]]], [192,[[0,6],[24,30],[60,66],[96,102],[132,138],[168,174]]],
[192,[[0,12],[24,48],[60,72],[84,96],[108,132],[144,156],[168,180]]],
[192,[[0,9],[12,18],[24,30],[36,42],[48,57],[72,81],[84,93],[108,117],[120,129],[144,153],[156,162],[168,177]]],
[192,[[0,36],[48,51],[60,72],[84,96],[108,129],[144,156],[168,180]]],
[192,[[0,57],[72,78],[84,90],[96,102],[108,114],[120,126],[132,150],[156,162],[168,186]]],
];

// ---------------------------------------------------------------- utilitaires
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const lerp = (a,b,t) => a + (b-a)*t;
const expo = (lo,hi,t) => lo * Math.pow(hi/lo, t);
const setT = (p,v,t,tc=.01) => { p.cancelScheduledValues(t); p.setTargetAtTime(v,t,tc); };
function env(p,t,e,peak=1){ setT(p,peak,t,Math.max(.002,e.a/3)); if(e.d>0) p.setTargetAtTime(peak*e.s, t+e.a, Math.max(.005,e.d/3)); }
const rel = (p,t,r) => setT(p,0,t,Math.max(.003,r/3));
const curve = k => { const c=new Float32Array(1024); for(let i=0;i<1024;i++){const x=i/511.5-1; c[i]=Math.tanh(x*k)/Math.tanh(k);} return c; };
const bitcurve = steps => { const c=new Float32Array(1024); for(let i=0;i<1024;i++){const x=i/511.5-1; c[i]=Math.round(x*steps)/steps;} return c; };
const VOWELS = [[800,1200],[400,2000],[300,2300],[500,900],[350,700]]; // a e i o u : F1,F2

let _noise, _ir;
function H(ctx){
  const h = {
    ctx,
    osc:(type,f,t=ctx.currentTime)=>{ const o=ctx.createOscillator(); o.type=type; o.frequency.value=f; o.start(t); return o; },
    g:(v=1)=>{ const g=ctx.createGain(); g.gain.value=v; return g; },
    f:(type,fc,q=1)=>{ const f=ctx.createBiquadFilter(); f.type=type; f.frequency.value=fc; f.Q.value=q; return f; },
    dl:(t,max=2)=>{ const d=ctx.createDelay(max); d.delayTime.value=t; return d; },
    pan:(v=0)=>{ const p=ctx.createStereoPanner(); p.pan.value=v; return p; },
    shaper:(k)=>{ const s=ctx.createWaveShaper(); s.curve=curve(k); s.oversample='2x'; return s; },
    noise:(t=ctx.currentTime)=>{ if(!_noise){ _noise=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate); const d=_noise.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1; }
      const s=ctx.createBufferSource(); s.buffer=_noise; s.loop=true; s.start(t); return s; },
    verb:()=>{ if(!_ir){ const n=ctx.sampleRate*1.8; _ir=ctx.createBuffer(2,n,ctx.sampleRate); for(let c=0;c<2;c++){const d=_ir.getChannelData(c); for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3);} }
      const c=ctx.createConvolver(); c.buffer=_ir; return c; },
  };
  return h;
}

// ---------------------------------------------------------------- post-FX (retournent le nœud de sortie)
const FX = {
  chain:(...fx)=>(src,N,h)=>fx.reduce((s,f)=>f(s,N,h),src),
  delay:(time,fb,mix,lp=12000)=>(src,N,h)=>{ const d=h.dl(time),f=h.f('lowpass',lp),fg=h.g(fb),wet=h.g(mix),o=h.g(1);
    src.connect(o); src.connect(d); d.connect(f).connect(fg).connect(d); d.connect(wet).connect(o); N.dly=d; N.dfb=fg; N.dwet=wet; N.dlp=f; return o; },
  pan:()=>(src,N,h)=>{ N.pan=h.pan(0); src.connect(N.pan); return N.pan; },
  autopan:(rate)=>(src,N,h)=>{ N.pan=h.pan(0); const l=h.osc('sine',rate), lg=h.g(0); l.connect(lg).connect(N.pan.pan); N.apg=lg; N.aplfo=l; (N.lfos||(N.lfos=[])).push(l); src.connect(N.pan); return N.pan; },
  verb:(mix)=>(src,N,h)=>{ const c=h.verb(),wet=h.g(mix),o=h.g(1); src.connect(o); src.connect(c).connect(wet).connect(o); N.vwet=wet; return o; },
  formant:()=>(src,N,h)=>{ const o=h.g(1); N.bp=[h.f('bandpass',800,8),h.f('bandpass',1200,8)]; N.bp.forEach(b=>{src.connect(b).connect(o);}); return o; },
  flanger:()=>(src,N,h)=>{ const d=h.dl(.003,.05),fg=h.g(.5),wet=h.g(0),o=h.g(1),l=h.osc('sine',.3),lg=h.g(.002);
    l.connect(lg).connect(d.delayTime); src.connect(o); src.connect(d); d.connect(fg).connect(d); d.connect(wet).connect(o); N.fwet=wet; (N.lfos||(N.lfos=[])).push(l); return o; },
  tremolo:(rate)=>(src,N,h)=>{ const g=h.g(1),l=h.osc('square',rate),lg=h.g(0); l.connect(lg).connect(g.gain); src.connect(g); N.trem=l; N.tremg=lg; (N.lfos||(N.lfos=[])).push(l); return g; },
  crush:()=>(src,N,h)=>{ const s=h.shaper(1); s.curve=bitcurve(256); const o=h.g(1); src.connect(s).connect(o); N.crush=s; return o; },
  hp:(fc)=>(src,N,h)=>{ N.hp=h.f('highpass',fc,.7); src.connect(N.hp); return N.hp; },
  lp:(fc)=>(src,N,h)=>{ N.lp=h.f('lowpass',fc,1); src.connect(N.lp); return N.lp; },
};
function setVowel(N,y,t){ const p=y*4, i=Math.min(3,Math.floor(p)), f=p-i; const a=VOWELS[i], b=VOWELS[i+1];
  setT(N.bp[0].frequency, lerp(a[0],b[0],f), t); setT(N.bp[1].frequency, lerp(a[1],b[1],f), t); }

// ---------------------------------------------------------------- cibles Y (et X) réutilisables
const Y = {
  cut:(lo=150,hi=9000)=>(y,N,t)=>{ N.fc=expo(lo,hi,y); setT(N.filt.frequency,N.fc,t); },
  lvl:(y,N,t)=>setT(N.ylvl.gain,.05+.95*y,t),
  vel:(lo=300,hi=6000)=>(y,N,t)=>{ setT(N.ylvl.gain,.15+.85*y,t); N.fc=expo(lo,hi,y); setT(N.filt.frequency,N.fc,t); },
  dec:(lo,hi)=>(y,N)=>{ N.e.d=lerp(lo,hi,y); N.e.r=Math.min(N.e.r,N.e.d); },
  fm:(max)=>(y,N,t)=>{ N.fm.idx=y*max; if(N.f) setT(N.fm.mg.gain,N.f*N.fm.idx,t); },
  lfoRate:(lo,hi)=>(y,N,t)=>setT(N.lfo.frequency,expo(lo,hi,y),t),
  lfoDepth:(max)=>(y,N,t)=>setT(N.lfog.gain,y*max,t),
  pan:(y,N,t)=>setT(N.pan.pan,y*2-1,t),
  osc2:(max=1)=>(y,N,t)=>setT(N.oscs[1].og.gain,y*max,t),
  noise:(max=.5)=>(y,N,t)=>setT(N.noise.gain,y*max,t),
  dist:(max=20)=>(y,N)=>{ N.dist.curve=curve(.5+y*max); },
  oct:(y,N,t)=>{ N.oct=Math.min(2,Math.floor(y*3)); if(N.f) N.oscs.forEach(x=>setT(x.os.frequency,N.f*x.mult*Math.pow(2,N.oct),t,.004)); },
  chord:(a,b)=>(y,N,t)=>{ const iv=y<.5?b:a; N.oscs.forEach((x,i)=>{ x.mult=Math.pow(2,(iv[i%iv.length]+12*x.oct)/12); if(N.f) setT(x.os.frequency,N.f*x.mult,t,.004); }); },
  vowel:(y,N,t)=>setVowel(N,y,t),
};

// ---------------------------------------------------------------- synthé générique (soustractif / FM / accords)
function S(o){ return E => {
  const {ctx,h}=E, N={}, t=ctx.currentTime;
  const defs=o.o||[{w:'sawtooth'}], uni=o.uni||1, oscs=[];
  const mix=h.g((o.gain||.5)/Math.max(1,defs.length*uni));
  defs.forEach(od=>{ for(let u=0;u<uni;u++){
    const os=h.osc(od.w||'sawtooth',110,t);
    os.detune.value=(od.det||0)+(uni>1?(u/(uni-1)-.5)*(o.spread||20):0);
    const og=h.g(od.g??1); os.connect(og).connect(mix);
    oscs.push({os,og,oct:od.oct||0,iv:od.iv||0,mult:Math.pow(2,((od.iv||0)+12*(od.oct||0))/12)});
  }});
  N.oscs=oscs; N.mix=mix; N.oct=0; N.ctx=ctx; N.lfos=[]; let src=mix;
  if(o.n!==undefined){ const ns=h.noise(t); N.noise=h.g(o.n); N.nsrc=ns; ns.connect(N.noise).connect(mix); }
  if(o.fm){ const m=h.osc(o.fm.w||'sine',110,t), mg=h.g(0); m.connect(mg); oscs.forEach(x=>mg.connect(x.os.frequency)); N.fm={m,mg,ratio:o.fm.ratio||1,idx:o.fm.idx||0}; }
  if(o.dist){ N.dist=h.shaper(o.dist); src.connect(N.dist); src=N.dist; }
  N.filt=h.f(o.ft||'lowpass',o.fc||4000,o.q||1); N.fc=o.fc||4000; src.connect(N.filt); src=N.filt;
  N.amp=h.g(0); src.connect(N.amp); N.ylvl=h.g(1); N.amp.connect(N.ylvl); src=N.ylvl;
  if(o.lfo){ const l=h.osc(o.lfo.w||'sine',o.lfo.rate||5,t), lg=h.g(o.lfo.depth||0); l.connect(lg); N.lfo=l; N.lfog=lg;
    const to=o.lfo.to||'pitch'; if(to==='pitch') oscs.forEach(x=>lg.connect(x.os.detune)); else if(to==='cut') lg.connect(N.filt.frequency); else if(to==='amp') lg.connect(N.ylvl.gain); else if(to==='fm') lg.connect(N.fm.mg.gain); }
  if(o.post) src=o.post(src,N,h);
  src.connect(E.out);
  N.e=Object.assign({a:.01,d:.1,s:.8,r:.08},o.e);
  let cur={x:0,y:.5};
  const v={
    start(t){ env(N.amp.gain,t,N.e,1);
      if(o.fe){ const base=N.fc*(o.ftrk&&N.f?Math.pow(N.f/220,o.ftrk):1); N.filt.frequency.cancelScheduledValues(t); N.filt.frequency.setTargetAtTime(Math.min(18000,base*Math.pow(2,o.fe.amt)),t,.003); N.filt.frequency.setTargetAtTime(base,t+.01,o.fe.d/3); }
      if(o.on) o.on(cur,N,t,h); },
    set(p,t){ cur=p;
      if(p.f!==undefined){ N.f=p.f; oscs.forEach(x=>setT(x.os.frequency,p.f*x.mult*Math.pow(2,N.oct),t,o.glide||.004));
        if(N.fm){ setT(N.fm.m.frequency,p.f*N.fm.ratio,t,.004); setT(N.fm.mg.gain,p.f*N.fm.idx,t,.004); }
        if(o.ftrk&&!o.fe) setT(N.filt.frequency,Math.min(18000,N.fc*Math.pow(p.f/220,o.ftrk)),t); }
      if(o.x) o.x(p.x,N,t,h,p); if(o.y) o.y(p.y,N,t,h,p); },
    stop(t){ rel(N.amp.gain,t,N.e.r); if(o.off) o.off(N,t); },
    dispose(){ const s=ctx.currentTime+.05; oscs.forEach(x=>x.os.stop(s)); if(N.nsrc) N.nsrc.stop(s); if(N.fm) N.fm.m.stop(s); if(N.lfo) N.lfo.stop(s); N.lfos.forEach(l=>l.stop(s)); setTimeout(()=>src.disconnect(),100); if(N.t2) clearTimeout(N.t2); },
    N,
  };
  return v;
};}
const C = (iv,o={}) => S(Object.assign({o:iv.map(i=>({w:o.w||'sawtooth',iv:i})),gain:.35},o));

// ---------------------------------------------------------------- percussions (one-shot)
function bump(h,out,t,peak,dec){ const g=h.g(0); g.gain.setValueAtTime(peak,t); g.gain.setTargetAtTime(0,t+.003,dec/4); g.connect(out); return g; }
const K = {
  bd(h,t,out,{f=50,dec=.45,pe=6,click=.4,w='sine'}={}){ const o=h.osc(w,f*pe,t); o.frequency.setTargetAtTime(f,t,.02); o.connect(bump(h,out,t,1,dec)); o.stop(t+dec*2+.2);
    if(click){ const n=h.noise(t), hp=h.f('highpass',1500); n.connect(hp).connect(bump(h,out,t,click,.02)); n.stop(t+.1); } },
  sd(h,t,out,{dec=.18,tone=190,body=.5,cut=6000,q=.8,type='lowpass'}={}){ const o=h.osc('triangle',tone,t); o.frequency.setTargetAtTime(tone*.6,t,.03); o.connect(bump(h,out,t,body,dec*.6)); o.stop(t+dec+.2);
    const n=h.noise(t), f=h.f(type,cut,q); n.connect(f).connect(bump(h,out,t,.8,dec)); n.stop(t+dec*2+.2); },
  hh(h,t,out,{dec=.05,cut=8000,lvl=.5}={}){ const n=h.noise(t), f=h.f('highpass',cut,1); n.connect(f).connect(bump(h,out,t,lvl,dec)); n.stop(t+dec*2+.2); },
  cp(h,t,out,{dec=.15}={}){ const n=h.noise(t), f=h.f('bandpass',1500,1.5); n.connect(f); [0,.01,.02].forEach(d=>f.connect(bump(h,out,t+d,.6,d<.02?.01:dec))); n.stop(t+dec*2+.2); },
  conga(h,t,out,{f=220,dec=.3,mute=0}={}){ const o=h.osc('sine',f*1.3,t); o.frequency.setTargetAtTime(f,t,.01); o.connect(bump(h,out,t,.9,dec*(1-mute*.85))); o.stop(t+dec*2+.2); },
  zap(h,t,out,{dec=.15,f0=3000,f1=80}={}){ const o=h.osc('sine',f0,t); o.frequency.setTargetAtTime(f1,t,dec/4); o.connect(bump(h,out,t,.8,dec)); o.stop(t+dec*2+.2); },
  timp(h,t,out,{f=110,dec=.9,vel=1}={}){ const o=h.osc('sine',f,t), o2=h.osc('triangle',f*1.5,t); o.connect(bump(h,out,t,vel,dec)); o2.connect(bump(h,out,t,vel*.25,dec*.4)); o.stop(t+dec*2+.2); o2.stop(t+dec+.2);
    const n=h.noise(t), lp=h.f('lowpass',400+vel*1500); n.connect(lp).connect(bump(h,out,t,vel*.4,.03)); n.stop(t+.1); },
  ba(h,t,out,{f=55,dec=.2,cut=900,w='sawtooth',q=2}={}){ const o=h.osc(w,f,t), lp=h.f('lowpass',cut,q); lp.frequency.setTargetAtTime(cut*.4,t,dec/3); o.connect(lp).connect(bump(h,out,t,.7,dec)); o.stop(t+dec*2+.2); },
  st(h,t,out,{f=220,iv=[0,3,7],dec=.15,cut=3000}={}){ const lp=h.f('lowpass',cut,1); const g=bump(h,out,t,.35,dec); lp.connect(g); iv.forEach(i=>{ const o=h.osc('sawtooth',f*Math.pow(2,i/12),t); o.connect(lp); o.stop(t+dec*2+.2); }); },
};
// voix percussive : chaque start() = un coup, paramétré par la position courante
function D(fn){ return E => { const {h}=E; let cur={x:0,y:.5}; const pend=[];
  return { start(t){ const hg=h.g(1); hg.connect(E.out); pend.push([t,hg]); if(pend.length>64) pend.shift(); fn(h,t,hg,cur,E); },
    set(p){ cur=p; }, stop(t){ pend.forEach(([tt,g])=>{ if(tt>t) g.gain.setValueAtTime(0,t); }); }, dispose(){} }; }; }

// ---------------------------------------------------------------- motifs rythmiques (P.90–P.99)
// NB : les pas des patterns ne sont pas documentés par Korg — ils sont inventés ici.
const PAT = {
  house1:{bd:'x...x...x...x...',sd:'....x.......x...',hh:'..x...x...x...x.',oh:'..x...x...x...x.'},
  house2:{bd:'x...x...x...x...',cp:'....x.......x...',hh:'x.x.x.x.x.x.x.x.',oh:'..x...x...x...x.'},
  house3:{bd:'x...x...x..xx...',cp:'....x.......x...',hh:'x.xxx.xxx.xxx.xx',oh:'......x.......x.'},
  breaks1:{bd:'x.....x.x.....x.',sd:'....x.......x...',hh:'x.x.x.x.x.x.x.x.'},
  breaks2:{bd:'x..x..x...x..x..',sd:'....x..x....x...',hh:'x.xxx.xxx.xxx.xx'},
  breaks3:{bd:'x.x.....x..x....',sd:'....x.....x.x...',hh:'xx.xx.xx.xx.xx.x'},
  techno1:{bd:'x...x...x...x...',hh:'..x...x...x...x.',cp:'....x.......x...',ba:'x.x.x.x.x.x.x.x.'},
  techno2:{bd:'x...x...x...x...',hh:'x.x.x.x.x.x.x.x.',oh:'..x...x...x...x.',ba:'x..x..x.x..x..x.'},
  techno3:{bd:'x..x..x.x..x..x.',hh:'..x...x...x...x.',cp:'....x.......x...',ba:'x.xxx.xxx.xxx.xx'},
  electro1:{bd:'x.....x...x.....',sd:'....x.......x...',hh:'x.x.x.x.x.x.x.x.'},
  electro2:{bd:'x..x....x.x.....',cp:'....x.......x..x',hh:'x.xxx.xxx.xxx.xx'},
  electro3:{bd:'x.....x.x.....x.',sd:'....x.......x...',hh:'xxxxxxxxxxxxxxxx'},
  hiphop1:{bd:'x.....x..x......',sd:'....x.......x...',hh:'x.x.x.x.x.x.x.x.'},
  hiphop2:{bd:'x..x.....x.x....',sd:'....x.......x...',hh:'x.xxx.x.x.xxx.x.'},
  hiphop3:{bd:'x.......x.x.....',sd:'....x......x.x..',hh:'xx.x.x.xxx.x.x.x'},
  dnb1:{bd:'x.........x.....',sd:'....x.......x...',hh:'x.x.x.x.x.x.x.x.'},
  dnb2:{bd:'x..x......x.....',sd:'....x.......x..x',hh:'xxxxxxxxxxxxxxxx'},
  dnb3:{bd:'x.......x.x.....',sd:'....x......x....',hh:'x.xxx.xxx.xxx.xx'},
  bnd1:{bd:'x...x...x...x...',hh:'..x...x...x...x.',ba:'x..x..x...x.x...'},
  bnd2:{bd:'x.....x.x.....x.',sd:'....x.......x...',ba:'x.x...x.x.x...x.'},
  bnd3:{bd:'x...x...x...x...',cp:'....x.......x...',ba:'x.xx.xx.x.xx.xx.'},
  beatbox1:{bd:'x.....x.x.......',sd:'....x.......x...',hh:'..x...x...x...x.'},
  beatbox2:{bd:'x..x....x..x....',sd:'....x..x....x...',hh:'x.x.x.x.x.x.x.x.'},
  beatbox3:{bd:'x.......x.x.....',cp:'....x.......x...',hh:'xx.xx.xx.xx.xx.x'},
};
function P(o){ return E => {
  const {ctx,h}=E, N={}; const bus=h.g(0); let src=bus; if(o.post) src=o.post(src,N,h); src.connect(E.out);
  let cur={x:0,y:.5}; const pend=[];
  const vidx=()=>clamp(Math.floor((o.yvar?cur.y:cur.x)*o.v.length),0,o.v.length-1);
  return {
    start(t){ setT(bus.gain,1,t,.003); },
    set(p,t){ cur=p; if(o.y) o.y(p.y,N,t,h,p); if(o.x) o.x(p.x,N,t,h,p); },
    stop(t){ setT(bus.gain,0,t,.004); pend.forEach(([tt,g])=>{ if(tt>t) g.gain.setValueAtTime(0,t); }); },
    step(i,t){ const pat=PAT[o.v[vidx()]], s=i%16, kit=o.kitFn?o.kitFn(N):(o.kit||{}); const hg=h.g(1); hg.connect(bus); pend.push([t,hg]); if(pend.length>64) pend.shift();
      for(const k in pat){ if(pat[k][s]!=='x') continue;
        if(k==='ba') K.ba(h,t,hg,Object.assign({f:(cur.f||110)/2},kit.ba)); else if(k==='oh') K.hh(h,t,hg,Object.assign({dec:.25,cut:7000,lvl:.35},kit.oh));
        else K[k](h,t,hg,kit[k]); } },
    dispose(){ if(N.trem) N.trem.stop(); setTimeout(()=>src.disconnect(),100); },
    N, isPattern:true,
  };
};}

// ---------------------------------------------------------------- les 100 programmes
// {id, name, x, y (libellés du manuel), scale, arp (○ = true, --- = false), make}
const L = (id,name,y,scale,arp,make,x='Note') => ({id,name,x,y,scale,arp,make});
const PROGRAMS = [
// LEAD
L('L.00','Ambient Lead','Ambient Depth, Vibrato',1,1,S({o:[{w:'sawtooth'},{w:'square',g:.4,oct:-1}],fc:3500,lfo:{to:'pitch',rate:5.5},post:FX.verb(0),y:(y,N,t)=>{setT(N.vwet.gain,y*.9,t);setT(N.lfog.gain,y*35,t);}})),
L('L.01','LR 5th Lead','Pan, Delay Cutoff',1,1,S({o:[{w:'sawtooth'},{w:'sawtooth',iv:7,g:.7}],fc:5000,post:FX.chain(FX.pan(),FX.delay(.375,.45,.4,3000)),y:(y,N,t)=>{Y.pan(y,N,t);setT(N.dlp.frequency,expo(300,9000,y),t);}})),
L('L.02','Unison Lead','Cutoff',1,1,S({uni:5,spread:35,fc:3000,q:2,y:Y.cut(200,10000)})),
L('L.03','Tell Min','Level',1,1,S({o:[{w:'sine'}],glide:.03,lfo:{to:'pitch',rate:6,depth:14},e:{a:.05,r:.15},y:Y.lvl})),
L('L.04','Feedback Lead','Feedback Mod',1,1,S({o:[{w:'sawtooth'}],fm:{w:'sawtooth',ratio:1},fc:6000,y:Y.fm(3)})),
L('L.05','Sync Lead','OSC Sync Pitch',1,1,S({o:[{w:'sawtooth'}],fm:{w:'sawtooth',ratio:1,idx:2},fc:7000,y:(y,N,t)=>{N.fm.ratio=1+y*4;if(N.f)setT(N.fm.m.frequency,N.f*N.fm.ratio,t);}})),
L('L.06','Square Bell','Decay Time',1,1,S({o:[{w:'square'},{w:'sine',oct:2,g:.5}],fc:6000,e:{a:.005,d:.5,s:0,r:.3},y:Y.dec(.08,2.5)})),
L('L.07','Wide Saw Lead','Delay&AutoPan Depth',1,1,S({uni:3,spread:25,fc:5000,post:FX.chain(FX.delay(.25,.4,0),FX.autopan(1.5)),y:(y,N,t)=>{setT(N.dwet.gain,y*.7,t);setT(N.apg.gain,y,t);}})),
L('L.08','XMod Lead','Mod Depth',1,1,S({o:[{w:'square'}],fm:{ratio:1.005},fc:5000,y:Y.fm(5)})),
L('L.09','Square Lead','Cutoff',1,1,S({o:[{w:'square'}],fc:2000,q:3,y:Y.cut(150,10000)})),
L('L.10','Unison Sweep','Cutoff',1,1,S({uni:4,spread:30,fc:1500,q:4,lfo:{to:'cut',rate:.4,depth:900},y:Y.cut(200,8000)})),
L('L.11','3Octave Lead','Octave',1,1,S({o:[{w:'sawtooth'},{w:'square',g:.5}],fc:5000,y:Y.oct})),
L('L.12','XY Scale','Bass Note',1,1,S({o:[{w:'sawtooth'},{w:'square',oct:-1,g:.8}],fc:3500,y:(y,N,t,h,p)=>{if(p.fy)setT(N.oscs[1].os.frequency,p.fy/2,t,.004);}})),
L('L.13','Wave Seq','Sequence Speed',1,1,S({o:[{w:'sine'}],fc:7000,post:FX.pan(),x:Y.pan,y:(y,N)=>{N.rate=expo(1,30,y);},on:(c,N)=>{if(N.t2)return;const W=['sine','triangle','square','sawtooth'];let i=0;const tick=()=>{N.oscs[0].os.type=W[i++%4];N.t2=setTimeout(tick,1000/(N.rate||4));};tick();}}),'Note, Pan'),
L('L.14','Digital Talk','Formant',1,1,S({o:[{w:'sawtooth'},{w:'square',g:.3}],fc:9000,post:FX.formant(),y:Y.vowel})),
L('L.15','LFO Lead','LFO Speed',1,1,S({o:[{w:'sawtooth'}],fc:1200,q:6,lfo:{to:'cut',rate:4,depth:1000},y:Y.lfoRate(.3,30)})),
L('L.16','XMod Saw Lead','Cutoff',1,1,S({o:[{w:'sawtooth'}],fm:{ratio:2,idx:1.5},fc:3000,y:Y.cut(200,10000)})),
L('L.17','Flap Lead','LFO Speed',1,1,S({o:[{w:'square'},{w:'sawtooth',g:.5}],fc:4000,lfo:{to:'amp',w:'square',rate:6,depth:.5},y:Y.lfoRate(1,40)})),
L('L.18','Tape Bell Lead','Echo Time, Feedback',1,1,S({o:[{w:'sine'}],fm:{ratio:3.5,idx:.6},fc:8000,e:{a:.003,d:.8,s:.2,r:.4},post:FX.delay(.3,.4,.5,4000),y:(y,N,t)=>{setT(N.dly.delayTime,lerp(.08,.7,y),t,.05);setT(N.dfb.gain,lerp(.2,.85,y),t);}})),
L('L.19','Pitch Mod Lead','Pitch Mod Depth',1,1,S({o:[{w:'sawtooth'}],fc:5000,lfo:{to:'pitch',rate:6,depth:0},y:Y.lfoDepth(700)})),
// ACOUSTIC
L('a.20','Trumpet','Breath Pressure',1,1,S({o:[{w:'sawtooth'}],fc:1500,q:2,fe:{amt:1.2,d:.08},e:{a:.04,r:.1},y:Y.vel(500,4000)})),
L('a.21','Piano','Velocity',1,1,S({o:[{w:'triangle'},{w:'sawtooth',g:.35,det:4}],fc:2500,ftrk:.5,e:{a:.003,d:1.6,s:0,r:.3},y:Y.vel(400,7000)})),
L('a.22','Digerido','LFO Speed',1,1,S({o:[{w:'sawtooth',oct:-2},{w:'square',oct:-2,g:.4,det:5}],ft:'bandpass',fc:600,q:5,lfo:{to:'cut',rate:2,depth:400},e:{a:.1,r:.2},y:Y.lfoRate(.3,12)})),
L('a.23','Electric Sitar','Sound Character',1,1,S({o:[{w:'sawtooth'}],fm:{ratio:1,idx:.3},fc:3000,q:8,e:{a:.003,d:1.2,s:.1,r:.3},y:(y,N,t)=>{setT(N.filt.Q,1+y*18,t);Y.fm(1.2)(y,N,t);}})),
L('a.24','Duo Strings','2nd Strings Level',1,1,S({o:[{w:'sawtooth'},{w:'sawtooth',det:-9,iv:12,g:0}],fc:3000,e:{a:.18,r:.4},lfo:{to:'pitch',rate:5,depth:6},y:Y.osc2(1)})),
L('a.25','VPM Bell','Sound Character',1,1,S({o:[{w:'sine'}],fm:{ratio:3.01,idx:.5},fc:9000,e:{a:.003,d:1.5,s:0,r:.5},y:Y.fm(4)})),
L('a.26','Jazz Guitar','Velocity',1,1,S({o:[{w:'triangle'},{w:'sawtooth',g:.2}],fc:1200,e:{a:.003,d:1.2,s:0,r:.2},y:Y.vel(300,4000)})),
L('a.27','Tenor Sax','Breath Pressure',1,1,S({o:[{w:'sawtooth'},{w:'square',g:.4}],fc:1800,q:2,fe:{amt:.8,d:.1},e:{a:.05,r:.12},lfo:{to:'pitch',rate:5.5,depth:8},y:Y.vel(400,5000)})),
L('a.28','Harmonica','2nd Reed Level',1,1,S({o:[{w:'square'},{w:'square',det:9,g:0}],fc:2500,q:2,e:{a:.03,r:.1},y:Y.osc2(1)})),
L('a.29','Flute','Breath Pressure',1,1,S({o:[{w:'sine'},{w:'triangle',g:.3}],n:.05,fc:4000,e:{a:.06,r:.15},lfo:{to:'pitch',rate:5,depth:5},y:(y,N,t)=>{Y.lvl(y,N,t);setT(N.noise.gain,.02+y*.25,t);}})),
// BASS
L('b.30','Hoover','Cutoff, Pitch EG',1,1,S({uni:3,spread:45,o:[{w:'sawtooth'}],fc:2000,y:(y,N,t)=>{Y.cut(200,6000)(y,N,t);N.pe=y;},on:(c,N,t)=>{N.oscs.forEach(x=>{x.os.detune.cancelScheduledValues(t);x.os.detune.setValueAtTime(-1200*(N.pe??.5)*2,t);x.os.detune.setTargetAtTime(0,t,.08);});}})),
L('b.31','Kick Bass','Decay Time',1,1,S({o:[{w:'sine'}],fc:2000,e:{a:.002,d:.4,s:0,r:.1},y:Y.dec(.1,1.5),on:(c,N,t)=>{if(!N.f)return;N.oscs[0].os.frequency.cancelScheduledValues(t);N.oscs[0].os.frequency.setValueAtTime(N.f*5,t);N.oscs[0].os.frequency.setTargetAtTime(N.f,t,.025);}})),
L('b.32','Reso Bass','Cutoff',1,1,S({o:[{w:'sawtooth'}],fc:800,q:14,y:Y.cut(80,5000)})),
L('b.33','Acid Bass','Distortion',1,1,S({o:[{w:'sawtooth'}],dist:1,fc:700,q:10,fe:{amt:2,d:.25},y:Y.dist(25)})),
L('b.34','Sync LFO Bass','LFO Speed',1,1,S({o:[{w:'sawtooth'}],fm:{w:'sawtooth',ratio:1,idx:1.5},fc:3000,lfo:{to:'fm',rate:3,depth:150},y:Y.lfoRate(.5,20)})),
L('b.35','Unison Bass','Cutoff',1,1,S({uni:3,spread:20,fc:1000,q:2,y:Y.cut(80,6000)})),
L('b.36','Boost Bass','Cutoff',1,1,S({o:[{w:'sine'},{w:'square',g:.5}],dist:4,fc:900,q:2,y:Y.cut(80,5000)})),
L('b.37','XMod Bass','Cutoff',1,1,S({o:[{w:'square'}],fm:{ratio:1,idx:2},fc:1200,y:Y.cut(80,6000)})),
L('b.38','Fall Bass','Cutoff',1,1,S({o:[{w:'sawtooth'}],fc:1200,q:3,y:Y.cut(80,6000),on:(c,N,t)=>{N.oscs.forEach(x=>{x.os.detune.cancelScheduledValues(t);x.os.detune.setValueAtTime(1200,t);x.os.detune.setTargetAtTime(0,t,.12);});}})),
L('b.39','VPM Bass','Decay Time',1,1,S({o:[{w:'sine'}],fm:{ratio:2,idx:1.2},fc:5000,e:{a:.002,d:.3,s:.1,r:.1},y:Y.dec(.05,1.2)})),
L('b.40','Modulation Bass','Mod Depth',1,1,S({o:[{w:'sawtooth'}],fc:600,q:6,lfo:{to:'cut',rate:6,depth:0},y:Y.lfoDepth(1500)})),
L('b.41','Dark Bass','Mod Depth',1,1,S({o:[{w:'triangle'},{w:'sine',oct:-1,g:.8}],fc:450,lfo:{to:'pitch',rate:4,depth:0},y:Y.lfoDepth(120)})),
L('b.42','Ring Bass','Cutoff',1,1,S({o:[{w:'square'}],fm:{ratio:1.5,idx:1},fc:1500,y:Y.cut(80,7000)})),
L('b.43','Square Bass','Cutoff',1,1,S({o:[{w:'square'}],fc:900,q:2,y:Y.cut(80,6000)})),
L('b.44','Dist Saw Bass','Cutoff',1,1,S({o:[{w:'sawtooth'}],dist:8,fc:1500,q:2,y:Y.cut(80,7000)})),
L('b.45','MG Bass','Cutoff',1,1,S({o:[{w:'sawtooth'},{w:'square',det:-7,g:.7}],fc:600,q:4,fe:{amt:1.5,d:.2},y:Y.cut(80,6000)})),
L('b.46','Bit Bass','Cutoff',1,1,S({o:[{w:'square'}],fc:1200,post:FX.crush(),y:Y.cut(80,6000),on:(c,N)=>{N.crush.curve=bitcurve(6);}})),
L('b.47','Synth Bass','Cutoff',1,1,S({o:[{w:'sawtooth'},{w:'square',oct:-1,g:.6}],fc:1000,q:2,y:Y.cut(80,6000)})),
L('b.48','Valve Bass','Decay Time',1,1,S({o:[{w:'sine'},{w:'triangle',g:.5}],dist:2.5,fc:1500,e:{a:.003,d:.4,s:0,r:.1},y:Y.dec(.05,1.5)})),
L('b.49','Organ Bass','3rd Percussion',1,1,S({o:[{w:'sine'},{w:'sine',oct:1,g:.5},{w:'sine',iv:19,g:0}],fc:6000,e:{a:.005,r:.05},y:(y,N)=>{N.perc=y;},on:(c,N,t)=>{const g=N.oscs[2].og.gain;g.cancelScheduledValues(t);g.setValueAtTime(N.perc??.5,t);g.setTargetAtTime(0,t,.12);}})),
// CHORD
L('c.50','Trance Chord','Cutoff',1,1,C([0,3,7,12],{uni:2,spread:18,fc:2500,q:2,y:Y.cut(200,9000)})),
L('c.51','Sine Chord','Octave',1,1,C([0,4,7],{w:'sine',gain:.6,y:Y.oct})),
L('c.52','Organ Chord','Drawbar Level',1,1,S({o:[0,4,7].flatMap(i=>[{w:'sine',iv:i},{w:'sine',iv:i,oct:1,g:0},{w:'sine',iv:i,oct:2,g:0}]),gain:.5,fc:8000,e:{a:.005,r:.05},y:(y,N,t)=>N.oscs.forEach(x=>{if(x.oct)setT(x.og.gain,y*(x.oct===1?1:.6),t);})})),
L('c.53','Sweep Chord','LFO Speed',1,1,C([0,4,7,11],{fc:1200,q:5,lfo:{to:'cut',rate:.5,depth:1000},y:Y.lfoRate(.1,10)})),
L('c.54','Choir Chord','Formant',1,1,C([0,3,7],{fc:9000,e:{a:.15,r:.3},post:FX.formant(),y:Y.vowel})),
L('c.55','Power Chord','Sound Character',1,1,C([0,7,12],{dist:3,fc:3000,y:(y,N,t)=>{N.dist.curve=curve(1+y*20);setT(N.filt.frequency,expo(1500,9000,y),t);}})),
L('c.56','BPF Chord','Cutoff',1,1,C([0,4,7,10],{ft:'bandpass',fc:1000,q:4,y:Y.cut(200,8000)})),
L('c.57','E.Piano Chord','Chord (Maj7, min7)',1,1,C([0,4,7,11],{w:'sine',fm:{ratio:14,idx:.15},fc:6000,e:{a:.003,d:1.5,s:.1,r:.4},y:Y.chord([0,4,7,11],[0,3,7,10])})),
L('c.58','Rave Chord','Cutoff',1,1,C([0,3,7,10],{uni:2,spread:25,fc:2000,q:3,fe:{amt:1.5,d:.2},e:{a:.003,d:.4,s:.5,r:.1},y:Y.cut(200,9000)})),
L('c.59','Chord Hit','Chord (Maj7, min7)',1,1,C([0,4,7,11],{fc:4000,e:{a:.002,d:.25,s:0,r:.15},y:Y.chord([0,4,7,11],[0,3,7,10])})),
// SE
L('S.60','Kaoss Drone','Feedback',0,1,S({o:[{w:'sawtooth'},{w:'sawtooth',det:12,oct:-1}],fc:500,q:12,post:FX.delay(.12,.3,.5,6000),x:(x,N,t)=>{setT(N.filt.frequency,expo(60,8000,x),t);},y:(y,N,t)=>setT(N.dfb.gain,y*.95,t),on:(c,N,t)=>N.oscs.forEach(x=>setT(x.os.frequency,55*x.mult,t))}),'Cutoff'),
L('S.61','Rise & Fall','Rise, Fall',1,1,S({o:[{w:'sawtooth'}],fc:5000,y:(y,N)=>{N.rf=y;},on:(c,N,t)=>{const d=(N.rf??.5)*2-1;N.oscs.forEach(x=>{x.os.detune.cancelScheduledValues(t);x.os.detune.setValueAtTime(d*2400,t);x.os.detune.setTargetAtTime(0,t,.3);});}})),
// ponytail: boucles de feedback Web Audio ≥ 1 quantum (128 échantillons ≈ 2,9 ms) → S.62 et S.77 (comb) plafonnent vers 375 Hz
L('S.62','Feedback Loop','Delay Time',0,1,S({o:[],n:.6,fc:9000,e:{a:.001,d:.03,s:0,r:.02},post:FX.delay(.02,.9,1,4000),x:(x,N,t)=>setT(N.dlp.frequency,expo(150,9000,x),t),y:(y,N,t)=>setT(N.dly.delayTime,expo(.002,.4,y),t,.02)}),'Feedback Filter'),
L('S.63','L->R','LFO Speed',1,1,S({o:[{w:'square'}],fc:4000,post:FX.autopan(2),y:(y,N,t)=>{setT(N.aplfo.frequency,expo(.2,20,y),t);setT(N.apg.gain,1,t);}})),
L('S.64','Noise Filter','Resonance',0,1,S({o:[],n:1,fc:1000,q:1,x:(x,N,t)=>setT(N.filt.frequency,expo(80,12000,x),t),y:(y,N,t)=>setT(N.filt.Q,.5+y*25,t)}),'Cutoff'),
L('S.65','8bit Game','Pitch Mod Depth',1,1,S({o:[{w:'square'}],fc:8000,lfo:{to:'pitch',w:'square',rate:12,depth:0},y:Y.lfoDepth(1200)})),
L('S.66','Metal','LFO Speed',1,1,S({o:[{w:'square'}],fm:{ratio:2.37,idx:3},fc:3000,q:6,lfo:{to:'cut',rate:3,depth:2000},x:(x,N,t)=>setT(N.filt.frequency,expo(300,8000,x),t),y:Y.lfoRate(.2,25)}),'Note, Cutoff'),
L('S.67','Siren','Pitch Mod Depth',0,1,S({o:[{w:'sine'},{w:'sawtooth',g:.3}],fc:3000,lfo:{to:'pitch',rate:1,depth:600},x:(x,N,t)=>{setT(N.lfo.frequency,expo(.2,15,x),t);setT(N.filt.frequency,expo(500,8000,x),t);},y:Y.lfoDepth(2400),on:(c,N,t)=>N.oscs.forEach(x=>setT(x.os.frequency,600*x.mult,t))}),'LFO Speed, Cutoff'),
L('S.68','Missile','Decay Time',0,1,D((h,t,out,c)=>{ const dec=lerp(.15,2,c.y); if(c.x<.5){ const o=h.osc('sawtooth',2500,t); o.frequency.setTargetAtTime(120,t,dec/3); const lp=h.f('lowpass',3000,2); o.connect(lp).connect(bump(h,out,t,.6,dec)); o.stop(t+dec*2+.2);} else { const n=h.noise(t), lp=h.f('lowpass',3000,1); lp.frequency.setTargetAtTime(150,t,dec/3); n.connect(lp).connect(bump(h,out,t,1,dec)); n.stop(t+dec*2+.2); K.bd(h,t,out,{f:40,dec:dec*.6,pe:8}); } }),'Missile, Hit'),
L('S.69','Random','LFO Speed',1,1,S({o:[{w:'square'}],fc:6000,y:(y,N)=>{N.rate=expo(2,40,y);},on:(c,N)=>{if(N.t2)return;const tick=()=>{N.oscs.forEach(x=>x.os.detune.setValueAtTime(Math.floor(Math.random()*24-12)*100,N.ctx.currentTime));N.t2=setTimeout(tick,1000/(N.rate||8));};tick();}})),
L('S.70','Beam Saber','Mod Depth',1,1,S({o:[{w:'sawtooth',oct:-2},{w:'square',oct:-2,g:.6,det:7}],fm:{w:'sine',ratio:1},fc:2500,q:3,lfo:{to:'pitch',rate:30,depth:8},x:(x,N,t,h,p)=>{if(p.f){setT(N.fm.m.frequency,p.f,t);N.oscs.forEach(o=>setT(o.os.frequency,55*o.mult*4,t));}},y:(y,N,t)=>{N.fm.idx=y*6;setT(N.fm.mg.gain,55*N.fm.idx,t);}}),'Modulator Note'),
L('S.71','Synth Looper','Looper, Noise Level',0,1,S({o:[{w:'sawtooth'}],n:0,fc:2000,q:4,e:{a:.001,d:.05,s:.3,r:.02},x:(x,N,t)=>{setT(N.filt.frequency,expo(200,8000,x),t);N.rate=expo(4,60,x);},y:(y,N,t)=>{setT(N.noise.gain,y*.8,t);N.loopMix=y;},on:(c,N)=>{if(N.t2)return;N.oscs[0].os.frequency.value=110;const tick=()=>{const T=N.ctx.currentTime;env(N.amp.gain,T,N.e,1);N.oscs[0].os.detune.setValueAtTime(Math.round((N.loopMix??.5)*12)*100,T);N.t2=setTimeout(tick,1000/(N.rate||10));};tick();},off:(N)=>{clearTimeout(N.t2);N.t2=0;}}),'Cutoff, Looper Speed'),
L('S.72','Ring Mod SFX','LFO Depth',1,1,S({o:[{w:'sine'}],fm:{ratio:.5,idx:4},fc:8000,lfo:{to:'fm',rate:.7,depth:0},y:Y.lfoDepth(2000)})),
L('S.73','Square LFO','Cutoff',1,1,S({o:[{w:'sawtooth'}],fc:3000,q:3,lfo:{to:'amp',w:'square',rate:8,depth:.5},x:(x,N,t)=>setT(N.lfo.frequency,expo(1,40,x),t),y:Y.cut(150,10000)}),'Note, LFO Speed'),
L('S.74','Dot Eat','Dot Eat',0,1,S({o:[{w:'square'}],fc:6000,e:{a:.002,d:.06,s:0,r:.03},x:(x,N)=>{N.base=expo(110,880,x);},y:(y,N)=>{N.step=Math.round(y*12);},on:(c,N)=>{if(N.t2)return;let i=0;const tick=()=>{const T=N.ctx.currentTime;const f=(N.base||220)*Math.pow(2,(i++%2?(N.step||5):0)/12);N.oscs[0].os.frequency.setValueAtTime(f,T);env(N.amp.gain,T,N.e,1);N.t2=setTimeout(tick,70);};tick();},off:(N)=>{clearTimeout(N.t2);N.t2=0;}}),'Loop Pitch'),
L('S.75','Voice Looper','Looper, Formant',1,1,S({o:[{w:'sawtooth'},{w:'square',g:.3}],fc:9000,e:{a:.005,d:.08,s:.4,r:.03},post:FX.chain(FX.formant(),FX.pan()),x:(x,N,t)=>{setT(N.pan.pan,x*2-1,t);N.rate=expo(3,30,x);},y:(y,N,t)=>{setVowel(N,y,t);N.loopMix=y;},on:(c,N)=>{if(N.t2)return;const tick=()=>{env(N.amp.gain,N.ctx.currentTime,N.e,1);N.t2=setTimeout(tick,1000/(N.rate||8));};tick();},off:(N)=>{clearTimeout(N.t2);N.t2=0;}}),'Note, Looper Speed, Pan'),
L('S.76','Sweep','LFO Speed',1,1,S({o:[{w:'sawtooth'}],fc:1200,q:8,lfo:{to:'cut',rate:1,depth:1100},post:FX.pan(),x:Y.pan,y:Y.lfoRate(.1,15)}),'Note, Pan'),
L('S.77','Jet','Feedback',0,1,S({o:[],n:1,fc:9000,post:FX.delay(.005,.6,1,12000),x:(x,N,t)=>setT(N.dly.delayTime,1/expo(60,4000,x),t,.02),y:(y,N,t)=>setT(N.dfb.gain,y*.97,t)}),'Comb Freq'),
L('S.78','Reflection SFX','Decay Time',1,1,S({o:[{w:'triangle'}],fm:{ratio:5,idx:.4},fc:9000,e:{a:.002,d:.15,s:0,r:.1},post:FX.delay(.11,.5,.6,5000),y:(y,N,t)=>setT(N.dfb.gain,y*.92,t)})),
L('S.79','Drop','Impulse Speed',0,1,S({o:[{w:'square'}],fc:800,q:15,e:{a:.001,d:.01,s:0,r:.01},x:(x,N,t)=>{N.fc=expo(100,8000,x);setT(N.filt.frequency,N.fc,t);},y:(y,N)=>{N.rate=expo(2,80,y);},on:(c,N)=>{if(N.t2)return;N.oscs[0].os.frequency.value=40;const tick=()=>{env(N.amp.gain,N.ctx.currentTime,N.e,1);N.t2=setTimeout(tick,1000/(N.rate||10));};tick();},off:(N)=>{clearTimeout(N.t2);N.t2=0;}}),'Cutoff'),
// DRUM
L('d.80','BD/SD1','Sound Character',0,1,D((h,t,o,c)=>c.x<.5?K.bd(h,t,o,{f:lerp(40,70,c.y),dec:lerp(.6,.25,c.y),click:c.y}):K.sd(h,t,o,{tone:lerp(150,260,c.y),cut:lerp(3000,9000,c.y)})),'BD, SD'),
L('d.81','Zap/HH','Decay Time',0,1,D((h,t,o,c)=>{const p=h.pan(c.x*2-1);p.connect(o);c.x<.5?K.zap(h,t,p,{dec:lerp(.05,.5,c.y)}):K.hh(h,t,p,{dec:lerp(.02,.5,c.y)});}),'Zap, HH, Pan'),
L('d.82','Conga','Mute',0,1,D((h,t,o,c)=>K.conga(h,t,o,{f:c.x<.5?190:260,mute:c.y})),'Conga Hi/Low'),
L('d.83','BD/SD2','SD Decay Time',0,1,D((h,t,o,c)=>c.x<.5?K.bd(h,t,o,{f:45,dec:.5,pe:10,w:'triangle'}):K.sd(h,t,o,{dec:lerp(.06,.6,c.y),tone:200,type:'highpass',cut:1500})),'BD, SD'),
L('d.84','Breakdown','Ambient Depth',0,1,D((h,t,o,c,E)=>{const v=h.verb(),w=h.g(c.y*1.2);o.connect(v).connect(w).connect(E.out);setTimeout(()=>w.disconnect(),3000);K.bd(h,t,o,{f:48,dec:lerp(.1,.9,c.x)});K.sd(h,t+.001,o,{dec:lerp(.05,.5,c.x),body:.3});}),'Decay Time'),
L('d.85','XMod Perc','Mod Depth, Mod Pitch',1,1,D((h,t,o,c)=>{const f=c.f||220;const car=h.osc('square',f,t),m=h.osc('sine',f*expo(.5,8,c.y),t),mg=h.g(f*c.y*8);m.connect(mg).connect(car.frequency);car.connect(bump(h,o,t,.7,.25));car.stop(t+.6);m.stop(t+.6);}),'Pitch'),
L('d.86','BD/SD3','BD Pitch, SD Level',0,1,D((h,t,o,c)=>c.x<.5?K.bd(h,t,o,{f:expo(35,120,c.y),dec:.4,pe:4}):K.sd(h,t,o,{dec:.2,body:c.y*1.2,cut:5000})),'BD, SD'),
L('d.87','Timpani','Velocity',1,1,D((h,t,o,c)=>K.timp(h,t,o,{f:(c.f||110)/2,vel:.2+c.y*.8})),'Note'),
L('d.88','Filter Snare','SD Body Level',0,1,D((h,t,o,c)=>K.sd(h,t,o,{dec:.25,body:c.y*1.5,cut:expo(300,10000,c.x),type:'bandpass',q:2})),'Noise Cutoff'),
L('d.89','BD/SD4','Reverse',0,1,D((h,t,o,c)=>{ if(c.y<.5){ c.x<.5?K.bd(h,t,o,{f:55,dec:.35}):K.sd(h,t,o,{dec:.2}); } else { // reverse : enveloppe montante puis coupure
  const g=h.g(0); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(1,t+.25); g.gain.setValueAtTime(0,t+.26); g.connect(o);
  if(c.x<.5){ const s=h.osc('sine',55,t); s.frequency.setValueAtTime(55,t); s.frequency.linearRampToValueAtTime(300,t+.25); s.connect(g); s.stop(t+.3);} else { const n=h.noise(t), f=h.f('lowpass',5000); n.connect(f).connect(g); n.stop(t+.3);} } }),'BD, SD'),
// DRUM PATTERN — X = motif (variantes), sauf indication du manuel
L('P.90','Grain Beat1','Grain Depth',0,0,P({v:['breaks1','breaks2','breaks3'],kit:{bd:{dec:.3},sd:{dec:.15}},post:FX.tremolo(32),y:(y,N,t)=>setT(N.tremg.gain,y*.9,t)}),'Pattern'),
L('P.91','Bass&Drum','Pattern, Flanger Depth',1,1,P({v:['bnd1','bnd2','bnd3'],yvar:true,kit:{ba:{dec:.25,cut:1200}},post:FX.flanger(),y:(y,N,t)=>setT(N.fwet.gain,(y*3%1)*.9,t)}),'Bass Note'),
L('P.92','HPF Drum','Cutoff, Delay Depth',0,0,P({v:['house1','house2','house3'],post:FX.chain(FX.hp(20),FX.delay(.1875,.4,0)),y:(y,N,t)=>{setT(N.hp.frequency,expo(20,4000,y),t);setT(N.dwet.gain,y*.6,t);}}),'Pattern'),
L('P.93','Grain Beat2','Grain Speed',0,0,P({v:['hiphop1','hiphop2','hiphop3'],post:FX.tremolo(16),y:(y,N,t)=>{setT(N.trem.frequency,expo(4,64,y),t);setT(N.tremg.gain,.7,t);}}),'Pattern'),
L('P.94','Beat Box','Delay Depth',0,0,P({v:['beatbox1','beatbox2','beatbox3'],kit:{bd:{f:70,dec:.2,click:.6},sd:{dec:.1,cut:4000},hh:{dec:.03}},post:FX.delay(.25,.45,0),y:(y,N,t)=>setT(N.dwet.gain,y*.8,t)}),'Pattern'),
L('P.95','Dirty Drum','Decimator Depth',0,0,P({v:['electro1','electro2','electro3'],kit:{bd:{dec:.4,w:'triangle'},sd:{dec:.2,cut:3000}},post:FX.crush(),y:(y,N)=>{N.crush.curve=bitcurve(Math.round(expo(256,3,y)));}}),'Pattern'),
L('P.96','Grain Beat3','Grain Depth',0,0,P({v:['dnb1','dnb2','dnb3'],kit:{bd:{dec:.25,f:60},sd:{dec:.12,tone:220}},post:FX.tremolo(24),y:(y,N,t)=>setT(N.tremg.gain,y*.9,t)}),'Pattern'),
L('P.97','House','Delay Depth',0,0,P({v:['house1','house2','house3'],post:FX.delay(.375,.5,0),y:(y,N,t)=>setT(N.dwet.gain,y*.7,t)}),'Pattern'),
L('P.98','Auto Techno','Pattern, Cutoff',1,1,P({v:['techno1','techno2','techno3'],yvar:true,kit:{ba:{dec:.18,cut:2500,q:6}},post:FX.lp(8000),y:(y,N,t)=>setT(N.lp.frequency,expo(300,12000,y*3%1),t)}),'Bass Note'),
L('P.99','Electro','Noise Decay, Delay Depth',0,0,P({v:['electro2'],kitFn:N=>({sd:{dec:N.ndec||.15,cut:N.cut||4000},hh:{dec:(N.ndec||.15)/2,cut:N.cut||6000}}),post:FX.delay(.1875,.5,0),x:(x,N)=>{N.cut=expo(500,12000,x);},y:(y,N,t)=>{N.ndec=lerp(.03,.5,y);setT(N.dwet.gain,y*.6,t);}}),'Noise Cutoff'),
];

// ---------------------------------------------------------------- moteur
// Boucleur : 4 banques (A–D), chacune avec deux couches (saved / new), sa longueur, son mute et son niveau.
const LOOPER_SRC = `
class L extends AudioWorkletProcessor{
 constructor(){super();const M=Math.ceil(sampleRate*6.6);this.B=[];
  for(let i=0;i<4;i++)this.B.push({S:[new Float32Array(M),new Float32Array(M)],N:[new Float32Array(M),new Float32Array(M)],len:M,mute:false,gain:1,hasS:false,hasN:false});
  this.cur=0;this.start=0;this.rec=false;this.erase=false;this.play=true;
  this.port.onmessage=e=>{const d=e.data,b=this.B[d.bank??this.cur];
   if(d.cmd==='fix'){for(let c=0;c<2;c++){const s=b.S[c],n=b.N[c];for(let i=0;i<s.length;i++)s[i]+=n[i];n.fill(0);}b.hasS=b.hasS||b.hasN;b.hasN=false;}
   else if(d.cmd==='cancel'){b.N.forEach(a=>a.fill(0));b.hasN=false;}
   else if(d.cmd==='clear'){b.N.forEach(a=>a.fill(0));b.S.forEach(a=>a.fill(0));b.hasN=b.hasS=false;}
   else if(d.cmd==='dump'){const n=b.len,L=new Float32Array(n),R=new Float32Array(n);for(let i=0;i<n;i++){L[i]=b.S[0][i]+b.N[0][i];R[i]=b.S[1][i]+b.N[1][i];}this.port.postMessage({dump:d.id,L,R},[L.buffer,R.buffer]);return;}
   else if(d.cmd==='dumpAll'){const n=Math.max(...this.B.map(x=>(x.hasS||x.hasN)&&!x.mute?x.len:0))||b.len,L=new Float32Array(n),R=new Float32Array(n);
    for(const x of this.B){if(x.mute||!(x.hasS||x.hasN))continue;for(let i=0;i<n;i++){const p=i%x.len;L[i]+=(x.S[0][p]+x.N[0][p])*x.gain;R[i]+=(x.S[1][p]+x.N[1][p])*x.gain;}}
    this.port.postMessage({dump:d.id,L,R},[L.buffer,R.buffer]);return;}
   else if(d.set){Object.assign(b,d.set);if(b.len>b.S[0].length)b.len=b.S[0].length;if(b.len<128)b.len=128;}
   else Object.assign(this,d);
   this.post();};}
 post(){this.port.postMessage({banks:this.B.map(b=>({hasSaved:b.hasS,hasNew:b.hasN,mute:b.mute,gain:b.gain,len:b.len})),play:this.play,rec:this.rec,erase:this.erase,bank:this.cur});}
 process(inp,out){const i0=inp[0]||[],o=out[0];const L=i0[0],R=i0[1]||i0[0];const oL=o[0],oR=o[1]||o[0];const n=oL.length;
  const f0=currentFrame-this.start;const cur=this.B[this.cur];let any=false;
  for(let i=0;i<n;i++){const l=L?L[i]:0,r=R?R[i]:0;let sl=l,sr=r;
   if(this.rec){const p=(((f0+i)%cur.len)+cur.len)%cur.len;if(this.erase){cur.N[0][p]=0;cur.N[1][p]=0;}cur.N[0][p]+=l;cur.N[1][p]+=r;if(l||r)any=true;}
   if(this.play)for(const b of this.B){if(b.mute||!(b.hasS||b.hasN))continue;const p=(((f0+i)%b.len)+b.len)%b.len;sl+=(b.S[0][p]+b.N[0][p])*b.gain;sr+=(b.S[1][p]+b.N[1][p])*b.gain;}
   oL[i]=sl;oR[i]=sr;}
  if(any&&!cur.hasN){cur.hasN=true;this.post();}return true;}}
registerProcessor('ko1-looper',L);`;

function wavBlob(L,R,sr){ const n=L.length, buf=new ArrayBuffer(44+n*4), v=new DataView(buf); const w=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i));};
  w(0,'RIFF'); v.setUint32(4,36+n*4,true); w(8,'WAVE'); w(12,'fmt '); v.setUint32(16,16,true); v.setUint16(20,1,true); v.setUint16(22,2,true); v.setUint32(24,sr,true); v.setUint32(28,sr*4,true); v.setUint16(32,4,true); v.setUint16(34,16,true); w(36,'data'); v.setUint32(40,n*4,true);
  for(let i=0,o=44;i<n;i++,o+=4){ v.setInt16(o,Math.max(-1,Math.min(1,L[i]))*32767,true); v.setInt16(o+2,Math.max(-1,Math.min(1,R[i]))*32767,true); }
  return new Blob([buf],{type:'audio/wav'}); }

class Kaossilator {
  constructor(ctx){
    this.ctx=ctx; this.h=H(ctx); this.master=this.h.g(.7);
    this.bpm=120; this.t0=ctx.currentTime; this.scale=2; this.key=60; this.prog=0; this.arp=false; this.gate=0;
    this.touching=false; this.pointerDown=false; this.latch=false; this.p={x:0,y:.5}; this.voice=null; this.sched=ctx.currentTime; this.taps=[];
    this.bank=0; this.banks=[0,1,2,3].map(()=>({hasSaved:false,hasNew:false,mute:false,gain:1,lenIdx:7}));
    this.loop={rec:false,erase:false,play:true,armed:false};
    this.metro=false; this.countIn=false; this.armTimer=null; this.dumps={}; this.dumpId=0;
    this.perf=null; this.onchange=null;
  }
  async init(){
    const url=URL.createObjectURL(new Blob([LOOPER_SRC],{type:'application/javascript'}));
    await this.ctx.audioWorklet.addModule(url);
    this.looper=new AudioWorkletNode(this.ctx,'ko1-looper',{numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[2],channelCount:2,channelCountMode:'explicit'});
    this.looper.port.onmessage=e=>{ const d=e.data; if(d.dump!==undefined){ const r=this.dumps[d.dump]; delete this.dumps[d.dump]; if(r) r(wavBlob(d.L,d.R,this.ctx.sampleRate)); return; }
      d.banks.forEach((b,i)=>Object.assign(this.banks[i],{hasSaved:b.hasSaved,hasNew:b.hasNew,mute:b.mute,gain:b.gain})); this.loop.rec=d.rec; this.loop.erase=d.erase; this.loop.play=d.play; this.changed(); };
    this.out=this.h.g(.8); this.master.connect(this.looper).connect(this.out).connect(this.ctx.destination);   // VOLUME après le boucleur, comme le casque sur l'appareil
    this.click=this.h.g(.5); this.click.connect(this.ctx.destination);                                        // métronome : ni dans la boucle, ni dans l'enregistrement
    this.syncLoop(); this.setProgram(0);
    this.timer=setInterval(()=>this.tick(),25);
    return this;
  }
  changed(){ if(this.onchange) this.onchange(this); }
  get program(){ return PROGRAMS[this.prog]; }
  get cur(){ return this.banks[this.bank]; }
  beat(t=this.ctx.currentTime){ return (t-this.t0)*this.bpm/60; }
  loopBeats(i=this.bank){ return LENGTHS[this.banks[i].lenIdx]*(this.bpm<37.5?.25:this.bpm<75?.5:1); }   // règle du manuel (mémoire ≈ 6,4 s)
  loopPos(i=this.bank){ const b=this.loopBeats(i); return ((this.beat()%b)+b)%b; }
  loopFrames(i){ return Math.max(128,Math.round(this.loopBeats(i)*60/this.bpm*this.ctx.sampleRate)); }
  syncLoop(){ if(!this.looper) return; this.looper.port.postMessage({start:Math.round(this.t0*this.ctx.sampleRate)}); this.banks.forEach((b,i)=>this.looper.port.postMessage({bank:i,set:{len:this.loopFrames(i)}})); }

  // ---- réglages
  setProgram(i){ i=((i%100)+100)%100; const was=this.touching; if(was) this.stopVoice(); if(this.voice) this.voice.dispose(); this.prog=i;
    this.voice=PROGRAMS[i].make({ctx:this.ctx,h:this.h,out:this.master}); this.voice.set(this.params(this.p.x,this.p.y),this.ctx.currentTime); if(was&&this.latch) this.touch(this.p.x,this.p.y); this.changed(); }
  setScale(i){ this.scale=clamp(i,0,SCALES.length-1); this.retune(); this.changed(); }
  setKey(i){ this.key=KEYS[clamp(i,0,24)]; this.retune(); this.changed(); }
  retune(){ if(this.touching&&this.voice) this.voice.set(this.params(this.p.x,this.p.y),this.ctx.currentTime); }
  setBpm(v){ v=clamp(Math.round(v*10)/10,20,300); const b=this.beat(); this.bpm=v; this.t0=this.ctx.currentTime-b*60/v; this.syncLoop(); this.changed(); } // ponytail: buffers tronqués/étendus, audio conservé sans time-stretch
  tap(){ const t=performance.now(); if(this.taps.length&&t-this.taps[this.taps.length-1]>2000) this.taps=[]; this.taps.push(t); if(this.taps.length>8) this.taps.shift();
    if(this.taps.length>=2){ const d=(this.taps[this.taps.length-1]-this.taps[0])/(this.taps.length-1); this.setBpm(60000/d); } this.changed(); }
  setLength(i){ this.cur.lenIdx=clamp(i,0,7); this.syncLoop(); this.changed(); }
  setArp(on){ this.arp=!!on; if(this.touching&&this.voice){ if(this.arpActive()){ this.voice.stop(this.ctx.currentTime); this.sched=this.ctx.currentTime; } else this.voice.start(this.ctx.currentTime); } this.changed(); }
  setGate(i){ this.gate=clamp(i,0,49); this.changed(); }
  arpActive(){ return this.arp && this.program.arp; }
  setMetro(on){ this.metro=!!on; this.changed(); }
  setCountIn(on){ this.countIn=!!on; this.changed(); }
  setLatch(on){ this.latch=!!on; if(!this.latch&&this.touching&&!this.pointerDown) this.stopVoice(); this.changed(); }

  // ---- boucleur
  setBank(i){ this.bank=clamp(i,0,3); this.looper.port.postMessage({cur:this.bank}); this.changed(); }
  bankMute(i,on){ this.looper.port.postMessage({bank:i,set:{mute:!!on}}); }
  bankGain(i,v){ this.looper.port.postMessage({bank:i,set:{gain:clamp(v,0,1.5)}}); }
  rec(on){ if(on){ if(this.countIn&&!this.loop.rec){ this.loop.armed=true; const dt=(this.loopBeats()-this.loopPos())*60/this.bpm; clearTimeout(this.armTimer);
        this.armTimer=setTimeout(()=>{ if(this.loop.armed){ this.loop.armed=false; this.startRec(); } },dt*1000-5); this.changed(); return; }   // ponytail: départ au prochain tour, précision setTimeout (~ms)
      this.startRec(); }
    else { clearTimeout(this.armTimer); this.loop.armed=false; this.loop.rec=false; this.looper.port.postMessage({rec:false}); this.changed(); } }
  startRec(){ this.loop.rec=true; this.loop.play=true; this.looper.port.postMessage({rec:true,play:true}); this.changed(); }
  erase(on){ this.loop.erase=!!on; this.looper.port.postMessage({erase:!!on}); }
  playToggle(){ this.loop.play=!this.loop.play; this.looper.port.postMessage({play:this.loop.play}); this.changed(); }
  fix(i=this.bank){ this.looper.port.postMessage({cmd:'fix',bank:i}); }
  cancel(i=this.bank){ this.looper.port.postMessage({cmd:'cancel',bank:i}); }
  clear(i=this.bank){ this.looper.port.postMessage({cmd:'clear',bank:i}); }
  exportBank(i=this.bank){ return new Promise(r=>{ const id=++this.dumpId; this.dumps[id]=r; this.looper.port.postMessage({cmd:'dump',bank:i,id}); }); }
  exportMix(){ return new Promise(r=>{ const id=++this.dumpId; this.dumps[id]=r; this.looper.port.postMessage({cmd:'dumpAll',id}); }); }

  // ---- enregistrement de la performance (sortie complète, hors métronome)
  perfStart(){ if(this.perf) return; const dest=this.ctx.createMediaStreamDestination(); this.out.connect(dest);
    const mime=['audio/webm;codecs=opus','audio/webm','audio/mp4'].find(m=>window.MediaRecorder&&MediaRecorder.isTypeSupported(m))||'';
    const rec=new MediaRecorder(dest.stream,mime?{mimeType:mime}:undefined); const chunks=[]; rec.ondataavailable=e=>{ if(e.data.size) chunks.push(e.data); };
    this.perf={rec,chunks,dest,t0:performance.now(),mime:rec.mimeType}; rec.start(1000); this.changed(); }
  perfStop(){ return new Promise(r=>{ const p=this.perf; if(!p) return r(null); p.rec.onstop=()=>{ this.out.disconnect(p.dest); this.perf=null; this.changed(); r(new Blob(p.chunks,{type:p.mime})); }; p.rec.stop(); }); }
  perfSeconds(){ return this.perf?(performance.now()-this.perf.t0)/1000:0; }

  // ---- pad
  noteGrid(){ const sc=SCALES[this.scale][2]; if(!sc) return null; const n=sc.length*2+1; return Array.from({length:n},(_,i)=>this.key+sc[i%sc.length]+12*Math.floor(i/sc.length)); }
  params(x,y){ const p={x,y}; const pr=this.program; if(!pr.scale) return p;
    const root=this.key, sc=SCALES[this.scale][2];
    const midi=(v)=>{ if(!sc) return root+v*24; const n=sc.length*2+1, i=clamp(Math.floor(v*n),0,n-1); return root+sc[i%sc.length]+12*Math.floor(i/sc.length); };
    p.midi=midi(x); p.f=440*Math.pow(2,(p.midi-69)/12); p.fy=440*Math.pow(2,(midi(y)-69)/12); return p; }
  xForMidi(m){ const g=this.noteGrid(); if(!g) return clamp((m-this.key)/24,0,1); let best=0; g.forEach((v,i)=>{ if(Math.abs(v-m)<Math.abs(g[best]-m)) best=i; }); return (best+.5)/g.length; }
  xForDegree(i){ const g=this.noteGrid(); const n=g?g.length:25; return (clamp(i,0,n-1)+.5)/n; }
  touch(x,y){ this.p={x,y}; this.pointerDown=true; const t=this.ctx.currentTime; const was=this.touching; this.touching=true; this.voice.set(this.params(x,y),t);
    if(this.arpActive()){ if(!was){ const [len,segs]=GATE[this.gate], ph=((Math.floor(this.beat(t)*48)%len)+len)%len; if(segs.some(([s,e])=>s<ph&&ph<e)) this.voice.start(t); this.sched=t; this.tick(); } }
    else this.voice.start(t); }
  move(x,y){ this.p={x,y}; if(this.voice) this.voice.set(this.params(x,y),this.ctx.currentTime); }
  release(){ this.pointerDown=false; if(!this.touching||this.latch) return; this.stopVoice(); }
  stopVoice(){ this.touching=false; this.pointerDown=false; if(this.voice) this.voice.stop(this.ctx.currentTime); }

  // ---- horloge (lookahead) : gate arp, pas des patterns, métronome
  tick(){ const now=this.ctx.currentTime, until=now+.12, from=Math.max(this.sched,now-.05);
    if(this.touching&&this.voice){
      const tickDur=60/this.bpm/48;
      if(this.arpActive()){ const [len,segs]=GATE[this.gate]; const end=Math.ceil(this.beat(until)*48);
        for(let tk=Math.ceil(this.beat(from)*48);tk<end;tk++){ const ph=((tk%len)+len)%len, t=this.t0+tk*tickDur;
          for(const [s,e] of segs){ if(ph===e||(e>=len&&ph===0)) this.voice.stop(t); if(ph===s) this.voice.start(t); } } }
      if(this.voice.step){ const end=Math.ceil(this.beat(until)*4); for(let st=Math.ceil(this.beat(from)*4);st<end;st++){ const t=this.t0+st*tickDur*12; if(t>=now-.02) this.voice.step(((st%16)+16)%16,t); } }
    }
    if(this.metro){ const lb=this.loopBeats(), end=Math.ceil(this.beat(until)); for(let b=Math.ceil(this.beat(from));b<end;b++){ const t=this.t0+b*60/this.bpm; if(t<now-.02) continue;
        const acc=((b%lb)+lb)%lb<1; const o=this.h.osc('sine',acc?1600:1100,t), g=this.h.g(0); g.gain.setValueAtTime(acc?.7:.4,t); g.gain.setTargetAtTime(0,t+.005,.012); o.connect(g).connect(this.click); o.stop(t+.08); } }
    this.sched=until; }

  state(){ const pr=this.program; const touchedMidi=this.touching&&pr.scale?this.params(this.p.x,this.p.y).midi:null;
    return {prog:this.prog,id:pr.id,name:pr.name,xLabel:pr.x,yLabel:pr.y,scaleOk:!!pr.scale,arpOk:!!pr.arp,scale:this.scale,scaleName:SCALES[this.scale],key:this.key,keyName:keyName(this.key),
    note:touchedMidi!==null?keyName(Math.round(touchedMidi)):null,bpm:this.bpm,arp:this.arp,gate:this.gate,lenIdx:this.cur.lenIdx,lenName:LENGTH_NAMES[this.cur.lenIdx],
    bank:this.bank,banks:this.banks.map((b,i)=>Object.assign({beats:this.loopBeats(i),lenName:LENGTH_NAMES[b.lenIdx]},b)),
    loop:Object.assign({beat:this.loopPos(),beats:this.loopBeats()},this.loop,{hasSaved:this.cur.hasSaved,hasNew:this.cur.hasNew}),
    touching:this.touching,latch:this.latch,metro:this.metro,countIn:this.countIn,perf:!!this.perf,perfSeconds:this.perfSeconds()}; }
  dispose(){ clearInterval(this.timer); if(this.voice) this.voice.dispose(); }
}

// ---------------------------------------------------------------- auto-test (ponytail : le seul check exécutable)
async function selfTest(k){
  const out=[], ok=(c,m)=>{ out.push((c?'OK  ':'FAIL ')+m); if(!c) console.error('selftest:',m); };
  ok(PROGRAMS.length===100,'100 programmes'); ok(SCALES.length===32,'32 gammes (OFF + 31)'); ok(GATE.length===50,'50 motifs gate arp');
  ok(GATE.every(([l,s])=>s.every(([a,b])=>a<b&&b<=l)),'segments gate valides');
  for(let i=0;i<100;i++){ try{ k.setProgram(i); k.touch(.3,.6); k.move(.7,.2); k.release(); ok(true,PROGRAMS[i].id+' '+PROGRAMS[i].name); }catch(e){ ok(false,PROGRAMS[i].id+' → '+e.message); } }
  ok(k.params(.5,.5).f===undefined||PROGRAMS[k.prog].scale,'flag scale respecté (P.99 sans note)');
  k.setProgram(2); ok(k.params(0,0).f!==undefined,'L.02 produit une note'); ok(k.params(0,0).midi===60,'x=0 → tonique C4');
  k.setScale(0); const a=k.params(.5,0).f, b=k.params(.51,0).f; ok(a!==b,'scale OFF = hauteur continue'); k.setScale(2);
  ok(Math.abs(k.xForMidi(64)-k.xForDegree(2))<1e-9,'xForMidi(E4) = degré 2 en Ionien C4');
  k.setProgram(90); k.setArp(true); ok(!k.arpActive(),'gate arp ignoré sur P.90'); k.setProgram(0); ok(k.arpActive(),'gate arp actif sur L.00'); k.setArp(false);
  k.setLatch(true); k.touch(.5,.5); k.release(); ok(k.touching,'latch : le son tient après relâchement'); k.setLatch(false); ok(!k.touching,'latch off : relâché');
  // banque A : enregistrement → couche new → fix → saved ; banque B indépendante
  k.setBank(0); k.setLength(4); k.clear(); await wait(60); k.rec(true); k.touch(.5,.5); await wait(300); k.release(); k.rec(false); await wait(150);
  ok(k.banks[0].hasNew,'banque A : couche new enregistrée'); k.fix(); await wait(60); ok(k.banks[0].hasSaved&&!k.banks[0].hasNew,'fix : new fusionnée dans saved');
  k.setBank(1); ok(!k.banks[1].hasSaved&&!k.banks[1].hasNew,'banque B vide'); k.rec(true); k.touch(.2,.8); await wait(200); k.release(); k.rec(false); await wait(100);
  ok(k.banks[1].hasNew&&k.banks[0].hasSaved,'banque B enregistrée, A intacte'); k.cancel(); await wait(60); ok(!k.banks[1].hasNew,'cancel : new de B effacée');
  const wav=await k.exportBank(0); ok(wav.size>44&&wav.type==='audio/wav','export WAV de A ('+wav.size+' octets)');
  const mix=await k.exportMix(); ok(mix.size>44,'export mix');
  k.setBank(0); k.clear(); await wait(60); ok(!k.banks[0].hasSaved&&!k.banks[0].hasNew,'clear : A vidée');
  k.setBpm(30); ok(Math.abs(k.loopBeats()-LENGTHS[k.cur.lenIdx]/4)<1e-9,'BPM<37.5 → longueur /4'); k.setBpm(60); ok(Math.abs(k.loopBeats()-LENGTHS[k.cur.lenIdx]/2)<1e-9,'BPM<75 → longueur /2'); k.setBpm(120);
  k.setCountIn(true); k.rec(true); ok(k.loop.armed&&!k.loop.rec,'count-in : armé, pas encore en enregistrement'); k.rec(false); ok(!k.loop.armed,'count-in annulé au relâchement'); k.setCountIn(false);
  return out;
}
const wait=ms=>new Promise(r=>setTimeout(r,ms));

return {SCALES,KEYS,keyName,LENGTHS,LENGTH_NAMES,GATE,PROGRAMS,PAT,Kaossilator,selfTest};
})();
if(typeof module!=='undefined') module.exports=KO1;
