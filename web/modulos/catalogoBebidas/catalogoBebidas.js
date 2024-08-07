/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


/* global Swal */

// AUTOR: JUAN PABLO REA CANO

//Desactivar botones
document.getElementById("btnModificar").classList.add("disabled"); // se desactiva
document.getElementById("btnEliminar").classList.add("disabled"); // se desactiva
document.getElementById("btnLimpiar").classList.add("disabled"); // se desactiva

let obj = []; // Arreglo que se llenará de objetos JSON
let indexProductosSeleccionados;
let path = "http://localhost:8080/zarape_5/modulos/catalogoBebidas/";

fetch(path + "catalogoBebidas.json")
    .then((response) => {
        return response.json();
    })
    .then(function (jasondata) {
        obj = jasondata;
        console.log(obj);
        actualizaTabla();
    });

function actualizaTabla(filtrados = obj) {
    let cuerpo = "";
    filtrados.forEach(function (elemento) {
        let registro = '<tr onclick="selectProducto(' + obj.indexOf(elemento) + ');">' +
            '<td>' + (obj.indexOf(elemento) + 1) + '</td>' +
            '<td>' + elemento.nombre + '</td>' +
            '<td>' + elemento.descripcion + '</td>' +
            '<td>' + elemento.precio + '</td>' +
            '<td><img src="' + elemento.foto + '" width="100"></td>' +
            '<td>' + elemento.tipo + '</td>' +
            '<td>' + elemento.estatus + '</td>' +
            '</tr>';
        cuerpo += registro;
    });
    document.getElementById("tblProductos").innerHTML = cuerpo;
}

function limpiar() {
    document.getElementById("txtNombre").value = "";
    document.getElementById("txtDescripcion").value = "";
    document.getElementById("txtPrecio").value = "";
    document.getElementById("txtFoto").src = "img/nada.jpeg";
    document.getElementById("txtFotoRuta").value = "";
    document.getElementById("txtTipo").value = "";
    document.getElementById("searchInput").value = ""; // Limpiar el campo de búsqueda
    document.getElementById("searchField").value = ""; // Limpiar el campo de búsqueda
    
    // Limpiar la lista de resultados de búsqueda
    document.getElementById("searchResults").innerHTML = ""; // Limpiar la lista
    

    document.getElementById("btnModificar").classList.add("disabled"); // se desactiva
    document.getElementById("btnEliminar").classList.add("disabled"); // se desactiva
    document.getElementById("btnLimpiar").classList.add("disabled"); // se desactiva
    document.getElementById("btnAgregar").classList.remove("disabled"); // se activa
}

function obtenerNombreFoto() {
    let nombreFoto = document.getElementById("txtFotoRuta").value;
    nombreFoto = "img/" + nombreFoto.substring(nombreFoto.lastIndexOf("\\") + 1);
    return nombreFoto;
}

async function despliegaFoto() {
    try {
        let imageURL = obtenerNombreFoto();
        imageURL = path + imageURL;

        const response = await fetch(imageURL);
        if (!response.ok) {
            throw new Error("Imagen no encontrada");
        }

        const imageBlob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = function () {
            document.getElementById('txtFoto').src = reader.result;
        };
        reader.readAsDataURL(imageBlob);
    } catch (error) {
        alert("Error: " + error.message);
        document.getElementById('txtFoto').src = "img/nada.jpeg";
    }
}


// selección del producto de acuerdo al índice del arreglo
// llena los campos del formulario
function selectProducto(index) {
    document.getElementById("txtNombre").value = obj[index].nombre;
    document.getElementById("txtDescripcion").value = obj[index].descripcion;
    document.getElementById("txtPrecio").value = obj[index].precio;
    document.getElementById("txtTipo").value = obj[index].tipo;
    document.getElementById("txtFoto").src = obj[index].foto;
    document.getElementById("txtFotoRuta").value = "";
    indexProductosSeleccionados = index;

    document.getElementById("btnModificar").classList.remove("disabled"); // se activa
    document.getElementById("btnEliminar").classList.remove("disabled"); // se activa
    document.getElementById("btnLimpiar").classList.remove("disabled"); // se activa
    document.getElementById("btnAgregar").classList.add("disabled"); // se desactiva
}

function agregarProducto() {
    let nombre = document.getElementById("txtNombre").value;
    let descripcion = document.getElementById("txtDescripcion").value;
    let precio = document.getElementById("txtPrecio").value;

    let tipoA = document.getElementById("txtTipo");
    let tipo = tipoA.options[tipoA.selectedIndex].text;

    let fotoNueva = obtenerNombreFoto();

    if (nombre && descripcion && precio && tipo && fotoNueva) {
        let newProd = {
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            tipo: tipo,
            foto: fotoNueva,
            estatus: "Activo"
        };

        obj.push(newProd); // insertamos el nuevo producto al arreglo de objetos

        let jsonData = JSON.stringify(obj); // le asigno formato de comillas
        console.log(jsonData);
        console.log(typeof jsonData);

        limpiar();
        actualizaTabla();
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Campos obligatorios',
            text: 'Necesitas llenar todos los campos',
            confirmButtonText: 'Aceptar'
        });
    }
}

function modificarProducto() {
    // Obtener datos del formulario
    let nombre = document.getElementById("txtNombre").value.trim();
    let descripcion = document.getElementById("txtDescripcion").value.trim();
    let precio = document.getElementById("txtPrecio").value.trim();
    let tipo = document.getElementById("txtTipo").value.trim();
    let fotoRuta = document.getElementById("txtFotoRuta").files[0];
    let foto = obtenerNombreFoto();

    // Validar que todos los campos obligatorios estén llenos
    if (nombre && descripcion && precio && tipo && fotoRuta) {
        

        // Si se ha seleccionado una nueva foto, leerla como DataURL
        if (fotoRuta) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Actualizar los datos del producto seleccionado en el arreglo
                obj[indexProductosSeleccionados] = {
                    nombre: nombre,
                    descripcion: descripcion,
                    precio: precio,
                    tipo: tipo,
                    foto: e.target.result,
                    estatus: "Activo"
                };

                // Actualizar la tabla
                actualizaTabla();
                // Mensajes de consola y alerta para confirmar la actualización
                console.log("Producto modificado exitosamente:", obj[indexProductosSeleccionados]);
                Swal.fire({
                    icon: 'success',
                    title: 'Producto modificado correctamente',
                    text: 'Se han realizado los cambios',
                    confirmButtonText: 'Aceptar'
                });
            };
            reader.readAsDataURL(fotoRuta);
        } else {
            // Actualizar los datos del producto seleccionado en el arreglo
            obj[indexProductosSeleccionados] = {
                nombre: nombre,
                descripcion: descripcion,
                precio: precio,
                tipo: tipo,
                foto: obtenerNombreFoto(),
                estatus: "Activo"
            };

            // Actualizar la tabla
            actualizaTabla();

            // Habilitar botones nuevamente
            
            document.getElementById("btnLimpiar").classList.remove("disabled");
            

            // Mensajes de consola y alerta para confirmar la actualización
            console.log("Producto modificado exitosamente:", obj[indexProductosSeleccionados]);
            Swal.fire({
                icon: 'success',
                title: 'Producto modificado correctamente',
                text: 'Se han realizado los cambios',
                confirmButtonText: 'Aceptar'
            });
        }
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Campos obligatorios',
            text: 'Todos los campos obligatorios deben ser llenados',
            confirmButtonText: 'Aceptar'
        });
        
        console.log("Todos los campos obligatorios deben ser llenados para modificar un producto.");
    }
        limpiar();
        actualizaTabla();
        document.getElementById("btnAgregar").classList.add("disabled");
        document.getElementById("btnLimpiar").classList.remove("disabled");
        document.getElementById("btnModificar").classList.remove("disabled");
        document.getElementById("btnEliminar").classList.remove("disabled");
}

function eliminarProducto() {
    let elementoSeleccionado = obj[indexProductosSeleccionados];
    // Cambiar el estatus del producto a 'inactivo'
    if (elementoSeleccionado) {
        elementoSeleccionado.estatus = 'inactivo';
        console.log("Mostrando mensaje de éxito");
        Swal.fire({
            icon: 'success',
            title: 'Producto inactivado',
            text: 'El producto ha sido marcado como inactivo exitosamente',
            confirmButtonText: 'Aceptar'
        });
    } else {
        console.log("No se encontró el producto seleccionado");
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo encontrar el producto seleccionado',
            confirmButtonText: 'Aceptar'
        });
    }
    limpiar();
    actualizaTabla();
}


function buscarBebidas() {
    let searchInput = document.getElementById("searchInput").value.toLowerCase();
    let searchField = document.getElementById("searchField").value;
    let searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = ""; // Limpiar los resultados anteriores
    
    document.getElementById("btnLimpiar").classList.remove("disabled");// se activa
    document.getElementById("btnAgregar").classList.add("disabled");// se desactiva

    let resultadosEncontrados = obj
        .map((bebida, i) => {
            let campoBusqueda = "";
            
            // Determinar el campo de búsqueda basado en searchField
            if (searchField === "nombre") {
                campoBusqueda = bebida.nombre.toLowerCase();
            } else if (searchField === "precio") {
                campoBusqueda = bebida.precio.toString().toLowerCase(); // Convertir precio a string para comparar
            } else if (searchField === "tipo") {
                campoBusqueda = bebida.tipo.toLowerCase(); 
            }
            
            if (campoBusqueda.includes(searchInput)) {
                return {
                    id: i + 1, // ID de la bebida
                    nombre: bebida.nombre,
                    descripcion: bebida.descripcion,
                    precio: bebida.precio,
                    tipo: bebida.tipo, 
                    index: i
                };
            }
            return null;
        })
        .filter(result => result !== null);

    if (resultadosEncontrados.length === 0) {
        searchResults.innerHTML = "<li class='list-group-item'>No se encontraron bebidas que coincidan con la búsqueda.</li>";
        return;
    }

    resultadosEncontrados.forEach(result => {
        let item = `<li class='list-group-item' onclick='selectProducto(${result.index})'>
                        <strong>${result.id}</strong> - ${result.nombre} (${result.descripcion}, ${result.precio}, ${result.tipo})
                    </li>`;
        searchResults.innerHTML += item;
    });
}


actualizaTabla();
