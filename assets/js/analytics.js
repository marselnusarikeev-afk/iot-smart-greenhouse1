Views.analytics=()=>{const S=Store.s,col=['#b42318','#2f7d5b','#c98a00','#4c5fd5'],a=v=>v.length?v.reduce((p,c)=>p+c,0)/v.length:0;
 const rows=S.zones.map(z=>{const h=S.hist[z.id];return{z,t:h.map(x=>x.temp),at:a(h.map(x=>x.temp)),as:a(h.map(x=>x.soil)),ah:a(h.map(x=>x.hum)),ac:a(h.map(x=>x.co2)),mx:h.length?Math.max(...h.map(x=>x.temp)):0}});
 const rec=[];rows.forEach(r=>{const n=r.z.name;if(!r.t.length)return;
  if(r.as<r.z.soilMin+5)rec.push(`${n}: почва держится у нижнего порога (${r.as.toFixed(0)}%). Увеличьте порог полива или его длительность.`);
  if(r.mx>r.z.tMax+2)rec.push(`${n}: пик ${r.mx.toFixed(1)} °C выше нормы. Проверьте вентиляцию и притенение.`);
  if(r.ah>80)rec.push(`${n}: влажность воздуха ${r.ah.toFixed(0)}%. Усильте проветривание, чтобы избежать грибка.`);
  if(r.ac>1000)rec.push(`${n}: CO₂ ${r.ac.toFixed(0)} ppm. Улучшите воздухообмен.`)});
 const cnt=k=>S.log.filter(l=>l.dev===k&&l.on).length;
 document.getElementById('view').innerHTML=`<div class="grid"><div class="card"><div class="mu">Включений полива</div><div class="kpi">${cnt('pump')}</div></div><div class="card"><div class="mu">Включений вентиляции</div><div class="kpi">${cnt('fan')}</div></div><div class="card"><div class="mu">Включений света</div><div class="kpi">${cnt('light')}</div></div><div class="card"><div class="mu">Всего тревог</div><div class="kpi">${S.alerts.length}</div></div></div>
 <h2>Температура по зонам</h2><div class="card"><canvas id="cv"></canvas></div>
 <h2>Средние значения</h2><div class="card sc"><table><tr><th>Зона</th><th>Темп., °C</th><th>Воздух, %</th><th>Почва, %</th><th>CO₂, ppm</th></tr>${rows.map(r=>`<tr><td>${r.z.name}</td><td>${r.at.toFixed(1)}</td><td>${r.ah.toFixed(0)}</td><td>${r.as.toFixed(0)}</td><td>${r.ac.toFixed(0)}</td></tr>`).join('')}</table></div>
 <h2>Рекомендации</h2><div class="card"><ul class="rec">${rec.map(x=>`<li>${x}</li>`).join('')||'<li>Отклонений не найдено. Параметры в пределах нормы.</li>'}</ul></div>`;
 drawChart(document.getElementById('cv'),rows.map((r,i)=>({label:r.z.name,color:col[i],data:r.t})))};
