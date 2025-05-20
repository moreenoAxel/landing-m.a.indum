const catalogo = document.getElementById('catalogo');
const filtro = document.getElementById('filtro-categoria');
const paginacion = document.getElementById('paginacion');
const carrito = [];

let productosCargados = [];
let paginaActual = 1;
const productosPorPagina = 12;

// Cargar productos desde JSON
async function cargarProductos() {
  const res = await fetch('csvjson.json');
  const productos = await res.json();
  productosCargados = productos;

  // Filtro de categoría dinámico
  const categorias = [...new Set(productos.map(p => p.CATEGORIA))];
  categorias.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filtro.appendChild(option);
  });

  filtro.addEventListener('change', () => {
    mostrarProductosFiltrados(filtro.value);
  });

  mostrarProductosFiltrados(); // Inicial
}

// Filtrar y mostrar desde página 1
function mostrarProductosFiltrados(categoria = "todas") {
  const filtrados = categoria === "todas"
    ? productosCargados
    : productosCargados.filter(p => p.CATEGORIA === categoria);

  mostrarPagina(filtrados, 1);
  renderPaginacion(filtrados);
}

// Mostrar productos según la página actual
function mostrarPagina(productos, pagina) {
  catalogo.innerHTML = '';
  paginaActual = pagina;

  const inicio = (pagina - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPagina = productos.slice(inicio, fin);

  productosPagina.forEach(producto => {
    const div = document.createElement('div');
    div.className = 'border p-4 rounded shadow text-center';
    div.innerHTML = `
      <img src="${producto.IMAGEN}" alt="${producto.NOMBRE}" class="w-full h-40 object-cover rounded mb-2">
      <h2 class="font-semibold">${producto.NOMBRE}</h2>
      <p class="text-sm text-gray-500">${producto.CATEGORIA}</p>
      <p class="text-sm text-gray-500">Color:</p>
      <select onchange="seleccionarColor('${producto.NOMBRE}', this.value)" class="mt-1 mb-2 border rounded px-2 py-1 text-sm">
        ${producto.COLORES.split(',').map(color => `<option value="${color.trim()}">${color.trim()}</option>`).join('')}
      </select>
      <p class="font-bold">$${producto.PRECIO}</p>
      <button onclick="agregarAlCarrito('${producto.NOMBRE}', ${producto.PRECIO}, this.previousElementSibling.value)" class="mt-2 bg-pink-600 text-white py-1 px-3 rounded hover:bg-pink-700">Agregar al carrito</button>
    `;
    catalogo.appendChild(div);
  });
}

// Render paginación
function renderPaginacion(productos) {
  paginacion.innerHTML = '';
  const totalPaginas = Math.ceil(productos.length / productosPorPagina);

  if (totalPaginas <= 1) return;

  if (paginaActual > 1) {
    const prev = crearBoton("Anterior", () => mostrarPagina(productos, paginaActual - 1));
    paginacion.appendChild(prev);
  }

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = crearBoton(i, () => mostrarPagina(productos, i));
    btn.className += i === paginaActual ? ' bg-pink-600 text-white' : '';
    paginacion.appendChild(btn);
  }

  if (paginaActual < totalPaginas) {
    const next = crearBoton("Siguiente", () => mostrarPagina(productos, paginaActual + 1));
    paginacion.appendChild(next);
  }
}

function crearBoton(text, handler) {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.className = 'px-3 py-1 border rounded hover:bg-gray-200';
  btn.onclick = handler;
  return btn;
}

// Agregar al carrito
function agregarAlCarrito(nombre, precio, color) {
  carrito.push({ nombre, precio, color });
  renderCarritoModal();
  actualizarBurbujaCarrito();
}

// Mostrar carrito
function renderCarritoModal() {
  const lista = document.getElementById('lista-carrito-modal');
  const totalEl = document.getElementById('total-modal');
  lista.innerHTML = '';
  let total = 0;

  carrito.forEach((producto, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${producto.nombre} - ${producto.color} - $${producto.precio}
      <button class="text-red-500 ml-2" onclick="eliminarDelCarrito(${index})">🗑️</button>
    `;
    lista.appendChild(li);
    total += producto.precio;
  });

  totalEl.textContent = total;

  const mensaje = carrito.map(p => `• ${p.nombre} (${p.color}) - $${p.precio}`).join('%0A');
  const enlace = `https://wa.me/549XXXXXXXXXX?text=Hola! Quiero comprar:%0A${mensaje}%0ATotal: $${total}`;
  document.getElementById('enlace-wpp').href = enlace;
}

// Eliminar producto del carrito
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  renderCarritoModal();
  actualizarBurbujaCarrito();
}

// Contador del ícono de carrito
function actualizarBurbujaCarrito() {
  const burbuja = document.getElementById('contador-carrito');
  burbuja.textContent = carrito.length;
  burbuja.style.display = carrito.length > 0 ? 'inline-block' : 'none';
}

// Modal
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();

  const abrir = document.getElementById('abrir-carrito');
  const modal = document.getElementById('modal-carrito');
  const cerrar = document.getElementById('cerrar-carrito');

  abrir.addEventListener('click', (e) => {
    e.preventDefault();
    renderCarritoModal();
    modal.style.display = 'block';
  });

  cerrar.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });

  actualizarBurbujaCarrito();
});
