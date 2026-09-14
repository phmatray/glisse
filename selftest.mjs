// Auto-test sans navigateur visible : Chrome headless piloté en CDP (Node ≥ 22, WebSocket natif).
// Usage : python3 -m http.server 8765 &  puis  node selftest.mjs "http://localhost:8765/index.html?test&auto"
import { spawn } from 'node:child_process';
const url = process.argv[2], port = 9333;
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ['--headless=new','--disable-gpu','--no-first-run',`--user-data-dir=${process.cwd()}/chrome-prof2`,'--autoplay-policy=no-user-gesture-required',`--remote-debugging-port=${port}`,'about:blank'],{stdio:'ignore'});
const sleep = ms => new Promise(r=>setTimeout(r,ms));
let info; for(let i=0;i<40;i++){ try{ info=await (await fetch(`http://localhost:${port}/json/version`)).json(); break; }catch{ await sleep(250);} }
const targets = await (await fetch(`http://localhost:${port}/json`)).json();
const page = targets.find(t=>t.type==='page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(r=>ws.onopen=r);
let id=0; const pending={}; const logs=[];
ws.onmessage = e => { const m=JSON.parse(e.data); if(m.id&&pending[m.id]) pending[m.id](m);
  if(m.method==='Runtime.consoleAPICalled') logs.push(m.params.type+': '+m.params.args.map(a=>a.value??a.description).join(' '));
  if(m.method==='Runtime.exceptionThrown') logs.push('EXC: '+(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text)); };
const send=(method,params={})=>new Promise(r=>{ const i=++id; pending[i]=r; ws.send(JSON.stringify({id:i,method,params})); });
await send('Runtime.enable'); await send('Page.enable');
await send('Page.navigate',{url});
const ev = async expr => (await send('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true})).result?.result?.value;
let txt=''; for(let i=0;i<60;i++){ await sleep(500); txt=await ev(`(document.getElementById('test')&&document.getElementById('test').textContent)+''`); if(txt&&!txt.startsWith('auto-test')) break; }
console.log(txt); console.log('--- console ---'); console.log(logs.join('\n'));
if(process.argv[3]){ console.log('--- extra ---'); console.log(await ev(process.argv[3])); }
ws.close(); chrome.kill();
