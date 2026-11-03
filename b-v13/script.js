
(function(){
 function loadOrderStatus(){
  const root=document.getElementById('kiseki-order-status'),status=root.querySelector('.order-status-message');
  if(!window.jQuery||!window.Swiper){status.textContent='ご注文状況を取得できませんでした';return;}
  function el(tag,cls,text){const node=document.createElement(tag);node.className=cls;if(text!==undefined)node.textContent=String(text);return node;}
  window.jQuery.ajax({url:'https://tracking.borderfree-official.com/borderfree-api/v0.0.1/purchase/get',type:'GET',dataType:'json',timeout:15000,data:{item_name:'奇跡の歯ブラシ',limit:20}}).done(function(data){
   if(!data||!Array.isArray(data.purchases)){status.textContent='ご注文状況を取得できませんでした';return;}
   const rows=data.purchases.filter(p=>p&&typeof p.purchase_at==='string'&&typeof p.item_name==='string'&&typeof p.prefectures==='string').slice(0,20);
   if(!rows.length){status.textContent='現在表示できるご注文状況はありません';return;}
   const outer=el('div','outer_frame'),slider=el('div','swiper-container'),wrapper=el('div','swiper-wrapper');
   rows.forEach(p=>{const slide=el('div','swiper-slide order-outer'),inner=el('div','order-inner'),flex=el('div','order-flex-container'),image=el('img','order-icon'),text=el('div','order-text'),line=el('div','order-flex-container');image.src='https://d2w53g1q050m78.cloudfront.net/ssrabemashopping/uploads/oral-order/ha-order_icon.png';image.alt='アイコン';text.append(el('p','order-day',p.purchase_at));line.append(el('p','order-course order-teiki',p.item_name),el('p','order-prefectures',p.prefectures));text.append(line);flex.append(image,text);inner.append(flex);slide.append(inner);wrapper.append(slide);});
   slider.append(wrapper);outer.append(slider);status.remove();root.append(outer);
   let swiper=null;
   function syncOrderSlider(){
    if(!slider.getBoundingClientRect().height||!slider.getBoundingClientRect().width){if(swiper&&swiper.autoplay)swiper.autoplay.stop();return;}
    if(!swiper){swiper=new Swiper(slider,{direction:'vertical',effect:'slide',slidesPerView:3,loop:rows.length>3,allowTouchMove:false,autoplay:rows.length>3?{delay:2000,disableOnInteraction:false}:false});}
    else{swiper.update();if(rows.length>3&&swiper.autoplay)swiper.autoplay.start();}
   }
   const offer=root.closest('#offer');
   if(offer)new MutationObserver(syncOrderSlider).observe(offer,{attributes:true,attributeFilter:['hidden','style','class']});
   if(window.ResizeObserver)new ResizeObserver(syncOrderSlider).observe(slider);
   else window.addEventListener('resize',syncOrderSlider);
   syncOrderSlider();
  }).fail(function(){status.textContent='ご注文状況を取得できませんでした';});
 }
 if(document.readyState==='complete')loadOrderStatus();else window.addEventListener('load',loadOrderStatus,{once:true});
})();

(()=>{'use strict';
// Local DOM state only. No storage, network request, tracking, or order connection.
const root=document.getElementById('kiseki-reference-tail');
const q=[1,2,3].map(n=>root.querySelector('#q'+n));const offer=root.querySelector('#offer');
const complete=root.querySelector('#q3_send');const selected=new Set();
const worry=root.querySelector('.offer--worry');
const confirmedWorry={"answer_button2-3": "<span class=\"-dot\">虫</span><span class=\"-dot\">歯</span>のお悩みに", "answer_button2-1": "<span class=\"-dot\">口</span><span class=\"-dot\">臭</span>のお悩みに", "answer_button2-2": "<span class=\"-dot\">歯</span><span class=\"-dot\">垢</span>のお悩みに", "answer_button2-4": "<span class=\"-dot\">歯</span><span class=\"-dot\">周</span><span class=\"-dot\">病</span>のお悩みに"};
function updateWorry(id){const html=confirmedWorry[id]||'';worry.innerHTML=html;worry.hidden=!html;}
updateWorry(null);
function syncComplete(){complete.disabled=selected.size===0;complete.setAttribute('aria-disabled',String(complete.disabled));}
syncComplete();
function show(e){e.hidden=false;e.scrollIntoView({behavior:'smooth',block:'start'});}
q.forEach((section,index)=>section.querySelectorAll('.answer_button').forEach(button=>{
button.setAttribute('aria-pressed','false');
button.addEventListener('click',()=>{
if(index<2){section.querySelectorAll('.answer_button').forEach(b=>{b.classList.toggle('v4-selected',b===button);b.setAttribute('aria-pressed',String(b===button))});if(index===1)updateWorry(button.id);show(q[index+1]);}
else{if(selected.has(button.id))selected.delete(button.id);else selected.add(button.id);button.classList.toggle('v4-selected',selected.has(button.id));button.setAttribute('aria-pressed',String(selected.has(button.id)));syncComplete();offer.hidden=true;root.querySelector('#qa-link').hidden=false;root.querySelector('#purchase-link').hidden=true;}
});}));
const qaLink=root.querySelector('#qa-link'),purchaseLink=root.querySelector('#purchase-link');
complete.addEventListener('click',()=>{if(selected.size){show(offer);qaLink.hidden=true;purchaseLink.hidden=false;}});
root.querySelectorAll('.accordion').forEach(a=>{const p=a.querySelector('.accordion-text');const trigger=a.querySelector('.accordion-open');if(p&&trigger){p.hidden=true;trigger.setAttribute('role','button');trigger.setAttribute('tabindex','0');trigger.setAttribute('aria-expanded','false');const toggle=()=>{p.hidden=!p.hidden;trigger.setAttribute('aria-expanded',String(!p.hidden))};trigger.addEventListener('click',toggle);trigger.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}})}});
})();