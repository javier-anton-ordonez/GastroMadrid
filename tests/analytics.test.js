import test from 'node:test'
import assert from 'node:assert/strict'
import {createExample,SELLER,saveProduct,removeProduct,recordView,recordSearch,sanitizeTerm,clearCollectedAnalytics} from '../src/seller/store.js'
import {analyze,selectProducts,geoStats,opportunities,series} from '../src/analytics/model.js'
test('separa datos locales, ejemplos y vendedores',()=>{
 const data=createExample()
 assert.equal(analyze(data,{source:'local'}).views.length,0)
 const stats=analyze(data,{source:'demo'},SELLER)
 assert.equal(stats.products.length,2)
 assert.ok(stats.views.every(v=>stats.products.some(p=>p.id===v.productId)))
 assert.ok(analyze(data,{source:'demo',category:'Vinos'}).products.every(p=>p.category==='Vinos'))
})
test('registra solo con consentimiento y evita recargas durante treinta minutos',()=>{
 const data=createExample();assert.equal(recordView(data,'demo-queso'),data)
 const accepted={...data,consent:'accepted'};const first=recordView(accepted,'demo-queso')
 assert.equal(first.views.length,accepted.views.length+1)
 assert.equal(recordView(first,'demo-queso'),first)
 assert.equal(recordView(first,'inexistente'),first)
 assert.equal(clearCollectedAnalytics(first).views.length,data.views.length)
})
test('excluye consultas con aspecto de datos personales y registra búsquedas sin resultado',()=>{
 assert.equal(sanitizeTerm('persona@example.com'),'');assert.equal(sanitizeTerm('600123456'),'')
 const data={...createExample(),consent:'accepted'}
 const result=recordSearch(data,'  QUESO   ARTESANAL ',[],'Quesos')
 assert.equal(result.searches.at(-1).term,'queso artesanal')
 assert.equal(result.searches.at(-1).resultCount,0)
 const rejected={...data,consent:'rejected'};assert.equal(recordSearch(rejected,'queso',[]),rejected)
})
test('deniega cambios cruzados y categorías fuera del catálogo',()=>{
 const data=createExample();const other=data.products.find(p=>p.sellerId!==SELLER)
 assert.throws(()=>saveProduct(data,other));assert.throws(()=>removeProduct(data,other.id))
 assert.throws(()=>saveProduct(data,{...data.products[0],category:'Huerta'}))
 const deleted=removeProduct(data,'demo-queso');assert.ok(!deleted.reviews.some(r=>r.productId==='demo-queso'))
})
test('buscador normaliza acentos y aplica precio, origen y productor',()=>{
 const data=createExample();const results=selectProducts(data.products,{term:'QUESO',category:'Quesos',min:10,max:20,origin:'Miraflores',producer:SELLER,sort:'price-asc'})
 assert.equal(results.length,1);assert.equal(results[0].id,'demo-queso')
})
test('geografía exige diez observaciones distintas y una base de ubicación válida',()=>{
 const transaction={district:'Centro',geoBasis:'consented-approximate',date:new Date().toISOString(),amount:20,quantity:1,orderId:'one',observationId:'one'}
 assert.equal(geoStats(Array(12).fill(transaction)).length,0)
 const rows=Array.from({length:10},(_,i)=>({...transaction,observationId:String(i),orderId:String(i)}))
 assert.equal(geoStats(rows)[0].spend,200);assert.equal(geoStats(rows)[0].ticket,20)
 assert.equal(geoStats(rows.map(r=>({...r,geoBasis:null}))).length,0)
})
test('oportunidades sin actividad no inventan demanda y las series tienen ceros',()=>{
 const data=createExample();const filters={source:'local',days:14};const stats=analyze(data,filters)
 assert.ok(opportunities(data,stats,filters).every(o=>o.score===0&&o.demand===0))
 assert.ok(series([],filters).every(p=>p.value===0));assert.equal(series([],filters,'Día',r=>r.stars,true).length,0)
})
test('migración conserva productos fuera del alcance sin publicarlos',async()=>{
 const {readStore}=await import('../src/seller/store.js')
 const legacy={products:[{id:'yogur',name:'Yogur',category:'Lácteos',sellerId:SELLER},{id:'queso',name:'Queso curado',category:'Lácteos',sellerId:SELLER,images:[]}],views:[],reviews:[],lastViews:{}}
 const previous=Object.getOwnPropertyDescriptor(globalThis,'localStorage')
 Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:key=>key==='gastromadrid.seller.v1'?JSON.stringify(legacy):null}})
 try {const migrated=readStore();assert.ok(migrated.archivedProducts.some(p=>p.id==='yogur'));assert.ok(!migrated.products.some(p=>p.id==='yogur'));assert.equal(migrated.products.find(p=>p.id==='queso').category,'Quesos')}
 finally {if(previous)Object.defineProperty(globalThis,'localStorage',previous);else delete globalThis.localStorage}
})
test('ventas e ingresos proceden solo de líneas completadas válidas',()=>{
 const data=createExample();const date=new Date().toISOString()
 data.transactions=[{orderId:'order-1',productId:'demo-queso',quantity:2,amount:37,status:'completed',date,demo:false},{orderId:'order-2',productId:'demo-queso',quantity:2,amount:37,status:'cancelled',date,demo:false},{orderId:'bad',productId:'demo-queso',quantity:-1,amount:-10,status:'completed',date,demo:false}]
 const stats=analyze(data,{source:'local'},SELLER)
 assert.equal(stats.units,2);assert.equal(stats.revenue,37);assert.equal(stats.views.length,0)
 assert.equal(analyze(data,{source:'demo'},SELLER).transactions.length,0)
})
