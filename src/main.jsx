import { useMemo, useState } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const products = [
  { name: 'Queso de cabra curado', maker: 'La Quesería de Miraflores', place: 'Sierra de Guadarrama', detail: 'Lácteos', image: 'https://images.unsplash.com/photo-1626957341926-98752fc2ba90?auto=format&fit=crop&w=900&q=85' },
  { name: 'Tomate rosa de temporada', maker: 'Huerta La Vega', place: 'Villa del Prado', detail: 'Huerta', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=85' },
  { name: 'Garnacha Centenaria', maker: 'Bodega Las Moradas', place: 'San Martín de Valdeiglesias', detail: 'Bebidas', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=85' },
  { name: 'Miel de la sierra', maker: 'Miel Antonio Simón', place: 'Torremocha de Jarama', detail: 'Despensa', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=85' },
]

const categories = ['Todo', 'Huerta', 'Lácteos', 'Despensa', 'Bebidas']

function Pin() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.1 7-13a7 7 0 1 0-14 0c0 6.9 7 13 7 13Z" /><circle cx="12" cy="9" r="2.4" /></svg>
}

function Search() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.7" cy="10.7" r="6.4" /><path d="m16 16 4.2 4.2" /></svg>
}

function ProductCard({ product, onContact }) {
  return <article className="product-card">
    <img src={product.image} alt={product.name} />
    <div className="product-info">
      <span className="tag">{product.detail}</span>
      <h3>{product.name}</h3>
      <p className="maker">{product.maker}</p>
      <p className="place"><Pin /> {product.place}</p>
      <button className="text-button" onClick={() => onContact(product)}>Contactar <span>→</span></button>
    </div>
  </article>
}

function App() {
  const [activeCategory, setActiveCategory] = useState('Todo')
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState('')
  const [role, setRole] = useState('comprador')

  const shownProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = activeCategory === 'Todo' || product.detail === activeCategory
    const query = `${product.name} ${product.maker} ${product.place}`.toLowerCase()
    return matchesCategory && query.includes(search.toLowerCase())
  }), [activeCategory, search])

  function showNotice(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }

  return <>
    <header className="topbar">
      <a className="brand" href="#inicio" aria-label="GastroMadrid, inicio"><span>G</span> Gastro<span>Madrid</span><small>/ LOCAL NETWORK</small></a>
      <nav aria-label="Navegación principal">
        <a href="#explorar">Explorar</a>
        <a href="#como-funciona">Cómo funciona</a>
      </nav>
      <button className="outline-button header-button" onClick={() => showNotice('El registro estará disponible pronto')}>Entrar / registrarme</button>
    </header>

    <main id="inicio">
      <section className="hero">
        <div className="hero-kicker"><span>01</span><p className="eyebrow">COMUNIDAD DE MADRID</p></div>
        <p className="hero-location">MADRID / LOCAL FOOD NETWORK</p>
        <h1>Viviendo Madrid<br /><em>a través del paladar.</em></h1>
        <p className="hero-copy">Descubre pequeñas empresas de Madrid y contacta directamente con quienes hacen lo que buscas.</p>
        <div className="hero-audience">
          <p className="audience-label">UNA PLATAFORMA PARA DOS LADOS</p>
          <div className="role-switcher" aria-label="Selecciona tu perfil">
            <button className={role === 'comprador' ? 'active' : ''} onClick={() => setRole('comprador')}><strong>Soy comprador</strong><span>Quiero encontrar productos y empresas locales.</span></button>
            <button className={role === 'empresa' ? 'active' : ''} onClick={() => setRole('empresa')}><strong>Tengo una empresa</strong><span>Quiero mostrar lo que hago y encontrar clientes.</span></button>
          </div>
        </div>
        <form className="search-box" onSubmit={(event) => { event.preventDefault(); document.querySelector('#explorar')?.scrollIntoView({ behavior: 'smooth' }) }}>
          <Search />
          <input aria-label="Buscar productos, empresas o zonas" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Busca productos, empresas o municipios" />
          <button>Buscar</button>
        </form>
        <div className="hero-image"><img src={products[1].image} alt="Tomates de un productor local de Madrid" /><span>Producto local, cerca de ti</span><b>02</b></div>
      </section>

      <section className="catalog section" id="explorar">
        <div className="section-heading">
          <div><div className="section-index"><span>02</span><p className="eyebrow">DIRECTORIO LOCAL</p></div><h2>Explora la comunidad.</h2></div>
          <span className="result-count">{shownProducts.length} resultados</span>
        </div>
        <div className="category-list" aria-label="Filtrar por categoría">
          {categories.map((category) => <button key={category} className={activeCategory === category ? 'active' : ''} onClick={() => setActiveCategory(category)}>{category}</button>)}
        </div>
        {shownProducts.length > 0 ? <div className="products">{shownProducts.map((product) => <ProductCard key={product.name} product={product} onContact={(item) => showNotice(`Te pondremos en contacto con ${item.maker}`)} />)}</div> : <p className="empty-state">No hemos encontrado resultados. Prueba con otra búsqueda.</p>}
      </section>

      <section className="how section" id="como-funciona">
        <div><p className="eyebrow">CÓMO FUNCIONA</p><h2>Local, sencillo y directo.</h2></div>
        <div className="steps">
          <div><b>01</b><h3>Busca</h3><p>Encuentra productos y empresas de tu zona.</p></div>
          <div><b>02</b><h3>Descubre</h3><p>Conoce su historia, ubicación y oferta.</p></div>
          <div><b>03</b><h3>Contacta</h3><p>Habla directamente y llega a un acuerdo.</p></div>
        </div>
      </section>

      <section className="join section">
        <div><p className="eyebrow">PARA EMPRESAS LOCALES</p><h2>Haz visible<br /><em>lo que haces.</em></h2></div>
        <div><p>GastroMadrid funcionará con un modelo freemium para que las pequeñas empresas puedan empezar a conectar con compradores de la Comunidad de Madrid.</p><button className="primary-button" onClick={() => showNotice('El registro de empresas estará disponible pronto')}>Registrar mi empresa <span>→</span></button></div>
      </section>
    </main>

    <footer><a className="brand" href="#inicio"><span>G</span> Gastro<span>Madrid</span></a><p>Viviendo Madrid a través del paladar.</p><small>© 2026 GastroMadrid</small></footer>
    {notice && <div role="status" className="toast">{notice}</div>}
  </>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
