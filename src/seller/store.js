export const SELLER = 'demo-miraflores'
export const categories = ['Quesos', 'Vinos', 'Charcutería y embutidos']
export const cuisines = ['Cocina española', 'Cocina italiana', 'Cocina china', 'Cocina mexicana', 'Cocina mediterránea', 'Cocina japonesa', 'Cocina francesa']
const KEY = 'gastromadrid.platform.v2'
const LEGACY_KEY = 'gastromadrid.seller.v1'
const image = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`
const fallbackImages = {
  Quesos: image('photo-1486297678162-eb2a19b0a32d'),
  Vinos: image('photo-1510812431401-41d2bd2722f3'),
  'Charcutería y embutidos': image('photo-1542838132-92c53300491e'),
}
const productImages = {
  'demo-fresco': image('photo-1452195100486-9cc805987862'),
  'demo-blanco': image('photo-1510812431401-41d2bd2722f3'),
  'demo-chorizo': image('photo-1607623814075-e51df1bdc82f'),
  'demo-salchichon': image('photo-1542838132-92c53300491e'),
  'demo-manchego': image('photo-1486297678162-eb2a19b0a32d'),
  'demo-brie': image('photo-1452195100486-9cc805987862'),
  'demo-azul': image('photo-1552767059-ce182ead6c1b'),
  'demo-rosado': image('photo-1506377247377-2a5b3b417ebb'),
  'demo-verdejo': image('photo-1516594915697-87eb3b1c14ea'),
  'demo-espumoso': image('photo-1510812431401-41d2bd2722f3'),
  'demo-jamon': image('photo-1542838132-92c53300491e'),
  'demo-lomo': image('photo-1607623814075-e51df1bdc82f'),
  'demo-morcilla': image('photo-1547592180-85f173990554'),
  'demo-salami': image('photo-1555939594-58d7cb561ad1'),
}
export const producers = [
  {id:SELLER,name:'Quesería de demostración',origin:'Miraflores de la Sierra'},
  {id:'demo-vinos',name:'Bodega de demostración',origin:'San Martín de Valdeiglesias'},
  {id:'demo-embutidos',name:'Obrador de demostración',origin:'Colmenar Viejo'},
]
function dateAgo(days) { const d=new Date(); d.setDate(d.getDate()-days); return d.toISOString() }
export function createExample() {
  const products = [
    {id:'demo-queso',name:'Queso de cabra curado',category:categories[0],cuisines:['Cocina española','Cocina mediterránea'],price:18.5,stock:24,sellerId:SELLER,images:[image('photo-1626957341926-98752fc2ba90')],description:'Queso de cabra artesanal con doce meses de maduración.'},
    {id:'demo-fresco',name:'Queso fresco de cabra',category:categories[0],cuisines:['Cocina española','Cocina mediterránea','Cocina mexicana'],price:8.9,stock:12,sellerId:SELLER,images:[],description:'Elaborado con leche de cabra de proximidad.'},
    {id:'demo-vino',name:'Vino tinto Garnacha',category:categories[1],cuisines:['Cocina española','Cocina italiana','Cocina mediterránea'],price:14,stock:32,sellerId:'demo-vinos',images:[image('photo-1510812431401-41d2bd2722f3')],description:'Vino de la Comunidad de Madrid, de carácter afrutado.'},
    {id:'demo-blanco',name:'Vino blanco de Madrid',category:categories[1],cuisines:['Cocina española','Cocina italiana','Cocina japonesa'],price:11.5,stock:18,sellerId:'demo-vinos',images:[],description:'Vino blanco fresco de producción local.'},
    {id:'demo-chorizo',name:'Chorizo artesanal',category:categories[2],cuisines:['Cocina española','Cocina mexicana'],price:9.8,stock:20,sellerId:'demo-embutidos',images:[],description:'Embutido curado artesanal, elaborado en Madrid.'},
    {id:'demo-salchichon',name:'Salchichón de la sierra',category:categories[2],cuisines:['Cocina española','Cocina italiana'],price:10.5,stock:0,sellerId:'demo-embutidos',images:[],description:'Salchichón de curación lenta. Temporalmente agotado.'},
    {id:'demo-manchego',name:'Cuña de queso manchego',category:categories[0],cuisines:['Cocina española','Cocina mediterránea'],price:16.9,stock:21,sellerId:SELLER,images:[],description:'Queso de oveja curado, ideal para tablas y tapas.'},
    {id:'demo-brie',name:'Brie de proximidad',category:categories[0],cuisines:['Cocina francesa','Cocina italiana','Cocina mediterránea'],price:13.5,stock:9,sellerId:SELLER,images:[],description:'Queso cremoso de corteza blanca para cocina y aperitivos.'},
    {id:'demo-azul',name:'Azul artesano de Madrid',category:categories[0],cuisines:['Cocina española','Cocina francesa'],price:19.2,stock:7,sellerId:SELLER,images:[],description:'Queso azul intenso para salsas, tablas y cocina creativa.'},
    {id:'demo-rosado',name:'Rosado Garnacha',category:categories[1],cuisines:['Cocina española','Cocina mediterránea','Cocina mexicana'],price:10.8,stock:26,sellerId:'demo-vinos',images:[],description:'Rosado fresco y afrutado elaborado en la Comunidad de Madrid.'},
    {id:'demo-verdejo',name:'Blanco Verdejo ecológico',category:categories[1],cuisines:['Cocina española','Cocina italiana','Cocina japonesa','Cocina china'],price:12.9,stock:17,sellerId:'demo-vinos',images:[],description:'Blanco ecológico, ligero y fresco para pescados y cocina asiática.'},
    {id:'demo-espumoso',name:'Espumoso de Madrid',category:categories[1],cuisines:['Cocina española','Cocina francesa','Cocina japonesa'],price:18.7,stock:11,sellerId:'demo-vinos',images:[],description:'Burbuja fina para celebraciones, brunch y maridajes ligeros.'},
    {id:'demo-jamon',name:'Jamón serrano loncheado',category:categories[2],cuisines:['Cocina española','Cocina italiana'],price:22.5,stock:14,sellerId:'demo-embutidos',images:[],description:'Lonchas finas de jamón serrano para tapas, bocadillos y tablas.'},
    {id:'demo-lomo',name:'Lomo embuchado artesano',category:categories[2],cuisines:['Cocina española','Cocina mediterránea'],price:15.8,stock:13,sellerId:'demo-embutidos',images:[],description:'Lomo curado de elaboración artesanal y sabor equilibrado.'},
    {id:'demo-morcilla',name:'Morcilla de cebolla',category:categories[2],cuisines:['Cocina española','Cocina mexicana'],price:8.6,stock:18,sellerId:'demo-embutidos',images:[],description:'Morcilla tradicional para guisos, arroces y cocina de producto.'},
    {id:'demo-salami',name:'Salami artesano',category:categories[2],cuisines:['Cocina italiana','Cocina española'],price:12.4,stock:16,sellerId:'demo-embutidos',images:[],description:'Salami de curación lenta para tablas, focaccias y pizzas.'},
  ].map(p=>({...p,maker:producers.find(s=>s.id===p.sellerId).name,place:producers.find(s=>s.id===p.sellerId).origin,visible:true,available:p.stock>0,image:p.images[0]||productImages[p.id]||fallbackImages[p.category],demo:true}))
  const views=Array.from({length:360},(_,i)=>({id:`view-${i}`,productId:products[i%products.length].id,date:dateAgo(i%82),demo:true}))
  const reviews=Array.from({length:54},(_,i)=>({id:`review-${i}`,productId:products[i%products.length].id,stars:[5,4,5,3,4,2,4][i%7],text:['Excelente sabor.','Buena presentación y calidad.','Una opción de proximidad para repetir.'][i%3],date:dateAgo(i*2),demo:true}))
  const searches=Array.from({length:240},(_,i)=>({id:`search-${i}`,term:['queso artesanal','vino tinto','chorizo artesanal','cocina italiana','cocina china','cocina mexicana','queso de cabra','vino blanco'][i%8],category:products[i%products.length].category,productIds:i%11===4?[]:[products[i%products.length].id],resultCount:i%11===4?0:1,date:dateAgo(i%60),demo:true}))
  return {version:2,products,producers,views,reviews,searches,clicks:[],transactions:[],lastViews:{},consent:'pending',archivedProducts:[]}
}
export function readStore() {
  const raw=localStorage.getItem(KEY)
  if(raw) {
    const data=JSON.parse(raw)
    if(data.version!==2 || !['products','views','reviews','searches','clicks','transactions','producers','archivedProducts'].every(k=>Array.isArray(data[k]))||!data.lastViews) throw new Error('Formato de datos locales no válido. Exporta o revisa el almacenamiento antes de continuar.')
    const examples=createExample()
    data.products=[...data.products,...examples.products.filter(example=>!data.products.some(product=>product.id===example.id))]
    data.products=data.products.map(p=>({...p,cuisines:Array.isArray(p.cuisines)?p.cuisines:['Cocina española'],image:p.image||p.images?.[0]||productImages[p.id]||fallbackImages[p.category]}))
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
  if(!Array.isArray(product.images)||product.images.length>4) throw new Error('Máximo cuatro imágenes.')
  const clean={...product,sellerId:SELLER,image:product.images[0]||'',demo:existing?.demo??false}
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
