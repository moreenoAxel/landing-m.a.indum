const catalogo = document.getElementById('catalogo');
const carrito = [];
let productosGlobal = [];
let categoriaSeleccionada = 'Todas';
let paginaActual = 1;
const productosPorPagina = 12;

const filtroSelect = document.getElementById('filtro-categoria');
const paginacion = document.getElementById('paginacion');

async function cargarJSONDesdeArchivo() {
  try {
    const res = await fetch('productos.json');
    productosGlobal = await res.json();
    poblarCategorias();
    renderizarProductos();
  } catch (error) {
    console.error('Error cargando JSON:', error);
  }
}

function poblarCategorias() {
  const categorias = [...new Set(productosGlobal.map(p => p.CATEGORIA))];
  filtroSelect.innerHTML = '<option value="Todas">Todas</option>';
  categorias.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filtroSelect.appendChild(option);
  });
}

function renderizarProductos() {
  catalogo.innerHTML = '';

  const filtrados = categoriaSeleccionada === 'Todas'
    ? productosGlobal
    : productosGlobal.filter(p => p.CATEGORIA === categoriaSeleccionada);

  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPagina = filtrados.slice(inicio, fin);

  productosPagina.forEach(producto => {
    const div = document.createElement('div');
    div.className = 'border p-4 rounded shadow text-center';

    let colores = [];
    if (producto.COLORES?.includes('|')) {
      colores = producto.COLORES.split('|').map(c => c.trim());
    } else if (producto.COLORES?.includes(',')) {
      colores = producto.COLORES.split(',').map(c => c.trim());
    } else if (producto.COLORES) {
      colores = [producto.COLORES.trim()];
    }

    div.innerHTML = `
      <img src="${producto.IMAGEN}" alt="${producto.NOMBRE}" class="w-full h-48 object-cover rounded mb-2" loading="lazy">
      <h3 class="font-bold">${producto.NOMBRE}</h3>
      <p class="text-sm text-gray-500 mb-1">${producto.CATEGORIA}</p>
      <p class="text-sm mb-1">Colores:</p>
      <select class="border rounded px-2 py-1 mb-2">
        ${colores.map(c => `<option value="${c}">${c}</option>`).join('')}
      </select>
      <p class="font-semibold mb-2">$${producto.PRECIO}</p>
      <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded" data-nombre="${producto.NOMBRE}" data-precio="${producto.PRECIO}">Agregar</button>
    `;
    catalogo.appendChild(div);
  });

  renderizarPaginacion(filtrados.length);
  activarBotones();
}

function renderizarPaginacion(totalProductos) {
  paginacion.innerHTML = '';
  const totalPaginas = Math.ceil(totalProductos / productosPorPagina);

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = `px-3 py-1 rounded ${i === paginaActual ? 'bg-red-600 text-white' : 'bg-gray-200'}`;
    btn.addEventListener('click', () => {
      paginaActual = i;
      renderizarProductos();
    });
    paginacion.appendChild(btn);
  }
}

function activarBotones() {
  const botones = document.querySelectorAll('#catalogo button[data-nombre]');
  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      const nombre = boton.dataset.nombre;
      const precio = parseFloat(boton.dataset.precio);
      carrito.push({ nombre, precio });
      guardarCarrito();
      renderCarritoModal();
      actualizarBurbujaCarrito();
    });
  });
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function renderCarritoModal() {
  const lista = document.getElementById('lista-carrito-modal');
  const totalEl = document.getElementById('total-modal');
  lista.innerHTML = '';
  let total = 0;

  carrito.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center';
    li.innerHTML = `
      ${item.nombre} - $${item.precio}
      <button onclick="eliminarDelCarrito(${i})" class="text-red-600 ml-2">🗑️</button>
    `;
    lista.appendChild(li);
    total += item.precio;
  });

  totalEl.textContent = total;
  const mensaje = carrito.map(p => `• ${p.nombre} - $${p.precio}`).join('%0A');
  const enlace = `https://wa.me/549XXXXXXXXXX?text=Hola! Quiero comprar:%0A${mensaje}%0ATotal: $${total}`;
  document.getElementById('enlace-wpp').href = enlace;
}

function actualizarBurbujaCarrito() {
  const burbuja = document.getElementById('contador-carrito');
  const burbuja_movil = document.getElementById('contador-carrito-movil');
  burbuja.textContent = carrito.length;
  burbuja.style.display = carrito.length > 0 ? 'inline-block' : 'none';
  burbuja_movil.textContent = carrito.length;
  burbuja_movil.style.display = carrito.length > 0 ? 'inline-block' : 'none';
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  renderCarritoModal();
  actualizarBurbujaCarrito();
}

document.addEventListener('DOMContentLoaded', () => {
  // Recuperar carrito guardado si existe
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito.push(...JSON.parse(carritoGuardado));
  }
  cargarJSONDesdeArchivo();

  filtroSelect.addEventListener('change', () => {
    categoriaSeleccionada = filtroSelect.value;
    paginaActual = 1;
    renderizarProductos();
  });

  // Abrir modal carrito
  const abrirCarritoBtn = document.getElementById('abrir-carrito');
  const abrirCarritoMovilBtn = document.getElementById('abrir-carrito-movil');
  const modalCarrito = document.getElementById('modal-carrito');
  const cerrarCarritoBtn = document.getElementById('cerrar-carrito');

  if (abrirCarritoBtn) {
    abrirCarritoBtn.addEventListener('click', e => {
      e.preventDefault();
      modalCarrito.style.display = 'block';
      renderCarritoModal();
    });
  }
  if (abrirCarritoMovilBtn) {
    abrirCarritoMovilBtn.addEventListener('click', e => {
      e.preventDefault();
      modalCarrito.style.display = 'block';
      renderCarritoModal();
    });
  }
  if (cerrarCarritoBtn) {
    cerrarCarritoBtn.addEventListener('click', () => {
      modalCarrito.style.display = 'none';
    });
  }
  window.addEventListener('click', e => {
    if (e.target === modalCarrito) {
      modalCarrito.style.display = 'none';
    }
  });

  actualizarBurbujaCarrito();

  // Código adicional para menú móvil y scroll effect (sin cambios)
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if(menuToggle && mobileMenu){
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  const navbar = document.getElementById('navbar');
  if(navbar){
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('py-2');
        navbar.classList.remove('py-4');
        navbar.classList.add('shadow-md');
      } else {
        navbar.classList.remove('py-2');
        navbar.classList.add('py-4');
        navbar.classList.remove('shadow-md');
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();

      const targetId = anchor.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
});
