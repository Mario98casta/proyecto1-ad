const express = require("express");
const mysql = require("mysql2");
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors');





const app = express();
const port = 5500;


// Configura la conexión a la base de datos de Amazon RDS
const db = mysql.createConnection({
    host: 'melgust-server.mysql.database.azure.com',
    user: 'melgust',
    password: 'Inicio12345#',
    database: 'amazoon',
});

// Conecta a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ' + err.message);
  } else {
    console.log('Conexión a la base de datos exitosa.');
  }
});



// Ruta para servir archivos estáticos (como las imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Configurar una carpeta estática para servir archivos estáticos
app.use(express.static(__dirname));

// Definir la ruta para la página principal
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});


// Middleware para procesar datos del formulario
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use(cors({
  origin: 'appsaborchapin.azurewebsites.net'
}));

// Ruta para registrar un nuevo usuario
app.post('/registrar-usuario', async (req, res) => {
  const usuario = req.body.usuario;
  const contraseña = req.body.contraseña;
  const confirmarContraseña = req.body.confirmarContraseña;

  // Verifica si la contraseña y la confirmación coinciden
  if (contraseña !== confirmarContraseña) {
      res.status(400).send('Las contraseñas no coinciden');
      return;
  }

  try {
      // Verifica si el usuario ya existe en la base de datos
      const verificarUsuarioSql = 'SELECT * FROM usuario WHERE usuario = ?';
      const [existingUser] = await db.promise().query(verificarUsuarioSql, [usuario]);

      if (existingUser.length > 0) {
          res.status(409).send('El usuario ya existe');
          return;
      }

      // Encripta la contraseña antes de almacenarla en la base de datos
      const hashedPassword = await bcrypt.hash(contraseña, 10); // 10 es el costo de la encriptación

      // Inserta el nuevo usuario en la base de datos con la contraseña encriptada
      const insertarUsuarioSql = 'INSERT INTO usuario (usuario, contraseña) VALUES (?, ?)';
      await db.promise().query(insertarUsuarioSql, [usuario, hashedPassword]);

      res.status(201).send('Usuario registrado exitosamente');
  } catch (error) {
      console.error('Error en el registro de usuario: ' + error.message);
      res.status(500).send('Error interno del servidor');
  }
});

// Ruta para procesar el formulario de inicio de sesión
app.post('/iniciar-sesion', (req, res) => {
  const usuario = req.body.usuario;
  const contraseña = req.body.contraseña;

  // Ejemplo de consulta a la base de datos utilizando mysql2
  const sql = 'SELECT * FROM usuario  WHERE usuario = ? AND contraseña = ?';
  db.query(sql, [usuario, contraseña], (err, results) => {
    if (err) {
      console.error('Error en la consulta SQL: ' + err.message);
      res.status(500).send('Error interno del servidor');
    } else {
      if (results.length > 0) {
        res.status(200).send('Inicio de sesión exitoso');

      } else {
        res.status(401).send('Credenciales incorrectas');
      }
    }
  });
});

// Ruta para obtener datos de productos desde la base de datos
app.get('/productos', (req, res) => {
  const sql = 'SELECT * FROM producto';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error en la consulta SQL: ' + err.message);
      res.status(500).json({ error: 'Error al obtener productos' });
    } else {
      // Asegúrate de que la respuesta sea un array de objetos JSON
      if (Array.isArray(results) && results.every(item => typeof item === 'object')) {
        // Convierte los datos de imagen si es necesario
        results.forEach(producto => {
          if (producto.imagen && producto.imagen.length > 0) {
            producto.imagen = 'data:image/png;base64,' + producto.imagen.toString('base64');
          } else {
            producto.imagen = ''; // Otra opción en caso de no haber imagen
          }
        });
        res.json(results);
      } else {
        console.error('La respuesta de la base de datos no es un array de objetos JSON válido');
        res.status(500).json({ error: 'Error al obtener productos' });
      }
    }
  });  
});



app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});




