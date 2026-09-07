
const eur=n=>n.toFixed(2).replace(".",",")+" €"; const q=s=>document.querySelector(s); const esc=s=>(s||"").replace(/[<>&]/g,"");
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
     beide Zeilen am aehnlichsten breit werden. Was hier steht, muss dort genauso
     herauskommen - sonst zeigt die Vorschau etwas anderes, als gedruckt wird. */
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
  /* Die Wellen mussten frueher in fester Schrittweite laufen - passte die Strecke
     nicht glatt darauf, lief die letzte Welle ueber die Ecke hinaus und der ganze
     Rahmen sass verschoben (waagerecht 311 px, senkrecht 154 px). Jetzt wird die
     Schrittweite so gewaehlt, dass sie die Strecke genau teilt. */
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
/* Zwei Namen wie im Druck: ab 16 Zeichen zwei Zeilen "Julienco &" / "Anna Bella" (namensdesigns.namenszeilen) */
function nameZeilen(text,font,start,sperr,maxB){
  const passt=(t,g)=>{ while(g>20 && tw(t,font,g)+sperr*g*(t.length-1)>maxB) g*=0.96; return g; };
  const g1=passt(text,start); const teile=text.split(" & ");
  if(teile.length<2 || (g1>=start*0.85 && text.length<16)) return {zeilen:[text],g:g1};
  const z=[teile[0].trim()+" &", teile.slice(1).join(" & ").trim()]; return {zeilen:z,g:Math.min(...z.map(t=>passt(t,start)))}; }
function briefmarkeSVG(name){ const B=NP.B,H=NP.H; const ini=initiale(name)||"M"; let s=`<rect width="${B}" height="${H}" fill="#F4EFE3"/>`;
  /* gruene Markisenstreifen, leicht von Hand */
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
  s+=svgText(B/2,H*0.86,"Geliebt. Einzigartig. Wunderbar.","'Playfair Display',serif",H*0.020,"#9A8B70",` letter-spacing="${(H*0.020*0.10).toFixed(0)}"`);
  return `<svg viewBox="0 0 ${B} ${H}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`; }
const LIVE_DESIGNS=["rosie","sophie","briefmarke","margeriten","vichy","isfor","pinselstrich","schlaufen","andenken"];
const LIVE_SVG={briefmarke:briefmarkeSVG,margeriten:margeritenSVG,vichy:vichyDesignSVG,isfor:isforSVG,pinselstrich:pinselstrichSVG,schlaufen:schlaufenSVG,andenken:andenkenSVG};
function istLive(d){ d=String(d||"rosie"); return LIVE_DESIGNS.some(x=>d.endsWith(x)); }
function npSVG(design,name){ name=(name||"").trim().slice(0,40).replace(/[<>"]/g,"")||"Mila"; const d=String(design||"rosie"); const key=Object.keys(LIVE_SVG).find(k=>d.endsWith(k)); const svg=key?LIVE_SVG[key](name):(d==="sophie"?sophieSVG(name):rosieSVG(name)); return svg.replace(/&(?!amp;|#160;)/g,"&amp;"); }
if(document.fonts&&document.fonts.load){ Promise.all([document.fonts.load('40px "Lilita One"'),document.fonts.load('40px "Titan One"'),document.fonts.load('40px "Archivo Black"'),document.fonts.load('40px "Playfair Display"'),document.fonts.load('40px "Pacifico"'),document.fonts.load('bold 40px "Amatic SC"'),document.fonts.load('40px "Gochi Hand"'),document.fonts.load('40px "Caveat"')]).then(()=>{ document.querySelectorAll(".poster.np").forEach(el=>{ if(el.dataset.name!==undefined && istLive(el.dataset.design)) npRender(el,el.dataset.name); }); }).catch(()=>{}); }
function npRender(el,name){ if(!el) return; el.dataset.name=name||""; el.innerHTML=npSVG(el.dataset.design||"rosie",name); }
function toast(t){const el=q("#toast"); el.textContent=t; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),2200);} window.toast=toast;
let korb=[]; try{korb=JSON.parse(localStorage.getItem("jmp_korb")||"[]");}catch(e){}
function korbSpeichern(){try{localStorage.setItem("jmp_korb",JSON.stringify(korb));}catch(e){}}
/* Mengenrabatt auf digitale Dateien - dieselben Stufen wie im Etsy-Shop
   (dort per Code JMP30/JMP50, hier ohne Eingabe direkt im Warenkorb). */
const DIGI_STUFEN=[{ab:5,anteil:0.50},{ab:3,anteil:0.30}];
function istDigital(k){ return /Digitale Datei/i.test(k.groesse||""); }
function digiRabatt(korb){
  const n=korb.filter(istDigital).length;
  const stufe=DIGI_STUFEN.find(x=>n>=x.ab);
  if(!stufe) return {anteil:0,anzahl:n,betrag:0,naechste:DIGI_STUFEN[1]};
  /* Rabatt je Posten auf Cent gerundet - genau wie der Server (sonst 1 Cent Abweichung) */
  const betrag=korb.filter(istDigital).reduce((a,k)=>{ const c=Math.round(k.preis*100); return a+(c-Math.max(50,Math.round(c*(1-stufe.anteil))))/100; },0);
  const hoeher=DIGI_STUFEN.find(x=>x.ab>stufe.ab && x.anteil>stufe.anteil)||null;
  return {anteil:stufe.anteil,anzahl:n,betrag:betrag,naechste:hoeher};
}
/* Aktive Hinweise fuer Warenkorb und Kasse: Rabattstufe und Gratisversand (Julian, 04.09.2026) */
const VERSAND=3.90, VERSANDFREI=60;
/* Etikett je Posten: digital oder Druck - im Korb auf einen Blick unterscheidbar (Julian, 04.09.2026) */
function artEtikett(k){ return istDigital(k)?'<span class="art art-digital">Digital · per E-Mail</span>':'<span class="art art-druck">Druck · 3–5 Werktage</span>'; }
function groesseKurz(k){ return istDigital(k)?"JPG in 5 Größen bis 50×70 cm":k.groesse; }
/* Stueckzahl nur fuer gedruckte Poster - digitale Dateien gibt es einmal (Julian, 04.09.2026) */
function mengeSteuer(i,m){ return `<span class="menge" aria-label="Stückzahl"><button type="button" data-minus="${i}" aria-label="Eins weniger"${m<=1?" disabled":""}>−</button><b>${m}</b><button type="button" data-plus="${i}" aria-label="Eins mehr"${m>=20?" disabled":""}>+</button></span>`; }
function mengeHandler(root,dann){
  root.querySelectorAll("[data-plus]").forEach(b=>b.addEventListener("click",()=>{ const k=korb[+b.dataset.plus]; if(k){ k.menge=Math.min(20,(k.menge||1)+1); dann(); } }));
  root.querySelectorAll("[data-minus]").forEach(b=>b.addEventListener("click",()=>{ const k=korb[+b.dataset.minus]; if(k){ k.menge=Math.max(1,(k.menge||1)-1); dann(); } }));
}
function korbHinweise(korb){
  const r=digiRabatt(korb); const zeilen=[];
  if(r.anteil) zeilen.push('<span>Mengenrabatt auf '+r.anzahl+' digitale Dateien <b>&minus;'+Math.round(r.anteil*100)+'&nbsp;%</b></span><b>&minus;'+eur(r.betrag)+'</b>');
  if(r.naechste && r.anzahl>0){ const fehlt=r.naechste.ab-r.anzahl;
    zeilen.push('<span class="muted">Noch '+fehlt+' digitale '+(fehlt===1?"Datei":"Dateien")+' bis '+Math.round(r.naechste.anteil*100)+'&nbsp;% Rabatt'+(r.anteil?' (statt '+Math.round(r.anteil*100)+'&nbsp;%)':'')+'</span>'); }
  const druck=korb.some(k=>!istDigital(k));
  if(druck){ const s=korb.reduce((a,k)=>a+k.preis*(k.menge||1),0)-r.betrag; const fehlt=VERSANDFREI-s;
    zeilen.push(fehlt>0?'<span class="muted">Nur noch <b>'+eur(fehlt)+'</b> bis zum kostenlosen Versand</span>':'<span class="muted">Kostenloser Versand ✓</span>'); }
  return zeilen.map(z=>'<div class="korb-rabatt">'+z+'</div>').join("");
}
window.digiRabatt=digiRabatt;

function korbZeigen(){const ul=q("#korbListe"); if(!ul) return; ul.innerHTML=""; let s=0;
  if(!korb.length) ul.innerHTML='<li class="empty">Dein Warenkorb ist leer.</li>';
  korb.forEach((k,i)=>{const m=k.menge||1; s+=k.preis*m; const li=document.createElement("li"); const info=(window.PRODUKT_INFO||{})[k.produkt]; const href=esc((info&&info.u)||k.url||""); const bildKey=(info&&info.f)?("f_"+k.produkt):(k.img||"");
    li.innerHTML=`${href?`<a href="${href}" class="korb-bild${(info&&info.s)?" set":""}">`:`<span class="korb-bild${(info&&info.s)?" set":""}">`}<img data-k="${bildKey}" alt="${esc(k.titel)}">${href?"</a>":"</span>"}<div class="t"><b>${href?`<a href="${href}">${esc(k.titel)}</a>`:esc(k.titel)}</b>${artEtikett(k)}<small>${esc(groesseKurz(k))}${k.beschriftung?" · "+esc(k.beschriftung):(k.name?" · "+esc(k.name):"")}${k.farbe?" · "+esc(k.farbe):""}</small>${istDigital(k)?"":mengeSteuer(i,m)}</div><b>${eur(k.preis*m)}</b><button class="btn line" style="padding:4px 8px;min-height:32px" data-del="${i}" aria-label="Entfernen">✕</button>`; ul.appendChild(li);});
  mengeHandler(ul,()=>{korbSpeichern();korbZeigen();});
  const r=digiRabatt(korb);
  const zeile=q("#korbRabatt");
  if(zeile){ const h=korb.length?korbHinweise(korb):""; zeile.hidden=!h; zeile.innerHTML=h; zeile.className=h?"korb-hinweise":"korb-rabatt"; }
  q("#korbSumme").textContent=eur(s-r.betrag); q("#cartN").textContent=korb.reduce((a,k)=>a+(k.menge||1),0); bilderSetzen(ul);
  ul.querySelectorAll("[data-del]").forEach(b=>b.addEventListener("click",()=>{korb.splice(+b.dataset.del,1);korbSpeichern();korbZeigen();}));}
function bilderSetzen(root){
  /* Ohne IMGMAP (lokale Auslieferung) liegen die Bilder als Dateien unter img/ -
     frueher stieg die Funktion hier aus und der Warenkorb blieb bilderlos. */
  (root||document).querySelectorAll("img[data-k]").forEach(im=>{
    if(im.getAttribute("src")) return;
    const k0=im.dataset.k; if(!k0) return;
    if(window.IMGMAP){
      let k=k0; if(!IMGMAP[k] && /^g_e\\d+_\\d$/.test(k)) k="c_"+k.slice(2,-2);
      if(IMGMAP[k]){ im.src=IMGMAP[k]; return; }
      if(window.IMGMAP_ONLY) return;
    }
    im.src="img/"+k0+".jpg";
  });
}

/* ---------- Handy: Raumszene per Knopf ---------- */
function raumKnoepfe(){
  if(!window.matchMedia||!matchMedia("(hover:none)").matches) return;
  document.querySelectorAll(".card").forEach(c=>{
    const box=c.querySelector(".img"); if(!box||box.querySelector(".szene-an")) return;
    if(!c.querySelector("img.szene")) return;
    const b=document.createElement("button");
    b.type="button"; b.className="szene-an";
    b.innerHTML='<svg class="ico" aria-hidden="true"><use href="#i-eye"/></svg>';
    b.setAttribute("aria-label","Poster im Kinderzimmer ansehen");
    b.setAttribute("aria-pressed","false");
    b.addEventListener("click",ev=>{ev.preventDefault(); ev.stopPropagation();
      const an=c.classList.toggle("raum");
      b.setAttribute("aria-pressed",an?"true":"false");
      b.setAttribute("aria-label",an?"Nur das Motiv ansehen":"Poster im Kinderzimmer ansehen");});
    box.appendChild(b);
  });
}

/* ---------- Handy: fester Kaufbalken auf der Produktseite ---------- */
function kaufbalken(){
  const pdp=q(".pdp"), knopf=q("#inKorb"); if(!pdp||!knopf) return;
  document.body.classList.add("pdp-seite");
  const bar=document.createElement("div");
  bar.className="kaufbar";
  bar.hidden=true;   /* feste Kaufleiste auf Julians Wunsch abgeschaltet (04.09.2026) - Aufbau bleibt, falls sie wiederkommen soll */
  bar.innerHTML='<span class="kb-preis"><b id="kbPreis"></b><small id="kbGroesse"></small></span><button class="btn" type="button" id="kbKauf">In den Warenkorb</button>';
  document.body.appendChild(bar);
  const kbP=bar.querySelector("#kbPreis"), kbG=bar.querySelector("#kbGroesse");
  const auffrischen=()=>{ const p=q("#preis"); if(p) kbP.textContent=p.textContent;
    const akt=q("#groessen .on")||q("#groessen [aria-pressed=true]")||q("#groessen button.on");
    const artDig=q('input[name=art][value=digital]'); const istDig=artDig&&artDig.checked;
    kbG.textContent=istDig?"Digitale Datei · sofort per E-Mail":(akt?(akt.firstChild&&akt.firstChild.textContent?akt.firstChild.textContent.trim()+" cm":""):""); };
  document.querySelectorAll('input[name=art]').forEach(r=>r.addEventListener("change",auffrischen));
  auffrischen();
  bar.querySelector("#kbKauf").addEventListener("click",()=>{knopf.click();});
  /* Handy: Namensfelder direkt unter die Live-Vorschau - vorher lagen sie weit unter dem Poster,
     man tippte den Namen blind (Julian, 04.09.2026). Auf dem Desktop bleibt die Aufteilung. */
  try{
    const felder=q(".pers-felder"), live=q("#liveMain"), gal=q(".pdp .gal");
    /* Ohne Live-Vorschau gilt dasselbe fuer alle personalisierbaren Poster: Felder direkt unter die Bilder */
    const anker=live||gal;
    if(felder && anker && matchMedia("(max-width:900px)").matches){
      const hs=document.createElement("h3"); hs.className="pers-titel"; hs.textContent="Personalisieren";
      anker.insertAdjacentElement("afterend",felder); felder.insertAdjacentElement("beforebegin",hs); felder.classList.add("bei-vorschau");
      /* Namensfeld ganz nach oben - "Für wie viele Kinder?" kommt danach */
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
    /* Kaufknopf nicht im Bild - egal ob oben raus oder noch unten: dann Preis + Knopf fest einblenden.
       Vorher nur nach dem Vorbeiscrollen; Anzeigen-Besucher sahen so auf dem ersten Bildschirm weder Preis noch Knopf (04.09.2026) */
    const vorbei=r.bottom<0 || r.top>innerHeight;
    const amEnde=(innerHeight+scrollY)>=document.documentElement.scrollHeight-140;
    bar.classList.toggle("zeig", false && vorbei && !amEnde); };
  addEventListener("scroll",pruefen,{passive:true});
  addEventListener("resize",pruefen,{passive:true});
  pruefen(); setTimeout(pruefen,600);
  pruefen();
}


/* ---------- Handy: Menue hinter dem Burger ---------- */
function handyMenue(){
  const b=q(".burger"), quelle=q(".menu"); if(!b||!quelle) return;
  if(q("#navPanel")) return;
  const hg=document.createElement("div"); hg.className="nav-hg"; hg.id="navHg";
  const p=document.createElement("nav"); p.className="nav-panel"; p.id="navPanel";
  p.setAttribute("aria-label","Hauptmenü"); p.setAttribute("aria-hidden","true");
  const kopf=document.createElement("div"); kopf.className="np-kopf";
  kopf.innerHTML='<span class="np-titel">Menü</span><button class="np-zu" type="button" aria-label="Menü schließen"><svg class="ico" aria-hidden="true"><use href="#i-x"/></svg></button>';
  p.appendChild(kopf);
  const liste=document.createElement("div"); liste.className="np-liste";
  quelle.querySelectorAll("a").forEach(a=>{const k=a.cloneNode(true); liste.appendChild(k);});
  p.appendChild(liste);
  const fuss=document.createElement("div"); fuss.className="np-fuss";
  const dazu=[["So geht's","so-gehts"],["Häufige Fragen","haeufige-fragen"],["Bestellung verfolgen","bestellung"],["Versand & Rückgabe","versand"],["Über uns","ueber-uns"]];
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
  const TEXTE={offen:"Zahlung ausstehend",bezahlt:"Bezahlt – wir bereiten den Druck vor",
               im_druck:"Im Druck",versandt:"Versandt",storniert:"Storniert"};
  /* Kennung nur fuer die Ratenbegrenzung, rein zufaellig und lokal */
  let kennung=null;
  try{ kennung=localStorage.getItem("walleria_abfrage"); }catch(e){}
  if(!kennung){ kennung="k"+Math.random().toString(36).slice(2)+Date.now().toString(36);
    try{ localStorage.setItem("walleria_abfrage",kennung); }catch(e){} }

  const zeige=(html,art)=>{ ausgabe.hidden=false; ausgabe.className="best-ausgabe "+(art||""); ausgabe.innerHTML=html; };

  form.addEventListener("submit",async ev=>{
    ev.preventDefault();
    const nr=q("#bestNr").value.trim().toUpperCase(), mail=q("#bestMail").value.trim();
    if(!nr||!mail) return;
    knopf.disabled=true; knopf.textContent="Wird geprüft …";
    try{
      const r=await fetch(window.SUPABASE_URL+"/rest/v1/rpc/walleria_bestellung_status",{
        method:"POST",
        headers:{apikey:window.SUPABASE_KEY,Authorization:"Bearer "+window.SUPABASE_KEY,"Content-Type":"application/json"},
        body:JSON.stringify({p_nummer:nr,p_email:mail,p_kennung:kennung})});
      const d=await r.json();
      if(!d||d.ok!==true){
        const grund=d&&d.fehler;
        if(grund==="zu_viele_versuche") zeige("<b>Zu viele Versuche.</b><p>Bitte warte fünf Minuten und probier es dann noch einmal.</p>","warn");
        else if(grund==="zu_alt") zeige("<b>Diese Bestellung ist älter als zwölf Monate.</b><p>Schreib uns an <a href='mailto:"+window.WALLERIA_MAIL+"'>"+window.WALLERIA_MAIL+"</a>, wir schauen für dich nach.</p>","warn");
        else zeige("<b>Wir finden dazu keine Bestellung.</b><p>Prüf bitte Bestellnummer und E-Mail-Adresse. Beides muss zu derselben Bestellung gehören.</p>","warn");
        return;
      }
      const posten=(d.posten||[]).map(p=>{
        const teile=[p.groesse,p.name?("Name: "+esc(p.name)):"",p.farbe].filter(Boolean).join(" · ");
        return "<li><b>"+esc(p.titel||"Poster")+"</b>"+(teile?"<small>"+esc(teile)+"</small>":"")+(p.menge>1?"<span>"+p.menge+"×</span>":"")+"</li>";
      }).join("");
      const summe=d.summe_cent!=null?(d.summe_cent/100).toFixed(2).replace(".",",")+" €":"";
      /* Digitale Dateien: eigener Weg statt Druck/Versand (Julian, 04.09.2026: "kann es nirgends downloaden") */
      const istDigital=p=>!!p.digital||/Digitale Datei/i.test(p.groesse||"");
      const digital=(d.posten||[]).some(istDigital), nurDigital=(d.posten||[]).length&&(d.posten||[]).every(istDigital);
      const T=Object.assign({},TEXTE); if(nurDigital) T.bezahlt="Bezahlt – deine Dateien werden erstellt";
      const schritte=nurDigital?["bezahlt","dateien"]:["bezahlt","im_druck","versandt"];
      const jetzt=Math.max(0,schritte.indexOf(d.status));
      const leiste=schritte.map((s,i)=>'<span class="'+(i<=jetzt?"an":"")+'" data-schritt="'+s+'">'+(s==="dateien"?"Dateien fertig":TEXTE[s].split(" – ")[0])+"</span>").join("");
      const dateienBlock=digital?'<section class="best-dateien" id="bestDateien"><h3>Deine Dateien</h3><p class="small" id="bestDateienStand">Wir holen deine Dateien …</p><div id="bestDateienListe"></div></section>':"";
      zeige(
        '<div class="best-kopf"><span class="best-nr">'+esc(d.nummer)+'</span><b class="best-status s-'+d.status+'">'+(T[d.status]||d.status)+"</b></div>"+
        (d.status!=="storniert"?'<div class="best-leiste">'+leiste+"</div>":"")+
        "<dl class=\"best-daten\"><dt>Bestellt am</dt><dd>"+esc(d.bestellt_am||"–")+"</dd>"+
        (d.bezahlt_am?"<dt>Bezahlt am</dt><dd>"+esc(d.bezahlt_am)+"</dd>":"")+
        (d.versandt_am?"<dt>Versandt am</dt><dd>"+esc(d.versandt_am)+"</dd>":"")+
        (summe?"<dt>Summe</dt><dd>"+summe+"</dd>":"")+
        (d.sendungsnr?"<dt>Sendungsnummer</dt><dd>"+esc(d.sendungsnr)+(d.versanddienst?" ("+esc(d.versanddienst)+")":"")+"</dd>":"")+
        "</dl>"+(posten?"<h3>Deine Artikel</h3><ul class=\"best-posten\">"+posten+"</ul>":"")+dateienBlock,"ok");
      if(digital) dateienHolen(nr,mail,1);
    }catch(e){
      zeige("<b>Das hat gerade nicht geklappt.</b><p>Bitte versuch es in einem Moment noch einmal.</p>","warn");
    }finally{
      knopf.disabled=false; knopf.textContent="Status anzeigen";
    }
  });

  /* Download-Links wie auf der Danke-Seite: Nummer + E-Mail sind der Schluessel */
  async function dateienHolen(nummer,mail,versuch){
    const stand=q("#bestDateienStand"), liste=q("#bestDateienListe"); if(!stand||!window.WALLERIA_DOWNLOAD) return;
    try{
      const r=await fetch(window.WALLERIA_DOWNLOAD,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nummer,email:mail})});
      const d=await r.json();
      if(!d||d.ok!==true){ stand.textContent=d&&d.fehler==="nicht_bezahlt"?"Die Zahlung ist noch nicht bestätigt.":"Dateien gerade nicht abrufbar – schreib uns kurz, wir schicken sie dir."; return; }
      const fertig=(d.pakete||[]).filter(x=>x.zustand==="fertig");
      if(!fertig.length){
        stand.textContent="Deine Poster werden gerade gezeichnet – das dauert ein bis drei Minuten. Diese Seite aktualisiert sich von selbst.";
        if(versuch<20) setTimeout(()=>dateienHolen(nummer,mail,versuch+1),12000); else stand.textContent="Das dauert länger als gewohnt. Wir melden uns per E-Mail, sobald die Dateien fertig sind.";
        return;
      }
      stand.textContent="Fertig – hier sind deine Dateien. Die Links gelten sieben Tage; danach einfach hier neu abrufen.";
      const s2=q('#bestErgebnis [data-schritt="dateien"]'); if(s2) s2.classList.add("an");
      const st=q("#bestErgebnis .best-status"); if(st&&/Dateien werden erstellt/.test(st.textContent)) st.textContent="Bezahlt – Dateien fertig";
      liste.innerHTML='<div class="datei-liste">'+fertig.map(pk=>pk.dateien.map(f=>'<div class="datei"><span><b>'+esc(f.name)+"</b>"+(pk.titel?"<small>"+esc(pk.titel)+"</small>":"")+"</span>"+'<a class="btn" href="'+f.url+'" download>Herunterladen</a></div>').join("")).join("")+"</div>";
    }catch(e){ stand.textContent="Das hat gerade nicht geklappt. Bitte lade die Seite neu."; }
  }

  /* Nummer aus der Bestätigungsseite übernehmen */
  const p=new URLSearchParams(location.search).get("bestellung");
  if(p) q("#bestNr").value=p;
}


/* Filtergruppen: auf dem Handy zu, am Rechner offen. Merkt sich die Wahl. */
function filterGruppen(){
  const grp=[...document.querySelectorAll(".fgrp")]; if(!grp.length) return;
  const schmal=matchMedia("(max-width:900px)").matches;
  let gemerkt=null;
  try{ gemerkt=JSON.parse(localStorage.getItem("walleria_filter")||"null"); }catch(e){}
  grp.forEach(d=>{
    const k=d.dataset.grp;
    if(gemerkt && k in gemerkt) d.open=!!gemerkt[k];
    else d.open=!schmal;                       /* Voreinstellung nach Bildschirmbreite */
    d.addEventListener("toggle",()=>{
      const stand={}; grp.forEach(x=>stand[x.dataset.grp]=x.open);
      try{ localStorage.setItem("walleria_filter",JSON.stringify(stand)); }catch(e){}
    });
  });
}


/* ---------- Besucherzählung: kein Cookie, keine Wiedererkennung ---------- */
function werbeKennung(){
  /* Woher kam der Klick? Nur die vier utm-Felder, nur harmlose Zeichen.
     Wird ausschliesslich bei der Landeseite mitgeschickt - kein Merken ueber
     Seiten hinweg, also kein Speicher auf dem Geraet des Besuchers. */
  try{
    const q=new URLSearchParams(location.search);
    const teile=["utm_source","utm_medium","utm_campaign","utm_content"]
      .map(k=>(q.get(k)||"").replace(/[^A-Za-z0-9_.-]/g,"").slice(0,40));
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
    /* sendBeacon geht auch noch beim Verlassen der Seite durch */
    if(navigator.sendBeacon){
      try{ navigator.sendBeacon(ziel, new Blob([rumpf],{type:"application/json"})); return; }catch(e){}
    }
    fetch(ziel,{method:"POST",headers:{"Content-Type":"application/json"},body:rumpf,keepalive:true}).catch(()=>{});
  };

  senden({art:"seite"});

  /* Verweildauer beim Verlassen nachmelden */
  const start=Date.now(); let gemeldet=false;
  const abschluss=()=>{ if(gemeldet)return; gemeldet=true;
    const s=Math.round((Date.now()-start)/1000);
    if(s>=3) senden({art:"seite",dauer_s:s}); };
  addEventListener("pagehide",abschluss);
  document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="hidden") abschluss(); });

  /* Klicks auf die Dinge, die zählen - kein Mitschnitt von allem */
  document.addEventListener("click",e=>{
    const a=e.target.closest("a,button"); if(!a) return;
    let was=null;
    if(a.id==="inKorb") was="in-den-warenkorb";
    else if(a.id==="kAbsenden"||/zahlungspflichtig/i.test(a.textContent||"")) was="zur-kasse";
    else if(a.closest(".card")) was="poster:"+(a.closest(".card").querySelector("h3")||{textContent:""}).textContent.trim().slice(0,60);
    else if(a.classList.contains("kat")||a.classList.contains("tile")) was="kategorie:"+(a.textContent||"").trim().slice(0,40);
    else if(a.classList.contains("szene-an")) was="im-raum-ansehen";
    else if(a.closest("footer")) was="fuss:"+(a.textContent||"").trim().slice(0,40);
    else if(a.closest(".nav-panel")) was="menue:"+(a.textContent||"").trim().slice(0,40);
    if(was) senden({art:"klick",ziel:was});
  },{passive:true});
}


/* ---------- Danke-Seite: Dateien sofort zum Herunterladen ---------- */
function dankeSeite(){
  const bereich=q("#dankeDownload"); if(!bereich) return;
  const p=new URLSearchParams(location.search);
  const nummer=p.get("bestellung");
  if(!nummer) return;
  /* Gekauft ist gekauft: Warenkorb leeren, sonst liegt das Poster nach dem Kauf noch drin (04.09.2026) */
  try{ localStorage.removeItem("jmp_korb"); korb.length=0; korbZeigen(); }catch(e){}

  const nr=q("#dankeNummer");
  if(nr){ nr.hidden=false; nr.textContent="Bestellnummer "+nummer; }
  const verfolgen=q("#dankeVerfolgen");
  if(verfolgen) verfolgen.href=verfolgen.getAttribute("href")+"?bestellung="+encodeURIComponent(nummer);

  /* Die E-Mail kennt der Browser nach dem Kauf nicht mehr sicher - wir fragen
     sie einmal ab. Das ist zugleich der Schutz: Nummer und E-Mail müssen passen. */
  let mail="";
  try{ mail=sessionStorage.getItem("walleria_kaufmail")||""; }catch(e){}
  bereich.hidden=false;
  const liste=q("#dankeListe"), stand=q("#dankeStatus");

  if(!mail){
    liste.innerHTML='<form class="best-form" id="dankeForm" style="border:0;padding:0">'
      +'<div class="field"><label for="dankeMail">E-Mail-Adresse deiner Bestellung</label>'
      +'<input id="dankeMail" type="email" required placeholder="du@beispiel.de"></div>'
      +'<button class="btn" type="submit">Dateien anzeigen</button></form>';
    stand.textContent="Zur Sicherheit brauchen wir noch deine E-Mail-Adresse.";
    q("#dankeForm").addEventListener("submit",ev=>{ ev.preventDefault();
      const m=q("#dankeMail").value.trim(); if(!m) return;
      try{ sessionStorage.setItem("walleria_kaufmail",m); }catch(e){}
      holen(nummer,m); });
    return;
  }
  holen(nummer,mail);

  async function holen(nummer,mail,versuch){
    versuch=versuch||1;
    stand.textContent = versuch===1 ? "Wir holen deine Dateien …" : "Deine Poster werden gerade gezeichnet …";
    try{
      const r=await fetch(window.WALLERIA_DOWNLOAD,{method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({nummer,email:mail})});
      const d=await r.json();
      if(!d||d.ok!==true){
        stand.textContent = d&&d.fehler==="nicht_bezahlt"
          ? "Die Zahlung ist noch nicht bestätigt. Das dauert meist nur einen Moment."
          : "Wir finden dazu keine Bestellung. Prüf bitte die E-Mail-Adresse.";
        return;
      }
      if(!d.pakete.length){ bereich.hidden=true; return; }   /* nur gedruckte Ware */
      const fertig=d.pakete.filter(x=>x.zustand==="fertig");
      if(!fertig.length){
        stand.textContent="Deine Poster werden gerade gezeichnet – das dauert ein bis drei Minuten. "
          +"Diese Seite aktualisiert sich von selbst.";
        if(versuch<20) setTimeout(()=>holen(nummer,mail,versuch+1), 12000);
        else stand.textContent="Das dauert länger als gewohnt. Wir melden uns per E-Mail, sobald die Dateien fertig sind.";
        return;
      }
      stand.textContent="Fertig – hier sind deine Dateien.";
      liste.innerHTML='<div class="datei-liste">'+fertig.map(pk=>
        pk.dateien.map(f=>'<div class="datei"><span><b>'+esc(f.name)+"</b>"
          +(pk.titel?"<small>"+esc(pk.titel)+"</small>":"")+"</span>"
          +'<a class="btn" href="'+f.url+'" download>Herunterladen</a></div>').join("")
      ).join("")+"</div>";
    }catch(e){
      stand.textContent="Das hat gerade nicht geklappt. Über „Bestellung verfolgen“ kommst du jederzeit an deine Dateien.";
    }
  }
}

function initSeite(){
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
  /* Statistik-Seite: eigenes Geraet vom Zaehler ausnehmen */
  const sn=q("#stNicht"); if(sn){ const lesen=()=>{ try{ return localStorage.getItem("walleria_nicht_zaehlen")==="1"; }catch(e){ return false; } };
    const zeigen=()=>{ sn.textContent=lesen()?"Dieses Gerät wird nicht gezählt – wieder zählen":"Dieses Gerät nicht zählen"; };
    zeigen(); sn.addEventListener("click",()=>{ try{ localStorage.setItem("walleria_nicht_zaehlen", lesen()?"0":"1"); }catch(e){} zeigen(); toast(lesen()?"Dieses Gerät wird nicht mehr gezählt":"Dieses Gerät wird wieder gezählt"); }); }
  /* Zur Kasse: fuehrt auf die Kassenseite (vorher stand hier noch der Prototyp-Toast - Julian, 04.09.2026) */
  const ka=q("#kasse"); if(ka) ka.onclick=()=>{ if(!korb.length){ toast("Dein Warenkorb ist noch leer"); return; } location.href="kasse"; };
  korbZeigen();
  /* Hero-Video */
  const hv=q("#heroVideo"); if(hv&&hv.querySelector("source")){hv.muted=true; const go=()=>hv.play().then(()=>q("#hero").classList.add("has-video")).catch(()=>{}); hv.addEventListener("canplay",go,{once:true}); let gestartet=false; const start=()=>{ if(gestartet) return; gestartet=true; hv.preload="auto"; hv.load(); go(); }; if(document.readyState==="complete") setTimeout(start,900); else addEventListener("load",()=>setTimeout(start,900),{once:true}); ["pointerdown","touchstart","scroll","keydown"].forEach(ev=>addEventListener(ev,()=>{start(); if(hv.paused)go();},{passive:true,once:true}));}
  /* Startseite: Live-Block */
  const nameIn=q("#nameIn"), poster=q("#poster");
  if(nameIn&&poster){ npRender(poster,""); nameIn.addEventListener("input",()=>{ if(istLive(poster.dataset.design)) npRender(poster,nameIn.value); });
    document.querySelectorAll(".live .dsg").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".live .dsg").forEach(x=>x.setAttribute("aria-pressed","false")); b.setAttribute("aria-pressed","true"); poster.dataset.design=b.dataset.design; const live=istLive(b.dataset.design); q("#dsgNote").hidden=live;
      if(live) npRender(poster,nameIn.value); else { const k0="set_"+b.dataset.design+"_0"; poster.innerHTML=`<img alt="Musterposter" style="width:100%;height:100%;display:block;object-fit:cover">`; const im0=poster.querySelector("img"); if(window.IMGMAP&&IMGMAP[k0]) im0.src=IMGMAP[k0]; else im0.src="img/"+k0+".jpg"; }
      document.querySelectorAll("#begleiter img").forEach((im,i)=>{const k="set_"+b.dataset.design+"_"+(i+1); im.removeAttribute("src"); im.dataset.k=k; if(window.IMGMAP&&IMGMAP[k]) im.src=IMGMAP[k]; else im.src="img/"+k+".jpg";});}));
    q("#liveForm").addEventListener("submit",e=>{e.preventDefault(); const z=q("#liveForm").dataset.ziel; const n=encodeURIComponent(nameIn.value.trim()); try{sessionStorage.setItem("jmp_name",nameIn.value.trim());}catch(err){} if(window.geheZu&&!z.endsWith(".html")){window.geheZu(z.replace(/^#\//,""));} else {location.href=z+"?name="+n;}}); }
  /* Produktseite */
  const pdp=q(".pdp"); if(pdp){ let groesse=0, farbe="";
    const sizes=[...pdp.querySelectorAll("#groessen button")];
    let art=(pdp.querySelector('#art input:checked')||{value:"digital"}).value;
    const dig=parseFloat(q(".preis").dataset.digital||"6.99");
    const digAlt=parseFloat(q(".preis").dataset.digitalAlt||"0")||Math.round(dig/0.7*100)/100;
    const preisZeigen=()=>{ if(art==="digital"){ q("#preis").textContent=eur(dig); q("#preisAlt").textContent=eur(digAlt); q("#preisTag").textContent="−"+Math.round((1-dig/digAlt)*100)+" %"; } else { const b=sizes[groesse]; const alt=parseFloat(b.dataset.preis); q("#preis").textContent=eur(alt*(1-RABATT)); q("#preisAlt").textContent=eur(alt); q("#preisTag").textContent="−30 %"; } };
    pdp.querySelectorAll("#art input").forEach(r=>r.addEventListener("change",()=>{ art=r.value; pdp.querySelectorAll("#art label").forEach(l=>l.classList.toggle("on",l.contains(r))); q("#feldGroesse").hidden=(art==="digital"); q("#einw").hidden=(art!=="digital"); preisZeigen(); }));
    sizes.forEach((b,i)=>b.addEventListener("click",()=>{groesse=i; sizes.forEach((y,j)=>y.setAttribute("aria-pressed",j===i)); preisZeigen();}));
    /* Anfangszustand passend zur vorgewaehlten Ausfuehrung setzen */
    (()=>{ const r=pdp.querySelector("#art input:checked");
      if(r) pdp.querySelectorAll("#art label").forEach(l=>l.classList.toggle("on",l.contains(r)));
      const fg=q("#feldGroesse"), ei=q("#einw");
      if(fg) fg.hidden=(art==="digital"); if(ei) ei.hidden=(art!=="digital");
      preisZeigen(); })();
    pdp.querySelectorAll(".thumbs button").forEach(b=>b.addEventListener("click",()=>{pdp.querySelectorAll(".thumbs button").forEach(x=>x.setAttribute("aria-pressed","false")); b.setAttribute("aria-pressed","true"); const im=q("#galMain img"); const k=b.dataset.k; im.removeAttribute("src"); im.dataset.k=k; bilderSetzen(); if(!window.IMGMAP) im.src="img/"+k+".jpg"; const lm=q("#liveMain"); if(lm){lm.hidden=true; q("#galMain").hidden=false;}}));
    /* Gewaehltes Design / gewaehlte Farbe auch als Foto zeigen: die Karte
       data-design-bilder / data-farb-bilder sagt, welche Szene es dafuer gibt. */
    const bildZeigen=(k)=>{ if(!k) return; const im=q("#galMain img"); if(!im) return; im.removeAttribute("src"); im.dataset.k=k; bilderSetzen(); if(!window.IMGMAP) im.src="img/"+k+".jpg"; const lm=q("#liveMain"); if(lm){lm.hidden=true; q("#galMain").hidden=false;} pdp.querySelectorAll(".thumbs button").forEach(x=>x.setAttribute("aria-pressed", x.dataset.k===k?"true":"false")); };
    const designBilder=JSON.parse(pdp.dataset.designBilder||"{}"), farbBilder=JSON.parse(pdp.dataset.farbBilder||"{}");
    const farbKey=(f)=>/blau/i.test(f)?"blau":/wei/i.test(f)?"weiss":"rosa";
    pdp.querySelectorAll(".farben button").forEach(b=>b.addEventListener("click",()=>{pdp.querySelectorAll(".farben button").forEach(x=>x.setAttribute("aria-pressed","false")); b.setAttribute("aria-pressed","true"); farbe=b.dataset.farbe; bildZeigen(farbBilder[farbKey(farbe)]);}));
    /* Ultraschallbild: im Browser verkleinern, hochladen, Kennung merken.
       Ein Handyfoto hat gern 6 MB - verkleinert kommt es auch bei schlechtem
       Netz durch, und fuer die Aquarell-Zeichnung reichen 2000 px allemal. */
    let usKennung="";
    const usFeld=q("#usBild");
    if(usFeld){
      const vorschau=q("#usVorschau");
      usFeld.addEventListener("change",()=>{
        const datei=(usFeld.files||[])[0]; usFeld.value="";
        if(!datei) return;
        if(datei.size > 12*1024*1024){ toast("Das Bild ist größer als 12 MB."); return; }
        const leser=new FileReader();
        leser.onerror=()=>toast("Das Bild ließ sich nicht lesen.");
        leser.onload=()=>{
          const bild=new Image();
          bild.onerror=()=>toast("Das Bild ließ sich nicht öffnen.");
          bild.onload=()=>{
            let w=bild.width,h=bild.height,max=2000;
            if(w>max||h>max){ const f=max/Math.max(w,h); w=Math.round(w*f); h=Math.round(h*f); }
            const c=document.createElement("canvas"); c.width=w; c.height=h;
            c.getContext("2d").drawImage(bild,0,0,w,h);
            const daten=c.toDataURL("image/jpeg",0.9);
            vorschau.innerHTML="";
            const im=document.createElement("img"); im.src=daten; im.alt="Dein Ultraschallbild";
            const weg=document.createElement("button"); weg.type="button"; weg.className="usb-weg";
            weg.textContent="Anderes Bild wählen";
            weg.addEventListener("click",()=>{ usKennung=""; vorschau.innerHTML=""; });
            const stand=document.createElement("span"); stand.className="small muted";
            stand.textContent="wird übertragen …";
            vorschau.appendChild(im); vorschau.appendChild(stand); vorschau.appendChild(weg);
            fetch(window.WALLERIA_KUNDENBILD,{method:"POST",
                headers:{"Content-Type":"application/json","apikey":window.SUPABASE_KEY},
                body:JSON.stringify({produkt:pdp.dataset.id||"",bild:daten})})
              .then(r=>r.json()).then(a=>{
                if(a&&a.ergebnis==="ok"){ usKennung=a.kennung; stand.textContent="übertragen"; }
                else { stand.textContent="hat nicht geklappt"; toast("Das Bild kam nicht an. Versuch es noch einmal."); }
              })
              .catch(()=>{ stand.textContent="hat nicht geklappt"; });
          };
          bild.src=leser.result;
        };
        leser.readAsDataURL(datei);
      });
    }

    const kn=q("#kName")||q("[data-pers-feld][data-pflicht]"), kd=q("#kDatum"), lm=q("#liveMain");
    const kn2=q("#kName2"), feld2=kn2?kn2.closest(".field"):null;
    let anzahlNamen=1;

    /* Zwei Geschwister teilen sich ein Poster: "J & J" oben, "Julian & Johanna" darunter. */
    const namenText=()=>{
      const n=(kn&&kn.value.trim())||"";
      const n2=(kn2&&kn2.value.trim())||"";
      return (anzahlNamen===2 && n && n2) ? n+" & "+n2 : (n||n2);
    };

    const vorschau=()=>{ if(!lm) return;
      const t=namenText(); if(!t) return;
      lm.hidden=false; q("#galMain").hidden=true;
      npRender(q("#liveMain .poster"), t);
    };

    /* Ein oder zwei Namen umschalten */
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
    if(kn){ let vor=""; try{vor=new URLSearchParams(location.search).get("name")||sessionStorage.getItem("jmp_name")||"";}catch(e){} if(vor){kn.value=vor;} kn.addEventListener("input",vorschau); if(kd) kd.addEventListener("input",vorschau); vorschau(); try{sessionStorage.removeItem("jmp_name");}catch(e){} }
    /* Auswahl-Knoepfe (frueher Dropdown): Wert ins versteckte Feld, Bild wechseln, wenn es eins je Option gibt */
    const optBilder=JSON.parse(pdp.dataset.optBilder||"{}");
    pdp.querySelectorAll(".chips").forEach(g=>{ const ziel=q("#"+g.dataset.fuer); g.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
      g.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed","false")); b.setAttribute("aria-pressed","true");
      if(ziel){ ziel.value=b.dataset.opt; ziel.dispatchEvent(new Event("input")); }
      const k=(optBilder[g.dataset.fuer]||{})[b.dataset.opt]; if(k) bildZeigen(k); })); });
    /* Designwahl */
    let design="";
    const dsgKnoepfe=[...pdp.querySelectorAll("#designs button")];
    if(dsgKnoepfe.length){
      design=dsgKnoepfe[0].dataset.design;
      dsgKnoepfe.forEach(b=>b.addEventListener("click",()=>{
        dsgKnoepfe.forEach(x=>x.setAttribute("aria-pressed","false"));
        b.setAttribute("aria-pressed","true"); design=b.dataset.design; bildZeigen(designBilder[b.dataset.nr]); }));
    }
    /* Alle Personalisierungsfelder des Produkts einsammeln - Name, Datum, Gewicht ... */
    const persFelder=()=>{
      let l=[...pdp.querySelectorAll("[data-pers-feld]")]
        .map(e=>({feld:e.dataset.persFeld, wert:e.value.trim(), id:e.id})).filter(x=>x.wert);
      /* Was auf einem Poster steht, gehoert auch als eine Zeile in die Bestellung -
         sonst druckt die Produktion aus zwei Feldern zwei Poster. */
      if(anzahlNamen===2 && kn && kn2 && kn.value.trim() && kn2.value.trim()){
        l=l.filter(x=>x.id!=="kName" && x.id!=="kName2");
        l.unshift({feld:"Namen", wert:kn.value.trim()+" & "+kn2.value.trim()});
      }
      if(design) l.unshift({feld:"Design", wert:design});
      if(typeof farbe!=="undefined" && farbe) l.push({feld:"Farbe", wert:farbe});
      if(usKennung) l.push({feld:"Ultraschallbild", wert:usKennung});
      return l.map(x=>({feld:x.feld, wert:x.wert})); };
    const persText=()=>persFelder().map(x=>x.feld+": "+x.wert).join(" · ");
    q("#inKorb").addEventListener("click",()=>{ if(pdp.dataset.pers==="1" && !(kn&&kn.value.trim())){if(kn)kn.focus(); toast("Bitte zuerst "+((kn&&kn.dataset.persFeld)||"den Namen").replace(/\s*\((freiwillig|optional)\)/i,"")+" eintragen"); return;}
      /* Pflichtfelder aus dem Etsy-Schema: leer -> freundlich anmahnen, nicht abschicken */
      const leer=[...pdp.querySelectorAll("[data-pers-feld][data-pflicht]")].find(e=>!e.value.trim());
      if(leer){ leer.focus(); toast("Bitte noch ausfüllen: "+leer.dataset.persFeld.replace(/\s*\((freiwillig|optional)\)/i,"")); return; }
      if(usFeld && !usKennung){ toast("Bitte lade dein Ultraschallbild hoch – daraus zeichnen wir das Poster."); usFeld.focus(); return; }
      if(art==="digital" && !q("#einwBox").checked){ toast("Bitte der sofortigen Bereitstellung zustimmen"); q("#einwBox").focus(); return; }
      const b=sizes[groesse]; const bild=pdp.dataset.bild||("g_"+pdp.dataset.id+"_0");
      const angaben=persFelder(), beschriftung=persText();
      const pid=pdp.dataset.id||"";
      const korbBild=pdp.dataset.bildflach||bild, url=pdp.dataset.url||location.pathname.replace(/^\//,"");
      if(art==="digital") korb.push({produkt:pid,titel:pdp.dataset.titel,img:korbBild,url,menge:1,groesse:"Digitale Datei (JPG in 5 Größen bis 50×70 cm)",name:kn?kn.value.trim():"",angaben,beschriftung,farbe,preis:dig});
      else korb.push({produkt:pid,titel:pdp.dataset.titel,img:korbBild,url,menge:1,groesse:b.firstChild.textContent+" cm",name:kn?kn.value.trim():"",angaben,beschriftung,farbe,preis:parseFloat(b.dataset.preis)*(1-RABATT)}); korbSpeichern(); korbZeigen(); q("#drawer").classList.add("open"); toast("In den Warenkorb gelegt"); }); }
  /* Kasse */
const kf=q("#kForm"); if(kf){
  kf.addEventListener("submit",()=>{ const m=q("#kMail"); if(m&&m.value) try{ sessionStorage.setItem("walleria_kaufmail",m.value.trim()); }catch(e){} });
  let digital=false, nurDigital=false, s=0;
  /* Kasse zeichnen - auch nach dem Entfernen eines Postens neu (Julian, 04.09.2026) */
  function kasseZeigen(){
    digital=korb.some(k=>/Digitale Datei/.test(k.groesse)); nurDigital=korb.length&&korb.every(k=>/Digitale Datei/.test(k.groesse));
    q("#kEinwDigital").hidden=!digital;
    /* Rein digital: keine Lieferadresse noetig - Stripe fragt die Rechnungsadresse selbst ab (05.09.2026) */
    ["kStr","kPlz","kOrt"].forEach(id=>{ const e=q("#"+id); if(!e) return; const w=e.closest(".field")||e; w.hidden=!!nurDigital; e.required=!nurDigital; });
    const hAdr=q("#kAdresseTitel"); if(hAdr) hAdr.textContent=nurDigital?"Deine Daten":"Lieferadresse";
    const ul=q("#kListe"); ul.innerHTML=""; s=0;
    if(!korb.length){ ul.innerHTML='<li class="empty">Dein Warenkorb ist leer. <a href="alle-poster">Zu den Postern</a></li>'; q("#kPay").disabled=true; }
    else q("#kPay").disabled=false;
    korb.forEach((k,i)=>{ const m=k.menge||1; s+=k.preis*m; const li=document.createElement("li"); const info=(window.PRODUKT_INFO||{})[k.produkt]; const href=esc((info&&info.u)||k.url||""); const bildKey=(info&&info.f)?("f_"+k.produkt):(k.img||"");
      li.innerHTML=`${href?`<a href="${href}" class="korb-bild${(info&&info.s)?" set":""}">`:`<span class="korb-bild${(info&&info.s)?" set":""}">`}<img data-k="${bildKey}" alt="${esc(k.titel)}">${href?"</a>":"</span>"}<div class="t"><b>${href?`<a href="${href}">${esc(k.titel)}</a>`:esc(k.titel)}</b>${artEtikett(k)}<small>${esc(groesseKurz(k))}${k.name?" · "+esc(k.name):""}</small>${istDigital(k)?"":mengeSteuer(i,m)}</div><b>${eur(k.preis*m)}</b><button type="button" class="btn line" style="padding:4px 8px;min-height:32px" data-del="${i}" aria-label="${esc(k.titel)} entfernen" title="Entfernen">✕</button>`; ul.appendChild(li); });
    bilderSetzen(ul); mengeHandler(ul,()=>{ korbSpeichern(); korbZeigen(); kasseZeigen(); });
    ul.querySelectorAll("[data-del]").forEach(b=>b.addEventListener("click",()=>{ korb.splice(+b.dataset.del,1); korbSpeichern(); korbZeigen(); kasseZeigen(); toast("Aus dem Warenkorb entfernt"); }));
    const r=digiRabatt(korb); const netto=s-r.betrag;
    const hz=q("#kHinweise"); const h=korb.length?korbHinweise(korb):""; hz.hidden=!h; hz.innerHTML=h;
    q("#kRabattZeile").hidden=!r.anteil; q("#kRabatt").textContent="−"+eur(r.betrag);
    /* Gutschein: Stripe zieht ihn von den (schon rabattierten) Posten ab, nicht vom Versand */
    let gut=0; if(gutschein){ gut=gutschein.percent?netto*gutschein.percent/100:Math.min(netto,gutschein.betrag||0); gut=Math.round(gut*100)/100; }
    q("#kGutscheinZeile").hidden=!gut; q("#kGutscheinText").textContent="Gutschein "+(gutschein?gutschein.code:""); q("#kGutschein").textContent="−"+eur(gut);
    const versand=(nurDigital||!korb.length||netto>=VERSANDFREI)?0:VERSAND;
    q("#kVersandText").textContent=nurDigital?"Versand (digitale Datei)":(netto>=VERSANDFREI?"Versand (ab 60 € frei)":"Versand");
    q("#kZwischen").textContent=eur(s); q("#kVersand").textContent=eur(versand); q("#kGesamt").textContent=eur(Math.max(0,netto-gut)+versand);
  }
  let gutschein=null;
  async function codePruefen(){
    const inp=q("#kCode"), stand=q("#kCodeStand"), btn=q("#kCodeBtn"); const code=inp.value.trim().toUpperCase();
    if(!code){ gutschein=null; stand.hidden=true; kasseZeigen(); return; }
    btn.disabled=true; btn.textContent="Prüfe …";
    try{ const r=await fetch(window.STRIPE_CHECKOUT_URL,{method:"POST",headers:{"Content-Type":"application/json","apikey":window.SUPABASE_KEY},body:JSON.stringify({aktion:"code",code})});
      const j=await r.json();
      if(j.ok){ gutschein={code:j.code,percent:j.percent||0,betrag:j.betrag||0}; stand.hidden=false; stand.className="small ok"; stand.textContent="Gutschein "+j.code+" eingelöst: "+(j.percent?j.percent+" % Rabatt":eur(j.betrag)+" Rabatt")+"."; }
      else { gutschein=null; stand.hidden=false; stand.className="small nein"; stand.textContent=j.fehler||"Gutscheincode ungültig."; }
    }catch(e){ gutschein=null; stand.hidden=false; stand.className="small nein"; stand.textContent="Prüfung gerade nicht möglich – der Code wird im nächsten Schritt geprüft."; }
    btn.disabled=false; btn.textContent="Einlösen"; kasseZeigen();
  }
  q("#kCodeBtn").addEventListener("click",codePruefen);
  q("#kCode").addEventListener("keydown",e=>{ if(e.key==="Enter"){ e.preventDefault(); codePruefen(); } });
  q("#kCode").addEventListener("input",()=>{ if(gutschein && q("#kCode").value.trim().toUpperCase()!==gutschein.code){ gutschein=null; q("#kCodeStand").hidden=true; kasseZeigen(); } });
  kasseZeigen();
  kf.addEventListener("submit",async e=>{ e.preventDefault();
    if(!korb.length){ toast("Dein Warenkorb ist leer"); return; }
    if(digital && !q("#kDigital").checked){ toast("Bitte der sofortigen Bereitstellung zustimmen"); return; }
    const btn=q("#kPay"); btn.disabled=true; btn.textContent="Weiterleitung zu Stripe …";
    const kunde={ vorname:q("#kVor").value, nachname:q("#kNach").value, email:q("#kMail").value, strasse:q("#kStr").value, plz:q("#kPlz").value, ort:q("#kOrt").value };
    try{ localStorage.setItem("jmp_kunde",JSON.stringify(kunde)); }catch(err){}
    /* Preis in EURO (der Server rechnet selbst in Cent) - und alle Angaben mitgeben,
       sonst weiss der Renderer spaeter nicht, welche Namen aufs Poster sollen. */
    const posten=korb.map(k=>({produkt:k.produkt||"",titel:k.titel,preis:Math.round(k.preis*100)/100,menge:k.menge||1,digital:/Digitale Datei/i.test(k.groesse||""),groesse:k.groesse||"",name:k.name||"",angaben:k.angaben||[],zusatz:[k.beschriftung,(k.farbe?("Farbe: "+k.farbe):"")].filter(Boolean).join(" · ")||k.groesse||""}));
    if(window.STRIPE_CHECKOUT_URL){
      try{ const r=await fetch(window.STRIPE_CHECKOUT_URL,{method:"POST",headers:{"Content-Type":"application/json","apikey":window.SUPABASE_KEY},body:JSON.stringify({posten,kunde,code:(q("#kCode")&&q("#kCode").value.trim().toUpperCase())||""})});
        const j=await r.json(); if(j.url){ location.href=j.url; return; } throw new Error(j.fehler||j.error||"Keine Checkout-URL"); }
      catch(err){ btn.disabled=false; btn.textContent="Zahlungspflichtig bestellen";
        const m=String(err.message||""); q("#kHinweis").textContent=/gutschein/i.test(m)?m:"Zahlung derzeit nicht möglich: "+m;
        if(/gutschein/i.test(m)&&q("#kCode")){ q("#kCode").focus(); q("#kCode").select(); } return; }
    }
    btn.disabled=false; btn.textContent="Zahlungspflichtig bestellen";
    q("#kHinweis").textContent="Die Kasse ist gerade nicht erreichbar. Bitte lade die Seite neu oder schreib uns an "+window.WALLERIA_MAIL+".";
  });
}

/* Bestaetigungs- und Abmeldeseite - beide leben vom Token aus der Mail */
function newsSeite(){
  const titel=q("#nlTitel"); if(!titel || !window.WALLERIA_NEWSLETTER) return;
  const abmelden=/newsletter-abmelden/.test(location.pathname);
  const text=q("#nlText"), kasten=q("#nlGutschein");
  let token=""; try{ token=new URLSearchParams(location.search).get("t")||""; }catch(e){}
  if(!token){ titel.textContent="Link unvollständig"; text.textContent="Bitte öffne den Link aus der E-Mail noch einmal."; return; }
  fetch(window.WALLERIA_NEWSLETTER,{method:"POST",
      headers:{"Content-Type":"application/json","apikey":window.SUPABASE_KEY},
      body:JSON.stringify({aktion:abmelden?"abmelden":"bestaetigen",token})})
   .then(r=>r.json()).then(a=>{
      const e=a&&a.ergebnis;
      if(abmelden && e==="abgemeldet"){
        titel.textContent="Du bist abgemeldet."; text.textContent="Wir schicken dir keine Mails mehr. Schade – aber wir verstehen das."; return;
      }
      if(e==="ok"){
        titel.textContent="Danke, das war's!";
        text.textContent="Deine Anmeldung ist bestätigt. Hier ist dein Gutschein:";
        if(kasten){ kasten.hidden=false; const c=q("#nlCode"); if(c && a.gutschein) c.textContent=a.gutschein; }
        return;
      }
      titel.textContent="Der Link ist nicht mehr gültig.";
      text.textContent="Melde dich einfach noch einmal an, dann schicken wir dir einen neuen.";
   })
   .catch(()=>{ titel.textContent="Das hat nicht geklappt."; text.textContent="Versuch es bitte später noch einmal."; });
}

/* ---------- Newsletter mit doppelter Bestaetigung ---------- */
window.newsAnmelden=function(e){
  e.preventDefault();
  const feld=q("#newsMail"), hinweis=q("#newsHinweis"), btn=e.target.querySelector("button");
  const mail=(feld.value||"").trim();
  if(!mail || !window.WALLERIA_NEWSLETTER){ toast("Bitte gib deine E-Mail-Adresse ein."); return false; }
  btn.disabled=true; const vorher=btn.textContent; btn.textContent="Moment …";
  fetch(window.WALLERIA_NEWSLETTER,{method:"POST",
      headers:{"Content-Type":"application/json","apikey":window.SUPABASE_KEY},
      body:JSON.stringify({email:mail,quelle:location.pathname.replace(/^\/|\.html$/g,"")||"start"})})
   .then(r=>r.json()).then(a=>{
      btn.disabled=false; btn.textContent=vorher;
      const e2=a&&a.ergebnis;
      if(e2==="pruefe_postfach"){
        feld.value="";
        hinweis.className="nl-ok";
        hinweis.innerHTML="<b>Fast geschafft \u2013 schau in dein Postfach.</b>"
          +"<span>Wir haben dir eine Bestätigungsmail geschickt. Klick den Link darin, "
          +"dann liegt dein 10-%-Gutschein bereit.</span>";
        toast("Bestätigungsmail ist unterwegs.");
      }
      else if(e2==="schon_dabei"){
        hinweis.className="nl-ok";
        hinweis.innerHTML="<b>Du bist schon dabei.</b><span>Diese Adresse ist bereits angemeldet.</span>";
      }
      else if(e2==="mail_ungueltig") toast("Diese Adresse sieht nicht richtig aus.");
      else toast("Das hat nicht geklappt. Versuch es später noch einmal.");
   })
   .catch(()=>{ btn.disabled=false; btn.textContent=vorher; toast("Das hat nicht geklappt."); });
  return false;
};

/* ---------- Obere Leiste: Hinweise wechseln ---------- */
function barLauf(){
  const saetze=[...document.querySelectorAll("#bar .bar-satz")];
  if(saetze.length<2) return;
  /* Wer Bewegung abgestellt hat, sieht den ersten Satz - und der bleibt. */
  if(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let i=0;
  setInterval(()=>{
    const alt=saetze[i]; i=(i+1)%saetze.length; const neu=saetze[i];
    alt.classList.remove("an"); alt.classList.add("weg");
    neu.classList.remove("weg"); neu.classList.add("an");
    setTimeout(()=>alt.classList.remove("weg"), 600);
  }, 4200);
}

/* ---------- Suche ---------- */
function suchen(){
  const knopf=q("#suchBtn"), schicht=q("#suche"), feld=q("#suchFeld"), liste=q("#suchListe");
  if(!knopf||!schicht||!feld||!liste) return;
  let daten=window.SUCHINDEX||[];
  /* Der Index (153 Artikel, ~40 KB) wird erst geladen, wenn jemand sucht -
     vorher lag er in jeder einzelnen Seite. */
  const laden=()=>daten.length?Promise.resolve():fetch(window.SUCHINDEX_URL||"suchindex.json").then(r=>r.json()).then(d=>{daten=d;window.SUCHINDEX=d;}).catch(()=>{});

  const zeigen=(txt)=>{
    const s=(txt||"").trim().toLowerCase();
    if(!s){ liste.innerHTML='<p class="such-leer">Tipp einen Namen, ein Motiv oder einen Anlass ein.</p>'; return; }
    /* Alle Wortteile muessen vorkommen - "prinz set" findet die Prinz-Sets. */
    const teile=s.split(/\s+/).filter(Boolean);
    const treffer=daten.filter(e=>teile.every(t=>e.s.includes(t))).slice(0,20);
    if(!treffer.length){ liste.innerHTML='<p class="such-leer">Nichts gefunden. Versuch es mit einem anderen Wort.</p>'; return; }
    liste.innerHTML="";
    treffer.forEach(e=>{
      const a=document.createElement("a"); a.href=e.u;
      const im=document.createElement("img"); im.alt=""; im.loading="lazy"; im.dataset.k=e.b;
      const t=document.createElement("span");
      t.innerHTML="<b>"+esc(e.t)+"</b><small>"+esc(e.k)+"</small>";
      a.appendChild(im); a.appendChild(t); liste.appendChild(a);
    });
    bilderSetzen(liste);
  };

  const auf=()=>{ schicht.hidden=false; zeigen(feld.value); laden().then(()=>zeigen(feld.value)); setTimeout(()=>feld.focus(),30); };
  const zu=()=>{ schicht.hidden=true; };
  knopf.addEventListener("click",auf);
  q("#suchZu").addEventListener("click",zu);
  schicht.addEventListener("click",e=>{ if(e.target===schicht) zu(); });
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape" && !schicht.hidden) zu();
    /* Schraegstrich oeffnet die Suche - aber nicht waehrend man tippt */
    if(e.key==="/" && schicht.hidden && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)){
      e.preventDefault(); auf();
    }
  });
  let warten;
  feld.addEventListener("input",()=>{ clearTimeout(warten); warten=setTimeout(()=>zeigen(feld.value),90); });
  zeigen("");
  /* ?q=… (z. B. aus der Google-Suchbox) oeffnet die Suche direkt mit dem Begriff */
  const q0=new URLSearchParams(location.search).get("q"); if(q0){ feld.value=q0; auf(); }
}

/* Bewertungen – Supabase */
function bewKopf(){ return {"apikey":window.SUPABASE_KEY,"Authorization":"Bearer "+window.SUPABASE_KEY,"Content-Type":"application/json"}; }

/* Kundenfotos: im Browser auf Webgroesse bringen. Ein Handyfoto hat gern 5 MB -
   verkleinert sind es rund 300 KB, und der Upload haengt nicht am Mobilfunk. */
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
    var im=document.createElement("img"); im.src=d; im.alt="Dein Foto "+(i+1);
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
    if(frei<=0){ toast("Mehr als drei Fotos gehen leider nicht."); return; }
    if(dateien.length>frei){ toast("Wir nehmen die ersten "+frei+" Fotos."); dateien=dateien.slice(0,frei); }
    Promise.all(dateien.map(fotoVerkleinern))
      .then(function(l){ bewFotos=bewFotos.concat(l.filter(Boolean)); bewVorschauZeigen(); })
      .catch(function(){ toast("Ein Bild ließ sich nicht lesen."); });
  });
}

window.bewSenden=function(e){
  e.preventDefault();
  var f=e.target, d={};
  new FormData(f).forEach(function(v,k){ if(k!=="fotos") d[k]=(""+v).trim(); });
  if(!window.WALLERIA_BEWERTUNG){ toast("Bewertungen werden bald freigeschaltet."); return false; }
  var nr=(d.bestellung||"").replace(/[^0-9]/g,"");
  if(nr.length<6){ toast("Bitte die Bestellnummer aus deiner Etsy-Bestellung eintragen."); return false; }
  var satz={bestellnummer:Number(nr),produkt:f.dataset.produkt,name:d.name,sterne:Number(d.sterne),text:d.text,fotos:bewFotos};
  var btn=f.querySelector("button[type=submit]"); btn.disabled=true;
  var vorher=btn.textContent; if(bewFotos.length) btn.textContent="Fotos werden geladen …";
  fetch(window.WALLERIA_BEWERTUNG,{method:"POST",headers:bewKopf(),body:JSON.stringify(satz)})
    .then(function(r){ return r.json(); })
    .then(function(a){
      btn.disabled=false; btn.textContent=vorher;
      var e2=a&&a.ergebnis;
      if(e2==="ok"){ f.reset(); bewFotos=[]; bewVorschauZeigen();
        toast("Danke! Wir prüfen deine Bewertung und schalten sie frei."); }
      else if(e2==="schon_bewertet"){ toast("Für diese Bestellung liegt schon eine Bewertung vor."); }
      else if(e2==="bestellung_unbekannt"){ toast("Diese Bestellnummer finden wir nicht. Bitte prüfe sie noch einmal."); }
      else { toast("Bitte fülle alle Felder aus."); }
    })
    .catch(function(){ btn.disabled=false; btn.textContent=vorher; toast("Das hat nicht geklappt. Versuch es später noch einmal."); });
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
      var w=document.createElement("span"); w.className="who"; w.textContent=r.name+" · geprüfter Kauf";
      el.appendChild(st); el.appendChild(p);
      if(r.fotos && r.fotos.length){
        var gal=document.createElement("div"); gal.className="bew-galerie";
        r.fotos.forEach(function(u,i){
          var a=document.createElement("a"); a.href=u; a.target="_blank"; a.rel="noopener";
          a.setAttribute("aria-label","Foto "+(i+1)+" von "+r.name+" groß ansehen");
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
/* Cookie-Consent */
const CK_KEY="jmp_consent_v1", CK_TAGE=182; let consent=null;
try{ const roh=JSON.parse(localStorage.getItem(CK_KEY)||"null");
  if(roh && roh.version===1 && roh.zeit && (Date.now()-new Date(roh.zeit).getTime())/86400000 < CK_TAGE) consent=roh;
  else if(roh) localStorage.removeItem(CK_KEY);
}catch(e){}
window.consentAllows=(k)=>!!(consent&&consent[k]);
function ckZeigen(einst){ const c=q("#cookie"); if(!c) return; c.hidden=false; q("#ckOpts").hidden=!einst; q("#ckSpeichern").hidden=!einst; q("#ckEinst").hidden=!!einst; if(consent){q("#ckStat").checked=!!consent.statistik; q("#ckMark").checked=!!consent.marketing;} }
function ckSetzen(o){ consent={notwendig:true,statistik:!!o.statistik,marketing:!!o.marketing,zeit:new Date().toISOString(),version:1}; try{localStorage.setItem(CK_KEY,JSON.stringify(consent));}catch(e){} q("#cookie").hidden=true; ladeDienste(); }
function ladeDienste(){
  if(!consentAllows("marketing")) return;
  ladeChatGptPixel();
  ladeMetaPixel();
}

/* Meta-Pixel - laedt ausschliesslich nach Marketing-Einwilligung */
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

/* ChatGPT-Ads-Messpixel - laedt ausschliesslich nach Marketing-Einwilligung */
function ladeChatGptPixel(){
  const pid=window.OPENAI_PIXEL_ID;
  if(!pid || window.oaiq) return;
  (function(w,d,s,u){
    var q=function(){ q.q.push(arguments); }; q.q=[]; w.oaiq=q;
    var js=d.createElement(s); js.async=true; js.src=u;
    var f=d.getElementsByTagName(s)[0]; f.parentNode.insertBefore(js,f);
  })(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");
  oaiq("init",{pixelId:pid});
  /* page_viewed verlangt laut SDK den Datentyp "contents" (nicht "customer_action" - damit lehnte
     OpenAI 246 Ereignisse ab; ganz ohne Eigenschaften wird es still verworfen) (04.09.2026) */
  oaiq("measure","page_viewed",{type:"contents"});
  pixelSeitenEreignis();
}

/* Seitenbezogene Ereignisse: Produktansicht, Warenkorb, Kasse, Kauf */
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
/* Alle-Poster-Filter */
const ag=q("#alleGrid"); if(ag){ const karten=[...ag.querySelectorAll(".card")]; const orig=karten.slice();
  const anwenden=()=>{ const k=(document.querySelector('input[name="fk"]:checked')||{}).value||""; const pers=q("#fPers").checked, set=q("#fSet").checked; const s=(document.querySelector('input[name="fs"]:checked')||{}).value||"";
    let n=0; karten.forEach(c=>{ const ok=(!k||c.dataset.kats.split(" ").includes(k))&&(!pers||c.dataset.pers==="1")&&(!set||c.dataset.set==="1"); c.hidden=!ok; if(ok) n++; });
    const sortiert=s==="az"?karten.slice().sort((a,b)=>a.querySelector("h3").textContent.localeCompare(b.querySelector("h3").textContent,"de")):orig; sortiert.forEach(c=>ag.appendChild(c));
    q("#fZahl").textContent=n+" Poster"; };
  document.querySelectorAll(".filter input").forEach(i=>i.addEventListener("change",anwenden)); }
/* Chips (nur Optik) */
  document.querySelectorAll(".chips button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".chips button").forEach(x=>x.setAttribute("aria-pressed","false")); b.setAttribute("aria-pressed","true");}));
}

initSeite();