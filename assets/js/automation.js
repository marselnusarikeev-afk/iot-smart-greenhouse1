const Automation={
 log(z,k,on,why){const L=Store.s.log;L.unshift({t:Date.now(),zone:z.name,dev:k,on,why});if(L.length>60)L.pop()},
 run(){const S=Store.s;if(!S.cfg.auto)return;
  S.zones.forEach(z=>{const r=S.read[z.id],d=S.dev[z.id];
   const set=(k,on,why)=>{const x=d[k];if(!x.auto||x.on===on)return;x.on=on;this.log(z,k,on,why)};
   if(r.soil<z.soilMin)set('pump',true,`почва ${r.soil.toFixed(0)}% ниже ${z.soilMin}%`);else if(r.soil>z.soilMin+15)set('pump',false,'почва достаточно влажная');
   if(r.temp>z.tMax||r.hum>85)set('fan',true,`${r.temp.toFixed(1)}°C / воздух ${r.hum.toFixed(0)}%`);else if(r.temp<z.tMax-2&&r.hum<75)set('fan',false,'климат в норме');
   if(r.light<z.lightMin)set('light',true,'недостаточно света');else if(r.light>z.lightMin*1.3)set('light',false,'света достаточно')})},
 toggle(id,k){const d=Store.s.dev[id][k],z=Store.s.zones.find(x=>x.id===id);d.auto=false;d.on=!d.on;this.log(z,k,d.on,'ручное управление');Store.save();Views.control()},
 auto(id,k){Store.s.dev[id][k].auto=true;Store.save();Views.control()}};
