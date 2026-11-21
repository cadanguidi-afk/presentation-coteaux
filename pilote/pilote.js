LB.init();
const sha=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const AUTH=!!(API_KEY&&AUTH_EMAIL);let TOK='',EXP=0,PW='',started=false;
async function login(pw){if(AUTH){const r=await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+API_KEY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:AUTH_EMAIL,password:pw,returnSecureToken:true})});
    const j=await r.json();if(!j.idToken)return false;TOK=j.idToken;EXP=Date.now()+(+j.expiresIn-120)*1000;PW=pw;return true;}
  return (await sha(pw))===PIN_HASH;}
async function tok(){if(AUTH&&Date.now()>EXP)await login(PW);return TOK;}
const link=(typeof SHORT_URL==='string'&&SHORT_URL)||(location.origin+location.pathname.replace(/pilote\/?(index\.html)?$/,'')+'direct/');
function enter(){$('login').classList.remove('on');if(started)return;started=true;$('lnk').textContent=link;$('lnk').href=link;$('launch').classList.add('on');
  stream(render,ok=>{$('st').textContent=ok?'':'Reconnexion…';});}
$('lf').onsubmit=async e=>{e.preventDefault();$('lerr').textContent='';let ok=false;
  try{ok=await login($('pw').value);}catch(x){$('lerr').textContent='Connexion impossible (réseau ou https requis).';return;}
  if(!ok){$('lerr').textContent='Mot de passe incorrect.';return;}
  try{sessionStorage.setItem('pw24',$('pw').value)}catch(x){}enter();};
try{const p=sessionStorage.getItem('pw24');if(p)login(p).then(ok=>{if(ok)enter();else sessionStorage.removeItem('pw24');}).catch(()=>{});}catch(x){}
async function send(p){S=Object.assign({},S,p,{t:Date.now()});render(S);
  try{const q=AUTH?'?auth='+await tok():'';const r=await fetch(DB_URL+'/live.json'+q,{method:'PUT',body:JSON.stringify({state:S.state,page:S.page||1,photo:S.photo==null?-1:S.photo,t:S.t})});
    if(!r.ok)throw 0;$('err').textContent='';}catch(e){$('err').textContent='Envoi impossible : vérifiez la connexion ou vos droits.';}}
function openPhoto(k){const sp=PAGES[(S.page||1)-1].spots;send({photo:(k+sp.length)%sp.length});}
function render(S){if(!started)return;const st=S.state,live=st!=='off',pg=Math.min(N,Math.max(1,S.page||1)),ph=S.photo==null?-1:S.photo;
  $('launch').classList.toggle('on',!live);$('app').style.visibility=live?'visible':'hidden';
  if(!live){LB.hide();$('qrs').classList.remove('on');return;}
  const b=$('badge');b.textContent=st==='on'?'En direct':'En pause';b.className='badge'+(st==='on'?' on':' pause');
  $('pz').textContent=st==='pause'?'Reprendre':'Mettre en pause';$('count').textContent=pg+' / '+N;$('prev').disabled=pg<=1;$('next').disabled=pg>=N;
  draw(pg,openPhoto);const sp=PAGES[pg-1].spots;
  if(ph>=0&&sp[ph])LB.show({src:sp[ph].img,i:ph,n:sp.length,onClose:()=>send({photo:-1}),onPrev:()=>send({photo:(ph-1+sp.length)%sp.length}),onNext:()=>send({photo:(ph+1)%sp.length})});else LB.hide();}
$('go').onclick=()=>{try{document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen().catch(()=>{});}catch(e){}
  send({state:'on',page:1,photo:-1});$('qrs').classList.add('on');};
$('qrb').onclick=()=>$('qrs').classList.add('on');$('qc').onclick=()=>$('qrs').classList.remove('on');
$('cp').onclick=()=>{(navigator.clipboard?navigator.clipboard.writeText(link):Promise.reject()).then(()=>{$('cp').textContent='Lien copié';},()=>{$('cp').textContent='Copie impossible';});};
$('fsb').onclick=fullscreen;
$('pz').onclick=()=>send({state:S.state==='pause'?'on':'pause'});
$('stop').onclick=()=>{if(confirm('Arrêter la diffusion ? Les spectateurs seront renvoyés en lecture libre.')){send({state:'off',photo:-1});if(document.fullscreenElement)document.exitFullscreen();}};
$('prev').onclick=()=>send({page:Math.max(1,(S.page||1)-1),photo:-1});$('next').onclick=()=>send({page:Math.min(N,(S.page||1)+1),photo:-1});
