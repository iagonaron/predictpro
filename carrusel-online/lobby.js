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
const ABRE=Date.parse('2026-11-24T20:00:00+01:00'), ABRE_TXT='el martes 24 de noviembre a las 20:00', VIDEO_URL=/(^|\.)gp\.lmathome\.es$/i.test(location.hostname)?'':'https://gp.lmathome.es/piel/carrusel/carrusel-online-ge.mp4?v=4';   /* (20-nov-2026 12:58, Iago) el tráiler, con un botón discreto «Ver vídeo» */
  /* (20-nov-2026, Iago) Selector propio de DÍA y HORA para anunciar partidas (el mismo en ordenador, iPad y móvil):
     calendario del mes con los días pasados apagados y HOY marcado; la hora con DOS RUEDAS verticales como en el iPhone
     (horas 8–22 y minutos de 5 en 5), que se arrastran con el dedo o el ratón, giran con la rueda del ratón o se tocan.
     Solo deja elegir desde dentro de 10 minutos hasta 14 días (lo mismo que exige el servidor).
     lmSelFecha(valor 'AAAA-MM-DDTHH:MM' o '', alElegir(valor)) */
  var LMF_MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var LMF_DIA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  function lmfDos(n) { return (n < 10 ? '0' : '') + n; }
  function lmfTexto(v) {
    if (!v) return '';
    var d = new Date(v); if (isNaN(d)) return '';
    return LMF_DIA[d.getDay()].slice(0, 3) + ' ' + d.getDate() + ' ' + LMF_MES[d.getMonth()].slice(0, 3) + ' · ' + lmfDos(d.getHours()) + ':' + lmfDos(d.getMinutes());
  }
  var LMF_IH = 34;   /* alto de cada fila de las ruedas (se ven 5) */
  function lmfCss() {
    if (document.getElementById('lmf-css')) return;
    var s = document.createElement('style'); s.id = 'lmf-css';
    s.textContent =
      '.lmfcapa{position:fixed!important;inset:0!important;z-index:2147483647!important;background:rgba(4,6,14,.55);display:flex;align-items:center;justify-content:center;font-family:"Helvetica Neue",Arial,sans-serif;-webkit-tap-highlight-color:transparent}' +
      '.lmf{width:min(392px,94vw);max-height:96vh;overflow:auto;box-sizing:border-box;padding:18px 18px 16px;border-radius:16px;background:#16122c;border:1px solid rgba(255,255,255,.18);box-shadow:0 24px 70px rgba(0,0,0,.55);color:#fff}' +
      '.lmf h3{margin:0 0 12px;font-size:18px;font-weight:800;letter-spacing:.01em}' +
      '.lmf .mes{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}.lmf .mes b{font-size:16px;font-weight:800;text-transform:capitalize}' +
      '.lmf .mes button{width:34px;height:34px;border-radius:9px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.06);color:#fff;font-size:18px;cursor:pointer}.lmf .mes button:disabled{opacity:.25;cursor:default}' +
      '.lmf .sem,.lmf .dias{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.lmf .sem span{text-align:center;font-size:12px;font-weight:800;color:rgba(255,255,255,.55);padding:2px 0 4px}' +
      '.lmf .dias button{position:relative;height:38px;border-radius:9px;border:1px solid transparent;background:rgba(255,255,255,.07);color:#fff;font-size:15px;font-weight:700;cursor:pointer;padding:0}' +
      '.lmf .dias button:disabled{background:transparent;color:rgba(255,255,255,.22);cursor:default}.lmf .dias i{visibility:hidden}' +
      '.lmf .dias button.hoy{border-color:#ffd23f}.lmf .dias button.hoy::after{content:"hoy";position:absolute;left:0;right:0;bottom:1px;font-size:9px;font-weight:800;color:#ffd23f;line-height:1}' +
      '.lmf .dias button.sel{background:#ffd23f;color:#1b1406}.lmf .dias button.sel::after{color:#1b1406}' +
      '.lmf .et{margin:14px 0 6px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.6)}' +
      /* ruedas */
      '.lmf .ruedas{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:14px}' +
      '.lmf .rd{position:relative;width:96px;height:' + (5 * LMF_IH) + 'px;overflow:hidden;touch-action:none;cursor:grab;outline:none;border-radius:12px;background:rgba(255,255,255,.04);-webkit-user-select:none;user-select:none;' +
        '-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 34%,#000 66%,transparent 100%);mask-image:linear-gradient(to bottom,transparent 0,#000 34%,#000 66%,transparent 100%)}' +
      '.lmf .rd:active{cursor:grabbing}' +
      '.lmf .rd::before{content:"";position:absolute;left:5px;right:5px;top:' + (2 * LMF_IH) + 'px;height:' + LMF_IH + 'px;box-sizing:border-box;border-radius:9px;background:rgba(255,210,63,.18);border:1px solid rgba(255,210,63,.85);pointer-events:none}' +
      '.lmf .rd .tira{position:absolute;left:0;right:0;top:0;will-change:transform}' +
      '.lmf .rd .it{height:' + LMF_IH + 'px;line-height:' + LMF_IH + 'px;text-align:center;font-size:21px;font-weight:700;color:#fff;font-variant-numeric:tabular-nums;transform-origin:50% 50%}' +
      '.lmf .rd .it.no{color:rgba(255,255,255,.28)}.lmf .rd .it.c{color:#ffe28a;font-weight:800}' +
      '.lmf .dp{font-size:24px;font-weight:800;color:#ffe28a;margin-top:-3px}' +
      '.lmf .rdl{display:flex;justify-content:center;gap:8px;margin-top:4px}.lmf .rdl span{width:96px;text-align:center;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.45)}.lmf .rdl i{width:10px}' +
      '.lmf .pie{display:flex;align-items:center;gap:10px;margin-top:16px}.lmf .pie .res{flex:1;font-size:14px;font-weight:700;color:#ffe28a;min-width:0}' +
      '.lmf .pie button{height:38px;padding:0 16px;border-radius:10px;font-weight:800;font-size:14px;cursor:pointer;border:1px solid rgba(255,255,255,.3);background:transparent;color:#fff}' +
      '.lmf .pie button.ok{background:#fff;color:#16122c;border-color:#fff}.lmf .pie button.ok:disabled{opacity:.35;cursor:default}' +
      '@media (hover:hover){.lmf .dias button:not(:disabled):not(.sel):hover{background:rgba(255,210,63,.22)}}';
    document.head.appendChild(s);
  }
  /* una rueda: vals (números), idx inicial, fmt(v), vale(i) → si se puede elegir, alCambiar(i) al encajar */
  function lmfRueda(el, vals, idx, fmt, vale, alCambiar) {
    var IH = LMF_IH, pos = idx, n = vals.length, tira = el.querySelector('.tira'), anim = null, its = [];
    tira.innerHTML = vals.map(function (v, i) { return '<div class="it" data-i="' + i + '">' + fmt(v) + '</div>'; }).join('');
    its = Array.prototype.slice.call(tira.children);
    function marca() { its.forEach(function (it, i) { it.classList.toggle('no', !vale(i)); }); }
    function pinta() {
      tira.style.transform = 'translateY(' + ((2 - pos) * IH).toFixed(2) + 'px)';
      for (var i = 0; i < n; i++) {
        var d = Math.abs(i - pos); if (d > 3.2) continue;
        its[i].style.transform = 'perspective(260px) rotateX(' + (Math.max(-3, Math.min(3, i - pos)) * -16).toFixed(1) + 'deg) scale(' + (1 - Math.min(d, 2.5) * 0.06).toFixed(3) + ')';
        its[i].style.opacity = String(Math.max(0.3, 1 - d * 0.22).toFixed(2));
        its[i].classList.toggle('c', d < 0.5);
      }
    }
    function cerca(i) {   /* el elegible más cercano */
      i = Math.max(0, Math.min(n - 1, i)); if (vale(i)) return i;
      for (var k = 1; k < n; k++) { if (i + k < n && vale(i + k)) return i + k; if (i - k >= 0 && vale(i - k)) return i - k; }
      return i;
    }
    function para() { if (anim) { cancelAnimationFrame(anim); anim = null; } }
    function ir(dest, ms) {
      para(); dest = cerca(Math.round(dest)); var p0 = pos, t0 = null, dur = ms || Math.min(650, 220 + Math.abs(dest - p0) * 45);
      function paso(t) { if (t0 === null) t0 = t; var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        pos = p0 + (dest - p0) * e; pinta(); if (k < 1) anim = requestAnimationFrame(paso); else { anim = null; pos = dest; pinta(); idx = dest; alCambiar(dest); } }
      anim = requestAnimationFrame(paso);
    }
    var arr = null;
    el.addEventListener('pointerdown', function (e) {
      para(); try { el.setPointerCapture(e.pointerId); } catch (_) {}
      arr = { y0: e.clientY, p0: pos, ys: [[e.timeStamp, e.clientY]], mov: 0, sc: el.getBoundingClientRect().height / el.offsetHeight || 1 }; e.preventDefault();
    });
    el.addEventListener('pointermove', function (e) {
      if (!arr) return; var dy = (e.clientY - arr.y0) / arr.sc; arr.mov = Math.max(arr.mov, Math.abs(dy));
      var p = arr.p0 - dy / IH; if (p < 0) p = p * 0.35; if (p > n - 1) p = n - 1 + (p - n + 1) * 0.35;
      pos = p; pinta(); arr.ys.push([e.timeStamp, e.clientY]); if (arr.ys.length > 6) arr.ys.shift();
    });
    function suelta(e) {
      if (!arr) return; var a = arr; arr = null;
      if (a.mov < 5) {   /* toque: va a la fila tocada */
        var r = el.getBoundingClientRect(), yl = (e.clientY - r.top) / a.sc; ir(pos + (yl - 2.5 * IH) / IH); return;
      }
      var f = a.ys[a.ys.length - 1], g = a.ys[0], v = (f[0] > g[0]) ? -((f[1] - g[1]) / a.sc / IH) / (f[0] - g[0]) : 0;   /* filas por ms */
      ir(pos + v * 180);
    }
    el.addEventListener('pointerup', suelta); el.addEventListener('pointercancel', suelta);
    var acum = 0;
    el.addEventListener('wheel', function (e) { e.preventDefault(); acum += e.deltaY;
      var pasos = 0; while (Math.abs(acum) >= 40) { pasos += acum > 0 ? 1 : -1; acum -= (acum > 0 ? 40 : -40); }
      if (pasos) ir(Math.round(anim ? idx : pos) + pasos, 200); }, { passive: false });
    el.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown') { e.preventDefault(); ir(Math.round(pos) + 1, 180); } if (e.key === 'ArrowUp') { e.preventDefault(); ir(Math.round(pos) - 1, 180); } });
    marca(); pinta();
    return { marca: function () { marca(); }, ir: ir, idx: function () { return idx; } };
  }
  function lmSelFecha(valor, alElegir) {
    lmfCss();
    var ahora = new Date(), min = new Date(ahora.getTime() + 10 * 6e4), max = new Date(ahora.getTime() + 14 * 864e5);
    var hoy0 = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    var HORAS = []; for (var h = 8; h <= 22; h++) HORAS.push(h);
    var MINS = []; for (var m5 = 0; m5 < 60; m5 += 5) MINS.push(m5);
    var dia = null, hora, mins;
    /* de partida, la próxima hora posible (redondeada a 5 minutos) */
    var sig = new Date(Math.ceil(min.getTime() / 3e5) * 3e5); hora = sig.getHours(); mins = sig.getMinutes();
    if (hora < 8) { hora = 8; mins = 0; } if (hora > 22) { hora = 22; mins = 55; }
    if (valor) { var v = new Date(valor); if (!isNaN(v)) { dia = new Date(v.getFullYear(), v.getMonth(), v.getDate()); hora = v.getHours(); mins = v.getMinutes() - v.getMinutes() % 5; } }
    var mes = new Date((dia || hoy0).getFullYear(), (dia || hoy0).getMonth(), 1);
    var velo = document.createElement('div'); velo.className = 'lmfcapa';
    function fecha(d, h, m) { return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m); }
    function vale(d, h, m) { var f = fecha(d, h, m); return f >= min && f <= max; }
    function horaVale(d, h) { for (var i = 0; i < MINS.length; i++) if (vale(d, h, MINS[i])) return true; return false; }
    function diaVale(d) { for (var i = 0; i < HORAS.length; i++) if (horaVale(d, HORAS[i])) return true; return false; }
    var RH = null, RM = null;
    function pie() {
      var listo = dia && vale(dia, hora, mins);
      var res = velo.querySelector('.res'), ok = velo.querySelector('.ok');
      if (res) res.textContent = listo ? lmfTexto(fecha(dia, hora, mins)) : (dia ? '' : 'Elige un día');
      if (ok) ok.disabled = !listo;
    }
    function ajusta() {   /* si el día elegido no admite la hora o los minutos, la rueda va a lo más cercano posible */
      if (!dia) return;
      if (!horaVale(dia, hora)) { var hi = HORAS.indexOf(hora), best = null; for (var k = 0; k < HORAS.length; k++) if (horaVale(dia, HORAS[k]) && (best === null || Math.abs(k - hi) < Math.abs(best - hi))) best = k; if (best !== null) hora = HORAS[best]; }
      if (!vale(dia, hora, mins)) { var mi = MINS.indexOf(mins), bm = null; for (var j = 0; j < MINS.length; j++) if (vale(dia, hora, MINS[j]) && (bm === null || Math.abs(j - mi) < Math.abs(bm - mi))) bm = j; if (bm !== null) mins = MINS[bm]; }
    }
    function pinta() {
      var p = new Date(mes), cab = (p.getDay() + 6) % 7, nd = new Date(p.getFullYear(), p.getMonth() + 1, 0).getDate(), t = '';
      for (var i = 0; i < cab; i++) t += '<i></i>';
      for (var d = 1; d <= nd; d++) {
        var f = new Date(p.getFullYear(), p.getMonth(), d), c = '';
        if (f.getTime() === hoy0.getTime()) c += ' hoy';
        if (dia && f.getTime() === dia.getTime()) c += ' sel';
        t += '<button type="button" data-d="' + d + '" class="' + c + '"' + (diaVale(f) ? '' : ' disabled') + '>' + d + '</button>';
      }
      var prevOk = new Date(mes.getFullYear(), mes.getMonth(), 0) >= hoy0, nextOk = new Date(mes.getFullYear(), mes.getMonth() + 1, 1) <= max;
      velo.innerHTML = '<div class="lmf" role="dialog" aria-label="Elige día y hora"><h3>Elige día y hora</h3>' +
        '<div class="mes"><button type="button" data-nav="-1"' + (prevOk ? '' : ' disabled') + ' aria-label="Mes anterior">‹</button><b>' + LMF_MES[mes.getMonth()] + ' ' + mes.getFullYear() + '</b><button type="button" data-nav="1"' + (nextOk ? '' : ' disabled') + ' aria-label="Mes siguiente">›</button></div>' +
        '<div class="sem"><span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span></div><div class="dias">' + t + '</div>' +
        '<div class="ruedas"><div class="rd" data-r="h" tabindex="0" aria-label="Hora"><div class="tira"></div></div><b class="dp">:</b><div class="rd" data-r="m" tabindex="0" aria-label="Minutos"><div class="tira"></div></div></div>' +
        '<div class="rdl"><span>hora</span><i></i><span>min</span></div>' +
        '<div class="pie"><span class="res"></span><button type="button" data-x="1">Cancelar</button><button type="button" class="ok" data-ok="1" disabled>Aceptar</button></div></div>';
      RH = lmfRueda(velo.querySelector('.rd[data-r="h"]'), HORAS, Math.max(0, HORAS.indexOf(hora)), String,
        function (i) { return !dia || horaVale(dia, HORAS[i]); },
        function (i) { hora = HORAS[i]; if (dia && !vale(dia, hora, mins)) { ajusta(); RM.ir(MINS.indexOf(mins)); } RM.marca(); pie(); });
      RM = lmfRueda(velo.querySelector('.rd[data-r="m"]'), MINS, Math.max(0, MINS.indexOf(mins)), lmfDos,
        function (i) { return !dia || vale(dia, hora, MINS[i]); },
        function (i) { mins = MINS[i]; pie(); });
      pie();
    }
    velo.addEventListener('click', function (e) {
      if (e.target === velo) { cerrar(); return; }
      var b = e.target.closest ? e.target.closest('button') : null;
      if (!b || b.disabled) return;
      if (b.dataset.nav) { mes = new Date(mes.getFullYear(), mes.getMonth() + Number(b.dataset.nav), 1); pinta(); }
      else if (b.dataset.d) { dia = new Date(mes.getFullYear(), mes.getMonth(), Number(b.dataset.d)); ajusta(); pinta(); }
      else if (b.dataset.x) { cerrar(); }
      else if (b.dataset.ok) { var f = fecha(dia, hora, mins); cerrar(); alElegir(f.getFullYear() + '-' + lmfDos(f.getMonth() + 1) + '-' + lmfDos(f.getDate()) + 'T' + lmfDos(f.getHours()) + ':' + lmfDos(f.getMinutes())); }
    });
    function cerrar() { if (velo.parentNode) velo.parentNode.removeChild(velo); document.removeEventListener('keydown', tecla, true); }
    function tecla(e) { if (e.key === 'Escape') { e.stopPropagation(); cerrar(); } }
    document.addEventListener('keydown', tecla, true);
    pinta(); document.documentElement.appendChild(velo);
    return velo;
  }
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
  ST.vista='lobby'; ST.partida=null; ST.est=null; ST.salaFirma=''; musicaNo(); dockNo(); try{ localStorage.removeItem('co_partida'); }catch(e){}
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
    const abierta=p.lobby_abierto, mia=p.soy_anfitrion===true||(p.soy_anfitrion===undefined&&p.soy_creador&&!p.anfitrion_cancelo), cancelada=p.soy_creador&&p.anfitrion_cancelo&&!mia;
    /* (20-nov-2026 12:55, Iago) el anfitrión canceló y tú estás apuntado: aviso con «!» y puedes heredarla (tus minutos ×1,5) */
    const sinAnf=p.yo==='si'&&p.anfitrion_cancelo&&!p.anfitrion&&!p.soy_creador&&!abierta;
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
      : cancelada ? '<span class="muted">La cancelaste</span>'
      : mia ? '<button class="btn ko" data-a="cancelar" data-id="'+p.id+'">'+I.x+'Cancelar partida</button>'
      : sinAnf ? '<button class="btn pri" data-a="heredar" data-id="'+p.id+'">'+I.cal+'Ser el anfitrión</button><button class="btn peq" data-a="no" data-id="'+p.id+'" title="Quitarme de la partida">'+I.x+'</button>'
      : '<button class="btn pri'+(resp==='si'?' sel':'')+'" data-a="si" data-id="'+p.id+'">'+(resp==='si'?I.ok+'Me apunto':'Me apunto')+'</button>'+
        (resp==='quiza'?'':'<button class="btn peq" data-a="'+(resp==='si'?'no':'quiza')+'" data-id="'+p.id+'" title="'+(resp==='si'?'Quitarme de la partida':'Marcar como visto')+'">'+I.x+'</button>');
    return '<div class="partida'+(mia?' mia':'')+'"><div class="info"><div class="quien">'+quien+cancel+'</div>'+
      '<div class="cuando">'+cabecera+' · <span data-t="'+p.programada+'">'+cuando(p.programada)+'</span></div>'+
      '<div class="cuando">'+(mia?confTxt:(conf?mons(conf):'nadie apuntado todavía'))+(p.dentro>0?' · '+p.dentro+' en el lobby':'')+'</div>'+
      (sinAnf?'<div class="alerta"><span class="ex">!</span><span><b>El anfitrión ha cancelado.</b> Si heredas tú la partida y te haces anfitrión, los minutos que practiques contarán ×1,5: es el premio por mantenerla viva.</span></div>':'')+'</div>'+
      '<div class="row">'+botones+'</div></div>';
  }).join('');
  app.innerHTML=
    (ST.aviso?'<div class="banner">'+esc(ST.aviso)+'</div>':'')+
    (ST.errNo?'<div class="banner ko">No consigo conectar con el servidor. Reintento solo.</div>':'')+
    (cerrado()?'<div class="card solo"><h2>Muy pronto</h2><p class="muted" style="margin-top:0">El carrusel online estará disponible <b style="color:#fff">'+ABRE_TXT+'</b>. Te lo explico en clase; mientras, puedes ver el vídeo.</p>'+videoHTML(VIDEO_URL)+'</div>':
    ST.solo?'<div class="card solo"><h2>Partida individual</h2><p class="muted" style="margin-top:0">Pon el volumen y pulsa «Empezar»: juegas tú solo, ahora mismo. Son unos 10 minutos y seis partes, en orden sorpresa.</p><div class="row"><button class="btn pri gr" id="bSolo">'+I.play+'Empezar</button><button class="btn" id="bNoSolo">Ver partidas anunciadas</button></div></div>':
    '<div class="cols"><div class="card"><h2>Anunciar partida</h2><p class="muted" style="margin-top:0">Elige día y hora. <b style="color:#fff">Serás el anfitrión</b><span class="meg">'+I.cal+'</span></p><div class="row"><button type="button" class="fh'+(ST.hora?'':' vacio')+'" id="fhBtn"><input type="hidden" id="hora" value="'+esc(ST.hora||'')+'"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg><span class="ph">Elige día y hora</span><span class="vl">'+esc(lmfTexto(ST.hora||''))+'</span></button><button class="btn pri" id="bAnunciar"'+(ST.hora?'':' disabled')+'>'+I.cal+'Anunciar</button></div></div>'+
    '<div class="card"><h2>Partida individual</h2><p class="muted" style="margin-top:0">Empieza una partida tú solo, ahora mismo.</p><button class="btn" id="bAhora">'+I.play+'Jugar ahora</button></div></div>'+
    '<div class="card"><h2>Partidas anunciadas</h2>'+(lista||'<p class="muted" style="margin:6px 0">Ahora mismo no hay ninguna. ¡Anuncia tú la primera!</p>')+'</div>')+
    (ST.solo||cerrado()?'':'<p class="muted" style="font-size:13px">Cada partida dura unos 10 minutos y tiene seis partes, en orden sorpresa. Si la terminas, su tiempo se suma a tu actitud (mismos topes de siempre).'+(VIDEO_URL?' <button type="button" class="btn peq vvb" id="bVid">'+I.play+(ST.vid?'Ocultar vídeo':'Ver vídeo')+'</button>':'')+'</p>'+(ST.vid&&VIDEO_URL?'<div class="card">'+videoHTML(VIDEO_URL)+'</div>':''));
  if(enInput){ const h=document.getElementById('hora'); if(h&&valorHora) h.value=valorHora; }
  enlaza();
  const bv=document.getElementById('bVid'); if(bv) bv.onclick=()=>{ ST.vid=!ST.vid; pintaLobby(); if(ST.vid) setTimeout(()=>{ const v=document.querySelector('#co .vid'); if(v) v.scrollIntoView({behavior:'smooth',block:'center'}); },60); };
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
  const fhb=document.getElementById('fhBtn'); if(hi&&ban&&fhb){ fhb.onclick=()=>lmSelFecha(ST.hora||'',v=>{ ST.hora=v; pintaLobby(); }); }   /* (20-nov, Iago) selector propio de día y hora */
  const an=document.getElementById('bAnunciar'); if(an) an.onclick=async()=>{
    const v=(document.getElementById('hora')||{}).value; if(!v) return;
    const d=new Date(v);
    if(!await confirma('¿Anunciar esta partida?','Será '+cuando(d.toISOString())+' y serás el anfitrión. Si alguien se apunta y luego no asistes, perderás 0,5 de actitud. Puedes evitarlo cancelando la partida hasta 5 minutos antes de su inicio.','Sí, anunciar')) return;
    an.disabled=true;
    const r=await cr('crear',{p_programada:d.toISOString()});
    if(r&&r.ok){ ST.aviso='Partida anunciada para '+cuando(d.toISOString())+'.'; ST.hora=''; await refrescaLista(); }
    else ST.aviso=r&&r.error==='aun_no'?'El carrusel online se abre '+ABRE_TXT+'.':r&&r.error==='hora'?'La hora debe estar entre 10 minutos y 14 días desde ahora.':'No he podido anunciar la partida.';
    pintaLobby();
  };
  app.querySelectorAll('button[data-a]').forEach(bt=>bt.onclick=async()=>{
    const a=bt.dataset.a, id=bt.dataset.id, P=ST.lista.find(x=>x.id===id);
    if(a==='si'&&P&&P.tipo==='anunciada'&&P.yo!=='si'){ if(!await confirma('¿Estás seguro?','Si luego no asistes, perderás 0,25 de actitud. Puedes evitarlo quitándote de la partida hasta 5 minutos antes de que empiece.','Sí, me apunto')) return; }
    if((a==='no'||a==='quiza')&&P&&P.yo==='si'&&!P.soy_creador&&tarde(P)){ if(!await confirma('Ya es tarde para quitarte','Quitarte ahora cuenta como no asistir: perderás 0,25 de actitud. ¿Quieres quitarte igualmente?','Sí, quitarme','No, me quedo')) return; }
    if(a==='cancelar'&&P){
      /* (20-nov 13:58, Iago) sin nadie apuntado, la partida desaparece; con gente, los apuntados reciben el aviso «!» para quedarse de anfitrión (×1,5) */
      const otros=Math.max(0,(P.apuntados||0)-1), pen=tarde(P)&&otros>0, AV='Avisaremos a los apuntados para que uno se quede de anfitrión (sus minutos cuentan ×1,5).';
      if(!await confirma(pen?'Cancelar ahora cuenta como no asistir':'¿Cancelar tu partida?',!otros?'No hay nadie apuntado: la partida desaparece. No pierdes actitud.':(pen?'Hay gente apuntada y faltan menos de 5 minutos: perderás 0,5 de actitud. '+AV+' ¿Cancelar igualmente?':'No pierdes actitud porque faltan más de 5 minutos. '+AV),'Sí, cancelar','No, la mantengo')) return;
      bt.disabled=true; const r=await cr('cancelar',{p_partida:id}); ST.aviso=r&&r.ok?(r.quitada?'Partida cancelada. Como no había nadie apuntado, ya no aparece.':'Has cancelado la partida. Los apuntados ya tienen el aviso para quedarse de anfitrión.'):'No he podido cancelar la partida.'; await refrescaLista(); pintaLobby(); return;
    }
    if(a==='heredar'&&P){   /* (20-nov, Iago) heredar la partida cuyo anfitrión canceló: minutos ×1,5 */
      if(!await confirma('¿Quieres ser el anfitrión?','La partida será tuya: la empiezas tú. Los minutos que practiques en ella contarán ×1,5. Si luego no asistes, perderás 0,5 de actitud.','Sí, seré el anfitrión')) return;
      bt.disabled=true; const r=await cr('heredar',{p_partida:id}); ST.aviso=r&&r.ok?'Ahora eres el anfitrión. Tus minutos en esta partida contarán ×1,5.':'No he podido hacerte anfitrión (puede que otro se haya adelantado).'; await refrescaLista(); pintaLobby(); return;
    }
    bt.disabled=true;
    if(a==='entrar'){ audioListo(); const r=await cr('entrar',{p_partida:id}); if(r&&r.ok) await entraEnSala(id); else { ST.aviso='No he podido entrar: la partida ya no está abierta.'; await refrescaLista(); pintaLobby(); } return; }
    await cr('apuntar',{p_partida:id,p_resp:a}); await refrescaLista(); pintaLobby();
  });
}

/* ---------- sala ---------- */
async function entraEnSala(id){
  ST.vista='sala'; ST.partida=id; ST.aviso=''; ST.dentroAntes=null; ST.salaFirma='';
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
/* (20-nov-2026 16:00, Iago) LOBBY VIVO
   · 5 minutos de cortesía: el anfitrión puede empezar desde la hora en punto (el servidor no deja antes); si no, empieza sola
     a los 5 minutos. Se ve siempre el reloj.
   · «Que se sepa muy claro quiénes son los monigotes que ya están y los que todavía no»: cada apuntado es un monigote; los que
     están dentro, de color, botando y con ✓; los que faltan, en silueta discontinua y «aún no ha llegado». Al entrar alguien,
     su monigote salta, suena una campanita y sale «¡X ha entrado!».
   · Al pulsar «Empezar ya» con apuntados que faltan: «¿Seguro? X e Y quizá aún estén por llegar».
   · Abajo, barra de 10 frases cerradas + 10 emojis (nada de texto libre): salen sobre el monigote de quien los manda.
   · Música en bucle (lobby.mp3, 37 s sin costura) con botón para silenciarla.
   Deshacer: volver a lobby.js.bak40 / lobby.css.bak40 (work/co2) y reconstruir. */
const CO_FRASES=['¡Vaya tardones!','¡Vais a flipar!','Esta ronda gano yo','Estoy en mi prime','¡Os voy a arrasar!','¡Os voy a pulir!','¡Estoy deseando empezar!','Hoy tengo el oído fino','No fallo ni una','¡Que empiece ya!'];
const CO_EMOS=['😊','😎','😂','❤️','💪','👏','🔥','😮','😱','😢'];
const CO_COLS=['#5bd0ff','#ffd23f','#34d399','#ff9a3c','#bd92ff','#ff5fa2','#7dd3fc','#a3e635','#f472b6','#facc15'];
function colDe(id){ let h=0; String(id||'').split('').forEach(c=>{ h=(h*31+c.charCodeAt(0))>>>0; }); return CO_COLS[h%CO_COLS.length]; }
function monigoteSVG(col,fuera){
  if(fuera) return '<svg class="mg" viewBox="0 0 60 64" aria-hidden="true"><circle cx="30" cy="17" r="12" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2" stroke-dasharray="4 3"/><path d="M10 62c0-13 9-22 20-22s20 9 20 22z" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2" stroke-dasharray="4 3"/></svg>';
  return '<svg class="mg" viewBox="0 0 60 64" aria-hidden="true"><circle cx="30" cy="17" r="12" fill="'+col+'"/><path d="M10 62c0-13 9-22 20-22s20 9 20 22z" fill="'+col+'"/><circle cx="25.5" cy="16" r="1.8" fill="#1a1238"/><circle cx="34.5" cy="16" r="1.8" fill="#1a1238"/><path d="M25 21q5 4.2 10 0" stroke="#1a1238" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>';
}
function listaNombres(a){ return a.length<2?(a[0]||''):a.slice(0,-1).join(', ')+' y '+a[a.length-1]; }

/* ---- música del lobby ---- */
const MUS={ac:null,buf:null,src:null,g:null,on:true,carga:null};
try{ MUS.on=localStorage.getItem('co_musica')!=='no'; }catch(e){}
function musAC(){ if(!MUS.ac){ const C=window.AudioContext||window.webkitAudioContext; if(!C) return null; MUS.ac=new C(); MUS.g=MUS.ac.createGain(); MUS.g.gain.value=0; MUS.g.connect(MUS.ac.destination); } return MUS.ac; }
function musCarga(){ if(!MUS.carga) MUS.carga=fetch('lobby.mp3?v=1').then(r=>r.arrayBuffer()).then(a=>new Promise((ok,ko)=>musAC().decodeAudioData(a,ok,ko))).then(b=>(MUS.buf=b)).catch(()=>null); return MUS.carga; }
async function musicaSi(){
  if(!MUS.on||MUS.src||ST.vista!=='sala') return; const ac=musAC(); if(!ac) return;
  try{ if(ac.state!=='running') ac.resume(); }catch(e){}
  const b=await musCarga(); if(!b||MUS.src||!MUS.on||ST.vista!=='sala') return;
  const s=ac.createBufferSource(); s.buffer=b; s.loop=true; s.loopStart=1.0; s.loopEnd=1.0+1628308/44100; s.connect(MUS.g);
  const t=ac.currentTime; MUS.g.gain.cancelScheduledValues(t); MUS.g.gain.setValueAtTime(0,t); MUS.g.gain.linearRampToValueAtTime(0.3,t+2.0);
  s.start(t,1.0); MUS.src=s;
}
function musicaNo(){ const s=MUS.src; if(!s) return; MUS.src=null; try{ const t=MUS.ac.currentTime; MUS.g.gain.cancelScheduledValues(t); MUS.g.gain.setValueAtTime(MUS.g.gain.value,t); MUS.g.gain.linearRampToValueAtTime(0,t+0.8); s.stop(t+0.85); }catch(e){} }
function campanita(){ const ac=MUS.ac; if(!ac||ac.state!=='running') return; const t=ac.currentTime+0.02;
  [[1046.5,0],[1568,0.11]].forEach(([f,d])=>{ const o=ac.createOscillator(), g=ac.createGain(); o.type='sine'; o.frequency.value=f; g.gain.setValueAtTime(0,t+d); g.gain.linearRampToValueAtTime(0.13,t+d+0.01); g.gain.exponentialRampToValueAtTime(0.0008,t+d+0.9); o.connect(g); g.connect(ac.destination); o.start(t+d); o.stop(t+d+1); }); }
['pointerdown','touchend','click','keydown'].forEach(ev=>document.addEventListener(ev,()=>{ const ac=musAC(); if(ac&&ac.state!=='running'){ try{ ac.resume(); }catch(e){} } if(ST.vista==='sala') musicaSi(); },true));

/* ---- barra de frases y emojis + lo que mandan los demás ---- */
let DOCK=null, RXS=null;
function dockSi(){
  if(!DOCK){ DOCK=document.createElement('div'); DOCK.id='coDock';
    DOCK.innerHTML='<div class="fr">'+CO_FRASES.map(f=>'<button type="button" data-f="'+esc(f)+'">'+esc(f)+'</button>').join('')+'</div>'+
      '<div class="em">'+CO_EMOS.map(e=>'<button type="button" data-f="'+e+'">'+e+'</button>').join('')+'</div>';
    raiz.appendChild(DOCK);
    DOCK.addEventListener('click',ev=>{ const b=ev.target.closest('button[data-f]'); if(!b||!ST.partida) return; const f=b.dataset.f;
      const yo=((ST.est&&ST.est.jugadores)||[]).find(j=>j.yo); rxPinta(yo?yo.id:null,yo?yo.nombre:'Tú',f,true);
      b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
      cr('reaccion',{p_partida:ST.partida,p_emoji:f}).catch(()=>{}); });
  }
  DOCK.hidden=false; raiz.classList.add('con-dock');
  if(!RXS){ RXS={desde:0,primera:true};
    RXS.t=setInterval(async()=>{ if(ST.vista!=='sala'||document.hidden) return; try{ const r=await cr('reacciones',{p_partida:ST.partida,p_desde:RXS.desde});
      if(r&&r.ok){ const xs=r.r||[]; xs.forEach((x,i)=>{ RXS.desde=Math.max(RXS.desde,x.id); if(!x.yo&&!RXS.primera) setTimeout(()=>rxPinta(x.cuenta,x.nombre,x.emoji,false),i*220); }); RXS.primera=false; } }catch(e){} },1200); }
}
function dockNo(){ if(DOCK) DOCK.hidden=true; raiz.classList.remove('con-dock'); if(RXS){ clearInterval(RXS.t); RXS=null; } }
const BOCAS={};   /* frases a la vista, para volver a ponerlas si la plaza se redibuja */
function rxPinta(id,nombre,f,yo){
  const esEmo=CO_EMOS.indexOf(f)>=0, mono=id&&app.querySelector('.mono[data-id="'+id+'"]');
  if(!mono){ const d=document.createElement('div'); d.className='rx-suelto'+(esEmo?' emo':''); d.innerHTML=(esEmo?'<span class="e">'+f+'</span>':'<span class="f">'+esc(f)+'</span>')+'<span class="n">'+esc(nombre||'')+'</span>';
    d.style.left=(10+Math.random()*80)+'%'; raiz.appendChild(d); setTimeout(()=>d.remove(),3600); return; }
  if(esEmo){ const e=document.createElement('span'); e.className='emo-sube'; e.textContent=f; e.style.setProperty('--dx',((Math.random()-0.5)*50).toFixed(0)+'px'); mono.appendChild(e); setTimeout(()=>e.remove(),2500); return; }
  const v=mono.querySelector('.boca'); if(v) v.remove();
  const b=document.createElement('div'); b.className='boca'+(yo?' yo':''); b.textContent=f; mono.appendChild(b);
  BOCAS[id]={f,hasta:Date.now()+3600,yo}; setTimeout(()=>{ if(b.parentNode) b.remove(); },3600);
}
function toast(html){ const d=document.createElement('div'); d.className='co-toast'; d.innerHTML=html; raiz.appendChild(d); setTimeout(()=>d.remove(),2800); }

function salaFase(p){ const n=sNow(); return n<new Date(p.programada).getTime()?'antes':(n<new Date(p.auto).getTime()?'cortesia':'ya'); }
function pintaSala(){
  if(ST.vista!=='sala'||!ST.est) return;
  if(raiz.style.visibility!=='hidden'){ try{ PCOnline.fondoLobby(true); }catch(e){} }   /* con la cuenta atrás de la individual a la vista, no se toca */
  const e=ST.est, p=e.p, js=e.jugadores||[], fase=salaFase(p);
  const dentro=js.filter(j=>j.dentro), pend=js.filter(j=>!j.dentro&&j.resp==='si');
  const hostDentro=p.anfitrion_id && dentro.some(j=>j.id===p.anfitrion_id);
  /* quién acaba de llegar (no en el primer pintado) */
  const ids=new Set(dentro.map(j=>j.id)), llegan=new Set();
  if(ST.dentroAntes){ dentro.forEach(j=>{ if(!ST.dentroAntes.has(j.id)&&!j.yo) llegan.add(j.id); }); }
  ST.dentroAntes=ids;
  if(llegan.size){ const nn=dentro.filter(j=>llegan.has(j.id)).map(j=>j.nombre); campanita();
    toast(monigoteSVG(colDe([...llegan][0]))+'<b>¡'+esc(listaNombres(nn))+(nn.length>1?' han entrado!':' ha entrado!')+'</b>'); }
  const firma=JSON.stringify([p.estado,p.anfitrion_id,p.anfitrion_cancelo,p.soy_anfitrion,fase,!!hostDentro,js.map(j=>j.id+':'+(j.dentro?1:0)+(j.resp||''))]);
  dockSi(); musicaSi();
  if(firma===ST.salaFirma && !llegan.size){ pintaSalaTiempos(); return; }
  ST.salaFirma=firma;
  let banner='';
  if(p.anfitrion_cancelo && !p.anfitrion){
    banner='<div class="banner ko"><b>El anfitrión ha cancelado la partida</b><br>Se puede jugar igualmente. <button class="btn pri" id="bHeredar" style="margin-left:6px">¿Quieres ser el anfitrión?</button> <span class="muted">Si lo heredas, tus minutos en esta partida contarán ×1,5: es el premio por mantenerla viva. Podrás empezar cuando quieras; si no, empezará sola.</span></div>';
  } else if(!hostDentro && p.anfitrion && fase!=='antes'){
    banner='<div class="banner ko"><b>El anfitrión todavía no ha llegado</b><br>Si no llega, la partida empieza sola cuando acabe la cortesía.</div>';
  }
  const hh=new Date(p.programada).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
  const anfNombre=p.anfitrion?esc(p.anfitrion):'sin anfitrión';
  /* monigotes: primero los que están (por orden de llegada), luego los apuntados que faltan */
  const mono=(j,fuera)=>{ const host=j.id===p.anfitrion_id;
    return '<div class="mono'+(fuera?' fuera':'')+(j.yo?' yo':'')+(llegan.has(j.id)?' llega':'')+'" data-id="'+esc(j.id)+'" style="--d:'+((parseInt(String(j.id).slice(-2),16)||0)%9)*0.21+'s">'+
      (host?'<span class="cor" title="Anfitrión">'+I.cor+'</span>':'')+monigoteSVG(colDe(j.id),fuera)+(fuera?'':'<span class="ok">'+I.ok+'</span>')+
      '<span class="nm">'+esc(j.nombre)+(j.yo?' <i>(tú)</i>':'')+'</span><span class="gr">'+esc(grupoTxt(j.grupo))+'</span>'+
      '<span class="est">'+(fuera?'aún no ha llegado':'dentro')+'</span></div>'; };
  const nSi=js.filter(j=>j.resp==='si').length, nSiD=js.filter(j=>j.resp==='si'&&j.dentro).length;
  const resumen=pend.length?nSiD+' de los '+nSi+' apuntados ya están dentro':(nSi?'Están todos los apuntados':'');
  app.innerHTML=banner+
    '<div class="card sala-top"><button class="btn cuad" id="bMus" title="'+(MUS.on?'Quitar la música':'Poner la música')+'">'+(MUS.on?I.spk:'<span class="tach">'+I.spk+'</span>')+'</button>'+
    '<h2>Partida de '+esc(p.creador)+' <span class="muted">('+esc(grupoTxt(p.grupo))+')</span></h2>'+
    '<div class="row" style="justify-content:space-between;align-items:flex-end"><div><div class="muted">'+esc(cuando(p.programada).replace(/^./,c=>c.toUpperCase()))+' · '+(p.anfitrion?I.cor:'')+'<b>'+anfNombre+'</b></div>'+
    (fase==='antes'?'<div class="reloj"><span class="et">Empieza a las '+hh+' · faltan</span><b class="grande" id="relojN"></b></div><div class="muted nota">A la hora en punto hay 5 minutos de cortesía: el anfitrión puede empezar cuando quiera y, si no, la partida empieza sola.</div>'
      :'<div class="reloj"><span class="et cort">5 minutos de cortesía</span><span class="et">Empieza sola en</span><b class="grande" id="relojN"></b></div><div class="muted nota">'+(p.soy_anfitrion?'Puedes empezar cuando quieras.':'El anfitrión puede empezarla antes.')+'</div>')+
    '</div><div class="row">'+(p.soy_anfitrion?(fase==='antes'?'<button class="btn pri" id="bEmpezar" disabled title="Podrás empezar a la hora en punto">'+I.play+'Empezar a las '+hh+'</button>':'<button class="btn pri" id="bEmpezar">'+I.play+'Empezar ya</button>')+'<button class="btn ko" id="bCancelar">Cancelar partida</button>':'')+
    '<button class="btn" id="bSalir">← Salir</button></div></div></div>'+
    '<div class="card"><div class="row" style="justify-content:space-between;align-items:baseline"><h2>Jugadores · '+dentro.length+' dentro</h2><span class="muted resumen'+(pend.length?'':' todos')+'">'+(pend.length?'':I.ok)+esc(resumen)+'</span></div>'+
    '<div class="plaza">'+(dentro.map(j=>mono(j,false)).join('')+pend.map(j=>mono(j,true)).join('')||'<span class="muted">Nadie todavía.</span>')+'</div>'+
    (dentro.length<5?'<p class="muted nota" style="margin:14px 0 0">🤖 Si al empezar hay menos de 5 jugadores, se suman bots con nombre de compositor hasta completar 5.</p>':'')+'</div>'+
    '<p class="muted" style="font-size:13px">Cuando empiece, oirás lo mismo que los demás a la vez. Pon el volumen y no cierres esta pestaña.</p>';
  /* las frases que seguían en el aire */
  Object.keys(BOCAS).forEach(id=>{ const b=BOCAS[id]; if(b.hasta<Date.now()){ delete BOCAS[id]; return; } const m=app.querySelector('.mono[data-id="'+id+'"]'); if(m){ const d=document.createElement('div'); d.className='boca quieta'+(b.yo?' yo':''); d.textContent=b.f; m.appendChild(d); setTimeout(()=>d.remove(),b.hasta-Date.now()); } });
  enlaza();
  const bm=document.getElementById('bMus'); if(bm) bm.onclick=()=>{ MUS.on=!MUS.on; try{ localStorage.setItem('co_musica',MUS.on?'si':'no'); }catch(e){} if(MUS.on) musicaSi(); else musicaNo(); ST.salaFirma=''; pintaSala(); };
  const bh=document.getElementById('bHeredar'); if(bh) bh.onclick=async()=>{ bh.disabled=true; await cr('heredar',{p_partida:ST.partida}); await refrescaSala(); pintaSala(); };
  const be=document.getElementById('bEmpezar'); if(be) be.onclick=async()=>{
    audioListo();
    const faltan=((ST.est&&ST.est.jugadores)||[]).filter(j=>!j.dentro&&j.resp==='si').map(j=>j.nombre);
    if(faltan.length){ const rest=(new Date(ST.est.p.auto).getTime()-sNow())/1000;
      if(!await confirma('¿Seguro que quieres empezar?',listaNombres(faltan)+(faltan.length>1?' quizá aún estén por llegar.':' quizá aún esté por llegar.')+(rest>2?' Si esperas, la partida empezará sola en '+mmss(rest)+'.':''),'Empezar igualmente','Esperar un poco')) return;
      audioListo(); }
    be.disabled=true; const r=await cr('empezar',{p_partida:ST.partida,p_duracion:700});
    if(r&&!r.ok&&r.error==='aun_no'){ ST.aviso='Podrás empezar a la hora en punto.'; }
    await refrescaSala(); pintaSala(); };
  const bc=document.getElementById('bCancelar'); if(bc) bc.onclick=async()=>{
    const js=((ST.est&&ST.est.jugadores)||[]).filter(j=>!j.yo), otros=js.filter(j=>j.resp==='si').length, pen=tarde(p)&&otros>0, nadie=!js.some(j=>j.resp==='si'||j.dentro);   /* (20-nov 13:58) */
    const ok=await confirma(pen?'Cancelar ahora cuenta como no asistir':'¿Cancelar la partida?',nadie?'No hay nadie más: la partida desaparece. No pierdes actitud.':(pen?'Hay gente apuntada: perderás 0,5 de actitud por cancelar con menos de 5 minutos de margen. Los demás podrán seguir si alguien se queda de anfitrión (×1,5). ¿Cancelar la partida igualmente?':'No pierdes actitud. Los demás podrán seguir si alguien se queda de anfitrión (sus minutos cuentan ×1,5).'),'Sí, cancelar','No, sigo');
    if(!ok) return;
    await cr('cancelar',{p_partida:ST.partida}); ST.aviso='Has cancelado la partida.'; arrancaLobby();
  };
  const bs=document.getElementById('bSalir'); if(bs) bs.onclick=async()=>{ await cr('salir',{p_partida:ST.partida}); arrancaLobby(); };
  pintaSalaTiempos();
}
function pintaSalaTiempos(){
  const e=ST.est; if(!e) return;
  const p=e.p, fase=salaFase(p), n=document.getElementById('relojN');
  const obj=fase==='antes'?new Date(p.programada).getTime():new Date(p.auto).getTime(), rest=(obj-sNow())/1000;
  if(n) n.textContent=rest>0?mmss(rest):'ya';
  if(ST.salaFirma && JSON.parse(ST.salaFirma)[4]!==fase){ pintaSala(); return; }   /* llega la hora en punto: se redibuja (botón «Empezar ya») */
  const ra=(new Date(p.auto).getTime()-sNow())/1000;
  if(ra<=1.5 && ra>-3) refrescaSala().then(pintaSala);
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
  const p=est.p; clearInterval(POLL); clearInterval(TIC); ST.vista='juego'; musicaNo(); dockNo();
  raiz.style.display='none'; raiz.style.visibility='';
  try{ localStorage.setItem('co_partida',p.id); }catch(e){}
  PCOnline.jugar({id:p.id,inicio:new Date(p.inicio).getTime(),semilla:p.semilla,now:sNow,cr:cr,est:est,
    /* (20-nov 18:14, Iago) bots hasta completar 5 jugadores (el número lo fija el servidor al empezar); el Tester, en su individual, 8 */
    bots:(ST.tester&&ST.bots===p.id)?8:(p.bots!=null?Number(p.bots):Math.max(0,5-(est.jugadores||[]).filter(j=>j.dentro).length)), solo:ST.soloId===p.id,
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
