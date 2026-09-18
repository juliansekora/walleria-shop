
const eur=n=>n.toFixed(2).replace(".",",")+" €"; const q=s=>document.querySelector(s); const esc=s=>String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
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
/* Live-Vorschau der Definitions-Poster (Mamaherz, Papaherz, Wunschkind + 49 Woerter).
   1:1-Nachbau von definition_designs_neu.py (Etsy-Poster-Pipeline): Blatt 2100x2877,
   gleiche Schriften (Playfair Display, Instrument Serif, Caveat), gleiche Positionen,
   gleiche Umbruch- und Einpass-Logik. Was hier steht, druckt die Produktion genauso. */
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
  /* 1 Schlicht - a0_definition_schlicht */
  "1":function(p){ const B=DEF.B; let s=defPapier(DEF.PAPIER);
    s+=defText(B/2,720,p.wort,DEF_FONT.play,DEF.WORT_PX,"#1E1B16");
    const u=defUnter(p,1080,DEF_FONT.instr,78,60,"#6B655B"); s+=u.svg;
    s+=defLinie(1230+u.dy,620,"#C9C2B4",4); s+=defBlock(1350+u.dy,p.text,"#4A453C").svg; return s; },
  /* 2 Klassisch - a1_definition_klassisch_serie */
  "2":function(p){ const B=DEF.B; let s=defPapier(DEF.PAPIER);
    s+=defText(B/2,700,p.wort,DEF_FONT.play,DEF.WORT_PX,DEF.TINTE);
    const u=defUnter(p,1090,DEF_FONT.instr,86,64,DEF.TERRA); s+=u.svg;
    s+=defLinie(1240+u.dy,700,DEF.SALBEI); s+=defBlock(1360+u.dy,p.text).svg; return s; },
  /* 3 Herz - a7_definition_herz */
  "3":function(p){ const B=DEF.B; let s=defPapier(DEF.PAPIER);
    s+=`<polygon points="${defHerz(B/2,600,110)}" fill="${defHell(DEF.ROSE,0.15)}"/>`;
    s+=defText(B/2,890,p.wort,DEF_FONT.play,DEF.WORT_PX,DEF.TINTE);
    const u=defUnter(p,1230,DEF_FONT.cav,110,80,DEF.TERRA); s+=u.svg;
    s+=defLinie(1390+u.dy,620,defHell(DEF.ROSE,0.35)); s+=defBlock(1500+u.dy,p.text).svg; return s; },
  /* 4 Zweig - a8_definition_zweig */
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
  /* 5 Nachtgruen - a9_definition_nacht */
  "5":function(p){ const B=DEF.B, CREME="#F4EEDF", GOLD="#C9A96A"; let s=defPapier("#22392C");
    s+=defText(B/2,560,defGesperrt("Definition"),DEF_FONT.instr,58,GOLD);
    s+=defText(B/2,700,p.wort,DEF_FONT.play,DEF.WORT_PX,CREME);
    const u=defUnter(p,1060,DEF_FONT.instr,80,90,GOLD); s+=u.svg;
    s+=defLinie(1210+u.dy,560,GOLD,4); s+=defBlock(1330+u.dy,p.text,"#D9D2C0").svg; return s; },
  /* 6 Puderrose - a12_definition_puderrose */
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
const HR={B:2100,H:2877,STD:["Wir sagen die Wahrheit","Wir lachen laut","Wir helfen einander","Fehler sind erlaubt","Wir hören einander zu","Umarmungen sind gratis","Wir lieben uns"]};
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
   werden im Browser nach derselben Mathematik gesetzt wie aquarell_ultraschall.p_texte:
   Name ab y=1899 (Unterkante Herz 1819 + 80), Groesse 280 px, schrumpft bis der Name in
   1720 px passt (min 120); Spruch 150 px unter der gemessenen Namens-Unterkante, 56 px;
   Termin bei y=2600, 48 px. Farben #22201C / #4A443C / #8A8378. */
const US={B:2100,H:2877,MAXB:1720,SPRUCH:"Hallo kleines Wunder",FONT:{sig:"'Sacramento',cursive",instr:"'Instrument Serif',serif"}};
function usPassend(fam,text,start,maxb,min){ let px=start; while(px>min && defBreite(text,fam,px)>maxb) px-=2; return Math.max(min,px); }
function usTermin(t){ t=String(t||"").trim().replace(/^[ ·\-–]+|[ ·\-–]+$/g,""); if(!t) return ""; const tl=t.toLowerCase();
  if(/^(erwartet|wir |kommt|ab |im |am |seit|ssw)/.test(tl)) return t[0].toUpperCase()+t.slice(1);
  if(/^\d{1,2}\.\s*\S/.test(t)) return "Erwartet am "+t; return "Erwartet im "+t; }
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
    /* Anker ist immer die ganze Galerie, damit die Vorschaubilder wie bei allen Artikeln direkt unter dem Hauptbild bleiben (Julian, 05.09.2026) */
    const anker=gal||live;
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
        const teile=[p.groesse,p.name?("Name: "+p.name):"",p.farbe].filter(Boolean).join(" · ");
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
    /* Was Kundinnen waehlen - Groesse, Design, Farbe (06.09.2026) */
    else if(a.closest("#groessen")) was="groesse:"+((a.firstChild&&a.firstChild.textContent)||a.textContent||"").trim().replace(/\s+/g,"").slice(0,20);
    else if(a.closest(".designs")) was="design:"+(a.dataset.design||a.dataset.i||(a.textContent||"").trim()).toString().slice(0,30);
    else if(a.dataset.farbe) was="farbe:"+a.dataset.farbe.slice(0,20);
    if(was) senden({art:"klick",ziel:was});
  },{passive:true});
  /* Ausfuehrung (digital/gedruckt) und Suche - nur DASS gesucht wurde, nicht wonach */
  document.addEventListener("change",e=>{ const r=e.target; if(r&&r.name==="art"&&r.value) senden({art:"klick",ziel:"ausfuehrung:"+r.value}); },{passive:true});
  const sf=q("#suchFeld"); if(sf){ let gez=false; sf.addEventListener("input",()=>{ if(!gez&&sf.value.trim().length>=2){ gez=true; senden({art:"klick",ziel:"suche:genutzt"}); } }); }
  /* Kauf: einmal je Bestellnummer, mit Betrag in Cent - fuer den Trichter auf der Statistik-Seite */
  try{
    const pr=new URLSearchParams(location.search); const nr=pr.get("bestellung");
    if(location.pathname.indexOf("danke")>-1 && nr){
      const k="walleria_kauf_"+nr;
      if(!sessionStorage.getItem(k)){ sessionStorage.setItem(k,"1"); senden({art:"klick",ziel:"kauf:"+(parseInt(pr.get("betrag")||"0",10)||0)}); }
    }
  }catch(e){}
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
    pdp.querySelectorAll(".thumbs button").forEach(b=>b.addEventListener("click",()=>{pdp.querySelectorAll(".thumbs button").forEach(x=>x.setAttribute("aria-pressed","false")); b.setAttribute("aria-pressed","true"); const im=q("#galMain img"); const k=b.dataset.k; im.removeAttribute("src"); im.dataset.k=k; bilderSetzen(); if(!window.IMGMAP) im.src="img/"+k+".jpg"; const lm=q("#liveMain"); if(lm){lm.hidden=true; q("#galMain").hidden=false;}}));
    /* Gewaehltes Design / gewaehlte Farbe auch als Foto zeigen: die Karte
       data-design-bilder / data-farb-bilder sagt, welche Szene es dafuer gibt. */
    /* Handy: Wischen im Hauptbild blaettert durch die Galerie (Julian 08.09.2026) */
    (()=>{ const g=q("#galMain"); if(!g) return; let x0=null,y0=null,t0=0;
      const reihe=()=>[...pdp.querySelectorAll(".thumbs button")].map(b=>b.dataset.k);
      g.addEventListener("touchstart",e=>{ const t=e.changedTouches[0]; x0=t.clientX; y0=t.clientY; t0=Date.now(); },{passive:true});
      g.addEventListener("touchend",e=>{ if(x0==null) return; const t=e.changedTouches[0]; const dx=t.clientX-x0, dy=t.clientY-y0; x0=null;
        if(Math.abs(dx)<40||Math.abs(dx)<Math.abs(dy)*1.5||Date.now()-t0>800) return;
        const ks=reihe(); if(ks.length<2) return; const im=q("#galMain img"); const i=Math.max(0,ks.indexOf(im&&im.dataset.k)); const j=(i+(dx<0?1:-1)+ks.length)%ks.length; bildZeigen(ks[j]); },{passive:true}); })();
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

    /* Definitions-Poster: eigene Live-Vorschau (SVG wie der Druck) statt Namensposter-Renderer */
    const defEl=q("#defPoster"); let defInfo=null; try{ defInfo=pdp.dataset.def?JSON.parse(pdp.dataset.def):null; }catch(e){}
    const defVorschau=()=>{ if(!defEl||!defInfo||!lm||typeof defSVG!=="function") return;
      const name=(kn&&kn.value.trim())||"";
      if(!name){ lm.hidden=true; q("#galMain").hidden=false; return; }
      const eig=(q("#pf1")&&q("#pf1").value.trim())||"", dat=(q("#pfDatum")&&q("#pfDatum").value.trim())||"";
      lm.hidden=false; q("#galMain").hidden=true;
      const dk=pdp.querySelector("#designs button[aria-pressed=\"true\"]"); defEl.innerHTML=defSVG((dk&&dk.dataset.nr)||"1",defInfo.wort,name,eig||defInfo.text,dat); };
    if(defInfo){ ["#pf1","#pfDatum"].forEach(sel=>{ const e=q(sel); if(e) e.addEventListener("input",defVorschau); });
      if(document.fonts&&document.fonts.load){ Promise.all([document.fonts.load('40px "Instrument Serif"'),document.fonts.load('40px "Playfair Display"'),document.fonts.load('40px "Caveat"')]).then(()=>{ if(lm&&!lm.hidden) defVorschau(); }).catch(()=>{}); } }
    /* Hausregeln: Hintergrund ohne Text + Familienname/Regeln live (live_hausregeln.js) */
    const hrDesign=pdp.dataset.hr||"";
    const hrVorschau=()=>{ if(!hrDesign||!defEl||!lm||typeof hrSVG!=="function") return;
      const name=(kn&&kn.value.trim())||"";
      if(!name){ lm.hidden=true; q("#galMain").hidden=false; return; }
      lm.hidden=false; q("#galMain").hidden=true;
      defEl.innerHTML=hrSVG(hrDesign,name,(q("#pf1")&&q("#pf1").value)||""); };
    if(hrDesign){ const e=q("#pf1"); if(e){
        /* Wie in der Produktion: hoechstens 7 Regeln, je hoechstens 42 Zeichen - sonst schrumpft die Schrift ins Unlesbare */
        const begrenzen=()=>{ const roh=e.value; const teile=roh.split("\n").slice(0,7).map(z=>z.slice(0,42)); const neu=teile.join("\n");
          if(neu!==roh){ const pos=Math.min(e.selectionStart||neu.length, neu.length); e.value=neu; try{ e.setSelectionRange(pos,pos); }catch(x){} toast("Höchstens 42 Zeichen je Regel und 7 Regeln"); } };
        e.addEventListener("input",()=>{ begrenzen(); hrVorschau(); }); e.addEventListener("paste",()=>setTimeout(()=>{ begrenzen(); hrVorschau(); },0)); }
      if(document.fonts&&document.fonts.load){ Promise.all([document.fonts.load('40px "Instrument Serif"'),document.fonts.load('40px "Playfair Display"')]).then(()=>{ if(lm&&!lm.hidden) hrVorschau(); }).catch(()=>{}); } }
    /* Ultraschall-Herz: Beispielblatt ohne Text + Name/Spruch/Termin live (live_ultraschall.js) */
    const usDesign=pdp.dataset.us||"";
    const usVorschau=()=>{ if(!usDesign||!defEl||!lm||typeof usSVG!=="function") return;
      const name=(kn&&kn.value.trim())||"";
      if(!name){ lm.hidden=true; q("#galMain").hidden=false; return; }
      lm.hidden=false; q("#galMain").hidden=true;
      defEl.innerHTML=usSVG(name,(usSpruchEl&&usSpruchEl.value)||"",(usDatumEl&&usDatumEl.value)||""); };
    /* Felder nach Fragetext suchen - die Nummern (pf2/pf3/pf4) haengen von der Feldreihenfolge ab */
    const usPersFeld=(re)=>[...pdp.querySelectorAll("[data-pers-feld]")].find(e=>re.test(e.dataset.persFeld||""))||null;
    const usSpruchEl=usDesign?usPersFeld(/spruch/i):null, usDatumEl=usDesign?usPersFeld(/datum|termin/i):null;
    if(usDesign){ [usSpruchEl,usDatumEl].forEach(e=>{ if(e) e.addEventListener("input",usVorschau); });
      if(document.fonts&&document.fonts.load){ Promise.all([document.fonts.load('40px "Sacramento"'),document.fonts.load('40px "Instrument Serif"')]).then(()=>{ if(lm&&!lm.hidden) usVorschau(); }).catch(()=>{}); } }
    const vorschau=()=>{ if(defInfo){ defVorschau(); return; } if(hrDesign){ hrVorschau(); return; } if(usDesign){ usVorschau(); return; } if(!lm) return;
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
      design=(dsgKnoepfe.find(b=>b.getAttribute("aria-pressed")==="true")||dsgKnoepfe[0]).dataset.design;
      dsgKnoepfe.forEach(b=>b.addEventListener("click",()=>{
        dsgKnoepfe.forEach(x=>x.setAttribute("aria-pressed","false"));
        b.setAttribute("aria-pressed","true"); design=b.dataset.design; if(defInfo&&kn&&kn.value.trim()) defVorschau(); else bildZeigen(designBilder[b.dataset.nr]); }));
    }
    /* Zeichen-Zaehler unter Feldern mit Grenze (wie die Produktion sie hat) */
    pdp.querySelectorAll(".zaehler[data-fuer]").forEach(z=>{ const e=q("#"+z.dataset.fuer); if(!e) return; const max=parseInt(z.dataset.max,10)||0;
      const upd=()=>{ const n=e.value.length; z.textContent=max?(n+"/"+max+" Zeichen"):""; z.classList.toggle("voll", max&&n>=max); }; e.addEventListener("input",upd); upd(); });
    /* Geburtsblumen: 2 bis 8 Personen, je Name bis 16 Zeichen - genau die Grenzen des Strauss-Renderers */
    const gbl=pdp.querySelector('[data-pers-feld="Namen mit Geburtsmonat"]');
    if(gbl){ const z=pdp.querySelector('.zaehler[data-fuer="'+gbl.id+'"]');
      const pruef=()=>{ const teile=gbl.value.split(/[,;\n]+| und /).map(t=>t.trim()).filter(Boolean); const zuLang=teile.filter(t=>t.replace(/\s+\S+$/,"").length>16);
        let txt=teile.length+" von 2 bis 8 Personen"; if(teile.length>8) txt="Zu viele: höchstens 8 Personen"; else if(zuLang.length) txt="Name zu lang (bis 16 Zeichen): "+zuLang[0];
        if(z){ z.textContent=txt; z.classList.toggle("voll", teile.length>8||zuLang.length>0); } };
      gbl.addEventListener("input",pruef); pruef(); }
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
    /* Auch rein digital die komplette Adresse abfragen (Rechnung) - Julians Wunsch, 06.09.2026 */
    ["kStr","kPlz","kOrt"].forEach(id=>{ const e=q("#"+id); if(!e) return; const w=e.closest(".field")||e; w.hidden=false; e.required=true; });
    const hAdr=q("#kAdresseTitel"); if(hAdr) hAdr.textContent=nurDigital?"Rechnungsadresse":"Lieferadresse";
    const hLand=q("#kLandHinweis"); if(hLand) hLand.hidden=nurDigital;
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
  /* PLZ: nur Ziffern, hoechstens fuenf */
  const plz=q("#kPlz"); if(plz) plz.addEventListener("input",()=>{ const v=plz.value.replace(/\D/g,"").slice(0,5); if(v!==plz.value) plz.value=v; });
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
  /* Nur auf der echten Domain messen - lokale Tests und Vorschauen erzeugen sonst Phantom-Kaeufe (07.09.2026) */
  if(!/(^|\.)walleria\.de$/.test(location.hostname)) return;
  if(consentAllows("statistik")){ ladeGA4(); ladeClarity(); }
  if(!consentAllows("marketing")) return;
  ladeChatGptPixel();
  ladeMetaPixel();
  ladeGoogleAds();
}

/* Gemeinsamer gtag-Lader fuer Google Analytics 4 und Google Ads: Skript nur einmal, Einwilligung je Zweck */
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
/* Google Analytics 4 - nur nach Einwilligung "Statistik" (06.09.2026). IP wird von GA4 nie gespeichert;
   Google-Signale bleiben aus, Aufbewahrung 2 Monate (in der Property eingestellt). */
function ladeGA4(){
  const id=window.GA4_ID;
  if(!id || window.__waGa4) return; window.__waGa4=true;
  gtagBereit();
  gtag("consent","update",{analytics_storage:"granted"});
  /* Google-Signale/Werbepersonalisierung nur, wenn auch Marketing erlaubt ist */
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
   Warenkorb und Kassenstart als Signale; E-Mail nur gehasht ueber Googles "erweiterte Conversions". */
/* Microsoft Clarity - Heatmaps und Sitzungsaufzeichnungen, nur nach Einwilligung "Statistik" (12.09.2026).
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
/* Google Kundenrezensionen: nach dem Kauf fragt ein Google-Fenster, ob der Kunde spaeter eine
   Bewertungsumfrage bekommen moechte. Uebertragen werden Bestellnummer, E-Mail, Lieferland und
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