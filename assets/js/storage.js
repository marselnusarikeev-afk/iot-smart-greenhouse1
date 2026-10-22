const Store={s:null,
 fresh(){const s={zones:DEFAULT_ZONES.map(z=>({...z})),read:{},hist:{},dev:{},alerts:[],log:[],cfg:{interval:3,sim:true,auto:true}};
  DEFAULT_ZONES.forEach((z,i)=>{s.read[z.id]={temp:23+i,hum:60+i*3,soil:60-i*3,light:8000,co2:550};s.hist[z.id]=[];
   s.dev[z.id]={pump:{on:false,auto:true},fan:{on:false,auto:true},light:{on:false,auto:true}}});return s},
 init(){try{this.s=JSON.parse(localStorage.getItem('gh_state'))}catch(e){}if(!this.s)this.s=this.fresh()},
 save(){try{localStorage.setItem('gh_state',JSON.stringify(this.s))}catch(e){}},
 reset(){try{localStorage.removeItem('gh_state')}catch(e){}location.reload()}};
