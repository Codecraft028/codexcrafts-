try{var t=localStorage.getItem("cc-theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}

(function(){
  var st=document.querySelector('#why .stage');if(!st)return;
  var nodes=st.querySelectorAll('.node'),pinned=null;
  function hot(i){nodes.forEach(function(n){n.classList.toggle('hot',n.dataset.i===String(i))});if(i)st.dataset.hot=i;else st.removeAttribute('data-hot')}
  nodes.forEach(function(n){
    var i=n.dataset.i;
    n.addEventListener('mouseenter',function(){hot(i)});
    n.addEventListener('mouseleave',function(){hot(pinned)});
    n.addEventListener('focusin',function(){hot(i)});
    n.addEventListener('focusout',function(){hot(pinned)});
    n.querySelector('button').addEventListener('click',function(){pinned=(pinned===i)?null:i;hot(pinned||i)});
  });
})();

(function(){
  var b=document.getElementById('hamb'),m=document.getElementById('mobileMenu');
  if(!b||!m)return;
  b.addEventListener('click',function(){
    var open=b.getAttribute('aria-expanded')==='true';
    b.setAttribute('aria-expanded',String(!open)); b.classList.toggle('open',!open);
    m.setAttribute('aria-hidden',String(open));
  });
  m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){
    b.setAttribute('aria-expanded','false');b.classList.remove('open');m.setAttribute('aria-hidden','true');
  })});
})();

document.getElementById('f').addEventListener('submit',function(e){
  e.preventDefault();
  var v=function(i){return document.getElementById(i).value.trim()};
  var t='Hello CodexCrafts, I would like to enquire.\nName: '+v('fn')+'\nPhone: '+v('fp')+'\nEmail: '+v('fe')+(v('fc')?'\nCompany: '+v('fc'):'')+'\nService: '+v('fs')+(v('fb')?'\nBudget: '+v('fb'):'')+(v('fm')?'\nMessage: '+v('fm'):'');
  window.open('https://wa.me/918949845912?text='+encodeURIComponent(t),'_blank');
});
var up=document.getElementById('up');
window.addEventListener('scroll',function(){up.classList.toggle('show',window.scrollY>500)},{passive:true});

/* ---- Estimate: Project Builder (4-step) ---- */
(function(){
  var shell=document.getElementById('pbShell');
  if(!shell)return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var panels=Array.prototype.slice.call(shell.querySelectorAll('.pb-panel'));
  var psteps=Array.prototype.slice.call(shell.querySelectorAll('.pb-pstep'));
  var fill=document.getElementById('pbFill');
  var scaleFill=document.getElementById('pbScaleFill');
  var backBtn=document.getElementById('pbBack');
  var nextBtn=document.getElementById('pbNext');
  var liveEl=document.getElementById('pbLive');
  var heroEl=document.getElementById('pbEstimate');
  var breakdownEl=document.getElementById('pbBreakdown');
  var summaryEl=document.getElementById('pbSummary');
  var ctaEl=document.getElementById('pbCta');

  var step=1,maxStep=1;
  var heroShown={lo:0,hi:0};   // last value painted into the big hero number
  var liveShown={lo:0,hi:0};   // last value painted into the mini live readout

  function tiles(){return Array.prototype.slice.call(shell.querySelectorAll('.pb-tile'))}
  function scaleNodes(){return Array.prototype.slice.call(shell.querySelectorAll('.pb-scale-node'))}
  function features(){return Array.prototype.slice.call(shell.querySelectorAll('.pb-feature'))}
  function selType(){return shell.querySelector('.pb-tile[aria-checked="true"]')}
  function selSize(){return shell.querySelector('.pb-scale-node[aria-checked="true"]')}
  function selAdds(){return Array.prototype.slice.call(shell.querySelectorAll('.pb-feature[aria-pressed="true"]'))}

  function fmtFull(n){return '₹'+Math.round(n).toLocaleString('en-IN')}
  function fmtK(n){
    var v=n/1000,s=(Math.round(v*10)/10);
    s=(s%1===0)?String(s):s.toFixed(1);
    return '₹'+s+'K';
  }

  function compute(){
    var t=selType(),z=selSize(),a=selAdds();
    var base=(+t.dataset.v)*(+z.dataset.v),addSum=0;
    a.forEach(function(b){addSum+=+b.dataset.v});
    var sum=base+addSum;
    var lo=Math.round(sum/500)*500,hi=Math.round(sum*1.3/500)*500;
    return {t:t,z:z,a:a,base:base,addSum:addSum,lo:lo,hi:hi};
  }

  function animateRange(el,from,to,formatter,duration){
    if(reduce||duration<=0){el.textContent=formatter(to.lo,to.hi);return}
    var start=null;
    function frame(ts){
      if(start===null)start=ts;
      var p=Math.min((ts-start)/duration,1),ep=1-Math.pow(1-p,3);
      el.textContent=formatter(from.lo+(to.lo-from.lo)*ep,from.hi+(to.hi-from.hi)*ep);
      if(p<1)requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function render(){
    var r=compute();

    animateRange(liveEl,liveShown,{lo:r.lo,hi:r.hi},function(lo,hi){return fmtFull(lo)+' – '+fmtFull(hi)},450);
    liveShown={lo:r.lo,hi:r.hi};

    animateRange(heroEl,heroShown,{lo:r.lo,hi:r.hi},function(lo,hi){return fmtK(lo)+' — '+fmtK(hi)},650);
    heroShown={lo:r.lo,hi:r.hi};

    var rows='<div class="pb-bitem"><span>'+r.t.dataset.l+' · '+r.z.dataset.l+' scale</span><span>'+fmtFull(r.base)+'</span></div>';
    r.a.forEach(function(b){rows+='<div class="pb-bitem"><span>'+b.dataset.l+'</span><span>+'+fmtFull(+b.dataset.v)+'</span></div>'});
    breakdownEl.innerHTML=rows;

    var chips='<span class="pb-chip">'+r.t.dataset.l+'</span><span class="pb-chip">'+r.z.dataset.l+'</span>';
    chips+=r.a.length?r.a.map(function(b){return '<span class="pb-chip">'+b.dataset.l+'</span>'}).join(''):'<span class="pb-chip is-empty">No add-ons</span>';
    summaryEl.innerHTML=chips;

    var addTxt=r.a.length?(' with '+r.a.map(function(b){return b.dataset.l}).join(', ')):'';
    var msg='Hi CodexCrafts! I used your Project Builder.\n\nProject: '+r.t.dataset.l+'\nScale: '+r.z.dataset.l+addTxt.replace(' with ','\nFeatures: ')+'\nEstimated budget: '+fmtFull(r.lo)+' – '+fmtFull(r.hi)+'\n\nCan we discuss next steps?';
    ctaEl.href='https://wa.me/918949845912?text='+encodeURIComponent(msg);

    scaleFill.style.width=(((+r.z.dataset.v-1)/(3-1))*100)+'%';
  }

  function goto(n){
    n=Math.max(1,Math.min(4,n));
    step=n;
    if(n>maxStep)maxStep=n;
    panels.forEach(function(p){p.hidden=(+p.dataset.panel!==n)});
    psteps.forEach(function(p){
      var s=+p.dataset.step;
      p.classList.toggle('is-done',s<n);
      if(s===n)p.setAttribute('aria-current','step');else p.removeAttribute('aria-current');
    });
    fill.style.width=(((n-1)/3)*100)+'%';
    backBtn.disabled=(n===1);
    nextBtn.style.display=(n===4)?'none':'';
    if(n===4)render();
  }

  function radioGroupClick(list,btn){
    list.forEach(function(x){x.setAttribute('aria-checked','false')});
    btn.setAttribute('aria-checked','true');
    render();
  }
  function radioGroupKey(e,list){
    var horiz=e.key==='ArrowRight'||e.key==='ArrowLeft',vert=e.key==='ArrowDown'||e.key==='ArrowUp';
    if(!horiz&&!vert)return;
    e.preventDefault();
    var i=list.indexOf(document.activeElement);
    if(i<0)return;
    var dir=(e.key==='ArrowRight'||e.key==='ArrowDown')?1:-1;
    var next=list[(i+dir+list.length)%list.length];
    next.focus();radioGroupClick(list,next);
  }

  tiles().forEach(function(b){
    b.addEventListener('click',function(){radioGroupClick(tiles(),b)});
  });
  shell.querySelector('.pb-tiles').addEventListener('keydown',function(e){radioGroupKey(e,tiles())});

  scaleNodes().forEach(function(b){
    b.addEventListener('click',function(){radioGroupClick(scaleNodes(),b)});
  });
  shell.querySelector('.pb-scale-nodes').addEventListener('keydown',function(e){radioGroupKey(e,scaleNodes())});

  features().forEach(function(b){
    b.addEventListener('click',function(){
      b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')==='true'?'false':'true');
      render();
    });
  });

  backBtn.addEventListener('click',function(){goto(step-1)});
  nextBtn.addEventListener('click',function(){goto(step+1)});
  psteps.forEach(function(p){p.addEventListener('click',function(){goto(+p.dataset.step)})});

  render();
  goto(1);

  /* Expose a tiny hook so the Services section can pre-select a project type
     and jump straight to the estimate, reusing this same builder instance. */
  window.ccProjectBuilder={
    selectType:function(label){
      var tile=shell.querySelector('.pb-tile[data-l="'+label+'"]');
      if(!tile)return false;
      tile.click();          // reuses the existing radioGroupClick handler + render()
      goto(1);
      return true;
    }
  };
})();


/* ---- Services: single-select cards -> Discuss Your Project flow ---- */
(function(){
  var section=document.getElementById('services');
  if(!section)return;

  var cards=Array.prototype.slice.call(section.querySelectorAll('.card[data-service]'));
  var discussBtn=document.getElementById('svcDiscussBtn');
  var msgEl=document.getElementById('svcMsg');
  var selectedNameEl=document.getElementById('svcSelectedName');
  var selectedPriceEl=document.getElementById('svcSelectedPrice');
  var ctaTitleEl=document.getElementById('svcCtaTitle');
  var ctaDescEl=document.getElementById('svcCtaDesc');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var selectedCard=null;

  var builderMap={
    'Website':'Business Website',
    'Mobile apps':'Mobile App',
    'Custom software':'Custom Software'
  };

  var contactMap={
    'Website':'Website',
    'Mobile apps':'Mobile app',
    'UI/UX design':'UI/UX design',
    'Custom software':'Custom software',
    'AI chatbots and automation':'AI chatbot and automation',
    'Branding & Identity':'Branding & Identity',
    'Digital Marketing':'Digital Marketing',
    'Graphic Design':'Graphic Design',
    'Motion Design':'Motion Design',
    'Video Editing':'Video Editing',
    'Social Media Management':'Social Media Management',
    'Hosting & Deployment':'Hosting & Deployment'
  };

  // Starting prices per service. Final pricing depends on pages, features and integrations.
  var priceMap={
    'Website':'Starting ₹5,999+',
    'Mobile apps':'Starting ₹13,999+',
    'UI/UX design':'Starting ₹3,999+',
    'Custom software':'Starting ₹15,999+',
    'AI chatbots and automation':'Starting ₹5,999+',
    'Branding & Identity':'Starting ₹3,999+',
    'Digital Marketing':'Starting ₹3,999+ / month',
    'Graphic Design':'Starting ₹499+ / design',
    'Motion Design':'Starting ₹599+ / design',
    'Video Editing':'Starting ₹799+ / video',
    'Social Media Management':'Starting ₹2,999+ / month',
    'Hosting & Deployment':'Starting ₹1,499+'
  };
  function updateSelectionPreview(service){
    var isBuilder=!!builderMap[service];
    if(selectedNameEl)selectedNameEl.textContent=service;
    if(selectedPriceEl)selectedPriceEl.textContent=(priceMap[service]||'Custom quote')+' • final quote after requirements';
    if(discussBtn){
      discussBtn.textContent=isBuilder?'Build My Estimate →':'Continue With This Service →';
      discussBtn.href=isBuilder?'#estimate':'#contact';
      discussBtn.classList.add('is-active');
    }
    if(ctaTitleEl)ctaTitleEl.textContent=isBuilder?'Build your estimate':'Continue with your service';
    if(ctaDescEl)ctaDescEl.textContent=isBuilder
      ?'Your selection is ready. Choose project size and features to see a live estimate.'
      :'Your service is selected. Continue to enquiry and we’ll confirm the exact scope and quote.';
  }

  function resetSelectionPreview(){
    if(selectedNameEl)selectedNameEl.textContent='No service selected';
    if(selectedPriceEl)selectedPriceEl.textContent='Choose a service above';
    if(discussBtn){
      discussBtn.textContent='Select a service first →';
      discussBtn.href='#contact';
      discussBtn.classList.remove('is-active');
    }
    if(ctaTitleEl)ctaTitleEl.textContent='Choose a service to continue';
    if(ctaDescEl)ctaDescEl.textContent='Select the service you need. We\'ll show the relevant budget range and take you to the next step.';
  }

  function saveService(service){
    try{sessionStorage.setItem('cc_selected_service',service)}catch(e){}
  }

  function clearSavedService(){
    try{sessionStorage.removeItem('cc_selected_service')}catch(e){}
  }

  function selectCard(card, scrollIntoView){
    cards.forEach(function(c){
      c.classList.remove('is-selected');
      c.setAttribute('aria-pressed','false');
    });

    card.classList.add('is-selected');
    card.setAttribute('aria-pressed','true');
    selectedCard=card;
    saveService(card.dataset.service);
    updateSelectionPreview(card.dataset.service);
    hideMsg();

    if(scrollIntoView && !reduce){
      card.scrollIntoView({behavior:'smooth',block:'center'});
    }
  }

  function deselectCard(){
    cards.forEach(function(c){
      c.classList.remove('is-selected');
      c.setAttribute('aria-pressed','false');
    });
    selectedCard=null;
    clearSavedService();
    resetSelectionPreview();
  }

  function toggleCard(card, scrollIntoView){
    if(selectedCard===card){
      deselectCard();
    }else{
      selectCard(card, scrollIntoView);
    }
  }

  cards.forEach(function(card){
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    card.setAttribute('aria-pressed','false');

    card.addEventListener('click',function(){
      toggleCard(card,false);
    });

    card.addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.key===' '){
        e.preventDefault();
        toggleCard(card,false);
      }
    });
  });

  /* Restore the user's last selected service when returning to the page. */
  try{
    var saved=sessionStorage.getItem('cc_selected_service');
    if(saved){
      var savedCard=cards.filter(function(c){return c.dataset.service===saved})[0];
      if(savedCard)selectCard(savedCard,false);
    }
  }catch(e){}

  function showMsg(){
    if(!msgEl)return;
    msgEl.textContent='Please select a service first.';
    msgEl.classList.add('show');
    clearTimeout(showMsg._t);
    showMsg._t=setTimeout(function(){
      msgEl.classList.remove('show');
    },2600);
  }

  function hideMsg(){
    if(msgEl)msgEl.classList.remove('show');
  }

  function pulseHint(){
    if(reduce)return;
    cards.forEach(function(c){
      c.classList.add('pulse-hint');
      c.addEventListener('animationend',function handler(){
        c.classList.remove('pulse-hint');
        c.removeEventListener('animationend',handler);
      });
    });
  }

  if(discussBtn){
    discussBtn.addEventListener('click',function(e){
      if(!selectedCard){
        e.preventDefault();
        showMsg();
        pulseHint();
        if(cards[0])cards[0].scrollIntoView({
          behavior:reduce?'auto':'smooth',
          block:'center'
        });
        return;
      }

      var service=selectedCard.dataset.service;
      var builderLabel=builderMap[service];

      /*
       * Website, Mobile apps and Custom software use the existing
       * Project Builder. The selected service is automatically
       * pre-selected there.
       */
      if(builderLabel && window.ccProjectBuilder &&
         window.ccProjectBuilder.selectType(builderLabel)){
        e.preventDefault();

        var estimate=document.getElementById('estimate');
        if(estimate){
          estimate.scrollIntoView({
            behavior:reduce?'auto':'smooth',
            block:'start'
          });
        }
        return;
      }

      /*
       * Other services use the existing contact form. Pre-select
       * the matching service there and continue to Talk To Us (#contact).
       * Scrolled explicitly (rather than relying on the anchor's default
       * hash navigation) so it also works when the hash is already
       * "#contact" from a previous click, which the browser otherwise
       * ignores.
       */
      e.preventDefault();

      var fs=document.getElementById('fs');
      if(fs && contactMap[service]){
        var opt=Array.prototype.slice.call(fs.options).filter(function(o){
          return o.value===contactMap[service];
        })[0];

        if(opt)fs.value=opt.value;
      }

      var contact=document.getElementById('contact');
      if(contact){
        contact.scrollIntoView({
          behavior:reduce?'auto':'smooth',
          block:'start'
        });
      }
    });
  }
})();
/* ---- FAQ: accordion cards (single-open, animated) ---- */
(function(){
  var list=document.querySelector('.faq-list');
  if(!list)return;
  var items=Array.prototype.slice.call(list.querySelectorAll('.faq-q'));
  items.forEach(function(btn){
    btn.addEventListener('click',function(){
      var willOpen=btn.getAttribute('aria-expanded')!=='true';
      items.forEach(function(b){b.setAttribute('aria-expanded','false')});
      btn.setAttribute('aria-expanded',willOpen?'true':'false');
    });
  });
})();

(function(){
  if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  var d=document.createElement('div'),r=document.createElement('div');
  d.className='cur-dot';r.className='cur-ring';document.body.append(d,r);
  document.documentElement.classList.add('cc');
  var x=0,y=0,rx=0,ry=0,on=false;
  document.addEventListener('mousemove',function(e){
    x=e.clientX;y=e.clientY;d.style.transform='translate('+x+'px,'+y+'px)';
    if(!on){on=true;rx=x;ry=y;d.style.opacity=r.style.opacity=1}
    r.classList.toggle('hov',!!e.target.closest('a,button,summary,select,label,.opt'));
  });
  document.addEventListener('mouseleave',function(){on=false;d.style.opacity=r.style.opacity=0});
  document.addEventListener('mousedown',function(){r.classList.add('dn')});
  document.addEventListener('mouseup',function(){r.classList.remove('dn')});
  (function loop(){rx+=(x-rx)*.18;ry+=(y-ry)*.18;r.style.transform='translate('+rx+'px,'+ry+'px)';requestAnimationFrame(loop)})();
})();

(function(){
  var c=document.getElementById('bg'),x=c.getContext('2d'),W,H,P=[],m={x:-999,y:-999},col={a:'165,13,40',b:'255,107,87'};
  var still=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  function hex(v){v=v.trim().replace('#','');if(v.length===3)v=v.replace(/./g,'$&$&');return parseInt(v.slice(0,2),16)+','+parseInt(v.slice(2,4),16)+','+parseInt(v.slice(4,6),16)}
  function colors(){var cs=getComputedStyle(document.documentElement);col.a=hex(cs.getPropertyValue('--tx'));col.b=hex(cs.getPropertyValue('--gold'))}
  function init(){
    var d=Math.min(window.devicePixelRatio||1,2);W=innerWidth;H=innerHeight;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0);
    var n=Math.min(110,Math.round(W*H/15000));P=[];
    for(var i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5,g:i%6===0});
  }
  function draw(){
    x.clearRect(0,0,W,H);
    for(var i=0;i<P.length;i++){
      var a=P[i];
      if(!still){
        a.x+=a.vx;a.y+=a.vy;
        if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1;
        var dx=a.x-m.x,dy=a.y-m.y,md=Math.sqrt(dx*dx+dy*dy);
        if(md<110&&md>0){a.x+=dx/md*1.2;a.y+=dy/md*1.2}
      }
      for(var j=i+1;j<P.length;j++){
        var b=P[j],ex=a.x-b.x,ey=a.y-b.y,d=Math.sqrt(ex*ex+ey*ey);
        if(d<140){x.strokeStyle='rgba('+col.a+','+(1-d/140)*.28+')';x.lineWidth=1;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}
      }
      var mx=a.x-m.x,my=a.y-m.y,mm=Math.sqrt(mx*mx+my*my);
      if(mm<170){x.strokeStyle='rgba('+col.b+','+(1-mm/170)*.55+')';x.lineWidth=1.2;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(m.x,m.y);x.stroke()}
      x.fillStyle='rgba('+(a.g?col.b:col.a)+','+(a.g?.8:.55)+')';x.beginPath();x.arc(a.x,a.y,a.g?2.6:2,0,6.283);x.fill();
    }
    if(!still)requestAnimationFrame(draw);
  }
  colors();init();draw();
  window.addEventListener('resize',function(){init();if(still)draw()});
  window.addEventListener('mousemove',function(e){m.x=e.clientX;m.y=e.clientY},{passive:true});
  window.addEventListener('mouseout',function(){m.x=m.y=-999});
  window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change',function(){colors();if(still)draw()});
  window.addEventListener('themechange',function(){colors();if(still)draw()});
})();
(function(){
  var r=document.documentElement,b=document.getElementById('tt');
  function dark(){var t=r.getAttribute('data-theme');return t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches)}
  b.addEventListener('click',function(){
    var n=dark()?'light':'dark';r.setAttribute('data-theme',n);
    try{localStorage.setItem('cc-theme',n)}catch(e){}
    window.dispatchEvent(new Event('themechange'));
  });
})();
(function(){
  var ctx;
  function note(f,t,d,v){
    var o=ctx.createOscillator(),h=ctx.createOscillator(),g=ctx.createGain(),g2=ctx.createGain();
    o.type='sine';h.type='sine';o.frequency.value=f;h.frequency.value=f*2;
    g2.gain.value=.22;
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(g);h.connect(g2);g2.connect(g);g.connect(ctx.destination);
    o.start(t);h.start(t);o.stop(t+d+.02);h.stop(t+d+.02);
  }
  function tick(){
    try{
      ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();
      if(ctx.state==='suspended')ctx.resume();
      var t=ctx.currentTime;
      note(784,t,.16,.07);
      note(1175,t+.075,.22,.06);
    }catch(e){}
  }
  document.addEventListener('click',function(e){if(e.target.closest('a,button,summary,.opt,select,label,[role="button"]'))tick()});
})();
(function(){
  var h=document.documentElement;h.classList.add('sp');
  setTimeout(function(){h.classList.remove('sp');var e=document.getElementById('splash');if(e)e.remove()},1350);
})();

(function(){
  var section=document.getElementById('process');
  var flow=document.getElementById('processFlow');
  if(!section||!flow)return;
  var steps=Array.prototype.slice.call(flow.querySelectorAll('.flow-step'));
  var flines=Array.prototype.slice.call(flow.querySelectorAll('.fline'));
  var particle=document.getElementById('flowParticle');
  var n=steps.length;
  var lastActive=-1,completedOnce=false,ticking=false;

  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){section.classList.add('in-view');io.unobserve(section)}
      });
    },{threshold:.2});
    io.observe(section);
  }else{
    section.classList.add('in-view');
  }

  function update(){
    ticking=false;
    var rect=section.getBoundingClientRect();
    var vh=window.innerHeight||document.documentElement.clientHeight;
    var total=rect.height+vh;
    var progress=(vh-rect.top)/total;
    if(progress<0)progress=0;if(progress>1)progress=1;

    flow.classList.toggle('animating',progress>0.02&&progress<0.99);

    for(var i=1;i<n;i++){
      var segStart=(i-1)/(n-1),segEnd=i/(n-1);
      var segP=(progress-segStart)/(segEnd-segStart);
      if(segP<0)segP=0;if(segP>1)segP=1;
      flines[i]&&flines[i].style.setProperty('--p',segP);
    }

    var activeIndex=Math.min(n-1,Math.floor(progress*n));
    if(progress<=0)activeIndex=0;
    steps.forEach(function(st,idx){
      st.classList.toggle('done',idx<activeIndex);
      st.classList.toggle('active',idx===activeIndex);
    });

    var mobile=window.matchMedia('(max-width:760px)').matches;
    if(mobile){
      particle.style.top=(progress*flow.offsetHeight)+'px';
      particle.style.left='';
    }else{
      particle.style.left=(progress*flow.offsetWidth)+'px';
      particle.style.top='';
    }

    if(activeIndex===n-1&&progress>0.92){
      if(!completedOnce){completedOnce=true;flow.classList.remove('complete');void flow.offsetWidth;flow.classList.add('complete')}
    }else if(progress<0.8){
      completedOnce=false;flow.classList.remove('complete');
    }
    lastActive=activeIndex;
  }

  function onScroll(){
    if(!ticking){ticking=true;requestAnimationFrame(update)}
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  update();
})();

/* FAQ entrance polish */
(function(){
  var list=document.querySelector('.faq-list');
  if(!list || !('IntersectionObserver' in window)) return;
  var items=list.querySelectorAll('.faq-item');
  items.forEach(function(item,i){
    item.style.opacity='0';
    item.style.transform='translateY(14px)';
    item.style.transition='opacity .55s ease '+(i*.06)+'s, transform .55s ease '+(i*.06)+'s, border-color .3s ease, box-shadow .3s ease';
  });
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(!entry.isIntersecting) return;
      items.forEach(function(item){
        item.style.opacity='1';
        item.style.transform='translateY(0)';
      });
      io.disconnect();
    });
  },{threshold:.12});
  io.observe(list);
})();
