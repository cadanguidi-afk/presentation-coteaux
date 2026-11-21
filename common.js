const $=id=>document.getElementById(id),ROOT=window.ROOT||'',N=PAGES.length,U=p=>ROOT+p;
const INFO='<p><strong>Groupe 24-5</strong><br>Christlove ADANGUIDI · Nathan AKUMESSI · Jocelyne DOVONOU</p><p class="info">Matière : Apprentissage de terrain · Master 1 GAED · URN 2026</p><p class="info">Chargés du cours : M. Dominique TODISCO et M. Guillaume FRESNEL</p>';
function screen(id,title,sub,extra){const d=document.createElement('div');d.className='screen';d.id=id;
  d.innerHTML='<img src="'+U('img/logo.png')+'" alt="Université de Rouen Normandie"><h1>'+title+'</h1>'+(sub?'<p>'+sub+'</p>':'')+INFO+(extra||'');document.body.appendChild(d);return d;}
function fit(ratio){const st=$('stage'),w=Math.min(st.clientWidth,st.clientHeight*ratio),s=$('slide');s.style.width=w+'px';s.style.height=w/ratio+'px';}
let curRatio=16/9;
function draw(n,onSpot){const P=PAGES[n-1],s=$('slide');s.innerHTML='';curRatio=P.ratio;
  const im=new Image();im.src=U(P.img);im.alt='Diapositive '+n+' sur '+N;s.appendChild(im);
  if(onSpot)P.spots.forEach((o,k)=>{const b=document.createElement('button');b.className='spot';
    b.style.cssText='left:'+o.x+'%;top:'+o.y+'%;width:'+o.w+'%;height:'+o.h+'%';b.setAttribute('aria-label','Agrandir la photo '+(k+1));b.onclick=()=>onSpot(k);s.appendChild(b);});
  [n-2,n].forEach(j=>{if(PAGES[j])new Image().src=U(PAGES[j].img);});fit(P.ratio);}
window.addEventListener('resize',()=>fit(curRatio));
const LB={o:null,
 init(){document.body.insertAdjacentHTML('beforeend','<div id="lb" role="dialog" aria-modal="true" aria-label="Photo agrandie"><div id="lbt"><button id="lbb">‹ Retour</button><button id="lbp" aria-label="Photo précédente">‹</button><span id="lbc"></span><button id="lbn" aria-label="Photo suivante">›</button><span class="sp"></span><button id="lbz">Zoom</button></div><div id="lbv"><img id="lbi" alt="Photo agrandie"></div></div>');
  $('lbz').onclick=$('lbi').onclick=()=>LB.zoom();
  $('lbb').onclick=()=>LB.o&&LB.o.onClose&&LB.o.onClose();$('lbp').onclick=()=>LB.o.onPrev();$('lbn').onclick=()=>LB.o.onNext();},
 show(o){const same=LB.o&&LB.o.src===o.src&&$('lb').classList.contains('on');LB.o=o;$('lb').classList.add('on');
  if(!same){$('lbi').src=U(o.src);$('lbv').classList.remove('z');$('lbv').scrollTo(0,0);}
  $('lbb').style.display=o.onClose?'':'none';$('lbp').style.display=$('lbn').style.display=(o.n>1&&o.onPrev)?'':'none';$('lbc').textContent=o.n>1?(o.i+1)+' / '+o.n:'';},
 hide(){$('lb').classList.remove('on');LB.o=null;},
 zoom(){const v=$('lbv');v.classList.toggle('z');if(v.classList.contains('z'))requestAnimationFrame(()=>{v.scrollLeft=(v.scrollWidth-v.clientWidth)/2;v.scrollTop=(v.scrollHeight-v.clientHeight)/2;});}};
function fullscreen(){const d=document.documentElement;if(document.fullscreenElement)document.exitFullscreen();else if(d.requestFullscreen)d.requestFullscreen();}
function portraitHint(){if(innerWidth<700&&innerHeight>innerWidth){const h=document.createElement('div');h.id='hint';
  h.innerHTML='Astuce : tournez l’appareil en mode paysage pour mieux lire les diapositives. <button style="min-height:32px;padding:2px 10px">OK</button>';
  h.querySelector('button').onclick=()=>h.remove();document.body.appendChild(h);setTimeout(()=>h.remove(),12000);}}
let S={state:'off',page:1,photo:-1};
function stream(cb,st){const es=new EventSource(DB_URL+'/live.json'),D={state:'off',page:1,photo:-1};
  const set=(p,d)=>{if(p==='/')S=Object.assign({},D,d||{});else S[p.slice(1)]=d;};
  es.addEventListener('put',e=>{const d=JSON.parse(e.data);set(d.path,d.data);cb(S);});
  es.addEventListener('patch',e=>{const d=JSON.parse(e.data);Object.keys(d.data||{}).forEach(k=>set('/'+k,d.data[k]));cb(S);});
  es.onopen=()=>st(true);es.onerror=()=>st(false);}
