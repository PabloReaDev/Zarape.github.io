/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


/* global Swal */
//Desactivar botones
/* global Swal */

// Desactivar botones
document.getElementById("btnModificar").classList.add("disabled");
document.getElementById("btnEliminar").classList.add("disabled");
document.getElementById("btnLimpiar").classList.add("disabled");

let indexUsuarioSeleccionada = -1; // Inicialmente, ningún usuario está seleccionado
let usuarios = []; // Arreglo para almacenar los usuarios

const path = "http://localhost:8080/zarape_5/modulos/catalogoUsuarios/";

fetch(path + "datosUsuarios.json")
    .then(response => response.json())
    .then(jsondata => {
        usuarios = jsondata;
        console.log(usuarios);
        cargarUsuariosEnTabla();
    })
    .catch(error => {
        console.error('Error al cargar los datos de los usuarios:', error);
    });

function cargarUsuariosEnTabla() {
    let tablaUsuarios = document.getElementById("tblUsers");

    // Limpiar la tabla antes de volver a llenar
    tablaUsuarios.innerHTML = "";

    // Iterar sobre el arreglo de usuarios y crear filas en la tabla
    for (let i = 0; i < usuarios.length; i++) {
        let usuario = usuarios[i];
        let id = i + 1; // Calcular el ID sumando 1 al índice
        let fila = `<tr onclick="selectUser(${i})">
                        <td>${id}</td>
                        <td>${usuario.name}</td>
                        <td>${usuario.password}</td>
                        <td>${usuario.estatus}</td>
                    </tr>`;
        tablaUsuarios.innerHTML += fila;
    }
}

function selectUser(index) {
    // Habilitar el campo de contraseña solo para modificación
    document.getElementById("userPassword").readOnly = false;

    document.getElementById("userName").value = usuarios[index].name;
    document.getElementById("userPassword").value = usuarios[index].password;
    document.getElementById("estatus").value= usuarios[index].estatus;
    indexUsuarioSeleccionada = index;

    document.getElementById("btnModificar").classList.remove("disabled");
    document.getElementById("btnEliminar").classList.remove("disabled");
    document.getElementById("btnLimpiar").classList.remove("disabled");
    document.getElementById("btnAgregar").classList.add("disabled");
}

function generarContrasenaAleatoria() {
    let caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let contrasena = '';
    for (let i = 0; i < 12; i++) {
        let randomIndex = Math.floor(Math.random() * caracteres.length);
        contrasena += caracteres.charAt(randomIndex);
    }
    return contrasena;
}

function agregarUsuario() {
    document.getElementById("userPassword").readOnly = true;
    let nombre = document.getElementById("userName").value;
    let estatus = document.getElementById("estatus").value;

    if (nombre.trim() === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Campos obligatorios',
            text: 'Necesitas llenar todos los campos',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    let nuevaContraseña = generarContrasenaAleatoria();
    let nuevoUsuario = {
        id: usuarios.length + 1,
        name: nombre,
        password: nuevaContraseña,
        estatus: estatus
    };

    usuarios.push(nuevoUsuario);
    cargarUsuariosEnTabla();

    // Limpiar campos del formulario después de agregar el usuario
    document.getElementById("userName").value = '';
    document.getElementById("userPassword").value = '';

    Swal.fire({
        icon: 'success',
        title: 'Usuario agregado',
        text: 'La contraseña generada es: ' + nuevaContraseña,
        confirmButtonText: 'Aceptar'
    });

    limpiar();
}

function modificarUsuario() {
    // Obtener datos del formulario
    let nombre = document.getElementById("userName").value.trim();
    let contrasena = document.getElementById("userPassword").value.trim();
    let estatus = document.getElementById("estatus").value.trim();

    // Validar que todos los campos obligatorios estén llenos
    if (nombre && contrasena) {
        // Actualizar los datos del usuario seleccionado en el arreglo
        usuarios[indexUsuarioSeleccionada] = {
            id: usuarios[indexUsuarioSeleccionada].id, // Mantener el ID
            name: nombre,
            password: contrasena,
            estatus: estatus
        };

        // Actualizar la tabla
        cargarUsuariosEnTabla();

        // Mensajes de consola y alerta para confirmar la actualización
        console.log("Usuario modificado exitosamente:", usuarios[indexUsuarioSeleccionada]);
        Swal.fire({
            icon: 'success',
            title: 'Usuario modificado correctamente',
            text: 'Se han realizado los cambios',
            confirmButtonText: 'Aceptar'
        });

        // Restablecer la selección de usuario
        indexUsuarioSeleccionada = -1;
        limpiar();
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Campos obligatorios',
            text: 'Todos los campos obligatorios deben ser llenados',
            confirmButtonText: 'Aceptar'
        });

        console.log("Todos los campos obligatorios deben ser llenados para modificar un usuario.");
    }
}

function eliminarUsuario() {
    // Verificar si se ha seleccionado un usuario
    if (indexUsuarioSeleccionada === -1) {
        Swal.fire({
            icon: 'warning',
            title: 'Seleccionar usuario',
            text: 'Debes seleccionar un usuario para eliminar',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Mostrar confirmación antes de cambiar el estatus
    Swal.fire({
        title: '¿Estás seguro?',
        text: "El usuario será marcado como inactivo.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, inactivar',
        cancelButtonText: 'Cancelar'
    }).then(result => {
        if (result.isConfirmed) {
            // Cambiar el estatus del usuario a 'inactivo'
            usuarios[indexUsuarioSeleccionada].estatus = 'inactivo';
            limpiar();
            cargarUsuariosEnTabla();

            // Mensaje de éxito
            Swal.fire({
                icon: 'success',
                title: 'Usuario Inactivado',
                text: 'El usuario ha sido marcado como inactivo correctamente',
                confirmButtonText: 'Aceptar'
            });

            // Restablecer la selección de usuario
            indexUsuarioSeleccionada = -1;
        }
    });
}


function limpiar() {
    // Limpiar campos del formulario
    document.getElementById("userName").value = "";
    document.getElementById("userPassword").value = "";
    document.getElementById("estatus").value = "";
    document.getElementById("searchInput").value = ""; // Limpiar el campo de búsqueda
    document.getElementById("estatus").value = "";
    // Limpiar la lista de resultados de búsqueda
    document.getElementById("searchResults").innerHTML = ""; // Limpiar la lista

    

    // Deshabilitar botones
    document.getElementById("btnAgregar").classList.remove("disabled");
    document.getElementById("btnModificar").classList.add("disabled");
    document.getElementById("btnEliminar").classList.add("disabled");
    document.getElementById("btnLimpiar").classList.add("disabled");

    // Restablecer la selección de usuario
    indexUsuarioSeleccionada = -1;
}

function buscarUsuarios() {
    let searchInput = document.getElementById("searchInput").value.toLowerCase();
    let searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = ""; // Limpiar los resultados anteriores
    
    document.getElementById("btnLimpiar").classList.remove("disabled");// se activa
    document.getElementById("btnAgregar").classList.add("disabled");// se desactiva

    let resultadosEncontrados = usuarios
        .map((usuario, i) => {
            let nombreUsuario = usuario.name.toLowerCase();

            if (nombreUsuario.includes(searchInput)) {
                return {
                    id: usuario.id,
                    name: usuario.name,
                    password: usuario.password,
                    estatus:usuario.estatus,
                    index: i
                };
            }
            return null;
        })
        .filter(result => result !== null);

    if (resultadosEncontrados.length === 0) {
        searchResults.innerHTML = "<li class='list-group-item'>No se encontraron usuarios que coincidan con la búsqueda.</li>";
        return;
    }

    resultadosEncontrados.forEach(result => {
        let item = `<li class='list-group-item' onclick='selectUser(${result.index})'>
                         - Nombre: ${result.name} (Contraseña: ${result.password})
                    </li>`;
        searchResults.innerHTML += item;
    });
}
