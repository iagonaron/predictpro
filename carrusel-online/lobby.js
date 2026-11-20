(function(){
'use strict';

/* ============================================================================
   C1 · CARRUSEL ONLINE (elemental) — código propio de esta página
   ============================================================================ */
const SB='https://woiptkyrxkbpnvioypit.supabase.co';
const KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvaXB0a3lyeGticG52aW95cGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NzI2ODYsImV4cCI6MjA5MjA0ODY4Nn0.B2nKgj5rD0rkdLeMIrd9KgD8lUPWsBT4Y7aCtmnvbjA';
const QS=new URLSearchParams(location.search);
let SALTO=Number(QS.get('salto'))||0;              // solo para probar deprisa (desplaza el reloj de ESTA pantalla)
window.__coSalto=v=>{ SALTO=v; };
const SV=(d,x)=>'<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">'+d+'</svg>';
const I={play:SV('<path d="M8 5.5v13l10-6.5z"/>'),cal:SV('<path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>'),spk:SV('<path d="M4 9.5v5h4l5 4v-13l-5 4z"/><path d="M16.5 9a4 4 0 0 1 0 6"/>'),ok:SV('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),x:SV('<path d="M6 6l12 12M18 6L6 18"/>'),cor:SV('<path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>'),per:SV('<circle cx="12" cy="7.5" r="3.6"/><path d="M4.8 20.5c0-4 3.2-7.1 7.2-7.1s7.2 3.1 7.2 7.1"/>')};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function pintaPiano(){ const p=document.getElementById('estPiano'); const e=PCOnline.piano(); if(p) p.textContent=e==='listo'?'♪ Piano listo':(e==='error'?'♪ Sin piano de muestras (suena uno sencillo)':(e==='cargando'?'♪ Cargando el piano…':'')); }

/* ---------- cuenta (la misma que usa el portal GE) ---------- */
function cuentaId(){
  try{ const s=JSON.parse(localStorage.getItem('lmpro_session')||'null'); if(s&&s.id&&s.estado==='validado') return s.id; }catch(e){}
  try{ const m=document.cookie.match(/(?:^|;\s*)lm_cta_gp=([0-9a-fA-F-]{36})/); if(m) return m[1]; }catch(e){}
  return null;
}
const CUENTA=cuentaId();
/* apertura (19-nov-2026, Iago): elemental desde el viernes 20-nov a las 17:30 (cambiado el 20-nov 08:40; antes 19:00); el servidor también lo impide. Tester/Protester siempre. */
const ABRE=Date.parse('2026-11-24T20:00:00+01:00'), ABRE_TXT='el martes 24 de noviembre a las 20:00', VIDEO_URL='';
function esTester(){ try{ const s=JSON.parse(localStorage.getItem('lmpro_session')||'null'); return !!(s&&/tester/i.test(String(s.nombre||'')+' '+String(s.apellidos||''))); }catch(e){ return false; } }
/* (19-nov) la apertura la decide el servidor (lista → abierto): así el Tester pasa aunque su nombre de sesión no diga «tester» */
const cerrado=()=>ST.abierto===true?false:(Date.now()<ABRE&&!esTester());
function videoHTML(u){
  if(!u) return '<p class="muted" style="margin:6px 0 0">El vídeo de presentación estará aquí muy pronto.</p>';
  const y=u.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return '<div class="vid">'+(y?'<iframe src="https://www.youtube-nocookie.com/embed/'+y[1]+'?rel=0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>':'<video src="'+esc(u)+'" controls playsinline preload="metadata" poster="'+esc(u.replace(/\.mp4$/,'.jpg'))+'"></video>')+'</div>';
}

/* ---------- red + reloj del servidor ---------- */
let OFF=0, BEST=1e9;
const sNow=()=>Date.now()+OFF+SALTO*1000;
async function rpc(fn,args){
  const t0=Date.now();
  try{
    const r=await fetch(SB+'/rest/v1/rpc/'+fn,{method:'POST',headers:{'Content-Type':'application/json',apikey:KEY,Authorization:'Bearer '+KEY},body:JSON.stringify(args)});
    const j=await r.json();
    if(j&&j.now){ const rtt=Date.now()-t0, off=new Date(j.now).getTime()+rtt/2-Date.now(); if(rtt<=BEST+80){ OFF=off; BEST=Math.min(BEST,rtt); } }
    return j;
  }catch(e){ return {ok:false,error:'red'}; }
}
const cr=(fn,extra)=>rpc('suite_cr_'+fn,Object.assign({p_cuenta:CUENTA},extra||{}));

/* ---------- textos ---------- */
function mmss(s){ s=Math.max(0,Math.ceil(s)); return Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); }
function cuando(iso){
  const d=new Date(iso), hoy=new Date(), mid=x=>{ const y=new Date(x); y.setHours(0,0,0,0); return y.getTime(); };
  const dd=Math.round((mid(d)-mid(hoy))/864e5), hh=d.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
  const dia=dd===0?'hoy':dd===1?'mañana':d.toLocaleDateString('es-ES',{weekday:'long'})+(dd>6?' '+d.getDate()+'/'+(d.getMonth()+1):'');
  return dia+' a las '+hh;
}
function grupoTxt(g){ return g?String(g).replace(/ge$/i,'').toUpperCase().replace(/^(\d)([A-Z])/,'$1.º $2'):''; }
const ESPIRAL=c=>'<svg viewBox="0 0 44 44"><g fill="none" stroke="'+c+'" stroke-linecap="round"><path d="M22 4 a18 18 0 1 0 18 18" stroke-width="3"/><path d="M22 10 a12 12 0 1 1 -12 12" stroke-width="2.4" opacity=".7"/></g><circle cx="40" cy="22" r="3" fill="'+c+'"/></svg>';
const CABECERA='<div class="top"><div class="logo"><div class="lg" id="coLogo"></div><div class="nm"><div class="tt"><span class="car">Carrusel</span><span class="pro">PRO</span><span class="onl">Online</span></div><div class="kick">Grado Profesional</div></div></div><div class="sp"></div><span class="tag" id="estPiano"></span><button class="btn" id="bSonido" title="Comprobar el sonido">'+I.spk+'Probar sonido</button></div>';

/* ---------- ventana de confirmación (estética PreDict) ---------- */
function confirma(titulo,texto,okTxt,noTxt){
  return new Promise(res=>{
    const m=document.createElement('div'); m.className='comodal';
    m.innerHTML='<div class="cm-caja" role="dialog" aria-modal="true"><h3>'+titulo+'</h3><p>'+String(texto).replace(/(perder[áa]s (?:un )?0,\d+ de actitud)/g,'<b class="rojo">$1</b>')+'</p><div class="row"><button class="btn" data-r="0">'+(noTxt||'Mejor no')+'</button><button class="btn pri" data-r="1">'+okTxt+'</button></div></div>';
    raiz.appendChild(m);
    const fin=v=>{ m.remove(); res(v); };
    m.addEventListener('click',e=>{ const b=e.target.closest('button'); if(b) fin(b.dataset.r==='1'); else if(e.target===m) fin(false); });
  });
}
const tarde=p=>p&&p.tipo==='anunciada'&&sNow()>new Date(p.programada).getTime()-5*60e3;

/* ---------- audio: se desbloquea con un clic ---------- */
function audioListo(){ PCOnline.audioListo(); }
function probarSonido(){ PCOnline.probar(); }

/* ============================================================================
   LOBBY Y SALA
   ============================================================================ */
const ST={vista:'lobby', lista:[], partida:null, est:null, aviso:'', errNo:false};
const raiz=document.createElement('div'); raiz.id='co'; raiz.innerHTML='<div id="cab">'+CABECERA+'</div><div class="cowrap" id="app"></div>'; document.body.appendChild(raiz);
const app=raiz.querySelector('#app'), cab=raiz.querySelector('#cab');
try{ cab.querySelector('#coLogo').innerHTML=PCOnline.logo('coLg'); }catch(e){}
cab.querySelector('#bSonido').onclick=()=>probarSonido();
let POLL=null, TIC=null;

function sinCuenta(){
  cab.classList.add('sin-sonido'); app.innerHTML=
    '<div class="card"><h2>Entra primero en el portal</h2><p>Para jugar tienes que haber entrado en el portal de Grado Profesional con tu cuenta. Entra desde el portal y pulsa el botón de Carrusel PRO Online.</p><p><a class="btn pri" style="text-decoration:none;display:inline-block" href="https://gp.lmathome.es/">Ir al portal</a></p></div>';
}

async function arrancaLobby(){
  ST.vista='lobby'; ST.partida=null; ST.est=null; try{ localStorage.removeItem('co_partida'); }catch(e){}
  clearInterval(POLL); clearInterval(TIC);
  await refrescaLista(); pintaLobby();
  POLL=setInterval(async()=>{ if(ST.vista!=='lobby'||document.hidden) return; await refrescaLista(); pintaLobby(); },5000);
  TIC=setInterval(()=>{ if(ST.vista==='lobby') pintaTiempos(); },1000);
}
async function refrescaLista(){
  const r=await cr('lista');
  if(r&&r.ok){ ST.lista=r.partidas||[]; ST.errNo=false; ST.abierto=r.abierto; ST.tester=r.tester; } else ST.errNo=true;
}

function pintaLobby(){
  if(ST.vista!=='lobby') return;
  if(raiz.style.visibility!=='hidden'){ try{ PCOnline.fondoLobby(true); }catch(e){} }   /* con la cuenta atrás de la individual a la vista, no se toca */
  const act=document.activeElement, enInput=act&&act.id==='hora', valorHora=enInput?act.value:null;
  const lista=ST.lista.map(p=>{
    const abierta=p.lobby_abierto, mia=p.soy_creador;
    const quien=mia?I.cor+'Tu partida':esc(p.creador)+' <span class="muted">('+esc(grupoTxt(p.grupo))+')</span>';
    /* (19-nov, Iago) cada monigote con el nombre e inicial del primer apellido, siempre a la vista */
    const nom=p.confirmados||[], mons=n=>'<span class="mon">'+Array.from({length:Math.min(n,8)},(_,i)=>'<span class="m">'+I.per+(nom[i]?'<b>'+esc(nom[i])+'</b>':'')+'</span>').join('')+(n>8?'<i>+'+(n-8)+'</i>':'')+'</span>';
    const conf=Math.max(0,(p.apuntados||0)-1), confTxt=conf===0?'sin confirmados todavía':mons(conf);
    const cabecera=abierta
      ? '<span class="dot live"></span>Abierta ahora'
      : '<span class="dot nar"></span>Anunciada';
    const cancel=p.anfitrion_cancelo?' <span class="chip">sin anfitrión</span>':'';
    const resp=p.yo;
    const botones=abierta
      ? '<button class="btn pri" data-a="entrar" data-id="'+p.id+'">Unirme</button>'
      : mia ? (p.anfitrion_cancelo?'<span class="muted">La cancelaste</span>':'<button class="btn ko" data-a="cancelar" data-id="'+p.id+'">'+I.x+'Cancelar partida</button>')
      : '<button class="btn pri'+(resp==='si'?' sel':'')+'" data-a="si" data-id="'+p.id+'">'+(resp==='si'?I.ok+'Me apunto':'Me apunto')+'</button>'+
        (resp==='quiza'?'':'<button class="btn peq" data-a="'+(resp==='si'?'no':'quiza')+'" data-id="'+p.id+'" title="'+(resp==='si'?'Quitarme de la partida':'Marcar como visto')+'">'+I.x+'</button>');
    return '<div class="partida'+(mia?' mia':'')+'"><div class="info"><div class="quien">'+quien+cancel+'</div>'+
      '<div class="cuando">'+cabecera+' · <span data-t="'+p.programada+'">'+cuando(p.programada)+'</span></div>'+
      '<div class="cuando">'+(mia?confTxt:(conf?mons(conf):'nadie apuntado todavía'))+(p.dentro>0?' · '+p.dentro+' en el lobby':'')+'</div></div>'+
      '<div class="row">'+botones+'</div></div>';
  }).join('');
  app.innerHTML=
    (ST.aviso?'<div class="banner">'+esc(ST.aviso)+'</div>':'')+
    (ST.errNo?'<div class="banner ko">No consigo conectar con el servidor. Reintento solo.</div>':'')+
    (cerrado()?'<div class="card solo"><h2>Muy pronto</h2><p class="muted" style="margin-top:0">El carrusel online estará disponible <b style="color:#fff">'+ABRE_TXT+'</b>. Te lo explico en clase; mientras, puedes ver el vídeo.</p>'+videoHTML(VIDEO_URL)+'</div>':
    ST.solo?'<div class="card solo"><h2>Partida individual</h2><p class="muted" style="margin-top:0">Pon el volumen y pulsa «Empezar»: juegas tú solo, ahora mismo. Son unos 10 minutos y seis partes, en orden sorpresa.</p><div class="row"><button class="btn pri gr" id="bSolo">'+I.play+'Empezar</button><button class="btn" id="bNoSolo">Ver partidas anunciadas</button></div></div>':
    '<div class="cols"><div class="card"><h2>Anunciar partida</h2><p class="muted" style="margin-top:0">Elige día y hora. <b style="color:#fff">Serás el anfitrión</b><span class="meg">'+I.cal+'</span></p><div class="row"><label class="fh'+(ST.hora?'':' vacio')+'"><input type="datetime-local" id="hora" min="'+minHora()+'" value="'+esc(ST.hora||'')+'"><span class="ph"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>Pulsa aquí: elige día y hora</span></label><button class="btn pri" id="bAnunciar"'+(ST.hora?'':' disabled')+'>'+I.cal+'Anunciar</button></div></div>'+
    '<div class="card"><h2>Partida individual</h2><p class="muted" style="margin-top:0">Empieza una partida tú solo, ahora mismo.</p><button class="btn" id="bAhora">'+I.play+'Jugar ahora</button></div></div>'+
    '<div class="card"><h2>Partidas anunciadas</h2>'+(lista||'<p class="muted" style="margin:6px 0">Ahora mismo no hay ninguna. ¡Anuncia tú la primera!</p>')+'</div>')+
    (ST.solo||cerrado()?'':'<p class="muted" style="font-size:13px">Cada partida dura unos 10 minutos y tiene seis partes, en orden sorpresa. Si la terminas, su tiempo se suma a tu actitud (mismos topes de siempre).</p>');
  if(enInput){ const h=document.getElementById('hora'); if(h&&valorHora) h.value=valorHora; }
  enlaza();
}
function minHora(){ const d=new Date(Date.now()+11*6e4); return new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,16); }
function pintaTiempos(){ /* los textos de «cuándo» no cambian cada segundo; reservado */ }

function enlaza(){
  pintaPiano();
  const solo=async(bt)=>{ audioListo(); bt.disabled=true; raiz.style.visibility='hidden'; try{ PCOnline.previa(10); }catch(e){} const r=await cr('crear');
    if(r&&r.ok){ ST.soloId=r.id; if(ST.tester) ST.bots=r.id; await cr('empezar',{p_partida:r.id,p_duracion:700}); ST.solo=false; await entraEnSala(r.id); }
    else { raiz.style.visibility=''; try{ PCOnline.fondoLobby(true); }catch(e){} ST.aviso=r&&r.error==='aun_no'?'El carrusel online se abre '+ABRE_TXT+'.':r&&r.error==='ya_tienes_una'?'Ya tienes una partida abierta: espera a que termine.':'No he podido empezar la partida.'; bt.disabled=false; pintaLobby(); } };
  const ah=document.getElementById('bAhora'); if(ah) ah.onclick=()=>solo(ah);
  const bso=document.getElementById('bSolo'); if(bso) bso.onclick=()=>solo(bso);
  const bns=document.getElementById('bNoSolo'); if(bns) bns.onclick=()=>{ ST.solo=false; pintaLobby(); };
  const hi=document.getElementById('hora'), ban=document.getElementById('bAnunciar');
  if(hi&&ban){ hi.oninput=hi.onchange=()=>{ ST.hora=hi.value; ban.disabled=!hi.value; hi.parentNode.classList.toggle('vacio',!hi.value); };
    hi.onclick=()=>{ try{ if(hi.showPicker) hi.showPicker(); }catch(e){} }; }
  const an=document.getElementById('bAnunciar'); if(an) an.onclick=async()=>{
    const v=(document.getElementById('hora')||{}).value; if(!v) return;
    const d=new Date(v);
    if(!await confirma('¿Anunciar esta partida?','Será '+cuando(d.toISOString())+' y serás el anfitrión. Si alguien se apunta y luego no asistes, perderás 0,25 de actitud. Puedes evitarlo cancelando la partida hasta 5 minutos antes de su inicio.','Sí, anunciar')) return;
    an.disabled=true;
    const r=await cr('crear',{p_programada:d.toISOString()});
    if(r&&r.ok){ ST.aviso='Partida anunciada para '+cuando(d.toISOString())+'.'; ST.hora=''; await refrescaLista(); }
    else ST.aviso=r&&r.error==='aun_no'?'El carrusel online se abre '+ABRE_TXT+'.':r&&r.error==='hora'?'La hora debe estar entre 10 minutos y 14 días desde ahora.':'No he podido anunciar la partida.';
    pintaLobby();
  };
  app.querySelectorAll('button[data-a]').forEach(bt=>bt.onclick=async()=>{
    const a=bt.dataset.a, id=bt.dataset.id, P=ST.lista.find(x=>x.id===id);
    if(a==='si'&&P&&P.tipo==='anunciada'&&P.yo!=='si'){ if(!await confirma('¿Estás seguro?','Si luego no asistes, perderás 0,1 de actitud. Puedes evitarlo quitándote de la partida hasta 5 minutos antes de que empiece.','Sí, me apunto')) return; }
    if((a==='no'||a==='quiza')&&P&&P.yo==='si'&&!P.soy_creador&&tarde(P)){ if(!await confirma('Ya es tarde para quitarte','Quitarte ahora cuenta como no asistir: perderás 0,1 de actitud. ¿Quieres quitarte igualmente?','Sí, quitarme','No, me quedo')) return; }
    if(a==='cancelar'&&P){
      const pen=tarde(P)&&(P.apuntados||0)>1;
      if(!await confirma(pen?'Cancelar ahora cuenta como no asistir':'¿Cancelar tu partida?',pen?'Hay gente apuntada y faltan menos de 5 minutos: perderás 0,25 de actitud. ¿Cancelar igualmente?':(tarde(P)?'No pierdes actitud porque no hay nadie apuntado.':'No pierdes actitud porque faltan más de 5 minutos.'),'Sí, cancelar','No, la mantengo')) return;
      bt.disabled=true; const r=await cr('cancelar',{p_partida:id}); ST.aviso=r&&r.ok?'Has cancelado la partida.':'No he podido cancelar la partida.'; await refrescaLista(); pintaLobby(); return;
    }
    bt.disabled=true;
    if(a==='entrar'){ audioListo(); const r=await cr('entrar',{p_partida:id}); if(r&&r.ok) await entraEnSala(id); else { ST.aviso='No he podido entrar: la partida ya no está abierta.'; await refrescaLista(); pintaLobby(); } return; }
    await cr('apuntar',{p_partida:id,p_resp:a}); await refrescaLista(); pintaLobby();
  });
}

/* ---------- sala ---------- */
async function entraEnSala(id){
  ST.vista='sala'; ST.partida=id; ST.aviso='';
  try{ localStorage.setItem('co_partida',id); }catch(e){}
  clearInterval(POLL); clearInterval(TIC);
  await refrescaSala(); pintaSala();
  POLL=setInterval(async()=>{ if(ST.vista!=='sala'||document.hidden) return; await refrescaSala(); pintaSala(); },2000);
  TIC=setInterval(()=>{ if(ST.vista==='sala') pintaSalaTiempos(); },500);
}
async function refrescaSala(){
  const r=await cr('estado',{p_partida:ST.partida});
  if(!r||!r.ok){ ST.salaErr=true; return; }
  ST.salaErr=false; ST.est=r;
  const p=r.p, yo=(r.jugadores||[]).find(j=>j.yo);
  if(p.estado==='en_juego' && yo && yo.dentro){ clearInterval(POLL); clearInterval(TIC); empiezaJuego(r); return; }
  if(p.estado==='terminada' || (p.estado==='en_juego' && !(yo&&yo.dentro))){ ST.aviso=p.estado==='terminada'?'La partida ha terminado.':'La partida ya ha empezado.'; arrancaLobby(); }
}
function pintaSala(){
  if(ST.vista!=='sala'||!ST.est) return;
  if(raiz.style.visibility!=='hidden'){ try{ PCOnline.fondoLobby(true); }catch(e){} }   /* con la cuenta atrás de la individual a la vista, no se toca */
  const e=ST.est, p=e.p, js=e.jugadores||[];
  const dentro=js.filter(j=>j.dentro), pend=js.filter(j=>!j.dentro&&j.resp==='si');
  const hostDentro=p.anfitrion_id && dentro.some(j=>j.id===p.anfitrion_id);
  const chips=dentro.map(j=>'<span class="chip'+(j.yo?' yo':'')+(j.id===p.anfitrion_id?' host':'')+'">'+(j.id===p.anfitrion_id?I.cor:'')+esc(j.nombre)+' <span class="muted">'+esc(grupoTxt(j.grupo))+'</span></span>').join('');
  const chipsP=pend.map(j=>'<span class="chip pend">'+esc(j.nombre)+' · '+'apuntado'+'</span>').join('');
  let banner='';
  if(p.anfitrion_cancelo && !p.anfitrion){
    banner='<div class="banner ko"><b>El anfitrión ha cancelado la partida</b><br>Se puede jugar igualmente. <button class="btn pri" id="bHeredar" style="margin-left:6px">¿Quieres ser el anfitrión?</button> <span class="muted">Podrás empezar cuando quieras; si no, empezará sola.</span></div>';
  } else if(!hostDentro && p.anfitrion && new Date(p.programada).getTime()<=sNow()){
    banner='<div class="banner ko"><b>El anfitrión todavía no ha llegado</b><br>La partida empieza sola en <span id="cuentaAuto" class="grande" style="font-size:26px"></span></div>';
  }
  const anfNombre=p.anfitrion?esc(p.anfitrion):'sin anfitrión';
  app.innerHTML=banner+
    '<div class="card"><h2>Partida de '+esc(p.creador)+' <span class="muted">('+esc(grupoTxt(p.grupo))+')</span></h2>'+
    '<div class="row" style="justify-content:space-between"><div><div class="muted">Empieza '+esc(cuando(p.programada))+' · '+(p.anfitrion?I.cor:'')+'<b>'+anfNombre+'</b></div>'+
    '<div style="margin-top:6px">Empieza sola en <span id="cuentaAuto2" class="grande" style="font-size:30px"></span></div></div>'+
    '<div class="row">'+(p.soy_anfitrion?'<button class="btn pri" id="bEmpezar">'+I.play+'Empezar ya</button><button class="btn ko" id="bCancelar">Cancelar partida</button>':'')+
    '<button class="btn" id="bSalir">← Salir</button></div></div></div>'+
    '<div class="card"><h2>En el lobby ('+dentro.length+')</h2><div>'+(chips||'<span class="muted">Nadie todavía.</span>')+'</div>'+
    (chipsP?'<h2 style="margin-top:12px">Apuntados que aún no han entrado</h2><div>'+chipsP+'</div>':'')+'</div>'+
    '<p class="muted" style="font-size:13px">Cuando empiece, todos oís lo mismo a la vez. Pon el volumen y no cierres esta pestaña.</p>';
  enlaza();
  const bh=document.getElementById('bHeredar'); if(bh) bh.onclick=async()=>{ bh.disabled=true; await cr('heredar',{p_partida:ST.partida}); await refrescaSala(); pintaSala(); };
  const be=document.getElementById('bEmpezar'); if(be) be.onclick=async()=>{ be.disabled=true; audioListo(); await cr('empezar',{p_partida:ST.partida,p_duracion:700}); await refrescaSala(); pintaSala(); };
  const bc=document.getElementById('bCancelar'); if(bc) bc.onclick=async()=>{
    const otros=((ST.est&&ST.est.jugadores)||[]).filter(j=>!j.yo&&j.resp==='si').length, pen=tarde(p)&&otros>0;
    const ok=await confirma(pen?'Cancelar ahora cuenta como no asistir':'¿Cancelar la partida?',pen?'Hay gente apuntada: perderás 0,25 de actitud por cancelar con menos de 5 minutos de margen. ¿Cancelar la partida igualmente?':'No pierdes actitud. Los demás podrán seguir si alguien quiere ser anfitrión.','Sí, cancelar','No, sigo');
    if(!ok) return;
    await cr('cancelar',{p_partida:ST.partida}); ST.aviso='Has cancelado la partida.'; arrancaLobby();
  };
  const bs=document.getElementById('bSalir'); if(bs) bs.onclick=async()=>{ await cr('salir',{p_partida:ST.partida}); arrancaLobby(); };
  pintaSalaTiempos();
}
function pintaSalaTiempos(){
  const e=ST.est; if(!e) return;
  const rest=(new Date(e.p.auto).getTime()-sNow())/1000;
  ['cuentaAuto','cuentaAuto2'].forEach(id=>{ const n=document.getElementById(id); if(n) n.textContent=rest>0?mmss(rest):'ya'; });
  if(rest<=1.5 && rest>-3) refrescaSala().then(pintaSala);
}


/* ---------- la partida: la lleva el motor del carrusel (guiado-online.js) ---------- */
function avisoSonido(){
  setTimeout(()=>{ try{ if(!PCOnline.audioBloqueado()) return; }catch(e){ return; }
    if(document.getElementById('coSonido')) return;
    const d=document.createElement('div'); d.id='coSonido';
    d.innerHTML=I.spk+'Pulsa en cualquier sitio para activar el sonido';
    d.style.cssText='position:fixed;left:50%;top:18px;transform:translateX(-50%);z-index:2147483646;display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:10px;background:#fff;color:#1a1238;font:800 15px/1 "Helvetica Neue",Arial,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.45);pointer-events:none';
    document.body.appendChild(d);
  },400);
}
['pointerdown','keydown','touchstart','touchend','click','pointerup'].forEach(ev=>document.addEventListener(ev,()=>{ try{ audioListo(); }catch(e){} const d=document.getElementById('coSonido'); if(d) d.remove(); },true));
function empiezaJuego(est){
  const p=est.p; clearInterval(POLL); clearInterval(TIC); ST.vista='juego';
  raiz.style.display='none'; raiz.style.visibility='';
  try{ localStorage.setItem('co_partida',p.id); }catch(e){}
  PCOnline.jugar({id:p.id,inicio:new Date(p.inicio).getTime(),semilla:p.semilla,now:sNow,cr:cr,est:est,
    bots:(ST.tester&&ST.bots===p.id)?8:0, solo:ST.soloId===p.id,   /* (19-nov, Iago) el Tester juega su partida individual con 8 compañeros inventados */
    /* (19-nov) sin pings: la actitud se apunta al terminar la partida (suite_cr_actividad) */
    onFin:(act)=>{ try{ localStorage.removeItem('co_partida'); }catch(e){} raiz.style.display=''; arrancaLobby(); muestraActitud(act); }});
  avisoSonido();
}
/* (19-nov 21:05, Iago) al volver al lobby, cuánto has ganado de actitud con esta partida */
async function muestraActitud(p){
  let r=null; try{ r=p?await p:null; }catch(e){}
  const v=document.getElementById('coAct'); if(v) v.remove();
  const d=document.createElement('div'); d.id='coAct';
  let t;
  if(r&&r.ok&&r.practicas) t='<b>Partida terminada</b><span>Cuenta de prácticas: no suma actitud</span>';
  else if(r&&r.ok){ const m=Math.max(1,Math.round((r.segundos||0)/60)); t='<b>Tus '+m+' minutos trabajados ya han llegado a Iago</b><span>para que los valide en tu actitud</span>'; }   /* (19-nov 21:35, Iago) */
  else if(r&&r.error==='sin_terminar') t='<b>Esta vez no suma actitud</b><span>Para sumar, juega hasta la cadencia final</span>';
  else t='<b>Partida terminada</b><span>No se ha podido comprobar la actitud</span>';
  d.innerHTML='<div class="ic">'+(r&&r.ok&&!r.practicas?'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>':'·')+'</div><div class="tx">'+t+'</div><button aria-label="Cerrar">✕</button>';
  d.querySelector('button').onclick=()=>d.remove();
  raiz.appendChild(d); setTimeout(()=>d.classList.add('on'),30); setTimeout(()=>{ d.classList.remove('on'); setTimeout(()=>d.remove(),500); },9000);
}
/* (19-nov 21:05, Iago: «el lobby está muy desaprovechado, todo súper arriba») centrado en vertical y a escala de la pantalla */
function ajustaLobby(){ const z=Math.max(1,Math.min(1.5,innerWidth/1100,innerHeight/720)); raiz.style.setProperty('--z',z.toFixed(3)); }
addEventListener('resize',ajustaLobby); ajustaLobby();
window.LobbyOnline={ arranca:async function(){
  document.documentElement.classList.add('co-on');
  if(!CUENTA){ sinCuenta(); return; }
  if(QS.get('solo')==='1'){ raiz.style.visibility='hidden'; try{ PCOnline.previa(10); }catch(e){} }   /* (19-nov 22:31) la cuenta atrás desde el primer instante */
  { const r0=await cr('lista'); if(r0&&r0.ok){ ST.abierto=r0.abierto; ST.tester=r0.tester; } }
  if(QS.get('solo')==='1'&&!cerrado()){
    try{ history.replaceState(null,'',location.pathname); }catch(e){}
    raiz.style.visibility='hidden';   /* (19-nov 22:24, Iago) de «Jugar ahora» directo a la cuenta atrás, sin ver el lobby */
    audioListo(); const r=await cr('crear');
    if(r&&r.ok){ ST.soloId=r.id; if(ST.tester) ST.bots=r.id; await cr('empezar',{p_partida:r.id,p_duracion:700}); await entraEnSala(r.id); return; }
    raiz.style.visibility=''; try{ PCOnline.fondoLobby(true); }catch(e){}
    ST.aviso=r&&r.error==='ya_tienes_una'?'Ya tienes una partida abierta: espera a que termine.':'No he podido empezar la partida individual.';
  }
  if(QS.get('solo')==='1'&&raiz.style.visibility==='hidden'&&ST.vista!=='juego'&&!ST.soloId){ raiz.style.visibility=''; try{ PCOnline.fondoLobby(true); }catch(e){} }
  const QP=QS.get('p');
  if(QP&&/^[0-9a-f-]{36}$/i.test(QP)){
    try{ history.replaceState(null,'',location.pathname); }catch(e){}
    if(QS.get('e')==='1'){ const r0=await cr('entrar',{p_partida:QP}); if(r0&&r0.ok){ try{ localStorage.setItem('co_partida',QP); }catch(e){} } }
    else { try{ localStorage.setItem('co_partida',QP); }catch(e){} }
  }
  let id=null; try{ id=localStorage.getItem('co_partida'); }catch(e){}
  if(id){
    const r=await cr('estado',{p_partida:id});
    if(r&&r.ok){ const p=r.p, yo=(r.jugadores||[]).find(j=>j.yo);
      if(yo&&yo.dentro&&(p.estado==='abierta'||p.estado==='en_juego')){ if(p.estado==='en_juego'){ empiezaJuego(r); return; } await entraEnSala(id); return; } }
    try{ localStorage.removeItem('co_partida'); }catch(e){}
  }
  arrancaLobby();
}};

})();
