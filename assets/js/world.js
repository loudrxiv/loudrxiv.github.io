(()=>{
'use strict';
const $=s=>document.querySelector(s),main=$('.main');if(!main)return;

// ---- palette (one dark palette, SNES 15-bit values). Chars index KEY; '.' is transparent ----
const PAL={'0':'100818',a:'102121',b:'183929',c:'214A31',d:'316339',e:'52845A','1':'212131','2':'393952','3':'5A5A73','4':'7B7B94','5':'A5A5BD',w:'291821',x:'4A2931',y:'734239',z:'9C6352',r:'391029',s:'631831',t:'942939',u:'AD4A63',p:'4A4263',q:'6B6B8C',v:'9494AD',B:'081029',C:'102152',D:'18397B',E:'295AA5',F:'8CC6E7',G:'8CC6E7',g:'E78C31',h:'FFD663',L:'E78C31',f:'D65A8C',i:'E7C642',j:'C6CEE7',k:'081821',l:'103929',m:'185A39',n:'398452',o:'6BAD73',H:'392118',K:'C68C7B',U:'C63131',V:'293152','6':'18397B','7':'295AA5','8':'18397B','9':'102152'};
const KEY='.'+Object.keys(PAL).join(''), ix=c=>KEY.indexOf(c);
const rgba=h=>(255<<24)|(parseInt(h.slice(4,6),16)<<16)|(parseInt(h.slice(2,4),16)<<8)|parseInt(h.slice(0,2),16);
const lut=new Uint32Array(KEY.length); for(let i=1;i<KEY.length;i++)lut[i]=rgba(PAL[KEY[i]]);
const CYC=['D','E','D','C'].map(c=>rgba(PAL[c]));

// ---- helpers ----
const mk=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
let rnd=mk(11); const drnd=mk(Date.now());
const grid=(w,h,ch='.')=>Array.from({length:h},()=>Array(w).fill(ch));
const put=(g,x,y,ch)=>{if(y>=0&&y<g.length&&x>=0&&x<g[0].length)g[y][x]=ch};
const hl=(g,x0,x1,y,ch)=>{for(let x=x0;x<=x1;x++)put(g,x,y,ch)};
const rect=(g,x0,y0,x1,y1,ch)=>{for(let y=y0;y<=y1;y++)hl(g,x0,x1,y,ch)};
const stamp=(g,rows,ox,oy)=>rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch!=='.')put(g,ox+x,oy+y,ch)}));
const dec=rows=>({w:rows[0].length,h:rows.length,d:Uint8Array.from(rows.join(''),c=>c==='.'?0:ix(c))});
const BAYER=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]], DARK={c:'b',d:'c',b:'a',e:'d',a:'a'};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

// ---- sprites (string grids; verified in the planning scratch render) ----
function houseRows(){const g=grid(40,44);
 hl(g,27,34,0,'4');put(g,27,0,'5');hl(g,27,34,1,'2');
 for(let y=2;y<=7;y++){hl(g,28,33,y,'3');put(g,28,y,'4');put(g,33,y,'2')}hl(g,29,32,4,'2');put(g,30,4,'3');
 const left=y=>y<=10?3:y<=14?2:y<=19?1:0;
 for(let y=7;y<=23;y++){const x0=left(y),x1=39-x0;hl(g,x0,x1,y,'t');put(g,x0,y,'u');put(g,x1,y,'r')}
 hl(g,3,36,7,'u');put(g,36,7,'s');hl(g,4,35,8,'s');
 [12,16,20].forEach((sy,c)=>{const x0=left(sy)+1,x1=38-left(sy);hl(g,x0,x1,sy,'s');
  for(let x=x0;x<=x1;x++){const k=(x+c*3)%6;if(k===0){put(g,x,sy-1,'s');put(g,x,sy-2,'s')}if((k===1||k===2)&&g[sy-3][x]==='t')put(g,x,sy-3,'u')}});
 for(let x=1;x<=38;x++)if(x%6===0)put(g,x,23,'s');
 hl(g,0,39,24,'r');hl(g,1,38,25,'0');
 rect(g,3,26,36,40,'q');hl(g,3,36,26,'p');hl(g,3,36,27,'p');
 for(let y=26;y<=40;y++){put(g,3,y,'y');put(g,4,y,'x');put(g,35,y,'x');put(g,36,y,'w')}
 [[8,37],[9,37],[29,31],[30,31],[14,39],[26,38],[27,38]].forEach(([x,y])=>put(g,x,y,'v'));
 const win=['wwwwwww','whgxhgw','wggxggw','wxxxxxw','whgxhgw','wggxggw','wwwwwww'],box=['fdidfdidf','zyyyyyyyx','xxxxxxxxw'];
 [[7,28],[26,28]].forEach(([x,y])=>{stamp(g,win,x,y);stamp(g,box,x-1,y+7)});
 hl(g,16,23,28,'x');hl(g,16,23,27,'y');stamp(g,['qwwwwq'],17,29);for(let y=30;y<=40;y++)stamp(g,['wzyyxw'],17,y);put(g,21,35,'i');
 stamp(g,['.w.','wLw','wLw','.w.'],24,30);
 hl(g,2,37,41,'4');hl(g,2,37,42,'2');for(let x=2;x<=37;x++){if(x%5===0)put(g,x,41,'3');if(x%5===2)put(g,x,42,'1')}
 hl(g,15,24,41,'5');hl(g,15,24,42,'3');hl(g,15,24,43,'2');put(g,24,42,'2');
 return g.map(r=>r.join(''))}
const STEPS=['3254432544325421','3243321433214321','3222212222122221','2154325443254421','2143214332143321','2122221222212221','3254432544325431','2143321433214321','2122212222122221','2154432544325421','2143321433214321','2122212222122221','.11111111111111.'];
const WALL=['deddedeedd','5454454454','4333433334','2221222212','4334333433','3222322232','1121112111','3343343334','2232223222','1211121112','4333433343','2112121121'];
const TRUNK=['...wxyzyxw....','...wxyzyxw....','...wxyzxxw....','...wxzyxxw....','...wxzyxww....','...wxzyxxw....','...wxyzyxw....','...wxyzyxw....','...wxyzyxw....','..wxyzyyxxw...','.wxyz.wyzxxw..','wxyy...wyxxww.','www.....wwww..'];
function treeRows(){const W=44,H=56,g=grid(W,H);stamp(g,TRUNK,16,42);
 const C=[[22,13,11],[11,20,9],[33,19,9],[16,28,10],[29,29,10],[22,22,11]],bump=(a,i)=>Math.round(1.1*Math.sin(a*7+i*1.7));
 C.forEach(([cx,cy,r],i)=>{for(let y=0;y<44;y++)for(let x=0;x<W;x++){const dx=x+.5-cx,dy=y+.5-cy,d=Math.hypot(dx,dy),re=r+bump(Math.atan2(dy,dx),i);if(d>re)continue;
  const lit=dx/re*-.6+dy/re*-.8;let ch=lit>.55?'o':lit>.15?'n':lit>-.35?'m':'l';if(d>re-1&&lit<.15)ch='k';g[y][x]=ch}});
 for(let y=0;y<44;y++)for(let x=0;x<W;x++)if(g[y][x]==='o'&&((x>>1)+(y>>1))%3===0)g[y][x]='n';
 return g.map(r=>r.join(''))}
function shear(rows,a,ch=44){return rows.map((r,y)=>{if(y>=ch)return r;const dx=Math.round(a*(1-y/ch));if(!dx)return r;const o=[...r].map(()=>'.');[...r].forEach((c,x)=>{if(c!=='.'&&x+dx>=0&&x+dx<r.length)o[x+dx]=c});return o.join('')})}
function waterRows(){const W=32,H=12,g=grid(W,H,'C');hl(g,0,W-1,0,'b');hl(g,0,W-1,1,'B');hl(g,0,W-1,H-1,'c');hl(g,0,W-1,H-2,'D');
 [[2,3,4],[11,3,3],[20,3,5],[6,5,3],[15,6,4],[26,5,3],[1,8,3],[10,8,5],[22,8,4]].forEach(([x,y,n])=>{for(let k=0;k<n;k++)put(g,(x+k)%W,y,String(6+((x+k)>>3)%4))});
 put(g,13,2,'F');put(g,28,7,'G');return g.map(r=>r.join(''))}
function bushRows(){const w=13,h=9,g=grid(w,h);[[6.5,5,5],[3.5,6,3.5],[9.5,6,3.5]].forEach(([cx,cy,r])=>{for(let y=0;y<h;y++)for(let x=0;x<w;x++){const dx=x+.5-cx,dy=y+.5-cy,d=Math.hypot(dx,dy);if(d>r)continue;const lit=dx/r*-.6+dy/r*-.8;let ch=lit>.45?'n':lit>-.1?'m':'l';if(d>r-1&&lit<.15)ch='k';g[y][x]=ch}});put(g,4,3,'o');put(g,5,3,'o');put(g,3,5,'n');return g.map(r=>r.join(''))}
// second, smaller round tree (sways with the wind like the big one)
function tree2Rows(){const W=28,g=grid(W,33),ch=26,bump=(a,i)=>Math.round(1.1*Math.sin(a*7+i*1.7));
 stamp(g,['...wxyxw...','...wxzxw...','...wxzxw...','..wxyzyxw..','.wxyz.wyxw.','wxyy...wyxw','www.....www'],8,26);
 [[14,9,8],[7,15,6],[21,15,6],[14,17,8]].forEach(([cx,cy,r],i)=>{for(let y=0;y<ch;y++)for(let x=0;x<W;x++){const dx=x+.5-cx,dy=y+.5-cy,d=Math.hypot(dx,dy),re=r+bump(Math.atan2(dy,dx),i);if(d>re)continue;const lit=dx/re*-.6+dy/re*-.8;let c=lit>.55?'o':lit>.15?'n':lit>-.35?'m':'l';if(d>re-1&&lit<.15)c='k';g[y][x]=c}});
 for(let y=0;y<ch;y++)for(let x=0;x<W;x++)if(g[y][x]==='o'&&((x>>1)+(y>>1))%3===0)g[y][x]='n';
 return g.map(r=>r.join(''))}
// pine: four stacked tiers, lit from the left
function pineRows(){const g=grid(21,34),cx=10;
 [[0,4,8],[6,6,9],[13,8,10],[20,10,10]].forEach(([top,hw,ht])=>{for(let r=0;r<ht;r++){const half=Math.max(1,Math.round(hw*(r+1)/ht)),y=top+r;
  for(let x=cx-half;x<=cx+half;x++){const u=(x-(cx-half))/(2*half);let c=u<.25?'n':u<.6?'m':'l';if(r===ht-1||x===cx+half)c='k';put(g,x,y,c)}
  if(r%3===1)put(g,cx-half+1,y,'o')}});
 stamp(g,['wxw','wxw','www'],cx-1,30);return g.map(r=>r.join(''))}
function pondRows(w,h){const g=grid(w,h),cx=(w-1)/2,cy=(h-1)/2;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const dx=(x-cx)/(w/2),dy=(y-cy)/(h/2),d=dx*dx+dy*dy;if(d>1.15)continue;g[y][x]=d>.92?((x+y)%3?'3':'4'):d>.78?'B':'C'}
 for(let i=0;i<w*h/30;i++){const x=2+(rnd()*(w-8)|0),y=1+(rnd()*(h-2)|0),n=2+(rnd()*3|0);for(let k=0;k<n;k++)if(g[y][x+k]==='C')g[y][x+k]=String(6+((x+k)>>2)%4)}
 for(let i=0;i<3;i++){const x=4+(rnd()*(w-12)|0),y=2+(rnd()*(h-5)|0);if(g[y][x]!=='.'&&g[y][x]!=='3'&&g[y][x]!=='4'){stamp(g,['nmn','.m.'],x,y);if(i===0)put(g,x+1,y,'f')}}
 put(g,3,Math.floor(h/3),'F');put(g,w-5,Math.floor(h/2),'G');return g.map(r=>r.join(''))}
function gardenRows(w,h){const g=grid(w,h,'x');hl(g,0,w-1,0,'y');hl(g,0,w-1,h-1,'w');for(let y=0;y<h;y++){put(g,0,y,'y');put(g,w-1,y,'w')}
 for(let y=3;y<h-2;y+=3)for(let x=3;x<w-2;x+=4){put(g,x,y,'m');put(g,x-1,y,'n');put(g,x+1,y,'n');put(g,x,y-1,rnd()<.45?'fij'[rnd()*3|0]:'n')}
 return g.map(r=>r.join(''))}
const BENCH=['.zzzzzzzzzzzzzz.','.yyyyyyyyyyyyyy.','.xxxxxxxxxxxxxx.','.w............w.','zzzzzzzzzzzzzzzz','yyyyyyyyyyyyyyyy','xxxxxxxxxxxxxxxx','.wx..........xw.','.ww..........ww.'];
const MAIL=['.UUU.','UUUUU','UUUUU','..w..','..w..','..w..','..w..','.www.'];
const LAMP=['.www.','.wLw.','.wLw.','.www.','..x..','..x..','..x..','..x..','..x..','..x..','..x..','..x..','.xwx.','.www.'];
const ROCK1=['..44..','.4333.','433322','.2222.'],ROCK2=['.43.','4332','.22.'],SHROOM=['.UU.','UjUU','.zz.','.zz.'],STUMP=['..zzz..','.zyyyz.','zyzzzyx','.zyyyx.','.wxxxw.','.wxxxw.'];
const HOUSE=houseRows(),TREE=treeRows(),WATER=waterRows(),BUSH=bushRows(),PINE=pineRows(),TREE2=tree2Rows();
const TREEF=[shear(TREE,-1),TREE,shear(TREE,1)].map(dec),TREE2F=[shear(TREE2,-1,26),TREE2,shear(TREE2,1,26)].map(dec);
const TUFT=[['e...e','.d.d.','.dcd.','..b..'],['.e.e.','.d.d.','.dcd.','..b..'],['e.e..','.d.d.','.dcd.','..b..']].map(dec);
const HERO=[['....HHHH....','...HHHHHH...','..HHHHHHHH..','..HKKKKKKH..','..HK0KK0KH..','...KKKKKK...','....KKKK....','...UUUUUU...','..UUUUUUUU..','.KUUUUUUUUK.','.KUUUUUUUUK.','..UUUUUUUU..','...VVVVVV...','...VV..VV...','...VV..VV...','...00..00...'],
 ['....HHHH....','...HHHHHH...','..HHHHHHHH..','..HKKKKKKH..','..HK0KK0KH..','...KKKKKK...','....KKKK....','...UUUUUU...','..UUUUUUUU..','.KUUUUUUUUK.','.KUUUUUUUUK.','..UUUUUUUU..','...VVVVVV...','....VVVV....','....VVVV....','....0000....']].map(dec);
const FENCE=['.v..','vqp.','vqp.','vqqq','vqp.','vqp.','vqqq','vqp.','bpb.'],LEAF=[['nm','m.'],['.n','mm'],['n.','.m']].map(dec);

// ---- state ----
const ui={fps:10,seed:11};
let L,W,H,k,dpr,ppa,st,fb,tufts,img,u32,art,actx;
const cv=Object.assign(document.createElement('canvas'),{className:'w-canvas w-bd'}),ctx=cv.getContext('2d');
cv.setAttribute('aria-hidden','true');document.body.prepend(cv);
let t0=performance.now()/1000,n=0,raf=0,last=0,gustAt=0,gustPeak=0,nextGust=5;
let props,dynTrees=[],bflies=[],leaves=[],puffs=[],flies=[],treeF=1,lant=0,nextLant=0,hero={x:0,dir:1,walk:false,f:0},A={S:[]};

// ---- layout + static layer ----
function layout(){
 const vw=document.documentElement.clientWidth,vh=innerHeight;dpr=devicePixelRatio||1;
 const col=main.getBoundingClientRect();
 const s=vw<1280?2:vw<1700?3:4;k=Math.max(1,Math.round(s*dpr));ppa=k/dpr;
 const wide=vw>=1024&&col.left/ppa>=56; // margins beside the column: house left, tree right; else both stacked in the viewport
 W=Math.ceil(vw/ppa);H=Math.max(160,Math.ceil(vh/ppa));
 const wy=Math.round(.6*H),L0={mode:wide?'wide':'narrow',W,H,wy,hy:wy-50,ty:wy+6-55,yS:H-22,zones:[]};
 if(wide){const a=Math.floor(col.left/ppa),b=Math.ceil(col.right/ppa)-1;
  L0.zones=[{x0:0,x1:b,house:1,hx:Math.round((a-40)/2)},{x0:b+1,x1:W-1,tree:1,tx:b+1+Math.round((W-b-1-44)/2)}];
 }else L0.zones=[{x0:0,x1:W-85,house:1,hx:8},{x0:W-84,x1:W-1,tree:1,tx:W-84+30}];
 L=L0;document.documentElement.style.setProperty('--w-u',ppa+'px');
 cv.width=W*k;cv.height=H*k;cv.style.width=W*ppa+'px';cv.style.height=H*ppa+'px';
 art=art||document.createElement('canvas');art.width=W;art.height=H;actx=art.getContext('2d');img=actx.createImageData(W,H);u32=new Uint32Array(img.data.buffer);
 build();hero.x=Math.min(hero.x||30,L.zones[0].x1-20);leaves=[];puffs=[];
}
function build(){
 rnd=mk(ui.seed);const {zones,wy,yS}=L,g=grid(W,H,'c');tufts=[];props=[];dynTrees=[];bflies=[];
 const occ=new Uint8Array(W*H),topY=L.topY=Math.round(.2*H);
 const claim=(x,y,w,h)=>{for(let j=Math.max(0,y);j<Math.min(H,y+h);j++)for(let i=Math.max(0,x);i<Math.min(W,x+w);i++)occ[j*W+i]=1};
 const free=(x,y,w,h)=>{if(x<0||y<0||x+w>W||y+h>H)return false;for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(occ[j*W+i])return false;return true};
 const shadow=(cx,cy,rx,ry)=>{for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const ex=(x-cx)/rx,ey=(y-cy)/ry;if(ex*ex+ey*ey<1&&g[y]&&g[y][x])g[y][x]=DARK[g[y][x]]||g[y][x]}};
 for(let i=0;i<W*H/70;i++){const x=rnd()*W|0,y=rnd()*H|0;rect(g,x,y,x+1+(rnd()*2|0),y+(rnd()<.3?1:0),rnd()<.55?'b':'d')}
 const top=.35*H;for(let y=0;y<top;y++){const lv=2*(1-y/top);let n0=Math.floor(lv);for(let x=0;x<W;x++){let m=n0;if(BAYER[y&3][x&3]/16<lv-n0)m++;for(;m>0;m--)g[y][x]=DARK[g[y][x]]||g[y][x]}}
 // forest edge along the top of the margins: a dark back row, then a lit front row
 const clump=(cx,cy,r,front)=>{for(let y=cy-r;y<=cy+r;y++)for(let x=cx-r;x<=cx+r;x++){const dx=x+.5-cx,dy=y+.5-cy,d=Math.hypot(dx,dy);if(d>r)continue;const lit=dx/r*-.6+dy/r*-.8;let c=front?(lit>.5?'n':lit>0?'m':'l'):(lit>.3?'l':'k');if(front&&d>r-1&&lit<.2)c='k';put(g,x,y,c)}};
 for(const z of zones)for(const front of[0,1])for(let x=z.x0-4;x<z.x1+8;x+=7+(rnd()*5|0))clump(x,Math.round(.07*H)+(rnd()*.05*H|0)+(front?0:-3),5+(rnd()*4|0)+(front?0:3),front);claim(0,0,W,topY);
 for(const z of zones){const hy=L.hy,hx=z.hx,tx=z.tx,ty=L.ty;
  for(let y=0;y<wy;y++)for(let x=z.x0;x<=z.x1;x++)if(g[y][x]==='c'&&rnd()<.02)g[y][x]='d';
  if(z.house){
   for(let x=z.x0;x<=z.x1;x++)WALL.forEach((r,j)=>put(g,x,wy+j,r[(x+(j>6?5:0))%10]));
   for(let x=z.x0;x<=z.x1;x++){if(rnd()<.35)put(g,x,wy-1,'e');if(rnd()<.4)put(g,x,wy+12,'b')}
   for(let y=hy+41;y<=hy+46;y++)for(let x=hx+1;x<=hx+38;x++)g[y][x]=DARK[g[y][x]]||g[y][x];
   stamp(g,HOUSE,hx,hy);stamp(g,BUSH,hx-8,hy+35);stamp(g,BUSH,hx+35,hy+35);
   for(let y=hy+44;y<wy;y++)stamp(g,[y%2?'1435414531':'1543145431'],hx+15,y);
   stamp(g,STEPS,hx+12,wy);
   for(let i=0;i<14;i++){const x=hx+2+(rnd()*36|0);if(x>hx+11&&x<hx+29)continue;put(g,x,hy+44,'d');put(g,x,hy+43+(rnd()<.5?1:0),'fij'[rnd()*3|0])}
   let px=hx+19,pmin=px,pmax=px;const S=[[px,wy-2],[px,wy+12]];for(let y=wy+13;y<yS;y+=2){px+=Math.round(Math.sin(y/9)*1.2);pmin=Math.min(pmin,px);pmax=Math.max(pmax,px);S.push([px,y]);stamp(g,['1544541','1233321'],px-3+(y%4?1:0),y)}z.px=px;A={S};
   for(const p of S)if(p[1]>wy+12&&p[1]<wy+30)p[0]=clamp(p[0],px-3,px+2); // from the steps' foot through the gate, clear of the lamp and the mailbox
   for(let x=z.x0;x<=z.x1-3;x+=4)if(Math.abs(x-px)>7)stamp(g,FENCE,x,wy+20);
   stamp(g,BUSH,z.x1-9,wy+3);stamp(g,BUSH,z.x1-8,wy+20); // the wall and the fence end behind a bush
   const zw=z.x1-z.x0+1;claim(z.x0,wy-3,zw,16);claim(z.x0,wy+19,zw,25);claim(hx-10,hy-22,60,wy-hy+20);claim(pmin-5,wy+13,pmax-pmin+12,yS-wy-13);
   {
    stamp(g,MAIL,px+4,wy+20);stamp(g,LAMP,px-9,wy+15);
    const gw=Math.min(30,hx-2-(z.x0+2)),gy=wy+46;if(gw>=16&&gy+12<yS-2&&free(z.x0+2,gy,gw,12)){stamp(g,gardenRows(gw,12),z.x0+2,gy);claim(z.x0+2,gy,gw,12);A.bed=[z.x0+2,gy,gw]}
    const bx=pmax+9;if(bx+16<=z.x1&&free(bx,wy+46,16,10)){shadow(bx+8,wy+55,10,1.5);stamp(g,BENCH,bx,wy+46);claim(bx,wy+46,16,10);A.bn=[bx,wy+46]}
   }
   spots(hx,wy,px);
  }
  if(z.tree){
   for(let y=ty+44;y<=ty+58;y++)for(let x=tx-2;x<=tx+44;x++){const ex=(x-tx-20)/24,ey=(y-ty-52)/6;if(ex*ex+ey*ey<1&&g[y])g[y][x]=DARK[g[y][x]]||g[y][x]}
   stamp(g,BUSH,tx-14,ty+47);dynTrees.push({fr:TREEF,x:tx,y:ty});claim(tx-16,ty,76,62);
   {const zw2=z.x1-z.x0+1,py=ty+62;let pw=Math.min(56,zw2-14),ph=Math.round(pw*.36);if(py+ph>=yS-2){ph=yS-3-py;pw=Math.round(ph/.36)}
    if(pw>=30&&ph>=8){const px2=z.x0+Math.round((zw2-pw)/2);stamp(g,pondRows(pw,ph),px2,py);claim(px2-2,py-2,pw+4,ph+4)}}
   for(let i=0;i<10;i++)put(g,tx+4+(rnd()*36|0),ty+56+(rnd()*4|0),'fij'[rnd()*3|0]);
  }
 }
 // scatter the free lawn: small trees, pines, bushes, rocks, mushrooms, flower clumps, butterflies
 claim(0,yS-2,W,H-yS+2);
 for(const z of zones){const zw=z.x1-z.x0+1,area=zw*(yS-topY);
  const spot=(w,h,pad)=>{for(let t=0;t<40;t++){const x=z.x0+((zw-w)*rnd()|0),y=topY+((yS-topY-h-2)*rnd()|0);if(free(x-pad,y-pad,w+2*pad,h+2*pad)){claim(x-pad,y-pad,w+2*pad,h+2*pad);return[x,y]}}return null};
  const add=(rows,n,pad)=>{for(let i=0;i<n;i++){const p=spot(rows[0].length,rows.length,pad);if(p)props.push({rows,x:p[0],y:p[1]})}};
  for(let i=0;i<Math.round(area/4500);i++){const p=spot(28,33,2);if(p){shadow(p[0]+14,p[1]+31,12,3);dynTrees.push({fr:TREE2F,x:p[0],y:p[1]})}}
  add(PINE,Math.round(area/3800),2);add(BUSH,Math.round(area/2200),1);add(ROCK1,Math.round(area/3000),1);add(ROCK2,Math.round(area/3000),1);add(SHROOM,Math.round(area/6000),1);if(area>9000)add(STUMP,1,2);
  for(let i=0;i<Math.round(area/650);i++){const p=spot(8,6,0);if(p)for(let k=0;k<6;k++){const x=p[0]+(rnd()*8|0),y=p[1]+(rnd()*5|0);put(g,x,y,'fij'[rnd()*3|0]);put(g,x,y+1,'m')}}
  for(let i=0;i<(L.mode==='wide'?2:1);i++)bflies.push({x:z.x0+rnd()*zw,y:topY+10+rnd()*(yS-topY-20),vx:0,vy:0,c:'fji'[rnd()*3|0],z});
 }
 props.sort((a,b)=>a.y+a.rows.length-(b.y+b.rows.length));
 for(const p of props){shadow(p.x+p.rows[0].length/2,p.y+p.rows.length-1,p.rows[0].length/2,1.5);stamp(g,p.rows,p.x,p.y)}
 for(const z of zones)for(let i=0;i<(z.x1-z.x0)*H/260;i++){const x=z.x0+(rnd()*(z.x1-z.x0)|0),y=rnd()*(yS-6)|0; // tufts last: only on bare lawn, never over a sprite
  const ok=(a,b)=>g[b]&&'bcd'.includes(g[b][a]);if(ok(x+2,y+3)&&ok(x,y)&&ok(x+4,y)&&ok(x,y+3)&&ok(x+4,y+3)&&ok(x+2,y))tufts.push([x,y,(rnd()-.5)*.8])}
 for(let x=0;x<W;x++){for(let j=0;j<12;j++)put(g,x,yS+j,WATER[j][x%32]);if(rnd()<.3)put(g,x,yS+1,'b');if(rnd()<.25)put(g,x,yS+10,'c')}
 for(const z of zones)if(z.px)[[z.px-6,yS+3],[z.px,yS+5],[z.px+5,yS+7]].forEach(([x,y])=>{stamp(g,['.454.','33333','.222.'],x,y);put(g,x+5,y+1,'F');put(g,x-1,y+1,'j')});
 for(let y=yS+12;y<H;y++)for(let x=0;x<W;x++)g[y][x]=rnd()<.2?'d':'c';
 st=new Uint8Array(W*H);for(let y=0;y<H;y++)for(let x=0;x<W;x++)st[y*W+x]=ix(g[y][x]);
 fb=new Uint8Array(W*H);
}

// ---- wind: one curve drives everything ----
const gust=t=>{const a=t-gustAt;return a<0?0:gustPeak*(a<1.5?a/1.5:Math.max(0,1-(a-1.5)/3))};
const wind=(t,still)=>still?.2:.35+.25*Math.sin(2*Math.PI*t/11)+.15*Math.sin(2*Math.PI*t/4.3)+gust(t);
function doGust(t){gustAt=t;gustPeak=.6+.4*drnd()}

// ---- the man's day: a pure function of the local date and the wall-clock second ----
// Windows [start minute, code]: z asleep, u up indoors, M lamp out then the first chore, W the second chore, t tea,
// X the weekly slot, m mail then lunch indoors, r the midday rest, A the afternoon chore, w watering, E lamp on then tea, i evening indoors.
const DAY=[[0,'z'],[380,'u'],[410,'M'],[465,'W'],[520,'t'],[550,'X'],[680,'m'],[750,'r'],[885,'A'],[975,'w'],[1065,'E'],[1200,'i'],[1350,'z']],SPEED=12;
const ck={d:0,s:0,o:0,n:-1},man={x:0,y:0,k:'in',f:1,t:0,v:false,d:0,i:0};
// local day number and wall-clock seconds; the zone offset is re-read once per second, so a DST change lands within a second
function clock(ms){if(ms>=ck.n||ms<ck.n-1e3){ck.o=new Date(ms).getTimezoneOffset()*6e4;ck.n=ms-ms%1e3+1e3}const w=ms-ck.o;ck.d=Math.floor(w/864e5);ck.s=(w-ck.d*864e5)/1e3}
// places he works: {i: where it leaves the spine (door, steps, path, bank), p: points off the spine, f: facing}. All legs lie in claimed ground.
function spots(hx,wy,zx){const S=A.S,at=y=>{let i=0;while(i<S.length-1&&S[i][1]<y)i++;return i},sp=(y,x,f,k)=>{const i=at(y);return{i,p:x==null?[]:[[x,S[i][1]]],f,k}};
 const j=at(wy+41),y41=S[j][1],T=(x,f)=>sp(wy-2,x,f);
 Object.assign(A,{door:T(null,1),boxL:T(hx,1),boxR:T(hx+39,-1),lamp:sp(wy+31,zx-2,-1),mail:sp(wy+31,zx+1,1),bank:sp(L.yS,null,1),
  pots:[[T(hx+21,1),hx+25,wy-7],[{i:j,p:[[zx-11,y41]],f:-1},zx-17,wy+34]]});
 A.bench=A.door;if(A.bn){const[bx,by]=A.bn;A.bench=sp(by+9,bx+4,1);A.pots.push([sp(by+9,bx+6,1,'hold'),bx+11,by])}
 A.bed&&(A.cols=[]);if(A.bed)for(let x=A.bed[0]+3;x<A.bed[0]+A.bed[2]-2;x+=4)A.cols.push({i:j,p:[[x+6,y41],[x+6,wy+44]],f:-1,x})}
function route(a,b){const S=A.S,P=a.p.slice().reverse(),d=b.i>a.i?1:-1;for(let i=a.i;;i+=d){P.push(S[i]);if(i===b.i)break}return P.concat(b.p)}
const plen=P=>{let n=0;for(let i=1;i<P.length;i++)n+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);return n};
function plan(d){
 const r=mk(d*7919+1),swap=r()<.4,mail=r()<.6,wk=Math.floor((d+3)/7),wd=(d+3)%7,q=mk(wk*7907+3),R=q()*7|0,Pd=(R+1+(q()*6|0))%7;
 const g=[],win=DAY.map(([m],i)=>[m*60,(DAY[i+1]?DAY[i+1][0]:1440)*60]),p={g,win,mail,R:wd===R,P:wd===Pd,wd,wk,sw:[],st:[],rp:[],pk:0,dp:0,on:0,off:0};
 let t=0,at=A.door,f=1,w=0;
 const seg=(b,k,P,tl,F)=>{if(b>t){const C=[0];for(let i=1;i<P.length;i++)C.push(C[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));g.push({a:t,b,w,k,P,C,F,t:tl});t=b}};
 const fac=P=>{const F=[f];for(let i=1;i<P.length;i++){const dx=P[i][0]-P[i-1][0];F.push(Math.abs(dx)>Math.abs(P[i][1]-P[i-1][1])?Math.sign(dx):F[i-1])}f=F[F.length-1];return F};
 // a window's steps: ['g',spot,tool] walk; ['s',secs,pose,tool,mark] stay; ['m',points,pose,tool,spot,mark,secs] slow move.
 // secs 0 = take the rest of the window (each window has one such step, a rest or the last chore).
 const run=(Ls,b)=>{let x=t,c=at,n=0;for(const s of Ls)if(s[0]==='g'){x+=plen(route(c,s[1]))/SPEED;c=s[1]}else{const d=s[0]==='m'?s[6]:s[1];d?x+=d:n++;if(s[0]==='m')c=s[4]}
  const X=n?Math.max(0,(b-x)/n):0;
  for(const s of Ls){let m;if(s[0]==='g'){const P=route(at,s[1]);seg(t+plen(P)/SPEED,'walk',P,s[2],fac(P));at=s[1]}
   else if(s[0]==='m'){seg(t+(s[6]||X),s[2],s[1],s[3],s[1].map(()=>s[4].f));at=s[4];f=at.f;m=s[5]}
   else{f=at.f;seg(t+(s[1]||X),s[2],[at.p.length?at.p[at.p.length-1]:A.S[at.i]],s[3],[f]);m=s[4]}
   if(m){const e=g[g.length-1];m==='sw'||m==='st'?p[m].push([e.a,e.b]):m==='rp'?p.rp.push(e.b):p[m]=e.b}}
  if(Math.abs(t-b)<1e-6){g[g.length-1].b=b;t=b}};
 const home=[['g',A.door],['s',0,'in']],bench=[['g',A.bench],['s',0,'sit']],step=[['g',A.door],['s',0,'sit']];
 const sweep=[['g',A.door],['m',A.S,'hold','b',A.bank,'sw',2100],['g',A.door,'b']],stream=[['g',A.bank],['s',2400,'kneel','s','st']];
 const water=[['g',A.door],['g',A.bank,'c'],['s',20,'kneel','c']];
 (A.cols||[]).concat(A.boxL,A.boxR).forEach((s,i,a)=>{water.push(['g',s,'c'],['s',75,'hold','w']);if(i%3===2&&i<a.length-1)water.push(['g',A.bank,'c'],['s',20,'kneel','c'])});water.push(['g',A.door,'c']);
 const tea=[['g',A.door],['g',A.bench,'t'],['s',0,'sit','t']];
 const plant=[['g',A.door]];(A.cols||[]).forEach(s=>plant.push(['g',s,'f'],['s',300,'kneel','f','rp']));plant.push(['g',A.boxL,'f'],['s',300,'hold','f','rp'],['g',A.boxR,'f'],['s',300,'hold','f','rp'],['g',A.door]);
 const np=A.pots.length,[o,n]=[A.pots[(wk+np-1)%np],A.pots[wk%np]];
 const pot=[['g',o[0]],['s',6,o[0].k||'kneel',0,'pk'],['g',n[0],'p'],['s',6,n[0].k||'kneel','p','dp']].concat(stream);
 const W={z:home,u:home,i:home,M:[['g',A.lamp],['s',8,'reach',0,'off']].concat(swap?water:sweep,home),W:(swap?sweep:water).concat(step),t:tea,
  X:(p.R?plant:p.P?pot:stream).concat(bench),m:[['g',A.mail],['s',8,'reach'],['g',A.door,mail?'l':0],['s',0,'in']],
  r:[['g',A.bench,mail?'l':0]].concat(mail?[['s',900,'sit','l'],['g',A.door]]:[['g',A.door]],[['g',A.bench,'t'],['s',1800,'sit','t'],['s',0,'nap']]),
  A:(p.R||p.P?stream:sweep).concat(bench),w:water.concat(step),E:[['g',A.lamp],['s',8,'reach',0,'on']].concat(tea)};
 DAY.forEach(([,c],i)=>{w=i;run(W[c],win[i][1])});
 return p}
// where he is at second s of the plan's day: fills `man` (no allocation)
function pose(p,s){const g=p.g;let i=man.i;if(!(i<g.length&&g[i].a<=s))i=0;while(i<g.length-1&&g[i].b<=s)i++;man.i=i;
 const q=g[i],P=q.P,C=q.C,n=P.length-1;let k=0,x=P[0][0],y=P[0][1],dd=0;
 if(n){dd=C[n]*clamp((s-q.a)/(q.b-q.a),0,1);while(k<n-1&&C[k+1]<dd)k++;const u=C[k+1]>C[k]?(dd-C[k])/(C[k+1]-C[k]):0;x=P[k][0]+(P[k+1][0]-P[k][0])*u;y=P[k][1]+(P[k+1][1]-P[k][1])*u}
 man.x=x;man.y=y;man.d=dd;man.k=q.k;man.t=q.t;man.f=q.F[n?k+1:0];man.v=q.k!=='in'}

// ---- drawing ----
const blit=(sp,x,y,flip)=>{x|=0;y|=0;for(let j=0;j<sp.h;j++){const yy=y+j;if(yy<0||yy>=H)continue;for(let i=0;i<sp.w;i++){const v=sp.d[j*sp.w+(flip?sp.w-1-i:i)];if(!v)continue;const xx=x+i;if(xx<0||xx>=W)continue;fb[yy*W+xx]=v}}};
const dot=(x,y,ch)=>{x|=0;y|=0;if(x>=0&&x<W&&y>=0&&y<H)fb[y*W+x]=ix(ch)};
function frame(now,still){
 const t=now/1000-t0,w=wind(t,still),{zones,wy,hy,ty}=L,hz=zones[0],tz=zones.find(z=>z.tree);n++;
 if(!still&&t>nextGust){doGust(t);nextGust=t+6+8*drnd()}
 fb.set(st);const ph=n>>1;
 for(let i=0;i<4;i++)lut[ix(String(6+i))]=CYC[still?i:(ph+i)&3];
 lut[ix('F')]=still||(n>>3)&1?rgba(PAL.F):rgba(PAL.C);lut[ix('G')]=still||((n+4)>>3)&1?rgba(PAL.F):rgba(PAL.C);
 if(still||n>=nextLant){lant=still?0:drnd()<.5;nextLant=n+1+(drnd()*3|0)}lut[ix('L')]=rgba(lant?PAL.h:PAL.g);
 for(const [x,y,j] of tufts)blit(TUFT[1-clamp(Math.round(1.5*wind(t-(W-x)/40,still)+j),-1,1)],x,y);
 if(treeF===1&&w>.75)treeF=0;else if(treeF===0&&w<.65)treeF=1;else if(treeF===1&&w<.25)treeF=2;else if(treeF===2&&w>.35)treeF=1;
 for(const t of dynTrees)blit(t.fr[still?1:treeF],t.x,t.y);
 // smoke from the chimney, drifting left with the wind
 if(!still&&n%12===0&&hz)puffs.push({x:hz.hx+30,y:hy-2,age:0});
 if(still&&!puffs.length&&hz)puffs.push({x:hz.hx+27,y:hy-8,age:20},{x:hz.hx+22,y:hy-14,age:40});
 puffs=puffs.filter(p=>p.age<64);for(const p of puffs){if(!still){p.age++;p.y-=.3;p.x-=.5*w}const r=p.age<20?1:p.age<40?2:3,dn=p.age<20?1:p.age<40?.5:.25;
  for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(i*i+j*j<=r*r+1&&BAYER[(p.y+j)&3&3][(p.x+i)&3]<16*dn)dot(p.x+i,p.y+j,Math.abs(i)+Math.abs(j)<r?'v':'q')}
 // leaves: spawn from the canopy, blow left, rest on the lawn, dither out
 const cap=L.mode==='narrow'?10:24;
 if(tz){if(still&&!leaves.length)for(let i=0;i<3;i++)leaves.push({x:tz.tx-6-i*9,y:ty+48+i*3,vx:0,vy:0,phi:i,rest:40,fade:0});
  if(!still&&leaves.length<cap&&drnd()<.12+.5*w+(gust(t)>.3?.4:0))leaves.push({x:tz.tx+2+drnd()*40,y:ty+10+drnd()*28,vx:0,vy:0,phi:drnd()*6,rest:0,fade:0,gy:ty+46+drnd()*14})}
 leaves=leaves.filter(l=>l.x>-4&&l.x<W+4&&l.fade<10);for(const l of leaves){
  if(!still){if(l.rest>0){if(--l.rest===0)l.fade=1}else if(l.fade){l.fade++}else{l.phi+=.6;l.vx=clamp(-1.2*w+.4*Math.sin(l.phi),-2,2);l.vy=clamp(.35+.25*Math.sin(2*l.phi),-2,2);l.x+=l.vx;l.y+=l.vy;if(l.y>=l.gy){l.rest=30+(drnd()*30|0);l.y=l.gy}}}
  if(l.fade&&BAYER[(l.y|0)&3][(l.x|0)&3]<l.fade*1.6)continue;blit(LEAF[Math.floor(l.phi*1.5)%3|0],l.x,l.y)}
 // fireflies in the tree's margin
 if(tz){if(!flies.length)for(let i=0;i<6;i++)flies.push({x:tz.x0+drnd()*(tz.x1-tz.x0),y:ty+25+drnd()*40,on:drnd()*30|0});
  for(const f of flies){if(!still){f.x=clamp(f.x+(drnd()-.5)*1.2,tz.x0,tz.x1);f.y=clamp(f.y+(drnd()-.5)*1.2,ty+20,H-30);f.on=(f.on+1)%(20+f.on%20+10)}
   if(f.on<12){dot(f.x,f.y,'h');[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b],q)=>{if(q%2===n%2)dot(f.x+a,f.y+b,'g')})}}}
 for(const b of bflies){const z=b.z;if(!still){b.vx=clamp(b.vx+(drnd()-.5)*.9,-1.6,1.6);b.vy=clamp(b.vy+(drnd()-.5)*.9,-1,1);b.x+=b.vx;b.y+=b.vy;
   if(b.x<z.x0||b.x>z.x1){b.vx*=-1;b.x=clamp(b.x,z.x0,z.x1)}if(b.y<L.topY+8||b.y>L.yS-8){b.vy*=-1;b.y=clamp(b.y,L.topY+8,L.yS-8)}}
  const up=still||(n&1);dot(b.x-1,b.y+(up?0:1),b.c);dot(b.x+1,b.y+(up?0:1),b.c);dot(b.x,b.y+(up?1:0),'w')}
 // the character stands on the lower lawn with a 2-frame idle bob (pacing is built in but off)
 if(hz){const lo=6,hi=hz.x1-18,y=Math.min(wy+22,L.yS-17);if(hero.walk&&!still){hero.x+=hero.dir*48/ppa*(1000/ui.fps)/1000;if(hero.x>hi){hero.x=hi;hero.dir=-1}if(hero.x<lo){hero.x=lo;hero.dir=1}hero.f=n>>1&1}else hero.f=0;
  blit(HERO[hero.f],hero.x,y+(!hero.walk&&(n>>2)&1?1:0),hero.dir<0)}
 for(let i=0;i<u32.length;i++)u32[i]=lut[fb[i]];
 actx.putImageData(img,0,0);ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,cv.width,cv.height);ctx.drawImage(art,0,0,W*k,H*k);
}

// ---- clouds: a pixel-art cloud behind each section of text, drawn from the page's own layout ----
const clouds=(()=>{
 // [selector, kind]: 0 section cloud, 1 small cloud on the yard (logo, menu), 2 small cloud on a cloud (buttons)
 const HOSTS=[['.profile_inner',0],['.post-single',0],['.post-entry',0],['.page-header',0],['#searchbox',0],['.terms-tags',0],['.not-found',0],['.footer',0],['.logo',1],['#menu a',1],['.button',2]];
 const abgr=h=>(255<<24)|(parseInt(h.slice(4),16)<<16)|(parseInt(h.slice(2,4),16)<<8)|parseInt(h.slice(0,2),16);
 const SK=[[7,'F8FBFF','DCEBFA','BFD8F2','7FA6D6'],[4,'F8FBFF','DCEBFA','BFD8F2','7FA6D6'],[3,'CFE3F8','B4D0EE','98BBE4','6F97C9']].map(([r,...c])=>({r,c:c.map(abgr)}));
 const hosts=new Map();let ro=null,seed=0;
 function draw(el,h){
  if(el.offsetWidth<2||el.offsetHeight<2)return;
  const sk=SK[h.k],r=sk.r,m=r+1,c=h.c,Wa=Math.ceil(el.offsetWidth/ppa)+2*m,Ha=Math.ceil(el.offsetHeight/ppa)+2*m;
  c.width=Wa;c.height=Ha;c.style.cssText=`left:${-m*ppa}px;top:${-m*ppa}px;width:${Wa*ppa}px;height:${Ha*ppa}px`;
  const R=mk(h.s),M=new Uint8Array(Wa*Ha),on=(x,y)=>x>=0&&y>=0&&x<Wa&&y<Ha&&M[y*Wa+x];
  const disc=(cx,cy,q)=>{for(let y=Math.floor(cy-q);y<=cy+q;y++)for(let x=Math.floor(cx-q);x<=cx+q;x++)if(x>=0&&y>=0&&x<Wa&&y<Ha&&(x+.5-cx)**2+(y+.5-cy)**2<=q*q)M[y*Wa+x]=1};
  const x0=m,y0=m,x1=Wa-m-1,y1=Ha-m-1; // the element's box, in art pixels
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)M[y*Wa+x]=1;
  const edge=(ax,ay,bx,by)=>{const len=Math.hypot(bx-ax,by-ay)||1;for(let d=0;d<=len;d+=r*.9+R()*r*.6){const t=d/len;disc(ax+(bx-ax)*t,ay+(by-ay)*t,r*(.6+R()*.4))}};
  edge(x0,y0,x1,y0);edge(x0,y1,x1,y1);edge(x0,y0,x0,y1);edge(x1,y0,x1,y1); // puffs along all four edges
  // white, shaded toward the underside, outlined where the cloud meets the air
  const cx=c.getContext('2d'),id=cx.createImageData(Wa,Ha),u=new Uint32Array(id.data.buffer),yb=new Int16Array(Wa).fill(-1);
  for(let x=0;x<Wa;x++)for(let y=Ha-1;y>=0;y--)if(M[y*Wa+x]){yb[x]=y;break}
  for(let y=0;y<Ha;y++)for(let x=0;x<Wa;x++)if(M[y*Wa+x]){const d=yb[x]-y;u[y*Wa+x]=sk.c[!on(x-1,y)||!on(x+1,y)||!on(x,y-1)||!on(x,y+1)?3:d<=3?2:d<=6?1:0]}
  cx.putImageData(id,0,0)}
 function adopt(el,k){if(hosts.has(el))return;const c=document.createElement('canvas'),h={k,c,s:++seed};c.className='w-cloud';c.setAttribute('aria-hidden','true');
  el.classList.add('w-host','w-k'+k);el.prepend(c);hosts.set(el,h);if(ro)ro.observe(el)}
 const scan=()=>{for(const [sel,k] of HOSTS)document.querySelectorAll(sel).forEach(el=>adopt(el,k))};
 return{start(){if(typeof ResizeObserver==='function')ro=new ResizeObserver(es=>es.forEach(e=>{const h=hosts.get(e.target);if(h)draw(e.target,h)}));
   scan();hosts.forEach((h,el)=>{if(ro)ro.observe(el);draw(el,h)});new MutationObserver(scan).observe(document.body,{childList:true,subtree:true})},
  refresh(){hosts.forEach((h,el)=>draw(el,h))}}
})();

// ---- loop control: the yard always runs (owner decision); it only rests while the tab is hidden ----
const want=()=>!document.hidden;
function loop(now){raf=0;if(!want())return;raf=requestAnimationFrame(loop);if(now-last<1000/ui.fps-2)return;last=now;frame(now,false)}
function sync(){if(want()&&!raf)raf=requestAnimationFrame(loop);if(!want()&&raf){cancelAnimationFrame(raf);raf=0}}
function redraw(){layout();clouds.refresh();frame(performance.now(),false);sync()}
document.addEventListener('visibilitychange',sync);
let rt=0;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(redraw,150)});
layout();clouds.start();frame(performance.now(),false);sync();
})();
