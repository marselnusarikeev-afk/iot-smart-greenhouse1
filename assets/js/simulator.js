const Sim={timer:null,
 step(){const S=Store.s,hr=new Date().getHours(),sun=Math.max(0,Math.sin((hr-6)/12*Math.PI))*12000,rn=a=>(Math.random()-.5)*a,cl=(v,a,b)=>Math.min(b,Math.max(a,v));
  S.zones.forEach(z=>{const r=S.read[z.id],d=S.dev[z.id];
   r.temp=cl(r.temp+(27-r.temp)*.05+rn(.8)-(d.fan.on?.9:0)+(d.light.on?.2:0),5,50);
   r.hum=cl(r.hum+rn(2)-(d.fan.on?1.2:0)+(d.pump.on?.8:0)+.2,20,99);
   r.soil=cl(r.soil-.7+rn(.6)+(d.pump.on?5:0),5,100);
   r.light=Math.max(0,sun+(d.light.on?4000:0)+rn(400));
   r.co2=cl(r.co2+rn(30)+(d.fan.on?-30:10),350,2500);
   const h=S.hist[z.id];h.push({t:Date.now(),...r});if(h.length>60)h.shift()});
  Automation.run();Alerts.check();Store.save();document.dispatchEvent(new Event('gh:tick'))},
 start(){clearInterval(this.timer);if(Store.s.cfg.sim)this.timer=setInterval(()=>this.step(),Store.s.cfg.interval*1000)},
 inject(){Store.s.read.z1.temp+=12;Alerts.check();Store.save();document.dispatchEvent(new Event('gh:tick'))}};
