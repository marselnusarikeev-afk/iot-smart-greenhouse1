const Views={};
const SENSORS={temp:{n:'Температура',u:'°C'},hum:{n:'Влажность воздуха',u:'%'},soil:{n:'Влажность почвы',u:'%'},light:{n:'Освещённость',u:'лк'},co2:{n:'CO₂',u:'ppm'}};
const DEV={pump:'Полив',fan:'Вентиляция',light:'Освещение'};
const DEFAULT_ZONES=[
 {id:'z1',name:'Томаты',tMax:26,soilMin:45,lightMin:6000},
 {id:'z2',name:'Огурцы',tMax:28,soilMin:50,lightMin:5000},
 {id:'z3',name:'Зелень',tMax:24,soilMin:40,lightMin:7000},
 {id:'z4',name:'Рассада',tMax:27,soilMin:55,lightMin:8000}];
const NAV=[['index','Главная','🏡'],['dashboard','Панель','📊'],['zones','Зоны','🌿'],['sensors','Датчики','📡'],['control','Управление','🎛'],['alerts','Тревоги','🚨'],['analytics','Аналитика','📈'],['settings','Настройки','⚙️']];
function renderNav(){document.getElementById('nav').innerHTML='<div class="logo"><i></i>Теплица IoT</div>'+NAV.map(([p,n,i])=>`<a href="${p}.html" class="${document.body.dataset.page===p?'on':''}"><span>${i}</span>${n}${p==='alerts'?'<span class="bd" id="badge" hidden></span>':''}</a>`).join('')}
function st(z,k,v){
 if(k==='temp')return v>z.tMax+4||v<12?'cr':v>z.tMax?'wa':'ok';
 if(k==='soil')return v<z.soilMin-15?'cr':v<z.soilMin?'wa':'ok';
 if(k==='hum')return v>90?'cr':v>85?'wa':'ok';
 if(k==='co2')return v>1500?'cr':v>1200?'wa':'ok';
 return 'ok'}
const f=(k,v)=>k==='light'||k==='co2'?Math.round(v):v.toFixed(1);
function drawChart(cv,series){
 const d=devicePixelRatio||1,w=cv.clientWidth,h=cv.clientHeight;cv.width=w*d;cv.height=h*d;
 const c=cv.getContext('2d');c.scale(d,d);c.font='12px Manrope,sans-serif';
 const all=series.flatMap(s=>s.data);
 if(all.length<2){c.fillStyle='#5f736a';c.fillText('Сбор данных…',10,20);return}
 let lo=Math.min(...all),hi=Math.max(...all);if(hi-lo<1){hi+=1;lo-=1}
 for(let i=0;i<=4;i++){const y=10+(h-34)*i/4;c.strokeStyle='#d5dfd6';c.beginPath();c.moveTo(36,y);c.lineTo(w,y);c.stroke();c.fillStyle='#5f736a';c.fillText((hi-(hi-lo)*i/4).toFixed(0),2,y+4)}
 series.forEach((s,k)=>{c.strokeStyle=s.color;c.lineWidth=2.5;c.lineJoin='round';c.beginPath();
  s.data.forEach((v,i)=>{const x=36+(w-40)*i/(s.data.length-1),y=10+(h-34)*(1-(v-lo)/(hi-lo));i?c.lineTo(x,y):c.moveTo(x,y)});c.stroke();if(k===0&&series.length<4){c.lineTo(w-4,h-24);c.lineTo(36,h-24);c.closePath();c.globalAlpha=.09;c.fillStyle=s.color;c.fill();c.globalAlpha=1}
  c.fillStyle=s.color;c.fillText('● '+s.label,40+k*130,h-6)})}
