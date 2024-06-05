// Supongamos que tienes los datos de la tabla de artículos en un objeto llamado 'articulo'
const articulo = {
    precio1: 53.017,
    precio2: 39.655,
    precio3: 35.545,
    precio4: 1000,
    mayoreo1: 0,
    mayoreo2: 12,
    mayoreo3: 20, // Puede estar vacío
    mayoreo4: 0  // Puede estar vacío
};


function formatearPrecios(objeto) {
    let preciosFormateados = {};
    for (let clave in objeto) {
        if (clave.startsWith('precio')) {
            preciosFormateados[clave] = Number(objeto[clave]).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    }
    return preciosFormateados;
}

function TablaDePrecios(articulo) {
    let preciosFormateados = formatearPrecios(articulo);
    let tabla = [];

    if (articulo.mayoreo1 === 0 && articulo.mayoreo2 > 0) {
        tabla.push({cantidad: `1-${articulo.mayoreo2 - 1}`, precio: preciosFormateados.precio1})
    }

    if (articulo.mayoreo2 > 0 && articulo.mayoreo3 > 0) {
        tabla.push({cantidad: `${articulo.mayoreo2}-${articulo.mayoreo3 - 1}`, precio: preciosFormateados.precio2})
    } else if (articulo.mayoreo2 > 0 && articulo.mayoreo3 === 0) {
        tabla.push({cantidad: `${articulo.mayoreo2} o más`, precio: preciosFormateados.precio2})
    }

    if (articulo.mayoreo3 > 0 && articulo.mayoreo4 > 0) {
        tabla.push({cantidad: `${articulo.mayoreo3}-${articulo.mayoreo4 - 1}`, precio: preciosFormateados.precio3})
    } else if (articulo.mayoreo3 > 0 && articulo.mayoreo4 === 0) {
        tabla.push({cantidad: `${articulo.mayoreo3} o más`, precio: preciosFormateados.precio3})
    }

    if (articulo.mayoreo4 > 0) {
        tabla.push({cantidad: `${articulo.mayoreo4} o más`, precio: preciosFormateados.precio4})
    }

    if (articulo.mayoreo3 === 0 && articulo.precio3 > 0) {
        tabla.push({cantidad: 'Precio3', precio: preciosFormateados.precio3})
    }

    if (articulo.mayoreo4 === 0 && articulo.precio4 > 0) {
        tabla.push({cantidad: 'Precio4', precio: preciosFormateados.precio4})
    }

    return tabla;
}


// let tabla = TablaDePrecios(articulo);
// console.log(tabla)

module.exports = TablaDePrecios;

