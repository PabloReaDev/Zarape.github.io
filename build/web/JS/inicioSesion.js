/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */
function iniciarSesion() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin123') {
        window.location.href = 'modulos/Menu_Principal/MenuPrincipal.html'; // URL de la página de destino
    } else {
        alert('Usuario o contraseña incorrectos');
    }
}