/* ==========================================================================
   MÓDULO: DISTRIBUCIÓN POISSON (V15 - Estándar Oro: Foto & LaTeX)
   Fórmula: P(X=k) = (e^-λ * λ^k) / k!
   ========================================================================== */

const PoissonModule = {

    render: () => {
        return `
        <div class="module-card">
            <h3 style="color:var(--primary); border-bottom:1px solid var(--border); padding-bottom:10px; margin-top:0;">
                <i class="fa-solid fa-bolt"></i> Distribución de Poisson
            </h3>
            
            <div style="background:#f8fafc; padding:10px; border-radius:8px; text-align:center; margin-bottom:20px; font-size:0.9rem;">
                $$ P(X=k) = \\frac{e^{-\\lambda} \\cdot \\lambda^k}{k!} $$
            </div>
            
            <div class="form-grid">
                <div class="input-group">
                    <label>Tasa Promedio <span style="text-transform:none; font-family:serif;">( $\\lambda$ )</span></label>
                    <input type="number" id="ps_lambda" value="5" min="0" step="0.1" placeholder="Ej: 5">
                </div>
                
                <div class="input-group" style="grid-column: span 2;">
                    <label>Tipo de Cálculo</label>
                    <select id="ps_type" onchange="PoissonModule.toggleInputs()">
                        <optgroup label="Puntos Específicos">
                            <option value="igual">Exactamente (X = k)</option>
                            <option value="diferente">Diferente de (X ≠ k)</option>
                        </optgroup>
                        <optgroup label="Acumulados">
                            <option value="menor">Menor que (X < k)</option>
                            <option value="menorigual" selected>A lo sumo (X ≤ k)</option>
                            <option value="mayor">Mayor que (X > k)</option>
                            <option value="mayorigual">Al menos (X ≥ k)</option>
                        </optgroup>
                        <optgroup label="Intervalos">
                            <option value="entre_inclusivo">Entre inclusivo (a ≤ X ≤ b)</option>
                            <option value="entre_estricto">Entre estricto (a < X < b)</option>
                            <option value="entre_mix_izq">Entre (a < X ≤ b)</option>
                            <option value="entre_mix_der">Entre (a ≤ X < b)</option>
                        </optgroup>
                    </select>
                </div>

                <div id="ps_input_k" class="input-group">
                    <label>Ocurrencias <span style="text-transform:none; font-family:serif;">( k )</span></label>
                    <input type="number" id="ps_val_k" value="3" min="0">
                </div>

                <div id="ps_input_range" class="input-group" style="display:none; grid-column: span 2;">
                    <div style="display:flex; gap:15px;">
                        <div style="flex:1">
                            <label>Desde <span style="text-transform:none; font-family:serif;">( a )</span></label>
                            <input type="number" id="ps_val_a" value="2" min="0">
                        </div>
                        <div style="flex:1">
                            <label>Hasta <span style="text-transform:none; font-family:serif;">( b )</span></label>
                            <input type="number" id="ps_val_b" value="6" min="0">
                        </div>
                    </div>
                </div>
            </div>

            <div style="display:flex; gap:15px; margin-top:20px;">
                <button class="btn-action" onclick="PoissonModule.calculate()" style="flex:1; margin-top:0;">
                    <i class="fa-solid fa-calculator"></i> Calcular Resultado
                </button>
                <button class="btn-secondary" onclick="PoissonModule.generateTable()" style="flex:1; border: 2px solid var(--primary); color: var(--primary);">
                    <i class="fa-solid fa-chart-column"></i> Ver Distribución Completa
                </button>
            </div>
        </div>
        `;
    },

    init: () => { PoissonModule.toggleInputs(); },

    toggleInputs: () => {
        const type = document.getElementById('ps_type').value;
        const divK = document.getElementById('ps_input_k');
        const divRange = document.getElementById('ps_input_range');
        if (type.startsWith('entre')) { divK.style.display = 'none'; divRange.style.display = 'block'; }
        else { divK.style.display = 'block'; divRange.style.display = 'none'; }
    },

    fact: (n) => { 
        if(n<0) return 0; if(n>170) return Infinity; 
        return n<=1?1:n*PoissonModule.fact(n-1); 
    },
    
    pdf: (lam, k) => {
        return (Math.exp(-lam) * Math.pow(lam, k)) / PoissonModule.fact(k);
    },

    // 1. CÁLCULO SIMPLE (SOLO TEXTO Y LISTA VERTICAL)
    calculate: () => {
        const lam = parseFloat(document.getElementById('ps_lambda').value);
        const type = document.getElementById('ps_type').value;

        if (isNaN(lam) || lam <= 0) return alert("Lambda (λ) debe ser mayor que 0.");
        
        // Límite práctico para gráficos y cálculos "infinitos"
        const practicalMax = Math.ceil(lam + 4 * Math.sqrt(lam)) + 2; 

        let start=0, end=0, k, a, b, label="", isComp=false;

        // --- Definición de Límites ---
        if (type.startsWith('entre')) {
            a = parseInt(document.getElementById('ps_val_a').value);
            b = parseInt(document.getElementById('ps_val_b').value);
            if(isNaN(a) || isNaN(b)) return alert("Revisa los límites a y b.");
            
            switch(type) {
                case 'entre_inclusivo': start=a; end=b; label=`P(${a} \\le X \\le ${b})`; break;
                case 'entre_estricto': start=a+1; end=b-1; label=`P(${a} < X < ${b})`; break;
                case 'entre_mix_izq': start=a+1; end=b; label=`P(${a} < X \\le ${b})`; break;
                case 'entre_mix_der': start=a; end=b-1; label=`P(${a} \\le X < ${b})`; break;
            }
        } else {
            k = parseInt(document.getElementById('ps_val_k').value);
            if(isNaN(k) || k < 0) return alert("Ingresa un k válido.");

            switch(type) {
                case 'igual': start=k; end=k; label=`P(X = ${k})`; break;
                case 'diferente': isComp=true; label=`P(X \\ne ${k})`; break;
                case 'menor': start=0; end=k-1; label=`P(X < ${k})`; break;
                case 'menorigual': start=0; end=k; label=`P(X \\le ${k})`; break;
                
                // Casos > y >= en Poisson van al infinito, usamos complemento
                case 'mayor': 
                    isComp = true; start=0; end=k; 
                    label=`P(X > ${k}) = 1 - P(X \\le ${k})`; 
                    break;
                case 'mayorigual': 
                    isComp = true; start=0; end=k-1;
                    label=`P(X \\ge ${k}) = 1 - P(X \\le ${k-1})`; 
                    break;
            }
        }

        if(start < 0) start = 0;
        
        let total = 0, eqs = [label];
        let verticalSumHTML = `<div class="vertical-sum-container">`;

        // --- LÓGICA DE CÁLCULO Y LISTA VERTICAL ---
        if (type === 'diferente') {
            let val = PoissonModule.pdf(lam, k);
            total = 1 - val;
            eqs.push(`= 1 - P(X=${k})`);
            verticalSumHTML += `
                <div class="v-row">
                    <span class="v-formula">\\( P(X=${k}) = \\frac{e^{-${lam}} \\cdot ${lam}^{${k}}}{${k}!} \\)</span>
                    <span class="v-value">\\( ${val.toFixed(5)} \\)</span>
                </div>
                <div class="v-total-line">
                    <span class="v-formula">\\( 1 - ${val.toFixed(5)} \\)</span>
                    <span class="v-value">\\( ${total.toFixed(5)} \\)</span>
                </div>`;
        } 
        else if (type === 'mayor' || type === 'mayorigual') {
            // Caso Complemento (Mayor Que)
            let accum = 0;
            let sumStr = [];
            
            for(let i=0; i<=end; i++) {
                let val = PoissonModule.pdf(lam, i);
                accum += val;
                
                if (i <= 3) sumStr.push(`P(X=${i})`);
                else if (i === end && end > 3) { sumStr.push(`\\dots`); sumStr.push(`P(X=${end})`); }

                verticalSumHTML += `
                    <div class="v-row">
                        <span class="v-formula">\\( P(X=${i}) = \\frac{e^{-${lam}} \\cdot ${lam}^{${i}}}{${i}!} \\)</span>
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
            // Casos Suma Directa
            if (start > end) {
                total = 0; verticalSumHTML += `<div class="v-row">Rango vacío</div>`;
            } else {
                let sumStr = [];
                for(let i=start; i<=end; i++) {
                    let val = PoissonModule.pdf(lam, i);
                    total += val;
                    
                    if (i < start+3 || i === end) sumStr.push(`P(X=${i})`);
                    else if (i === start+3) sumStr.push("\\dots");

                    verticalSumHTML += `
                        <div class="v-row">
                            <span class="v-formula">\\( P(X=${i}) = \\frac{e^{-${lam}} \\cdot ${lam}^{${i}}}{${i}!} \\)</span>
                            <span class="v-value">\\( ${val.toFixed(5)} \\)</span>
                        </div>`;
                }
                eqs.push(`= \\sum_{i=${start}}^{${end}} P(X=i)`);
                
                verticalSumHTML += `
                    <div class="v-total-line">
                        <span class="v-plus-sign">+</span>
                        <span class="v-formula">Total Acumulado</span>
                        <span class="v-value">\\( ${total.toFixed(5)} \\)</span>
                    </div>`;
            }
        }
        
        verticalSumHTML += `</div>`;

        // ENVÍO SIN GRÁFICO
        Core.addReportItem({
            title: "Probabilidad Poisson",
            params: `λ=${lam} | ${label.replace(/\\le/g, '≤').replace(/\\ge/g, '≥').replace(/\\ne/g, '≠')}`, // Limpieza simple para el badge
            equations: eqs,
            customHTML: verticalSumHTML,
            result: total.toFixed(5),
            plot: null
        });
    },

    // 2. TABLA COMPLETA + GRÁFICO (PARA IMPRIMIR CON FOTO)
    generateTable: () => {
        const lam = parseFloat(document.getElementById('ps_lambda').value);

        if (isNaN(lam) || lam <= 0) return alert("Revisa Lambda.");

        // Límite dinámico (Poisson es infinita, cortamos cuando P ~ 0)
        const limit = Math.ceil(lam + 4 * Math.sqrt(lam)) + 2; 

        let rows = "";
        let acc = 0;
        const x=[], y=[], c=[];

        for(let i=0; i<=limit; i++) {
            let val = PoissonModule.pdf(lam, i);
            acc += val;
            
            rows += `<tr><td>${i}</td><td>${val.toFixed(5)}</td><td>${acc.toFixed(5)}</td></tr>`;
            x.push(i); y.push(val); c.push('#1a365d');
        }

        rows += `<tr><td colspan="3" style="font-size:0.8rem; color:#888;">... continúa (mostrando hasta k=${limit}) ...</td></tr>`;

        const tableHTML = `<table class="data-table"><thead><tr><th>k</th><th>P(X=k)</th><th>Acum.</th></tr></thead><tbody>${rows}</tbody></table>`;

        const plotData = {
            data: [{
                x: x, y: y, type: 'bar', marker: { color: c },
                text: limit < 15 ? y.map(v=>v.toFixed(3)) : null, 
                textposition: 'auto'
            }],
            layout: { 
                title: { text: `Distribución Poisson (λ=${lam})`, font: { size: 13 } },
                xaxis: { title: 'k', showgrid:false },
                yaxis: { showgrid:true, gridcolor:'#eee' },
                bargap: 0.3,
                autosize: true, 
                height: 300,
                margin: { l:40, r:20, t:40, b:40 }
            }
        };

        Core.addReportItem({
            title: "Tabla Poisson Completa",
            params: `λ=${lam}`,
            tableHTML: tableHTML,
            plot: plotData, // Core generará la foto
            result: null
        });
    }
};

if (typeof Core !== 'undefined') { Core.registerModule('poisson', PoissonModule); }