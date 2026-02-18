/* ==========================================================================
   LABORATORIO ESTADÍSTICO PRO - NÚCLEO DE LA APLICACIÓN (CORE V5 - FOTO)
   ========================================================================== */

const Core = {
    modules: {},

    registerModule: (id, moduleObj) => { Core.modules[id] = moduleObj; },

    loadModule: (id) => {
        const workspace = document.getElementById('workspace');
        if (!id) { workspace.innerHTML = ''; return; }
        
        if (Core.modules[id]) {
            workspace.innerHTML = Core.modules[id].render();
            if (Core.modules[id].init) Core.modules[id].init();
            if (window.MathJax && window.MathJax.typesetPromise) {
                MathJax.typesetPromise([workspace]).catch(err => console.log(err));
            }
        } else {
            workspace.innerHTML = `<div class="empty-state">⚠️ El módulo "${id}" está en construcción.</div>`;
        }
    },

    addReportItem: (data) => {
        const reportSection = document.getElementById('report-section');
        const cardId = 'card-' + Date.now();
        const chartId = 'chart-' + Date.now();
        
        const card = document.createElement('article');
        card.className = 'report-card';
        card.id = cardId;

        let htmlContent = `
            <div class="report-header">
                <h3>${data.title}</h3>
                <span class="badge">${data.params}</span>
            </div>
            <div class="report-body">
        `;

        if (data.equations && data.equations.length > 0) {
            htmlContent += `<div class="math-block">`;
            data.equations.forEach(eq => { htmlContent += `$$ ${eq} $$`; });
            htmlContent += `</div>`;
        }

        if (data.steps && data.steps.length > 0) {
            htmlContent += `<div class="procedure-list"><p><strong>Procedimiento:</strong></p><ul>`;
            data.steps.forEach(step => { htmlContent += `<li>${step}</li>`; });
            htmlContent += `</ul></div>`;
        }

        if (data.customHTML) {
            htmlContent += `<div class="custom-content">${data.customHTML}</div>`;
        }

        if (data.tableHTML && data.plot) {
            htmlContent += `
                <div class="split-layout">
                    <div class="table-wrapper">${data.tableHTML}</div>
                    <div id="${chartId}" class="chart-container"></div>
                </div>`;
        } 
        else if (data.tableHTML) htmlContent += `<div class="table-wrapper">${data.tableHTML}</div>`;
        else if (data.plot) htmlContent += `<div id="${chartId}" class="chart-container"></div>`;

        if (data.result) htmlContent += `<div class="result-highlight">Resultado Final: ${data.result}</div>`;

        htmlContent += `</div>`;
        card.innerHTML = htmlContent;
        reportSection.prepend(card);

        // --- RENDERIZADO DEL GRÁFICO + GENERACIÓN DE FOTO ---
        if (data.plot) {
            const layout = { 
                ...data.plot.layout, 
                autosize: true, 
                font: { family: 'Inter, sans-serif' },
                margin: { t: 40, r: 20, l: 40, b: 40 }
            };
            const config = { staticPlot: false, responsive: true, displayModeBar: false }; 

            Plotly.newPlot(chartId, data.plot.data, layout, config).then(function(gd) {
                // AQUÍ ESTÁ EL TRUCO: Generar una imagen estática para imprimir
                Plotly.toImage(gd, {format: 'png', width: 500, height: 350})
                    .then(function(url) {
                        const img = document.createElement('img');
                        img.src = url;
                        img.className = 'chart-snapshot'; // Clase especial del CSS
                        document.getElementById(chartId).appendChild(img);
                    });
            });
        }

        if (window.MathJax && window.MathJax.typesetPromise) {
            MathJax.typesetPromise([card]).catch((err) => console.error(err));
        }
    },

    printReport: () => {
        const dateSpan = document.getElementById('print-date');
        if (dateSpan) {
            const now = new Date();
            dateSpan.innerText = now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        }
        window.print();
    },

    clearReport: () => {
        if (confirm("¿Estás seguro de borrar todo el historial?")) document.getElementById('report-section').innerHTML = "";
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const selector = document.getElementById('module-selector');
    if (selector) {
        selector.addEventListener('change', (e) => { Core.loadModule(e.target.value); });
        if (selector.value) Core.loadModule(selector.value);
    }
});