/**
* Template Name: Impact
* Template URL: https://bootstrapmade.com/impact-bootstrap-business-website-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();

// Inicializar un arreglo para almacenar los productos del carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para agregar un producto al carrito
function agregarAlCarrito(id, nombre, precio, imagen) {
    // Verificar si el producto ya existe en el carrito
    const productoExistente = carrito.find(producto => producto.id === id);

    if (productoExistente) {
        // Si el producto ya existe, incrementar la cantidad
        productoExistente.cantidad++;
    } else {
        // Si el producto no existe, agregarlo al carrito con cantidad 1
        carrito.push({ id, nombre, precio, cantidad: 1, imagen });
    }

    // Actualizar la vista del carrito
    actualizarCarrito();
    guardarCarritoEnStorage();
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(id) {
    // Filtrar el carrito para eliminar el producto con el id dado
    carrito = carrito.filter(producto => producto.id !== id);

    // Actualizar la vista del carrito
    actualizarCarrito();
    guardarCarritoEnStorage();
}

// Función para editar la cantidad de un producto en el carrito
function editarCantidad(id, nuevaCantidad) {
    const producto = carrito.find(producto => producto.id === id);

    if (producto) {
        producto.cantidad = nuevaCantidad; // Actualizar la cantidad
        if (producto.cantidad <= 0) {
            eliminarDelCarrito(id); // Si la cantidad es 0 o menos, eliminar el producto
        }
    }

    // Actualizar la vista del carrito
    actualizarCarrito();
    guardarCarritoEnStorage();
}

// Función para vaciar el carrito
function vaciarCarrito() {
    carrito = [];  // Limpiar el carrito
    actualizarCarrito();  // Actualizar la vista del carrito
    guardarCarritoEnStorage();
}

// Función para actualizar la vista del carrito en el HTML
function actualizarCarrito() {
    const carritoList = document.getElementById('carrito-list');
    const carritoTotal = document.getElementById('carrito-total');

    // Limpiar la lista de productos del carrito
    carritoList.innerHTML = '';

    // Si el carrito está vacío
    if (carrito.length === 0) {
        carritoTotal.innerHTML = 'El carrito se encuentra vacío';
        return;
    }

    // Calcular el total del carrito
    let total = 0;

    // Mostrar los productos en el carrito
    carrito.forEach(producto => {
        total += producto.precio * producto.cantidad; // Sumar el total por producto

        // Crear un elemento de lista para cada producto en el carrito
        const item = document.createElement('li');
        item.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; margin-right: 15px;" />
            <p>${producto.nombre} - $${producto.precio} x ${producto.cantidad} = $${producto.precio * producto.cantidad}</p>
        `;

        // Crear un botón para eliminar el producto del carrito
        const eliminarBtn = document.createElement('button');
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.classList.add('eliminar'); // Añadir la clase 'eliminar'
        eliminarBtn.onclick = () => eliminarDelCarrito(producto.id);

        // Crear un botón para editar la cantidad
        const editarBtn = document.createElement('button');
        editarBtn.textContent = 'Editar';
        editarBtn.classList.add('editar'); // Añadir la clase 'editar'
        editarBtn.onclick = () => mostrarEditorCantidad(producto.id);

        // Añadir los botones de editar y eliminar al item del producto
        item.appendChild(editarBtn);
        item.appendChild(eliminarBtn);

        // Añadir el item del producto a la lista del carrito
        carritoList.appendChild(item);
    });

    // Mostrar el total del carrito
    carritoTotal.innerHTML = `Total: $${total}`;
}

// Función para mostrar el campo de entrada para editar la cantidad de un producto
function mostrarEditorCantidad(id) {
    const cantidad = prompt("Introduce la nueva cantidad:");
    
    // Asegurarse de que la cantidad sea un número válido
    if (cantidad !== null && !isNaN(cantidad) && cantidad > 0) {
        editarCantidad(id, parseInt(cantidad));
    } else {
        alert("Por favor, ingresa una cantidad válida.");
    }
}

// Función para guardar el carrito en el localStorage
function guardarCarritoEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Agregar eventos de escucha (listeners) a los botones de "Agregar al carrito"
document.querySelectorAll('.add-to-cart').forEach(boton => {
    boton.addEventListener('click', function() {
        const id = this.getAttribute('data-product-id');
        const nombre = this.getAttribute('data-product-name');
        const precio = parseFloat(this.getAttribute('data-product-price'));
        const imagen = this.getAttribute('data-product-image');

        agregarAlCarrito(id, nombre, precio, imagen);  // Agregar al carrito
    });
});

// Agregar evento al botón de "Vaciar carrito"
document.getElementById('vaciar-carrito').addEventListener('click', vaciarCarrito);

// Actualizar el carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', actualizarCarrito);
