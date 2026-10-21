import { average, categories } from '../seller/store.js'
export const MIN_GEO_OBSERVATIONS = 10
export const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
export function selectProducts(products,{term='',category='Todo',min='',max='',origin='',producer='',sort='popular'},views=[],reviews=[]) {
  const query=normalize(term.trim())
  const selected=products.filter(p=>p.visible&& (category==='Todo'||p.category===category)&&normalize(`${p.name} ${p.category} ${p.maker} ${p.place} ${p.description}`).includes(query)&& (min===''||p.price>=Number(min))&&(max===''||p.price<=Number(max))&&normalize(p.place).includes(normalize(origin))&&(!producer||p.sellerId===producer))
  const count=id=>views.filter(v=>v.productId===id).length
  const rating=id=>average(reviews.filter(v=>v.productId===id))
  return selected.sort((a,b)=>sort==='price-asc'?a.price-b.price:sort==='price-desc'?b.price-a.price:sort==='rating'?rating(b.id)-rating(a.id):count(b.id)-count(a.id))
}
export function periodBounds(filters,now=new Date()) {
  const end=filters.to?new Date(`${filters.to}T23:59:59.999`):new Date(now)
  const start=filters.from?new Date(`${filters.from}T00:00:00`):new Date(end.getTime()-Number(filters.days||90)*86400000)
  return {start,end}
}
export function inPeriod(event,filters) {
  const {start,end}=periodBounds(filters);const d=new Date(event.date)
  return d>=start&&d<=end&&(filters.source==='all'||(filters.source==='demo'?event.demo===true:event.demo!==true))
}
export function analyze(data,filters={},sellerId) {
  filters={days:90,source:'local',category:'',product:'',...filters}
  const products=data.products.filter(p=>(!sellerId||p.sellerId===sellerId)&&(!filters.category||p.category===filters.category)&&(!filters.product||p.id===filters.product))
  const ids=new Set(products.map(p=>p.id))
  const scope=k=>data[k].filter(e=>ids.has(e.productId)&&inPeriod(e,filters))
  const views=scope('views'),reviews=scope('reviews'),clicks=scope('clicks')
  const transactions=data.transactions.filter(e=>e.status==='completed'&&typeof e.orderId==='string'&&Number.isInteger(e.quantity)&&e.quantity>0&&Number.isFinite(e.amount)&&e.amount>=0&&ids.has(e.productId)&&inPeriod(e,filters))
  const searches=data.searches.filter(e=>inPeriod(e,filters)&&(!filters.category||e.category===filters.category)&&(!filters.product||e.productIds.includes(filters.product)))
  const ranked=products.map(p=>{const rs=reviews.filter(r=>r.productId===p.id);const sold=transactions.filter(t=>t.productId===p.id);return {...p,views:views.filter(v=>v.productId===p.id).length,reviewCount:rs.length,rating:average(rs),units:sold.reduce((n,t)=>n+t.quantity,0),revenue:sold.reduce((n,t)=>n+t.amount,0)}})
  return {products,views,reviews,clicks,transactions,searches,ranked,average:average(reviews),revenue:transactions.reduce((n,t)=>n+t.amount,0),units:transactions.reduce((n,t)=>n+t.quantity,0)}
}
export function series(events,filters,group='Día',value=e=>1,mean=false) {
  const {start,end}=periodBounds(filters);if(start>end)return []
  const key=raw=>{const d=new Date(raw);d.setHours(0,0,0,0);if(group==='Semana')d.setDate(d.getDate()-(d.getDay()+6)%7);if(group==='Mes')d.setDate(1);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
  const buckets=new Map();const cursor=new Date(start);cursor.setHours(0,0,0,0)
  // Límite defensivo para rangos manuales excesivos.
  for(let i=0;cursor<=end&&i<3660;i++){buckets.set(key(cursor),[]);cursor.setDate(cursor.getDate()+1)}
  events.forEach(e=>buckets.get(key(e.date))?.push(value(e)))
  return [...buckets].filter(([,values])=>!mean||values.length).map(([label,values])=>({label:new Date(`${label}T12:00:00`).toLocaleDateString('es-ES'),value:values.reduce((n,v)=>n+v,0)/(mean?values.length:1)}))
}
export function keywords(searches) {
  const map=new Map()
  searches.forEach(s=>{const row=map.get(s.term)||{label:s.term,value:0,empty:0};row.value++;if(!s.resultCount)row.empty++;map.set(s.term,row)})
  return [...map.values()].sort((a,b)=>b.value-a.value)
}
export function growth(events,filters,key) {
  const {start,end}=periodBounds(filters);const middle=(+start + +end)/2;const map=new Map()
  events.forEach(e=>{const label=key(e);const row=map.get(label)||{label,before:0,after:0};row[new Date(e.date).getTime()<middle?'before':'after']++;map.set(label,row)})
  return [...map.values()].map(r=>({...r,delta:r.after-r.before,percent:r.before?Math.round((r.after-r.before)/r.before*100):null})).sort((a,b)=>b.delta-a.delta)
}
export function opportunities(data,stats,filters) {
  const trends=growth(stats.searches,filters,s=>s.category||'Sin categoría')
  return categories.map(category=>{
    const searches=stats.searches.filter(s=>s.category===category)
    const supply=data.products.filter(p=>p.visible&&p.available&&p.stock!==0&&p.category===category).length
    const unmet=searches.filter(s=>s.resultCount===0).length
    const trend=trends.find(t=>t.label===category)
    const demandPoints=Math.min(40,searches.length*2)
    const gapPoints=searches.length?Math.round(30*unmet/searches.length):0
    const supplyPoints=searches.length?Math.max(0,20-supply*5):0
    const growthPoints=trend?.delta>0?10:0
    const score=demandPoints+gapPoints+supplyPoints+growthPoints
    return {category,demand:searches.length,supply,trend,score,priority:score>=65?'Alta':score>=35?'Media':'Baja',reason:!searches.length?'Sin búsquedas suficientes para recomendar captación.':`${searches.length} búsquedas, ${unmet} sin resultados y ${supply} productos disponibles.`,explanation:`Demanda ${demandPoints}/40 + búsquedas sin resultado ${gapPoints}/30 + escasez ${supplyPoints}/20 + crecimiento ${growthPoints}/10`}
  }).sort((a,b)=>b.score-a.score)
}
export function geoStats(transactions) {
  const groups=new Map()
  transactions.filter(t=>t.geoBasis==='consented-approximate'&&typeof t.district==='string'&&t.date&&t.observationId&&t.orderId&&Number.isFinite(t.amount)&&t.amount>=0).forEach(t=>{const row=groups.get(t.district)||[];row.push(t);groups.set(t.district,row)})
  return [...groups].filter(([,rows])=>new Set(rows.map(r=>r.observationId)).size>=MIN_GEO_OBSERVATIONS).map(([district,rows])=>{const orders=new Set(rows.map(r=>r.orderId));return {district,purchases:orders.size,spend:rows.reduce((n,r)=>n+r.amount,0),ticket:rows.reduce((n,r)=>n+r.amount,0)/orders.size,rows}})
}
