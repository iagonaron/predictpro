/* =====================================================================================================================
   CARRUSEL PRO ONLINE (Grado Profesional) · 19/20-nov-2026, C1 · Carrusel online
   Generadores del Carrusel PRO de clase (PreDictPROCarrusel) pasados al formato del carrusel online de elemental, para que
   el mismo motor (guiado-online.js) los dibuje, los toque y los corrija. Todo sale de la SEMILLA (RND): todos los jugadores
   de una partida ven y oyen exactamente lo mismo.
   · Rítmico: 8 pulsos libres en 2/4 o 6/8 con las células del Carrusel PRO (más medias y difíciles que en elemental).
   · Melódico: atonal (Melódico atonal del Carrusel PRO), 10 notas entre si3 y mi5, con al menos 4 teclas negras; la primera
     y la última ya escritas.
   · TonCom: las 22 tonalidades hasta 5 alteraciones y compases 2/4, 3/4, 6/8 y 9/8.
   · Armónico: acorde 1 entre los 10 tipos del Armónico PRO; acorde 2, tríada M/m/dis en cualquier estado.
   (Cadencias —las 6 del PRO— y Modos van en el motor: gp_guiado.js)
   ===================================================================================================================== */
window.CO_GP=true;
const GP_QS=new URLSearchParams(location.search);

/* ---------- rítmico (gen8 del Carrusel PRO, con la semilla) ---------- */
function gpGen8(compound){
  const P=compound?CELLS_COMPOUND:CELLS_SIMPLE, F=P.facil, M=P.medio, D=P.dificil||[];
  const SEMI=new Set(['4semi','6semi','negra_2semi','corch_4semi','4semi_corch','corchp_3semi','sincopa_breve','corch_2semi','2semi_corch']), TUP=new Set(['tresillo','dosillo']);
  for(let it=0;it<400;it++){
    const s=[]; let nM=0,nD=0; const maxM=2+rint(2), maxD=compound&&RND()<0.5?1:0;
    for(let i=0;i<8;i++){
      let lvl='facil'; const r=RND();
      if(nD<maxD&&r<0.12){lvl='dificil';nD++;}
      else if(nM<maxM&&r<0.42){lvl='medio';nM++;}
      s.push(pick(lvl==='dificil'?D:lvl==='medio'?M:F));
    }
    let dosDensos=false; for(let i=1;i<8;i++) if(SEMI.has(s[i].id)&&SEMI.has(s[i-1].id)) dosDensos=true;
    const tupC1=TUP.has(s[0].id)||TUP.has(s[1].id);
    const alivio=s.slice(0,4).some(c=>c.id==='negra'||c.id==='negrap');
    const nSil=s.filter(c=>/^sil/.test(c.id)).length;
    if(!dosDensos&&!tupC1&&alivio&&nSil<=2) return s;
  }
  const base=compound?CELLS_COMPOUND.facil[0]:CELLS_SIMPLE.facil[0];
  return Array.from({length:8},()=>base);
}
function renderRitmico(seed){
  let compound=RND()<0.5; { const q=GP_QS.get('ts'); if(q==='6/8') compound=true; else if(q==='2/4') compound=false; }
  const spec={ts:compound?'6/8':'2/4',pulsos:2,compound};
  const s=gpGen8(compound).map(c=>Object.assign({beats:1},c));
  datosRitmico=[{spec,compases:[s.slice(0,2),s.slice(2,4),s.slice(4,6),s.slice(6,8)]}];
}

/* ---------- melódico atonal (genMel8 del Carrusel PRO, ahora con 10 notas) ---------- */
const GP_MEL_LO=59, GP_MEL_HI=76;
function gpNegra(m){ return [1,3,6,8,10].includes(((m%12)+12)%12); }
function gpGenMel(N){
  const size=d=>{const a=Math.abs(d);return a<=2?2:(a<=4?3:4);};
  const span=GP_MEL_HI-GP_MEL_LO, MIN_SPAN=Math.min(span,9), MIN_DISTINCT=7, MAX_REPEAT=2;
  for(let attempt=0;attempt<12000;attempt++){
    const start=GP_MEL_LO+rint(span+1); const seq=[start];
    let thirds=0,comp=0,compDir=0,ok=true;
    for(let i=1;i<N;i++){ const prev=seq[i-1], left=(N-1)-i; const count={}; seq.forEach(m=>count[m]=(count[m]||0)+1);
      let cands=[];
      for(let m=GP_MEL_LO;m<=GP_MEL_HI;m++){ if(m===prev)continue; if((count[m]||0)>=MAX_REPEAT)continue;
        const d=m-prev,sz=size(d),dir=(d>0?1:-1);
        if(comp>0){ if(sz!==2||dir!==compDir)continue; }
        else { if(sz===3&&thirds>=2)continue; if(sz===4&&(left<2||Math.abs(d)>12))continue; }
        if(i>=2&&m===seq[i-2])continue; cands.push(m); }
      if(i===N-1) cands=cands.filter(m=>m!==seq[0]);
      if(!cands.length){ok=false;break;}
      const fresh=cands.filter(m=>!count[m]); const pool=(fresh.length&&rint(100)<72)?fresh:cands;
      const next=pick(pool),d=next-prev,sz=size(d),dir=(d>0?1:-1);
      if(comp>0){comp--;thirds=0;if(comp===0)compDir=0;}
      else if(sz===4){comp=2;compDir=-dir;thirds=0;}
      else if(sz===3){thirds++;} else thirds=0;
      seq.push(next); }
    if(!ok||seq.length!==N||seq[N-1]===seq[0]||comp!==0)continue;
    const blacks=seq.filter(gpNegra).length, realSpan=Math.max(...seq)-Math.min(...seq), distinct=new Set(seq).size;
    if(blacks>=4&&realSpan>=MIN_SPAN&&distinct>=MIN_DISTINCT) return seq;
  }
  return [60,62,64,66,67,65,63,61,62,64];
}
function renderMelodico(seed){
  const key={name:'Atonal',tonic:'C',mode:'major',vfsig:'C',sig:0};
  const mel={seq:gpGenMel(10),useFlats:false,leadingPC:null,clef:'treble',atonal:true};
  datosMelodico=[{key,mel}];
}

/* ---------- TonCom: 30 tonalidades (hasta 7 alteraciones; 21-nov-2026, Iago) y 2/4, 3/4, 6/8, 9/8 ---------- */
Object.assign(TONIC_PC,{'D#':3,'A#':10,'Gb':6,'Cb':11});
const GP_TON_KEYS=[
  ['Do M','C','major','C',0],['La m','A','minor','C',0],
  ['Sol M','G','major','G',1],['Mi m','E','minor','G',1],['Re M','D','major','D',2],['Si m','B','minor','D',2],
  ['La M','A','major','A',3],['Fa♯ m','F#','minor','A',3],['Mi M','E','major','E',4],['Do♯ m','C#','minor','E',4],
  ['Si M','B','major','B',5],['Sol♯ m','G#','minor','B',5],['Fa♯ M','F#','major','F#',6],['Re♯ m','D#','minor','F#',6],['Do♯ M','C#','major','C#',7],['La♯ m','A#','minor','C#',7],
  ['Fa M','F','major','F',-1],['Re m','D','minor','F',-1],['Si♭ M','Bb','major','Bb',-2],['Sol m','G','minor','Bb',-2],
  ['Mi♭ M','Eb','major','Eb',-3],['Do m','C','minor','Eb',-3],['La♭ M','Ab','major','Ab',-4],['Fa m','F','minor','Ab',-4],
  ['Re♭ M','Db','major','Db',-5],['Si♭ m','Bb','minor','Db',-5],['Sol♭ M','Gb','major','Gb',-6],['Mi♭ m','Eb','minor','Gb',-6],['Do♭ M','Cb','major','Cb',-7],['La♭ m','Ab','minor','Cb',-7],
].map(([name,tonic,mode,vfsig,sig])=>({name,tonic,mode,vfsig,sig}));
function renderToncom(seed){
  let key=pick(GP_TON_KEYS); { const q=GP_QS.get('key'); if(q) key=GP_TON_KEYS.find(k=>k.name===q)||key; }
  let compas=pick(['2/4','3/4','6/8','9/8']); { const q=GP_QS.get('com'); if(q) compas=q; }
  const n=Math.abs(key.sig), armadura=key.sig===0?'—':(n+(key.sig>0?'♯':'♭'));
  datosToncom={tonalidad:key.name,armadura,compas,key};
}

/* ---------- armónico: los 10 tipos del Armónico PRO (acorde 1) y tríadas M/m/dis/sus4 (acorde 2) ---------- */
Object.assign(ARM_QUAL,{
  Sus4:{iv:[0,5,7],label:'sus4'}, m7:{iv:[0,3,7,10],label:'m7'}, M7:{iv:[0,4,7,11],label:'7M'},
  Dis7:{iv:[0,3,6,9],label:'7dis'}, Sd7:{iv:[0,3,6,10],label:'ø7'}
});
Object.assign(ARM_ROOTS,{
  Sus4:[['C',0],['G',0],['D',0],['A',0],['E',0],['F',0],['B',-1]],
  m7:[['A',0],['E',0],['D',0],['G',0],['C',0],['B',0],['F',1]],
  M7:[['C',0],['G',0],['D',0],['F',0],['B',-1],['A',0],['E',-1]],
  Dis7:[['B',0],['F',1],['G',1],['C',1],['D',1],['E',0]],
  Sd7:[['B',0],['E',0],['A',0],['D',0],['F',1],['C',1],['G',1]]
});
const GP_ARM_A=['PM','Pm','Aum','Dis','Sus4','D7','m7','M7','Dis7','Sd7'];
const GP_ARM_B=['PM','Pm','Dis'];   /* (20-nov) sin sus4 en el acorde 2: la corrección ordena por terceras (fund./3.ª/5.ª) y con la 4.ª suspendida saldría mal */
function gpPasos(q){ return q==='Sus4'?[0,3,4]:[0,2,4,6]; }
function gpSpell(rl,q,member,midi){
  const li=((ARM_LETTERS.indexOf(rl)+gpPasos(q)[member])%7+7)%7, letter=ARM_LETTERS[li], natural=ARM_LPC[letter], pc=((midi%12)+12)%12;
  let acc=pc-natural; while(acc>6)acc-=12; while(acc<-6)acc+=12;
  return {letter,acc,octave:Math.round((midi-natural-acc)/12)-1,midi,member};
}
function gpEncaja(rl,q,notes){
  let shift=0,g=0; const mn=()=>Math.min(...notes.map(n=>n.midi))+shift, mx=()=>Math.max(...notes.map(n=>n.midi))+shift;
  while(mn()<60&&g++<6) shift+=12; while(mx()>81&&g++<14) shift-=12;
  return notes.map(n=>gpSpell(rl,q,n.member,n.midi+shift)).sort((a,b)=>a.midi-b.midi);
}
function renderArmonico(seed){
  let qa=pick(GP_ARM_A); if(GP_ARM_A.includes(GP_QS.get('armA'))) qa=GP_QS.get('armA');
  const [rla,raa]=pick(ARM_ROOTS[qa]), roa=60+ARM_LPC[rla]+raa;
  const a={quality:qa,label:ARM_QUAL[qa].label,notes:gpEncaja(rla,qa,ARM_QUAL[qa].iv.map((s,k)=>({member:k,midi:roa+s})))};
  let qb=pick(GP_ARM_B); if(GP_ARM_B.includes(GP_QS.get('armB'))) qb=GP_QS.get('armB');
  const inv=rint(3), [rlb,rab]=pick(ARM_ROOTS[qb]), rob=60+ARM_LPC[rlb]+rab, iv=ARM_QUAL[qb].iv;
  const nb=[]; for(let k=0;k<3;k++){ const member=(inv+k)%3; nb.push({member,midi:rob+iv[member]+(member<inv?12:0)}); }
  const notes=gpEncaja(rlb,qb,nb);
  const b={quality:qb,inv,notes,tiple:armNombreES(notes[2]),bajo:armNombreES(notes[0]),dada:armNombreES(notes[1])};
  datosArmonico={a,b};
}

/* ---------- la partida entera: el orden lo decide el motor (aleatorio con la semilla) ---------- */
function renderConSemilla(seed){
  RND=mulberry32(seed);
  renderRitmico(seed); renderMelodico(seed); renderToncom(seed); renderArmonico(seed);
}
