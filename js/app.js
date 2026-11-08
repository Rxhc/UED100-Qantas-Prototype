/* UED100 Assessment 2 — front-end-only UX demonstration.
   No real airline APIs, payments, authentication, analytics, or backend calls.
   Never treat client-side validation as a replacement for server-side validation. */
'use strict';

const $ = (id) => document.getElementById(id);
const AIRPORTS = {SYD:'Sydney',MEL:'Melbourne',BNE:'Brisbane',PER:'Perth',ADL:'Adelaide',AKL:'Auckland'};
const SAMPLE_FARES = [
  {name:'Red e-Deal',price:189,points:12500,time:'07:15',duration:'1h 35m',note:'Includes carry-on baggage'},
  {name:'Flex',price:279,points:18200,time:'11:30',duration:'1h 35m',note:'More flexibility to change plans'},
  {name:'Business',price:649,points:41500,time:'17:45',duration:'1h 35m',note:'Business cabin experience'}
];
const state={search:null,chosenFare:null,traveller:null,step:1,sessionTimer:null,sessionExpiryTimer:null};
const INITIAL_NOTICE_DELAY_MS=180000; // 3 min: short for assessment testing; production server owns actual session expiry.
const WARNING_WINDOW_MS=60000;

function show(el,visible=true){el.hidden=!visible;}
function announce(message){const toast=$('toast');toast.textContent=message;show(toast);clearTimeout(announce.timer);announce.timer=setTimeout(()=>show(toast,false),3500);}
function setError(id,message){const node=$(id);node.textContent=message;show(node,Boolean(message));}
function todayLocal(){const d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10);}
function plusDays(iso,days){const d=new Date(`${iso}T12:00:00`);d.setDate(d.getDate()+days);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function dateLabel(iso){return new Intl.DateTimeFormat('en-AU',{day:'numeric',month:'short',year:'numeric'}).format(new Date(`${iso}T12:00:00`));}
function formatMoney(n){return new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD',maximumFractionDigits:0}).format(n);}
function focusHeading(panel){const title=panel.querySelector('h3');if(title){title.tabIndex=-1;title.focus({preventScroll:true});}panel.scrollIntoView({behavior:'smooth',block:'center'});}
function setStep(n){state.step=n;document.querySelectorAll('#progressSteps li').forEach((li,index)=>{li.classList.toggle('active',index===n-1);li.classList.toggle('done',index<n-1);if(index===n-1)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');});}
function showBooking(which,step){['bookingEmpty','flightResults','travellerForm','reviewPanel','confirmationPanel'].forEach((id)=>show($(id),id===which));setStep(step);focusHeading($(which));}
function resetSession(){clearTimeout(state.sessionTimer);clearTimeout(state.sessionExpiryTimer);show($('sessionNotice'),false);if(state.step<2||!state.search)return;state.sessionTimer=setTimeout(()=>{show($('sessionNotice'));$('extendSession').focus();state.sessionExpiryTimer=setTimeout(()=>{show($('sessionNotice'),false);state.chosenFare=null;state.traveller=null;showBooking('bookingEmpty',1);announce('Demo session ended. Please search again.');},WARNING_WINDOW_MS);},INITIAL_NOTICE_DELAY_MS);}

// Initialize date pickers with valid local dates and prevent past or inverted trips.
const today=todayLocal();$('departDate').min=today;$('returnDate').min=today;
$('departDate').value=plusDays(today,14);$('returnDate').value=plusDays(today,21);
$('departDate').addEventListener('change',()=>{$('returnDate').min=$('departDate').value||today;if($('returnDate').value<$('departDate').value)$('returnDate').value=$('departDate').value;});
function syncTripType(){const oneWay=document.querySelector('input[name="tripType"]:checked').value==='oneway';show($('returnDateWrap'),!oneWay);$('returnDate').required=!oneWay;}
document.querySelectorAll('input[name="tripType"]').forEach((input)=>input.addEventListener('change',syncTripType));
$('swapAirports').addEventListener('click',()=>{const from=$('origin').value;$('origin').value=$('destination').value;$('destination').value=from;announce('Departure and destination airports swapped.');});

// Mobile navigation: visible state and ARIA state always match.
$('menuToggle').addEventListener('click',()=>{const nav=$('primaryNav');const isOpen=nav.classList.toggle('is-open');$('menuToggle').setAttribute('aria-expanded',String(isOpen));$('menuToggle').setAttribute('aria-label',isOpen?'Close navigation':'Open navigation');});
document.querySelectorAll('#primaryNav a').forEach((a)=>a.addEventListener('click',()=>{$('primaryNav').classList.remove('is-open');$('menuToggle').setAttribute('aria-expanded','false');$('menuToggle').setAttribute('aria-label','Open navigation');}));
$('signInBtn').addEventListener('click',()=>announce('Sign-in is not connected in this educational prototype.'));
// Familiar travel tasks are discoverable but clearly do not pretend to access real reservations.
document.querySelectorAll('[data-task]').forEach(button=>button.addEventListener('click',()=>{
  const task=button.dataset.task;
  const explanations={
    'Manage booking':'Manage booking would normally request a booking reference and surname.',
    'Use flight credit':'Flight credit redemption would normally verify an existing credit.',
    'Check in':'Check-in would normally confirm identity and an eligible flight.',
    'Flight status':'Flight status would normally retrieve live flight information.'
  };
  const feedback=$('taskFeedback');feedback.textContent=`${task}: ${explanations[task]} This demonstration does not connect to Qantas systems.`;
  show(feedback);feedback.focus?.();
}));
$('exploreTravel').addEventListener('click',()=>{
  announce('Hotels, car hire and insurance are outside this flight-booking prototype.');
});
// Users may change the comparison mode directly on the results screen, without searching again.
document.querySelectorAll('input[name="fareCurrency"]').forEach(input=>input.addEventListener('change',()=>{
  if(!state.search)return;
  state.search.points=input.value==='points';$('pointsMode').checked=state.search.points;
  renderFares();announce(`Showing sample fares in ${state.search.points?'Qantas Points':'Australian dollars'}.`);
}));

$('goSearch').addEventListener('click',()=>{$('home').scrollIntoView({behavior:'smooth'});$('origin').focus({preventScroll:true});});

// Flight search validates route and dates before building DOM nodes.
$('flightForm').addEventListener('submit',(event)=>{event.preventDefault();setError('formError','');const origin=$('origin').value,destination=$('destination').value,depart=$('departDate').value,ret=$('returnDate').value,oneWay=document.querySelector('input[name="tripType"]:checked').value==='oneway';
  if(origin===destination){setError('formError','Departure and destination airports must be different.');$('destination').focus();return;}
  if(!depart||depart<todayLocal()){setError('formError','Choose a departure date that is today or later.');$('departDate').focus();return;}
  if(!oneWay&&(!ret||ret<depart)){setError('formError','Your return date must be on or after your departure date.');$('returnDate').focus();return;}
  state.search={origin,destination,depart,returnDate:oneWay?null:ret,passengers:Number($('passengers').value),points:$('pointsMode').checked};document.querySelector(`input[name="fareCurrency"][value="${state.search.points?'points':'cash'}"]`).checked=true;state.chosenFare=null;state.traveller=null;
  renderFares();showBooking('flightResults',2);resetSession();
});

function renderFares(){const s=state.search;$('resultsTitle').textContent=`${AIRPORTS[s.origin]} to ${AIRPORTS[s.destination]}`;$('resultsSummary').textContent=`${dateLabel(s.depart)}${s.returnDate?' – '+dateLabel(s.returnDate):' • One way'} • ${s.passengers} ${s.passengers===1?'adult':'adults'}`;const container=$('fareCards');container.replaceChildren();SAMPLE_FARES.forEach((fare,index)=>{const card=document.createElement('article');card.className='fare-card';const tag=document.createElement('span');tag.className='fare-tag';tag.textContent=fare.name.toUpperCase();const route=document.createElement('div');route.className='fare-route';route.textContent=`${s.origin}  →  ${s.destination}`;const time=document.createElement('p');time.textContent=`Departs ${fare.time} • Approx. ${fare.duration}`;const price=document.createElement('div');price.className='fare-price';const amount=s.points?`${(fare.points*s.passengers).toLocaleString('en-AU')} pts`:formatMoney(fare.price*s.passengers);price.textContent=amount;const sub=document.createElement('small');sub.textContent=`Sample ${s.points?'points':'AUD'} total • ${s.passengers} ${s.passengers===1?'passenger':'passengers'}`;price.appendChild(sub);const note=document.createElement('p');note.textContent=fare.note;const button=document.createElement('button');button.type='button';button.className='primary-button';button.textContent='Select fare →';button.setAttribute('aria-label',`Select ${fare.name} for ${amount}`);button.addEventListener('click',()=>{state.chosenFare={...fare,index};showBooking('travellerForm',3);resetSession();});card.append(tag,route,time,price,note,button);container.appendChild(card);});}

$('backToFares').addEventListener('click',()=>{showBooking('flightResults',2);resetSession();});
$('travellerForm').addEventListener('submit',(event)=>{event.preventDefault();setError('travellerError','');const inputs=['firstName','lastName','email','phone'].map($);let invalid=inputs.find(input=>!input.value.trim()||!input.checkValidity());if(invalid){setError('travellerError',`Please enter a valid ${invalid.labels[0]?.textContent.toLowerCase()||'value'}.`);invalid.focus();return;}state.traveller={firstName:$('firstName').value.trim(),lastName:$('lastName').value.trim(),email:$('email').value.trim(),phone:$('phone').value.trim()};renderReview();showBooking('reviewPanel',4);resetSession();});
function renderReview(){const s=state.search,f=state.chosenFare,t=state.traveller;const entries=[['Route',`${AIRPORTS[s.origin]} (${s.origin}) → ${AIRPORTS[s.destination]} (${s.destination})`],['Travel',`${dateLabel(s.depart)}${s.returnDate?' to '+dateLabel(s.returnDate):' (one way)'}`],['Fare',f.name],['Passengers',String(s.passengers)],['Sample total',s.points?`${(f.points*s.passengers).toLocaleString('en-AU')} Qantas Points`:formatMoney(f.price*s.passengers)],['Traveller',`${t.firstName} ${t.lastName}`],['Email',t.email]];const container=$('reviewDetails');container.replaceChildren();entries.forEach(([key,value])=>{const row=document.createElement('div');row.className='review-row';const label=document.createElement('span');label.textContent=key;const val=document.createElement('strong');val.textContent=value;row.append(label,val);container.appendChild(row);});}
$('backToDetails').addEventListener('click',()=>{showBooking('travellerForm',3);resetSession();});
$('confirmDemo').addEventListener('click',()=>{clearTimeout(state.sessionTimer);clearTimeout(state.sessionExpiryTimer);show($('sessionNotice'),false);showBooking('confirmationPanel',4);});
$('startOver').addEventListener('click',()=>{showBooking('bookingEmpty',1);$('home').scrollIntoView({behavior:'smooth'});});
$('extendSession').addEventListener('click',()=>{resetSession();announce('Demo session extended. Your progress is preserved.');});

// Client-only contact form. No entered details are transmitted or persisted.
$('contactForm').addEventListener('submit',(event)=>{event.preventDefault();const form=$('contactForm'),feedback=$('contactFeedback');feedback.classList.remove('error');const inputs=['contactName','contactEmail','contactTopic','contactMessage'].map($);const invalid=inputs.find((input)=>!input.value.trim()||!input.checkValidity());if(invalid){feedback.classList.add('error');feedback.textContent='Please complete all fields correctly. Your message must contain at least 10 characters.';invalid.focus();return;}feedback.textContent='Message received in this demonstration. No information was sent or saved.';form.reset();});
