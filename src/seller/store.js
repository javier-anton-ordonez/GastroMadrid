export const SELLER = 'demo-miraflores'
export const categories = ['Quesos', 'Vinos', 'Charcutería y embutidos']
const KEY = 'gastromadrid.platform.v2'
const LEGACY_KEY = 'gastromadrid.seller.v1'
const image = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`
export const producers = [
  {id:SELLER,name:'Quesería de demostración',origin:'Miraflores de la Sierra'},
  {id:'demo-vinos',name:'Bodega de demostración',origin:'San Martín de Valdeiglesias'},
  {id:'demo-embutidos',name:'Obrador de demostración',origin:'Colmenar Viejo'},
]
function dateAgo(days) { const d=new Date(); d.setDate(d.getDate()-days); return d.toISOString() }
export function createExample() {
  const products = [
    {id:'demo-queso',name:'Queso de cabra curado',category:categories[0],price:18.5,stock:24,sellerId:SELLER,images:[image('photo-1626957341926-98752fc2ba90')],description:'Queso de cabra artesanal con doce meses de maduración.'},
    {id:'demo-fresco',name:'Queso fresco de cabra',category:categories[0],price:8.9,stock:12,sellerId:SELLER,images:[],description:'Elaborado con leche de cabra de proximidad.'},
    {id:'demo-vino',name:'Vino tinto Garnacha',category:categories[1],price:14,stock:32,sellerId:'demo-vinos',images:[image('photo-1510812431401-41d2bd2722f3')],description:'Vino de la Comunidad de Madrid, de carácter afrutado.'},
    {id:'demo-blanco',name:'Vino blanco de Madrid',category:categories[1],price:11.5,stock:18,sellerId:'demo-vinos',images:[],description:'Vino blanco fresco de producción local.'},
    {id:'demo-chorizo',name:'Chorizo artesanal',category:categories[2],price:9.8,stock:20,sellerId:'demo-embutidos',images:[],description:'Embutido curado artesanal, elaborado en Madrid.'},
    {id:'demo-salchichon',name:'Salchichón de la sierra',category:categories[2],price:10.5,stock:0,sellerId:'demo-embutidos',images:[],description:'Salchichón de curación lenta. Temporalmente agotado.'},
  ].map(p=>({...p,maker:producers.find(s=>s.id===p.sellerId).name,place:producers.find(s=>s.id===p.sellerId).origin,visible:true,available:p.stock>0,image:p.images[0]||'',demo:true}))
  const views=Array.from({length:240},(_,i)=>({id:`view-${i}`,productId:products[i%6].id,date:dateAgo(i%82),demo:true}))
  const reviews=Array.from({length:30},(_,i)=>({id:`review-${i}`,productId:products[i%6].id,stars:[5,4,5,3,4,2,4][i%7],text:['Excelente sabor.','Buena presentación y calidad.','Una opción de proximidad para repetir.'][i%3],date:dateAgo(i*2),demo:true}))
  const searches=Array.from({length:150},(_,i)=>({id:`search-${i}`,term:['queso artesanal','vino tinto','chorizo artesanal','queso de cabra','jamón ibérico','vino blanco'][i%6],category:categories[[0,1,2,0,2,1][i%6]],productIds:i%6===4?[]:[products[i%6].id],resultCount:i%6===4?0:1,date:dateAgo(i%60),demo:true}))
  return {version:2,products,producers,views,reviews,searches,clicks:[],transactions:[],lastViews:{},consent:'pending',archivedProducts:[]}
}
export function readStore() {
  const raw=localStorage.getItem(KEY)
  if(raw) {
    const data=JSON.parse(raw)
    if(data.version!==2 || !['products','views','reviews','searches','clicks','transactions','producers','archivedProducts'].every(k=>Array.isArray(data[k]))||!data.lastViews) throw new Error('Formato de datos locales no válido. Exporta o revisa el almacenamiento antes de continuar.')
    return data
  }
  const data=createExample(); const old=localStorage.getItem(LEGACY_KEY)
  if(old) {
    const legacy=JSON.parse(old)
    const legacyCategory=p=>p.category==='Lácteos'&&/queso/i.test(p.name)?'Quesos':p.category==='Bebidas'&&/vino|garnacha|tempranillo/i.test(p.name)?'Vinos':null
    for(const p of legacy.products||[]) {
      const category=categories.includes(p.category)?p.category:legacyCategory(p)
      if(!category) {data.archivedProducts.push({...p,archiveReason:'Categoría fuera del nuevo catálogo'});continue}
      const migrated={...p,stock:p.stock??null,category,images:p.images||[],maker:p.maker||producers[0].name,place:p.place||producers[0].origin}
      data.products=data.products.filter(x=>x.id!==p.id);data.products.push(migrated)
    }
    const ids=new Set(data.products.map(p=>p.id));
    for(const type of ['views','reviews']) if(Array.isArray(legacy[type])) data[type]=[...data[type].filter(e=>!legacy[type].some(l=>l.productId===e.productId)),...legacy[type].filter(e=>ids.has(e.productId))]
    data.lastViews=legacy.lastViews||{}
  }
  return data
}
export function persist(data) {localStorage.setItem(KEY,JSON.stringify(data))}
export function saveProduct(data,product) {
  const existing=data.products.find(p=>p.id===product.id)
  if(existing&&existing.sellerId!==SELLER) throw new Error('No puedes modificar productos de otro vendedor.')
  if(!categories.includes(product.category)||!product.name?.trim()||!product.description?.trim()||!product.maker?.trim()||!product.place?.trim()) throw new Error('Completa nombre, descripción, categoría, productor y origen.')
  if(!Number.isFinite(product.price)||product.price<=0||product.price>1000000||product.stock!==null&&(!Number.isInteger(product.stock)||product.stock<0)) throw new Error('Precio o stock no válido.')
  const minOrder=product.minOrder??null
  const maxOrder=product.maxOrder??null
  if([minOrder,maxOrder].some(value=>value!==null&&(!Number.isSafeInteger(value)||value<1))) throw new Error('El pedido mínimo y máximo deben ser cantidades enteras mayores que cero.')
  if(minOrder!==null&&maxOrder!==null&&maxOrder<minOrder) throw new Error('El pedido máximo no puede ser menor que el pedido mínimo.')
  if(!Array.isArray(product.images)||product.images.length>4) throw new Error('Máximo cuatro imágenes.')
  const clean={...product,minOrder,maxOrder,sellerId:SELLER,image:product.images[0]||'',demo:existing?.demo??false}
  return {...data,products:existing?data.products.map(p=>p.id===clean.id?clean:p):[...data.products,clean]}
}
export function removeProduct(data,id) {
  if(!data.products.some(p=>p.id===id&&p.sellerId===SELLER)) throw new Error('Producto no autorizado.')
  return {...data,products:data.products.filter(p=>p.id!==id),views:data.views.filter(v=>v.productId!==id),reviews:data.reviews.filter(r=>r.productId!==id),clicks:data.clicks.filter(r=>r.productId!==id)}
}
export function recordView(data,id) {
  if(data.consent!=='accepted'||!data.products.some(p=>p.id===id&&p.visible)||data.lastViews[id]&&Date.now()-data.lastViews[id]<1800000) return data
  return {...data,views:[...data.views,{id:crypto.randomUUID(),productId:id,date:new Date().toISOString(),demo:false}],lastViews:{...data.lastViews,[id]:Date.now()}}
}
export function recordClick(data,id) {
  if(data.consent!=='accepted')return data
  return {...data,clicks:[...data.clicks,{id:crypto.randomUUID(),productId:id,date:new Date().toISOString(),demo:false}]}
}
export function sanitizeTerm(term) {
  const clean=term.normalize('NFKC').trim().toLocaleLowerCase('es').replace(/\s+/g,' ').slice(0,100)
  // No guardar consultas con aspecto de correo, teléfono o URL.
  return /@|https?:|www\.|\d{5,}/i.test(clean)?'':clean.replace(/[<>]/g,'')
}
export function recordSearch(data,term,products,category) {
  const safe=sanitizeTerm(term)
  if(data.consent!=='accepted'||!safe)return data
  return {...data,searches:[...data.searches,{id:crypto.randomUUID(),term:safe,category:categories.includes(category)?category:(/queso/.test(safe)?categories[0]:/vino/.test(safe)?categories[1]:/chorizo|jam[oó]n|embutido|salchich[oó]n/.test(safe)?categories[2]:null),productIds:products.map(p=>p.id),resultCount:products.length,date:new Date().toISOString(),demo:false}]}
}
export function clearCollectedAnalytics(data) {
  return {...data,consent:'rejected',lastViews:{},...Object.fromEntries(['views','clicks','searches'].map(k=>[k,data[k].filter(e=>e.demo)]))}
}
export function average(reviews) {return reviews.length?reviews.reduce((n,r)=>n+r.stars,0)/reviews.length:0}
