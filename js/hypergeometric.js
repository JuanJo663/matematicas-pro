/* ==========================================================================
   MÓDULO: DISTRIBUCIÓN HIPERGEOMÉTRICA (V15 - Estándar Platino)
   Fórmula: P(X=k) = [C(K,k) * C(N-K, n-k)] / C(N,n)
   ========================================================================== */

const HypergeometricModule = {

    render: () => {
        return `
        <div class="module-card">
            <h3 style="color:var(--primary); border-bottom:1px solid var(--border); padding-bottom:10px; margin-top:0;">
                <i class="fa-solid fa-layer-group"></i> Distribución Hipergeométrica
            </h3>
            
            <div style="background:#f8fafc; padding:10px; border-radius:8px; text-align:center; margin-bottom:20px; font-size:0.9rem;">
                $$ P(X=k) = \\frac{\\binom{K}{k} \\binom{N-K}{n-k}}{\\binom{N}{n}} $$
                <div style="font-size:0.8rem; color:#666; margin-top:5px;">(Muestreo sin reemplazo)</div>
            </div>
            
            <div class="form-grid">
                <div class="input-group">
                    <label>Población Total <span style="text-transform:none; font-family:serif;">( N )</span></label>
                    <input type="number" id="hg_N" value="20" min="1" placeholder="Ej: 20">
                </div>
                <div class="input-group">
                    <label>Éxitos en Población <span style="text-transform:none; font-family:serif;">( K )</span></label>
                    <input type="number" id="hg_K" value="8" min="0" placeholder="Ej: 8">
                </div>
                <div class="input-group">
                    <label>Tamaño Muestra <span style="text-transform:none; font-family:serif;">( n )</span></label>
                    <input type="number" id="hg_n" value="5" min="1" placeholder="Ej: 5">
                </div>
                
                <div class="input-group" style="grid-column: span 3;">
                    <label>Tipo de Cálculo</label>
                    <select id="hg_type" onchange="HypergeometricModule.toggleInputs()">
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
                        </optgroup>
                    </select>
                </div>

                <div id="hg_input_k" class="input-group">
                    <label>Éxitos en Muestra <span style="text-transform:none; font-family:serif;">( k )</span></label>
                    <input type="number" id="hg_val_k" value="2" min="0">
                </div>

                <div id="hg_input_range" class="input-group" style="display:none; grid-column: span 3;">
                    <div style="display:flex; gap:15px;">
                        <div style="flex:1">
                            <label>Desde <span style="text-transform:none; font-family:serif;">( a )</span></label>
                            <input type="number" id="hg_val_a" value="1" min="0">
                        </div>
                        <div style="flex:1">
                            <label>Hasta <span style="text-transform:none; font-family:serif;">( b )</span></label>
                            <input type="number" id="hg_val_b" value="3" min="0">
                        </div>
                    </div>
                </div>
            </div>

            <div style="display:flex; gap:15px; margin-top:20px;">
                <button class="btn-action" onclick="HypergeometricModule.calculate()" style="flex:1; margin-top:0;">
                    <i class="fa-solid fa-calculator"></i> Calcular Resultado
                </button>
                <button class="btn-secondary" onclick="HypergeometricModule.generateTable()" style="flex:1; border: 2px solid var(--primary); color: var(--primary);">
                    <i class="fa-solid fa-chart-column"></i> Ver Distribución Completa
                </button>
            </div>
        </div>
        `;
    },

    init: () => { HypergeometricModule.toggleInputs(); },

    toggleInputs: () => {
        const type = document.getElementById('hg_type').value;
        const divK = document.getElementById('hg_input_k');
        const divRange = document.getElementById('hg_input_range');
        if (type.startsWith('entre')) { divK.style.display = 'none'; divRange.style.display = 'block'; }
        else { divK.style.display = 'block'; divRange.style.display = 'none'; }
    },

    // --- FUNCIONES MATEMÁTICAS ---
    fact: (n) => { 
        if(n<0) return 0; if(n<=1) return 1; 
        let r=1; for(let i=2; i<=n; i++) r*=i; 
        return r; 
    },
    
    nCr: (n, r) => { 
        if (r<0 || r>n) return 0; 
        // Optimización para números grandes
        if (r > n/2) r = n - r;
        let res = 1; 
        for(let i=1; i<=r; i++) res = res * (n - i + 1) / i;
        return Math.round(res); // Round para evitar errores de punto flotante
    },

    pdf: (N, K, n, k) => {
        // P(X=k) = [C(K, k) * C(N-K, n-k)] / C(N, n)
        const num = HypergeometricModule.nCr(K, k) * HypergeometricModule.nCr(N - K, n - k);
        const den = HypergeometricModule.nCr(N, n);
        return den === 0 ? 0 : num / den;
    },

    // 1. CÁLCULO SIMPLE
    calculate: () => {
        const N = parseInt(document.getElementById('hg_N').value);
        const K = parseInt(document.getElementById('hg_K').value);
        const n = parseInt(document.getElementById('hg_n').value);
        const type = document.getElementById('hg_type').value;

        // Validaciones Lógicas
        if (isNaN(N) || isNaN(K) || isNaN(n)) return alert("Revisa los parámetros N, K, n.");
        if (K > N) return alert("K (éxitos) no puede ser mayor que N (población).");
        if (n > N) return alert("n (muestra) no puede ser mayor que N (población).");

        // Rango válido de k: max(0, n-(N-K)) <= k <= min(n, K)
        const minK = Math.max(0, n - (N - K));
        const maxK = Math.min(n, K);

        let start=0, end=0, kVal, a, b, label="", isComp=false;

        if (type.startsWith('entre')) {
            a = parseInt(document.getElementById('hg_val_a').value);
            b = parseInt(document.getElementById('hg_val_b').value);
            start=a; end=b; label=`P(${a} \\le X \\le ${b})`;
        } else {
            kVal = parseInt(document.getElementById('hg_val_k').value);
            if (kVal < minK || kVal > maxK) return alert(`Para estos datos, k debe estar entre ${minK} y ${maxK}.`);

            switch(type) {
                case 'igual': start=kVal; end=kVal; label=`P(X = ${kVal})`; break;
                case 'diferente': isComp=true; label=`P(X \\ne ${kVal})`; break;
                case 'menor': start=minK; end=kVal-1; label=`P(X < ${kVal})`; break;
                case 'menorigual': start=minK; end=kVal; label=`P(X \\le ${kVal})`; break;
                case 'mayor': start=kVal+1; end=maxK; label=`P(X > ${kVal})`; break;
                case 'mayorigual': start=kVal; end=maxK; label=`P(X \\ge ${kVal})`; break;
            }
        }

        if(!isComp) {
            if(start < minK) start = minK;
            if(end > maxK) end = maxK;
        }

        let total = 0, eqs = [label];
        let verticalSumHTML = `<div class="vertical-sum-container">`;

        // --- LÓGICA VERTICAL ---
        if(isComp) {
            // Caso Diferente
            let val = HypergeometricModule.pdf(N, K, n, kVal);
            total = 1 - val;
            eqs.push(`= 1 - P(X=${kVal})`);
            verticalSumHTML += `
                <div class="v-row">
                    <span class="v-formula">\\( P(X=${kVal}) \\text{ (Puntual)} \\)</span>
                    <span class="v-value">\\( ${val.toFixed(5)} \\)</span>
                </div>
                <div class="v-total-line">
                    <span class="v-formula">\\( 1 - ${val.toFixed(5)} \\)</span>
                    <span class="v-value">\\( ${total.toFixed(5)} \\)</span>
                </div>`;
        } else {
            // Caso Suma
            if(start > end) {
                total = 0; verticalSumHTML += `<div class="v-row">Rango vacío o imposible.</div>`;
            } else {
                let sumStr = [];
                for(let i=start; i<=end; i++) {
                    let val = HypergeometricModule.pdf(N, K, n, i);
                    total += val;
                    
                    if ((end-start) < 5) sumStr.push(`P(X=${i})`);
                    else if(i===start) sumStr.push(`P(X=${i}) + \\dots + P(X=${end})`);

                    verticalSumHTML += `
                        <div class="v-row">
                            <span class="v-formula">
                                \\( P(X=${i}) = \\frac{\\binom{${K}}{${i}} \\binom{${N-K}}{${n-i}}}{\\binom{${N}}{${n}}} \\)
                            </span>
                            <span class="v-value">\\( ${val.toFixed(5)} \\)</span>
                        </div>`;
                }
                
                eqs.push(`= \\sum_{i=${start}}^{${end}} P(X=i)`);
                if((end-start) < 5 && sumStr.length > 0) eqs.push(`= ${sumStr.join(" + ")}`);

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
            title: "Probabilidad Hipergeométrica",
            params: `N=${N}, K=${K}, n=${n} | ${label.replace(/\\le/g, '≤').replace(/\\ge/g, '≥').replace(/\\ne/g, '≠')}`,
            equations: eqs,
            customHTML: verticalSumHTML,
            result: total.toFixed(5),
            plot: null
        });
    },

    // 2. TABLA COMPLETA
    generateTable: () => {
        const N = parseInt(document.getElementById('hg_N').value);
        const K = parseInt(document.getElementById('hg_K').value);
        const n = parseInt(document.getElementById('hg_n').value);

        if (isNaN(N) || isNaN(K) || isNaN(n)) return alert("Revisa parámetros.");
        
        // Rango factible de k
        const minK = Math.max(0, n - (N - K));
        const maxK = Math.min(n, K);

        let rows = "";
        let acc = 0;
        const x=[], y=[], c=[];

        // Solo iteramos en el rango posible
        for(let i=minK; i<=maxK; i++) {
            let val = HypergeometricModule.pdf(N, K, n, i);
            acc += val;
            
            rows += `<tr><td>${i}</td><td>${val.toFixed(5)}</td><td>${acc.toFixed(5)}</td></tr>`;
            x.push(i); y.push(val); c.push('#1a365d');
        }

        const tableHTML = `<table class="data-table"><thead><tr><th>k</th><th>P(X=k)</th><th>Acum.</th></tr></thead><tbody>${rows}</tbody></table>`;

        const plotData = {
            data: [{ x: x, y: y, type: 'bar', marker: { color: c }, text: y.map(v=>v.toFixed(3)), textposition: 'auto' }],
            layout: { 
                title: { text: `Dist. Hipergeométrica (N=${N}, K=${K}, n=${n})`, font: { size: 12 } },
                xaxis: { title: 'k (Éxitos)', showgrid:false },
                yaxis: { showgrid:true, gridcolor:'#eee' },
                bargap: 0.3,
                autosize: true, 
                height: 300,
                margin: { l:40, r:20, t:40, b:40 }
            }
        };

        Core.addReportItem({
            title: "Tabla Hipergeométrica",
            params: `N=${N}, K=${K}, n=${n}`,
            tableHTML: tableHTML,
            plot: plotData,
            result: null
        });
    }
};

if (typeof Core !== 'undefined') { Core.registerModule('hypergeometric', HypergeometricModule); }