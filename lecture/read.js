LB.init();portraitHint();
let cur=1;try{cur=Math.min(N,Math.max(1,+localStorage.getItem('p24r')||1))}catch(e){}
const hm=/^#p(\d+)$/.exec(location.hash);if(hm)cur=Math.min(N,Math.max(1,+hm[1]));
function openPhoto(k){const sp=PAGES[cur-1].spots,go=j=>{k=(j+sp.length)%sp.length;LB.show({src:sp[k].img,i:k,n:sp.length,onClose:()=>LB.hide(),onPrev:()=>go(k-1),onNext:()=>go(k+1)});};go(k);}
function show(n){cur=n;draw(n,openPhoto);$('count').textContent=n+' / '+N;$('prev').disabled=n<=1;$('next').disabled=n>=N;$('pdf').style.display=n===N?'':'none';
  document.querySelectorAll('#thumbs button').forEach((b,i)=>b.classList.toggle('cur',i===n-1));
  history.replaceState(null,'','#p'+n);try{localStorage.setItem('p24r',n)}catch(e){}}
PAGES.forEach((P,i)=>{const b=document.createElement('button'),t=new Image();t.src=U(P.thumb);t.alt='Diapositive '+(i+1);b.appendChild(t);b.setAttribute('aria-label','Aller à la diapositive '+(i+1));b.onclick=()=>show(i+1);$('thumbs').appendChild(b);});
$('prev').onclick=()=>show(cur-1);$('next').onclick=()=>show(cur+1);
$('zoom').onclick=()=>LB.show({src:PAGES[cur-1].img,i:0,n:1,onClose:()=>LB.hide()});
$('tb').onclick=()=>{$('thumbs').hidden=!$('thumbs').hidden;fit(curRatio);};
$('fsb').onclick=fullscreen;$('ix').onclick=()=>{$('intro').style.display='none';fit(curRatio);};
document.addEventListener('keydown',e=>{if($('lb').classList.contains('on')){if(e.key==='Escape')LB.hide();return;}
  if(e.key==='ArrowRight'&&cur<N)show(cur+1);else if(e.key==='ArrowLeft'&&cur>1)show(cur-1);});
let sx=null;$('stage').addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
$('stage').addEventListener('touchend',e=>{if(sx===null)return;const d=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(d)>70){if(d<0&&cur<N)show(cur+1);else if(d>0&&cur>1)show(cur-1);}},{passive:true});
show(cur);
if('serviceWorker' in navigator)navigator.serviceWorker.register('../sw.js').catch(()=>{});
