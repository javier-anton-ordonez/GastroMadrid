import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const products = [
  { name: 'Queso de cabra curado', maker: 'La Quesería de Miraflores', place: 'Sierra de Guadarrama', price: '8,90 €', unit: 'pieza · 350 g', category: 'Quesos', rating: '4,9', image: 'https://images.unsplash.com/photo-1626957341926-98752fc2ba90?auto=format&fit=crop&w=900&q=85', tone: 'cream' },
  { name: 'Lomo ibérico de bellota', maker: 'Embutidos El Robledal', place: 'Rascafría', price: '14,50 €', unit: 'sobre · 100 g', category: 'Charcutería', rating: '4,8', image: 'https://images.unsplash.com/photo-1608039755401-742074d8d6c5?auto=format&fit=crop&w=900&q=85', tone: 'red' },
  { name: 'Vino Garnacha Centenaria', maker: 'Bodega Las Moradas', place: 'San Martín de Valdeiglesias', price: '16,00 €', unit: 'botella · 750 ml', category: 'Vinos', rating: '4,9', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=85', tone: 'wine' },
  { name: 'Cerveza artesana IPA', maker: 'Cerveceros de Madrid', place: 'Comunidad de Madrid', price: '3,50 €', unit: 'botella · 330 ml', category: 'Cervezas', rating: '4,7', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=900&q=85', tone: 'orange' },
]

const categories = ['Todo', 'Cervezas', 'Vinos', 'Quesos', 'Charcutería']

function Pin() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.1 7-13a7 7 0 1 0-14 0c0 6.9 7 13 7 13Z"/><circle cx="12" cy="9" r="2.4"/></svg> }
function Cart() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.1 10.4a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.5L20.4 8H7"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg> }
function Search() { return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.7" cy="10.7" r="6.4"/><path d="m16 16 4.2 4.2"/></svg> }

function ProductCard({ product }) {
  return <article className="product-card">
    <div className={`product-image ${product.tone}`}><img src={product.image} alt={product.name} /><span>{product.category}</span><button aria-label={`Guardar ${product.name}`} className="heart">♡</button></div>
    <div className="product-info">
      <div className="maker-row"><p>{product.maker}</p><b>★ {product.rating}</b></div>
      <h3>{product.name}</h3>
      <p className="place"><Pin /> {product.place}</p>
      <div className="price-row"><strong>{product.price}</strong><span>{product.unit}</span><button aria-label={`Añadir ${product.name}`} className="add">+</button></div>
    </div>
  </article>
}

function App() {
  const [activeCategory, setActiveCategory] = React.useState('Todo')
  const [notice, setNotice] = React.useState('')
  const shownProducts = activeCategory === 'Todo' ? products : products.filter((item) => item.category === activeCategory)

  function showNotice(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2600)
  }

  return <>
    <header className="topbar">
      <a className="brand" href="#inicio" aria-label="GastroMadrid, inicio"><span>G</span> Gastro<span>Madrid</span></a>
      <nav aria-label="Navegación principal"><a href="#mercado">Mercado</a><a href="#productores">Productores</a><a href="#como-funciona">Cómo funciona</a></nav>
      <div className="header-actions"><button className="location" onClick={() => showNotice('Selecciona tu zona de entrega') }><Pin /> Comunidad de Madrid</button><button className="login" onClick={() => showNotice('Acceso de usuario próximamente')}>Entrar</button><button className="cart" onClick={() => showNotice('Tu cesta está vacía')}><Cart /><span>0</span></button></div>
    </header>

    <main id="inicio">
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">CERVEZAS · VINOS · QUESOS · CHARCUTERÍA</p>
          <h1>Madrid se<br/><em>saborea</em> aquí.</h1>
          <p className="hero-copy">Cervezas artesanas, vinos con carácter, quesos y charcutería de pequeños productores de Madrid. Descubre tu próximo maridaje.</p>
          <form className="search-box" onSubmit={(event) => { event.preventDefault(); showNotice('Busca por producto, productor o zona') }}>
            <Search /><input aria-label="Buscar productos" placeholder="Busca cervezas, vinos, quesos o charcutería" /><button>Buscar</button>
          </form>
          <div className="hero-labels"><span>+120 productores</span><span>Envíos en 24/48 h</span><span>100% madrileño</span></div>
        </div>
        <aside className="floating-card"><div className="mini-photo"></div><p>DESCUBRE LOS MARIDAJES</p><strong>Vinos y quesos</strong><span>Sabores para compartir</span><a href="#mercado">Explorar la selección →</a></aside>
      </section>

      <section className="category-strip" aria-label="Categorías de productos">
        {categories.map((category) => <button key={category} className={activeCategory === category ? 'selected' : ''} onClick={() => setActiveCategory(category)}>{category}</button>)}
      </section>

      <section className="market section" id="mercado">
        <div className="section-heading"><div><p className="eyebrow">EL MERCADO</p><h2>Tu aperitivo, <i>con origen.</i></h2></div><a href="#mercado" onClick={(e) => { e.preventDefault(); setActiveCategory('Todo') }}>Ver todos <span>→</span></a></div>
        <div className="market-layout">
          <aside className="filters"><div className="filter-title"><b>Filtrar productos</b><button onClick={() => setActiveCategory('Todo')}>Limpiar</button></div><details open><summary>Categoría <span>+</span></summary>{categories.slice(1).map(c => <label key={c}><input type="checkbox" checked={activeCategory === c} onChange={() => setActiveCategory(activeCategory === c ? 'Todo' : c)} />{c}</label>)}</details><details open><summary>Precio <span>+</span></summary><div className="range-label"><span>0 €</span><span>50 €+</span></div><input className="range" type="range" aria-label="Precio máximo" /></details><details open><summary>Entrega <span>+</span></summary><label><input type="checkbox" /> Recogida local</label><label><input type="checkbox" /> Envío a domicilio</label></details></aside>
          <div><div className="results-bar"><span>{shownProducts.length} productos seleccionados</span><button onClick={() => showNotice('Ordenando por recomendados')}>Ordenar: Recomendados ▾</button></div><div className="products">{shownProducts.map(product => <ProductCard key={product.name} product={product} />)}</div></div>
        </div>
      </section>

      <section className="origin section" id="productores"><div className="map-card"><div className="map-grid"></div><span className="map-pin one">●</span><span className="map-pin two">●</span><span className="map-pin three">●</span><span className="map-pin four">●</span><div className="map-city">MADRID</div></div><div className="origin-copy"><p className="eyebrow">DE AQUÍ, DE VERDAD</p><h2>Cada producto tiene <i>un lugar.</i></h2><p>Conoce a los cerveceros, bodegueros, queseros y artesanos de la charcutería que dan sabor a Madrid. Descubre su oficio y encuentra nuevas combinaciones para tu mesa.</p><button className="outline-button" onClick={() => showNotice('El mapa de productores estará disponible pronto')}>Explorar el mapa <span>→</span></button></div></section>

      <section className="subscription" id="como-funciona"><div><p className="eyebrow">CLUB GASTROMADRID</p><h2>Una caja con<br/><i>Madrid dentro.</i></h2><p>Cervezas, vinos, quesos y charcutería para descubrir nuevos sabores y maridajes de productores locales cada mes.</p><button onClick={() => showNotice('Próximamente podrás elegir tu suscripción')}>Quiero mi caja <span>→</span></button></div><div className="subscription-art"><div className="tag">Edición<br/>Octubre</div><div className="box-word">SABOREA<br/>LO CASTIZO</div><div className="orange"></div><div className="bottle"></div></div></section>

      <section className="seller-banner"><div><p className="eyebrow">¿ERES PRODUCTOR?</p><h2>Tu oficio merece<br/>ser descubierto.</h2></div><p>Da visibilidad a tus productos y llega a personas que valoran lo que haces.</p><button className="light-button" onClick={() => showNotice('El registro de proveedores estará disponible pronto')}>Quiero vender <span>→</span></button></section>
    </main>

    <footer><a className="brand" href="#inicio"><span>G</span> Gastro<span>Madrid</span></a><p>Viviendo Madrid a través del paladar.</p><div><a href="#mercado">Tienda</a><a href="#productores">Productores</a><a href="#como-funciona">Club</a></div><small>© 2026 GastroMadrid</small></footer>
    {notice && <div role="status" className="toast">{notice}</div>}
  </>
}

import React from 'react'
createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
