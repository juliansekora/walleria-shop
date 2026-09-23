
const eur=n=>window.SPRACHE==="en"?("€"+n.toFixed(2)):(n.toFixed(2).replace(".",",")+" €"); const q=s=>document.querySelector(s);
/* Bildadresse mit Inhaltsversion (window.BILDV je Seite) - sonst zeigen Handys alte Bilder unter gleichem Namen (18.09.2026) */
const WURZEL=window.WURZEL||"";   /* "" on German pages, "/" unter /en/ (Bilder und Assets liegen nur einmal im Stamm) */
const tr=s=>(window.UEBERSETZUNG&&window.UEBERSETZUNG[s])||s;   /* Laufzeit-Uebersetzung fuer JS-Texte auf englischen Seiten */
const bildUrl=k=>WURZEL+"img/"+k+".jpg"+((window.BILDV&&BILDV[k])?"?v="+BILDV[k]:"");
/* Liefertermin (18.09.2026): Shipping in 1-3 Werktagen + DHL 1-2 Tage -> "estimated delivery Di, 22.09. - Fr, 25.09.".
   Werktage = Mo-Fr ohne bundesweite Feiertage (feste + Karfreitag/Ostermontag/Himmelfahrt/Pfingstmontag). Bestellung bis 14 Uhr zaehlt am selben Tag. */
const WK_FEST=["01-01","05-01","10-03","12-25","12-26"];
const ostern=y=>{const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),ta=((h+l-7*m+114)%31)+1;return new Date(y,mo-1,ta);};
const feiertag=d=>{const o=ostern(d.getFullYear());const bew=[-2,1,39,50].map(n=>{const x=new Date(o);x.setDate(o.getDate()+n);return x.toDateString();});const mmdd=String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");return WK_FEST.includes(mmdd)||bew.includes(d.toDateString());};
const werktag=d=>d.getDay()>0&&d.getDay()<6&&!feiertag(d);
const plusWerktage=(d,n)=>{const x=new Date(d);while(n>0){x.setDate(x.getDate()+1);if(werktag(x))n--;}return x;};
const fmtTag=d=>d.toLocaleDateString(window.SPRACHE==="en"?"en-GB":"de-DE",{weekday:"short",day:"2-digit",month:"2-digit"}).replace(/\.,/,",");
const lieferFenster=()=>{const j=new Date();let s=new Date(j);if(!werktag(s)||j.getHours()>=14){s=plusWerktage(s,1);}return {von:plusWerktage(s,2),bis:plusWerktage(s,5)};}; const esc=s=>String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const RABATT=0.30;
/* Namensposter live rendern – 1:1-Port von namensposter.py (Rosie/kirschgarten) und namensdesigns.d04 (Sophie) */
const NP={B:3456,H:4736,S:0.10};
const PAL={papier:"#F6EFE6",streifen:"#F3D9D2",gruen:"#2F6B4F",rahmen:"#B33A3A",bunt:["#B33A3A","#E8913C","#2F6B4F","#2E5FA3","#E4B93F","#C97B86"]};
const _cv=document.createElement("canvas").getContext("2d");
function tw(text,font,size){ _cv.font=`${size}px "${font}"`; return _cv.measureText(text).width; }
function initiale(name){ const teile=name.split(/\s*(?:&|\bund\b|\+)\s*/).map(s=>s.trim()).filter(Boolean); return teile.map(s=>s[0].toUpperCase()).join(" & "); }
function schoen(name){ return name.trim().replace(/\s+/g," ").split(" ").map(w=>w?w[0].toUpperCase()+w.slice(1):w).join(" "); }
function rnd(seed){ let s=seed*9301+49297; return ()=>{ s=(s*9301+49297)%233280; return s/233280; }; }
function blume(cx,cy,r,farbe,kern,seed){ const R=rnd(seed); const dreh=R()*360; let s="";
  for(let i=0;i<6;i++){ const w=(dreh+60*i)*Math.PI/180; const bx=cx+Math.cos(w)*r*0.62, by=cy+Math.sin(w)*r*0.62;
    s+=`<ellipse cx="${bx.toFixed(0)}" cy="${by.toFixed(0)}" rx="${(r*0.45).toFixed(0)}" ry="${(r*0.25).toFixed(0)}" transform="rotate(${(dreh+60*i).toFixed(1)} ${bx.toFixed(0)} ${by.toFixed(0)})" fill="${farbe}"/>`; }
  return s+`<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${(r*0.30).toFixed(0)}" fill="${kern}"/>`; }
function zacken(x0,y0,x1,y1,schritt,amp){ const pts=[]; let k=0;
  for(let x=x0;x<x1;x+=schritt,k++) pts.push([x,y0+(k%2?amp:0)]); for(let y=y0;y<y1;y+=schritt,k++) pts.push([x1-(k%2?amp:0),y]);
  for(let x=x1;x>x0;x-=schritt,k++) pts.push([x,y1-(k%2?amp:0)]); for(let y=y1;y>y0;y-=schritt,k++) pts.push([x0+(k%2?amp:0),y]);
  return "M"+pts.map(p=>p[0].toFixed(0)+" "+p[1].toFixed(0)).join("L")+"Z"; }
function buntZeile(text,yMitte,hoehe,seed,B){ const R=rnd(seed); const les=PAL.bunt; let h=hoehe;
  let br=[...text].map(c=>tw(c,"Lilita One",h)); let ges=br.reduce((a,b)=>a+b,0)+h*0.02*(text.length-1);
  const grenze=B*(1-2*NP.S-0.04);
  if(ges>grenze){ h*=grenze/ges; br=[...text].map(c=>tw(c,"Lilita One",h)); ges=br.reduce((a,b)=>a+b,0)+h*0.02*(text.length-1); }
  let x=B/2-ges/2, s="";
  [...text].forEach((c,i)=>{ const cx=x+br[i]/2, rot=(R()*10-5); if(c!==" ") s+=`<text x="${cx.toFixed(0)}" y="${yMitte.toFixed(0)}" text-anchor="middle" dominant-baseline="central" font-family="'Lilita One',sans-serif" font-size="${h.toFixed(0)}" fill="${les[(i+seed)%les.length]}" transform="rotate(${rot.toFixed(1)} ${cx.toFixed(0)} ${yMitte.toFixed(0)})">${c}</text>`; x+=br[i]+h*0.02; });
  return s; }
function buntBlock(text,yMitte,hoehe,seed,B){
  if(!text.includes(" ")||text.length<14) return buntZeile(text,yMitte,hoehe,seed,B);
  const bw=(s,g)=>[...s].reduce((a,c)=>a+tw(c,"Lilita One",g),0)+g*0.02*(s.length-1);
  /* Umbruch wie in namensposter.py (Etsy-Produktion): an der Stelle, an der
     both lines become as similar in width as possible. What is written here must be exactly the same there
     come out - otherwise the preview shows something different from what is printed. */
  const w=text.split(" "); let best=null;
  for(let i=1;i<w.length;i++){ const a=w.slice(0,i).join(" "), b=w.slice(i).join(" "); const d=Math.abs(bw(a,100)-bw(b,100)); if(!best||d<best[0]) best=[d,a,b]; }
  const grenze=B*(1-2*NP.S-0.04); let gr=hoehe*0.40; const l=Math.max(bw(best[1],gr),bw(best[2],gr)); if(l>grenze) gr*=grenze/l;
  const v=gr*0.72; return buntZeile(best[1],yMitte-v,gr,seed,B)+buntZeile(best[2],yMitte+v,gr,seed+1,B); }
function rosieSVG(name){ const B=NP.B,H=NP.H,seed=1; const zeichen=initiale(name)||"M"; const teile=zeichen.split(" "); let s="";
  s+=`<rect width="${B}" height="${H}" fill="${PAL.papier}"/>`;
  const sb=B*0.040; for(let x=sb*0.5;x<B;x+=sb*2) s+=`<rect x="${x.toFixed(0)}" y="0" width="${sb.toFixed(0)}" height="${H}" fill="${PAL.streifen}"/>`;
  const e=B*0.075; s+=`<path d="${zacken(e,e,B-e,H-e,B*0.028,B*0.012)}" fill="none" stroke="${PAL.rahmen}" stroke-width="${(B*0.010).toFixed(0)}" stroke-linejoin="round"/>`;
  const oben=H*0.075, feldH=H*0.60, cy=oben+feldH*0.5;
  if(teile.length>1){ const LUFT=0.03; let g=H*0.58, br, ges, ueber;
    const mess=(gr)=>{ br=teile.map(t=>tw(t,"Lilita One",gr)); ges=br.reduce((a,b)=>a+b,0)+gr*LUFT*(teile.length-1); const r=Math.min(H*0.078,gr*0.34); ueber=Math.max(0,r-gr*0.06); };
    mess(g); while(g>40 && ges+2*ueber>B*0.80){ g*=0.94; mess(g); }
    let x=(B-ges)/2; const kanten=[];
    teile.forEach((t,i)=>{ s+=`<text x="${x.toFixed(0)}" y="${cy.toFixed(0)}" dominant-baseline="central" font-family="'Lilita One',sans-serif" font-size="${g.toFixed(0)}" fill="${PAL.rahmen}">${t}</text>`; kanten.push([x,x+br[i]]); x+=br[i]+g*LUFT; });
    const y0=cy-g*0.36, y1=cy+g*0.36;
    s+=blume(kanten[0][0]+g*0.06,y0+g*0.04,Math.min(H*0.078,g*0.34),PAL.bunt[4],PAL.bunt[0],seed+2);
    s+=blume(kanten[kanten.length-1][1]-g*0.06,y1-g*0.06,Math.min(H*0.066,g*0.29),PAL.bunt[3],PAL.bunt[4],seed+3);
  } else { let g=H*0.62; while(g>40 && tw(zeichen,"Lilita One",g)>B*0.86) g*=0.94;
    s+=`<text x="${B/2}" y="${cy.toFixed(0)}" text-anchor="middle" dominant-baseline="central" font-family="'Lilita One',sans-serif" font-size="${g.toFixed(0)}" fill="${PAL.rahmen}">${zeichen}</text>`;
    s+=blume(B*0.325,H*0.215,H*0.078,PAL.bunt[4],PAL.bunt[0],seed+2);
    s+=blume(B*0.700,H*0.385,H*0.066,PAL.bunt[3],PAL.bunt[4],seed+3); }
  s+=buntBlock(schoen(name),H*0.745,H*0.245,seed,B);
  return `<svg viewBox="0 0 ${B} ${H}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`; }
function welleRahmen(x0,y0,x1,y1,len,amp){
  /* Previously, the waves had to run in fixed increments - if the distance
     not smoothly on it, the last wave ran beyond the corner and the whole
     Rahmen sass verschoben (waagerecht 311 px, senkrecht 154 px). Jetzt wird die
     step size chosen so that it divides the distance exactly. */
  const nx=Math.max(1,Math.round((x1-x0)/len)), lx=(x1-x0)/nx;
  const ny=Math.max(1,Math.round((y1-y0)/len)), ly=(y1-y0)/ny;
  let d=`M${x0} ${y0}`;
  for(let i=0;i<nx;i++) d+=` q${lx/2} ${-amp} ${lx} 0`;
  for(let i=0;i<ny;i++) d+=` q${amp} ${ly/2} 0 ${ly}`;
  for(let i=0;i<nx;i++) d+=` q${-lx/2} ${amp} ${-lx} 0`;
  for(let i=0;i<ny;i++) d+=` q${-amp} ${-ly/2} 0 ${-ly}`;
  return d+"Z"; }
function sophieSVG(name){ const B=NP.B,H=NP.H; const ini=initiale(name)||"M"; let s=`<rect width="${B}" height="${H}" fill="#F5EFC9"/>`;
  const sb=B*0.062; for(let x=sb*0.5;x<B;x+=sb*2) s+=`<rect x="${x.toFixed(0)}" y="0" width="${sb.toFixed(0)}" height="${H}" fill="#A9BFE8"/>`;
  s+=`<rect x="${B*0.115}" y="${H*0.095}" width="${B*0.77}" height="${H*0.81}" rx="${B*0.010}" fill="#FCFAF4"/>`;
  s+=`<path d="${welleRahmen(B*0.165,H*0.135,B*0.835,H*0.865,B*0.095,B*0.013)}" fill="none" stroke="#7E9FDE" stroke-width="${(B*0.0075).toFixed(0)}" stroke-linejoin="round"/>`;
  let g=H*0.30; while(g>40 && tw(ini,"Titan One",g)>B*0.42) g*=0.96;
  s+=`<text x="${B/2}" y="${(H*0.44).toFixed(0)}" text-anchor="middle" dominant-baseline="central" font-family="'Titan One',sans-serif" font-size="${g.toFixed(0)}" fill="#C3A6D8">${ini}</text>`;
  const nm=schoen(name).toUpperCase(); const lang=nm.length>10; let gn=H*0.050; const sp=()=>gn*(lang?0.25:0.55); const maxB=B*(lang?0.62:0.46); while(gn>20 && tw(nm,"Lilita One",gn)+sp()*(nm.length-1)>maxB) gn*=0.96;
  s+=`<text x="${B/2}" y="${(H*0.745).toFixed(0)}" text-anchor="middle" dominant-baseline="central" font-family="'Lilita One',sans-serif" font-size="${gn.toFixed(0)}" letter-spacing="${sp().toFixed(0)}" fill="#B394CC">${nm}</text>`;
  return `<svg viewBox="0 0 ${B} ${H}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`; }
/* Two names as in print: from 16 characters two lines "Julienco &" / "Anna Bella" (namensdesigns.namenszeilen) */
function nameZeilen(text,font,start,sperr,maxB){
  const passt=(t,g)=>{ while(g>20 && tw(t,font,g)+sperr*g*(t.length-1)>maxB) g*=0.96; return g; };
  const g1=passt(text,start); const teile=text.split(" & ");
  if(teile.length<2 || (g1>=start*0.85 && text.length<16)) return {zeilen:[text],g:g1};
  const z=[teile[0].trim()+" &", teile.slice(1).join(" & ").trim()]; return {zeilen:z,g:Math.min(...z.map(t=>passt(t,start)))}; }
function briefmarkeSVG(name){ const B=NP.B,H=NP.H; const ini=initiale(name)||"M"; let s=`<rect width="${B}" height="${H}" fill="#F4EFE3"/>`;
  /* green awning stripes, lightly hand-drawn */
  const sb=B*0.055; const R=rnd(21); for(let x=B*0.02;x<B;x+=sb*2){ const w1=sb*(0.96+R()*0.08), dx=(R()-0.5)*sb*0.08; s+=`<rect x="${(x+dx).toFixed(0)}" y="0" width="${w1.toFixed(0)}" height="${H}" fill="#3F7C57"/>`; }
  const kx0=B*0.155,ky0=H*0.150,kx1=B*0.845,ky1=H*0.850;
  s+=`<rect x="${kx0.toFixed(0)}" y="${ky0.toFixed(0)}" width="${(kx1-kx0).toFixed(0)}" height="${(ky1-ky0).toFixed(0)}" rx="${(B*0.015).toFixed(0)}" fill="#FBF8F0"/>`;
  const e=B*0.045; s+=`<path d="${welleRahmen(kx0+e,ky0+e,kx1-e,ky1-e,B*0.070,B*0.011)}" fill="none" stroke="#C9553E" stroke-width="${(B*0.008).toFixed(0)}" stroke-linejoin="round"/>`;
  let g=H*0.30; while(g>40 && tw(ini,"Archivo Black",g)>B*0.42) g*=0.96;
  s+=`<text x="${B/2}" y="${(H*0.465).toFixed(0)}" text-anchor="middle" dominant-baseline="central" font-family="'Archivo Black',sans-serif" font-size="${g.toFixed(0)}" fill="#3F7C57">${ini}</text>`;
  const nm=schoen(name); const z=nameZeilen(nm,"Lilita One",H*0.050,0.10,B*0.36); const schritt=z.g*1.25; const y0=H*0.715-schritt*(z.zeilen.length-1)/2;
  z.zeilen.forEach((t,i)=>{ s+=`<text x="${B/2}" y="${(y0+i*schritt).toFixed(0)}" text-anchor="middle" dominant-baseline="central" font-family="'Lilita One',sans-serif" font-size="${z.g.toFixed(0)}" letter-spacing="${(z.g*0.10).toFixed(0)}" fill="#C9553E">${t}</text>`; });
  return `<svg viewBox="0 0 ${B} ${H}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`; }
/* ---- weitere Namens-Designs als Browser-Grafik, Port von namensdesigns.py (05.09.2026) ---- */
function svgText(x,y,t,font,g,fill,extra){ return `<text x="${x.toFixed(0)}" y="${y.toFixed(0)}" text-anchor="middle" dominant-baseline="central" font-family="${font}" font-size="${g.toFixed(0)}" fill="${fill}"${extra||""}>${t}</text>`; }
function passG(t,font,start,maxB,sperr){ let g=start; while(g>20 && tw(t,font,g)+(sperr||0)*g*(t.length-1)>maxB) g*=0.96; return g; }
function nameBlock(name,font,start,sperr,maxB,y,fill,abstand,upper,fontCss){ const nm=upper?schoen(name).toUpperCase():schoen(name); const z=nameZeilen(nm,font,start,sperr||0,maxB); const schritt=z.g*(abstand||1.25); const y0=y-schritt*(z.zeilen.length-1)/2; let s=""; z.zeilen.forEach((t,i)=>{ s+=svgText(NP.B/2,y0+i*schritt,t,fontCss||`'${font}'`,z.g,fill,sperr?` letter-spacing="${(z.g*sperr).toFixed(0)}"`:""); }); return s; }
function ellipsePoly(cx,cy,a,b,winkel){ const w=winkel*Math.PI/180; const pts=[]; for(let i=0;i<28;i++){ const t=2*Math.PI*i/28, x=a*Math.cos(t), y=b*Math.sin(t); pts.push(`${(cx+x*Math.cos(w)-y*Math.sin(w)).toFixed(0)},${(cy+x*Math.sin(w)+y*Math.cos(w)).toFixed(0)}`); } return `<polygon points="${pts.join(" ")}"/>`; }
function sternPoly(cx,cy,r,spitzen,dreh,fill){ const pts=[]; for(let k=0;k<spitzen*2;k++){ const w=dreh+Math.PI*k/spitzen, rr=k%2===0?r:r*0.36; pts.push(`${(cx+Math.cos(w)*rr).toFixed(0)},${(cy+Math.sin(w)*rr).toFixed(0)}`); } return `<polygon points="${pts.join(" ")}" fill="${fill}"/>`; }
function vichySVG(B,H,farbe,schritt,deckung,seed){ const R=rnd(seed); let s=`<g fill="${farbe}" fill-opacity="${deckung}">`; for(let x=0;x<B;x+=schritt*2){ const dx=(R()-0.5)*schritt*0.06; s+=`<rect x="${(x+dx).toFixed(0)}" y="0" width="${schritt.toFixed(0)}" height="${H}"/>`; } for(let y=0;y<H;y+=schritt*2){ const dy=(R()-0.5)*schritt*0.06; s+=`<rect x="0" y="${(y+dy).toFixed(0)}" width="${B}" height="${schritt.toFixed(0)}"/>`; } return s+"</g>"; }
function margeritenSVG(name){ const B=NP.B,H=NP.H; const ini=initiale(name)||"M"; let s=`<rect width="${B}" height="${H}" fill="#E6D5C9"/>`; const R=rnd(4);
  [[0.14,0.09],[0.80,0.07],[0.50,0.16],[0.09,0.36],[0.88,0.32],[0.12,0.62],[0.90,0.58],[0.22,0.86],[0.62,0.90],[0.85,0.82]].forEach(([px,py])=>{ const cx=B*px+(R()-0.5)*B*0.03, cy=H*py+(R()-0.5)*H*0.02, r=B*0.052*(0.8+R()*0.35), dreh=R()*360; s+=`<g fill="#FBF7EE">`; for(let i=0;i<9;i++){ const w=dreh+i*40+(R()-0.5)*8, laenge=r*(0.42+R()*0.06), bx=cx+Math.cos(w*Math.PI/180)*r*0.62, by=cy+Math.sin(w*Math.PI/180)*r*0.62; s+=ellipsePoly(bx,by,laenge,r*(0.165+R()*0.035),w); } s+=`</g><circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${(r*(0.21+R()*0.04)).toFixed(0)}" fill="#DFA63E"/>`; });
  const g=passG(ini,"Playfair Display",H*0.56,B*0.66); s+=svgText(B/2,H*0.44,ini,"'Playfair Display',serif",g,"#FCF8F1");
  s+=nameBlock(name,"Pacifico",H*0.075,0,B*0.55,H*0.80,"#FCF8F1",1.2,false,"'Pacifico',cursive");
  return `<svg viewBox="0 0 ${B} ${H}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`; }
function vichyDesignSVG(name){ const B=NP.B,H=NP.H; const ini=initiale(name)||"M"; let s=`<rect width="${B}" height="${H}" fill="#F6EFE9"/>`+vichySVG(B,H,"#C79A93",B/7,0.19,9);
  const g=passG(ini,"Playfair Display",H*0.46,B*0.60); s+=svgText(B/2,H*0.40,ini,"'Playfair Display',serif",g,"#A5645C");
  const bw=tw(ini,"Playfair Display",g); const bx=B/2+bw*0.40, by=H*0.40-g*0.22; const r=Math.min(H*0.055,g*0.19); const R=rnd(3); s+=`<g fill="#D8A8A2">`; for(let i=0;i<5;i++){ const w=i*72-90+(R()-0.5)*16; const px=bx+Math.cos(w*Math.PI/180)*r*0.75, py=by+Math.sin(w*Math.PI/180)*r*0.75; s+=ellipsePoly(px,py,r*(0.46+R()*0.12),r*(0.30+R()*0.08),w); } s+=`</g><circle cx="${bx.toFixed(0)}" cy="${by.toFixed(0)}" r="${(r*0.26).toFixed(0)}" fill="#6E423C"/>`;
  s+=nameBlock(name,"Caveat",H*0.10,0,B*0.62,H*0.775,"#A5645C",1.1,false,"'Caveat',cursive");
  return `<svg viewBox="0 0 ${B} ${H}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`; }
function isforSVG(name){ const B=NP.B,H=NP.H; const ini=initiale(name)||"M"; let s=`<rect width="${B}" height="${H}" fill="#F2EBDB"/>`;
  const nx=14, ny=Math.max(4,Math.round(H/(B/14))), sx=B/nx, sy=H/ny, R=rnd(11), j=Math.min(sx,sy)*0.07;
  for(let ix=0;ix<nx;ix++) for(let iy=0;iy<ny;iy++){ if(ix===0||ix===nx-1||iy===0||iy===ny-1){ const e=[[ix*sx,iy*sy],[(ix+1)*sx,iy*sy],[(ix+1)*sx,(iy+1)*sy],[ix*sx,(iy+1)*sy]].map(([x,y])=>`${(x+(R()-0.5)*2*j).toFixed(0)},${(y+(R()-0.5)*2*j).toFixed(0)}`); s+=`<polygon points="${e.join(" ")}" fill="${(ix+iy)%2===0?"#8FA6B8":"#9E4F3C"}"/>`; } }
  const g=passG(ini,"Lilita One",H*0.27,B*0.40); s+=svgText(B/2,H*0.375,ini,"'Lilita One',sans-serif",g,"#7E97AC");
  const R2=rnd(2); [[0.24,0.20],[0.76,0.17],[0.18,0.44],[0.82,0.40],[0.30,0.57],[0.70,0.58]].forEach(([px,py])=>{ const r=B*(0.018+R2()*0.012); const sp=R2()<0.5?4:5; s+=sternPoly(B*px,H*py,r,sp,R2()*3,"#D9A441"); });
  s+=svgText(B/2,H*0.640,"is for","'Lilita One',sans-serif",H*0.026,"#9E4F3C",` letter-spacing="${(H*0.026*0.30).toFixed(0)}"`);
  s+=nameBlock(name,"Lilita One",H*0.075,0.12,B*0.60,H*0.730,"#7E97AC",1.25,true,"'Lilita One',sans-serif");
  return `<svg viewBox="0 0 ${B} ${H}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`; }
function pinselstrichSVG(name){ const B=NP.B,H=NP.H; const ini=initiale(name)||"M"; let s=`<rect width="${B}" height="${H}" fill="#F5F1E6"/>`;
  s+=`<g stroke="#C7D6E4" stroke-width="${(B*0.0035).toFixed(0)}">`; for(let x=B*0.155;x<B*0.845;x+=B*0.024) s+=`<line x1="${x.toFixed(0)}" y1="${(H*0.150).toFixed(0)}" x2="${x.toFixed(0)}" y2="${(H*0.850).toFixed(0)}"/>`; s+=`</g>`;
  const bx0=B*0.105,by0=H*0.105,bx1=B*0.895,by1=H*0.895; s+=`<rect x="${bx0.toFixed(0)}" y="${by0.toFixed(0)}" width="${(bx1-bx0).toFixed(0)}" height="${(by1-by0).toFixed(0)}" fill="none" stroke="#A8C4DC" stroke-width="${(B*0.020).toFixed(0)}" rx="${(B*0.004).toFixed(0)}"/>`;
  const R=rnd(23); s+=`<g stroke="#C33B36" stroke-width="${(B*0.006).toFixed(0)}" stroke-linecap="round">`;
  [[[bx0,by0],[bx1,by0]],[[bx1,by0],[bx1,by1]],[[bx1,by1],[bx0,by1]],[[bx0,by1],[bx0,by0]]].forEach(([[ax,ay],[bx,by]])=>{ const L=Math.hypot(bx-ax,by-ay), n=Math.floor(L/(B*0.052)), nx=(by-ay)/L, ny=-(bx-ax)/L; for(let i=1;i<n;i++){ const t=i/n+(R()-0.5)*0.016; if(t<0.075||t>0.925) continue; const cx=ax+(bx-ax)*t, cy=ay+(by-ay)*t, drall=(R()-0.5)*0.7, dx=nx*B*0.012+(bx-ax)/L*B*0.012*drall, dy=ny*B*0.012+(by-ay)/L*B*0.012*drall, lf=0.8+R()*0.45; s+=`<line x1="${(cx-dx*lf).toFixed(0)}" y1="${(cy-dy*lf).toFixed(0)}" x2="${(cx+dx*lf).toFixed(0)}" y2="${(cy+dy*lf).toFixed(0)}"/>`; } }); s+=`</g>`;
  const g=passG(ini,"Archivo Black",H*0.28,B*0.40); s+=svgText(B/2,H*0.42,ini,"'Archivo Black',sans-serif",g,"#C33B36");
  [[0.28,0.24],[0.74,0.21],[0.22,0.50],[0.76,0.47],[0.68,0.60]].forEach(([px,py])=>{ s+=sternPoly(B*px,H*py,B*(0.016+R()*0.012),5,R()*3,"#E9B33B"); });
  s+=nameBlock(name,"Pacifico",H*0.070,0,B*0.52,H*0.735,"#33549C",1.2,false,"'Pacifico',cursive");
  return `<svg viewBox="0 0 ${B} ${H}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`; }
function schlaufenSVG(name){ const B=NP.B,H=NP.H; const ini=initiale(name)||"M"; let s=`<rect width="${B}" height="${H}" fill="#F0E9DA"/>`+vichySVG(B,H,"#98A377",B/8,0.22,15);
  const kx0=B*0.115,ky0=H*0.105,kx1=B*0.885,ky1=H*0.895; s+=`<rect x="${kx0.toFixed(0)}" y="${ky0.toFixed(0)}" width="${(kx1-kx0).toFixed(0)}" height="${(ky1-ky0).toFixed(0)}" rx="${(B*0.012).toFixed(0)}" fill="#F4EDDD" stroke="#7A3A30" stroke-width="${(B*0.0032).toFixed(0)}"/>`;
  const ix0=kx0+B*0.055,iy0=ky0+B*0.055,ix1=kx1-B*0.055,iy1=ky1-B*0.055, r=B*0.020, U=2*((ix1-ix0)+(iy1-iy0)), n=Math.floor(U/(r*1.35)), R=rnd(25); let letzte=null; s+=`<g fill="none" stroke="#C08430" stroke-width="${(B*0.0045).toFixed(0)}">`;
  for(let i=0;i<n;i++){ const sPos=U*i/n; let cx,cy; if(sPos<ix1-ix0){cx=ix0+sPos;cy=iy0;} else if(sPos<(ix1-ix0)+(iy1-iy0)){cx=ix1;cy=iy0+(sPos-(ix1-ix0));} else if(sPos<2*(ix1-ix0)+(iy1-iy0)){cx=ix1-(sPos-(ix1-ix0)-(iy1-iy0));cy=iy1;} else {cx=ix0;cy=iy1-(sPos-2*(ix1-ix0)-(iy1-iy0));} const rr=r*(0.82+R()*0.32); cx+=(R()-0.5)*r*0.28; cy+=(R()-0.5)*r*0.28; if(letzte&&Math.hypot(cx-letzte[0],cy-letzte[1])<r*1.05) continue; letzte=[cx,cy]; s+=`<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${rr.toFixed(0)}"/>`; } s+=`</g>`;
  const g=passG(ini,"Titan One",H*0.24,B*0.36); s+=svgText(B/2,H*0.385,ini,"'Titan One',sans-serif",g,"#B96A55");
  s+=svgText(B/2,H*0.600,"is for","'Gochi Hand',cursive",H*0.030,"#8A4A3B");
  const farben=["#B96A55","#98A377","#C08430"]; const nm=schoen(name).toUpperCase(); const z=nameZeilen(nm,"Amatic SC",H*0.105,0.10,B*0.50); const schritt=z.g*1.05; const y0=H*0.705-schritt*(z.zeilen.length-1)/2;
  z.zeilen.forEach((t,zi)=>{ const inner=[...t].map((c,i)=>`<tspan fill="${farben[i%3]}">${c===" "?"&#160;":c}</tspan>`).join(""); s+=`<text x="${B/2}" y="${(y0+zi*schritt).toFixed(0)}" text-anchor="middle" dominant-baseline="central" font-family="'Amatic SC',cursive" font-weight="700" font-size="${z.g.toFixed(0)}" letter-spacing="${(z.g*0.10).toFixed(0)}">${inner}</text>`; });
  return `<svg viewBox="0 0 ${B} ${H}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`; }
function andenkenSVG(name){ const B=NP.B,H=NP.H; const ini=initiale(name)||"M"; let s=`<rect width="${B}" height="${H}" fill="#F1EAE0"/>`;
  const g=passG(ini,"Playfair Display",H*0.34,B*0.56); s+=svgText(B/2,H*0.38,ini,"'Playfair Display',serif",g,"#6B5B3E");
  s+=nameBlock(name,"Playfair Display",H*0.045,0.42,B*0.52,H*0.585,"#6B5B3E",1.3,true,"'Playfair Display',serif");
  s+=svgText(B/2,H*0.86,"Loved. Unique. Wonderful.","'Playfair Display',serif",H*0.020,"#9A8B70",` letter-spacing="${(H*0.020*0.10).toFixed(0)}"`);
  return `<svg viewBox="0 0 ${B} ${H}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`; }
const LIVE_DESIGNS=["rosie","sophie","briefmarke","margeriten","vichy","isfor","pinselstrich","schlaufen","andenken"];
const LIVE_SVG={briefmarke:briefmarkeSVG,margeriten:margeritenSVG,vichy:vichyDesignSVG,isfor:isforSVG,pinselstrich:pinselstrichSVG,schlaufen:schlaufenSVG,andenken:andenkenSVG};
function istLive(d){ d=String(d||"rosie"); return LIVE_DESIGNS.some(x=>d.endsWith(x)); }
function npSVG(design,name){ name=(name||"").trim().slice(0,40).replace(/[<>"]/g,"")||"Mila"; const d=String(design||"rosie"); const key=Object.keys(LIVE_SVG).find(k=>d.endsWith(k)); const svg=key?LIVE_SVG[key](name):(d==="sophie"?sophieSVG(name):rosieSVG(name)); return svg.replace(/&(?!amp;|#160;)/g,"&amp;"); }
if(document.fonts&&document.fonts.load){ Promise.all([document.fonts.load('40px "Lilita One"'),document.fonts.load('40px "Titan One"'),document.fonts.load('40px "Archivo Black"'),document.fonts.load('40px "Playfair Display"'),document.fonts.load('40px "Pacifico"'),document.fonts.load('bold 40px "Amatic SC"'),document.fonts.load('40px "Gochi Hand"'),document.fonts.load('40px "Caveat"')]).then(()=>{ document.querySelectorAll(".poster.np").forEach(el=>{ if(el.dataset.name!==undefined && istLive(el.dataset.design)) npRender(el,el.dataset.name); }); }).catch(()=>{}); }
function npRender(el,name){ if(!el) return; el.dataset.name=name||""; el.innerHTML=npSVG(el.dataset.design||"rosie",name); }
/* Live-Vorschau der Definitions-Poster (Mamaherz, Papaherz, Wunschkind + 49 Woerter).
   1:1-Nachbau von definition_designs_neu.py (Etsy-Poster-Pipeline): Blatt 2100x2877,
   gleiche Schriften (Playfair Display, Instrument Serif, Caveat), gleiche Positionen,
   same line break and fitting logic. What is written here is printed exactly the same way by production. */
const DEF={B:2100,H:2877,MAX:1720,PAPIER:"#F7F4EE",TINTE:"#22201C",GRAU:"#6B6459",TERRA:"#B5654A",SALBEI:"#7C8A72",ROSE:"#B98080",WORT_PX:224};
const DEF_FONT={play:"'Playfair Display',serif",instr:"'Instrument Serif',serif",cav:"'Caveat',cursive"};
let DEF_CTX=null;
function defCtx(){ if(!DEF_CTX){ DEF_CTX=document.createElement("canvas").getContext("2d"); } return DEF_CTX; }
function defMess(text,fam,px){ const c=defCtx(); c.font=px+"px "+fam; return c.measureText(text); }
function defBreite(text,fam,px){ return defMess(text,fam,px).width; }
/* echte Tintenbreite (wie textbbox in PIL) - Schreibschriften ragen ueber die Vorschubbreite hinaus */
function defTinte(text,fam,px){ const m=defMess(text,fam,px); const l=m.actualBoundingBoxLeft, r=m.actualBoundingBoxRight; return (isFinite(l)&&isFinite(r)&&(l+r)>0)?(l+r):m.width; }
function defAscent(fam,px){ const m=defMess("Hg",fam,px); const a=m.fontBoundingBoxAscent; return (a&&isFinite(a))?a:px*0.95; }
function defEsc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
/* PIL setzt Text mit y = Oberkante der Oberlaenge; SVG will die Grundlinie */
function defText(x,yTop,text,fam,px,fill,extra){ return `<text x="${x.toFixed(1)}" y="${(yTop+defAscent(fam,px)).toFixed(1)}" text-anchor="middle" font-family="${fam}" font-size="${px.toFixed(1)}" fill="${fill}" xml:space="preserve" style="white-space:pre"${extra||""}>${defEsc(text)}</text>`; }
function defPassend(fam,text,start,maxB,min){ if(min===undefined) min=90; let g=start; while(g>min){ if(defTinte(text,fam,g)<=maxB*0.98) break; g-=6; } return g; }
function defHell(farbe,anteil){ const f=[1,3,5].map(i=>parseInt(farbe.substr(i,2),16)), p=[1,3,5].map(i=>parseInt(DEF.PAPIER.substr(i,2),16)); return "#"+f.map((v,i)=>Math.round(p[i]+(v-p[i])*anteil).toString(16).padStart(2,"0")).join("").toUpperCase(); }
function defLinie(y,breite,farbe,st){ breite=breite||760; farbe=farbe||"#C9BFA9"; st=st||4; const B=DEF.B; return `<line x1="${(B/2-breite/2).toFixed(0)}" y1="${y}" x2="${(B/2+breite/2).toFixed(0)}" y2="${y}" stroke="${farbe}" stroke-width="${st}"/>`; }
function defGesperrt(t){ return [...t.toUpperCase()].join(" "); }
function defPapier(farbe){ return `<rect width="${DEF.B}" height="${DEF.H}" fill="${farbe}"/><rect width="${DEF.B}" height="${DEF.H}" filter="url(#defKorn)" opacity="0.10"/>`; }
/* Fliesstext mittig, pixelgemessen umbrochen - wie block() in kaempfer_poster.py */
function defBlock(y,text,farbe,px,fam,breite,lh,maxZ){ px=px||64; fam=fam||DEF_FONT.instr; breite=breite||(DEF.MAX-240); lh=lh||1.42; maxZ=maxZ||8; farbe=farbe||DEF.GRAU;
  const worte=String(text||"").split(/\s+/).filter(Boolean); const zeilen=[]; let akt="";
  for(const w of worte){ const probe=(akt+" "+w).trim(); if(defBreite(probe,fam,px)<=breite) akt=probe; else { if(akt) zeilen.push(akt); akt=w; } }
  if(akt) zeilen.push(akt);
  if(zeilen.length>maxZ && px>34) return defBlock(y,text,farbe,px-4,fam,breite,lh,maxZ);
  let s=""; for(const z of zeilen){ s+=defText(DEF.B/2,y,z,fam,px,farbe); y+=Math.floor(px*lh); } return {svg:s,y:y}; }
/* "[Name]   Substantiv" (+ freiwillige Datumszeile darunter, z. B. Wunschkind) */
function defUnter(p,y,fam,start,min,fill,sperren){ let t="["+p.name+"]   Substantiv"; if(sperren) t=defGesperrt("["+p.name+"]  Substantiv");
  const px=defPassend(fam,t,start,DEF.MAX,min); let s=defText(DEF.B/2,y,t,fam,px,fill); let dy=0;
  if(p.datum){ s+=defText(DEF.B/2,y+px*1.45,p.datum,DEF_FONT.instr,56,fill); dy=100; }
  return {svg:s,dy:dy}; }
function defHerz(cx,cy,r){ const pts=[[cx,cy+r*0.95]]; for(let t=0;t<=360;t+=6){ const a=t*Math.PI/180; const hx=16*Math.pow(Math.sin(a),3); const hy=13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a); pts.push([cx+hx*r/16,cy-hy*r/16]); } return pts.map(p=>p[0].toFixed(1)+","+p[1].toFixed(1)).join(" "); }
const DEF_DESIGNS={
  /* 1 Simple - a0_definition_schlicht */
  "1":function(p){ const B=DEF.B; let s=defPapier(DEF.PAPIER);
    s+=defText(B/2,720,p.wort,DEF_FONT.play,DEF.WORT_PX,"#1E1B16");
    const u=defUnter(p,1080,DEF_FONT.instr,78,60,"#6B655B"); s+=u.svg;
    s+=defLinie(1230+u.dy,620,"#C9C2B4",4); s+=defBlock(1350+u.dy,p.text,"#4A453C").svg; return s; },
  /* 2 Classic - a1_definition_classic_series */
  "2":function(p){ const B=DEF.B; let s=defPapier(DEF.PAPIER);
    s+=defText(B/2,700,p.wort,DEF_FONT.play,DEF.WORT_PX,DEF.TINTE);
    const u=defUnter(p,1090,DEF_FONT.instr,86,64,DEF.TERRA); s+=u.svg;
    s+=defLinie(1240+u.dy,700,DEF.SALBEI); s+=defBlock(1360+u.dy,p.text).svg; return s; },
  /* 3 Heart - a7_definition_herz */
  "3":function(p){ const B=DEF.B; let s=defPapier(DEF.PAPIER);
    s+=`<polygon points="${defHerz(B/2,600,110)}" fill="${defHell(DEF.ROSE,0.15)}"/>`;
    s+=defText(B/2,890,p.wort,DEF_FONT.play,DEF.WORT_PX,DEF.TINTE);
    const u=defUnter(p,1230,DEF_FONT.cav,110,80,DEF.TERRA); s+=u.svg;
    s+=defLinie(1390+u.dy,620,defHell(DEF.ROSE,0.35)); s+=defBlock(1500+u.dy,p.text).svg; return s; },
  /* 4 Branch - a8_definition_zweig */
  "4":function(p){ const B=DEF.B; let s=defPapier(DEF.PAPIER);
    const cx=B/2, cy=640, L=900; const pf=[]; for(let i=0;i<=40;i++) pf.push([cx-L/2+i*L/40, cy+Math.sin(i/6.5)*26]);
    s+=`<polyline points="${pf.map(q=>q[0].toFixed(1)+","+q[1].toFixed(1)).join(" ")}" fill="none" stroke="${DEF.SALBEI}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
    for(let i=3;i<39;i+=4){ const x0=pf[i][0], y0=pf[i][1]; const seite=(Math.floor(i/4)%2)?-1:1; const w=52*seite*Math.PI/180;
      const lx=x0+Math.sin(w)*74; const ly=y0+Math.cos(w)*74*seite-40;
      const x1=Math.min(x0,lx), y1=Math.min(y0-64,ly), x2=Math.max(x0,lx)+30, y2=Math.max(y0-64,ly)+74;
      s+=`<ellipse cx="${((x1+x2)/2).toFixed(1)}" cy="${((y1+y2)/2).toFixed(1)}" rx="${((x2-x1)/2).toFixed(1)}" ry="${((y2-y1)/2).toFixed(1)}" fill="${defHell(DEF.SALBEI,0.35)}"/>`; }
    s+=defText(B/2,880,p.wort,DEF_FONT.play,DEF.WORT_PX,DEF.TINTE);
    const u=defUnter(p,1220,DEF_FONT.instr,82,90,DEF.TERRA); s+=u.svg;
    s+=defLinie(1380+u.dy,640,defHell(DEF.SALBEI,0.2)); s+=defBlock(1490+u.dy,p.text).svg; return s; },
  /* 5 Night green - a9_definition_nacht */
  "5":function(p){ const B=DEF.B, CREME="#F4EEDF", GOLD="#C9A96A"; let s=defPapier("#22392C");
    s+=defText(B/2,560,defGesperrt("Definition"),DEF_FONT.instr,58,GOLD);
    s+=defText(B/2,700,p.wort,DEF_FONT.play,DEF.WORT_PX,CREME);
    const u=defUnter(p,1060,DEF_FONT.instr,80,90,GOLD); s+=u.svg;
    s+=defLinie(1210+u.dy,560,GOLD,4); s+=defBlock(1330+u.dy,p.text,"#D9D2C0").svg; return s; },
  /* 6 Powder pink - a12_definition_powder_pink */
  "6":function(p){ const B=DEF.B; let s=defPapier("#C98A7D");
    s+=defText(B/2,760,p.wort,DEF_FONT.play,DEF.WORT_PX,"#FBF6EC");
    const u=defUnter(p,1120,DEF_FONT.cav,110,80,"#F4DCC8"); s+=u.svg;
    s+=defLinie(1300+u.dy,560,"#F4DCC8",5); s+=defBlock(1430+u.dy,p.text,"#FBF6EC").svg; return s; }
};
function defSVG(nr,wort,name,text,datum){ const fn=DEF_DESIGNS[String(nr||"1").trim().charAt(0)]||DEF_DESIGNS["1"];
  const p={wort:String(wort||""),name:String(name||"").trim().slice(0,40),text:String(text||""),datum:String(datum||"").trim().slice(0,30)};
  const korn='<defs><filter id="defKorn" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix type="saturate" values="0"/></filter></defs>';
  return `<svg viewBox="0 0 ${DEF.B} ${DEF.H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vorschau ${defEsc(p.wort)}">${korn}${fn(p)}</svg>`; }
window.defSVG=defSVG;

/* Live-Vorschau Hausregeln: Hintergrund = textfreier Render des Designs (site_static/hr/*.jpg,
   erzeugt aus hausregeln_welt.py mit leerem Namen/leeren Regeln), Familienname und die sieben
   Regeln werden im Browser exakt nach derselben Layout-Mathematik gesetzt (_block, passgenau,
   regelgroesse). Blatt 2100x2877. HR_LAYOUT (gemessene Boxen) fuegt der Builder ein. */
const HR={B:2100,H:2877,STD:["We tell the truth","We laugh out loud","We help each other","Mistakes are allowed","We listen to each other","Hugs are free","We love each other"]};
const HR_LAYOUT={"B": 2100, "H": 2877, "b6-dschungel": {"box": [621, 771, 1515, 2181]}, "b9-zitrus": {"box": [653, 809, 1556, 2064]}, "b10-regenbogen": {"y0": 1371}};
function hrMetrik(fam,px){ const m=defMess("Hg",fam,px); const a=(m.fontBoundingBoxAscent&&isFinite(m.fontBoundingBoxAscent))?m.fontBoundingBoxAscent:px*0.95; const b=(m.fontBoundingBoxDescent&&isFinite(m.fontBoundingBoxDescent))?m.fontBoundingBoxDescent:px*0.25; return {a:a,b:b}; }
/* Schriftgroesse, bei der text GENAU zielbreite fuellt (hausregeln_v3.passgenau) */
function hrPassgenau(fam,text,ziel,maxpx){ maxpx=maxpx||460; let lo=20,hi=maxpx; while(hi-lo>1){ const m=Math.floor((lo+hi)/2); if(defBreite(text,fam,m)<=ziel) lo=m; else hi=m; } return lo; }
function hrText(x,yTop,text,fam,px,fill,anchor){ return `<text x="${x.toFixed(1)}" y="${(yTop+hrMetrik(fam,px).a).toFixed(1)}" text-anchor="${anchor||"middle"}" font-family="${fam}" font-size="${px.toFixed(1)}" fill="${fill}" xml:space="preserve" style="white-space:pre">${defEsc(text)}</text>`; }
/* Regelblock: EINE passgenaue Groesse, vertikal gleichmaessig verteilt (hausregeln_welt._block) */
function hrBlock(saetze,x0,x1,y0,y1,fam,cap,farbe){ const n=saetze.length; if(!n) return ""; const breite=x1-x0; const pxH=Math.floor((y1-y0)/(7*1.42));
  const px=Math.max(24,Math.min(cap,pxH,Math.min.apply(null,saetze.map(t=>hrPassgenau(fam,t,breite)))));
  const m=hrMetrik(fam,px); const zh=m.a+m.b; const spalt=((y1-y0)-7*zh)/6; let y=y0+((y1-y0)-(n*zh+(n-1)*spalt))/2, s=""; const mitte=(x0+x1)/2;
  for(const t of saetze){ s+=hrText(mitte,y,t,fam,px,farbe); y+=zh+spalt; } return s; }
/* Band mit Kreis + Ziffer (hausregeln_v6 u1/u10): Baender liegen NICHT im Hintergrund, damit weniger Regeln = weniger Baender */
function hrBand(x0,y,x1,bh,r,fill){ return `<rect x="${x0}" y="${y.toFixed(1)}" width="${x1-x0}" height="${bh}" rx="${r}" ry="${r}" fill="${fill}"/>`; }
function hrKreisZiffer(cx,cy,r,kreis,zif,zfam,zpx,zfill){ let s=`<circle cx="${cx}" cy="${cy.toFixed(1)}" r="${r}" fill="${kreis}"/>`;
  if(zif==="♥"){ const h=r*0.95; s+=`<path transform="translate(${cx} ${(cy+h*0.08).toFixed(1)}) scale(${(h/16).toFixed(3)})" fill="${zfill}" d="M0 12 C-8 5 -12 1 -12 -4 C-12 -9 -8 -12 -4 -12 C-1.5 -12 0 -10.5 0 -9 C0 -10.5 1.5 -12 4 -12 C8 -12 12 -9 12 -4 C12 1 8 5 0 12 Z"/>`; }
  else { const m=hrMetrik(zfam,zpx); s+=`<text x="${cx}" y="${(cy+(m.a-m.b)/2).toFixed(1)}" text-anchor="middle" font-family="${zfam}" font-size="${zpx}" fill="${zfill}">${zif}</text>`; }
  return s; }
/* Einheitliche Bandschrift (hausregeln_v6.regelgroesse) */
function hrRegelgroesse(saetze,breite,cap,fam){ if(!saetze.length) return cap; return Math.min(cap,Math.min.apply(null,saetze.map(t=>hrPassgenau(fam,t,breite)))); }
const HR_DESIGNS={
  "b2-titel":function(p){ const B=HR.B,H=HR.H,I=DEF_FONT.instr,P=DEF_FONT.play; let s=hrText(B/2,590,defGesperrt(p.name),I,44,"#8A8272");
    const farben=["#5F7256","#C99235","#B85C38","#5E7284","#8A7350","#C1603F","#7D6383"]; const y0=740,y1=H-240,bh=246,spalt=((y1-y0)-7*bh)/6,x0=170,x1=B-170; const n=p.regeln.length;
    const px=hrRegelgroesse(p.regeln,x1-x0-300,126,I); const m=hrMetrik(I,px); let y=y0+((y1-y0)-(n*bh+(n-1)*spalt))/2;
    p.regeln.forEach((t,k)=>{ const bg=farben[k%7]; const cy=y+bh/2; s+=hrBand(x0,y,x1,bh,52,bg); s+=hrKreisZiffer(x0+122,cy,70,"#FFFFFF",k<n-1?String(k+1):"♥",P,92,bg);
      s+=hrText(x0+230,cy-(m.a+m.b)/2+6,t,I,px,"#FBF6EA","start"); y+=bh+spalt; }); return s; },
  "b4-botanik":function(p){ const B=HR.B,H=HR.H,I=DEF_FONT.instr; const x0=290,y0=560,x1=B-290,y1=H-560; let s=hrText(B/2,y0+320,defGesperrt(p.name),I,44,"#A6512F");
    const px=hrRegelgroesse(p.regeln,x1-x0-150,100,I); const m=hrMetrik(I,px); const zh=m.a+m.b; const ry0=y0+460,ry1=y1-120; const spalt=((ry1-ry0)-7*zh)/6; const n=p.regeln.length; let y=ry0+((ry1-ry0)-(n*zh+(n-1)*spalt))/2;
    for(const t of p.regeln){ s+=hrText(B/2,y,t,I,px,"#3E5C50"); y+=zh+spalt; } return s; },
  "b5-sonne":function(p){ const B=HR.B,H=HR.H,I=DEF_FONT.instr; let s=hrText(B/2,850,defGesperrt(p.name),I,44,"#B85C38");
    const warm=["#E0A526","#D97B5A","#C1603F","#B85C38","#A6512F","#8A5A2B","#6E4F14"]; const y0=1000,y1=H-260,bh=220,spalt=((y1-y0)-7*bh)/6,x0=190,x1=B-190; const n=p.regeln.length;
    const px=hrRegelgroesse(p.regeln,x1-x0-130,118,I); const m=hrMetrik(I,px); let y=y0+((y1-y0)-(n*bh+(n-1)*spalt))/2;
    p.regeln.forEach((t,k)=>{ s+=hrBand(x0,y,x1,bh,110,warm[k%7]); s+=hrText(B/2,y+bh/2-(m.a+m.b)/2+8,t,I,px,"#FFF6E4"); y+=bh+spalt; }); return s; },
  "b6-dschungel":function(p){ const I=DEF_FONT.instr; const bx=(HR_LAYOUT["b6-dschungel"]||{}).box||[300,300,1800,2500]; const x0=bx[0],y0=bx[1],x1=bx[2],y1=bx[3]; const mitte=(x0+x1)/2;
    const nz=defGesperrt(p.name); const npx=Math.min(44,hrPassgenau(I,nz,x1-x0-60)); let s=hrText(mitte,y0+210,nz,I,npx,"#A6512F");
    s+=hrBlock(p.regeln,x0,x1,y0+340,y1-30,I,72,"#3E5C50"); return s; },
  "b8-waldtiere":function(p){ const B=HR.B,I=DEF_FONT.instr; let s=hrText(B/2,560,defGesperrt(p.name),I,46,"#A6512F");
    s+=hrBlock(p.regeln,430,B-430,720,1590,I,72,"#5C4326"); return s; },
  "b9-zitrus":function(p){ const I=DEF_FONT.instr,P=DEF_FONT.play; const bx=(HR_LAYOUT["b9-zitrus"]||{}).box||[300,300,1800,2500]; const x0=bx[0],y0=bx[1],x1=bx[2],y1=bx[3]; const mitte=(x0+x1)/2;
    const nz=defGesperrt(p.name); const npx=Math.min(46,hrPassgenau(I,nz,x1-x0-60)); let s=hrText(mitte,y0+230,nz,I,npx,"#8A5A2B");
    s+=hrBlock(p.regeln,x0,x1,y0+380,y1,P,72,"#B5541C"); return s; },
  "b10-regenbogen":function(p){ const B=HR.B,H=HR.H,I=DEF_FONT.instr; const y0=(HR_LAYOUT["b10-regenbogen"]||{}).y0||Math.floor(H*0.5);
    let s=hrText(B/2,y0+210,defGesperrt(p.name),I,46,"#B5654A"); s+=hrBlock(p.regeln,430,B-430,y0+370,H-300,I,76,"#5C5243"); return s; }
};
/* Eigene Regeln: eine pro Zeile, 1 bis 7 - es stehen GENAU die eingegebenen Regeln auf dem Poster (Julian 08.09.2026). Leer = unsere sieben. */
function hrRegeln(text){ const r=String(text||"").replace(/;/g,"\n").split(/\n/).map(z=>z.trim().slice(0,42)).filter(Boolean).slice(0,7); return r.length?r:HR.STD.slice(); }
function hrSVG(design,name,regelnText){ const fn=HR_DESIGNS[design]; if(!fn) return "";
  let n=String(name||"").trim().slice(0,40); if(n && n.toLowerCase().indexOf("familie")<0) n="Familie "+n;
  const p={name:n,regeln:hrRegeln(regelnText)};
  return `<svg viewBox="0 0 ${HR.B} ${HR.H}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" aria-label="Vorschau Hausregeln"><image href="/hr/${design}.jpg" x="0" y="0" width="${HR.B}" height="${HR.H}" preserveAspectRatio="none"/>${fn(p)}</svg>`; }
window.hrSVG=hrSVG;

/* Live-Vorschau Ultraschall-Herz (Walleria-Artikel "ultraschall", Design g3-herz):
   Hintergrund = Beispielblatt ohne Text (site_static/us/g3-herz.jpg, Blatt 2100x2877),
   Name (Sacramento), Spruchzeile (Instrument Serif, gesperrt, Grossbuchstaben) und Terminzeile
   are set in the browser using the same mathematics as aquarell_ultraschall.p_texte:
   Name ab y=1899 (Unterkante Herz 1819 + 80), Groesse 280 px, schrumpft bis der Name in
   1720 px passt (min 120); Spruch 150 px unter der gemessenen Namens-Unterkante, 56 px;
   Termin bei y=2600, 48 px. Farben #22201C / #4A443C / #8A8378. */
const US={B:2100,H:2877,MAXB:1720,SPRUCH:"Hello little wonder",FONT:{sig:"'Sacramento',cursive",instr:"'Instrument Serif',serif"}};
function usPassend(fam,text,start,maxb,min){ let px=start; while(px>min && defBreite(text,fam,px)>maxb) px-=2; return Math.max(min,px); }
function usTermin(t){ t=String(t||"").trim().replace(/^[ ·\-–]+|[ ·\-–]+$/g,""); if(!t) return ""; const tl=t.toLowerCase();
  if(/^(erwartet|wir |kommt|ab |im |am |seit|ssw)/.test(tl)) return t[0].toUpperCase()+t.slice(1);
  if(/^\d{1,2}\.\s*\S/.test(t)) return "Expected on "+t; return "Expected in "+t; }
function usText(x,yTop,text,fam,px,fill){ const m=defMess("Hg",fam,px); const a=(m.fontBoundingBoxAscent&&isFinite(m.fontBoundingBoxAscent))?m.fontBoundingBoxAscent:px*0.95;
  return {svg:`<text x="${x.toFixed(1)}" y="${(yTop+a).toFixed(1)}" text-anchor="middle" font-family="${fam}" font-size="${px}" fill="${fill}" xml:space="preserve" style="white-space:pre">${defEsc(text)}</text>`, base:yTop+a}; }
function usSVG(name,spruch,termin){ name=String(name||"").trim().slice(0,40); if(!name) return "";
  const fpx=usPassend(US.FONT.sig,name,280,US.MAXB,120); const n=usText(US.B/2,1899,name,US.FONT.sig,fpx,"#22201C"); let s=n.svg;
  const mm=defMess(name,US.FONT.sig,fpx); const desc=(mm.actualBoundingBoxDescent&&isFinite(mm.actualBoundingBoxDescent))?mm.actualBoundingBoxDescent:fpx*0.3; const unter=n.base+desc;
  const zeile=(String(spruch||"").trim()||US.SPRUCH).slice(0,100); const kopf=[...zeile.toUpperCase()].join(" ");
  s+=usText(US.B/2,unter+150,kopf,US.FONT.instr,usPassend(US.FONT.instr,kopf,56,US.MAXB,20),"#4A443C").svg;
  const t=usTermin(termin); if(t) s+=usText(US.B/2,2600,t,US.FONT.instr,usPassend(US.FONT.instr,t,48,US.MAXB,20),"#8A8378").svg;
  return `<svg viewBox="0 0 ${US.B} ${US.H}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" aria-label="Vorschau Ultraschall-Poster"><image href="/us/g3-herz.jpg" x="0" y="0" width="${US.B}" height="${US.H}" preserveAspectRatio="none"/>${s}</svg>`; }
window.usSVG=usSVG;

/* Karten-Poster (Walleria-Artikel "karte" / "karte-set3"): Live-Vorschau mit MapLibre auf
   OpenFreeMap vector tiles, address search via Photon. Taken from the lab
   (site/labor/karte, Stand 11.09.2026) und in die Produktseite eingebaut (16.09.2026).

   Zwei Betriebsarten:
   - karteStart(pdp)            Produktseite: 1 oder 3 Poster, Felder im Personalisieren-Block,
                                writes design/style/font/location/text/configuration into hidden
                                data-pers-feld-Eingaben, preloading "Add to cart" einen
                                Kartenausschnitt als Vorschau hoch (walleria-kundenbild).
   - karteDruck(cfg, b, h)      Druckseite (karte-druck.html): genau EIN Poster ohne Bedienung,
                                Breite fest (Referenz 500 CSS-px), Playwright macht den Screenshot.

   Zoom wird geraete-unabhaengig gespeichert: z_ref = zoom + log2(500 / Posterbreite in CSS-px).
   The print renders the poster with 500 CSS-px width and takes z_ref directly - then shows
   the print exactly the section of the preview, regardless of whether configured on mobile or desktop. */
(function(){
const KP_REF=500;                                   /* Referenz-Posterbreite in CSS-px */
const KP_TILES="https://tiles.openfreemap.org/planet";
const KP_STYLES={
 linie:{bg:"#FFFFFF",ink:"#111111",water:"#DCDCDC",road:"#111111",minor:"#3A3A3A",build:"#F1F1F1",park:"#F6F6F6",pin:"#C4342D"},
 sand:{bg:"#F4EEE4",ink:"#2B2622",water:"#D9D0C2",road:"#2B2622",minor:"#5A524A",build:"#EDE6DA",park:"#EEE8DD",pin:"#B5452F"},
 grau:{bg:"#DCDCDC",ink:"#2B2622",water:"#F0F0F0",road:"#FFFFFF",minor:"#FFFFFF",build:"#C4C4C4",park:"#D2D2D2",pin:"#C4342D",outline:"#A9A9A9"},
 nacht:{bg:"#141414",ink:"#F5F1EA",water:"#303030",road:"#DAD6CE",minor:"#8E8A84",build:"#1D1D1D",park:"#191919",pin:"#D9574C"}
};
/* Labelling in the order -> Key in code */
const KP_DESIGN={"Klassik":"klassik","Silhouette":"sil","Haus":"haus"};
const KP_FORM={"Quadrat":"quadrat","Kreis":"kreis","Herz":"herz"};
const KP_STIL={"Schwarz-Weiß":"linie","Sand":"sand","Grau":"grau","Nacht":"nacht"};
const KP_SCHRIFT={"Mila":"script","Maria":"maria","Julietta":"ringe"};
const KP_MARKER={"Herz-Marker":1,"Ohne Marker":0};
/* Mila Love: Buchstabe + Herz als Ligatur (Private-Use-Zeichen der Schrift) */
const KP_HERZ={"a":57632,"b":57635,"c":57636,"d":57637,"e":57638,"f":57639,"g":57640,"h":57641,"i":57642,"j":57643,"k":57644,"l":57645,"m":57646,"n":57647,"o":57648,"p":57649,"q":57650,"r":57651,"s":57652,"t":57653,"u":57654,"v":57655,"w":57656,"x":57657,"y":57658,"z":57659};
const KP_PIN='<svg viewBox="-6 -6 112 104"><path d="M44 90 C36 82 20 70 11 57 C4 47 2 38 5 29 C8 19 17 12 27 12.5 C36 13 43 18 47 25 C51 15 59 8 69 8 C81 8 92 17 95 30 C97.5 42 92 53 83 63 C72 75 55 84 44 90 Z" fill="currentColor" transform="rotate(-4 50 50) translate(50 0) scale(.9 1) translate(-50 0)"/></svg>';
/* Voreinstellungen je Design (wie im Labor): Stil, Schrift, Zoom, Beispieltexte */
const KP_VOR={klassik:{stil:"linie",schrift:"script",z:13,t:"Where it all began",d:"14.06.2019"},
              sil:{stil:"nacht",schrift:"maria",z:13.5,t:"Where it all began",d:"22.05.2025"},
              haus:{stil:"grau",schrift:"maria",z:16,t:"Zuhause",d:"seit 2021"}};
const KP_BEISPIEL={q:"Hamburg, Ottensen",n1:"Anna",n2:"Paul",lat:53.5545,lon:9.9285};
/* 3er-Set-Vorlagen (Layout A: links Koordinaten-Poster, Mitte Karte, rechts Koordinaten-Poster) - Titel/Datum
   werden in die Felder geschrieben (aenderbar), Beispielorte nur fuer die Vorschau, bis die Kundin eigene eintraegt */
const KP_VORLAGEN={
 "Roadtrip":{t:["Start","Highlight","Ziel"],d:["Tag 1","Tag 4","Tag 9"],o:[["Munich",48.1351,11.582,13.4],["Gardasee",45.6389,10.7154,12.6],["Toskana",43.7696,11.2558,12.6]]},
 "Unsere Geschichte":{t:["Erstes Date","Zuhause","Erster Urlaub"],d:["12.05.2022","seit 2024","08.2022"],o:[["Flensburg",54.7837,9.4362,13.4],["Hamburg",53.5545,9.9285,13.4],["Kopenhagen",55.6761,12.5683,13.4]]},
 "Unsere Ersten":{t:["Erster Kuss","First home together","Erste Reise"],d:["03.03.2021","seit 2023","07.2021"],o:[["Kiel",54.3233,10.1228,13.4],["Lübeck",53.8655,10.6866,13.4],["Amsterdam",52.3676,4.9041,13.4]]},
 "Drei Zuhause":{t:["Aufgewachsen","Heute","First home of your own"],d:["1998","seit 2024","2018"],o:[["Bremen",53.0793,8.8017,13.4],["Hamburg",53.5545,9.9285,13.4],["Leipzig",51.3397,12.3731,13.4]]},
 "Fernbeziehung":{t:["Your location","Unser Treffpunkt","Mein Ort"],d:["seit 2020","immer wieder","seit 2019"],o:[["Wien",48.2082,16.3738,13.4],["Berlin",52.52,13.405,13.4],["Hamburg",53.5545,9.9285,13.4]]},
 "Beste Freundinnen":{t:["Kennengelernt","Unser Lieblingsort","Always here"],d:["2012","seit immer","jedes Jahr"],o:[["Flensburg",54.7837,9.4362,13.4],["Sylt",54.9079,8.3049,12.6],["Berlin",52.52,13.405,13.4]]},
 "Lieblingsorte":{t:["Lieblingscafé","Lieblingsstadt","Lieblingsstrand"],d:["Ottensen","2023","Sommer"],o:[["Hamburg",53.5545,9.9285,13.4],["Lissabon",38.7223,-9.1393,13.4],["St. Peter-Ording",54.3103,8.6417,12.6]]},
 "Unsere Reisen":{t:["Lissabon","Toskana","Norwegen"],d:["2022","2023","2024"],o:[["Lissabon",38.7223,-9.1393,13.4],["Toskana",43.7696,11.2558,12.6],["Norwegen",60.3913,5.3221,12.6]]},
 "Studienzeit":{t:["Uni-Stadt","Unsere WG","Lieblingsbar"],d:["2016","2017–2020","jeden Freitag"],o:[["Münster",51.9607,7.6261,13.4],["Freiburg",47.999,7.8421,13.4],["Freiburg",47.999,7.8421,14]]},
 "Unser Sommer":{t:["Festival","Strand","Ausflug"],d:["08.2024","jeden Sommer","09.2024"],o:[["Wacken",54.0246,9.3771,12.6],["Timmendorf",53.9955,10.7822,12.6],["Bodensee",47.6596,9.1753,12.6]]}};
/* 3er-Set: jedes Poster startet mit einem anderen Beispielort, sonst saehen alle drei gleich aus (Julian, 16.09.2026) */
const KP_BEISPIEL_SET=[{q:"Flensburg",lat:54.7837,lon:9.4362},{q:"Bremen",lat:53.0793,lon:8.8017},{q:"Hamburg, Ottensen",lat:53.5545,lon:9.9285}];

function kpStyle(s){const c=KP_STYLES[s];return{version:8,sources:{om:{type:"vector",url:KP_TILES}},layers:[
 {id:"bg",type:"background",paint:{"background-color":c.bg}},
 {id:"park",type:"fill","source":"om","source-layer":"park",paint:{"fill-color":c.park}},
 {id:"landuse",type:"fill","source":"om","source-layer":"landuse",filter:["in","class","residential","commercial","industrial"],paint:{"fill-color":c.build,"fill-opacity":.6}},
 {id:"water",type:"fill","source":"om","source-layer":"water",paint:{"fill-color":c.water}},
 {id:"waterway",type:"line","source":"om","source-layer":"waterway",paint:{"line-color":c.water,"line-width":["interpolate",["linear"],["zoom"],10,1,15,3]}},
 {id:"building",type:"fill","source":"om","source-layer":"building",minzoom:13,paint:{"fill-color":c.build,"fill-outline-color":c.outline||c.bg}},
 {id:"rd-minor",type:"line","source":"om","source-layer":"transportation",filter:["in","class","minor","service","track","path","pedestrian","living_street","residential"],paint:{"line-color":c.minor,"line-width":["interpolate",["exponential",1.4],["zoom"],10,.2,13,.7,14.5,1.6,16,3.2,17,4.5]}},
 {id:"rd-path",type:"line","source":"om","source-layer":"transportation",filter:["in","class","path","track","pedestrian","service"],minzoom:14,paint:{"line-color":c.minor,"line-width":["interpolate",["linear"],["zoom"],14,.5,16,1.4,17,2.2],"line-opacity":.9}},
 {id:"rd-mid",type:"line","source":"om","source-layer":"transportation",filter:["in","class","tertiary","secondary"],paint:{"line-color":c.road,"line-width":["interpolate",["exponential",1.4],["zoom"],10,.6,13,1.4,16,3.5]}},
 {id:"rd-major",type:"line","source":"om","source-layer":"transportation",filter:["in","class","primary","trunk","motorway"],paint:{"line-color":c.road,"line-width":["interpolate",["exponential",1.4],["zoom"],10,1.2,13,2.4,16,6]}},
 {id:"rail",type:"line","source":"om","source-layer":"transportation",filter:["==","class","rail"],paint:{"line-color":c.minor,"line-width":.8,"line-dasharray":[3,2]}}
]}}
function kpApplyStyle(map,key){const c=KP_STYLES[key];const go=()=>{try{
 map.setPaintProperty("bg","background-color",c.bg);map.setPaintProperty("park","fill-color",c.park);map.setPaintProperty("landuse","fill-color",c.build);
 map.setPaintProperty("water","fill-color",c.water);map.setPaintProperty("waterway","line-color",c.water);map.setPaintProperty("building","fill-color",c.build);
 map.setPaintProperty("rd-minor","line-color",c.minor);map.setPaintProperty("rd-mid","line-color",c.road);map.setPaintProperty("rd-major","line-color",c.road);map.setPaintProperty("rail","line-color",c.minor);map.setPaintProperty("rd-path","line-color",c.minor);map.setPaintProperty("building","fill-outline-color",c.outline||c.bg);
}catch(e){}};if(map.style&&map.style.stylesheet)go();else map.once("style.load",go);map.once("idle",go)}
const kpSauber=s=>(s||"").replace(/\s+/g," ").trim();
const kpEsc=s=>String(s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function kpDms(v,lat){const a=Math.abs(v),d=Math.floor(a),m=Math.floor((a-d)*60),s=((a-d)*60-m)*60;return `${d}°${String(m).padStart(2,"0")}'${s.toFixed(1)}"${lat?(v>=0?"N":"S"):(v>=0?"E":"W")}`}
function kpHerzNamen(a,b){const cp=KP_HERZ[a.slice(-1).toLowerCase()];return cp?a.slice(0,-1)+String.fromCodePoint(cp)+b:null}
function kpPassend(el){el.style.fontSize="";const max=el.clientWidth||(el.parentElement&&el.parentElement.clientWidth);if(!max)return;let fs=parseFloat(getComputedStyle(el).fontSize);let n=0;while(el.scrollWidth>max+1&&fs>6&&n<40){fs*=0.94;el.style.fontSize=fs+"px";n++}}
async function kpPhoton(q){const r=await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lang=de&limit=5&lat=51&lon=10`);const j=await r.json();
 return (j.features||[]).map(f=>{const p=f.properties;const name=[p.name||[p.street,p.housenumber].filter(Boolean).join(" "),[p.postcode,p.city||p.town||p.village||p.county].filter(Boolean).join(" "),p.country].filter(Boolean).join(", ");
  return{name,city:p.city||p.town||p.village||p.name||"",lon:f.geometry.coordinates[0],lat:f.geometry.coordinates[1],type:p.type}})}

/* Poster framework - identical for preview and print */
function kpPosterHTML(){
 return '<div class="kp-poster"><p class="kopf"></p><p class="koord"></p><div class="mapwrap"><svg class="ring" viewBox="0 0 200 200"><defs><path id="rp" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0"/></defs><text><textPath href="#rp" startOffset="50%" text-anchor="middle"></textPath></text></svg>'
  +'<div class="mapbox"><div class="map"></div><div class="pin"></div></div></div><div class="gross" aria-hidden="true"></div><div class="txt"><p class="t1"></p><p class="t2"></p><p class="t3"></p></div></div>';
}
/* Ein Poster zeichnen: st = {design,form,stil,schrift,pin}, c = {el,cfg:{t,n1,n2,d},center,city} */
function kpRender(c,st,beispiel){
 const p=c.el.querySelector(".kp-poster"),s=KP_STYLES[st.stil];const papier=st.design==="sil"||st.design==="haus";
 p.style.setProperty("--pbg",papier?"#FFFFFF":s.bg);p.style.setProperty("--pink",papier?"#1A1A1A":s.ink);
 p.classList.toggle("d-sil",st.design==="sil");p.classList.toggle("d-haus",st.design==="haus");
 p.classList.toggle("d-koord",st.design==="koord");p.classList.toggle("d-marker",st.design==="marker");p.classList.toggle("d-kreisklein",st.design==="kreisklein");
 ["f-script","f-maria","f-ringe"].forEach(k=>p.classList.remove(k));p.classList.add("f-"+st.schrift);
 p.classList.toggle("ringe",st.schrift==="ringe");p.classList.toggle("maria",st.schrift==="maria");
 const mb=c.el.querySelector(".mapbox");mb.className="mapbox "+(st.design==="klassik"?st.form:(st.design==="kreisklein"?"kreis":"quadrat"));mb.style.background=s.bg;
 /* Begleitposter ohne Karte (koord/marker): Herz-Marker gross als Motiv */
 const gross=c.el.querySelector(".gross"); if(gross){ gross.style.color=s.pin; if(!gross.dataset.m){ gross.innerHTML=KP_PIN; gross.dataset.m="1"; } }
 const pin=c.el.querySelector(".pin");pin.style.display=st.pin?"":"none";pin.style.color=s.pin;if(!pin.dataset.m){pin.innerHTML=KP_PIN;pin.dataset.m="1"}
 /* Leere Felder zeigen in der Vorschau ein Beispiel (blass) - im Druck bleiben sie leer */
 const bsp=(k)=>beispiel&&!kpSauber(c.cfg[k])?(beispiel[k]||""):"";
 const t=kpSauber(c.cfg.t)||bsp("t"), n1=kpSauber(c.cfg.n1)||bsp("n1"), n2=kpSauber(c.cfg.n2)||(kpSauber(c.cfg.n1)?"":bsp("n2")), d=kpSauber(c.cfg.d)||bsp("d");
 p.classList.toggle("bsp-q",!!beispiel&&!kpSauber(c.cfg.q)&&!c.geo);
 p.classList.toggle("bsp-t",!!beispiel&&!kpSauber(c.cfg.t));p.classList.toggle("bsp-n",!!beispiel&&!kpSauber(c.cfg.n1)&&!kpSauber(c.cfg.n2));p.classList.toggle("bsp-d",!!beispiel&&!kpSauber(c.cfg.d));
 c.el.querySelector(".t1").textContent=t;
 const parts=[n1,n2].filter(Boolean),nm=parts.join(" & "),e2=c.el.querySelector(".t2");
 const kopf=c.el.querySelector(".kopf"),koord=c.el.querySelector(".koord"),ringT=c.el.querySelector(".ring textPath");
 if(st.design==="haus"){ if(st.schrift==="script"){const cp=KP_HERZ[t.slice(-1).toLowerCase()];kopf.textContent=cp?t.slice(0,-1)+String.fromCodePoint(cp):t}else if(st.schrift==="maria")kopf.textContent=t+"=";else kopf.textContent=t }else kopf.textContent=t;
 ringT.textContent="";
 const hz=st.design==="sil"?[parts.join("  ·  "),d].filter(Boolean).join("  ·  "):(parts.length===2&&st.schrift==="script"?kpHerzNamen(parts[0],parts[1]):(parts.length===2&&st.schrift==="ringe"?parts[0]+"+"+parts[1]:(parts.length===2&&st.schrift==="maria"?parts[0]+"="+parts[1]:null)));
 if(st.design==="koord"||st.design==="marker"){ e2.textContent=kpSauber(c.city)||""; }
 else if(hz!==null&&hz!==undefined&&hz!=="")e2.textContent=hz;
 else if(parts.length===2)e2.innerHTML=kpEsc(parts[0])+'<svg class="hz" viewBox="0 0 24 24"><path d="M12 20 C8 17 3 13.5 3 9.5 A4.5 4.5 0 0 1 12 8 A4.5 4.5 0 0 1 21 9.5 C21 13.5 16 17 12 20 Z"/></svg>'+kpEsc(parts[1]);
 else e2.textContent=nm;
 kpPassend(e2);
 if(st.design==="koord"||st.design==="marker"){ const e1=c.el.querySelector(".t1"); kpPassend(e1); }
 const ct=c.center;const co=ct?`${kpDms(ct.lat,true)} ${kpDms(ct.lng,false)}`:"";
 const m1=st.design==="sil"?(c.city||""):((st.design==="koord"||st.design==="marker")?d:[d,c.city].filter(Boolean).join("  ·  ")),m2=co;
 c.el.querySelector(".t3").innerHTML=kpEsc(m1)+(m1&&m2?'<span class="sep">  ·  </span>':"")+`<span class="z">${kpEsc(m2)}</span>`;
 /* Haus: die Namen stehen als Zeile ueber den Koordinaten (der .txt-Block ist bei diesem Design aus, 17.09.2026) */
 koord.innerHTML=(st.design==="haus"&&nm?`<span class="kn">${kpEsc(nm)}</span><br>`:"")+(ct?`${kpEsc(kpDms(ct.lat,true))}<br>${kpEsc(kpDms(ct.lng,false))}`:"")+(d?`<br><span class="kd">${kpEsc(d)}</span>`:"");
}
function kpZoomRef(map,breite){ const b=breite||KP_REF; return Math.round((map.getZoom()+Math.log2(KP_REF/b))*100)/100; }

/* ------------------------------------------------------------------ Product page */
window.karteStart=function(pdp){
 if(!window.maplibregl) return null;
 const q=s=>document.querySelector(s);
 const buehne=q("#karteBuehne"); if(!buehne) return null;
 const n=parseInt(buehne.dataset.anzahl,10)||1;
 const wert=(id,karte,std)=>{ const e=q("#"+id); const v=e?e.value:""; return karte[v]!==undefined?karte[v]:std; };
 const st={design:"klassik",form:"quadrat",stil:"linie",schrift:"script",pin:1};
 const lesen=()=>{ st.design=wert("kpDesign",KP_DESIGN,"klassik"); st.form=wert("kpForm",KP_FORM,"quadrat"); st.stil=wert("kpStil",KP_STIL,"linie"); st.schrift=wert("kpSchrift",KP_SCHRIFT,"script"); st.pin=wert("kpMarker",KP_MARKER,1); };
 lesen();
 /* Artikel mit voreingestelltem Design (Silhouette/Haus, 17.09.2026): Form-Feld gehoert nur zu Klassik */
 { const ff=pdp.querySelector(".kp-form"); if(ff) ff.hidden=st.design!=="klassik"; }
 const cards=[]; let aktiv=0;
 /* Switcher for set of 3: which poster is shown large in the preview */
 let tabs=null;
 if(n>1){ tabs=document.createElement("div"); tabs.className="kp-tabs"; tabs.innerHTML=(n===3?["Links","Mitte","Rechts"]:Array.from({length:n},(_,i)=>"Poster "+(i+1))).map((b,i)=>`<button type="button" aria-pressed="${i===0}">${b}</button>`).join(""); buehne.appendChild(tabs); }
 const zeige=(i)=>{ aktiv=i; cards.forEach((c,j)=>{ c.wrap.hidden=j!==i; }); if(tabs) tabs.querySelectorAll("button").forEach((b,j)=>b.setAttribute("aria-pressed",j===i)); const c=cards[i]; if(c){ setTimeout(()=>{ c.map.resize(); kpRender(c,stFuer(c),c.bsp); },30); } };
 if(tabs) tabs.querySelectorAll("button").forEach((b,i)=>b.addEventListener("click",()=>zeige(i)));
 const felder=(i,k)=>pdp.querySelector(`[data-kp="${k}"][data-i="${i}"]`);
 /* Set of 3: only the middle poster features the map in the chosen design, left/right are coordinates posters */
 const stFuer=(c)=>(n>1&&c.i!==2)?{...st,design:"koord",form:"quadrat"}:st;
 for(let i=1;i<=n;i++){
  const wrap=document.createElement("div"); wrap.className="kp-card"; wrap.innerHTML=kpPosterHTML(); buehne.appendChild(wrap);
  const vor=KP_VOR[st.design];
  const bsp={t:(felder(i,"t")&&felder(i,"t").placeholder)||vor.t,n1:KP_BEISPIEL.n1,n2:KP_BEISPIEL.n2,d:(felder(i,"d")&&felder(i,"d").placeholder)||vor.d};
  const vorl0=n>1?(KP_VORLAGEN[(q("#kpVorlage")||{}).value]||KP_VORLAGEN["Roadtrip"]):null;
  const bspOrt=vorl0?{q:vorl0.o[i-1][0],lat:vorl0.o[i-1][1],lon:vorl0.o[i-1][2]}:KP_BEISPIEL;
  const map=new maplibregl.Map({container:wrap.querySelector(".map"),style:kpStyle(st.stil),center:[bspOrt.lon,bspOrt.lat],zoom:vorl0?vorl0.o[i-1][3]:vor.z,attributionControl:false,dragRotate:false,pitchWithRotate:false,touchZoomRotate:true,preserveDrawingBuffer:true,fadeDuration:0,
    cooperativeGestures:("ontouchstart" in window),locale:{"CooperativeGesturesHandler.WindowsHelpText":"Ctrl + scroll to zoom","CooperativeGesturesHandler.MacHelpText":"⌘ + scroll to zoom","CooperativeGesturesHandler.MobileHelpText":"Drag with two fingers"}});
  map.touchZoomRotate.disableRotation();
  const c={i,el:wrap,wrap,map,cfg:{q:"",t:"",n1:"",n2:"",d:""},center:map.getCenter(),city:bspOrt.q.split(",")[0],bsp,dirty:false,geo:false,kennung:"",stand:""};
  /* 21.09.2026: Beispielort steht wie die Beispielnamen sichtbar im Feld (Platzhalter), bis die Kundin tippt -
     a visitor mistook the sample poster for their own and dropped off at the empty location field */
  bsp.q=bspOrt.q; { const eq=felder(i,"q"); if(eq&&!kpSauber(eq.value)) eq.placeholder=bspOrt.q; }
  map.on("move",()=>{ c.center=map.getCenter(); kpRender(c,stFuer(c),c.bsp); });
  map.on("moveend",()=>schreiben());
  ["q","t","n1","n2","d"].forEach(k=>{ const e=felder(i,k); if(!e) return;
   if(k==="q"){ let t; const box=e.parentElement.querySelector(".kp-sugg");
    e.addEventListener("input",()=>{ c.cfg.q=e.value; c.dirty=true; c.geo=false; clearTimeout(t); t=setTimeout(()=>vorschlaege(c,e,box),260); schreiben(); });
    e.addEventListener("keydown",ev=>{ if(ev.key==="Enter"){ ev.preventDefault(); geocode(c,e.value); if(box) box.hidden=true; } });
    e.addEventListener("blur",()=>{ setTimeout(()=>{ if(box) box.hidden=true; },200); if(c.dirty&&kpSauber(e.value).length>=3) geocode(c,e.value); });
    e.addEventListener("focus",()=>zeige(i-1));
   } else { e.addEventListener("input",()=>{ c.cfg[k]=e.value; kpRender(c,stFuer(c),c.bsp); schreiben(); }); e.addEventListener("focus",()=>zeige(i-1)); e.addEventListener("blur",()=>{ e.value=kpSauber(e.value); c.cfg[k]=e.value; kpRender(c,stFuer(c),c.bsp); schreiben(); }); }
  });
  cards.push(c); kpRender(c,stFuer(c),bsp);
  map.once("load",()=>map.resize()); setTimeout(()=>map.resize(),400); setTimeout(()=>map.resize(),1500);
 }
 if(n>1) zeige(0);
 async function vorschlaege(c,e,box){ if(!box) return; const s=kpSauber(e.value); if(s.length<3){ box.hidden=true; return; }
  try{ const res=await kpPhoton(s); box.innerHTML=res.map((r,i)=>`<button type="button" data-i="${i}">${kpEsc(r.name)}</button>`).join(""); box.hidden=!res.length;
   box.querySelectorAll("button").forEach(b=>b.addEventListener("mousedown",ev=>{ ev.preventDefault(); const r=res[+b.dataset.i]; anwenden(c,r); e.value=r.name; c.cfg.q=r.name; box.hidden=true; schreiben(); })); }
  catch(err){ box.hidden=true; } }
 async function geocode(c,text){ try{ const res=await kpPhoton(text); if(res[0]) anwenden(c,res[0]); }catch(e){} }
 function anwenden(c,r){ c.city=r.city; c.dirty=false; c.geo=true; const z=(r.type==="house"||r.type==="street")?Math.max(c.map.getZoom(),15):c.map.getZoom(); c.map.jumpTo({center:[r.lon,r.lat],zoom:z}); c.center=c.map.getCenter(); kpRender(c,stFuer(c),c.bsp); schreiben(); }
 /* Write configuration into the hidden order fields */
 /* Poster width in CSS-px - for sets of 3, only one poster is visible, all are the same width */
 const posterBreite=()=>{ const s=cards.find(x=>!x.wrap.hidden); const b=s?s.el.querySelector(".kp-poster").getBoundingClientRect().width:0; return b||buehne.clientWidth||KP_REF; };
 const zusammen=(c)=>({v:1,de:stFuer(c).design,fo:stFuer(c).design==="klassik"?st.form:"quadrat",st:st.stil,sc:st.schrift,pin:st.pin,t:kpSauber(c.cfg.t).slice(0,40),n1:kpSauber(c.cfg.n1).slice(0,24),n2:kpSauber(c.cfg.n2).slice(0,24),d:kpSauber(c.cfg.d).slice(0,24),ci:kpSauber(c.city).slice(0,30),la:Math.round(c.center.lat*1e5)/1e5,lo:Math.round(c.center.lng*1e5)/1e5,z:kpZoomRef(c.map,posterBreite())});
 function schreiben(){ cards.forEach(c=>{ const k=JSON.stringify(zusammen(c)); const eK=q("#kpKonf"+c.i), eT=q("#kpText"+c.i), eV=q("#kpVor"+c.i);
   if(eK) eK.value=k; if(eT) eT.value=[kpSauber(c.cfg.t),[kpSauber(c.cfg.n1),kpSauber(c.cfg.n2)].filter(Boolean).join(" & "),kpSauber(c.cfg.d)].filter(Boolean).join(" · ");
   if(eV && c.stand!==k){ c.kennung=""; eV.value=""; } }); }
 schreiben();
 /* Design/style/font buttons: the cart code sets the hidden field and fires "input" */
 ["kpDesign","kpForm","kpStil","kpSchrift","kpMarker"].forEach(id=>{ const e=q("#"+id); if(!e) return; e.addEventListener("input",()=>{ const alt=st.design; lesen();
   if(id==="kpDesign" && alt!==st.design){ const v=KP_VOR[st.design];
    /* like in the lab: matching style, matching font and a matching zoom for the design */
    setzeChip("kpStil",Object.keys(KP_STIL).find(k=>KP_STIL[k]===v.stil)); setzeChip("kpSchrift",Object.keys(KP_SCHRIFT).find(k=>KP_SCHRIFT[k]===v.schrift)); lesen();
    cards.forEach(c=>{ c.map.setZoom(v.z); c.bsp.t=(felder(c.i,"t")&&felder(c.i,"t").placeholder)||v.t; c.bsp.d=(felder(c.i,"d")&&felder(c.i,"d").placeholder)||v.d; });
    const fz=q("#kpZoom"); if(fz){ fz.value=v.z; } }
   const formFeld=pdp.querySelector(".kp-form"); if(formFeld) formFeld.hidden=st.design!=="klassik";
   cards.forEach(c=>{ if(id==="kpStil"||id==="kpDesign") kpApplyStyle(c.map,st.stil); kpRender(c,stFuer(c),c.bsp); });
   setTimeout(()=>cards.forEach(c=>{ c.map.resize(); kpRender(c,stFuer(c),c.bsp); }),60); setTimeout(()=>cards.forEach(c=>c.map.resize()),500); schreiben(); }); });
 /* Set-Vorlage: Titel + Datum vorfuellen (Felder mit data-auto bleiben austauschbar), Beispielorte fuer die Vorschau */
 function vorlageAnwenden(name,erst){ const v=KP_VORLAGEN[name]; if(!v) return;
  cards.forEach(c=>{ const i=c.i-1;
   [["t",v.t[i]],["d",v.d[i]]].forEach(([k,wert])=>{ const e=felder(c.i,k); if(!e) return; if(erst||e.dataset.auto==="1"||!kpSauber(e.value)){ e.value=wert; e.dataset.auto="1"; c.cfg[k]=wert; } });
   if(!c.geo&&!kpSauber(c.cfg.q)){ const o=v.o[i]; c.city=o[0]; c.bsp.q=o[0]; const eq=felder(c.i,"q"); if(eq) eq.placeholder=o[0]; c.map.jumpTo({center:[o[2],o[1]],zoom:o[3]}); c.center=c.map.getCenter(); }
   kpRender(c,stFuer(c),c.bsp); });
  schreiben(); }
 const vorlEl=q("#kpVorlage");
 if(vorlEl){ vorlageAnwenden(vorlEl.value||"Roadtrip",true);
  ["t","d"].forEach(k=>cards.forEach(c=>{ const e=felder(c.i,k); if(e) e.addEventListener("input",()=>{ delete e.dataset.auto; }); }));
  vorlEl.addEventListener("input",()=>vorlageAnwenden(vorlEl.value,false)); }
 function setzeChip(id,label){ const e=q("#"+id); if(!e||!label) return; e.value=label; const g=pdp.querySelector(`.chips[data-fuer="${id}"]`); if(g) g.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.opt===label?"true":"false")); }
 const formFeld=pdp.querySelector(".kp-form"); if(formFeld) formFeld.hidden=st.design!=="klassik";
 const fz=q("#kpZoom"); if(fz){ fz.addEventListener("input",()=>{ const z=parseFloat(fz.value); const c=cards[aktiv]||cards[0]; if(c) c.map.setZoom(z); }); }
 window.addEventListener("resize",()=>cards.forEach(c=>{ c.map.resize(); kpRender(c,stFuer(c),c.bsp); }));
 if(document.fonts&&document.fonts.ready) document.fonts.ready.then(()=>cards.forEach(c=>kpRender(c,stFuer(c),c.bsp)));
 /* Vor dem Cart: offene Adressen aufloesen und je Poster einen Kartenausschnitt hochladen (Kennung in "Vorschau") */
 const knopf=q("#inKorb");
 const knopfStand=()=>{ if(!knopf) return; const leer=cards.some(c=>{ const e=felder(c.i,"q"); return e&&!kpSauber(e.value); }); knopf.classList.toggle("kp-wartet",leer); knopf.title=leer?"Enter your location first":""; };
 cards.forEach(c=>{ const e=felder(c.i,"q"); if(e) e.addEventListener("input",knopfStand); }); knopfStand();
 if(knopf){ let laeuft=false;
  knopf.addEventListener("click",async(ev)=>{
   if(knopf.dataset.kpOk==="1"){ delete knopf.dataset.kpOk; return; }   /* zweiter Klick nach dem Hochladen: durchlassen */
   const orte=cards.map(c=>felder(c.i,"q")).filter(Boolean);
   if(orte.some(e=>!kpSauber(e.value))) return;   /* der normale Kaufknopf zeigt den Fehler am Feld */
   ev.stopImmediatePropagation(); ev.preventDefault(); if(laeuft) return; laeuft=true;
   const alt=knopf.textContent; knopf.textContent="Saving preview …"; knopf.disabled=true;
   try{
    for(const c of cards){ const e=felder(c.i,"q"); if(c.dirty||!c.geo){ await geocode(c,e.value); } }
    await Promise.all(cards.map(async c=>{ const k=JSON.stringify(zusammen(c)); if(c.kennung&&c.stand===k) return;
     try{ const bild=kpSchnappschuss(c); if(!bild||!window.WALLERIA_KUNDENBILD) return;
      const r=await Promise.race([fetch(window.WALLERIA_KUNDENBILD,{method:"POST",headers:{"Content-Type":"application/json","apikey":window.SUPABASE_KEY},body:JSON.stringify({produkt:pdp.dataset.id||"karte",bild})}).then(x=>x.json()),new Promise(res=>setTimeout(()=>res(null),9000))]);
      if(r&&r.ergebnis==="ok"){ c.kennung=r.kennung; c.stand=k; } }catch(err){} }));
    schreiben(); cards.forEach(c=>{ const eV=q("#kpVor"+c.i); if(eV&&c.kennung) eV.value=c.kennung; });
   } finally { knopf.textContent=alt; knopf.disabled=false; laeuft=false; knopf.dataset.kpOk="1"; knopf.click(); }
  },true); }
 function kpSchnappschuss(c){ try{ const src=c.map.getCanvas(); const w=Math.min(720,src.width), h=Math.round(src.height*w/src.width); const cv=document.createElement("canvas"); cv.width=w; cv.height=h; const g=cv.getContext("2d"); g.fillStyle=KP_STYLES[st.stil].bg; g.fillRect(0,0,w,h); g.drawImage(src,0,0,w,h);
   /* Mark the centre so you can see on the preview where the marker is located */
   if(st.pin){ g.fillStyle=KP_STYLES[st.stil].pin; g.beginPath(); g.arc(w/2,h/2,Math.max(4,w*0.012),0,Math.PI*2); g.fill(); }
   return cv.toDataURL("image/jpeg",0.82); }catch(e){ return ""; } }
 return {cards,st};
};

/* ------------------------------------------------------------------ Print page */
window.karteDruck=function(cfg,breite,hoehe){
 const wrap=document.getElementById("karteDruck"); if(!wrap||!window.maplibregl) return;
 const st={design:cfg.de||"klassik",form:cfg.fo||"quadrat",stil:cfg.st||"linie",schrift:cfg.sc||"script",pin:cfg.pin===undefined?1:cfg.pin};
 wrap.style.width=KP_REF+"px"; wrap.innerHTML=kpPosterHTML();
 const poster=wrap.querySelector(".kp-poster"); poster.style.aspectRatio=(breite||50)+"/"+(hoehe||70); poster.style.boxShadow="none";
 const map=new maplibregl.Map({container:wrap.querySelector(".map"),style:kpStyle(st.stil),center:[cfg.lo,cfg.la],zoom:cfg.z,interactive:false,attributionControl:false,preserveDrawingBuffer:true,fadeDuration:0,maxCanvasSize:[16384,16384]});
 const c={el:wrap,map,cfg:{t:cfg.t||"",n1:cfg.n1||"",n2:cfg.n2||"",d:cfg.d||""},center:{lat:cfg.la,lng:cfg.lo},city:cfg.ci||""};
 kpRender(c,st,null);
 /* Only when fonts and first tiles are loaded, adjust the map to the final container size
    (aspect-ratio/Schriften aendern das Layout nach dem Erzeugen) und auf den naechsten Leerlauf warten */
 const schriften=(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve());
 map.once("idle",()=>{ schriften.then(()=>{ kpRender(c,st,null); map.resize(); map.once("idle",()=>{ kpRender(c,st,null); window.__karte_fertig=true; }); map.triggerRepaint(); }); });
 window.__karte=c;
};
})();

function toast(t){const el=q("#toast"); el.textContent=t; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),2200);} window.toast=toast;
/* Fehler direkt am Feld: rot markieren, hinscrollen, Text unter dem Feld - statt kleiner Meldung unten (16.09.2026) */
function feldFehler(el,text){ const w=el.closest(".field")||el.parentElement; if(!w){ toast(text); return; }
  w.classList.add("fehler"); let m=w.querySelector(".feld-fehler");
  if(!m){ m=document.createElement("span"); m.className="feld-fehler"; w.appendChild(m); }
  m.textContent=text; w.scrollIntoView({block:"center",behavior:"smooth"});
  try{ if(el.type!=="hidden") el.focus({preventScroll:true}); }catch(e){}
  const weg=()=>{ w.classList.remove("fehler"); m.remove(); };
  ["input","change"].forEach(ev=>el.addEventListener(ev,weg,{once:true}));
  w.addEventListener("click",e=>{ if(e.target.closest("button")) weg(); },{once:true}); }
window.feldFehler=feldFehler;
let korb=[]; try{korb=JSON.parse(localStorage.getItem("jmp_korb")||"[]");}catch(e){}
function korbSpeichern(){try{localStorage.setItem("jmp_korb",JSON.stringify(korb));}catch(e){}}
/* Volume discount on digital files - the same tiers as in the Etsy shop
   (dort per Code JMP30/JMP50, hier ohne Eingabe direkt im Cart). */
const DIGI_STUFEN=[{ab:5,anteil:0.50},{ab:3,anteil:0.30}];
function istDigital(k){ return /Digitale Datei/i.test(k.groesse||""); }
/* Posten fuer walleria-kasse - EINE Quelle fuer Cart-Direktkasse und Kassenseite (23.09.2026).
   Preis in EURO (der Server rechnet selbst in Cent) und alle Angaben, sonst weiss der Renderer nicht, was aufs Poster soll. */
function postenAusKorb(){ return korb.map(k=>({produkt:k.produkt||"",titel:k.titel,preis:Math.round(k.preis*100)/100,menge:k.menge||1,digital:/Digitale Datei/i.test(k.groesse||""),groesse:k.groesse||"",name:k.name||"",angaben:k.angaben||[],zusatz:[k.beschriftung,(k.farbe?("Farbe: "+k.farbe):"")].filter(Boolean).join(" · ")||k.groesse||""})); }
/* Real Etsy reviews for the cart, in the original language */
const KORB_STIMMEN={de:["Printing worked out perfectly","Very beautiful. Looks great in a picture frame","Super cute design! Would definitely buy again!","Quick response to questions, very punctual shipping and friendly customer service.","Everything worked out great, beautiful print result.","Great poster! Perfect for the kids’ room."],en:["The digital image was provided immediately in all of the dimensions described. It printed and framed beautifully.","Exactly what was advertised, loved it!","Easy to download and made a print on Shutterfly. Looks great!"]};
function korbFuss(){ const e=q("#korbEinw"); if(e) e.hidden=!korb.some(istDigital); const tb=q("#korbTrust"); if(tb) tb.hidden=!korb.length;
  const st=q("#korbStimme"); if(st&&!st.textContent){ const l=KORB_STIMMEN[window.SPRACHE==="en"?"en":"de"]; const en=window.SPRACHE==="en"; st.textContent=(en?"“":"„")+l[Math.floor(Math.random()*l.length)]+(en?"”":"“"); }
  const kb=q("#kasse"); if(kb&&!kb.dataset.laeuft) kb.disabled=!korb.length; }
function digiRabatt(korb){
  const n=korb.filter(istDigital).length;
  const stufe=DIGI_STUFEN.find(x=>n>=x.ab);
  if(!stufe) return {anteil:0,anzahl:n,betrag:0,naechste:DIGI_STUFEN[1]};
  /* Rabatt je Posten auf Cent gerundet - genau wie der Server (sonst 1 Cent Abweichung) */
  const betrag=korb.filter(istDigital).reduce((a,k)=>{ const c=Math.round(k.preis*100); return a+(c-Math.max(50,Math.round(c*(1-stufe.anteil))))/100; },0);
  const hoeher=DIGI_STUFEN.find(x=>x.ab>stufe.ab && x.anteil>stufe.anteil)||null;
  return {anteil:stufe.anteil,anzahl:n,betrag:betrag,naechste:hoeher};
}
/* Aktive Hinweise fuer Cart und Kasse: Rabattstufe und Gratisversand (Julian, 04.09.2026) */
const VERSAND=3.90, VERSANDFREI=60;
/* Etikett je Posten: digital oder Druck - im Korb auf einen Blick unterscheidbar (Julian, 04.09.2026) */
function artEtikett(k){ return istDigital(k)?'<span class="art art-digital">Digital · by email</span>':'<span class="art art-druck">Printed · 3–5 business days</span>'; }
function groesseKurz(k){ return istDigital(k)?"JPG in 5 sizes up to 50×70 cm":k.groesse; }
/* Stueckzahl nur fuer gedruckte Poster - digitale Dateien gibt es einmal (Julian, 04.09.2026) */
function mengeSteuer(i,m){ return `<span class="menge" aria-label="Quantity"><button type="button" data-minus="${i}" aria-label="One less"${m<=1?" disabled":""}>−</button><b>${m}</b><button type="button" data-plus="${i}" aria-label="One more"${m>=20?" disabled":""}>+</button></span>`; }
function mengeHandler(root,dann){
  root.querySelectorAll("[data-plus]").forEach(b=>b.addEventListener("click",()=>{ const k=korb[+b.dataset.plus]; if(k){ k.menge=Math.min(20,(k.menge||1)+1); dann(); } }));
  root.querySelectorAll("[data-minus]").forEach(b=>b.addEventListener("click",()=>{ const k=korb[+b.dataset.minus]; if(k){ k.menge=Math.max(1,(k.menge||1)-1); dann(); } }));
}
function korbHinweise(korb){
  const r=digiRabatt(korb); const zeilen=[];
  if(r.anteil) zeilen.push('<span>'+"Volume discount on {N} digital files".replace("{N}",r.anzahl)+' <b>&minus;'+Math.round(r.anteil*100)+'&nbsp;%</b></span><b>&minus;'+eur(r.betrag)+'</b>');
  if(r.naechste && r.anzahl>0){ const fehlt=r.naechste.ab-r.anzahl;
    zeilen.push('<span class="muted">'+(fehlt===1?"One more digital file until {P} % off":"{N} more digital files until {P} % off").replace("{N}",fehlt).replace("{P}",Math.round(r.naechste.anteil*100))+(r.anteil?' '+"(instead of {P} %)".replace("{P}",Math.round(r.anteil*100)):'')+'</span>'); }
  const druck=korb.some(k=>!istDigital(k));
  if(druck){ const s=korb.reduce((a,k)=>a+k.preis*(k.menge||1),0)-r.betrag; const fehlt=VERSANDFREI-s;
    zeilen.push(fehlt>0?'<span class="muted">'+"Only {B} to go until free shipping".replace("{B}",'<b>'+eur(fehlt)+'</b>')+'</span>':'<span class="muted">Free shipping ✓</span>'); }
  return zeilen.map(z=>'<div class="korb-rabatt">'+z+'</div>').join("");
}
window.digiRabatt=digiRabatt;

function korbZeigen(){const ul=q("#korbListe"); if(!ul) return; ul.innerHTML=""; let s=0;
  if(!korb.length) ul.innerHTML='<li class="empty">Your cart is empty.</li>';
  korb.forEach((k,i)=>{const m=k.menge||1; s+=k.preis*m; const li=document.createElement("li"); const info=(window.PRODUKT_INFO||{})[k.produkt]; const href=esc((info&&info.u)||k.url||""); const bildKey=(info&&info.f)?("f_"+k.produkt):(k.img||"");
    li.innerHTML=`${href?`<a href="${href}" class="korb-bild${(info&&info.s)?" set":""}">`:`<span class="korb-bild${(info&&info.s)?" set":""}">`}<img data-k="${bildKey}" alt="${esc(k.titel)}">${href?"</a>":"</span>"}<div class="t"><b>${href?`<a href="${href}">${esc(k.titel)}</a>`:esc(k.titel)}</b>${artEtikett(k)}<small>${esc(groesseKurz(k))}${k.beschriftung?" · "+esc(k.beschriftung):(k.name?" · "+esc(k.name):"")}${k.farbe?" · "+esc(k.farbe):""}</small>${istDigital(k)?"":mengeSteuer(i,m)}</div><b>${eur(k.preis*m)}</b><button class="btn line" style="padding:4px 8px;min-height:32px" data-del="${i}" aria-label="Remove">✕</button>`; ul.appendChild(li);});
  mengeHandler(ul,()=>{korbSpeichern();korbZeigen();});
  const r=digiRabatt(korb);
  const zeile=q("#korbRabatt");
  if(zeile){ const h=korb.length?korbHinweise(korb):""; zeile.hidden=!h; zeile.innerHTML=h; zeile.className=h?"korb-hinweise":"korb-rabatt"; }
  q("#korbSumme").textContent=eur(s-r.betrag); q("#cartN").textContent=korb.reduce((a,k)=>a+(k.menge||1),0); bilderSetzen(ul);
  ul.querySelectorAll("[data-del]").forEach(b=>b.addEventListener("click",()=>{korb.splice(+b.dataset.del,1);korbSpeichern();korbZeigen();})); korbFuss();}
function bilderSetzen(root){
  /* Ohne IMGMAP (lokale Auslieferung) liegen die Bilder als Dateien unter img/ -
     previously the function exited here and the cart remained without images. */
  (root||document).querySelectorAll("img[data-k]").forEach(im=>{
    if(im.getAttribute("src")) return;
    const k0=im.dataset.k; if(!k0) return;
    if(window.IMGMAP){
      let k=k0; if(!IMGMAP[k] && /^g_e\\d+_\\d$/.test(k)) k="c_"+k.slice(2,-2);
      if(IMGMAP[k]){ im.src=IMGMAP[k]; return; }
      if(window.IMGMAP_ONLY) return;
    }
    im.src=bildUrl(k0);
  });
}

/* ---------- Mobile: room scene via button ---------- */
function raumKnoepfe(){
  if(!window.matchMedia||!matchMedia("(hover:none)").matches) return;
  document.querySelectorAll(".card").forEach(c=>{
    const box=c.querySelector(".img"); if(!box||box.querySelector(".szene-an")) return;
    if(!c.querySelector("img.szene")) return;
    const b=document.createElement("button");
    b.type="button"; b.className="szene-an";
    b.innerHTML='<svg class="ico" aria-hidden="true"><use href="#i-eye"/></svg>';
    b.setAttribute("aria-label","View poster in the kids’ room");
    b.setAttribute("aria-pressed","false");
    b.addEventListener("click",ev=>{ev.preventDefault(); ev.stopPropagation();
      const an=c.classList.toggle("raum");
      b.setAttribute("aria-pressed",an?"true":"false");
      b.setAttribute("aria-label",an?"View design only":"View poster in the kids’ room");});
    box.appendChild(b);
  });
}

/* ---------- Mobile: fixed purchase bar on the product page ---------- */
function kaufbalken(){
  const pdp=q(".pdp"), knopf=q("#inKorb"); if(!pdp||!knopf) return;
  document.body.classList.add("pdp-seite");
  const bar=document.createElement("div");
  bar.className="kaufbar";
  bar.hidden=false;   /* feste Kaufleiste seit 16.09.2026 wieder an (Vorbild famwalls) - zeigt sich, sobald der echte Kaufknopf nicht im Bild ist */
  /* Zwei Zustaende wie bei famwalls (Julian, 16.09.2026): oben auf der Seite nur "Personalise now",
     then in the configurator "Vorschau" + "Add to cart", below it a narrow line with price and delivery */
  const istPers=pdp.dataset.pers==="1";
  bar.innerHTML='<div class="kb-reihe"><button class="btn" type="button" id="kbStart">» '+(istPers?"Personalise now":"Select now")+'</button>'
    +'<button class="btn line" type="button" id="kbVorschau">Vorschau</button><button class="btn" type="button" id="kbKauf">Add to cart</button></div><small class="kb-note" id="kbNote"></small>';
  bar.classList.add("start");
  document.body.appendChild(bar);
  const kbN=bar.querySelector("#kbNote");
  const auffrischen=()=>{ const p=q("#preis"); const preis=p?p.textContent.trim():"";
    const akt=q("#groessen .on")||q("#groessen [aria-pressed=true]")||q("#groessen button.on");
    const artDig=q('input[name=art][value=digital]'); const istDig=artDig&&artDig.checked;
    const gr=akt&&akt.firstChild&&akt.firstChild.textContent?akt.firstChild.textContent.trim()+" cm":"";
    const fr=(document.querySelector(".pdp")||{dataset:{}}).dataset.frist;
    kbN.textContent=istDig?(preis+" · Digital file by email, "+(fr?("within "+fr):"within 24 hours at the latest")):(preis+(gr?" · "+gr:"")+" · with you by "+fmtTag(lieferFenster().bis)); };
  document.querySelectorAll('input[name=art]').forEach(r=>r.addEventListener("change",auffrischen));
  document.addEventListener("walleria:preis",auffrischen);
  auffrischen();
  const konfig=()=>(q("#art")&&q("#art").closest(".block"))||q("#groessen")||knopf;
  bar.querySelector("#kbStart").addEventListener("click",()=>{ const z=konfig(); window.scrollTo({top:z.getBoundingClientRect().top+scrollY-72,behavior:"smooth"}); });
  bar.querySelector("#kbVorschau").addEventListener("click",()=>{ const lm=q("#liveMain");
    if(lm && !lm.hidden){ lm.scrollIntoView({block:"center",behavior:"smooth"}); }
    else if(window.lbOeffnen){ window.lbOeffnen(); }
    else { const g=q("#galMain"); if(g) g.scrollIntoView({block:"center",behavior:"smooth"}); } });
  bar.querySelector("#kbKauf").addEventListener("click",()=>{knopf.click();});
  /* Mobile: name fields directly below the live preview - previously they were far below the poster,
     man tippte the name blind (Julian, 04.09.2026). Auf dem Desktop bleibt die Aufteilung. */
  try{
    const felder=q(".pers-felder"), live=q("#liveMain"), gal=q(".pdp .gal");
    /* Without live preview, the same applies to all personalisable posters: fields directly below the images */
    /* Anker ist immer die ganze Galerie, damit die Vorschaubilder wie bei allen Artikeln direkt unter dem Hauptbild bleiben (Julian, 05.09.2026) */
    const anker=gal||live;
    /* Handy: Live-Vorschau direkt ueber die Namensfelder ziehen, damit man the name nicht blind tippt (16.09.2026) */
    if(live && felder && schmal()){ felder.insertAdjacentElement("beforebegin",live); live.classList.add("bei-feldern");
      /* Karten-Poster: oben zeigt die Galerie das erste Foto, also auch dessen Thumb markieren (18.09.2026) */
      if(pdp.dataset.id&&pdp.dataset.id.startsWith("karte")){ const tl=pdp.querySelector(".thumbs [data-live]"), t1=pdp.querySelector(".thumbs [data-k]"); if(tl) tl.setAttribute("aria-pressed","false"); if(t1) t1.setAttribute("aria-pressed","true"); } }
    if(false && felder && anker && matchMedia("(max-width:900px)").matches){   /* seit 16.09.2026 aus: Titel, Preis, Groesse zuerst, Felder danach */
      const hs=document.createElement("h3"); hs.className="pers-titel"; hs.textContent="Personalisieren";
      anker.insertAdjacentElement("afterend",felder); felder.insertAdjacentElement("beforebegin",hs); felder.classList.add("bei-vorschau");
      /* Name field to the very top - "For how many children?" comes after */
      const huelle=el=>{ let w=el; while(w&&w.parentElement&&w.parentElement!==felder) w=w.parentElement; return (w&&w.parentElement===felder)?w:null; };
      const w1=huelle(q("#kName")), w2=huelle(q("#kName2"));
      if(w1) felder.insertAdjacentElement("afterbegin",w1);
      if(w1&&w2) w1.insertAdjacentElement("afterend",w2);   /* zweiter Name direkt unter dem ersten, Umschalter danach */
    }
  }catch(e){}
  const beob=new MutationObserver(auffrischen);
  const pr=q("#preis"); if(pr) beob.observe(pr,{childList:true,characterData:true,subtree:true});
  const gr=q("#groessen"); if(gr) beob.observe(gr,{attributes:true,subtree:true,attributeFilter:["class","aria-pressed"]});
  const pruefen=()=>{ const r=knopf.getBoundingClientRect();
    /* Leiste immer da; nur wenn der echte Kaufknopf im Bild ist, weicht sie (sonst zwei gleiche Knoepfe uebereinander) */
    const sichtbar=r.bottom>0 && r.top<innerHeight;
    const kz=konfig().getBoundingClientRect().top;
    const imKonfigurator=kz<innerHeight*0.6;
    const ausgefuellt=[...pdp.querySelectorAll("[data-pers-feld]:not([type=hidden])")].some(e=>e.value&&e.value.trim());   /* versteckte Vorgabefelder (Auswahl-Knoepfe, Karten-Konfiguration) zaehlen nicht als ausgefuellt */
    bar.classList.toggle("start", !(imKonfigurator||ausgefuellt));
    bar.classList.toggle("zeig", !sichtbar); };
  pdp.addEventListener("input",pruefen);
  addEventListener("scroll",pruefen,{passive:true});
  addEventListener("resize",pruefen,{passive:true});
  pruefen(); setTimeout(pruefen,600);
  pruefen();
}


/* ---------- Mobile: menu behind the burger ---------- */
function handyMenue(){
  const b=q(".burger"), quelle=q(".menu"); if(!b||!quelle) return;
  if(q("#navPanel")) return;
  const hg=document.createElement("div"); hg.className="nav-hg"; hg.id="navHg";
  const p=document.createElement("nav"); p.className="nav-panel"; p.id="navPanel";
  p.setAttribute("aria-label","Main menu"); p.setAttribute("aria-hidden","true");
  const kopf=document.createElement("div"); kopf.className="np-kopf";
  kopf.innerHTML='<span class="np-titel">Menu</span><button class="np-zu" type="button" aria-label="Menu schließen"><svg class="ico" aria-hidden="true"><use href="#i-x"/></svg></button>';
  p.appendChild(kopf);
  const liste=document.createElement("div"); liste.className="np-liste";
  quelle.querySelectorAll("a").forEach(a=>{const k=a.cloneNode(true); liste.appendChild(k);});
  p.appendChild(liste);
  const fuss=document.createElement("div"); fuss.className="np-fuss";
  const dazu=[["So geht's","so-gehts"],["FAQs","haeufige-fragen"],["Bestellung verfolgen","bestellung"],["Shipping & returns","versand"],["About us","ueber-uns"]];
  const vorhanden=new Set([...document.querySelectorAll("footer a")].map(a=>a.getAttribute("href")));
  const basis=(quelle.querySelector("a")||{}).getAttribute? (quelle.querySelector("a").getAttribute("href")||"").replace(/[^/]*$/,"") : "";
  dazu.forEach(([t,ziel])=>{ const href=basis+ziel; if(!vorhanden.has(href)) return;
    const a=document.createElement("a"); a.href=href; a.textContent=t; fuss.appendChild(a); });
  if(fuss.children.length) p.appendChild(fuss);
  document.body.appendChild(hg); document.body.appendChild(p);

  let offen=false, zuletzt=null;
  const auf=()=>{ zuletzt=document.activeElement; offen=true;
    hg.classList.add("an"); p.classList.add("an");
    p.setAttribute("aria-hidden","false"); b.setAttribute("aria-expanded","true");
    document.documentElement.classList.add("nav-offen");
    const e=p.querySelector("a,button"); if(e)e.focus(); };
  const zu=()=>{ if(!offen)return; offen=false;
    hg.classList.remove("an"); p.classList.remove("an");
    p.setAttribute("aria-hidden","true"); b.setAttribute("aria-expanded","false");
    document.documentElement.classList.remove("nav-offen");
    if(zuletzt&&zuletzt.focus)zuletzt.focus(); };
  b.setAttribute("aria-expanded","false"); b.setAttribute("aria-controls","navPanel");
  b.addEventListener("click",e=>{e.preventDefault(); offen?zu():auf();});
  kopf.querySelector(".np-zu").addEventListener("click",zu);
  hg.addEventListener("click",zu);
  addEventListener("keydown",e=>{if(e.key==="Escape")zu();});
  p.querySelectorAll("a").forEach(a=>a.addEventListener("click",zu));
}


/* ---------- Bestellung verfolgen (ohne Konto) ---------- */
function bestellStatus(){
  const form=q("#bestForm"); if(!form) return;
  const ausgabe=q("#bestErgebnis"), knopf=q("#bestBtn");
  const TEXTE={offen:"Zahlung ausstehend",bezahlt:"Paid – we’re preparing the print",
               im_druck:"Im Druck",versandt:"Versandt",storniert:"Storniert"};
  /* ID only for rate limiting, purely random and local */
  let kennung=null;
  try{ kennung=localStorage.getItem("walleria_abfrage"); }catch(e){}
  if(!kennung){ kennung="k"+Math.random().toString(36).slice(2)+Date.now().toString(36);
    try{ localStorage.setItem("walleria_abfrage",kennung); }catch(e){} }

  const zeige=(html,art)=>{ ausgabe.hidden=false; ausgabe.className="best-ausgabe "+(art||""); ausgabe.innerHTML=html; };

  form.addEventListener("submit",async ev=>{
    ev.preventDefault();
    const nr=q("#bestNr").value.trim().toUpperCase(), mail=q("#bestMail").value.trim();
    if(!nr||!mail) return;
    knopf.disabled=true; knopf.textContent="Checking …";
    try{
      const r=await fetch(window.SUPABASE_URL+"/rest/v1/rpc/walleria_bestellung_status",{
        method:"POST",
        headers:{apikey:window.SUPABASE_KEY,Authorization:"Bearer "+window.SUPABASE_KEY,"Content-Type":"application/json"},
        body:JSON.stringify({p_nummer:nr,p_email:mail,p_kennung:kennung})});
      const d=await r.json();
      if(!d||d.ok!==true){
        const grund=d&&d.fehler;
        if(grund==="zu_viele_versuche") zeige("<b>Too many attempts.</b><p>Please wait five minutes and try again.</p>","warn");
        else if(grund==="zu_alt") zeige("<b>This order is older than twelve months.</b><p>Get in touch <a href='mailto:"+window.WALLERIA_MAIL+"'>"+window.WALLERIA_MAIL+"</a>, we’ll check for you.</p>","warn");
        else zeige("<b>We can’t find an order for this.</b><p>Please check your order number and email address. Both must belong to the same order.</p>","warn");
        return;
      }
      const posten=(d.posten||[]).map(p=>{
        const teile=[p.groesse,p.name?("Name: "+p.name):"",p.farbe].filter(Boolean).join(" · ");
        return "<li><b>"+esc(p.titel||"Poster")+"</b>"+(teile?"<small>"+esc(teile)+"</small>":"")+(p.menge>1?"<span>"+p.menge+"×</span>":"")+"</li>";
      }).join("");
      const summe=d.summe_cent!=null?(d.summe_cent/100).toFixed(2).replace(".",",")+" €":"";
      /* Digitale Dateien: eigener Weg statt Druck/Shipping (Julian, 04.09.2026: "can’t download it anywhere") */
      const istDigital=p=>!!p.digital||/Digitale Datei/i.test(p.groesse||"");
      const digital=(d.posten||[]).some(istDigital), nurDigital=(d.posten||[]).length&&(d.posten||[]).every(istDigital);
      const T=Object.assign({},TEXTE); if(nurDigital) T.bezahlt="Paid – your files are being created";
      const schritte=nurDigital?["bezahlt","dateien"]:["bezahlt","im_druck","versandt"];
      const jetzt=Math.max(0,schritte.indexOf(d.status));
      const leiste=schritte.map((s,i)=>'<span class="'+(i<=jetzt?"an":"")+'" data-schritt="'+s+'">'+(s==="dateien"?"Dateien fertig":TEXTE[s].split(" – ")[0])+"</span>").join("");
      const dateienBlock=digital?'<section class="best-dateien" id="bestDateien"><h3>Your files</h3><p class="small" id="bestDateienStand">Fetching your files …</p><div id="bestDateienListe"></div></section>':"";
      zeige(
        '<div class="best-kopf"><span class="best-nr">'+esc(d.nummer)+'</span><b class="best-status s-'+d.status+'">'+(T[d.status]||d.status)+"</b></div>"+
        (d.status!=="storniert"?'<div class="best-leiste">'+leiste+"</div>":"")+
        "<dl class=\"best-daten\"><dt>Ordered on</dt><dd>"+esc(d.bestellt_am||"–")+"</dd>"+
        (d.bezahlt_am?"<dt>Paid on</dt><dd>"+esc(d.bezahlt_am)+"</dd>":"")+
        (d.versandt_am?"<dt>Shipped on</dt><dd>"+esc(d.versandt_am)+"</dd>":"")+
        (summe?"<dt>Summe</dt><dd>"+summe+"</dd>":"")+
        (d.sendungsnr?"<dt>Sendungsnummer</dt><dd>"+esc(d.sendungsnr)+(d.versanddienst?" ("+esc(d.versanddienst)+")":"")+"</dd>":"")+
        "</dl>"+(posten?"<h3>Your items</h3><ul class=\"best-posten\">"+posten+"</ul>":"")+dateienBlock,"ok");
      if(digital) dateienHolen(nr,mail,1);
    }catch(e){
      zeige("<b>That didn’t quite work.</b><p>Please try again in a moment.</p>","warn");
    }finally{
      knopf.disabled=false; knopf.textContent="Show status";
    }
  });

  /* Download links like on the thank you page: number + email are the key */
  async function dateienHolen(nummer,mail,versuch){
    const stand=q("#bestDateienStand"), liste=q("#bestDateienListe"); if(!stand||!window.WALLERIA_DOWNLOAD) return;
    try{
      const r=await fetch(window.WALLERIA_DOWNLOAD,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nummer,email:mail})});
      const d=await r.json();
      if(!d||d.ok!==true){ stand.textContent=d&&d.fehler==="nicht_bezahlt"?"Payment is not yet confirmed.":"Files currently unavailable – drop us a quick message and we’ll send them to you."; return; }
      const fertig=(d.pakete||[]).filter(x=>x.zustand==="fertig");
      if(!fertig.length){
        stand.textContent="Your posters are being drawn right now – this usually only takes a few minutes, and you’ll receive the download link via email within 24 hours at the latest. This page updates automatically.";
        if(versuch<20) setTimeout(()=>dateienHolen(nummer,mail,versuch+1),12000); else stand.textContent="This is taking a little longer. You’ll receive the download link via email – within 24 hours at the latest.";
        return;
      }
      stand.textContent="Done – here are your files. Die Links gelten sieben Tage; danach einfach hier neu abrufen.";
      const s2=q('#bestErgebnis [data-schritt="dateien"]'); if(s2) s2.classList.add("an");
      const st=q("#bestErgebnis .best-status"); if(st&&/Dateien werden erstellt/.test(st.textContent)) st.textContent="Paid – files ready";
      liste.innerHTML='<div class="datei-liste">'+fertig.map(pk=>pk.dateien.map(f=>'<div class="datei"><span><b>'+esc(f.name)+"</b>"+(pk.titel?"<small>"+esc(pk.titel)+"</small>":"")+"</span>"+'<a class="btn" href="'+f.url+'" download>Herunterladen</a></div>').join("")).join("")+"</div>";
    }catch(e){ stand.textContent="That didn’t work. Please reload the page."; }
  }

  /* Take number from the confirmation page */
  const p=new URLSearchParams(location.search).get("bestellung");
  if(p) q("#bestNr").value=p;
}


/* Filter groups: closed on mobile, open on computer. Remembers the choice. */
function filterGruppen(){
  const grp=[...document.querySelectorAll(".fgrp")]; if(!grp.length) return;
  const schmalJetzt=schmal();
  let gemerkt=null;
  try{ gemerkt=JSON.parse(localStorage.getItem("walleria_filter")||"null"); }catch(e){}
  grp.forEach(d=>{
    const k=d.dataset.grp;
    if(gemerkt && k in gemerkt) d.open=!!gemerkt[k];
    else d.open=!schmalJetzt;                       /* Voreinstellung nach Bildschirmbreite */
    d.addEventListener("toggle",()=>{
      const stand={}; grp.forEach(x=>stand[x.dataset.grp]=x.open);
      try{ localStorage.setItem("walleria_filter",JSON.stringify(stand)); }catch(e){}
    });
  });
}


/* ---------- Visitor count: no cookie, no recognition ---------- */
function werbeKennung(){
  /* Where did the click come from? Only the four utm fields, only harmless characters.
     Is sent exclusively with the landing page - no remembering via
     across pages, so no storage on the visitor’s device. */
  try{
    const q=new URLSearchParams(location.search);
    const teile=["utm_source","utm_medium","utm_campaign","utm_content"]
      .map(k=>(q.get(k)||"").replace(/[^A-Za-z0-9_.-]/g,"").slice(0,40));
    /* Google-Ads-Klicks tragen kein utm, nur gclid/gbraid/wbraid (Performance Max aus dem Merchant Center) -
       until now, they ended up as "direkt" in der Statistik (21.09.2026). Kennung selbst wird NICHT gespeichert. */
    if(!teile[0] && (q.has("gclid")||q.has("gbraid")||q.has("wbraid"))) return "google/cpc/ads";
    if(!teile[0]) return null;
    return teile.join("/").replace(/\/+$/,"");
  }catch(e){ return null; }
}

function zaehlen(){
  const ziel=window.WALLERIA_ZAEHLER; if(!ziel) return;
  if(navigator.doNotTrack==="1"||navigator.globalPrivacyControl===true) return;
  try{ if(localStorage.getItem("walleria_nicht_zaehlen")==="1") return; }catch(e){}   /* Julians eigene Geraete */
  const kampagne=werbeKennung();
  const senden=(daten)=>{
    const rumpf=JSON.stringify(Object.assign({
      pfad:location.pathname.replace(/^\/|\.html$/g,"")||"start",
      quelle:document.referrer||"",
      breite:window.innerWidth||0,
      kampagne:kampagne||undefined
    },daten));
    /* sendBeacon still goes through when leaving the page */
    if(navigator.sendBeacon){
      try{ navigator.sendBeacon(ziel, new Blob([rumpf],{type:"application/json"})); return; }catch(e){}
    }
    fetch(ziel,{method:"POST",headers:{"Content-Type":"application/json"},body:rumpf,keepalive:true}).catch(()=>{});
  };

  window.walleriaZaehlen=senden;   /* Kaufknopf meldet echte Koerbe und abgewiesene Klicks selbst (16.09.2026) */
  senden({art:"seite"});

  /* Report dwell time when leaving */
  const start=Date.now(); let gemeldet=false;
  const abschluss=()=>{ if(gemeldet)return; gemeldet=true;
    const s=Math.round((Date.now()-start)/1000);
    if(s>=3) senden({art:"seite",dauer_s:s}); };
  addEventListener("pagehide",abschluss);
  document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="hidden") abschluss(); });

  /* Clicks on things that matter – no recording of everything */
  document.addEventListener("click",e=>{
    const a=e.target.closest("a,button"); if(!a) return;
    let was=null;
    if(a.id==="inKorb") return;   /* meldet der Kaufknopf selbst: echter Korb oder warenkorb-abgewiesen:<grund> */
    else if(a.id==="kAbsenden"||/zahlungspflichtig/i.test(a.textContent||"")) was="zur-kasse";
    else if(a.closest(".card")) was="poster:"+(a.closest(".card").querySelector("h3")||{textContent:""}).textContent.trim().slice(0,60);
    else if(a.classList.contains("kat")||a.classList.contains("tile")) was="kategorie:"+(a.textContent||"").trim().slice(0,40);
    else if(a.classList.contains("szene-an")) was="im-raum-ansehen";
    else if(a.closest("footer")) was="fuss:"+(a.textContent||"").trim().slice(0,40);
    else if(a.closest(".nav-panel")) was="menue:"+(a.textContent||"").trim().slice(0,40);
    /* Was Kundinnen waehlen - Groesse, Design, Farbe (06.09.2026) */
    else if(a.closest("#groessen")) was="groesse:"+((a.firstChild&&a.firstChild.textContent)||a.textContent||"").trim().replace(/\s+/g,"").slice(0,20);
    else if(a.closest(".designs")) was="design:"+(a.dataset.design||a.dataset.i||(a.textContent||"").trim()).toString().slice(0,30);
    else if(a.dataset.farbe) was="farbe:"+a.dataset.farbe.slice(0,20);
    if(was) senden({art:"klick",ziel:was});
  },{passive:true});
  /* Ausfuehrung (digital/gedruckt) und Search - nur DASS gesucht wurde, nicht wonach */
  document.addEventListener("change",e=>{ const r=e.target; if(r&&r.name==="art"&&r.value) senden({art:"klick",ziel:"ausfuehrung:"+r.value}); },{passive:true});
  const sf=q("#suchFeld"); if(sf){ let gez=false; sf.addEventListener("input",()=>{ if(!gez&&sf.value.trim().length>=2){ gez=true; senden({art:"klick",ziel:"suche:genutzt"}); } }); }
  /* Purchase: once per order number, with amount in cents - for the funnel on the statistics page */
  try{
    const pr=new URLSearchParams(location.search); const nr=pr.get("bestellung");
    if(location.pathname.indexOf("danke")>-1 && nr){
      const k="walleria_kauf_"+nr;
      if(!sessionStorage.getItem(k)){ sessionStorage.setItem(k,"1"); senden({art:"klick",ziel:"kauf:"+(parseInt(pr.get("betrag")||"0",10)||0)}); }
    }
  }catch(e){}
}


/* ---------- Thank you page: files ready for download immediately ---------- */
function dankeSeite(){
  const bereich=q("#dankeDownload"); if(!bereich) return;
  const p=new URLSearchParams(location.search);
  const nummer=p.get("bestellung");
  if(!nummer) return;
  /* Gekauft ist gekauft: Cart leeren, sonst liegt das Poster nach dem Kauf noch drin (04.09.2026) */
  try{ localStorage.removeItem("jmp_korb"); korb.length=0; korbZeigen(); }catch(e){}

  const nr=q("#dankeNummer");
  if(nr){ nr.hidden=false; nr.textContent="Bestellnummer "+nummer; }
  const verfolgen=q("#dankeVerfolgen");
  if(verfolgen) verfolgen.href=verfolgen.getAttribute("href")+"?bestellung="+encodeURIComponent(nummer);

  /* The browser no longer knows the email for sure after the purchase - we ask
     them once. This is also the protection: number and email must match. */
  let mail="";
  try{ mail=sessionStorage.getItem("walleria_kaufmail")||""; }catch(e){}
  bereich.hidden=false;
  const liste=q("#dankeListe"), stand=q("#dankeStatus");

  if(!mail){
    liste.innerHTML='<form class="best-form" id="dankeForm" style="border:0;padding:0">'
      +'<div class="field"><label for="dankeMail">Email address of your order</label>'
      +'<input id="dankeMail" type="email" required placeholder="du@beispiel.de"></div>'
      +'<button class="btn" type="submit">Dateien anzeigen</button></form>';
    stand.textContent="To be safe, we still need your email address.";
    q("#dankeForm").addEventListener("submit",ev=>{ ev.preventDefault();
      const m=q("#dankeMail").value.trim(); if(!m) return;
      try{ sessionStorage.setItem("walleria_kaufmail",m); }catch(e){}
      holen(nummer,m); });
    return;
  }
  holen(nummer,mail);

  async function holen(nummer,mail,versuch){
    versuch=versuch||1;
    stand.textContent = versuch===1 ? "Fetching your files …" : "Your posters are being drawn right now …";
    try{
      const r=await fetch(window.WALLERIA_DOWNLOAD,{method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({nummer,email:mail})});
      const d=await r.json();
      if(!d||d.ok!==true){
        stand.textContent = d&&d.fehler==="nicht_bezahlt"
          ? "Payment is not yet confirmed. This usually only takes a moment."
          : "We can’t find an order for this. Please check the email address.";
        return;
      }
      /* Dankeschön-Voucher (17.09.2026): kommt erst nach dem E-Mail-Abgleich vom Server */
      if(d.gutschein&&d.gutschein.code){ const g=q("#dankeGutschein"); if(g&&g.hidden){ g.hidden=false; q("#dankeCode").textContent=d.gutschein.code;
          const bis=d.gutschein.bis?new Date(d.gutschein.bis).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric"}):"";
          q("#dankeCodeInfo").textContent="Valid"+(bis?" bis "+bis:"")+" ab "+eur((d.gutschein.mindest||2500)/100)+" Order value, single use, cannot be combined with other vouchers – simply enter it at checkout. We’ve also sent the code in your order confirmation.";
          const kb=q("#dankeCodeKopieren"); if(kb) kb.addEventListener("click",()=>{ try{ navigator.clipboard.writeText(d.gutschein.code); toast("Code kopiert"); }catch(e){} }); } }
      /* The webhook only creates the voucher after payment - if it hasn’t arrived yet, check briefly */
      const gutscheinFehlt=!(d.gutschein&&d.gutschein.code);
      const h24=q("#danke24h"); if(h24) h24.hidden=!d.pakete.length;
      if(!d.pakete.length){ bereich.hidden=true; if(gutscheinFehlt&&versuch<4) setTimeout(()=>holen(nummer,mail,versuch+1),7000); return; }   /* nur gedruckte Ware */
      const fertig=d.pakete.filter(x=>x.zustand==="fertig");
      if(!fertig.length){
        stand.textContent="Your posters are being drawn right now – this usually only takes a few minutes, and you’ll receive the download link via email within 24 hours at the latest. "
          +"This page updates automatically, but you can also close it.";
        if(versuch<20) setTimeout(()=>holen(nummer,mail,versuch+1), 12000);
        else stand.textContent="This is taking a little longer. You’ll receive the download link via email – within 24 hours at the latest.";
        return;
      }
      stand.textContent="Done – here are your files.";
      if(gutscheinFehlt&&versuch<4) setTimeout(()=>holen(nummer,mail,versuch+1),7000);
      liste.innerHTML='<div class="datei-liste">'+fertig.map(pk=>
        pk.dateien.map(f=>'<div class="datei"><span><b>'+esc(f.name)+"</b>"
          +(pk.titel?"<small>"+esc(pk.titel)+"</small>":"")+"</span>"
          +'<a class="btn" href="'+f.url+'" download>Herunterladen</a></div>').join("")
      ).join("")+"</div>";
    }catch(e){
      stand.textContent="That didn’t work. You can access your files at any time via ’track your order’.";
    }
  }
}

/* Navigation (19.09.2026, Julian: kein "More", sondern gleich das Burger-Menue): Die Leiste misst, wie breit sie
   mit allen Punkten sein muesste. Passt das nicht in die Zeile, wird der Handy-Umbruch (alle 900-px-Regeln) auf genau
   this width increased - header, preview behaviour and menu then switch together. Nothing is cut off. */
window.NAV_T=960;                                   /* nur die Kopfzeile wandert; der Seiten-Umbruch bleibt bei 900 px */
const schmal=()=>innerWidth<=900;
function navSchwelle(){
  const m=document.querySelector("nav.menu"), head=document.querySelector(".head"); if(!m||!head) return;
  if(!window._navRegeln){ window._navRegeln=[];
    for(const sh of document.styleSheets){ let regeln; try{ regeln=sh.cssRules; }catch(e){ continue; }
      for(const r of regeln){ if(!r.media) continue; const t=r.media.mediaText;
        let mm=t.match(/max-width:\s*(960)px/); if(mm){ window._navRegeln.push([r,"max",+mm[1]]); continue; }
        mm=t.match(/min-width:\s*(961)px/); if(mm) window._navRegeln.push([r,"min",+mm[1]]); } } }   /* 960/961 = Kopfzeilen-Regeln (proto3 + Desktop-Raster) */
  if(innerWidth>window.NAV_T && getComputedStyle(m).position!=="fixed"){   /* Desktop-Leiste sichtbar: jetzt messen */
    const links=[...m.querySelectorAll(":scope>a")].filter(a=>getComputedStyle(a).display!=="none");
    const gap=parseFloat(getComputedStyle(m).columnGap)||0;
    const nat=links.reduce((w,a)=>w+a.getBoundingClientRect().width,0)+gap*Math.max(0,links.length-1);
    if(!nat||!m.clientWidth) return;                  /* noch nicht gelayoutet (0 px) - sonst wuerde ein falscher Wert einrasten */
    const spalte=(m.parentElement&&m.parentElement!==head)?m.parentElement:m;   /* die flexible Rasterspalte, nicht die inhaltsbreite Leiste */
    const rest=head.getBoundingClientRect().width-spalte.getBoundingClientRect().width;   /* Logo, Werkzeuge, Abstaende, Innenabstand */
    const T=Math.max(960, Math.ceil(nat+rest)+20);   /* +20: Rollbalken/Luft; unabhaengig von der 1840-px-Deckelung */
    if(T!==window.NAV_T){ window.NAV_T=T; window._navRegeln.forEach(([r,art,orig])=>{ const B=Math.max(T,art==="max"?orig:orig-1); try{ r.media.mediaText=art==="max"?("(max-width: "+B+"px)"):("(min-width: "+(B+1)+"px)"); }catch(e){} }); }
  }
}
addEventListener("resize",()=>{ clearTimeout(window._navT); window._navT=setTimeout(navSchwelle,60); });
if(document.fonts&&document.fonts.ready) document.fonts.ready.then(navSchwelle);
addEventListener("load",navSchwelle);
function initSeite(){ navSchwelle();
  bilderSetzen();
  newsSeite();
  barLauf();
  suchen();
  dankeSeite();
  zaehlen();
  filterGruppen();
  bestellStatus();
  raumKnoepfe();
  kaufbalken();
  handyMenue();
  const cb=q("#cartBtn"); if(cb) cb.onclick=()=>q("#drawer").classList.toggle("open");
  const dc=q("#drawerClose"); if(dc) dc.onclick=()=>q("#drawer").classList.remove("open");
  /* Statistics page: exclude own device from counter */
  const sn=q("#stNicht"); if(sn){ const lesen=()=>{ try{ return localStorage.getItem("walleria_nicht_zaehlen")==="1"; }catch(e){ return false; } };
    const zeigen=()=>{ sn.textContent=lesen()?"This device is not being tracked – track again":"Exclude this device"; };
    zeigen(); sn.addEventListener("click",()=>{ try{ localStorage.setItem("walleria_nicht_zaehlen", lesen()?"0":"1"); }catch(e){} zeigen(); toast(lesen()?"This device is no longer being tracked":"This device is being tracked again"); }); }
  /* Zur Kasse: fuehrt auf die Kassenseite (vorher stand hier noch der Prototyp-Toast - Julian, 04.09.2026) */
  /* Direktkasse (Julian, 23.09.2026): Cart -> Stripe without its own checkout page. Name, address and payment only
     einmal bei Stripe (dort auch Apple Pay/PayPal mit Adresse aus dem Konto). Widerrufsverzicht fuer digitale
     Files as mandatory checkbox in the cart. The checkout page /kasse remains for old reminder links. */
  const ka=q("#kasse");
  if(ka){ const kaHtml=ka.innerHTML;
    const kaZurueck=()=>{ delete ka.dataset.laeuft; ka.disabled=!korb.length; ka.innerHTML=kaHtml; };
    window.addEventListener("pageshow",e=>{ if(e.persisted) kaZurueck(); });   /* Zurueck-Taste aus Stripe: Knopf wieder frei */
    ka.onclick=async()=>{
      if(!korb.length){ toast(tr("Your cart is still empty")); return; }
      const fe=q("#korbFehler"); if(fe){ fe.hidden=true; fe.textContent=""; }
      const digital=korb.some(istDigital), box=q("#korbEinwBox");
      if(digital&&box&&!box.checked){ feldFehler(box,tr("Just tick this box, then you can continue to checkout.")); return; }
      if(!window.STRIPE_CHECKOUT_URL){ location.href="kasse"; return; }
      ka.dataset.laeuft="1"; ka.disabled=true; ka.textContent=tr("Redirecting to Stripe …");
      try{ (window.walleriaZaehlen||function(){})({art:"klick",ziel:"zur-kasse"}); }catch(e){}
      try{ const wert=korbSumme(), items=korb.map(p=>({item_id:p.produkt||p.titel,item_name:p.titel,quantity:p.menge||1,price:Number(p.preis)}));
        if(window.gtag){ if(window.GA4_ID) gtag("event","begin_checkout",{send_to:window.GA4_ID,currency:"EUR",value:wert,items});
          if(window.GOOGLE_ADS_ID&&window.__waGads) gtag("event","begin_checkout",{send_to:window.GOOGLE_ADS_ID,currency:"EUR",value:wert,items}); }
        if(window.fbq) fbq("track","InitiateCheckout",{num_items:korb.length,value:wert,currency:"EUR"}); }catch(e){}
      try{
        const r=await fetch(window.STRIPE_CHECKOUT_URL,{method:"POST",headers:{"Content-Type":"application/json","apikey":window.SUPABASE_KEY},
          body:JSON.stringify({posten:postenAusKorb(),sprache:window.SPRACHE||"de",einwilligung_digital:!!(digital&&box&&box.checked),zurueck:location.pathname})});
        const j=await r.json(); if(j.url){ location.href=j.url; return; } throw new Error(j.fehler||j.error||"no checkout URL");
      }catch(err){ kaZurueck(); if(fe){ fe.hidden=false; fe.textContent=tr("Checkout is not reachable right now. Please try again in a moment or write to us at MAIL.").replace("MAIL",window.WALLERIA_MAIL||"hallo@walleria.de"); } }
    };
    /* Abbruch bei Stripe kommt mit ?warenkorb=1 zurueck: Cart gleich wieder offen */
    try{ const u=new URL(location.href); if(u.searchParams.get("warenkorb")==="1"){ u.searchParams.delete("warenkorb"); history.replaceState(null,"",u.pathname+(u.search||"")+u.hash); if(korb.length) q("#drawer").classList.add("open"); } }catch(e){}
    korbFuss();
  }
  korbZeigen();
  /* Hero video */
  const hv=q("#heroVideo"); if(hv&&hv.querySelector("source")){hv.muted=true; const go=()=>hv.play().then(()=>q("#hero").classList.add("has-video")).catch(()=>{}); hv.addEventListener("canplay",go,{once:true}); let gestartet=false; const start=()=>{ if(gestartet) return; gestartet=true; hv.preload="auto"; hv.load(); go(); }; if(document.readyState==="complete") setTimeout(start,900); else addEventListener("load",()=>setTimeout(start,900),{once:true}); ["pointerdown","touchstart","scroll","keydown"].forEach(ev=>addEventListener(ev,()=>{start(); if(hv.paused)go();},{passive:true,once:true}));}
  /* Homepage: Live block */
  const nameIn=q("#nameIn"), poster=q("#poster");
  if(nameIn&&poster){ npRender(poster,""); nameIn.addEventListener("input",()=>{ if(istLive(poster.dataset.design)) npRender(poster,nameIn.value); });
    document.querySelectorAll(".live .dsg").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".live .dsg").forEach(x=>x.setAttribute("aria-pressed","false")); b.setAttribute("aria-pressed","true"); poster.dataset.design=b.dataset.design; const live=istLive(b.dataset.design); q("#dsgNote").hidden=live;
      if(live) npRender(poster,nameIn.value); else { const k0="set_"+b.dataset.design+"_0"; poster.innerHTML=`<img alt="Musterposter" style="width:100%;height:100%;display:block;object-fit:cover">`; const im0=poster.querySelector("img"); if(window.IMGMAP&&IMGMAP[k0]) im0.src=IMGMAP[k0]; else im0.src=bildUrl(k0); }
      document.querySelectorAll("#begleiter img").forEach((im,i)=>{const k="set_"+b.dataset.design+"_"+(i+1); im.removeAttribute("src"); im.dataset.k=k; if(window.IMGMAP&&IMGMAP[k]) im.src=IMGMAP[k]; else im.src=bildUrl(k);});}));
    q("#liveForm").addEventListener("submit",e=>{e.preventDefault(); const z=q("#liveForm").dataset.ziel; const n=encodeURIComponent(nameIn.value.trim()); try{sessionStorage.setItem("jmp_name",nameIn.value.trim());}catch(err){} if(window.geheZu&&!z.endsWith(".html")){window.geheZu(z.replace(/^#\//,""));} else {location.href=z+"?name="+n;}}); }
  /* Product page */
  const pdp=q(".pdp"); if(pdp){ let groesse=0, farbe="";
    const istKarte=pdp.dataset.karte==="1";   /* Karten-Poster: eigene Live-Vorschau (live_karte.js) */
    const sizes=[...pdp.querySelectorAll("#groessen button")];
    let art=(pdp.querySelector('#art input:checked')||{value:"digital"}).value;
    const dig=parseFloat(q(".preis").dataset.digital||"6.99");
    const digAlt=parseFloat(q(".preis").dataset.digitalAlt||"0")||Math.round(dig/0.7*100)/100;
    /* Haustier-Poster: je weiteres Tier 7,99 EUR obendrauf (Auswahl "Anzahl der Tiere"); die Kasse rechnet mit preise.json nach */
    const zuschlag=()=>{ const a=q("#kAnzahl"); if(!a||pdp.dataset.haustier!=="1") return 0; const n=parseInt(a.value,10)||1; return Math.round((Math.min(3,Math.max(1,n))-1)*799)/100; };
    const preisZeigen=()=>{ const z=zuschlag(); pdp.querySelectorAll("#mwst [data-art]").forEach(e=>{ e.hidden=(e.dataset.art!==art); }); if(art==="digital"){ q("#preis").textContent=eur(dig+z); q("#preisAlt").textContent=eur(digAlt+z); q("#preisTag").textContent="−"+Math.round((1-dig/digAlt)*100)+" %"; } else { const b=sizes[groesse]; const alt=parseFloat(b.dataset.preis); q("#preis").textContent=eur(alt*(1-RABATT)+z); q("#preisAlt").textContent=eur(alt+z); q("#preisTag").textContent="−30 %"; } };
    pdp.querySelectorAll("#art input").forEach(r=>r.addEventListener("change",()=>{ art=r.value; pdp.querySelectorAll("#art label").forEach(l=>l.classList.toggle("on",l.contains(r))); q("#feldGroesse").hidden=(art==="digital"); q("#einw").hidden=(art!=="digital"); preisZeigen(); }));
    sizes.forEach((b,i)=>b.addEventListener("click",()=>{groesse=i; sizes.forEach((y,j)=>y.setAttribute("aria-pressed",j===i)); preisZeigen();}));
    /* Set initial state matching the preselected version */
    /* Google-Shopping-Varianten: ?art=druck|digital&groesse=50x70 waehlt Ausfuehrung und Groesse vor */
    try{ const qp=new URLSearchParams(location.search); const qa=qp.get("art");
      if(qa==="druck"||qa==="physisch"){ const r2=pdp.querySelector('#art input[value="physisch"]'); if(r2){ r2.checked=true; art="physisch"; } }
      else if(qa==="digital"){ const r1=pdp.querySelector('#art input[value="digital"]'); if(r1){ r1.checked=true; art="digital"; } }
      const qg=qp.get("groesse"); if(qg){ const norm=v=>v.replace(/\s/g,"").replace(/x/gi,"×"); const gi=sizes.findIndex(b=>norm(b.firstChild.textContent).endsWith(norm(qg))); if(gi>=0){ groesse=gi; sizes.forEach((y,j)=>y.setAttribute("aria-pressed",j===gi)); } }
    }catch(e){}
    (()=>{ const r=pdp.querySelector("#art input:checked");
      if(r) pdp.querySelectorAll("#art label").forEach(l=>l.classList.toggle("on",l.contains(r)));
      const fg=q("#feldGroesse"), ei=q("#einw");
      if(fg) fg.hidden=(art==="digital"); if(ei) ei.hidden=(art!=="digital");
      preisZeigen(); })();
    /* Lieferzeile unter dem Preis + Groessenberatung mit Sofa-Vergleich (18.09.2026) */
    const TIPPS={"13×18":"Smallest size – for shelves, bedside tables, or as part of a gallery wall.","20×25":"Compact – next to the bed, in the hallway, or lined up together.","21×30":"A4 size – the classic for picture ledges and kids’ room shelves.","30×40":"Our bestseller – fits frames close to A3, ideal above a chest of drawers or changing table.","40×50":"Makes a real statement – above the bed or as the centrepiece of a gallery wall.","50×70":"The main picture – fills an empty wall above the sofa or bed.","61×91":"Large format – needs a bit of space, looks great in the living room and hallway.","70×100":"Our largest size – a real statement piece above the sofa."};
    const lz=q("#lieferZeile");
    const fristSatz=pdp.dataset.frist?("manually checked, within "+pdp.dataset.frist):"usually within minutes, within 24 hours at the latest";
    const lieferZeigen=()=>{ if(!lz) return; if(art==="digital") lz.innerHTML='<span class="lz-punkt"></span><b>Digital file by email</b><span>'+esc(fristSatz)+' · no shipping required</span>';
      else { const f=lieferFenster(); lz.innerHTML='<span class="lz-punkt"></span><b>Dispatched in 1–3 business days</b><span>estimated delivery to you '+esc(fmtTag(f.von))+' – '+esc(fmtTag(f.bis))+' · free shipping from €60</span>'; } };
    const anzahlBl=+((q("#feldGroesse")&&q("#feldGroesse").dataset.anzahl)||1);
    const masse=b=>{ const t=((b.firstChild&&b.firstChild.textContent)||b.textContent||"").replace(/\s/g,"").replace(/^\d+×(?=\d+×)/,""); /* "6× 21×30" -> "21×30" */ const m=t.match(/(\d+)×(\d+)/); return m?[+m[1],+m[2]]:null; };
    const vergleichSVG=(w,h,n)=>{ const W=300,H=250,cols=n===6?3:n,rows=Math.ceil(n/cols),gapCm=6; const gwCm=cols*w+(cols-1)*gapCm, ghCm=rows*h+(rows-1)*gapCm;
      const S=Math.min(1.1,(H-30)/(87+14+ghCm),(W-24)/Math.max(gwCm,180)); const sofaB=180*S,rueckH=42*S,sitzH=45*S,bodenY=H-14,sofaX=(W-sofaB)/2,rueckY=bodenY-sitzH-rueckH;
      const pw=w*S,ph=h*S,gap=gapCm*S,gw=gwCm*S,gh=ghCm*S,gx=(W-gw)/2,gy=rueckY-14*S-gh; let po="";
      for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){ if(r*cols+c>=n) break; po+='<rect x="'+(gx+c*(pw+gap)).toFixed(1)+'" y="'+(gy+r*(ph+gap)).toFixed(1)+'" width="'+pw.toFixed(1)+'" height="'+ph.toFixed(1)+'" fill="#F6EFE6" stroke="#8A6E4B" stroke-width="1.6"/>'; }
      const label=n===1?(w+" × "+h+" cm"):(n+" × "+w+"×"+h+" cm"); const ly=Math.max(10,gy-6);
      return '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Größenvergleich über einem 180 cm breiten Sofa"><rect x="0" y="'+bodenY+'" width="'+W+'" height="'+(H-bodenY)+'" fill="#E4D9C8"/>'+po
        +'<text x="'+(W/2)+'" y="'+ly.toFixed(1)+'" text-anchor="middle" font-size="11" font-weight="600" fill="#2B2622">'+esc(label)+'</text>'
        +'<rect x="'+sofaX.toFixed(1)+'" y="'+rueckY.toFixed(1)+'" width="'+sofaB.toFixed(1)+'" height="'+(rueckH+sitzH).toFixed(1)+'" rx="10" fill="#CFC3B2"/><rect x="'+(sofaX+8).toFixed(1)+'" y="'+(rueckY+rueckH-6).toFixed(1)+'" width="'+(sofaB-16).toFixed(1)+'" height="'+(sitzH-10).toFixed(1)+'" rx="8" fill="#DCD1C0"/><rect x="'+(sofaX-6).toFixed(1)+'" y="'+(rueckY+rueckH-10).toFixed(1)+'" width="14" height="'+(sitzH+6).toFixed(1)+'" rx="6" fill="#C4B7A4"/><rect x="'+(sofaX+sofaB-8).toFixed(1)+'" y="'+(rueckY+rueckH-10).toFixed(1)+'" width="14" height="'+(sitzH+6).toFixed(1)+'" rx="6" fill="#C4B7A4"/>'
        +'<text x="'+(W/2)+'" y="'+(H-3)+'" text-anchor="middle" font-size="9" fill="#8A8078">Sofa 180 cm wide – posters to scale</text></svg>'; };
    const groesseZeigen=()=>{ const tp=q("#groesseTipp"), vg=q("#groesseVergleich"); if(!tp||!vg) return; const b=sizes[groesse]; const m=b&&masse(b); if(!m){ tp.textContent=""; vg.innerHTML=""; return; }
      const [w,h]=m, key=w+"×"+h; let txt=TIPPS[key]||"";
      if(anzahlBl>1){ const cols=anzahlBl===6?3:anzahlBl, rows=Math.ceil(anzahlBl/cols), bw=cols*w+(cols-1)*6, bh=rows*h+(rows-1)*6; txt="{N} posters, each {W}×{H} cm – as a {C}×{R} gallery wall about {B} cm wide and {Q} cm tall.".replace("{N}",anzahlBl).replace("{W}",w).replace("{H}",h).replace("{C}",cols).replace("{R}",rows).replace("{B}",bw).replace("{Q}",bh)+" "+(TIPPS[key]||""); }
      tp.textContent=txt; vg.innerHTML=vergleichSVG(w,h,anzahlBl); };
    sizes.forEach(b=>b.addEventListener("click",()=>{ groesseZeigen(); lieferZeigen(); }));
    pdp.querySelectorAll("#art input").forEach(r=>r.addEventListener("change",()=>{ lieferZeigen(); }));
    lieferZeigen(); groesseZeigen();
    pdp.querySelectorAll(".thumbs button").forEach(b=>b.addEventListener("click",()=>{pdp.querySelectorAll(".thumbs button").forEach(x=>x.setAttribute("aria-pressed","false")); b.setAttribute("aria-pressed","true");
      if(b.dataset.live){ const lm=q("#liveMain"); if(lm) lm.hidden=false; if(lm&&lm.classList.contains("bei-feldern")){ lm.scrollIntoView({behavior:"smooth",block:"start"}); } else { q("#galMain").hidden=true; } return; }   /* Karten-Poster: zurueck zur Live-Vorschau (Handy: Karte steht bei den Feldern -> hinscrollen) */
      const im=q("#galMain img"); const k=b.dataset.k; im.removeAttribute("src"); im.dataset.k=k; bilderSetzen(); if(!window.IMGMAP) im.src=bildUrl(k); const lm=q("#liveMain"); if(lm&&!lm.classList.contains("bei-feldern")){lm.hidden=true; q("#galMain").hidden=false;}}));
    /* Show selected design / selected colour as a photo too: the map
       data-design-bilder / data-farb-bilder tells which scene is available for it. */
    /* Handy: Wischen im Hauptbild blaettert durch die Galerie (Julian 08.09.2026) */
    (()=>{ const g=q("#galMain"); if(!g) return; let x0=null,y0=null,t0=0;
      const reihe=()=>[...pdp.querySelectorAll(".thumbs button")].map(b=>b.dataset.k);
      g.addEventListener("touchstart",e=>{ const t=e.changedTouches[0]; x0=t.clientX; y0=t.clientY; t0=Date.now(); },{passive:true});
      g.addEventListener("touchend",e=>{ if(x0==null) return; const t=e.changedTouches[0]; const dx=t.clientX-x0, dy=t.clientY-y0; x0=null;
        if(Math.abs(dx)<40||Math.abs(dx)<Math.abs(dy)*1.5||Date.now()-t0>800) return;
        const ks=reihe(); if(ks.length<2) return; const im=q("#galMain img"); const i=Math.max(0,ks.indexOf(im&&im.dataset.k)); const j=(i+(dx<0?1:-1)+ks.length)%ks.length; bildZeigen(ks[j]); },{passive:true}); })();
    const bildZeigen=(k)=>{ if(!k) return; const im=q("#galMain img"); if(!im) return; im.removeAttribute("src"); im.dataset.k=k; bilderSetzen(); if(!window.IMGMAP) im.src=bildUrl(k); const lm=q("#liveMain"); if(lm&&!lm.classList.contains("bei-feldern")){lm.hidden=true; q("#galMain").hidden=false;} pdp.querySelectorAll(".thumbs button").forEach(x=>x.setAttribute("aria-pressed", x.dataset.k===k?"true":"false")); };
    /* View large image: tapping/clicking on the main image opens the full view,
       wischen (oder Pfeile/Tasten) blaettert, Antippen auf den Rand oder ✕ schliesst (Julian 14.09.2026). */
    (()=>{ const lb=q("#lb"), g=q("#galMain"); if(!lb||!g) return;
      const lim=lb.querySelector("img"), zl=lb.querySelector(".lb-z");
      const reihe=()=>[...pdp.querySelectorAll(".thumbs button")].map(b=>b.dataset.k);
      const srcFuer=(k)=>{ const b=[...pdp.querySelectorAll(".thumbs button")].find(x=>x.dataset.k===k); const t=b&&b.querySelector("img"); if(t&&(t.currentSrc||t.getAttribute("src"))) { const im=q("#galMain img"); if(im&&im.dataset.k===k&&(im.currentSrc||im.src)) return im.currentSrc||im.src; } if(window.IMGMAP&&IMGMAP[k]) return IMGMAP[k]; return bildUrl(k); };
      let offen=false;
      const zeigen=(k)=>{ const ks=reihe(); const i=Math.max(0,ks.indexOf(k)); lim.src=srcFuer(ks[i]||k); zl.textContent=ks.length>1?`${i+1} / ${ks.length}`:""; bildZeigen(ks[i]||k); };
      const blaettern=(d)=>{ const ks=reihe(); if(ks.length<2) return; const i=Math.max(0,ks.indexOf(lim.dataset.k||(q("#galMain img")||{}).dataset.k)); const j=(i+d+ks.length)%ks.length; lim.dataset.k=ks[j]; zeigen(ks[j]); };
      const oeffnen=()=>{ const im=q("#galMain img"); if(!im||g.hidden) return; lim.dataset.k=im.dataset.k; zeigen(im.dataset.k); lb.hidden=false; offen=true; document.body.style.overflow="hidden"; lb.querySelector(".lb-x").focus(); };
      window.lbOeffnen=oeffnen;
      const schliessen=()=>{ lb.hidden=true; offen=false; document.body.style.overflow=""; };
      g.addEventListener("click",e=>{ if(e.target.closest("button,a")) return; oeffnen(); });
      lb.querySelector(".lb-x").addEventListener("click",schliessen);
      lb.querySelector(".lb-p").addEventListener("click",e=>{e.stopPropagation(); blaettern(-1);});
      lb.querySelector(".lb-n").addEventListener("click",e=>{e.stopPropagation(); blaettern(1);});
      lb.addEventListener("click",e=>{ if(e.target===lb||e.target===lim) schliessen(); });
      document.addEventListener("keydown",e=>{ if(!offen) return; if(e.key==="Escape") schliessen(); else if(e.key==="ArrowRight") blaettern(1); else if(e.key==="ArrowLeft") blaettern(-1); });
      let x0=null,y0=null,t0=0,bewegt=false;
      lb.addEventListener("touchstart",e=>{ const t=e.changedTouches[0]; x0=t.clientX; y0=t.clientY; t0=Date.now(); bewegt=false; },{passive:true});
      lb.addEventListener("touchmove",()=>{ bewegt=true; },{passive:true});
      lb.addEventListener("touchend",e=>{ if(x0==null) return; const t=e.changedTouches[0]; const dx=t.clientX-x0, dy=t.clientY-y0; x0=null;
        if(Math.abs(dx)>=40&&Math.abs(dx)>Math.abs(dy)*1.5&&Date.now()-t0<=800){ blaettern(dx<0?1:-1); return; }
        if(!bewegt&&Math.abs(dx)<10&&Math.abs(dy)<10&&e.target===lim){ schliessen(); } },{passive:true});
      lb.addEventListener("touchend",e=>{ if(e.target===lim) e.preventDefault(); },{passive:false});
    })();
    const designBilder=JSON.parse(pdp.dataset.designBilder||"{}"), farbBilder=JSON.parse(pdp.dataset.farbBilder||"{}");
    const farbKey=(f)=>/blau/i.test(f)?"blau":/wei/i.test(f)?"weiss":"rosa";
    pdp.querySelectorAll(".farben button").forEach(b=>b.addEventListener("click",()=>{pdp.querySelectorAll(".farben button").forEach(x=>x.setAttribute("aria-pressed","false")); b.setAttribute("aria-pressed","true"); farbe=b.dataset.farbe; bildZeigen(farbBilder[farbKey(farbe)]);}));
    /* Ultrasound image: resize in browser, upload, remember ID.
       A mobile photo is often 6 MB – resized, it goes through even with a poor
       network, and 2000 px is easily enough for the watercolour drawing. */
    let htFotos=[];       /* {k:Kennung, d:DataURL} fuer die Haustier-Live-Vorschau */
    let usKennungen=[];   /* Speicherkennungen der hochgeladenen Bilder (walleria-kundenbild); Ultraschall 1, Haustier bis 3 */
    const usFeld=q("#usBild");
    const usMax=usFeld?Math.max(1,parseInt(usFeld.dataset.max||"1",10)||1):1;
    const usArt=usFeld?(usFeld.dataset.art||"ultraschall"):"";
    if(usFeld){
      const vorschau=q("#usVorschau");
      const hochladen=(datei)=>{
        if(datei.size > 12*1024*1024){ toast("The image is larger than 12 MB."); return; }
        const leser=new FileReader();
        leser.onerror=()=>toast("The image couldn’t be read.");
        leser.onload=()=>{
          const bild=new Image();
          bild.onerror=()=>toast("The image couldn’t be opened.");
          bild.onload=()=>{
            let w=bild.width,h=bild.height,max=2000;
            if(w>max||h>max){ const f=max/Math.max(w,h); w=Math.round(w*f); h=Math.round(h*f); }
            const c=document.createElement("canvas"); c.width=w; c.height=h;
            c.getContext("2d").drawImage(bild,0,0,w,h);
            const daten=c.toDataURL("image/jpeg",0.9);
            const karte=document.createElement("div"); karte.className="usb-eins";
            const im=document.createElement("img"); im.src=daten; im.alt=usArt==="haustier"?"Your photo":"Your ultrasound image";
            const weg=document.createElement("button"); weg.type="button"; weg.className="usb-weg";
            weg.textContent=usArt==="haustier"?"Foto entfernen":"Choose another image";
            const stand=document.createElement("span"); stand.className="small muted";
            stand.textContent="transferring …";
            let meine="";
            weg.addEventListener("click",()=>{ usKennungen=usKennungen.filter(k=>k!==meine); htFotos=htFotos.filter(f=>f.k!==meine); karte.remove(); document.dispatchEvent(new Event("walleria:fotos")); });
            karte.appendChild(im); karte.appendChild(stand); karte.appendChild(weg); vorschau.appendChild(karte);
            fetch(window.WALLERIA_KUNDENBILD,{method:"POST",
                headers:{"Content-Type":"application/json","apikey":window.SUPABASE_KEY},
                body:JSON.stringify({produkt:pdp.dataset.id||"",bild:daten})})
              .then(r=>r.json()).then(a=>{
                if(a&&a.ergebnis==="ok"){ meine=a.kennung; usKennungen.push(meine); stand.textContent="transferred"; htFotos.push({k:meine,d:daten}); document.dispatchEvent(new Event("walleria:fotos")); }
                else { stand.textContent="didn’t work"; toast("The image didn’t arrive. Please try again."); }
              })
              .catch(()=>{ stand.textContent="didn’t work"; });
          };
          bild.src=leser.result;
        };
        leser.readAsDataURL(datei);
      };
      usFeld.addEventListener("change",()=>{
        const dateien=[...(usFeld.files||[])]; usFeld.value="";
        if(!dateien.length) return;
        if(usMax===1){ usKennungen=[]; htFotos=[]; vorschau.innerHTML=""; }
        const platz=usMax-vorschau.querySelectorAll(".usb-eins").length;
        if(platz<=0){ toast("Maximum "+usMax+" Photos – remove one first."); return; }
        if(dateien.length>platz) toast("Still room for "+platz+" Foto"+(platz===1?"":"s")+" – the first "+platz+" we’ll use.");
        dateien.slice(0,platz).forEach(hochladen);
      });
    }

    const kn=q("#kName")||q("[data-pers-feld][data-pflicht]"), kd=q("#kDatum"), lm=q("#liveMain");
    /* Nur fuer die Vorschau: Ultraschall hat kein Pflichtfeld - das freiwillige Namensfeld treibt dort die Live-Vorschau (18.09.2026) */
    const knV=kn||[...pdp.querySelectorAll("input[data-pers-feld]")].find(e=>/name/i.test(e.dataset.persFeld||""))||null;
    const istHaustier=pdp.dataset.haustier==="1";
    /* Pet watercolour: placeholder -> uploaded photos softly cropped, name + custom text live */
    const htVorschau=()=>{ if(!istHaustier||!lm) return;
      const bild=q("#htBild"), nm=q("#htName"), tx=q("#htText"); if(!bild||!nm) return;
      let name=htNamen(); if(!name){ name=beispielName().split(" – ")[0]; beispielAn(true); } else beispielAn(false);
      /* Name setzen und einpassen: erst grob nach Laenge, dann messen - nichts wird abgeschnitten (Julian 19.09.) */
      const nameSetzen=(t)=>{ nm.textContent=t; let cq=Math.min(12, 12*11/Math.max(11,t.length)); nm.style.fontSize=cq.toFixed(2)+"cqw";
        for(let i=0;i<14 && nm.scrollWidth>nm.clientWidth+1;i++){ cq*=0.94; nm.style.fontSize=cq.toFixed(2)+"cqw"; } };
      nameSetzen(name); if(tx){ const t=q("#kText"); tx.textContent=(t&&t.value.trim())||""; }
      const fotos=htFotos.slice(0,3);
      let m={}; try{ m=JSON.parse(q("#htPoster").dataset.bsp||"{}"); }catch(e){}
      const az=q("#kAnzahl"), n=String(Math.min(3,Math.max(1,parseInt((az&&az.value)||"1",10)||1))), b=m[n]||m["1"]||{};
      /* Without custom name/text: default values of the sheet */
      if(!htNamen()) nameSetzen(b.n||name);
      if(tx&&!(q("#kText")&&q("#kText").value.trim())) tx.textContent=b.t||"";
      const art=q("#htArt");
      if(!fotos.length){
        /* Standard: echtes Beispiel-Blatt passend zur Tierzahl (Name herausretuschiert), Name/Text live darueber */
        bild.innerHTML="";
        if(art){ art.hidden=false; if(b.k&&art.dataset.k!==b.k){ art.dataset.k=b.k; art.removeAttribute("src"); if(typeof bilderSetzen==="function") bilderSetzen(); if(!window.IMGMAP) art.src=bildUrl(b.k); } }
        return; }
      if(art) art.hidden=true;
      const vorhanden=[...bild.querySelectorAll("img")].map(i=>i.dataset.k).join("|"), neu=fotos.map(f=>f.k).join("|");
      if(vorhanden!==neu){ bild.innerHTML=""; fotos.forEach(f=>{ const im=document.createElement("img"); im.src=f.d; im.alt="Your photo"; im.dataset.k=f.k; bild.appendChild(im); }); } };
    /* kein direkter Aufruf hier: beispielName() ist erst weiter unten definiert - vorschau() ruft htVorschau() beim Start */
    /* Namensfelder je Tierzahl: 1 Tier = 1 Kasten, 2 = 2, 3 = 3 (Julian 18.09.) */
    const htNamenFelder=()=>{ const az=q("#kAnzahl"); const n=Math.min(3,Math.max(1,parseInt((az&&az.value)||"1",10)||1));
      [["#kName2",2],["#kName3",3]].forEach(([sel,ab])=>{ const e=q(sel); if(!e) return; const w=e.closest(".field")||e; const an=n>=ab; w.hidden=!an; if(an) e.setAttribute("data-pflicht","1"); else { e.removeAttribute("data-pflicht"); e.value=""; }
        /* 21.09.2026 (Pruefrunde 3): Feld ist Pflicht, sobald das Tier gewaehlt ist - das "(freiwillig)" the text contradicted the error message */
        const l=w.querySelector("label"); if(l&&an){ l.querySelectorAll("span,small,em").forEach(s=>{ if(/^\s*\((freiwillig|optional)\)\s*$/i.test(s.textContent)) s.remove(); }); if(!l.children.length) l.textContent=l.textContent.replace(/\s*\((freiwillig|optional)\)/i,""); } }); };
    const htNamen=()=>{ const t=[q("#kName"),q("#kName2"),q("#kName3")].map(e=>(e&&!(e.closest(".field")||e).hidden&&e.value.trim())||"").filter(Boolean);
      return t.length<=1?(t[0]||""):(t.slice(0,-1).join(", ")+" & "+t[t.length-1]); };
    if(istHaustier){ document.addEventListener("walleria:fotos",htVorschau); const t=q("#kText"); if(t) t.addEventListener("input",htVorschau); const az=q("#kAnzahl"); if(az) az.addEventListener("input",()=>{ htNamenFelder(); htVorschau(); }); htNamenFelder();
      ["#kName2","#kName3"].forEach(sel=>{ const e=q(sel); if(e) e.addEventListener("input",htVorschau); });
      if(document.fonts&&document.fonts.load){ document.fonts.load('40px "Caveat"').then(htVorschau).catch(()=>{}); } }
    if(istKarte||istHaustier){ /* Desktop: Vorschau statt Hauptbild; Handy: Hauptbild oben, Vorschau ueber den Feldern */
      const gm=q("#galMain"); if(gm) gm.hidden=!(lm&&lm.classList.contains("bei-feldern"));
      if(istKarte&&typeof karteStart==="function") karteStart(pdp); }
    const kn2=q("#kName2"), feld2=kn2?kn2.closest(".field"):null;
    let anzahlNamen=1;

    /* Two siblings share one poster: "J & J" oben, "Julian & Johanna" darunter. */
    const namenText=()=>{
      const n=(kn&&kn.value.trim())||"";
      const n2=(kn2&&kn2.value.trim())||"";
      return (anzahlNamen===2 && n && n2) ? n+" & "+n2 : (n||n2);
    };
    /* Handy (18.09.2026): die Vorschau klebt ueber den Feldern und soll nie leer sein - ohne Eingabe zeigt sie den
       Beispielnamen aus dem Platzhalter (heller), sobald getippt wird den echten. */
    const beiFeldern=()=>!!(lm&&lm.classList.contains("bei-feldern"));
    const beispielName=()=>{ const ph=(knV&&knV.placeholder)||""; return ph.replace(/^z\.\s*B\.\s*/i,"").split(/[,/]| oder /)[0].trim()||"Emma"; };
    const beispielAn=(an)=>{ if(lm) lm.classList.toggle("bsp",!!an); };

    /* Definitions-Poster: eigene Live-Vorschau (SVG wie der Druck) statt Namensposter-Renderer */
    const defEl=q("#defPoster"); let defInfo=null; try{ defInfo=pdp.dataset.def?JSON.parse(pdp.dataset.def):null; }catch(e){}
    const defVorschau=()=>{ if(!defEl||!defInfo||!lm||typeof defSVG!=="function") return;
      let name=(kn&&kn.value.trim())||"";
      if(!name){ if(!beiFeldern()){ lm.hidden=true; q("#galMain").hidden=false; return; } name=beispielName(); beispielAn(true); } else beispielAn(false);
      const eig=(q("#pf1")&&q("#pf1").value.trim())||"", dat=(q("#pfDatum")&&q("#pfDatum").value.trim())||"";
      lm.hidden=false; if(!lm.classList.contains("bei-feldern")) q("#galMain").hidden=true;
      const dk=pdp.querySelector("#designs button[aria-pressed=\"true\"]"); defEl.innerHTML=defSVG((dk&&dk.dataset.nr)||"1",defInfo.wort,name,eig||defInfo.text,dat); };
    if(defInfo){ ["#pf1","#pfDatum"].forEach(sel=>{ const e=q(sel); if(e) e.addEventListener("input",defVorschau); });
      if(document.fonts&&document.fonts.load){ Promise.all([document.fonts.load('40px "Instrument Serif"'),document.fonts.load('40px "Playfair Display"'),document.fonts.load('40px "Caveat"')]).then(()=>{ if(lm&&!lm.hidden) defVorschau(); }).catch(()=>{}); } }
    /* Hausregeln: Hintergrund ohne Text + Familienname/Regeln live (live_hausregeln.js) */
    const hrDesign=pdp.dataset.hr||"";
    const hrVorschau=()=>{ if(!hrDesign||!defEl||!lm||typeof hrSVG!=="function") return;
      let name=(kn&&kn.value.trim())||"";
      if(!name){ if(!beiFeldern()){ lm.hidden=true; q("#galMain").hidden=false; return; } name=beispielName(); beispielAn(true); } else beispielAn(false);
      lm.hidden=false; if(!lm.classList.contains("bei-feldern")) q("#galMain").hidden=true;
      defEl.innerHTML=hrSVG(hrDesign,name,(q("#pf1")&&q("#pf1").value)||""); };
    if(hrDesign){ const e=q("#pf1"); if(e){
        /* As in production: maximum 7 rules, max 42 characters each - otherwise the font shrinks to unreadable */
        const begrenzen=()=>{ const roh=e.value; const teile=roh.split("\n").slice(0,7).map(z=>z.slice(0,42)); const neu=teile.join("\n");
          if(neu!==roh){ const pos=Math.min(e.selectionStart||neu.length, neu.length); e.value=neu; try{ e.setSelectionRange(pos,pos); }catch(x){} toast("Maximum of 42 characters per rule and 7 rules"); } };
        e.addEventListener("input",()=>{ begrenzen(); hrVorschau(); }); e.addEventListener("paste",()=>setTimeout(()=>{ begrenzen(); hrVorschau(); },0)); }
      if(document.fonts&&document.fonts.load){ Promise.all([document.fonts.load('40px "Instrument Serif"'),document.fonts.load('40px "Playfair Display"')]).then(()=>{ if(lm&&!lm.hidden) hrVorschau(); }).catch(()=>{}); } }
    /* Ultraschall-Herz: Beispielblatt ohne Text + Name/Spruch/Termin live (live_ultraschall.js) */
    const usDesign=pdp.dataset.us||"";
    const usVorschau=()=>{ if(!usDesign||!defEl||!lm||typeof usSVG!=="function") return;
      let name=(knV&&knV.value.trim())||"";
      if(!name){ if(!beiFeldern()){ lm.hidden=true; q("#galMain").hidden=false; return; } name=beispielName(); beispielAn(true); } else beispielAn(false);
      lm.hidden=false; if(!lm.classList.contains("bei-feldern")) q("#galMain").hidden=true;
      defEl.innerHTML=usSVG(name,(usSpruchEl&&usSpruchEl.value)||"",(usDatumEl&&usDatumEl.value)||""); };
    /* Felder nach Fragetext suchen - die Nummern (pf2/pf3/pf4) haengen von der Feldreihenfolge ab */
    const usPersFeld=(re)=>[...pdp.querySelectorAll("[data-pers-feld]")].find(e=>re.test(e.dataset.persFeld||""))||null;
    const usSpruchEl=usDesign?usPersFeld(/spruch/i):null, usDatumEl=usDesign?usPersFeld(/datum|termin/i):null;
    if(usDesign){ [usSpruchEl,usDatumEl].forEach(e=>{ if(e) e.addEventListener("input",usVorschau); });
      if(document.fonts&&document.fonts.load){ Promise.all([document.fonts.load('40px "Sacramento"'),document.fonts.load('40px "Instrument Serif"')]).then(()=>{ if(lm&&!lm.hidden) usVorschau(); }).catch(()=>{}); } }
    const vorschau=()=>{ if(istKarte) return; if(istHaustier){ htVorschau(); return; } if(defInfo){ defVorschau(); return; } if(hrDesign){ hrVorschau(); return; } if(usDesign){ usVorschau(); return; } if(!lm) return;
      let t=namenText(); if(!t){ if(!beiFeldern()) return; t=beispielName(); beispielAn(true); } else beispielAn(false);
      lm.hidden=false; if(!lm.classList.contains("bei-feldern")) q("#galMain").hidden=true;
      npRender(q("#liveMain .poster"), t);
    };

    /* Toggle one or two names */
    const anzKnoepfe=[...pdp.querySelectorAll("#namenAnzahl button")];
    if(anzKnoepfe.length){
      if(feld2) feld2.hidden=true;                 /* zweites Feld erst bei Bedarf */
      anzKnoepfe.forEach(b=>b.addEventListener("click",()=>{
        anzahlNamen=parseInt(b.dataset.anzahl,10)||1;
        anzKnoepfe.forEach(x=>x.setAttribute("aria-pressed", x===b ? "true":"false"));
        if(feld2) feld2.hidden = anzahlNamen!==2;
        if(anzahlNamen!==2 && kn2) kn2.value="";
        if(anzahlNamen===2 && kn2) kn2.focus();
        vorschau();
      }));
    }
    if(kn2) kn2.addEventListener("input",vorschau);
    if(kn && !istKarte){ let vor=""; try{vor=new URLSearchParams(location.search).get("name")||sessionStorage.getItem("jmp_name")||"";}catch(e){} if(vor){kn.value=vor;} kn.addEventListener("input",vorschau); if(kd) kd.addEventListener("input",vorschau); vorschau(); try{sessionStorage.removeItem("jmp_name");}catch(e){} }
    else if(knV && !istKarte){ knV.addEventListener("input",vorschau); vorschau(); }
    /* Auswahl-Knoepfe (frueher Dropdown): Wert ins versteckte Feld, Bild wechseln, wenn es eins je Option gibt */
    const optBilder=JSON.parse(pdp.dataset.optBilder||"{}");
    pdp.querySelectorAll(".chips").forEach(g=>{ const ziel=q("#"+g.dataset.fuer); g.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
      g.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed","false")); b.setAttribute("aria-pressed","true");
      if(ziel){ ziel.value=b.dataset.opt; ziel.dispatchEvent(new Event("input")); }
      if(g.dataset.fuer==="kAnzahl"){ preisZeigen(); document.dispatchEvent(new Event("walleria:preis")); }
      const k=(optBilder[g.dataset.fuer]||{})[b.dataset.opt]; if(k) bildZeigen(k); })); });
    /* Design selection */
    let design="";
    const dsgKnoepfe=[...pdp.querySelectorAll("#designs button")];
    if(dsgKnoepfe.length){
      design=(dsgKnoepfe.find(b=>b.getAttribute("aria-pressed")==="true")||dsgKnoepfe[0]).dataset.design;
      dsgKnoepfe.forEach(b=>b.addEventListener("click",()=>{
        dsgKnoepfe.forEach(x=>x.setAttribute("aria-pressed","false"));
        b.setAttribute("aria-pressed","true"); design=b.dataset.design; if(defInfo&&kn&&kn.value.trim()) defVorschau(); else bildZeigen(designBilder[b.dataset.nr]); }));
    }
    /* Zeichen-Zaehler unter Feldern mit Grenze (wie die Produktion sie hat) */
    pdp.querySelectorAll(".zaehler[data-fuer]").forEach(z=>{ const e=q("#"+z.dataset.fuer); if(!e) return; const max=parseInt(z.dataset.max,10)||0;
      const upd=()=>{ const n=e.value.length; z.textContent=max?(n+"/"+max+" Zeichen"):""; z.classList.toggle("voll", max&&n>=max); }; e.addEventListener("input",upd); upd(); });
    /* Birth flowers: 2 to 8 people, up to 16 characters per name - exactly the limits of the bouquet renderer */
    const gbl=pdp.querySelector('[data-pers-feld="Namen mit Geburtsmonat"]');
    if(gbl){ const z=pdp.querySelector('.zaehler[data-fuer="'+gbl.id+'"]');
      const pruef=()=>{ const teile=gbl.value.split(/[,;\n]+| und /).map(t=>t.trim()).filter(Boolean); const zuLang=teile.filter(t=>t.replace(/\s+\S+$/,"").length>16);
        let txt=teile.length+" from 2 to 8 people"; if(teile.length>8) txt="Too many: maximum of 8 people"; else if(zuLang.length) txt="Name zu lang (bis 16 Zeichen): "+zuLang[0];
        if(z){ z.textContent=txt; z.classList.toggle("voll", teile.length>8||zuLang.length>0); } };
      gbl.addEventListener("input",pruef); pruef(); }
    /* Collect all personalisation fields of the product - name, date, weight ... */
    const persFelder=()=>{
      let l=[...pdp.querySelectorAll("[data-pers-feld]")]
        .map(e=>({feld:e.dataset.persFeld, wert:e.value.trim(), id:e.id})).filter(x=>x.wert);
      /* What is written on a poster also belongs as a line in the order -
         otherwise production prints two posters from two fields. */
      if(anzahlNamen===2 && kn && kn2 && kn.value.trim() && kn2.value.trim()){
        l=l.filter(x=>x.id!=="kName" && x.id!=="kName2");
        l.unshift({feld:"Namen", wert:kn.value.trim()+" & "+kn2.value.trim()});
      }
      if(istHaustier){ const zusammen=htNamen(); l=l.filter(x=>x.id!=="kName2" && x.id!=="kName3"); l=l.map(x=>x.id==="kName"?{feld:x.feld,wert:zusammen,id:x.id}:x); }
      if(design) l.unshift({feld:"Design", wert:design});
      if(typeof farbe!=="undefined" && farbe) l.push({feld:"Farbe", wert:farbe});
      if(usFeld) l.push({feld:usArt==="haustier"?"Fotos":"Ultraschallbild", wert:usKennungen.length?usKennungen.join(", "):"noch nicht hochgeladen – bitte mit Bestellnummer an hallo@walleria.de senden"});
      return l.map(x=>({feld:x.feld, wert:x.wert})); };
    /* Lesbare Zeile fuer Cart/Stripe: technische Angaben der Karten-Poster (Konfiguration, Vorschau-Kennung) bleiben nur in angaben */
    /* Speicherkennungen hochgeladener Bilder sind fuer den Kunden nichtssagend - im Cart nur zaehlen (18.09.2026) */
    const persText=()=>persFelder().filter(x=>!/^(Konfiguration|Vorschau)/.test(x.feld)).map(x=>tr(x.feld)+": "+((/^(Fotos|Ultraschallbild)$/.test(x.feld)&&/^[0-9a-f-]{20,}/i.test(x.wert))?(x.feld==="Fotos"?(x.wert.split(",").length+" "+tr("hochgeladen")):tr("hochgeladen")):tr(x.wert))).join(" · ");
    /* Feldname fuer Meldungen: die sichtbare Beschriftung (auf /en/ schon englisch), ohne "(freiwillig)" (21.09.2026) */
    const feldName=(el)=>{ const w=el&&el.closest(".field"); const l=w&&w.querySelector("label"); const t=((l&&l.textContent)||el.dataset.persFeld||"").replace(/\s*\((freiwillig|optional)\)/i,"").replace(/[:：]\s*$/,"").trim(); return t; };
    q("#inKorb").addEventListener("click",()=>{
      const zaehl=(z)=>{ try{ (window.walleriaZaehlen||function(){})({art:"klick",ziel:z}); }catch(e){} };
      /* Ultraschall-Poster: Name und Bild freiwillig (Julian, 16.09.2026) */
      const usFrei=!!usFeld && usArt!=="haustier";
      if(!usFrei && pdp.dataset.pers==="1" && !(kn&&kn.value.trim())){ if(kn) feldFehler(kn,tr("Please enter FELD first").replace("FELD",feldName(kn)||tr("the name"))); zaehl("warenkorb-abgewiesen:name"); return; }
      /* Mandatory fields from the Etsy schema: empty -> mark on the field, scroll there, do not submit */
      const leer=usFrei?null:[...pdp.querySelectorAll("[data-pers-feld][data-pflicht]")].find(e=>!e.value.trim());
      if(leer){ feldFehler(leer,tr("Please fill in: FELD").replace("FELD",feldName(leer))); zaehl("warenkorb-abgewiesen:pflichtfeld"); return; }
      zaehl("in-den-warenkorb");
      const b=sizes[groesse]; const bild=pdp.dataset.bild||("g_"+pdp.dataset.id+"_0");
      const angaben=persFelder(), beschriftung=persText();
      const pid=pdp.dataset.id||"";
      const korbBild=pdp.dataset.bildflach||bild, url=pdp.dataset.url||location.pathname.replace(/^\//,"");
      const zPreis=zuschlag();
      if(art==="digital") korb.push({produkt:pid,titel:pdp.dataset.titel,img:korbBild,url,menge:1,groesse:"Digitale Datei (JPG in 5 sizes up to 50×70 cm)",name:kn?kn.value.trim():"",angaben,beschriftung,farbe,preis:Math.round((dig+zPreis)*100)/100});
      else korb.push({produkt:pid,titel:pdp.dataset.titel,img:korbBild,url,menge:1,groesse:b.firstChild.textContent+" cm",name:kn?kn.value.trim():"",angaben,beschriftung,farbe,preis:Math.round((parseFloat(b.dataset.preis)*(1-RABATT)+zPreis)*100)/100}); korbSpeichern(); korbZeigen(); q("#drawer").classList.add("open"); toast("Added to cart"); }); }
  /* Checkout */
const kf=q("#kForm"); if(kf){
  kf.addEventListener("submit",()=>{ const m=q("#kMail"); if(m&&m.value) try{ sessionStorage.setItem("walleria_kaufmail",m.value.trim()); }catch(e){} });
  /* Cart merken (18.09.2026): nur mit Haekchen oder bestaetigtem Newsletter - der Server prueft das Abo selbst */
  const kMail=q("#kMail"), kErin=q("#kErinnern"); let merkTimer=null;
  const korbMerken=()=>{ const m=(kMail&&kMail.value.trim())||""; if(!m||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m)||!korb.length||!window.STRIPE_CHECKOUT_URL) return;
    let nl=""; try{ nl=localStorage.getItem("wal_nl_ok")||""; }catch(e){}
    if(!(kErin&&kErin.checked)&&nl!=="1") return;
    let tok=""; try{ tok=localStorage.getItem("wal_korb_token")||""; }catch(e){}
    fetch(window.STRIPE_CHECKOUT_URL,{method:"POST",headers:{"Content-Type":"application/json","apikey":window.SUPABASE_KEY},body:JSON.stringify({aktion:"merken",email:m,korb,erlaubt:!!(kErin&&kErin.checked),token:tok,quelle:"kasse",sprache:window.SPRACHE||"de"})})
      .then(r=>r.json()).then(j=>{ if(j&&j.token){ try{ localStorage.setItem("wal_korb_token",j.token); }catch(e){} } }).catch(()=>{}); };
  if(kMail){ kMail.addEventListener("blur",korbMerken); kMail.addEventListener("input",()=>{ clearTimeout(merkTimer); merkTimer=setTimeout(korbMerken,2500); }); }
  if(kErin) kErin.addEventListener("change",korbMerken);
  /* Aus der Erinnerungs-Mail: ?korb=TOKEN stellt den gespeicherten Cart wieder her */
  (()=>{ const t=new URLSearchParams(location.search).get("korb"); if(!t||!window.STRIPE_CHECKOUT_URL) return;
    fetch(window.STRIPE_CHECKOUT_URL,{method:"POST",headers:{"Content-Type":"application/json","apikey":window.SUPABASE_KEY},body:JSON.stringify({aktion:"korb",token:t})})
      .then(r=>r.json()).then(j=>{ if(j&&j.ok&&Array.isArray(j.korb)&&j.korb.length){ korb=j.korb; korbSpeichern(); korbZeigen(); kasseZeigen(); if(kMail&&!kMail.value&&j.email) kMail.value=j.email; try{ localStorage.setItem("wal_korb_token",t); }catch(e){} toast("Your cart is back."); } }).catch(()=>{}); })();
  let digital=false, nurDigital=false, s=0;
  /* Kasse zeichnen - auch nach dem Remove eines Postens neu (Julian, 04.09.2026) */
  function kasseZeigen(){
    digital=korb.some(k=>/Digitale Datei/.test(k.groesse)); nurDigital=korb.length&&korb.every(k=>/Digitale Datei/.test(k.groesse));
    q("#kEinwDigital").hidden=!digital;
    /* Auch rein digital die komplette Adresse abfragen (Rechnung) - Julians Wunsch, 06.09.2026 */
    ["kStr","kPlz","kOrt"].forEach(id=>{ const e=q("#"+id); if(!e) return; const w=e.closest(".field")||e; w.hidden=false; e.required=true; });
    const hAdr=q("#kAdresseTitel"); if(hAdr) hAdr.textContent=nurDigital?"Billing address":"Delivery address";
    const hLand=q("#kLandHinweis"); if(hLand) hLand.hidden=nurDigital;
    const ul=q("#kListe"); ul.innerHTML=""; s=0;
    if(!korb.length){ ul.innerHTML='<li class="empty">Your cart is empty. <a href="alle-poster">Shop posters</a></li>'; q("#kPay").disabled=true; }
    else q("#kPay").disabled=false;
    korb.forEach((k,i)=>{ const m=k.menge||1; s+=k.preis*m; const li=document.createElement("li"); const info=(window.PRODUKT_INFO||{})[k.produkt]; const href=esc((info&&info.u)||k.url||""); const bildKey=(info&&info.f)?("f_"+k.produkt):(k.img||"");
      li.innerHTML=`${href?`<a href="${href}" class="korb-bild${(info&&info.s)?" set":""}">`:`<span class="korb-bild${(info&&info.s)?" set":""}">`}<img data-k="${bildKey}" alt="${esc(k.titel)}">${href?"</a>":"</span>"}<div class="t"><b>${href?`<a href="${href}">${esc(k.titel)}</a>`:esc(k.titel)}</b>${artEtikett(k)}<small>${esc(groesseKurz(k))}${k.name?" · "+esc(k.name):""}</small>${istDigital(k)?"":mengeSteuer(i,m)}</div><b>${eur(k.preis*m)}</b><button type="button" class="btn line" style="padding:4px 8px;min-height:32px" data-del="${i}" aria-label="${esc(k.titel)} entfernen" title="Remove">✕</button>`; ul.appendChild(li); });
    bilderSetzen(ul); mengeHandler(ul,()=>{ korbSpeichern(); korbZeigen(); kasseZeigen(); });
    ul.querySelectorAll("[data-del]").forEach(b=>b.addEventListener("click",()=>{ korb.splice(+b.dataset.del,1); korbSpeichern(); korbZeigen(); kasseZeigen(); toast("Removed from cart"); }));
    const r=digiRabatt(korb); const netto=s-r.betrag;
    const hz=q("#kHinweise"); const h=korb.length?korbHinweise(korb):""; hz.hidden=!h; hz.innerHTML=h;
    q("#kRabattZeile").hidden=!r.anteil; q("#kRabatt").textContent="−"+eur(r.betrag);
    /* Voucher: Stripe zieht ihn von den (schon rabattierten) Posten ab, nicht vom Shipping */
    let gut=0; if(gutschein){
      if(gutschein.mindest && netto<gutschein.mindest){   /* z. B. Dankeschön-Voucher ab 25 € */
        const st=q("#kCodeStand"); if(st){ st.hidden=false; st.className="small nein"; st.textContent="Voucher "+gutschein.code+" valid from "+eur(gutschein.mindest)+" Current order value "+eur(netto)+"."; } }
      else { gut=gutschein.percent?netto*gutschein.percent/100:Math.min(netto,gutschein.betrag||0); gut=Math.round(gut*100)/100;
        const st=q("#kCodeStand"); if(st&&st.className.indexOf("nein")>-1&&gutschein.mindest){ st.className="small ok"; st.textContent="Voucher "+gutschein.code+" redeemed: "+eur(gutschein.betrag||0)+" Rabatt."; } } }
    q("#kGutscheinZeile").hidden=!gut; q("#kGutscheinText").textContent="Voucher "+(gutschein?gutschein.code:""); q("#kGutschein").textContent="−"+eur(gut);
    const versand=(nurDigital||!korb.length||netto>=VERSANDFREI)?0:VERSAND;
    q("#kVersandText").textContent=nurDigital?"Shipping (digital file)":(netto>=VERSANDFREI?"Shipping (free from €60)":"Shipping");
    q("#kZwischen").textContent=eur(s); q("#kVersand").textContent=eur(versand); q("#kGesamt").textContent=eur(Math.max(0,netto-gut)+versand);
  }
  let gutschein=null;
  async function codePruefen(){
    const inp=q("#kCode"), stand=q("#kCodeStand"), btn=q("#kCodeBtn"); const code=inp.value.trim().toUpperCase();
    if(!code){ gutschein=null; stand.hidden=true; kasseZeigen(); return; }
    btn.disabled=true; btn.textContent="Checking...";
    try{ const r=await fetch(window.STRIPE_CHECKOUT_URL,{method:"POST",headers:{"Content-Type":"application/json","apikey":window.SUPABASE_KEY},body:JSON.stringify({aktion:"code",code,sprache:window.SPRACHE||"de"})});
      const j=await r.json();
      if(j.ok){ gutschein={code:j.code,percent:j.percent||0,betrag:j.betrag||0,mindest:j.mindest||0}; stand.hidden=false; stand.className="small ok"; stand.textContent="Voucher "+j.code+" redeemed: "+(j.percent?j.percent+" % Rabatt":eur(j.betrag)+" Rabatt")+(j.mindest?" (ab "+eur(j.mindest)+" Bestellwert)":"")+"."; }
      else { gutschein=null; stand.hidden=false; stand.className="small nein"; stand.textContent=j.fehler||"Voucher code invalid."; }
    }catch(e){ gutschein=null; stand.hidden=false; stand.className="small nein"; stand.textContent="Verification currently not possible – the code will be checked in the next step."; }
    btn.disabled=false; btn.textContent="Redeem"; kasseZeigen();
  }
  q("#kCodeBtn").addEventListener("click",codePruefen);
  q("#kCode").addEventListener("keydown",e=>{ if(e.key==="Enter"){ e.preventDefault(); codePruefen(); } });
  q("#kCode").addEventListener("input",()=>{ if(gutschein && q("#kCode").value.trim().toUpperCase()!==gutschein.code){ gutschein=null; q("#kCodeStand").hidden=true; kasseZeigen(); } });
  /* Postcode: digits only, maximum of five */
  const plz=q("#kPlz"); if(plz) plz.addEventListener("input",()=>{ const v=plz.value.replace(/\D/g,"").slice(0,5); if(v!==plz.value) plz.value=v; });
  kasseZeigen();
  kf.addEventListener("submit",async e=>{ e.preventDefault();
    if(!korb.length){ toast("Your cart is empty"); return; }
    if(digital && !q("#kDigital").checked){ toast("Please agree to immediate delivery"); return; }
    const btn=q("#kPay"); btn.disabled=true; btn.textContent="Redirecting to Stripe …";
    const kunde={ vorname:q("#kVor").value, nachname:q("#kNach").value, email:q("#kMail").value, strasse:q("#kStr").value, plz:q("#kPlz").value, ort:q("#kOrt").value };
    try{ localStorage.setItem("jmp_kunde",JSON.stringify(kunde)); }catch(err){}
    /* Preis in EURO (der Server rechnet selbst in Cent) - und alle Angaben mitgeben,
       otherwise the renderer won’t know later which names should go on the poster. */
    const posten=postenAusKorb();
    if(window.STRIPE_CHECKOUT_URL){
      try{ const r=await fetch(window.STRIPE_CHECKOUT_URL,{method:"POST",headers:{"Content-Type":"application/json","apikey":window.SUPABASE_KEY},body:JSON.stringify({posten,kunde,sprache:window.SPRACHE||"de",code:(q("#kCode")&&q("#kCode").value.trim().toUpperCase())||""})});
        const j=await r.json(); if(j.url){ location.href=j.url; return; } throw new Error(j.fehler||j.error||"No checkout URL"); }
      catch(err){ btn.disabled=false; btn.textContent="Complete purchase";
        const m=String(err.message||""); q("#kHinweis").textContent=/gutschein|coupon|voucher/i.test(m)?m:"Payment currently not possible: "+m;
        if(/gutschein|coupon|voucher/i.test(m)&&q("#kCode")){ q("#kCode").focus(); q("#kCode").select(); } return; }
    }
    btn.disabled=false; btn.textContent="Complete purchase";
    q("#kHinweis").textContent="Checkout is currently unavailable. Please reload the page or write to us. "+window.WALLERIA_MAIL+".";
  });
}

/* Confirmation and unsubscribe page - both live off the token from the email */
function newsSeite(){
  const titel=q("#nlTitel"); if(!titel || !window.WALLERIA_NEWSLETTER) return;
  const abmelden=/newsletter-abmelden/.test(location.pathname);
  const text=q("#nlText"), kasten=q("#nlGutschein");
  let token=""; try{ token=new URLSearchParams(location.search).get("t")||""; }catch(e){}
  if(!token){ titel.textContent="Incomplete link"; text.textContent="Please open the link from the email again."; return; }
  fetch(window.WALLERIA_NEWSLETTER,{method:"POST",
      headers:{"Content-Type":"application/json","apikey":window.SUPABASE_KEY},
      body:JSON.stringify({aktion:abmelden?"abmelden":"bestaetigen",token})})
   .then(r=>r.json()).then(a=>{
      const e=a&&a.ergebnis;
      if(abmelden && e==="abgemeldet"){
        titel.textContent="You are logged out."; text.textContent="We won’t send you any more emails. We’re sorry to see you go, but we understand."; return;
      }
      if(e==="ok"){
        titel.textContent="Thanks, that was's!";
        text.textContent="Your registration is confirmed. Here is your voucher:";
        if(kasten){ kasten.hidden=false; const c=q("#nlCode"); if(c && a.gutschein) c.textContent=a.gutschein; }
        return;
      }
      titel.textContent="This link is no longer valid.";
      text.textContent="Just sign up again and we’ll send you a new one.";
   })
   .catch(()=>{ titel.textContent="That didn’t work."; text.textContent="Please try again later."; });
}

/* ---------- Newsletter with double opt-in ---------- */
window.newsAnmelden=function(e){
  e.preventDefault();
  const form=e.target, feld=form.querySelector("input[type=email]")||q("#newsMail"), btn=form.querySelector("button");
  const hinweis=(form.parentElement&&form.parentElement.querySelector(".nl-hinweis"))||q("#newsHinweis");
  const mail=(feld.value||"").trim();
  if(!mail || !window.WALLERIA_NEWSLETTER){ toast("Please enter your email address."); return false; }
  btn.disabled=true; const vorher=btn.textContent; btn.textContent="Moment …";
  fetch(window.WALLERIA_NEWSLETTER,{method:"POST",
      headers:{"Content-Type":"application/json","apikey":window.SUPABASE_KEY},
      body:JSON.stringify({email:mail,quelle:location.pathname.replace(/^\/|\.html$/g,"")||"start",sprache:window.SPRACHE||"de"})})
   .then(r=>r.json()).then(a=>{
      btn.disabled=false; btn.textContent=vorher;
      const e2=a&&a.ergebnis;
      if(e2==="pruefe_postfach"){
        feld.value=""; try{ localStorage.setItem("wal_nl_ok","1"); }catch(x){} const bl=q("#willkBlase"); if(bl) bl.hidden=true; if(typeof willkAusloeserWeg==="function") willkAusloeserWeg();
        hinweis.className="nl-ok";
        hinweis.innerHTML="<b>Almost there u2013 check your inbox.</b>"
          +"<span>We’ve sent you a confirmation email. Click the link inside, "
          +"and your 10% voucher will be ready.</span>";
        toast("Confirmation email is on its way.");
      }
      else if(e2==="schon_dabei"){
        hinweis.className="nl-ok";
        hinweis.innerHTML="<b>You’re already signed up.</b><span>This address is already registered.</span>";
      }
      else if(e2==="mail_ungueltig") toast("This address doesn’t look right.");
      else toast("That didn’t work. Please try again later.");
   })
   .catch(()=>{ btn.disabled=false; btn.textContent=vorher; toast("That didn’t work."); });
  return false;
};

/* ---------- Top bar: rotating announcements ---------- */
function barLauf(){
  const saetze=[...document.querySelectorAll("#bar .bar-satz")];
  if(saetze.length<2) return;
  /* Anyone who has turned off motion sees the first sentence - and it stays. */
  if(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let i=0;
  setInterval(()=>{
    const alt=saetze[i]; i=(i+1)%saetze.length; const neu=saetze[i];
    alt.classList.remove("an"); alt.classList.add("weg");
    neu.classList.remove("weg"); neu.classList.add("an");
    setTimeout(()=>alt.classList.remove("weg"), 600);
  }, 4200);
}

/* ---------- Search ---------- */
function suchen(){
  const knopf=q("#suchBtn"), schicht=q("#suche"), feld=q("#suchFeld"), liste=q("#suchListe");
  if(!knopf||!schicht||!feld||!liste) return;
  let daten=window.SUCHINDEX||[];
  /* Der Index (153 Artikel, ~40 KB) wird erst geladen, wenn jemand sucht -
     previously it was on every single page. */
  const laden=()=>daten.length?Promise.resolve():fetch(window.SUCHINDEX_URL||"suchindex.json").then(r=>r.json()).then(d=>{daten=d;window.SUCHINDEX=d;}).catch(()=>{});

  const flach=t=>(t||"").toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").replace(/[„“"']/g," ");
  /* Filler words are not mandatory - "mama poster" should find all Mama designs, not only those with "Poster" im Text */
  const STOP=new Set(["poster","bild","bilder","fuer","mit","und","der","die","das","ein","eine","einen","als","zum","zur","von","im","in","auf","geschenk","kaufen","online","schoen","schoene","idee","ideen"]);
  const lev=(a,b,max)=>{ if(Math.abs(a.length-b.length)>max) return max+1; let prev=[...Array(b.length+1).keys()];
    for(let i=1;i<=a.length;i++){ const cur=[i]; let best=cur[0]; for(let j=1;j<=b.length;j++){ cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1)); if(cur[j]<best) best=cur[j]; } if(best>max) return max+1; prev=cur; } return prev[b.length]; };
  const woerter=e=>e._w||(e._w=e.s.split(/[^a-z0-9]+/).filter(w=>w.length>1));
  /* Punkte je Suchwort: 0 = kein Treffer, 1 = aehnlich (Tippfehler), 2 = Wortanfang, 3 = im Text, 5 = ganzes Wort im Text,
     +2 ganzes Wort im Titel, +1 Wortteil im Titel (21.09.2026: "Katze" fand erst die Grinsekatze, dann das Haustier-Portraet) */
  const wertung=(e,t)=>{ let p=0; const titel=e._t||(e._t=flach(e.t));
    if(e.s.includes(t)){ p=woerter(e).includes(t)?5:3; } else { const ws=woerter(e); if(ws.some(w=>w.startsWith(t))) p=2;
      else if(t.length>=4){ const max=t.length>=9?2:1; if(ws.some(w=>lev(w.slice(0,t.length),t,max)<=max||lev(w,t,max)<=max)) p=1; } }
    if(p&&titel.includes(t)) p+=(titel.split(/[^a-z0-9]+/).includes(t)?2:1); return p; };
  const suche=(txt)=>{ const teile=[...new Set(flach(txt).split(/\s+/).filter(Boolean))]; if(!teile.length) return [];
    const pflicht=teile.filter(t=>!STOP.has(t)), kuer=teile.filter(t=>STOP.has(t));
    const raus=[];
    for(const e of daten){ let punkte=0, ok=true;
      for(const t of pflicht){ const p=wertung(e,t); if(!p){ ok=false; break; } punkte+=p; }
      if(!ok) continue;
      for(const t of kuer){ punkte+=wertung(e,t)?1:0; }
      if(!pflicht.length && !punkte) continue;
      raus.push({e,punkte:punkte*10+(e.pop?5:0)}); }
    raus.sort((a,b)=>b.punkte-a.punkte||a.e.t.localeCompare(b.e.t,"de")); return raus.map(x=>x.e); };
  const vorschlaege=()=>'<p class="such-leer">Type in a name, a design or an occasion.</p><div class="such-chips">'+["Namensposter","Mama","Oma","Ultraschall","Pippi","Kinderzimmer","Hausregeln","Geburt"].map(tr).map(w=>'<button type="button" data-w="'+w+'">'+w+'</button>').join("")+'</div>';
  const zeigen=(txt)=>{
    const s=(txt||"").trim();
    if(!s){ liste.innerHTML=vorschlaege(); liste.querySelectorAll("[data-w]").forEach(b=>b.addEventListener("click",()=>{ feld.value=b.dataset.w; zeigen(feld.value); feld.focus(); })); return; }
    if(!daten.length){ liste.innerHTML='<p class="such-leer">Loading search …</p>'; return; }
    const alle=suche(s), treffer=alle.slice(0,20);
    if(!treffer.length){ liste.innerHTML='<p class="such-leer">Nothing found for “'+esc(s)+'”. Try another word or browse through <a href="alle-poster">all posters</a>.</p>'; return; }
    liste.innerHTML="";
    treffer.forEach(e=>{
      const a=document.createElement("a"); a.href=e.u;
      const im=document.createElement("img"); im.alt=""; im.decoding="async"; im.width=56; im.height=74;
      const vq=e.v?"?v="+e.v:""; im.src=WURZEL+"img/s/"+e.b+".jpg"+vq; im.onerror=()=>{ im.onerror=null; im.src=WURZEL+"img/"+e.b+".jpg"+vq; };
      const t=document.createElement("span");
      t.innerHTML="<b>"+esc(e.t)+"</b><small>"+esc(e.k)+(e.p?" · "+esc(e.p):"")+"</small>";
      a.appendChild(im); a.appendChild(t); liste.appendChild(a);
    });
    if(alle.length>treffer.length){ const m=document.createElement("p"); m.className="such-mehr"; m.textContent=alle.length+" Match – showing the first 20. Type a second word to narrow it down."; liste.appendChild(m); }
  };

  const auf=()=>{ schicht.hidden=false; zeigen(feld.value); laden().then(()=>zeigen(feld.value)); setTimeout(()=>feld.focus(),30); };
  const zu=()=>{ schicht.hidden=true; };
  knopf.addEventListener("click",auf);
  q("#suchZu").addEventListener("click",zu);
  schicht.addEventListener("click",e=>{ if(e.target===schicht) zu(); });
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape" && !schicht.hidden) zu();
    /* Slash opens search – but not while typing */
    if(e.key==="/" && schicht.hidden && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)){
      e.preventDefault(); auf();
    }
  });
  let warten;
  feld.addEventListener("input",()=>{ clearTimeout(warten); warten=setTimeout(()=>zeigen(feld.value),90); });
  zeigen("");
  /* ?q=… (z. B. aus der Google-Suchbox) oeffnet die Search direkt mit dem Begriff */
  const q0=new URLSearchParams(location.search).get("q"); if(q0){ feld.value=q0; auf(); }
}

/* Reviews – Supabase */
function bewKopf(){ return {"apikey":window.SUPABASE_KEY,"Authorization":"Bearer "+window.SUPABASE_KEY,"Content-Type":"application/json"}; }

/* Customer photos: resize to web size in the browser. A mobile photo is often 5 MB -
   reduced it is around 300 KB, and the upload doesn’t get stuck on mobile data. */
var bewFotos=[];
function fotoVerkleinern(datei){
  return new Promise(function(fertig,daneben){
    var leser=new FileReader();
    leser.onerror=function(){ daneben(); };
    leser.onload=function(){
      var bild=new Image();
      bild.onerror=function(){ daneben(); };
      bild.onload=function(){
        var max=1600, w=bild.width, h=bild.height;
        if(w>max||h>max){ var f=max/Math.max(w,h); w=Math.round(w*f); h=Math.round(h*f); }
        var c=document.createElement("canvas"); c.width=w; c.height=h;
        c.getContext("2d").drawImage(bild,0,0,w,h);
        fertig(c.toDataURL("image/jpeg",0.82));
      };
      bild.src=leser.result;
    };
    leser.readAsDataURL(datei);
  });
}
function bewVorschauZeigen(){
  var box=q("#bewVorschau"); if(!box) return;
  box.innerHTML="";
  bewFotos.forEach(function(d,i){
    var w=document.createElement("div"); w.className="bew-bild";
    var im=document.createElement("img"); im.src=d; im.alt="Your photo "+(i+1);
    var x=document.createElement("button"); x.type="button"; x.className="bew-weg";
    x.setAttribute("aria-label","Foto "+(i+1)+" entfernen"); x.textContent="✕";
    x.addEventListener("click",function(){ bewFotos.splice(i,1); bewVorschauZeigen(); });
    w.appendChild(im); w.appendChild(x); box.appendChild(w);
  });
}
function bewFotoFeld(){
  var feld=q("#bewFoto"); if(!feld) return;
  feld.addEventListener("change",function(){
    var dateien=[].slice.call(feld.files||[]);
    feld.value="";
    var frei=3-bewFotos.length;
    if(frei<=0){ toast("Unfortunately, you can’t upload more than three photos."); return; }
    if(dateien.length>frei){ toast("We’ll take the first "+frei+" Fotos."); dateien=dateien.slice(0,frei); }
    Promise.all(dateien.map(fotoVerkleinern))
      .then(function(l){ bewFotos=bewFotos.concat(l.filter(Boolean)); bewVorschauZeigen(); })
      .catch(function(){ toast("We couldn’t read one of the images."); });
  });
}

window.bewSenden=function(e){
  e.preventDefault();
  var f=e.target, d={};
  new FormData(f).forEach(function(v,k){ if(k!=="fotos") d[k]=(""+v).trim(); });
  if(!window.WALLERIA_BEWERTUNG){ toast("Reviews coming soon."); return false; }
  var nr=(d.bestellung||"").replace(/[^0-9]/g,"");
  if(nr.length<6){ toast("Please enter the order number from your Etsy order."); return false; }
  var satz={bestellnummer:Number(nr),produkt:f.dataset.produkt,name:d.name,sterne:Number(d.sterne),text:d.text,fotos:bewFotos};
  var btn=f.querySelector("button[type=submit]"); btn.disabled=true;
  var vorher=btn.textContent; if(bewFotos.length) btn.textContent="Loading photos...";
  fetch(window.WALLERIA_BEWERTUNG,{method:"POST",headers:bewKopf(),body:JSON.stringify(satz)})
    .then(function(r){ return r.json(); })
    .then(function(a){
      btn.disabled=false; btn.textContent=vorher;
      var e2=a&&a.ergebnis;
      if(e2==="ok"){ f.reset(); bewFotos=[]; bewVorschauZeigen();
        toast("Thank you! We’ll review your rating and publish it."); }
      else if(e2==="schon_bewertet"){ toast("A review has already been submitted for this order."); }
      else if(e2==="bestellung_unbekannt"){ toast("We can’t find this order number. Please check it again."); }
      else { toast("Please fill in all fields."); }
    })
    .catch(function(){ btn.disabled=false; btn.textContent=vorher; toast("That didn’t work. Please try again later."); });
  return false;
};
function bewLaden(){
  var liste=q("#bewListe"); if(!liste||!window.WALLERIA_BEWERTUNG) return;
  fetch(window.WALLERIA_BEWERTUNG,{method:"POST",headers:bewKopf(),
        body:JSON.stringify({aktion:"liste",produkt:liste.dataset.produkt})})
   .then(function(r){ return r.json(); }).then(function(rows){
    if(!rows||!rows.length) return;
    liste.innerHTML="";
    var summe=0;
    rows.forEach(function(r){
      summe+=r.sterne;
      var el=document.createElement("div"); el.className="review";
      var st=document.createElement("span"); st.className="stars";
      st.textContent="★★★★★".slice(0,r.sterne)+"☆☆☆☆☆".slice(0,5-r.sterne);
      var p=document.createElement("p"); p.textContent=r.text;
      var w=document.createElement("span"); w.className="who"; w.textContent=r.name+" · verified purchase";
      el.appendChild(st); el.appendChild(p);
      if(r.fotos && r.fotos.length){
        var gal=document.createElement("div"); gal.className="bew-galerie";
        r.fotos.forEach(function(u,i){
          var a=document.createElement("a"); a.href=u; a.target="_blank"; a.rel="noopener";
          a.setAttribute("aria-label","Foto "+(i+1)+" von "+r.name+" View large");
          var im=document.createElement("img"); im.src=u; im.loading="lazy";
          im.alt="Kundenfoto "+(i+1)+" von "+r.name;
          a.appendChild(im); gal.appendChild(a);
        });
        el.appendChild(gal);
      }
      el.appendChild(w); liste.appendChild(el);
    });
    var kopf=q("#ratingKopf");
    if(kopf){ var m=summe/rows.length;
      kopf.innerHTML='<span>'+"★★★★★".slice(0,Math.round(m))+'</span> '+m.toFixed(1).replace(".",",")+' · '+rows.length+(rows.length===1?" Bewertung":" Bewertungen"); }
  }).catch(function(){});
}
bewFotoFeld();
bewLaden();
/* Cookie consent */
const CK_KEY="jmp_consent_v1", CK_TAGE=182; let consent=null;
try{ const roh=JSON.parse(localStorage.getItem(CK_KEY)||"null");
  if(roh && roh.version===1 && roh.zeit && (Date.now()-new Date(roh.zeit).getTime())/86400000 < CK_TAGE) consent=roh;
  else if(roh) localStorage.removeItem(CK_KEY);
}catch(e){}
window.consentAllows=(k)=>!!(consent&&consent[k]);
function ckZeigen(einst){ const c=q("#cookie"); if(!c) return; c.hidden=false; document.body.classList.add("ck-offen"); q("#ckOpts").hidden=!einst; q("#ckSpeichern").hidden=!einst; q("#ckEinst").hidden=!!einst; if(consent){q("#ckStat").checked=!!consent.statistik; q("#ckMark").checked=!!consent.marketing;} }
function ckSetzen(o){ consent={notwendig:true,statistik:!!o.statistik,marketing:!!o.marketing,zeit:new Date().toISOString(),version:1}; try{localStorage.setItem(CK_KEY,JSON.stringify(consent));}catch(e){} q("#cookie").hidden=true; document.body.classList.remove("ck-offen"); ladeDienste(); willkNachCookie(); }
/* Willkommens-Voucher (18.09.2026): Blase unten links immer (ausser Kasse/Danke), Popup 7 s nach der Cookie-Entscheidung
   oder beim ersten Scrollen; zugeklappt = 7 Tage Ruhe; nach Newsletter-Anmeldung nie wieder. ?willk=1 oeffnet sofort (Test). */
const WK_ZU="wal_willk_zu", WK_NL="wal_nl_ok", WK_TAG=7*86400000;
const wkSeite=!/(^|\/)(kasse|danke|bestellung|newsletter-bestaetigt|karte-druck)(\.html)?$/.test(location.pathname);
const wkLs=(k)=>{ try{ return localStorage.getItem(k)||""; }catch(e){ return ""; } };
let wkTimer=null, wkScroll=null;
/* automatische Ausloeser (Timer, Scrollen) abraeumen - sonst kam das Popup nach dem Schliessen ein zweites Mal (18.09.2026) */
function willkAusloeserWeg(){ clearTimeout(wkTimer); wkTimer=null; if(wkScroll){ window.removeEventListener("scroll",wkScroll); wkScroll=null; } }
function willkAuto(){ if(wkLs(WK_NL)==="1" || Date.now()-(+wkLs(WK_ZU)||0) < WK_TAG) { willkAusloeserWeg(); return; } willkAusloeserWeg(); willkOeffnen(); }
window.willkOeffnen=function(){ const w=q("#willk"); if(!w||!q("#cookie").hidden) return; w.hidden=false; document.body.classList.add("ck-offen");
  if(!schmal()){ const f=w.querySelector("input[type=email]"); if(f) setTimeout(()=>f.focus(),60); } };
function willkSchliessen(){ const w=q("#willk"); if(!w||w.hidden) return; w.hidden=true; document.body.classList.remove("ck-offen"); willkAusloeserWeg(); try{ localStorage.setItem(WK_ZU,String(Date.now())); }catch(e){} }
function willkNachCookie(){ if(!wkSeite||wkLs(WK_NL)==="1") return; if(Date.now()-(+wkLs(WK_ZU)||0) < WK_TAG) return;
  willkAusloeserWeg(); wkTimer=setTimeout(willkAuto,10000); }   /* nur Zeit: 10 s nach der Cookie-Wahl, kein Scroll-Ausloeser (Julian 18.09.) */
(function willkStart(){ const bl=q("#willkBlase"); if(!bl) return;
  if(wkSeite && wkLs(WK_NL)!=="1" && !sessionStorage.getItem("wal_blase_zu")){ bl.hidden=false; if(q(".pdp")&&schmal()) bl.classList.add("hoch"); }
  q("#willkZu").addEventListener("click",willkSchliessen);
  q("#willk").addEventListener("click",e=>{ if(e.target===q("#willk")) willkSchliessen(); });
  document.addEventListener("keydown",e=>{ if(e.key==="Escape") willkSchliessen(); });
  q("#willkBlaseAuf").addEventListener("click",()=>{ try{ localStorage.removeItem(WK_ZU); }catch(e){} willkOeffnen(); });
  q("#willkBlaseZu").addEventListener("click",()=>{ bl.hidden=true; try{ sessionStorage.setItem("wal_blase_zu","1"); }catch(e){} });
  document.querySelectorAll("[data-willk]").forEach(b=>b.addEventListener("click",()=>{ try{ localStorage.removeItem(WK_ZU); }catch(e){} willkOeffnen(); }));
  if(new URLSearchParams(location.search).has("willk")) setTimeout(willkOeffnen,400);
  else if(consent) willkNachCookie();
})();
function ladeDienste(){
  /* Nur auf der echten Domain messen - lokale Tests und Vorschauen erzeugen sonst Phantom-Kaeufe (07.09.2026) */
  if(!/(^|\.)walleria\.de$/.test(location.hostname)) return;
  if(consentAllows("statistik")){ ladeGA4(); ladeClarity(); }
  if(!consentAllows("marketing")) return;
  ladeChatGptPixel();
  ladeMetaPixel();
  ladeGoogleAds();
}

/* Shared gtag loader for Google Analytics 4 and Google Ads: script only once, consent per purpose */
function gtagBereit(){
  window.dataLayer=window.dataLayer||[];
  if(!window.gtag) window.gtag=function(){ dataLayer.push(arguments); };
  if(window.__waGtagJs) return;
  window.__waGtagJs=true;
  gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"denied"});
  gtag("js",new Date());
  const erst=window.GA4_ID||window.GOOGLE_ADS_ID;
  const js=document.createElement("script"); js.async=true; js.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(erst);
  document.head.appendChild(js);
}
/* Google Analytics 4 - only after consent "Statistik" (06.09.2026). IP wird von GA4 nie gespeichert;
   Google-Signale bleiben aus, Aufbewahrung 2 Monate (in der Property eingestellt). */
function ladeGA4(){
  const id=window.GA4_ID;
  if(!id || window.__waGa4) return; window.__waGa4=true;
  gtagBereit();
  gtag("consent","update",{analytics_storage:"granted"});
  /* Google signals/ad personalisation only if marketing is also allowed */
  const mk=consentAllows("marketing");
  gtag("config",id,{anonymize_ip:true,allow_google_signals:mk,allow_ad_personalization_signals:mk});
  ga4SeitenEreignis();
}
function ga4SeitenEreignis(){
  if(!window.gtag||!window.GA4_ID) return;
  const pdp=q(".pdp");
  if(pdp){
    const preis=parseFloat((q("#preis")||{textContent:""}).textContent.replace(/[^\d,]/g,"").replace(",","."));
    const item={item_id:pdp.dataset.id||"",item_name:pdp.dataset.titel||"",price:isFinite(preis)?preis:undefined};
    gtag("event","view_item",{send_to:window.GA4_ID,currency:"EUR",value:item.price,items:[item]});
    const knopf=q("#inKorb");
    if(knopf && !knopf.dataset.ga4){ knopf.dataset.ga4="1"; knopf.addEventListener("click",()=>{ if(!window.gtag) return;
      const pr=parseFloat((q("#preis")||{textContent:""}).textContent.replace(/[^\d,]/g,"").replace(",","."));
      gtag("event","add_to_cart",{send_to:window.GA4_ID,currency:"EUR",value:isFinite(pr)?pr:undefined,items:[{item_id:pdp.dataset.id||"",item_name:pdp.dataset.titel||"",price:isFinite(pr)?pr:undefined}]}); }); }
  }
  if(location.pathname.indexOf("kasse")>-1 && korb.length){
    gtag("event","begin_checkout",{send_to:window.GA4_ID,currency:"EUR",value:korbSumme(),items:korb.map(p=>({item_id:p.produkt||p.titel,item_name:p.titel,quantity:p.menge||1,price:Number(p.preis)}))});
  }
  const p=new URLSearchParams(location.search); const best=p.get("bestellung");
  if(location.pathname.indexOf("danke")>-1 && best){
    const betrag=parseInt(p.get("betrag")||"0",10);
    let schon=false; try{ schon=sessionStorage.getItem("walleria_ga4_"+best)==="1"; sessionStorage.setItem("walleria_ga4_"+best,"1"); }catch(e){}
    if(!schon) gtag("event","purchase",{send_to:window.GA4_ID,transaction_id:best,currency:"EUR",value:betrag>0?betrag/100:undefined});
  }
}

/* Google-Ads-Tag (Conversion-Messung) - laedt ausschliesslich nach Marketing-Einwilligung (06.09.2026).
   Meldet Kauf mit echtem Bestellwert + Bestellnummer (keine Doppelzaehlung), dazu Produktansicht,
   Cart und Kassenstart als Signale; E-Mail nur gehasht ueber Googles "erweiterte Conversions". */
/* Microsoft Clarity - heatmaps and session recordings, only after consent "Statistik" (12.09.2026).
   Eingabefelder werden von Clarity maskiert; wir markieren zusaetzlich alle Formularfelder als maskiert. */
function ladeClarity(){
  const id=window.CLARITY_ID;
  if(!id || window.__waClarity) return; window.__waClarity=true;
  (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",id);
  try{ window.clarity("consent"); }catch(e){}
  document.querySelectorAll("input,textarea,select").forEach(el=>{ if(!el.hasAttribute("data-clarity-mask")) el.setAttribute("data-clarity-mask","true"); });
}
function ladeGoogleAds(){
  const id=window.GOOGLE_ADS_ID;
  if(!id || window.__waGads) return; window.__waGads=true;
  gtagBereit();
  gtag("consent","update",{ad_storage:"granted",ad_user_data:"granted",ad_personalization:"granted"});
  if(window.__waGa4) gtag("set",{allow_google_signals:true,allow_ad_personalization_signals:true});
  gtag("config",id,{allow_enhanced_conversions:true,send_page_view:false});
  googleSeitenEreignis();
  googleKundenrezensionen();
}
/* Google Customer Reviews: after purchase, a Google window asks if the customer would like to receive a
   review survey later. Order number, email, delivery country and
   voraussichtliches Lieferdatum - deshalb nur mit Marketing-Einwilligung (Datenschutz § 10). */
function googleKundenrezensionen(){
  try{
    if(location.pathname.indexOf("danke")<0) return;
    const p=new URLSearchParams(location.search); const best=p.get("bestellung"); if(!best) return;
    let mail=""; try{ mail=sessionStorage.getItem("walleria_kaufmail")||""; }catch(e){}
    if(!mail || window.__waGcr) return; window.__waGcr=true;
    const d=new Date(); d.setDate(d.getDate()+7);
    const datum=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
    window.waGcrStart=function(){
      if(!window.gapi) return;
      gapi.load("surveyoptin",function(){
        gapi.surveyoptin.render({merchant_id:738187237,order_id:String(best),email:mail.trim(),delivery_country:"DE",estimated_delivery_date:datum,opt_in_style:"CENTER_DIALOG"});
      });
    };
    const sc=document.createElement("script"); sc.src="https://apis.google.com/js/platform.js?onload=waGcrStart"; sc.async=true; sc.defer=true;
    document.head.appendChild(sc);
  }catch(e){}
}
function googleSeitenEreignis(){
  if(!window.gtag) return;
  const pdp=q(".pdp");
  if(pdp){
    const preis=parseFloat((q("#preis")||{textContent:""}).textContent.replace(/[^\d,]/g,"").replace(",","."));
    gtag("event","view_item",{send_to:window.GOOGLE_ADS_ID,currency:"EUR",value:isFinite(preis)?preis:undefined,items:[{item_id:pdp.dataset.id||"",item_name:pdp.dataset.titel||""}]});
    const knopf=q("#inKorb");
    if(knopf && !knopf.dataset.gads){ knopf.dataset.gads="1"; knopf.addEventListener("click",()=>{ if(!window.gtag) return;
      const pr=parseFloat((q("#preis")||{textContent:""}).textContent.replace(/[^\d,]/g,"").replace(",","."));
      gtag("event","add_to_cart",{send_to:window.GOOGLE_ADS_ID,currency:"EUR",value:isFinite(pr)?pr:undefined,items:[{item_id:pdp.dataset.id||"",item_name:pdp.dataset.titel||""}]}); }); }
  }
  if(location.pathname.indexOf("kasse")>-1 && korb.length){
    gtag("event","begin_checkout",{send_to:window.GOOGLE_ADS_ID,currency:"EUR",value:korbSumme(),items:korb.map(p=>({item_id:p.produkt||p.titel,item_name:p.titel,quantity:p.menge||1,price:Number(p.preis)}))});
  }
  const p=new URLSearchParams(location.search);
  const best=p.get("bestellung");
  if(location.pathname.indexOf("danke")>-1 && best && window.GOOGLE_ADS_KAUF){
    const betrag=parseInt(p.get("betrag")||"0",10);
    let mail=""; try{ mail=sessionStorage.getItem("walleria_kaufmail")||""; }catch(e){}
    if(mail) gtag("set","user_data",{email:mail.trim().toLowerCase()});
    gtag("event","conversion",{send_to:window.GOOGLE_ADS_KAUF,value:betrag>0?betrag/100:undefined,currency:"EUR",transaction_id:best});
  }
}

/* Meta Pixel - only loads after marketing consent */
function ladeMetaPixel(){
  const id=window.META_PIXEL_ID;
  if(!id || window.fbq) return;
  (function(f,b,e,v,n,t,s){
    n=f.fbq=function(){ n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments) };
    if(!f._fbq) f._fbq=n; n.push=n; n.loaded=true; n.version="2.0"; n.queue=[];
    t=b.createElement(e); t.async=true; t.src=v;
    s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s);
  })(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
  fbq("init",id);
  fbq("track","PageView");
  metaSeitenEreignis();
}

function metaSeitenEreignis(){
  if(!window.fbq) return;
  const pdp=q(".pdp");
  if(pdp){
    const preis=parseFloat((q("#preis")||{textContent:""}).textContent.replace(/[^\d,]/g,"").replace(",","."));
    fbq("track","ViewContent",{content_name:pdp.dataset.titel||"",content_ids:[pdp.dataset.id||""],
      content_type:"product",value:isFinite(preis)?preis:undefined,currency:"EUR"});
  }
  if(location.pathname.indexOf("kasse")>-1 && korb.length){
    fbq("track","InitiateCheckout",{num_items:korb.length,value:korbSumme(),currency:"EUR"});
  }
  const p=new URLSearchParams(location.search);
  if(location.pathname.indexOf("danke")>-1 && p.get("bestellung")){
    const betrag=parseInt(p.get("betrag")||"0",10);
    fbq("track","Purchase",{value:betrag>0?betrag/100:undefined,currency:"EUR"},{eventID:p.get("bestellung")});
  }
}

/* ChatGPT Ads tracking pixel - loads exclusively after marketing consent */
function ladeChatGptPixel(){
  const pid=window.OPENAI_PIXEL_ID;
  if(!pid || window.oaiq) return;
  (function(w,d,s,u){
    var q=function(){ q.q.push(arguments); }; q.q=[]; w.oaiq=q;
    var js=d.createElement(s); js.async=true; js.src=u;
    var f=d.getElementsByTagName(s)[0]; f.parentNode.insertBefore(js,f);
  })(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");
  oaiq("init",{pixelId:pid});
  /* page_viewed requires the data type according to the SDK "contents" (nicht "customer_action" - and with that, declined
     OpenAI 246 Ereignisse ab; ganz ohne Eigenschaften wird es still verworfen) (04.09.2026) */
  oaiq("measure","page_viewed",{type:"contents"});
  pixelSeitenEreignis();
}

/* Page-related events: product view, cart, checkout, purchase */
function pixelSeitenEreignis(){
  if(!window.oaiq) return;
  const pdp=q(".pdp");
  if(pdp){
    const preis=parseFloat((q("#preis")||{textContent:""}).textContent.replace(/[^\d,]/g,"").replace(",","."));
    oaiq("measure","contents_viewed",{type:"contents",amount:isFinite(preis)?Math.round(preis*100):undefined,currency:"EUR",
      contents:[{id:pdp.dataset.id||"",name:pdp.dataset.titel||"",content_type:"product",quantity:1}]});
  }
  if(location.pathname.indexOf("kasse")>-1 && korb.length){
    oaiq("measure","checkout_started",{type:"contents",amount:Math.round(korbSumme()*100),currency:"EUR",
      contents:korb.map(p=>({id:p.titel,name:p.titel,content_type:"product",quantity:p.menge||1}))});
  }
  const p=new URLSearchParams(location.search);
  const best=p.get("bestellung");
  if(location.pathname.indexOf("danke")>-1 && best){
    /* event_id = Bestellnummer, damit Pixel und Server-Meldung nicht doppelt zaehlen */
    const betrag=parseInt(p.get("betrag")||"0",10);
    oaiq("measure","order_created",{type:"contents",amount:betrag>0?betrag:undefined,currency:"EUR"},{event_id:best});
  }
}
function korbSumme(){ return korb.reduce((s,p)=>s+Number(p.preis)*(p.menge||1),0); }
const ck=q("#cookie"); if(ck&&!ck.dataset.init){ ck.dataset.init="1"; if(!consent) ckZeigen(false); else ladeDienste();
  q("#ckAlle").onclick=()=>ckSetzen({statistik:true,marketing:true}); q("#ckNur").onclick=()=>ckSetzen({}); q("#ckEinst").onclick=()=>ckZeigen(true); q("#ckSpeichern").onclick=()=>ckSetzen({statistik:q("#ckStat").checked,marketing:q("#ckMark").checked}); }
document.querySelectorAll("[data-cookie]").forEach(a=>{ if(!a.dataset.init){ a.dataset.init="1"; a.addEventListener("click",e=>{e.preventDefault();ckZeigen(true);}); } });
/* All poster filters */
const ag=q("#alleGrid"); if(ag){ const karten=[...ag.querySelectorAll(".card")]; const orig=karten.slice();
  const anwenden=()=>{ const k=(document.querySelector('input[name="fk"]:checked')||{}).value||""; const pers=q("#fPers").checked, set=q("#fSet").checked; const s=(document.querySelector('input[name="fs"]:checked')||{}).value||"";
    let n=0; karten.forEach(c=>{ const ok=(!k||c.dataset.kats.split(" ").includes(k))&&(!pers||c.dataset.pers==="1")&&(!set||c.dataset.set==="1"); c.hidden=!ok; if(ok) n++; });
    const sortiert=s==="az"?karten.slice().sort((a,b)=>a.querySelector("h3").textContent.localeCompare(b.querySelector("h3").textContent,"de")):orig; sortiert.forEach(c=>ag.appendChild(c));
    q("#fZahl").textContent="{N} posters".replace("{N}",n); };
  document.querySelectorAll(".filter input").forEach(i=>i.addEventListener("change",anwenden)); }
/* Chips (nur Optik) */
  document.querySelectorAll(".chips button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".chips button").forEach(x=>x.setAttribute("aria-pressed","false")); b.setAttribute("aria-pressed","true");}));
}

initSeite();