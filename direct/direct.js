LB.init();portraitHint();
const sub='Coteaux de Rouen : panorama et lecture de paysage';
const wait=screen('wait','En attente de présentation…',sub,'<p class="info">La présentation s’affichera ici automatiquement dès le début de la diffusion.</p><p id="fw"><a class="btn pri" href="../lecture/">Lire la présentation en lecture libre</a></p>');
const thanks=screen('thanks','Merci d’avoir suivi la présentation',sub,'<p><a class="btn pri" href="../lecture/">Consulter la présentation en lecture libre</a></p><p class="info" id="cd"></p>');
wait.classList.add('on');
let wasLive=false,timer=null;
function stopTimer(){if(timer){clearInterval(timer);timer=null;}}
function view(S){const st=S.state,ph=S.photo==null?-1:S.photo,pg=Math.min(N,Math.max(1,S.page||1));
  if(st!=='off')stopTimer();
  wait.classList.remove('on');thanks.classList.remove('on');
  if(st==='on'){wasLive=true;draw(pg,null);const sp=PAGES[pg-1].spots[ph];
    if(sp)LB.show({src:sp.img,i:0,n:1});else LB.hide();}
  else if(st==='pause'){wasLive=true;LB.hide();$('fw').style.display='none';wait.classList.add('on');}
  else{LB.hide();$('fw').style.display='';
    if(wasLive){thanks.classList.add('on');if(!timer){let s=20;const t=()=>{$('cd').textContent='Redirection vers la lecture libre dans '+s+' s…';if(s--<=0){stopTimer();location.href='../lecture/';}};t();timer=setInterval(t,1000);}}
    else wait.classList.add('on');}}
stream(view,ok=>{$('st').textContent=ok?'':'Reconnexion…';});
