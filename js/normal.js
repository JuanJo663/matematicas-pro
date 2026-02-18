/* ==========================================================================
   MÓDULO: DISTRIBUCIÓN NORMAL (V15 - Estándar Platino)
   Calcula: Probabilidades (CDF) y grafica la Campana de Gauss con áreas
   ========================================================================== */

const NormalModule = {

    render: () => {
        return `
        <div class="module-card">
            <h3 style="color:var(--primary); border-bottom:1px solid var(--border); padding-bottom:10px; margin-top:0;">
                <i class="fa-solid fa-bell"></i> Distribución Normal
            </h3>
            
            <div style="background:#f8fafc; padding:10px; border-radius:8px; text-align:center; margin-bottom:20px; font-size:0.9rem;">
                $$ Z = \\frac{x - \\mu}{\\sigma} $$
                <div style="font-size:0.8rem; color:#666; margin-top:5px;">(Estandarización)</div>
            </div>
            
            <div class="form-grid">
                <div class="input-group">
                    <label>Media <span style="text-transform:none; font-family:serif;">( $\\mu$ )</span></label>
                    <input type="number" id="nm_mu" value="0" placeholder="Ej: 0">
                </div>
                <div class="input-group">
                    <label>Desv. Estándar <span style="text-transform:none; font-family:serif;">( $\\sigma$ )</span></label>
                    <input type="number" id="nm_sigma" value="1" min="0.0001" step="0.1" placeholder="Ej: 1">
                </div>
                
                <div class="input-group" style="grid-column: span 2;">
                    <label>Tipo de Cálculo</label>
                    <select id="nm_type" onchange="NormalModule.toggleInputs()">
                        <optgroup label="Probabilidad Acumulada">
                            <option value="menor" selected>Menor que (X < k)</option>
                            <option value="mayor">Mayor que (X > k)</option>
                        </optgroup>
                        <optgroup label="Intervalos">
                            <option value="entre">Entre (a < X < b)</option>
                            <option value="colas">Fuera de (X < a ó X > b)</option>
                        </optgroup>
                    </select>
                </div>

                <div id="nm_input_k" class="input-group">
                    <label>Valor <span style="text-transform:none; font-family:serif;">( k )</span></label>
                    <input type="number" id="nm_val_k" value="1.96">
                </div>

                <div id="nm_input_range" class="input-group" style="display:none; grid-column: span 2;">
                    <div style="display:flex; gap:15px;">
                        <div style="flex:1">
                            <label>Límite Inferior <span style="text-transform:none; font-family:serif;">( a )</span></label>
                            <input type="number" id="nm_val_a" value="-1.96">
                        </div>
                        <div style="flex:1">
                            <label>Límite Superior <span style="text-transform:none; font-family:serif;">( b )</span></label>
                            <input type="number" id="nm_val_b" value="1.96">
                        </div>
                    </div>
                </div>
            </div>

            <div style="display:flex; gap:15px; margin-top:20px;">
                <button class="btn-action" onclick="NormalModule.calculate()" style="flex:1; margin-top:0;">
                    <i class="fa-solid fa-calculator"></i> Calcular Resultado
                </button>
                <button class="btn-secondary" onclick="NormalModule.generateCurve()" style="flex:1; border: 2px solid var(--primary); color: var(--primary);">
                    <i class="fa-solid fa-chart-area"></i> Ver Curva Gráfica
                </button>
            </div>
        </div>
        `;
    },

    init: () => { NormalModule.toggleInputs(); },

    toggleInputs: () => {
        const type = document.getElementById('nm_type').value;
        const divK = document.getElementById('nm_input_k');
        const divRange = document.getElementById('nm_input_range');
        if (type === 'entre' || type === 'colas') { 
            divK.style.display = 'none'; divRange.style.display = 'block'; 
        } else { 
            divK.style.display = 'block'; divRange.style.display = 'none'; 
        }
    },

    // --- MATEMÁTICAS ---
    
    // CDF Normal Estándar (Aproximación de Abramowitz & Stegun)
    cdf: (x, mu, sigma) => {
        const z = (x - mu) / sigma;
        const t = 1 / (1 + 0.2316419 * Math.abs(z));
        const d = 0.3989423 * Math.exp(-z * z / 2);
        let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        if (z > 0) prob = 1 - prob;
        return prob;
    },

    // PDF Normal (Para dibujar la altura de la curva)
    pdf: (x, mu, sigma) => {
        return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    },

    // CÁLCULO SOLO TEXTO
    calculate: () => {
        const mu = parseFloat(document.getElementById('nm_mu').value);
        const sigma = parseFloat(document.getElementById('nm_sigma').value);
        const type = document.getElementById('nm_type').value;

        if (isNaN(mu) || isNaN(sigma) || sigma <= 0) return alert("Revisa Media y Desviación (σ > 0).");

        let res = 0, eqs = [], steps = [];
        let label = "";
        
        let verticalSumHTML = `<div class="vertical-sum-container">`;

        if (type === 'entre' || type === 'colas') {
            const a = parseFloat(document.getElementById('nm_val_a').value);
            const b = parseFloat(document.getElementById('nm_val_b').value);
            if(a >= b) return alert("El límite inferior 'a' debe ser menor que 'b'.");

            // Paso 1: Estandarización
            const zA = (a - mu) / sigma;
            const zB = (b - mu) / sigma;
            
            steps.push(`<strong>Paso 1:</strong> Estandarizar los límites.`);
            steps.push(`$Z_1 = \\frac{${a} - (${mu})}{${sigma}} = ${zA.toFixed(4)}$`);
            steps.push(`$Z_2 = \\frac{${b} - (${mu})}{${sigma}} = ${zB.toFixed(4)}$`);
            
            // Paso 2: Buscando Probabilidades
            const pA = NormalModule.cdf(a, mu, sigma);
            const pB = NormalModule.cdf(b, mu, sigma);
            
            steps.push(`<strong>Paso 2:</strong> Buscar probabilidades acumuladas.`);
            steps.push(`$P(Z < ${zA.toFixed(2)}) = ${pA.toFixed(5)}$`);
            steps.push(`$P(Z < ${zB.toFixed(2)}) = ${pB.toFixed(5)}$`);

            if(type === 'entre') {
                res = pB - pA;
                label = `P(${a} < X < ${b})`;
                eqs.push(`= P(Z_{${a}} < Z < Z_{${b}})`);
                eqs.push(`= ${pB.toFixed(5)} - ${pA.toFixed(5)}`);
                
                verticalSumHTML += `
                    <div class="v-row"><span class="v-formula">Límite Superior ($X=${b}$)</span><span class="v-value">${pB.toFixed(5)}</span></div>
                    <div class="v-row"><span class="v-formula">Límite Inferior ($X=${a}$)</span><span class="v-value">-${pA.toFixed(5)}</span></div>
                `;
            } else {
                // Colas
                res = 1 - (pB - pA);
                label = `P(X < ${a} \\cup X > ${b})`;
                eqs.push(`= 1 - P(${a} < X < ${b})`);
                eqs.push(`= 1 - (${pB.toFixed(5)} - ${pA.toFixed(5)})`);
                
                verticalSumHTML += `
                    <div class="v-row"><span class="v-formula">Área Central</span><span class="v-value">${(pB-pA).toFixed(5)}</span></div>
                    <div class="v-row"><span class="v-formula">1 - Área Central</span><span class="v-value">${res.toFixed(5)}</span></div>
                `;
            }

        } else {
            const k = parseFloat(document.getElementById('nm_val_k').value);
            const prob = NormalModule.cdf(k, mu, sigma);
            const z = (k - mu) / sigma;

            steps.push(`<strong>Paso 1:</strong> Estandarización.`);
            steps.push(`$Z = \\frac{${k} - (${mu})}{${sigma}} = ${z.toFixed(4)}$`);

            if (type === 'menor') {
                res = prob;
                label = `P(X < ${k})`;
                eqs.push(`= P(Z < ${z.toFixed(2)})`);
                verticalSumHTML += `<div class="v-row"><span class="v-formula">Lectura directa de tabla Z</span><span class="v-value">${res.toFixed(5)}</span></div>`;
            } else {
                res = 1 - prob;
                label = `P(X > ${k})`;
                eqs.push(`= 1 - P(X < ${k})`);
                eqs.push(`= 1 - ${prob.toFixed(5)}`);
                verticalSumHTML += `<div class="v-row"><span class="v-formula">Complemento (1 - P)</span><span class="v-value">${res.toFixed(5)}</span></div>`;
            }
        }
        
        verticalSumHTML += `<div class="v-total-line"><span class="v-formula">Resultado</span><span class="v-value">${res.toFixed(5)}</span></div></div>`;

        Core.addReportItem({
            title: "Cálculo Normal Estándar",
            params: `μ=${mu}, σ=${sigma} | ${label.replace(/\\le/g, '≤').replace(/\\ge/g, '≥')}`,
            equations: eqs,
            steps: steps,
            customHTML: verticalSumHTML,
            result: res.toFixed(5),
            plot: null
        });
    },

    // CÁLCULO + GRÁFICO (MODO FOTO)
    generateCurve: () => {
        const mu = parseFloat(document.getElementById('nm_mu').value);
        const sigma = parseFloat(document.getElementById('nm_sigma').value);
        const type = document.getElementById('nm_type').value;
        
        // Rango de graficación: μ ± 4σ (99.99%)
        const startX = mu - 4*sigma;
        const endX = mu + 4*sigma;
        
        // Datos de la curva completa
        const x = [], y = [];
        const step = (endX - startX) / 100;
        for(let i = startX; i <= endX; i += step) {
            x.push(i);
            y.push(NormalModule.pdf(i, mu, sigma));
        }

        // Datos del área sombreada
        let k, a, b;
        const xFill = [], yFill = [];

        if(type === 'entre' || type === 'colas') {
            a = parseFloat(document.getElementById('nm_val_a').value);
            b = parseFloat(document.getElementById('nm_val_b').value);
            
            for(let i = startX; i <= endX; i += step) {
                let inside = (i >= a && i <= b);
                if ((type === 'entre' && inside) || (type === 'colas' && !inside)) {
                    xFill.push(i); yFill.push(NormalModule.pdf(i, mu, sigma));
                } else {
                    // Truco para romper el relleno en las colas
                    if (type === 'colas' && inside) { xFill.push(i); yFill.push(0); }
                }
            }
        } else {
            k = parseFloat(document.getElementById('nm_val_k').value);
            for(let i = startX; i <= endX; i += step) {
                if ((type === 'menor' && i <= k) || (type === 'mayor' && i >= k)) {
                    xFill.push(i); yFill.push(NormalModule.pdf(i, mu, sigma));
                }
            }
        }

        const traceCurve = {
            x: x, y: y, mode: 'lines', line: { color: '#1a365d', width: 2 },
            name: 'Densidad'
        };

        const traceArea = {
            x: xFill, y: yFill, fill: 'tozeroy', fillcolor: 'rgba(43, 108, 176, 0.4)', 
            line: { width: 0 }, name: 'Probabilidad', hoverinfo: 'none'
        };

        const plotData = {
            data: [traceCurve, traceArea],
            layout: { 
                title: { text: `Curva Normal (μ=${mu}, σ=${sigma})`, font: { size: 12 } },
                xaxis: { title: 'X', showgrid:true },
                yaxis: { showgrid:false, showticklabels: false }, 
                
                // MEDIDAS FIJAS PARA IMPRESIÓN (FOTO)
                autosize: false, 
                width: 400, height: 300,
                margin: { l:20, r:20, t:40, b:30 },
                showlegend: false
            }
        };

        // Generamos un pequeño resumen HTML para acompañar la curva
        const summaryHTML = `
            <div style="padding:10px; font-size:0.9rem;">
                <p><strong>Parámetros:</strong></p>
                <ul style="padding-left:20px; color:#4a5568;">
                    <li>Media ($\\mu$): ${mu}</li>
                    <li>Desv. ($\\sigma$): ${sigma}</li>
                </ul>
                <div style="margin-top:15px; padding:10px; background:#ebf8ff; border-radius:5px; color:#2c5282; font-size:0.85rem;">
                    <i class="fa-solid fa-info-circle"></i> El área sombreada en azul representa la probabilidad calculada.
                </div>
            </div>`;

        Core.addReportItem({
            title: "Gráfico de Campana",
            params: `μ=${mu}, σ=${sigma}`,
            tableHTML: summaryHTML, // Usamos la columna izquierda para texto
            plot: plotData, // FOTO AUTOMÁTICA
            result: null
        });
    }
};

if (typeof Core !== 'undefined') { Core.registerModule('normal', NormalModule); }