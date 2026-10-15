// Sayfa davranışları. İçerik yeniden çizilince window.ucpInit() tekrar çağrılır.
(function(){
  var root=document.documentElement;
  try{var s=localStorage.getItem('ucp-theme');if(s)root.setAttribute('data-theme',s);}catch(e){}
  var ctl=null,io=null;
  window.ucpInit=function(){
    if(ctl)ctl.abort(); if(io)io.disconnect();
    ctl=new AbortController(); var sig={signal:ctl.signal};
    var tb=document.getElementById('theme');
    if(tb)tb.addEventListener('click',function(){
      var cur=root.getAttribute('data-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
      var n=cur==='dark'?'light':'dark';root.setAttribute('data-theme',n);try{localStorage.setItem('ucp-theme',n);}catch(e){}
    },sig);
    var yr=document.getElementById('yr');if(yr)yr.textContent=new Date().getFullYear();
    var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    var nums=document.querySelectorAll('.num[data-to]');
    function show(el){var to=+el.dataset.to,pre=el.dataset.pre||'',suf=el.dataset.suf||'';
      if(reduce){el.textContent=pre+to+suf;return;}
      var t0=null;function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/1300),e=1-Math.pow(1-p,3);el.textContent=pre+Math.round(to*e)+suf;if(p<1)requestAnimationFrame(step);}requestAnimationFrame(step);}
    if('IntersectionObserver' in window){
      io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){show(e.target);io.unobserve(e.target);}});},{threshold:.4});
      nums.forEach(function(n){io.observe(n);});
    }else nums.forEach(show);
    var cases=[].slice.call(document.querySelectorAll('.case'));
    var steps=document.getElementById('steps'),rail=steps&&steps.querySelector('.rail');
    var bar=document.querySelector('.progress i'),prose=document.querySelector('.prose');
    var ticking=false;
    function onScroll(){
      ticking=false;var vh=innerHeight;
      if(!reduce){cases.forEach(function(c,i){var nx=cases[i+1];if(!nx){c.style.transform='';return;}
        var a=c.getBoundingClientRect(),b=nx.getBoundingClientRect();var d=b.top-a.top,h=a.height;
        var p=Math.max(0,Math.min(1,1-d/h));c.style.transform='scale('+(1-p*0.05)+')';c.style.opacity=String(1-p*0.35);});}
      if(rail){var r=steps.getBoundingClientRect();rail.style.setProperty('--p',Math.max(0,Math.min(1,(vh*0.85-r.top)/(r.height+vh*0.3))).toFixed(3));}
      if(bar&&prose){var q=prose.getBoundingClientRect(),hh=q.height-vh*.6;bar.style.setProperty('--p',Math.max(0,Math.min(1,(-q.top+vh*.2)/Math.max(1,hh))).toFixed(3));}
    }
    addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll);}},{passive:true,signal:ctl.signal});
    addEventListener('resize',onScroll,sig);onScroll();
    var wm=document.getElementById('wm');
    function fit(){if(!wm)return;wm.style.fontSize='100px';var w=wm.parentElement.clientWidth;wm.style.fontSize=Math.floor(100*w/wm.offsetWidth*0.99)+'px';}
    fit();addEventListener('resize',fit,sig);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
  };
  window.ucpInit();
})();
