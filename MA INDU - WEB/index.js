// carrito-index.js - Funcionalidad del carrito para la página principal

// Variable global para el carrito
let carrito = [];

// Función para cargar el carrito desde localStorage
function cargarCarrito() {
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
  }
  actualizarBurbujaCarrito();
}

// Función para guardar el carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para agregar producto al carrito
function agregarAlCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  guardarCarrito();
  actualizarBurbujaCarrito();
  
  // Mostrar feedback visual
  mostrarNotificacion(`${nombre} agregado al carrito`);
}

// Función para mostrar notificación temporal
function mostrarNotificacion(mensaje) {
  // Crear elemento de notificación
  const notificacion = document.createElement('div');
  notificacion.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 transition-all duration-300';
  notificacion.textContent = mensaje;
  
  document.body.appendChild(notificacion);
  
  // Remover después de 3 segundos
  setTimeout(() => {
    notificacion.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(notificacion);
    }, 300);
  }, 3000);
}

// Función para actualizar la burbuja del contador del carrito
function actualizarBurbujaCarrito() {
  const burbuja = document.getElementById('contador-carrito');
  if (burbuja) {
    burbuja.textContent = carrito.length;
    burbuja.style.display = carrito.length > 0 ? 'inline-block' : 'none';
  }
}

// Función para renderizar el carrito en el modal
function renderCarritoModal() {
  const lista = document.getElementById('lista-carrito-modal');
  const totalEl = document.getElementById('total-modal');
  
  if (!lista || !totalEl) return;
  
  lista.innerHTML = '';
  let total = 0;

  if (carrito.length === 0) {
    lista.innerHTML = '<li class="text-gray-500 text-center">Tu carrito está vacío</li>';
    totalEl.textContent = '0';
    document.getElementById('enlace-wpp').href = '#';
    return;
  }

  carrito.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center py-2 border-b border-gray-200';
    li.innerHTML = `
      <div class="flex-1">
        <span class="font-medium">${item.nombre}</span>
        <span class="text-gray-600 block text-sm">$${item.precio}</span>
      </div>
      <button onclick="eliminarDelCarrito(${i})" class="text-red-600 hover:text-red-800 ml-2 p-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    `;
    lista.appendChild(li);
    total += item.precio;
  });

  totalEl.textContent = total.toFixed(2);
  
  // Generar enlace de WhatsApp
  const mensaje = carrito.map(p => `• ${p.nombre} - $${p.precio}`).join('%0A');
  const enlace = `https://wa.me/5492344420146?text=¡Hola! Quiero hacer un pedido:%0A%0A${mensaje}%0A%0ATotal: $${total.toFixed(2)}%0A%0A¡Gracias!`;
  document.getElementById('enlace-wpp').href = enlace;
}

// Función para eliminar producto del carrito
function eliminarDelCarrito(index) {
  const productoEliminado = carrito[index];
  carrito.splice(index, 1);
  guardarCarrito();
  renderCarritoModal();
  actualizarBurbujaCarrito();
  
  mostrarNotificacion(`${productoEliminado.nombre} eliminado del carrito`);
}

// Función para vaciar todo el carrito
function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  renderCarritoModal();
  actualizarBurbujaCarrito();
  mostrarNotificacion('Carrito vaciado');
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Cargar carrito guardado
  cargarCarrito();
  
  // Configurar botones "Ver detalle" en productos destacados
  configurarBotonesProductos();
  
  // Configurar modal del carrito
  configurarModalCarrito();
});

// Función para configurar los botones de los productos destacados
function configurarBotonesProductos() {
  // Productos destacados con sus precios (puedes ajustar estos datos)
  const productosDestacados = [
    { nombre: 'REMERON MOON', precio: 15000, selector: 'li:nth-child(1) a' },
    { nombre: 'BUZO DUKI', precio: 22000, selector: 'li:nth-child(2) a' },
    { nombre: 'MUSCULOSA WORLD TOUR', precio: 12000, selector: 'li:nth-child(3) a' },
    { nombre: 'PUPERA LOS ANGELES', precio: 13500, selector: 'li:nth-child(4) a' }
  ];
  
  productosDestacados.forEach(producto => {
    const enlace = document.querySelector(`#productos-destacados ${producto.selector}`);
    if (enlace) {
      // Cambiar el texto del enlace
      enlace.textContent = 'Agregar al carrito';
      enlace.className = 'inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors';
      
      // Agregar evento click
      enlace.addEventListener('click', function(e) {
        e.preventDefault();
        agregarAlCarrito(producto.nombre, producto.precio);
      });
    }
  });
}

// Función para configurar el modal del carrito
function configurarModalCarrito() {
  // Botón para abrir el carrito
  const abrirCarrito = document.getElementById('abrir-carrito');
  if (abrirCarrito) {
    abrirCarrito.addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('modal-carrito').style.display = 'block';
      renderCarritoModal();
    });
  }
  
  // Botón para cerrar el carrito
  const cerrarCarrito = document.getElementById('cerrar-carrito');
  if (cerrarCarrito) {
    cerrarCarrito.addEventListener('click', function() {
      document.getElementById('modal-carrito').style.display = 'none';
    });
  }
  
  // Cerrar modal al hacer click fuera
  window.addEventListener('click', function(e) {
    const modal = document.getElementById('modal-carrito');
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Agregar botón para vaciar carrito en el modal
  const modalContenido = document.getElementById('modal-contenido');
  if (modalContenido && !document.getElementById('vaciar-carrito')) {
    const botonVaciar = document.createElement('button');
    botonVaciar.id = 'vaciar-carrito';
    botonVaciar.className = 'w-full bg-gray-500 hover:bg-gray-600 text-white py-2 mt-2 rounded-md';
    botonVaciar.textContent = 'Vaciar Carrito';
    botonVaciar.addEventListener('click', vaciarCarrito);
    
    // Insertar antes del botón de WhatsApp
    const enlaceWpp = document.getElementById('enlace-wpp');
    modalContenido.insertBefore(botonVaciar, enlaceWpp);
  }
}