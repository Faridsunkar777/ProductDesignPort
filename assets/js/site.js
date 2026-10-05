/* Farid Sunkar · Orbit — shared behaviour (GSAP + ScrollTrigger + SplitText + Lenis) */
(function(){
'use strict';
var d=document.documentElement,RM=d.classList.contains('rm'),C=window.SITE_CONFIG||{};
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var get=function(path){return path.split('.').reduce(function(o,k){return o&&o[k]},C)};

/* ---------- config-driven links (hidden unless a real URL exists) ---------- */
$$('[data-cfg]').forEach(function(el){var v=get(el.getAttribute('data-cfg'));
  var box=el.closest('[data-cfg-box]')||el;
  if(v){el.setAttribute('href',v);box.hidden=false}else{box.hidden=true}});

/* ---------- Nairobi clock ---------- */
var fmt=function(){try{return new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Nairobi',hour:'2-digit',minute:'2-digit'}).format(new Date())}catch(e){return ''}};
var tick=function(){var t=fmt();$$('[data-clock]').forEach(function(e){e.textContent=t})};tick();setInterval(tick,15000);

/* ---------- mobile menu ---------- */
var mb=$('.menu-btn');
if(mb){mb.addEventListener('click',function(){var o=d.classList.toggle('menu-open');mb.setAttribute('aria-expanded',o);mb.querySelector('.lbl').textContent=o?'Close':'Menu';
  if(window.__lenis){o?window.__lenis.stop():window.__lenis.start()}});
  addEventListener('keydown',function(e){if(e.key==='Escape'&&d.classList.contains('menu-open'))mb.click()});}

/* ---------- page transitions ---------- */
var curtain=$('.curtain'),pane=curtain&&$('.pane',curtain),clbl=curtain&&$('.lbl b',curtain);
function internal(a){if(!a||a.target==='_blank'||a.hasAttribute('download'))return false;var h=a.getAttribute('href');
  if(!h||h.charAt(0)==='#'||/^(mailto:|tel:|javascript:)/.test(h))return false;
  var u=new URL(a.href,location.href);if(u.origin!==location.origin)return false;
  if(u.pathname===location.pathname&&u.hash)return false;return true}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a');
  if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||!internal(a))return;
  if(RM||!window.gsap||!pane)return;
  e.preventDefault();var href=a.href;
  try{sessionStorage.setItem('fs-to',a.getAttribute('data-label')||a.textContent.trim().slice(0,40))}catch(_){}
  if(clbl)clbl.textContent=a.getAttribute('data-label')||'Loading';
  curtain.style.display='block';pane.style.animation='none';$('.lbl',curtain).style.animation='none';
  gsap.set(pane,{transformOrigin:'bottom',scaleY:0,opacity:1,visibility:'visible'});gsap.set($('.lbl',curtain),{opacity:0,visibility:'visible'});
  gsap.timeline({onComplete:function(){location.href=href}})
    .to(pane,{scaleY:1,duration:.7,ease:'expo.inOut'})
    .to($('.lbl',curtain),{opacity:1,duration:.25},'-=.25');
});
addEventListener('pageshow',function(e){if(e.persisted&&pane){gsap.set(pane,{scaleY:0});gsap.set($('.lbl',curtain),{opacity:0})}});
function liftCurtain(){if(!pane||d.classList.contains('first'))return;
  try{var to=sessionStorage.getItem('fs-to');if(to&&clbl)clbl.textContent=to}catch(_){}
  pane.style.animation='none';$('.lbl',curtain).style.animation='none';
  if(RM||!window.gsap){curtain.style.display='none';return}
  gsap.timeline({onComplete:function(){curtain.style.display='none'}})
    .to($('.lbl',curtain),{opacity:0,duration:.25})
    .to(pane,{scaleY:0,transformOrigin:'top',duration:.9,ease:'expo.inOut'},'<.05');}

/* ---------- no GSAP (CDN/vendor failure) or reduced motion: static site ---------- */
if(!window.gsap||!window.ScrollTrigger){if(curtain)curtain.style.display='none';$$('.loader').forEach(function(l){l.style.display='none'});return}
gsap.registerPlugin(ScrollTrigger);if(window.SplitText)gsap.registerPlugin(SplitText);
var ready=(document.fonts&&document.fonts.ready)?document.fonts.ready:Promise.resolve();
ready.then(init);

function init(){
var mobile=matchMedia('(max-width:640px)').matches;
/* fit display lines to the viewport */
function fitName(){var nm=$('#name');if(!nm)return;
  if(innerWidth<=640){nm.style.fontSize='200px';var w=Math.max.apply(null,$$('.w',nm).map(function(x){return x.scrollWidth}));nm.style.fontSize=(200*(innerWidth-2*parseFloat(getComputedStyle(d).getPropertyValue('--pad')))/w)+'px'}
  else{nm.style.fontSize='200px';var w2=nm.scrollWidth;nm.style.fontSize=Math.min(200*(innerWidth-100)/w2,innerWidth>1700?420:9999)+'px'}
  var it=$('#intro');if(it)d.style.setProperty('--ih',it.offsetHeight+'px')}
function fitHs(){$$('[data-fit]').forEach(function(el){var sp=el.firstElementChild||el;el.style.setProperty('--hs','100px');var w=sp.getBoundingClientRect().width||1;
  var max=parseFloat(el.getAttribute('data-max')||'9999');var vh=parseFloat(el.getAttribute('data-vh')||'0');if(vh)max=Math.min(max,innerHeight*vh);
  el.style.setProperty('--hs',Math.max(56,Math.min(max,98*el.clientWidth/w))+'px')})}
fitName();fitHs();
var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)<2)return;rw=innerWidth;fitName();fitHs();ScrollTrigger.refresh()});

/* smooth scroll */
var lenis=null;
if(!RM&&window.Lenis){lenis=new Lenis({lerp:.09,wheelMultiplier:.9});window.__lenis=lenis;
  lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0);}
$$('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var id=a.getAttribute('href');if(id.length<2)return;var t=$(id);if(!t)return;e.preventDefault();
  if(lenis)lenis.scrollTo(t,{duration:1.6,offset:-20});else t.scrollIntoView();history.replaceState(null,'',id)})});

/* custom cursor */
var cur=$('.cursor');
if(cur&&matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){var ring=$('.ring',cur),dot=$('.dot',cur),lab=$('.ring span',cur);
  var rx=gsap.quickTo(ring,'x',{duration:.5,ease:'power3'}),ry=gsap.quickTo(ring,'y',{duration:.5,ease:'power3'}),dx=gsap.quickTo(dot,'x',{duration:.08}),dy=gsap.quickTo(dot,'y',{duration:.08});
  gsap.set([ring,dot],{opacity:0});
  addEventListener('mousemove',function(e){rx(e.clientX);ry(e.clientY);dx(e.clientX);dy(e.clientY);gsap.to([ring,dot],{opacity:1,duration:.3,overwrite:'auto'})});
  $$('[data-cursor]').forEach(function(el){el.addEventListener('mouseenter',function(){lab.textContent=el.getAttribute('data-cursor')||'View';cur.classList.add('view')});el.addEventListener('mouseleave',function(){cur.classList.remove('view')})});}

/* reduced motion: show everything in its final state and stop here */
if(RM){liftCurtain();$$('.loader').forEach(function(l){l.style.display='none'});return}

var S=window.SplitText;
function lines(el){return S?new S(el,{type:'lines',mask:'lines',aria:/^(P|LI|DIV|SPAN)$/.test(el.tagName)?'none':'auto'}).lines:[el]}

/* deferred (below-the-fold-in-time) images */
function swapDeferred(){$$('[data-dsrcset]').forEach(function(n){n.setAttribute('srcset',n.getAttribute('data-dsrcset'));n.removeAttribute('data-dsrcset')});$$('img[data-dsrc]').forEach(function(n){n.src=n.getAttribute('data-dsrc');n.removeAttribute('data-dsrc')})}
if(document.readyState==='complete')setTimeout(swapDeferred,300);else addEventListener('load',function(){setTimeout(swapDeferred,300)});

/* ---------- HOME hero ---------- */
var hero=$('.hero');
if(hero){
  var chars=[];$$('#name .ch').forEach(function(n){chars=chars.concat(S?new S(n,{type:'chars'}).chars:[n])});
  var il=lines($('#intro'));gsap.set(chars,{yPercent:110});
  var tl=gsap.timeline({delay:.05});
  if(d.classList.contains('first')){var cnt={v:0};
    tl.to(cnt,{v:100,duration:1.2,ease:'power2.inOut',onUpdate:function(){$('#cnt').textContent=Math.round(cnt.v)}})
      .to('#loader',{clipPath:'inset(0 0 100% 0)',duration:1,ease:'expo.inOut'},'+=.05');}
  else{liftCurtain();tl.to({},{duration:.35})}
  tl.from('#scene',{scale:1.18,duration:2.2,ease:'expo.out'},'<.1')
    .from('#phone',{scale:1.18,yPercent:-44,duration:2.2,ease:'expo.out'},'<')
    .to(chars,{yPercent:0,duration:1.2,stagger:.035,ease:'expo.out'},'<.25')
    .from(il,{yPercent:100,duration:1,stagger:.08,ease:'expo.out'},'<.3')
    .from('.tagrow .chip,.hero .screen,.hero .scroll',{opacity:0,y:14,duration:.8,stagger:.06,ease:'power3.out'},'<.2')
    .set('#loader',{display:'none'});
  var names=['“Still Calm”','“Time Limit”'],si=0;
  (function cycle(){gsap.fromTo('#bar',{scaleX:0},{scaleX:1,duration:4,ease:'none',delay:tl.duration()*(si?0:1),onComplete:function(){si=1-si;
    gsap.to('.b2,.p2',{opacity:si,duration:1.1,ease:'power2.inOut'});$('#scrn').textContent='0'+(si+1);$('#scrnName').textContent=names[si];cycle()}})})();
  if(matchMedia('(hover:hover)').matches)hero.addEventListener('mousemove',function(e){var px=e.clientX/innerWidth-.5,py=e.clientY/innerHeight-.5;
    gsap.to('#name',{x:px*-30,y:py*-14,duration:1.2,ease:'power3'});
    gsap.to('#phone .layer',{x:px*26,y:py*18,rotation:px*1.5,duration:1.2,ease:'power3'});
    gsap.to('#scene .layer,#ext',{x:px*10,y:py*6,duration:1.2,ease:'power3'})});
  gsap.timeline({scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:true,settleAt:0}})
    .to('#name',{yPercent:-60,opacity:.15,ease:'none'},0).to('#phone',{yPercent:-22,scale:1.08,ease:'none'},0)
    .to('#scene',{yPercent:10,ease:'none'},0).to('.hero .foot',{opacity:0,y:-40,ease:'none'},0);
} else liftCurtain();

/* ---------- marquee (velocity-aware) ---------- */
var track=$('#track');
if(track){track.appendChild(track.children[0].cloneNode(true));track.children[1].setAttribute('aria-hidden','true');
  var mqx=0,dir=1;if(lenis)lenis.on('scroll',function(o){var v=o.velocity;if(v>.1)dir=1;else if(v<-.1)dir=-1;mqx-=v*.4});
  var mqw=0;function mqm(){mqw=track.children[0].offsetWidth}addEventListener('resize',mqm);if(document.fonts)document.fonts.ready.then(mqm);
  var mqOn=true;if('IntersectionObserver' in window)new IntersectionObserver(function(e){mqOn=e[0].isIntersecting}).observe(track);
  gsap.ticker.add(function(){if(!mqOn)return;if(!mqw)mqm();mqx-=1.1*dir;var w=mqw;if(mqx<=-w)mqx+=w;if(mqx>0)mqx-=w;track.style.transform='translate3d('+mqx+'px,0,0)'});}

/* ---------- generic reveals ---------- */
$$('[data-split]').forEach(function(el){gsap.from(lines(el),{yPercent:105,duration:1.3,stagger:.1,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}})});
$$('.fade').forEach(function(el){gsap.from(el,{y:40,opacity:0,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}})});
$$('[data-par]').forEach(function(el){var v=+el.getAttribute('data-par');gsap.fromTo(el,{yPercent:-v},{yPercent:v,ease:'none',scrollTrigger:{trigger:el.parentNode,start:'top bottom',end:'bottom top',scrub:true,settleAt:.5}})});
$$('[data-mask]').forEach(function(el){gsap.fromTo(el,{clipPath:'inset(14% 10% 14% 10% round 24px)'},{clipPath:'inset(0% 0% 0% 0% round 6px)',ease:'none',scrollTrigger:{trigger:el,start:'top 92%',end:'top 35%',scrub:true,settleAt:1}})});

/* chapters */
$$('.chapter').forEach(function(ch){var mask=$('.reveal',ch),img=$('.par',ch),title=$('.title',ch);
  if(mask)gsap.fromTo(mask,{clipPath:'inset(22% 18% 22% 18% round 28px)'},{clipPath:'inset(0% 0% 0% 0% round 0px)',ease:'none',scrollTrigger:{trigger:ch,start:'top 85%',end:'top 15%',scrub:true,settleAt:1}});
  if(img)gsap.fromTo(img,{yPercent:8,scale:1.08},{yPercent:-8,scale:1,ease:'none',scrollTrigger:{trigger:ch,start:'top bottom',end:'bottom top',scrub:true,settleAt:.5}});
  if(title)gsap.fromTo(title,{xPercent:12},{xPercent:-12,ease:'none',scrollTrigger:{trigger:ch,start:'top bottom',end:'bottom top',scrub:true,settleAt:.5}});
  gsap.from($$('.info,.left,.no',ch),{y:50,opacity:0,duration:1.2,stagger:.1,ease:'expo.out',scrollTrigger:{trigger:ch,start:mobile?'top 70%':'top 55%',once:true}});});

/* counters */
$$('.count').forEach(function(el){var to=+el.getAttribute('data-to'),suf=el.getAttribute('data-suf')||'%',o={v:0};
  gsap.to(o,{v:to,duration:2,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true},onUpdate:function(){el.innerHTML=Math.round(o.v)+'<em>'+suf+'</em>'}})});

/* index hover preview */
var fl=$('#float'),fin=$('#floatIn'),idx=$('#index');
if(fl&&idx&&matchMedia('(hover:hover) and (pointer:fine)').matches){var fx=gsap.quickTo(fl,'x',{duration:.6,ease:'power3'}),fy=gsap.quickTo(fl,'y',{duration:.6,ease:'power3'});
  gsap.set(fl,{xPercent:-50,yPercent:-50,scale:.6});
  idx.addEventListener('mousemove',function(e){fx(e.clientX+190);fy(e.clientY)});
  $$('.row',idx).forEach(function(r){r.addEventListener('mouseenter',function(){fin.style.transform='translateY('+(-255*r.getAttribute('data-i'))+'px)';gsap.to(fl,{opacity:1,scale:1,rotation:-3,duration:.5,ease:'expo.out'})})});
  idx.addEventListener('mouseleave',function(){gsap.to(fl,{opacity:0,scale:.6,rotation:0,duration:.4})});}
if($('#index'))gsap.from('#index .row',{yPercent:40,opacity:0,duration:1,stagger:.07,ease:'expo.out',scrollTrigger:{trigger:'#index',start:'top 80%',once:true}});

/* statement word light-up */
var st=$('.statement');
if(st&&S){var sw=new S(st,{type:'words',wordsClass:'word',aria:'none'});gsap.fromTo(sw.words,{opacity:.4},{opacity:1,stagger:.08,ease:'none',scrollTrigger:{trigger:st,start:'top 82%',end:'bottom 50%',scrub:true,settleAt:1}})}
else if(st)$$('.word',st).forEach(function(w){w.style.opacity=1});

/* portrait */
$$('.portrait').forEach(function(p){var bg=$('.bgN',p),im=$('img',p),v=$('.vert',p);
  if(bg)gsap.fromTo(bg,{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:1.6,ease:'expo.inOut',scrollTrigger:{trigger:p,start:'top 80%',once:true}});
  if(im)gsap.from(im,{yPercent:14,opacity:0,duration:1.8,ease:'expo.out',delay:.3,scrollTrigger:{trigger:p,start:'top 80%',once:true}});
  if(v)gsap.fromTo(v,{yPercent:20},{yPercent:-20,ease:'none',scrollTrigger:{trigger:p,start:'top bottom',end:'bottom top',scrub:true,settleAt:.5}});});
/* process collage */
if($('#process')&&!matchMedia('(max-width:1024px)').matches){$$('.pp').forEach(function(p){var s=+p.getAttribute('data-s');gsap.fromTo(p,{y:-s/2},{y:s/2,ease:'none',scrollTrigger:{trigger:'#process',start:'top bottom',end:'bottom top',scrub:true,settleAt:.5}})})}
if($('#process'))gsap.from('.pp',{clipPath:'inset(100% 0 0 0)',duration:1.4,stagger:.15,ease:'expo.inOut',scrollTrigger:{trigger:'#process',start:'top 80%',once:true}});

/* contact block */
$$('.contact').forEach(function(c){gsap.from($$('.ln',c),{yPercent:105,duration:1.4,stagger:.12,ease:'expo.out',scrollTrigger:{trigger:$('h2',c),start:'top 88%',once:true}});
  var mg=$('.mega',c);if(mg)gsap.fromTo(mg,{xPercent:8},{xPercent:-4,ease:'none',scrollTrigger:{trigger:c,start:'top bottom',end:'bottom bottom',scrub:true,settleAt:1}})});

/* inner page hero */
var ph=$('.phero h1,.chero h1');
if(ph&&S){var pc=new S(ph,{type:'chars'}).chars;gsap.from(pc,{yPercent:100,opacity:0,duration:1.2,stagger:.03,ease:'expo.out',delay:.35})}
if($('.chero .art'))gsap.from('.chero .art',{y:80,scale:.94,opacity:0,duration:1.8,ease:'expo.out',delay:.45});
if($('.chero .art img'))gsap.to('.chero .art picture',{yPercent:-10,ease:'none',scrollTrigger:{trigger:'.chero',start:'top top',end:'bottom top',scrub:true,settleAt:0}});
gsap.from('.phero .sub>*,.chero .lede,.chero .facts,.ahero .intro2',{y:30,opacity:0,duration:1.1,stagger:.08,ease:'expo.out',delay:.6});

/* works list */
$$('.witem').forEach(function(w){var a=$('.wa',w);if(a)gsap.fromTo(a,{clipPath:'inset(18% 12% 18% 12% round 24px)'},{clipPath:'inset(0% 0% 0% 0% round 6px)',ease:'none',scrollTrigger:{trigger:w,start:'top 92%',end:'top 30%',scrub:true,settleAt:1}});
  var im=$('.wa picture',w);if(im)gsap.fromTo(im,{yPercent:6},{yPercent:-6,ease:'none',scrollTrigger:{trigger:w,start:'top bottom',end:'bottom top',scrub:true,settleAt:.5}})});

/* timeline bar */
var tb=$('.tl .bar');if(tb){var vert=matchMedia('(max-width:1024px)').matches;gsap.fromTo(tb,vert?{scaleY:0}:{scaleX:0},Object.assign(vert?{scaleY:1}:{scaleX:1},{ease:'none',scrollTrigger:{trigger:'.tl',start:'top 80%',end:vert?'bottom 60%':'top 30%',scrub:true,settleAt:1}}));
  gsap.from('.tl li',{y:40,opacity:0,duration:1.1,stagger:.1,ease:'expo.out',scrollTrigger:{trigger:'.tl',start:'top 85%',once:true}})}
if($('.skills'))gsap.from('.skills li',{y:40,opacity:0,duration:1,stagger:.06,ease:'expo.out',scrollTrigger:{trigger:'.skills',start:'top 85%',once:true}});
if($('.roles'))gsap.from('.roles>div',{y:50,opacity:0,duration:1.2,stagger:.1,ease:'expo.out',scrollTrigger:{trigger:'.roles',start:'top 85%',once:true}});
if($('.cgrid'))gsap.from('.cgrid>*',{y:40,opacity:0,duration:1,stagger:.06,ease:'expo.out',delay:.5});

/* case study: TOC tracking + progress */
var toc=$('.toc');
if(toc){var links=$$('a',toc);
  $$('.step').forEach(function(s,i){ScrollTrigger.create({trigger:s,start:'top 45%',end:'bottom 45%',onToggle:function(t){if(t.isActive)links.forEach(function(l,j){l.classList.toggle('on',j===i)})}})});
  gsap.to('.toc .prog i',{scaleX:1,ease:'none',scrollTrigger:{trigger:'.steps',start:'top 45%',end:'bottom 60%',scrub:true,settleAt:0}});}
var nx=$('.next');if(nx){gsap.fromTo('.next .nt',{xPercent:10},{xPercent:-6,ease:'none',scrollTrigger:{trigger:nx,start:'top bottom',end:'bottom bottom',scrub:true,settleAt:1}})}

/* screenshot helper: freeze everything at its resting state */
window.__settle=function(){if(lenis)lenis.destroy();
  ScrollTrigger.getAll().forEach(function(s){var a=s.animation;if(a)a.progress(s.vars.scrub?(s.vars.settleAt!=null?s.vars.settleAt:1):1);s.kill(false)});
  d.classList.add('settled');if(cur)cur.style.display='none';gsap.set('#loader',{display:'none'});if(curtain)curtain.style.display='none'};
}
})();
