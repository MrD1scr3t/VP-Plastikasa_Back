// Importa el módulo Express
const express = require('express');
const bodyParser = require('body-parser');
// Importa el módulo mysql
const mysql = require('mysql');
const fs = require('fs');
const TablaDePrecios = require('./tblprecios')
const cors = require('cors');


//Lee los datos del config.txt

let ip, port, host, user, password, database, portapi;

try {
 
  const config = fs.readFileSync('config.txt', 'utf8').trim().split('\n');

  config.forEach(line => {
    const [key, value] = line.split(':');
    if (key === 'portapi') {
      portapi = parseInt(value.trim(), 10);
    } else if (key === 'host'){
      host = value.trim();
    } else if (key === 'user'){
      user = value.trim();
    } else if (key === 'password'){
      password = value.trim();
    } else if (key === 'database'){
      database = value.trim();
    } else if (key === 'port'){
      port = value.trim();
    }
  });
  
} catch (error) {
  console.error('Error al leer el archivo de configuración:', error);
  port = 80;  
  host = 'Node';
}




// Crea una nueva instancia de Express
const app = express();
// const port = 80; // Puerto en el que se ejecutará el servidor
app.use(cors());

app.use(bodyParser.json());


// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database,
  port: port // Puerto de MySQL
});

// Establece la conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos MySQL establecida correctamente');
});

// Define una ruta para el endpoint de bienvenida
app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi API!');
});

// Define una ruta para un endpoint personalizado que consulta datos de la base de datos
app.post('/verificar', (req, res) => {
  let id = req.body.clave;

  // Realiza una consulta a la base de datos
  connection.query(`SELECT descripcion, precio1, precio2, precio3, precio4, mayoreo1, mayoreo2,mayoreo3, mayoreo4, existencia, clave, claveAlterna, imagen, nombre 
  FROM articulo art left join articuloimagen imgart on art.art_id = imgart.art_id left join imagen img on imgart.img_id = img.img_id cross join empresa emp where clave = ? OR claveAlterna = ?`, [id, id], (err, results) => {

    if (err) {
      console.error('Error al realizar la consulta:', err);
      return res.status(500).send('Error al obtener los datos de la base de datos');
    }

    // Comprueba si se encontraron resultados
    if (results.length === 0) {
      return res.status(404).send('Not-found');
    }

    console.log(results[0])

    results[0].nombre = results[0].nombre.replace("Plastikasa", "").trim();

    // Procesa los resultados si se encontraron
    let resultpr = TablaDePrecios(results[0]);
    let datos = {
      descripcion: results[0].descripcion,
      tablaprecios: resultpr,
      existencia: results[0].existencia < 1 ? 0 : results[0].existencia,
      clave: results[0].clave,
      claveAlterna: results[0].claveAlterna,
      imagen: results[0].imagen,
      empresa: results[0].nombre
    };

    // Devuelve los resultados como respuesta
    res.json(datos);
  });
});

app.get('/sucursal', (req, res) => {

  // Realiza una consulta a la base de datos
  connection.query(`SELECT nombre FROM empresa`, (err, results) => {

    if (err) {
      console.error('Error al realizar la consulta:', err);
      return res.status(500).send('Error al obtener los datos de la base de datos');
    }

    // Comprueba si se encontraron resultados
    if (results.length === 0) {
      return res.status(404).send('Not-found');
    }

    console.log(results[0])

    results[0].nombre = results[0].nombre.replace("Plastikasa", "").trim();

    let datos = {
      sucursal: results[0].nombre
    };

    res.json(datos);
  });
});



// Ejecuta el servidor en el puerto especificado
app.listen(portapi, () => {
  console.log(`Servidor API escuchando`);
});
