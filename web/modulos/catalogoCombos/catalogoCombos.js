/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

/* global Swal */

document.getElementById("btnModificar").classList.add("disabled");
document.getElementById("btnEliminar").classList.add("disabled");
document.getElementById("btnLimpiar").classList.add("disabled");

let obj = [];
let indexProductosSeleccionados;

actualizaTabla();

let path = "http://localhost:8080/zarape_5/modulos/catalogoCombos/";

fetch(path + "datosCombos.json")
    .then((response) => {
        return response.json();
    })
    .then(function (jasondata) {
        obj = jasondata;
        console.log(obj);
        actualizaTabla();
    });
    
function actualizaTabla() {
    let cuerpo = "";
    obj.forEach((elemento, index) => {
        let registro = `<tr onclick="selectProducto(${index});">
            <td>${index + 1}</td>
            <td>${elemento.nombre}</td>
            <td>${elemento.descripcion}</td>
            <td>${elemento.precio}</td>
            <td>${elemento.tipo}</td>
            <td>${elemento.estatus}</td>
            <td><img src="${elemento.foto}" alt="Foto del producto" width="100" height="100"></td>
        </tr>`;
        cuerpo += registro;
    });
    document.getElementById("tblProductos").innerHTML = cuerpo;
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


function selectProducto(index) {
    document.getElementById("txtNombre").value = obj[index].nombre;
    document.getElementById("txtDescripcion").value = obj[index].descripcion;
    document.getElementById("txtPrecio").value = obj[index].precio;
    document.getElementById("txtTipo").value = obj[index].tipo;
    document.getElementById("txtFoto").src = obj[index].foto;
    document.getElementById("txtFotoRuta").value = "";
    indexProductosSeleccionados = index;

    document.getElementById("btnModificar").classList.remove("disabled");
    document.getElementById("btnEliminar").classList.remove("disabled");
    document.getElementById("btnLimpiar").classList.remove("disabled");
    document.getElementById("btnAgregar").classList.add("disabled");
}

function agregarProducto() {
    let nombre = document.getElementById("txtNombre").value;
    let descripcion = document.getElementById("txtDescripcion").value;
    let precio = parseFloat(document.getElementById("txtPrecio").value);
    let combo = document.getElementById("txtTipo");
    let tipo = combo.options[combo.selectedIndex].text;
    let inputFile = document.getElementById("inputFoto");

    if (nombre && descripcion && precio && tipo && inputFile.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function() {
            let newProd = {
                nombre: nombre,
                descripcion: descripcion,
                precio: precio,
                tipo: tipo,
                foto: reader.result,
                estatus: "Activo"
            };

            obj.push(newProd); // insertamos el nuevo producto al arreglo de objetos

            let jsonData = JSON.stringify(obj); // le asigno formato de comillas
            console.log(jsonData);
            console.log(typeof jsonData);

            limpiar();
            actualizaTabla();

            // Mostrar mensaje de confirmación
            Swal.fire({
                icon: 'success',
                title: 'Producto Agregado',
                text: 'El producto ha sido agregado exitosamente',
                confirmButtonText: 'Aceptar'
            });
        };
        
        reader.readAsDataURL(inputFile.files[0]);
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Campos obligatorios',
            text: 'Obligatorio llenar todos los campos, incluyendo la foto',
            confirmButtonText: 'Aceptar'
        });
    }
}



function eliminarProducto() {
    // Confirmación antes de cambiar el estatus a inactivo
    Swal.fire({
        title: '¿Estás seguro?',
        text: "El producto será marcado como inactivo.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, inactivar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Cambiar el estatus del producto a 'inactivo'
            obj[indexProductosSeleccionados].estatus = 'inactivo';
            actualizaTabla();
            limpiar();

            // Mostrar mensaje de éxito
            Swal.fire({
                icon: 'success',
                title: 'Producto Inactivado',
                text: 'El producto ha sido marcado como inactivo exitosamente',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}
function modificarProducto() {
    let nombre = document.getElementById("txtNombre").value.trim();
    let descripcion = document.getElementById("txtDescripcion").value.trim();
    let precio = parseFloat(document.getElementById("txtPrecio").value);
    let tipo = document.getElementById("txtTipo").value.trim();

    if (nombre && descripcion && precio && tipo) {
        // Confirmar si desea guardar los cambios
        Swal.fire({
            title: '¿Guardar cambios?',
            text: "¿Estás seguro de que deseas guardar los cambios?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                obj[indexProductosSeleccionados].nombre = nombre;
                obj[indexProductosSeleccionados].descripcion = descripcion;
                obj[indexProductosSeleccionados].precio = precio;
                obj[indexProductosSeleccionados].tipo = tipo;

                actualizaTabla();
                limpiar();

                // Mostrar mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Cambios Guardados',
                    text: 'Los cambios se han guardado exitosamente',
                    confirmButtonText: 'Aceptar'
                });
            }
        });
    } else {
        // Mostrar mensaje de advertencia si hay campos vacíos
        Swal.fire({
            icon: 'warning',
            title: 'Campos obligatorios',
            text: 'Todos los campos son obligatorios',
            confirmButtonText: 'Aceptar'
        });
    }
}

function limpiar() {
    document.getElementById("txtNombre").value = "";
    document.getElementById("txtDescripcion").value = "";
    document.getElementById("txtPrecio").value = "";
    document.getElementById("txtTipo").value = "Comida";
     document.getElementById("txtFoto").src = "img/nada.jpeg";
    document.getElementById("txtFotoRuta").value = "";
    document.getElementById("searchInput").value = ""; // Limpiar el campo de búsqueda
    document.getElementById("searchField").value = "";
    // Limpiar la lista de resultados de búsqueda
    document.getElementById("searchResults").innerHTML = ""; // Limpiar la lista


    document.getElementById("btnModificar").classList.add("disabled");
    document.getElementById("btnEliminar").classList.add("disabled");
    document.getElementById("btnLimpiar").classList.add("disabled");
    document.getElementById("btnAgregar").classList.remove("disabled");
}

function buscarProducto() {
    let searchInput = document.getElementById("searchInput").value.toLowerCase();
    let searchField = document.getElementById("searchField").value; // Campo seleccionado en el combo
    let searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = ""; // Limpiar los resultados anteriores
    
    document.getElementById("btnLimpiar").classList.remove("disabled");// se activa
    document.getElementById("btnAgregar").classList.add("disabled");// se desactiva

    // Función de mapeo de campo de búsqueda
    const campoBusquedaMap = {
        "nombre": producto => producto.nombre.toLowerCase(),
        "precio": producto => producto.precio.toString().toLowerCase(),
        "categoria": producto => producto.categoria.toLowerCase()
    };

    // Filtrar productos según el campo de búsqueda
    let resultadosEncontrados = obj
        .map((producto, i) => {
            let campoBusqueda = campoBusquedaMap[searchField] ? campoBusquedaMap[searchField](producto) : "";
            if (campoBusqueda.includes(searchInput)) {
                return {
                    id: i + 1, // ID del producto
                    nombre: producto.nombre,
                    descripcion: producto.descripcion,
                    precio: producto.precio,
                    tipo: producto.tipo,
                    index: i
                };
            }
            return null;
        })
        .filter(result => result !== null);

    // Mostrar mensaje si no se encontraron resultados
    if (resultadosEncontrados.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Sin coincidencias',
            text: 'No se encontraron productos que coincidan con el término de búsqueda.',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Mostrar los resultados encontrados
    resultadosEncontrados.forEach(result => {
        let item = `<li class='list-group-item' onclick='selectProducto(${result.index})'>
                        <strong>${result.id}</strong> - ${result.nombre} (${result.descripcion})
                        <br> Precio: ${result.precio} - Tipo: ${result.tipo}
                    </li>`;
        searchResults.innerHTML += item;
    });
}