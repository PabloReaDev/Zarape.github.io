
/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 * @Nombre del Archivo: catalogoSucursal.js
 * Empresa:Innova Tech Solutions
 * @Elaboro: Avril Anaya
 * Descripción: Este programa JavaScript permite la gestión de sucursales en una aplicación web. 
    Incluye funcionalidades para agregar, editar, eliminar y buscar sucursales, así como para visualizar 
    los detalles de cada sucursal en una interfaz de usuario.
 * Fecha:15/07/24
 * Última Modificación: 03/08/24
*/

/* global Swal */

//indexSucursalSeleccionada =-1 para determinar si hay una sucursal seleccionada. 
//Cambiar esto a 0 significará que siempre se considerará que hay una sucursal seleccionada, incluso si el usuario no ha seleccionado ninguna.
//Desactivar botones
document.getElementById("btnEditar").classList.add("disabled"); // se desactiva
document.getElementById("btnEliminar").classList.add("disabled"); // se desactiva
document.getElementById("btnLimpiar").classList.add("disabled"); // se desactiva


let indexSucursalSeleccionada = -1;// Inicialmente, ninguna sucursal está seleccionada
let sucursales = []; // Arreglo para almacenar las sucursales

let path= "http://localhost:8080/zarape_5/modulos/catalogoSucursal/";

fetch(path + "datosSucursal.json")
    .then((response) => {
        return response.json();
    })
    .then(function(jsondata) {
        sucursales = jsondata;
        console.log(sucursales);
        cargarSucursalesEnTabla();
    })
    .catch(error => {
        console.error('Error al cargar los datos de las sucursales:', error);
    });

 
 
function cargarSucursalesEnTabla() {
    let tablaSucursales = document.getElementById("tabla-sucursales");

    // Limpiar la tabla antes de volver a llenar
    tablaSucursales.innerHTML = "";

    // Iterar sobre el arreglo de sucursales y crear filas en la tabla
    for (let i = 0; i < sucursales.length; i++) {
        let sucursal = sucursales[i];
        let id = i + 1; // Calcular el ID sumando 1 al índice
        let fila = `<tr onclick="selectSucursal(${i})">
                        <td>${id}</td>
                        <td>${sucursal.nombreS}</td>
                        <td>${sucursal.ubicacion}</td>
                        <td>${sucursal.estatus}</td>
                        <td><img src="${sucursal.logotipo}" alt="Logotipo" width="50"></td>
                    </tr>`;
        tablaSucursales.innerHTML += fila;
    }
}

// Función para seleccionar una sucursal y mostrar sus datos en el formulario
//index representa la posición de la sucursal dentro del arreglo 
function selectSucursal(index) {
    indexSucursalSeleccionada = index; // Guardar el índice de la sucursal seleccionada
    let sucursal = sucursales[index];
    
    
    
    document.getElementById("nombreS").value = sucursal.nombreS;
    document.getElementById("ubicacion").value = sucursal.ubicacion;
    document.getElementById("gps").value = sucursal.gps;
    document.getElementById("horarioApertura").value = sucursal.horarioApertura;
    document.getElementById("horarioCierre").value = sucursal.horarioCierre;
    document.getElementById("logotipo").src = sucursal.logotipo;
    document.getElementById("url").value = sucursal.url;
    document.getElementById("estatus").value = sucursal.estatus;

    console.log("Sucursal seleccionada:", sucursal); // Depuración
    

    // Habilitar botones de actualizar y eliminar
    document.getElementById("btnEliminar").classList.remove("disabled");
    document.getElementById("btnLimpiar").classList.remove("disabled");
    document.getElementById("btnEditar").classList.remove("disabled");
    // Deshabilitar botón de agregar
    document.getElementById("btnAgregar").classList.add("disabled");
}

function agregarSucursal() {
    let nombreS = document.getElementById("nombreS").value.trim();
    let ubicacion = document.getElementById("ubicacion").value.trim();
    let gps = document.getElementById("gps").value.trim();
    let horarioApertura = document.getElementById("horarioApertura").value.trim();
    let horarioCierre = document.getElementById("horarioCierre").value.trim();
    let logotipoRuta = document.getElementById("logotipoRuta");
    let url = document.getElementById("url").value.trim();
    let estatus = document.getElementById("estatus").value.trim();
    
    if (nombreS && ubicacion && gps && horarioApertura && horarioCierre && logotipoRuta.files[0] && url  && estatus) {
        // Verificar si la sucursal ya existe
        let sucursalExistente = sucursales.some(sucursal => 
            sucursal.nombreS === nombreS && sucursal.ubicacion === ubicacion
        );

        if (sucursalExistente) {
            alert("La sucursal con el mismo nombre y ubicación ya existe.");
            return;
            document.getElementById("btnEliminar").classList.add("disabled");
            document.getElementById("btnEditar").classList.add("disabled"); 
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            let nuevaSucursal = {
                nombreS: nombreS,
                ubicacion: ubicacion,
                gps: gps,
                horarioApertura: horarioApertura,
                horarioCierre: horarioCierre,
                logotipo: e.target.result,
                url: url,
                estatus: estatus
            };

            sucursales.push(nuevaSucursal);

            document.getElementById("nombreS").value = "";
            document.getElementById("ubicacion").value = "";
            document.getElementById("gps").value = "";
            document.getElementById("horarioApertura").value = "";
            document.getElementById("horarioCierre").value = "";
            document.getElementById("logotipoRuta").value = "";
            document.getElementById("url").value = "";
            document.getElementById("estatus").value = "";

            cargarSucursalesEnTabla();
            limpiarSucursal(); // Limpiar los campos del formulario

            console.log("Sucursal agregada exitosamente:", nuevaSucursal);
            Swal.fire({
            icon: 'success',
            title: 'Sucursal agregada',
            text: 'Sucusarl agregada correctamente',
            confirmButtonText: 'Aceptar'
            
        });
        };
        reader.readAsDataURL(logotipoRuta.files[0]);
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Campos obligatorios',
            text: 'Obligatorio llenar todos los campos',
            confirmButtonText: 'Aceptar'
            
        });
        
         console.log("Todos los campos son obligatorios para agregar una sucursal.");
         
    }
    // habilitar botones
    document.getElementById("btnEliminar").classList.remove("disabled");
    document.getElementById("btnEditar").classList.remove("disabled"); 
    document.getElementById("btnLimpiar").classList.add("disabled");
}




// Función para editar una sucursal
function editarSucursal() {
    if (indexSucursalSeleccionada === -1) {
        Swal.fire({
            icon: 'warning',
            title: 'Selecciona una sucursal',
            text: 'Selecciona una sucursal para editar',
            confirmButtonText: 'Aceptar'
            
        });
        console.log("No se ha seleccionado la sucursal");
        return;
    }
    // Deshabilitar botones
    document.getElementById("btnEliminar").classList.add("disabled");
    document.getElementById("btnEditar").classList.add("disabled"); 
    let nombreS = document.getElementById("nombreS").value.trim();
    let ubicacion = document.getElementById("ubicacion").value.trim();
    let gps = document.getElementById("gps").value.trim();
    let horarioApertura = document.getElementById("horarioApertura").value.trim();
    let horarioCierre = document.getElementById("horarioCierre").value.trim();
    let url = document.getElementById("url").value.trim();
    let logotipoRuta = document.getElementById("logotipoRuta").files[0];
    let logotipo = document.getElementById("logotipo").src;
    let estatus = document.getElementById("estatus").value.trim();

    // Validar que todos los campos obligatorios estén llenos
    if (nombreS && ubicacion && gps && horarioApertura && horarioCierre && url && logotipoRuta) {
        // Si se ha seleccionado un nuevo logotipo, leerlo como DataURL
        if (logotipoRuta) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Actualizar los datos de la sucursal seleccionada en el arreglo
                sucursales[indexSucursalSeleccionada] = {
                    nombreS: nombreS,
                    ubicacion: ubicacion,
                    gps: gps,
                    horarioApertura: horarioApertura,
                    horarioCierre: horarioCierre,
                    logotipo: e.target.result,
                    url: url,
                    estatus: estatus
                };

                // Actualizar la tabla
                cargarSucursalesEnTabla();

                limpiarSucursal();
            };
            reader.readAsDataURL(logotipoRuta);
        } else {
            // Actualizar los datos de la sucursal seleccionada en el arreglo
            sucursales[indexSucursalSeleccionada] = {
                nombreS: nombreS,
                ubicacion: ubicacion,
                gps: gps,
                horarioApertura: horarioApertura,
                horarioCierre: horarioCierre,
                logotipo: logotipo,
                url: url,
                estatus: estatus
            };

            // Actualizar la tabla
            cargarSucursalesEnTabla();

          
                // Mensajes de consola y alerta para confirmar la actualización
                console.log("Sucursal editada exitosamente:", sucursales[indexSucursalSeleccionada]);
                Swal.fire({
                    icon: 'warning',
                    title: 'Sucursal editada correctamente',
                    text: 'Se han realizado los cambios',
                    confirmButtonText: 'Aceptar'

                });
        }
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Campos obligatorios',
            text: 'Obligatorio llenar todos los campos',
            confirmButtonText: 'Aceptar'
            
        });
        
         console.log("Todos los campos son obligatorios para editar una sucursal.");
         
    }
    document.getElementById("btnEliminar").classList.remove("disabled");
    document.getElementById("btnEditar").classList.remove("disabled"); 
    document.getElementById("btnLimpiar").classList.remove("disabled");

}



// Función para limpiar los campos del formulario
function limpiarSucursal() {
    
    document.getElementById("nombreS").value = "";
    document.getElementById("ubicacion").value = "";
    document.getElementById("gps").value = "";
    document.getElementById("horarioApertura").value = "";
    document.getElementById("horarioCierre").value = "";
    document.getElementById("logotipo").src = "img/nada.jpeg";
    document.getElementById("url").value = "";
    document.getElementById("logotipoRuta").value = "";
    document.getElementById("searchInput").value = ""; // Limpiar el campo de búsqueda
    document.getElementById("estatus").value = "";
    // Limpiar la lista de resultados de búsqueda
    document.getElementById("searchResults").innerHTML = ""; // Limpiar la lista
    
     // Deshabilitar botones
    document.getElementById("btnEliminar").classList.remove("disabled");
    document.getElementById("btnEditar").classList.remove("disabled"); 
    document.getElementById("btnAgregar").classList.remove("disabled"); 
}

function eliminarSucursal() {
    // Verificar si una sucursal está seleccionada
    if (indexSucursalSeleccionada === -1) {
        Swal.fire({
            icon: 'warning',
            title: 'Selecciona una sucursal',
            text: 'Selecciona una sucursal para eliminar',
            confirmButtonText: 'Aceptar'
        });
        console.log("No se ha seleccionado la sucursal");
        return;
    }

    // Confirmar antes de cambiar el estatus a "baja"
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción marcará la sucursal como baja.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, dar de baja',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Cambiar el estatus a "baja"
            sucursales[indexSucursalSeleccionada].estatus = "baja";
            console.log("Sucursal desactivada exitosamente.");
            Swal.fire({
                icon: 'success',
                title: 'Sucursal Inactivada',
                text: 'Se ha marcado como baja la sucursal exitosamente',
                confirmButtonText: 'Aceptar'
            });

            // Limpiar los campos del formulario
            limpiarSucursal();

            // Recargar la tabla
            cargarSucursalesEnTabla();

            // Reiniciar el índice de la sucursal seleccionada
            indexSucursalSeleccionada = -1;
        }
    });
}


function buscarSucursal() {
    let searchInput = document.getElementById("searchInput").value.toLowerCase();
    let searchField = document.getElementById("searchField").value;
    let searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = ""; // Limpiar los resultados anteriores
    
    document.getElementById("btnLimpiar").classList.remove("disabled");// se activa
    document.getElementById("btnAgregar").classList.add("disabled");// se desactiva

    let resultadosEncontrados = sucursales
        .map((sucursal, i) => {
            let campoBusqueda = searchField === "nombre" ? sucursal.nombreS.toLowerCase() : sucursal.ubicacion.toLowerCase();
            if (campoBusqueda.includes(searchInput)) {
                return {
                    id: i + 1, // ID de la sucursal
                    nombre: sucursal.nombreS,
                    ubicacion: sucursal.ubicacion,
                    index: i
                };
            }
            return null;
        })
        .filter(result => result !== null);

    if (resultadosEncontrados.length === 0) {
        searchResults.innerHTML = "<li class='list-group-item'>No se encontraron sucursales que coincidan con la búsqueda.</li>";
        return;
    }

    resultadosEncontrados.forEach(result => {
        let item = `<li class='list-group-item' onclick='selectSucursal(${result.index})'>
                        <strong>${result.id}</strong> - ${result.nombre} (${result.ubicacion})
                    </li>`;
        searchResults.innerHTML += item;
    });
    
}

function despliegaFoto(event) {
    const input = event.target;
    const reader = new FileReader();
                
    reader.onload = function() {
        const imgElement = document.getElementById('logotipo');
        imgElement.src = reader.result;
        };
                
        reader.readAsDataURL(input.files[0]);
        }
// Llamar a la función para cargar las sucursales en la tabla al cargar la página
window.onload = function() {
    
    cargarSucursalesEnTabla();
};