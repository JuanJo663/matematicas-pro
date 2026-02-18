/* ==========================================================================
   MÓDULO: TÉCNICAS DE CONTEO (V16 - Gráfico de Barras Correcto)
   Calcula: n!, nPr, nCr con visualización discreta
   ========================================================================== */

const CountingModule = {

    render: () => {
        return `
        <div class="module-card">
            <h3 style="color:var(--primary); border-bottom:1px solid var(--border); padding-bottom:10px; margin-top:0;">
                <i class="fa-solid fa-arrow-down-1-9"></i> Técnicas de Conteo
            </h3>
            
            <div style="background:#f8fafc; padding:10px; border-radius:8px; text-align:center; margin-bottom:20px; font-size:0.9rem;">
                $$ n! \\quad | \\quad _nP_r = \\frac{n!}{(n-r)!} \\quad | \\quad _nC_r = \\frac{n!}{r!(n-r)!} $$
            </div>
            
            <div class="form-grid">
                <div class="input-group" style="grid-column: span 3;">
                    <label>Operación</label>
                    <select id="ct_type" onchange="CountingModule.toggleInputs()">
                        <option value="factorial">Factorial (n!)</option>
                        <option value="permutation" selected>Permutación (nPr) - Importa el orden</option>
                        <option value="combination">Combinación (nCr) - No importa orden</option>
                    </select>
                </div>

                <div class="input-group">
                    <label>Total Elementos <span style="text-transform:none; font-family:serif;">( n )</span></label>
                    <input type="number" id="ct_n" value="5" min="0" placeholder="Ej: 5">
                </div>

                <div id="ct_input_r" class="input-group">
                    <label>Selección <span style="text-transform:none; font-family:serif;">( r )</span></label>
                    <input type="number" id="ct_r" value="2" min="0" placeholder="Ej: 2">
                </div>
            </div>

            <div style="display:flex; gap:15px; margin-top:20px;">
                <button class="btn-action" onclick="CountingModule.calculate()" style="flex:1; margin-top:0;">
                    <i class="fa-solid fa-calculator"></i> Calcular Resultado
                </button>
                <button class="btn-secondary" onclick="CountingModule.generateTable()" style="flex:1; border: 2px solid var(--primary); color: var(--primary);">
                    <i class="fa-solid fa-chart-column"></i> Ver Comportamiento
                </button>
            </div>
        </div>
        `;
    },

    init: () => { CountingModule.toggleInputs(); },

    toggleInputs: () => {
        const type = document.getElementById('ct_type').value;
        const divR = document.getElementById('ct_input_r');
        if (type === 'factorial') { 
            divR.style.display = 'none'; 
        } else { 
            divR.style.display = 'block'; 
        }
    },

    // --- MATEMÁTICAS ---
    fact: (n) => {
        if (n < 0) return 0;
        if (n <= 1) return 1;
        let r = 1;
        for (let i = 2; i <= n; i++) r *= i;
        return r;
    },

    formatNum: (num) => {
        if (num > 1e12) return num.toExponential(4); 
        return num.toLocaleString('es-CO'); 
    },

    calculate: () => {
        const n = parseInt(document.getElementById('ct_n').value);
        const type = document.getElementById('ct_type').value;
        
        if (isNaN(n) || n < 0) return alert("Revisa el valor de n.");
        if (n > 170) return alert("El valor de n es demasiado grande para Javascript (Max 170).");

        let r = 0;
        if (type !== 'factorial') {
            r = parseInt(document.getElementById('ct_r').value);
            if (isNaN(r) || r < 0) return alert("Revisa el valor de r.");
            if (r > n) return alert("r no puede ser mayor que n.");
        }

        let total = 0, eqs = [];
        let label = "";
        let verticalSumHTML = `<div class="vertical-sum-container">`;

        if (type === 'factorial') {
            total = CountingModule.fact(n);
            label = `Factorial: ${n}!`;
            eqs.push(`= n \\times (n-1) \\times \\dots \\times 1`);
            
            if (n <= 10) {
                let expansion = [];
                for(let i=n; i>=1; i--) expansion.push(i);
                eqs.push(`= ${expansion.join(" \\times ")}`);
            } else {
                eqs.push(`= ${n} \\times ${n-1} \\times \\dots \\times 1`);
            }

            verticalSumHTML += `
                <div class="v-row">
                    <span class="v-formula">\\( ${n}! \\)</span>
                    <span class="v-value">\\( ${CountingModule.formatNum(total)} \\)</span>
                </div>`;

        } else if (type === 'permutation') {
            total = CountingModule.fact(n) / CountingModule.fact(n - r);
            label = `Permutación: $_${n}P_${r}$`;
            eqs.push(`= \\frac{n!}{(n-r)!}`);
            eqs.push(`= \\frac{${n}!}{(${n}-${r})!} = \\frac{${n}!}{${n-r}!}`);
            const numVal = CountingModule.fact(n);
            const denVal = CountingModule.fact(n-r);
            eqs.push(`= \\frac{${CountingModule.formatNum(numVal)}}{${CountingModule.formatNum(denVal)}}`);

            verticalSumHTML += `
                <div class="v-row">
                    <span class="v-formula">\\( _${n}P_${r} \\)</span>
                    <span class="v-value">\\( ${CountingModule.formatNum(total)} \\)</span>
                </div>`;

        } else if (type === 'combination') {
            const num = CountingModule.fact(n);
            const den1 = CountingModule.fact(r);
            const den2 = CountingModule.fact(n - r);
            total = num / (den1 * den2);
            label = `Combinación: $_${n}C_${r}$`;
            eqs.push(`= \\frac{n!}{r!(n-r)!}`);
            eqs.push(`= \\frac{${n}!}{${r}!(${n}-${r})!} = \\frac{${n}!}{${r}!${n-r}!}`);
            eqs.push(`= \\frac{${CountingModule.formatNum(num)}}{${CountingModule.formatNum(den1)} \\times ${CountingModule.formatNum(den2)}}`);

            verticalSumHTML += `
                <div class="v-row">
                    <span class="v-formula">\\( _${n}C_${r} \\)</span>
                    <span class="v-value">\\( ${CountingModule.formatNum(total)} \\)</span>
                </div>`;
        }
        
        verticalSumHTML += `</div>`;

        Core.addReportItem({
            title: "Técnica de Conteo",
            params: type === 'factorial' ? `n=${n}` : `n=${n}, r=${r}`,
            equations: eqs,
            customHTML: verticalSumHTML,
            result: CountingModule.formatNum(total),
            plot: null
        });
    },

    // --- GRÁFICO DE BARRAS (CORREGIDO) ---
    generateTable: () => {
        const n = parseInt(document.getElementById('ct_n').value);
        const type = document.getElementById('ct_type').value;

        if (isNaN(n) || n > 170) return alert("Revisa n (Max 170).");

        let rows = "";
        const x = [], y = [], c = [];
        let tableHeader = "";
        let titleChart = "";

        if (type === 'factorial') {
            tableHeader = "<tr><th>n</th><th>n!</th></tr>";
            titleChart = `Crecimiento Factorial (1! a ${n}!)`;
            let limit = n > 15 ? 15 : n; // Limitamos visualmente porque crece muy rápido

            for(let i=1; i<=limit; i++) {
                let val = CountingModule.fact(i);
                rows += `<tr><td>${i}</td><td>${CountingModule.formatNum(val)}</td></tr>`;
                x.push(i); y.push(val); c.push('#1a365d');
            }
        } else {
            tableHeader = `<tr><th>r</th><th>_${n}${type==='permutation'?'P':'C'}_r</th></tr>`;
            titleChart = `${type==='permutation'?'Permutaciones':'Combinaciones'} (n=${n})`;
            
            for(let i=0; i<=n; i++) {
                let val = 0;
                if(type === 'permutation') val = CountingModule.fact(n) / CountingModule.fact(n - i);
                else val = CountingModule.fact(n) / (CountingModule.fact(i) * CountingModule.fact(n - i));
                
                rows += `<tr><td>${i}</td><td>${CountingModule.formatNum(val)}</td></tr>`;
                x.push(i); y.push(val); c.push('#1a365d');
            }
        }

        const tableHTML = `<table class="data-table"><thead>${tableHeader}</thead><tbody>${rows}</tbody></table>`;

        const plotData = {
            data: [{
                x: x, y: y, 
                type: 'bar', // AHORA SON BARRAS
                marker: { color: '#1a365d' },
                text: y.map(v => v < 10000 ? v : ''), // Etiquetas solo si caben
                textposition: 'auto'
            }],
            layout: { 
                title: { text: titleChart, font: { size: 12 } },
                xaxis: { title: type==='factorial'?'n':'r', showgrid:false },
                yaxis: { title: 'Total', showgrid:true, gridcolor:'#eee' },
                autosize: false, 
                width: 400, height: 300,
                margin: { l:50, r:20, t:40, b:40 }
            }
        };

        Core.addReportItem({
            title: "Análisis de Crecimiento",
            params: `n=${n} | ${type}`,
            tableHTML: tableHTML,
            plot: plotData, // FOTO AUTOMÁTICA
            result: null
        });
    }
};

if (typeof Core !== 'undefined') { Core.registerModule('counting', CountingModule); }