/* ==========================================================================
   MÓDULO: DISTRIBUCIÓN GEOMÉTRICA (V15 - Estándar Platino)
   Fórmula: P(X=k) = (1-p)^(k-1) * p  (Intentos hasta el primer éxito)
   ========================================================================== */

const GeometricModule = {

    render: () => {
        return `
        <div class="module-card">
            <h3 style="color:var(--primary); border-bottom:1px solid var(--border); padding-bottom:10px; margin-top:0;">
                <i class="fa-solid fa-bullseye"></i> Distribución Geométrica
            </h3>
            
            <div style="background:#f8fafc; padding:10px; border-radius:8px; text-align:center; margin-bottom:20px; font-size:0.9rem;">
                $$ P(X=k) = (1-p)^{k-1} \\cdot p $$
                <div style="font-size:0.8rem; color:#666; margin-top:5px;">(Probabilidad de éxito en el intento $k$)</div>
            </div>
            
            <div class="form-grid">
                <div class="input-group">
                    <label>Probabilidad Éxito <span style="text-transform:none; font-family:serif;">( p )</span></label>
                    <input type="number" id="gm_p" value="0.5" step="0.1" min="0" max="1" placeholder="Ej: 0.5">
                </div>
                
                <div class="input-group" style="grid-column: span 2;">
                    <label>Tipo de Cálculo</label>
                    <select id="gm_type" onchange="GeometricModule.toggleInputs()">
                        <optgroup label="Puntos Específicos">
                            <option value="igual">Exactamente en el intento (X = k)</option>
                            <option value="diferente">Diferente del intento (X ≠ k)</option>
                        </optgroup>
                        <optgroup label="Acumulados">
                            <option value="menor">Menos de k intentos (X < k)</option>
                            <option value="menorigual" selected>A lo sumo k intentos (X ≤ k)</option>
                            <option value="mayor">Más de k intentos (X > k)</option>
                            <option value="mayorigual">Al menos k intentos (X ≥ k)</option>
                        </optgroup>
                        <optgroup label="Intervalos">
                            <option value="entre_inclusivo">Entre intentos (a ≤ X ≤ b)</option>
                        </optgroup>
                    </select>
                </div>

                <div id="gm_input_k" class="input-group">
                    <label>Intento <span style="text-transform:none; font-family:serif;">( k )</span></label>
                    <input type="number" id="gm_val_k" value="3" min="1">
                </div>

                <div id="gm_input_range" class="input-group" style="display:none; grid-column: span 2;">
                    <div style="display:flex; gap:15px;">
                        <div style="flex:1">
                            <label>Desde <span style="text-transform:none; font-family:serif;">( a )</span></label>
                            <input type="number" id="gm_val_a" value="2" min="1">
                        </div>
                        <div style="flex:1">
                            <label>Hasta <span style="text-transform:none; font-family:serif;">( b )</span></label>
                            <input type="number" id="gm_val_b" value="5" min="1">
                        </div>
                    </div>
                </div>
            </div>

            <div style="display:flex; gap:15px; margin-top:20px;">
                <button class="btn-action" onclick="GeometricModule.calculate()" style="flex:1; margin-top:0;">
                    <i class="fa-solid fa-calculator"></i> Calcular Resultado
                </button>
                <button class="btn-secondary" onclick="GeometricModule.generateTable()" style="flex:1; border: 2px solid var(--primary); color: var(--primary);">
                    <i class="fa-solid fa-chart-column"></i> Ver Distribución Completa
                </button>
            </div>
        </div>
        `;
    },

    init: () => { GeometricModule.toggleInputs(); },

    toggleInputs: () => {
        const type = document.getElementById('gm_type').value;
        const divK = document.getElementById('gm_input_k');
        const divRange = document.getElementById('gm_input_range');

        if (type.startsWith('entre')) { divK.style.display = 'none'; divRange.style.display = 'block'; }
        else { divK.style.display = 'block'; divRange.style.display = 'none'; }
    },

    // PDF Geométrica: P(X=k) = (1-p)^(k-1) * p
    pdf: (p, k) => {
        if (k < 1) return 0;
        return Math.pow(1 - p, k - 1) * p;
    },

    // CDF Geométrica: P(X <= k) = 1 - (1-p)^k
    cdf: (p, k) => {
        if (k < 1) return 0;
        return 1 - Math.pow(1 - p, k);
    },

    calculate: () => {
        const p = parseFloat(document.getElementById('gm_p').value);
        const type = document.getElementById('gm_type').value;

        if (isNaN(p) || p <= 0 || p > 1) return alert("La probabilidad 'p' debe estar entre 0 y 1.");

        let start=1, end=1, k, a, b, label="", isComp=false;

        // --- Definición de Límites ---
        if (type.startsWith('entre')) {
            a = parseInt(document.getElementById('gm_val_a').value);
            b = parseInt(document.getElementById('gm_val_b').value);
            if(isNaN(a) || isNaN(b) || a<1 || b<a) return alert("Revisa los límites (a debe ser >= 1 y b >= a).");
            
            // Solo implementamos inclusivo para simplificar en geométrica, pero soportamos lógica base
            start=a; end=b; label=`P(${a} \\le X \\le ${b})`;
        } else {
            k = parseInt(document.getElementById('gm_val_k').value);
            if(isNaN(k) || k < 1) return alert("El intento k debe ser >= 1.");

            switch(type) {
                case 'igual': start=k; end=k; label=`P(X = ${k})`; break;
                case 'diferente': isComp=true; label=`P(X \\ne ${k})`; break;
                case 'menor': start=1; end=k-1; label=`P(X < ${k})`; break;
                case 'menorigual': start=1; end=k; label=`P(X \\le ${k})`; break;
                
                case 'mayor': 
                    isComp = true; start=1; end=k; 
                    label=`P(X > ${k}) = 1 - P(X \\le ${k})`; 
                    break;
                case 'mayorigual': 
                    isComp = true; start=1; end=k-1;
                    label=`P(X \\ge ${k}) = 1 - P(X \\le ${k-1})`; 
                    break;
            }
        }

        if(!isComp && start < 1) start = 1;

        let total = 0, eqs = [label];
        const q = 1 - p;
        let verticalSumHTML = `<div class="vertical-sum-container">`;

        // --- LÓGICA DE CÁLCULO ---
        if (type === 'diferente') {
            let val = GeometricModule.pdf(p, k);
            total = 1 - val;
            eqs.push(`= 1 - P(X=${k})`);
            verticalSumHTML += `
                <div class="v-row">
                    <span class="v-formula">\\( P(X=${k}) = (1-${p})^{${k}-1} \\cdot ${p} \\)</span>
                    <span class="v-value">\\( ${val.toFixed(5)} \\)</span>
                </div>
                <div class="v-total-line">
                    <span class="v-formula">\\( 1 - ${val.toFixed(5)} \\)</span>
                    <span class="v-value">\\( ${total.toFixed(5)} \\)</span>
                </div>`;
        } 
        else if (type === 'mayor' || type === 'mayorigual') {
            // Usamos CDF para mayor eficiencia en acumulados inversos
            // P(X > k) = (1-p)^k  <-- Fórmula directa muy útil
            // Pero mantendremos el formato de suma para consistencia visual si es corto
            
            // Si el rango a restar es pequeño, mostramos la suma
            if (end <= 5) {
                let accum = 0;
                let sumStr = [];
                for(let i=1; i<=end; i++) {
                    let val = GeometricModule.pdf(p, i);
                    accum += val;
                    sumStr.push(`P(X=${i})`);
                    verticalSumHTML += `
                        <div class="v-row">
                            <span class="v-formula">\\( P(X=${i}) = (${q.toFixed(2)})^{${i-1}} \\cdot ${p} \\)</span>
                            <span class="v-value">\\( ${val.toFixed(5)} \\)</span>
                        </div>`;
                }
                total = 1 - accum;
                eqs.push(`= 1 - [${sumStr.join(" + ")}]`);
                verticalSumHTML += `
                    <div class="v-total-line">
                        <span class="v-formula">\\( 1 - ${accum.toFixed(5)} \\)</span>
                        <span class="v-value">\\( ${total.toFixed(5)} \\)</span>
                    </div>`;
            } else {
                // Si es largo, usamos fórmula directa del complemento
                // P(X > k) = q^k
                let limitK = (type === 'mayor') ? k : k-1;
                total = Math.pow(q, limitK);
                eqs.push(`= (1 - p)^{${limitK}}`);
                verticalSumHTML += `
                    <div class="v-row">
                        <span class="v-formula">Fórmula Directa: \\( P(X > ${limitK}) = (${q.toFixed(2)})^{${limitK}} \\)</span>
                        <span class="v-value">\\( ${total.toFixed(5)} \\)</span>
                    </div>`;
            }

        } else {
            // Suma Directa
            if (start > end) {
                total = 0; verticalSumHTML += `<div class="v-row">Rango vacío</div>`;
            } else {
                let sumStr = [];
                // Advertencia si son muchos
                if ((end - start) > 50) alert("Calculando muchos términos...");

                for(let i=start; i<=end; i++) {
                    let val = GeometricModule.pdf(p, i);
                    total += val;
                    
                    if (i < start+3 || i === end) sumStr.push(`P(X=${i})`);
                    else if (i === start+3) sumStr.push("\\dots");

                    verticalSumHTML += `
                        <div class="v-row">
                            <span class="v-formula">\\( P(X=${i}) = (${q.toFixed(2)})^{${i-1}} \\cdot ${p} \\)</span>
                            <span class="v-value">\\( ${val.toFixed(5)} \\)</span>
                        </div>`;
                }
                eqs.push(`= \\sum_{i=${start}}^{${end}} P(X=i)`);
                if((end-start) < 5) eqs.push(`= ${sumStr.join(" + ")}`);
                
                verticalSumHTML += `
                    <div class="v-total-line">
                        <span class="v-plus-sign">+</span>
                        <span class="v-formula">Total Acumulado</span>
                        <span class="v-value">\\( ${total.toFixed(5)} \\)</span>
                    </div>`;
            }
        }
        
        verticalSumHTML += `</div>`;

        Core.addReportItem({
            title: "Probabilidad Geométrica",
            params: `p=${p} | ${label.replace(/\\le/g, '≤').replace(/\\ge/g, '≥').replace(/\\ne/g, '≠')}`,
            equations: eqs,
            customHTML: verticalSumHTML,
            result: total.toFixed(5),
            plot: null
        });
    },

    generateTable: () => {
        const p = parseFloat(document.getElementById('gm_p').value);
        if (isNaN(p) || p <= 0 || p > 1) return alert("Revisa p.");

        // Límite automático: Graficamos hasta que la probabilidad acumulada sea ~99.9%
        // (1-p)^k < 0.001  =>  k * ln(1-p) < ln(0.001)  => k > ln(0.001)/ln(1-p)
        let limit = Math.ceil(Math.log(0.0001) / Math.log(1 - p));
        if (limit > 50) limit = 50; // Tope máximo por seguridad visual
        if (limit < 5) limit = 5;

        let rows = "";
        let acc = 0;
        const x=[], y=[], c=[];

        for(let i=1; i<=limit; i++) {
            let val = GeometricModule.pdf(p, i);
            acc += val;
            
            rows += `<tr><td>${i}</td><td>${val.toFixed(5)}</td><td>${acc.toFixed(5)}</td></tr>`;
            x.push(i); y.push(val); c.push('#1a365d');
        }
        
        rows += `<tr><td colspan="3" style="font-size:0.8rem; color:#888;">... continúa asintóticamente ...</td></tr>`;

        const tableHTML = `<table class="data-table"><thead><tr><th>k</th><th>P(X=k)</th><th>Acum.</th></tr></thead><tbody>${rows}</tbody></table>`;

        const plotData = {
            data: [{
                x: x, y: y, type: 'bar', marker: { color: c },
                text: limit < 15 ? y.map(v=>v.toFixed(3)) : null, 
                textposition: 'auto'
            }],
            layout: { 
                title: { text: `Dist. Geométrica (p=${p})`, font: { size: 13 } },
                xaxis: { title: 'Intentos (k)', showgrid:false },
                yaxis: { showgrid:true, gridcolor:'#eee' },
                bargap: 0.3,
                autosize: true, 
                height: 300,
                margin: { l:40, r:20, t:40, b:40 }
            }
        };

        Core.addReportItem({
            title: "Tabla Geométrica",
            params: `p=${p}`,
            tableHTML: tableHTML,
            plot: plotData,
            result: null
        });
    }
};

if (typeof Core !== 'undefined') { Core.registerModule('geometric', GeometricModule); }