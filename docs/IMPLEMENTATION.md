# GastroMadrid: estado de la implementación

## Arquitectura y ejecución

React + Vite, módulos ES y CSS propio. Se conserva la identidad editorial del proyecto (burdeos, crema y naranja), la portada y sus secciones por anclas. No hay dependencias nuevas de ejecución: los gráficos son SVG accesibles con selección, detalle y tabla de valores. La cartografía está empaquetada con la aplicación, sin servicios externos en tiempo de ejecución.

- `npm run dev`: desarrollo.
- `npm run build`: compilación de producción.
- `node --test tests/analytics.test.js`: pruebas de lógica de analítica, privacidad y propiedad.

Rutas: `#inicio`, `#explorar`, `#productores`, `#como-funciona`, `#producto/<id>`, `#vendedor`, `#inteligencia` (acceso bloqueado), `#demo-inteligencia` (demostración pública exclusivamente sintética).

## Operativo en este navegador

Catálogo limitado a Quesos, Vinos y Charcutería y embutidos. Búsqueda explícita con sugerencias, filtros de precio/origen/productor/categoría y ordenación. Fichas, relacionados, perfiles de ejemplo y productos populares según actividad local consentida. No hay directorio verificado, compra ni envío de mensajes; los botones de contacto indican esta limitación.

Gestión completa del vendedor de demostración: creación, imágenes, origen, productor, disponibilidad, stock opcional, edición, publicación y borrado confirmado. Validaciones HTML y de la capa de datos; errores de cuota local visibles. Cuatro imágenes JPG/PNG/WebP, hasta 750 KB por imagen; se almacenan como data URLs. La cuota de localStorage puede agotarse antes de esos máximos. El almacenamiento de imágenes debe sustituirse en producción.

Dashboard vendedor con fuente local o sintética, nunca combinadas; filtros de fechas, producto y categoría. KPIs, visitas por producto, ranking, evolución diaria/semanal/mensual, valoración media/distribución y reseñas filtrables. Ventas, ingresos y rankings de ventas se muestran sin datos cuando no hay transacciones.

Demostración administrativa: resumen, comparación de categorías, productos populares/bien valorados, búsquedas y búsquedas sin resultado, evolución, crecimiento entre dos mitades del periodo y oportunidades explicables por categoría. No se calculan usuarios únicos ni conversiones. El ranking de productos encontrados en búsquedas mide apariciones en resultados, no intención individual de compra.

Mapa interactivo de los 21 distritos: geometrías oficiales del [Ayuntamiento de Madrid](https://datos.madrid.es/dataset/900012-0-limites-administrativos-mapas/downloads), descargadas el 21/10/2026 desde el [TopoJSON oficial](https://geoportal.madrid.es/fsdescargas/IDEAM_WBGEOPORTAL/LIMITES_ADMINISTRATIVOS/Distritos/TopoJSON/Distritos.json). Las coordenadas se han proyectado y redondeado para generar los paths SVG en `districts.json`; no usar para mediciones. [Condiciones de reutilización del Ayuntamiento](https://datos.madrid.es/pages/condiciones-generales-ayuntamiento-de-madrid). Se conserva la atribución en el mapa. Gasto, ticket, compras, comparación, categoría principal y evolución requieren transacciones con geografía válida y al menos diez observaciones distintas por zona; no se simula actividad territorial.

## Almacenamiento y migración

`src/seller/store.js` es el adaptador provisional. La clave `gastromadrid.platform.v2` contiene el estado local. La clave antigua `gastromadrid.seller.v1` no se borra. En la primera carga, los productos antiguos Lácteos con «queso» en su nombre pasan a Quesos y las Bebidas con «vino», «garnacha» o «tempranillo» a Vinos; las categorías ajenas al nuevo alcance se conservan en `archivedProducts` y no se publican. Los antiguos yogures, otras bebidas y los productos de categoría no reconocida se archivan sin publicarlos. Revisar la migración antes de utilizar datos comerciales reales. Se conservan las visitas y reseñas de los productos migrados compatibles. Un JSON local ilegible muestra un error y no se sobrescribe automáticamente.

Las fixtures tienen `demo: true`; los eventos nuevos tienen `demo: false`. Los productos creados localmente no constituyen ofertas verificadas. El panel público de administración recibe un estado sintético recién creado, jamás el almacenamiento del usuario. Las estadísticas iniciales no son evidencia del mercado de Madrid.

## Analítica y privacidad

Consentimiento pendiente por defecto, con botones equivalentes de aceptar/rechazar. La gestión del catálogo funciona sin aceptar analítica. Se puede cambiar la elección y borrar los eventos locales desde el pie. Se excluyen consultas con aspecto de email, URL o cadenas de cinco o más cifras; es una reducción de riesgo, no un detector completo de información personal. No se guardan IP, cookies de seguimiento, geolocalización, nombres de compradores ni identificadores persistentes de personas.

Las búsquedas se registran al confirmar Buscar, no con cada tecla. Los clics y las vistas son eventos distintos. Las visitas se registran al entrar en una ficha, solo con consentimiento, con una ventana de 30 minutos por producto y navegador que resiste StrictMode y recargas. No existe deduplicación transaccional entre varias pestañas. Se requiere un servicio de ingestión para fiabilidad de producción. Las imágenes/fuentes externas existentes pueden generar solicitudes a terceros; revisar su alojamiento antes de publicar.

Preparación técnica para privacidad no equivale a certificación de cumplimiento normativo. Antes de producción hay que fijar base jurídica, retención, información al usuario, derechos, tratamiento de proveedores y umbrales con la organización responsable. Ninguna ubicación se obtiene automáticamente; el umbral de diez observaciones es un valor técnico provisional y no una garantía de anonimato.

## Modelo para futura API y base de datos

| Entidad | Campos y relaciones previstos |
| --- | --- |
| User / Membership | id, rol (comprador/vendedor/admin), producerId; únicamente servidor/autenticación |
| Producer | id, nombre público, origen, candidatos verificados y contactos con autorización |
| Product | id, sellerId, nombre, descripción, category (enum cerrado), price, images, maker, place, stock nullable, available, visible |
| View / Click | id, productId, date ISO, demo; nunca equivalen a usuarios únicos |
| Search | id, term normalizado/minimizado, category nullable, productIds, resultCount, date, demo |
| Review | id, productId, stars entero 1–5, texto moderado, date, demo; cliente verificado en servidor |
| Transaction line | id, orderId, productId, quantity, amount (EUR para la línea), status=completed, date, demo |
| Geografía opcional | district validado contra el catálogo oficial, geoBasis=consented-approximate y observationId opaco validado en servidor; solo para umbrales, nunca expuesto en UI |
| Consent | decisión y versión del aviso, con fecha y retención definidas en backend |

El modelo de líneas de transacción debe evitar duplicaciones de orderId/productId y representar importes netos con una política clara de devoluciones. `geoStats` calcula compras como pedidos distintos y exige observaciones diferentes. En producción los agregados y la supresión se calculan en servidor; no se entregan filas individuales al navegador.

## Seguridad e integraciones pendientes

No hay un panel privado real: no se ha inventado autenticación local. `#vendedor` es un sandbox de un único vendedor de ejemplo. Las operaciones comprueban `sellerId`, pero el usuario puede manipular su propio localStorage. `#inteligencia` deniega el acceso mientras no haya una sesión validada por servidor. No habilitarlo con banderas en localStorage ni parámetros de URL.

Para producción: autenticación, roles y autorización por vendedor en cada endpoint; base de datos con aislamiento de filas; almacenamiento seguro de imágenes; moderación de productos/reseñas; directorio real; candidatos de captación; pedidos/pagos si se eligen; ingestión/retención analítica; ubicación aproximada con base válida; datos suficientes para indicadores territoriales, atribución y conversión. La UI administrativa debe conectarse a endpoints de agregados autorizados. No se exponen datos privados mediante la demostración.

Oportunidades: demanda hasta 40 puntos (2 por búsqueda), búsquedas sin resultado hasta 30, oferta escasa hasta 20 (20−5 por producto disponible), crecimiento hasta 10. Sin búsquedas: cero puntos. Alta ≥65, media ≥35, baja el resto. Cada fila explica la suma. No se inventan productores, contactos, ventas, zonas de consumo ni una subvención concedida.

## Validación realizada

- `npm run build`: correcto.
- `node --test tests/analytics.test.js`: nueve pruebas correctas.
- `npm run dev -- --host 127.0.0.1`: Vite operativo; en la sesión de verificación se utilizó el puerto 5174 porque 5173 estaba ocupado.
- Chrome con Playwright instalado únicamente en una carpeta temporal: navegación, creación/edición/ocultación/borrado con cancelación y confirmación, persistencia de imagen, stock opcional, consentimiento, visita única tras recarga inmediata, búsqueda sin resultados, filtros por fuente/categoría, bloqueo administrativo, 21 distritos seleccionables, tabla de oportunidades y error de JSON local sin sobrescritura.
- Capturas revisadas de escritorio y móvil de 390 px; corregido el ancho mínimo del panel para evitar desbordamiento horizontal. Sin errores de ejecución de React durante el recorrido principal.

Se repararon los enlaces rotos de los ejecutables Vite/Rolldown/Nanoid en `node_modules/.bin` para permitir ejecutar los scripts existentes. No se añadieron dependencias al manifiesto del proyecto.
