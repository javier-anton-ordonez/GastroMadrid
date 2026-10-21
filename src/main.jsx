import { useMemo, useState } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const products = [
  { name: 'Queso de cabra curado', maker: 'La Quesería de Miraflores', place: 'Sierra de Guadarrama', detail: 'Maduración 12 meses', category: 'Lácteos', image: 'https://images.unsplash.com/photo-1626957341926-98752fc2ba90?auto=format&fit=crop&w=900&q=85', tone: 'cream' },
  { name: 'Tomate rosa de temporada', maker: 'Huerta La Vega', place: 'Villa del Prado', detail: 'Cultivo regenerativo', category: 'Huerta', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=85', tone: 'red' },
  { name: 'Garnacha Centenaria', maker: 'Bodega Las Moradas', place: 'San Martín de Valdeiglesias', detail: 'DO Vinos de Madrid', category: 'Bebidas', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=85', tone: 'wine' },
  { name: 'Miel de la sierra', maker: 'Miel Antonio Simón', place: 'Torremocha de Jarama', detail: 'Cosecha de otoño', category: 'Despensa', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=85', tone: 'orange' },
]

const categories = ['Todo', 'Huerta', 'Lácteos', 'Despensa', 'Bebidas']

function Pin() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.1 7-13a7 7 0 1 0-14 0c0 6.9 7 13 7 13Z"/><circle cx="12" cy="9" r="2.4"/></svg> }
function Search() { return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.7" cy="10.7" r="6.4"/><path d="m16 16 4.2 4.2"/></svg> }
function Arrow() { return <span aria-hidden="true">↗</span> }

function ProductCard({ product, onConnect }) {
  return <article className="product-card">
    <div className={`product-image ${product.tone}`}><img src={product.image} alt={product.name} /><span>{product.category}</span><button aria-label={`Guardar ${product.name}`} className="heart">♡</button></div>
    <div className="product-info">
      <p className="maker">{product.maker}</p>
      <h3>{product.name}</h3>
      <p className="place"><Pin /> {product.place}</p>
      <div className="card-footer"><span>{product.detail}</span><button className="connect" onClick={() => onConnect(product)}>Contactar <Arrow /></button></div>
    </div>
  </article>
}

function App() {
  const [activeCategory, setActiveCategory] = useState('Todo')
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState('')
  const shownProducts = useMemo(() => products.filter((product) => {
    const categoryMatch = activeCategory === 'Todo' || product.category === activeCategory
    const searchMatch = `${product.name} ${product.maker} ${product.place}`.toLowerCase().includes(search.toLowerCase())
    return categoryMatch && searchMatch
  }), [activeCategory, search])

  function showNotice(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }

  return <>
    <header className="topbar">
      <a className="brand" href="#inicio" aria-label="GastroMadrid, inicio"><span>G</span> Gastro<span>Madrid</span></a>
      <nav aria-label="Navegación principal"><a href="#explorar">Explorar</a><a href="#productores">Productores</a><a href="#como-funciona">Cómo funciona</a></nav>
      <div className="header-actions"><button className="location" onClick={() => showNotice('Estamos buscando productores en la Comunidad de Madrid')}><Pin /> Comunidad de Madrid</button><button className="login" onClick={() => showNotice('El acceso para hostelería estará disponible pronto')}>Soy hostelero <Arrow /></button></div>
    </header>

    <main id="inicio">
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">PRODUCTO LOCAL · COMUNIDAD DE MADRID</p>
          <h1>El ingrediente<br/><em>que buscas,</em><br/>está aquí.</h1>
          <p className="hero-copy">Conectamos a hosteleros con productores madrileños para que cada plato tenga una historia de proximidad.</p>
          <form className="search-box" onSubmit={(event) => { event.preventDefault(); document.querySelector('#explorar')?.scrollIntoView({ behavior: 'smooth' }) }}>
            <Search /><input aria-label="Buscar productos o necesidades" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Busca un producto, una zona o una necesidad..." /><button>Encontrar</button>
          </form>
          <div className="hero-labels"><span>+120 productores</span><span>Producto de temporada</span><span>Trato directo</span></div>
        </div>
        <aside className="floating-card"><div className="mini-photo"></div><p>Productor destacado</p><strong>Miel Antonio Simón</strong><span>Torremocha de Jarama</span><a href="#productores">Ver productor <Arrow /></a></aside>
      </section>

      <section className="match-band"><div><p className="eyebrow">EL MATCH MADRILEÑO</p><h2>Cuéntanos qué necesitas.<br/><i>Nosotros buscamos quién lo hace.</i></h2></div><button className="dark-button" onClick={() => showNotice('Cuéntanos tu necesidad y te pondremos en contacto')}>Publicar una necesidad <Arrow /></button></section>

      <section className="market section" id="explorar">
        <div className="section-heading"><div><p className="eyebrow">EXPLORA EL CATÁLOGO</p><h2>Ingredientes con <i>origen.</i></h2><p className="section-intro">Descubre proveedores locales para tu carta, tu hotel o tu próximo evento.</p></div><a href="#productores">Ver productores <Arrow /></a></div>
        <div className="category-strip" aria-label="Categorías de productos">{categories.map((category) => <button key={category} className={activeCategory === category ? 'selected' : ''} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
        <div className="results-bar"><span>{shownProducts.length} resultados para tu negocio</span><span className="availability">● Productores disponibles esta semana</span></div>
        <div className="products">{shownProducts.map(product => <ProductCard key={product.name} product={product} onConnect={(item) => showNotice(`Te conectaremos con ${item.maker}`)} />)}</div>
      </section>

      <section className="origin section" id="productores"><div className="map-card"><div className="map-grid"></div><span className="map-pin one">●</span><span className="map-pin two">●</span><span className="map-pin three">●</span><span className="map-pin four">●</span><div className="map-city">MADRID</div></div><div className="origin-copy"><p className="eyebrow">DE AQUÍ, DE VERDAD</p><h2>Una red que empieza<br/><i>en el territorio.</i></h2><p>Del campo a la mesa, sin intermediarios innecesarios. Conoce quién produce, dónde está y qué puede aportar a tu negocio.</p><button className="outline-button" onClick={() => showNotice('El mapa de productores estará disponible pronto')}>Explorar el mapa <Arrow /></button></div></section>

      <section className="how section" id="como-funciona"><div><p className="eyebrow">CÓMO FUNCIONA</p><h2>Tu próxima<br/><i>gran colaboración.</i></h2></div><div className="steps"><div><b>01</b><h3>Explica lo que buscas</h3><p>Indica el producto, volumen o tipo de proveedor que necesita tu negocio.</p></div><div><b>02</b><h3>Descubre tu match</h3><p>Te mostramos productores de la Comunidad de Madrid que encajan contigo.</p></div><div><b>03</b><h3>Hablad directamente</h3><p>Contacta sin intermediarios y construye una relación a largo plazo.</p></div></div></section>

      <section className="seller-banner"><div><p className="eyebrow">¿ERES PRODUCTOR?</p><h2>Tu producto merece<br/>estar en <i>más mesas.</i></h2></div><p>Haz visible tu catálogo para los profesionales que buscan exactamente lo que tú haces.</p><button className="light-button" onClick={() => showNotice('Pronto podrás registrar tu proyecto')}>Quiero aparecer <Arrow /></button></section>
    </main>

    <footer><a className="brand" href="#inicio"><span>G</span> Gastro<span>Madrid</span></a><p>Viviendo Madrid a través del paladar.</p><div><a href="#explorar">Explorar</a><a href="#productores">Productores</a><a href="#como-funciona">Cómo funciona</a></div><small>© 2026 GastroMadrid</small></footer>
    {notice && <div role="status" className="toast">{notice}</div>}
  </>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
