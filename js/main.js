/**
 * main.js - Controlador de Interfaz
 * Maneja la navegación entre las diferentes calculadoras estadísticas.
 */

function openTab(tabId) {
    // 1. Ocultar todos los contenidos de pestañas
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => {
        content.classList.remove('active');
    });

    // 2. Desactivar todos los botones
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // 3. Mostrar el contenido seleccionado
    document.getElementById(tabId).classList.add('active');

    // 4. Activar el botón que recibió el clic
    event.currentTarget.classList.add('active');
    
    console.log("Cambiando a la pestaña: " + tabId);
}