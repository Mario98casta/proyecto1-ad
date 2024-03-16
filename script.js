const menuOpciones = document.querySelector(".menu-opciones");
const btnSignUp = document.getElementById("btn-sign-up");
const header = document.querySelector("header");
const controlesUsuario = document.querySelector(".controles-usuario");
const contenedor = document.querySelector(".contenedor");
const btnMenu = document.getElementById("btn-menu");
const searchIcon = document.getElementById("search-icon");
const searchInput = document.getElementById("search-input");



const responsiveY = () => {
    if (window.innerHeight <= 362) {
        if (menuOpciones.classList.contains("mostrar")) {
            menuOpciones.classList.add("min");
        } else {
            menuOpciones.classList.remove("min");
        }
    } else {
        menuOpciones.classList.remove("min");
    }
};


const responsive = ()=>{
    if(window.innerWidth<=865){
        menuOpciones.children[0].appendChild(btnSignUp);
        header.appendChild(menuOpciones);
    }else{
        controlesUsuario.appendChild(btnSignUp);
        contenedor.appendChild(menuOpciones);
    }

    responsiveY();
}

btnMenu.addEventListener("click",()=>{
    menuOpciones.classList.toggle("mostrar");
    responsiveY();
});
responsive();

window.addEventListener("resize",responsive);


// Agrega un evento de clic al botón "INGRESAR"
btnSignUp.addEventListener("click", () => {
    window.location.href = "login.html";
});


// Agrega un evento de clic al ícono de búsqueda
searchIcon.addEventListener("click", () => {
    // Muestra u oculta el cuadro de búsqueda al hacer clic en el ícono
    searchInput.classList.toggle("mostrar");
    
    // Evita que el clic en el ícono de búsqueda se propague y cierre el cuadro inmediatamente
    event.stopPropagation();
});

// Agrega un manejador de clic al documento
document.addEventListener("click", (event) => {
    // Verifica si el clic ocurrió fuera del cuadro de búsqueda y el ícono de búsqueda
    if (event.target !== searchInput && event.target !== searchIcon) {
        // Oculta el cuadro de búsqueda si está visible
        if (searchInput.classList.contains("mostrar")) {
            searchInput.classList.remove("mostrar");
        }
    }
});


// Función para manejar el evento de búsqueda
const handleSearch = () => {
  const searchText = searchInput.value.toLowerCase(); // Obtener el texto ingresado en minúsculas
  const cards = document.querySelectorAll('.container__card .card'); // Obtener todas las tarjetas

  cards.forEach(card => {
      const cardText = card.textContent.toLowerCase(); // Obtener el texto de la tarjeta en minúsculas

      // Verificar si el texto de la tarjeta contiene el texto de búsqueda
      if (cardText.includes(searchText)) {
          card.style.display = 'block'; // Mostrar la tarjeta si hay coincidencia
      } else {
          card.style.display = 'none'; // Ocultar la tarjeta si no hay coincidencia
      }
  });
};

// Agregar un evento de entrada al campo de búsqueda
searchInput.addEventListener('input', handleSearch);


//conexiones


//registrar usuario
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registro-form'); // Obtén el formulario por su id
  const usuarioInput = document.getElementById('registroUsuario');
  const contraseñaInput = document.getElementById('registroContra');
  const confirmarContraseñaInput = document.getElementById('registroConf');

  form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const usuario = usuarioInput.value;
      const contraseña = contraseñaInput.value;
      const confirmarContraseña = confirmarContraseñaInput.value;

      // Realiza la solicitud POST al servidor para registrar el usuario
      const response = await fetch('/registrar-usuario', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ usuario, contraseña, confirmarContraseña }),
      });

      if (response.status === 201) {
          alert('Usuario registrado exitosamente');
          window.location.href = 'login.html'
      } else if (response.status === 409) {
          alert('El usuario ya existe');
      } else if (response.status === 400) {
          alert('Las contraseñas no coinciden');
      } else {
          alert('Error interno del servidor');
      }
  });
});


//iniciar sesion
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form'); // Obtén el formulario por su id
    const usuarioInput = document.getElementById('usuario-input');
    const contraseñaInput = document.getElementById('contraseña-input');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const usuario = usuarioInput.value;
      const contraseña = contraseñaInput.value;


  
      // Realiza la solicitud POST al servidor
      const response = await fetch('/iniciar-sesion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, contraseña }),
      });
  
      if (response.status === 200) {
        alert('Inicio de sesión exitoso');
        window.location.href = 'index.html';
      } else {
        alert('Credenciales incorrectasss');
      }
    });
  });

window.addEventListener("load", cargarTarjetas);

function cargarTarjetas() {
    // Hacer una solicitud al servidor para obtener datos de productos
    fetch('/productos')
      .then(response => response.json())
      .then(productos => {
        // Verificar si la respuesta contiene datos válidos
        if (productos && Array.isArray(productos)) {
          const container = document.querySelector('.container__card');
    
          // Iterar sobre cada producto y crear la tarjeta correspondiente
          productos.forEach(producto => {
              const card = document.createElement('div');
              card.classList.add('card');
              card.innerHTML = `
                <div class="icon">
                  <img src="${producto.imagen}" height="150px">
                </div>
                <div class="info__description">
                  <h2>${producto.nombre}</h2>
                  <p>${producto.descripcion}</p>
                  <p class="price">Precio: Q${producto.precio}</p>
                  <p>Cantidad Disponible: ${producto.cantidad_disponible}</p>
                  <button class="btn-add-cart">Añadir al carrito</button>
                </div>
              `;
            
              container.appendChild(card);
            
              // Agregar un evento de clic al botón "Añadir al carrito"
              const btnAddToCart = card.querySelector('.btn-add-cart');
              btnAddToCart.addEventListener('click', () => {
                  // Aquí puedes agregar la lógica para manejar el evento de clic
              });
          });
        } else {
          // Manejar el caso de una respuesta no válida
          console.error('La respuesta del servidor no es válida:', productos);
        }
      })
      .catch(error => console.error('Error al obtener datos de productos:', error));
}

  

//**************************************************************************** */

const productsList = document.querySelector('.container__card');
const containerCartProducts = document.querySelector('.container-cart-products');
const rowProduct = document.querySelector('.row-product');
const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');

let allProducts = [];

productsList.addEventListener('click', e => {
    if (e.target.classList.contains('btn-add-cart')) {
        const product = e.target.parentElement;

        const infoProduct = {
            quantity: 1,
            title: product.querySelector('h2').textContent,
            price: product.querySelector('.price').textContent,
        };

        const exits = allProducts.some(
            product => product.title === infoProduct.title
        );

        if (exits) {
            const products = allProducts.map(product => {
                if (product.title === infoProduct.title) {
                    product.quantity++;
                    return product;
                } else {
                    return product;
                }
            });
            allProducts = [...products];
        } else {
            allProducts = [...allProducts, infoProduct];
        }

        showCart(false);
    }
});

const showCart = (isRemovingProduct) => {
    if (!allProducts.length) {
        containerCartProducts.classList.add('hidden-cart');
    } else {
        containerCartProducts.classList.remove('hidden-cart');
        
        // Mostrar el carrito durante 5 segundos si se está agregando un producto
        if (!isRemovingProduct) {
            setTimeout(() => {
                containerCartProducts.classList.add('hidden-cart');
            }, 3000);
        }

        rowProduct.innerHTML = '';

        let total = 0;
        let totalOfProducts = 0;

        allProducts.forEach(product => {
            const containerProduct = document.createElement('div');
            containerProduct.classList.add('cart-product');

            containerProduct.innerHTML = `
                <div class="info-cart-product">
                    <span class="cantidad-producto-carrito">${product.quantity}</span>
                    <p class="titulo-producto-carrito">${product.title}</p>
                    <span class="precio-producto-carrito">${product.price}</span>
                    <button class="eliminar-producto">Eliminar</button>
                </div>
            `;

            // Agrega un event listener para el botón de eliminar
            containerProduct.querySelector('.eliminar-producto').addEventListener('click', () => {
                // Encuentra el índice del producto en el array allProducts
                const index = allProducts.findIndex(p => p.title === product.title);
                if (index !== -1) {
                    // Si la cantidad del producto es mayor a 1, solo reduce la cantidad
                    if (allProducts[index].quantity > 1) {
                        allProducts[index].quantity--;
                    } else {
                        // Si la cantidad es 1, elimina el producto del array allProducts
                        allProducts.splice(index, 1);
                    }
                    // Vuelve a mostrar el carrito sin aplicar el temporizador
                    showCart(true); // true indica que se está eliminando un producto
                }
            });

            rowProduct.append(containerProduct);

            // Extraer el valor numérico del precio y multiplicarlo por la cantidad del producto
            total += parseInt(product.price.match(/\d+/)) * product.quantity; // Multiplicar precio por cantidad

            totalOfProducts += product.quantity;
        });

        valorTotal.innerText = `Q${total}`;
        countProducts.innerText = totalOfProducts;
    }
};


const btnCart = document.querySelector('.container-cart-icon');

btnCart.addEventListener('click', () => {
    containerCartProducts.classList.toggle('hidden-cart');
});









