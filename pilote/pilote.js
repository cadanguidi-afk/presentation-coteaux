LB.init();
const sha=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const AUTH=!!(API_KEY&&AUTH_EMAIL);let TOK='',EXP=0,PW='';
async function login(pw){if(AUTH){const r=await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+API_KEY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:AUTH_EMAIL,password:pw,returnSecureToken:true})});
    const j=await r.json();if(!j.idToken)return false;TOK=j.idToken;EXP=Date.now()+(+j.expiresIn-120)*1000;PW=pw;return true;}
  return (await sha(pw))===PIN_HASH;}
async function tok(){if(AUTH&&Date.now()>EXP)await login(PW);return TOK;}
$('lf').onsubmit=async e=>{e.preventDefault();$('lerr').textContent='';let ok=false;
  try{ok=await login($('pw').value);}catch(x){$('lerr').textContent='Connexion impossible (ouvrez la page en https avec du réseau).';return;}
  if(!ok){$('lerr').textContent='Mot de passe incorrect.';return;}
  $('login').classList.remove('on');$('panel').hidden=false;start();};
const link=(typeof SHORT_URL==='string'&&SHORT_URL)||(location.origin+location.pathname.replace(/pilote\/?(index\.html)?$/,'')+'direct/');
function start(){$('lnk').textContent=link;$('lnk').href=link;
  $('cp').onclick=()=>{(navigator.clipboard?navigator.clipboard.writeText(link):Promise.reject()).then(()=>{$('cp').textContent='Lien copié';},()=>{$('cp').textContent='Copie impossible';});};
  stream(render,ok=>{$('err').textContent=ok?'':'Reconnexion…';});}
async function send(p){S=Object.assign({},S,p,{t:Date.now()});render(S);
  try{const q=AUTH?'?auth='+await tok():'';const r=await fetch(DB_URL+'/live.json'+q,{method:'PUT',body:JSON.stringify({state:S.state,page:S.page||1,photo:S.photo==null?-1:S.photo,t:S.t})});
    if(!r.ok)throw 0;$('err').textContent='';}catch(e){$('err').textContent='Envoi impossible : vérifiez la connexion ou vos droits.';}}
function openPhoto(k){const sp=PAGES[(S.page||1)-1].spots;send({photo:(k+sp.length)%sp.length});}
function render(S){const st=S.state,pg=Math.min(N,Math.max(1,S.page||1)),ph=S.photo==null?-1:S.photo;
  const b=$('badge');b.textContent=st==='on'?'En direct':st==='pause'?'En pause':'Hors direct';b.className='badge'+(st==='on'?' on':st==='pause'?' pause':'');
  $('cnt').textContent='Diapositive '+pg+' / '+N;
  $('go').disabled=st!=='off';$('stop').disabled=st==='off';$('pz').disabled=st==='off';$('pz').textContent=st==='pause'?'Reprendre':'Mettre en pause';
  $('prev').disabled=pg<=1;$('next').disabled=pg>=N;
  draw(pg,openPhoto);const sp=PAGES[pg-1].spots;
  if(ph>=0&&sp[ph])LB.show({src:sp[ph].img,i:ph,n:sp.length,onClose:()=>send({photo:-1}),onPrev:()=>send({photo:(ph-1+sp.length)%sp.length}),onNext:()=>send({photo:(ph+1)%sp.length})});else LB.hide();}
$('go').onclick=()=>send({state:'on',page:1,photo:-1});
$('pz').onclick=()=>send({state:S.state==='pause'?'on':'pause'});
$('stop').onclick=()=>{if(confirm('Arrêter la diffusion ? Les spectateurs seront renvoyés en lecture libre.'))send({state:'off',photo:-1});};
$('prev').onclick=()=>send({page:Math.max(1,(S.page||1)-1),photo:-1});$('next').onclick=()=>send({page:Math.min(N,(S.page||1)+1),photo:-1});
