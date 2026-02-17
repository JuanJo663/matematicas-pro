// ==========================================
// 1. CONTROL DE PESTAÑAS (Navegación)
// ==========================================
function openTab(tabId) {
    // Ocultar todos los contenidos de las calculadoras
    document.querySelectorAll('.content').forEach(c => {
        c.classList.remove('active');
    });
    // Desactivar todos los botones de las pestañas
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
    });
    
    // Mostrar la pestaña seleccionada y marcar su botón
    document.getElementById(tabId).classList.add('active');
    if (event) {
        event.currentTarget.classList.add('active');
    }
}

// ==========================================
// 2. SISTEMA DE HISTORIAL Y ACUMULACIÓN
// ==========================================
function guardarEnHistorial(titulo, htmlContenido) {
    const lista = document.getElementById('lista-calculos');
    
    // Si es el primer cálculo, eliminamos el mensaje de "Aún no hay cálculos"
    if (lista.innerHTML.includes("Aún no hay cálculos")) {
        lista.innerHTML = "";
    }

    // Creamos un nuevo bloque para este cálculo específico
    const nuevoItem = document.createElement('div');
    nuevoItem.className = 'calculo-item';
    
    const fecha = new Date().toLocaleString();
    
    // Estructura del bloque en el historial (compatible con la impresión)
    nuevoItem.innerHTML = `
        <div style="border-bottom: 1px solid #eee; margin-bottom: 10px; padding-bottom: 5px;">
            <strong style="color: #2c3e50;">${titulo}</strong> 
            <small style="color: #7f8c8d; float: right;">${fecha}</small>
        </div>
        <div class="detalle-calculo">
            ${htmlContenido}
        </div>
    `;
    
    // Agregamos al inicio para ver lo más reciente arriba (prepend)
    lista.prepend(nuevoItem);
    
    // Importante: Procesar el LaTeX dentro del nuevo elemento del historial
    if (window.MathJax) {
        MathJax.typesetPromise([nuevoItem]).catch((err) => console.log("Error MathJax:", err));
    }
}

// ==========================================
// 3. FUNCIONES DE IMPRESIÓN Y LIMPIEZA
// ==========================================
function imprimir() {
    window.print();
}

function borrarTodo() {
    if (confirm("¿Deseas limpiar el historial y todos los resultados actuales?")) {
        // Limpiar la lista acumulada
        document.getElementById('lista-calculos').innerHTML = 
            '<p style="color: #888;" class="no-print">Aún no hay cálculos realizados.</p>';
        
        // Limpiar y ocultar los cuadros de resultado individuales
        const resultadosIds = ['res_binomial', 'res_normal', 'res_poisson'];
        resultadosIds.forEach(id => {
            const div = document.getElementById(id);
            if (div) {
                div.innerHTML = "";
                div.style.display = "none";
            }
        });

        // Limpiar todos los campos de entrada (inputs)
        document.querySelectorAll('input').forEach(input => {
            input.value = "";
        });
    }
}
function toggleNormalInputs() {
    const tipo = document.getElementById('norm_tipo').value;
    document.getElementById('norm_input_simple').style.display = (tipo === 'entre') ? 'none' : 'block';
    document.getElementById('norm_input_entre').style.display = (tipo === 'entre') ? 'grid' : 'none';
}

function abrirModalApoyo() {
    document.getElementById('modalApoyo').style.display = 'flex';
}

function cerrarModalApoyo() {
    document.getElementById('modalApoyo').style.display = 'none';
}

// Cerrar si el usuario hace clic fuera de la cajita blanca
window.onclick = function(event) {
    const modal = document.getElementById('modalApoyo');
    if (event.target == modal) {
        cerrarModalApoyo();
    }
}