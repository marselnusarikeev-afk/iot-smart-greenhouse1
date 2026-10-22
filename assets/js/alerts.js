const Alerts={
 rule(z,type,cond,lvl,msg){const A=Store.s.alerts,a=A.find(x=>x.zone===z.id&&x.type===type&&!x.resolved);
  if(cond&&!a)A.unshift({id:Date.now()+z.id+type,zone:z.id,type,lvl,msg,t:Date.now(),ack:false,resolved:false});
  else if(!cond&&a)a.resolved=true},
 check(){const S=Store.s;S.zones.forEach(z=>{const r=S.read[z.id];
   this.rule(z,'t_hi',r.temp>z.tMax+4,'critical',`Перегрев: ${r.temp.toFixed(1)} °C`);
   this.rule(z,'t_lo',r.temp<12,'critical',`Холод: ${r.temp.toFixed(1)} °C`);
   this.rule(z,'soil',r.soil<z.soilMin-15,'warning',`Почва пересохла: ${r.soil.toFixed(0)}%`);
   this.rule(z,'hum',r.hum>90,'warning',`Влажность ${r.hum.toFixed(0)}% — риск грибка`);
   this.rule(z,'co2',r.co2>1500,'warning',`CO₂ ${Math.round(r.co2)} ppm`)});
  if(S.alerts.length>100)S.alerts.length=100;this.badge()},
 badge(){const b=document.getElementById('badge');if(!b)return;const n=Store.s.alerts.filter(a=>!a.resolved).length;b.hidden=!n;b.textContent=n},
 ack(id){const a=Store.s.alerts.find(x=>x.id===id);if(a)a.ack=true;Store.save();Views.alerts()},
 clear(){Store.s.alerts=Store.s.alerts.filter(a=>!a.resolved);Store.save();Views.alerts()}};
Views.alerts=()=>{const S=Store.s,zn=id=>S.zones.find(z=>z.id===id).name;
 document.getElementById('view').innerHTML='<p><button onclick="Alerts.clear()">Очистить решённые</button></p>'+
 (S.alerts.slice(0,40).map(a=>`<div class="card al ${a.lvl} ${a.resolved?'done':''}"><b class="${a.lvl==='critical'?'cr':'wa'}">${a.lvl==='critical'?'Авария':'Предупреждение'}</b>: ${zn(a.zone)}, ${a.msg}<div class="mu">${new Date(a.t).toLocaleString()} ${a.resolved?'· решено':a.ack?'· принято':`<button onclick="Alerts.ack('${a.id}')">Принять</button>`}</div></div>`).join('')||'<div class="card mu">Активных тревог нет. Всё в норме.</div>')};
