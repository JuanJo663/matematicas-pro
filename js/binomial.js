/* ==========================================================================
   MÓDULO: DISTRIBUCIÓN BINOMIAL (V15 - Limpio y Enfocado)
   ========================================================================== */

const BinomialModule = {

    render: () => {
        return `
        <div class="module-card">
            <h3 style="color:var(--primary); border-bottom:1px solid var(--border); padding-bottom:10px; margin-top:0;">
                <i class="fa-solid fa-chart-bar"></i> Distribución Binomial
            </h3>
            
            <div style="background:#f8fafc; padding:10px; border-radius:8px; text-align:center; margin-bottom:20px; font-size:0.9rem;">
                $$ P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k} $$
            </div>
            
            <div class="form-grid">
                <div class="input-group">
                    <label>Ensayos <span style="text-transform:none; font-family:serif;">( n )</span></label>
                    <input type="number" id="bn_n" value="10" min="1" placeholder="Ej: 10">
                </div>
                <div class="input-group">
                    <label>Probabilidad <span style="text-transform:none; font-family:serif;">( p )</span></label>
                    <input type="number" id="bn_p" value="0.5" step="0.1" min="0" max="1" placeholder="Ej: 0.5">
                </div>
                
                <div class="input-group" style="grid-column: span 2;">
                    <label>Tipo de Cálculo</label>
                    <select id="bn_type" onchange="BinomialModule.toggleInputs()">
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

                <div id="bn_input_k" class="input-group">
                    <label>Valor <span style="text-transform:none; font-family:serif;">( k )</span></label>
                    <input type="number" id="bn_val_k" value="5">
                </div>

                <div id="bn_input_range" class="input-group" style="display:none; grid-column: span 2;">
                    <div style="display:flex; gap:15px;">
                        <div style="flex:1">
                            <label>Desde <span style="text-transform:none; font-family:serif;">( a )</span></label>
                            <input type="number" id="bn_val_a" value="2">
                        </div>
                        <div style="flex:1">
                            <label>Hasta <span style="text-transform:none; font-family:serif;">( b )</span></label>
                            <input type="number" id="bn_val_b" value="6">
                        </div>
                    </div>
                </div>
            </div>

            <div style="display:flex; gap:15px; margin-top:20px;">
                <button class="btn-action" onclick="BinomialModule.calculate()" style="flex:1; margin-top:0;">
                    <i class="fa-solid fa-calculator"></i> Calcular Resultado
                </button>
                <button class="btn-secondary" onclick="BinomialModule.generateTable()" style="flex:1; border: 2px solid var(--primary); color: var(--primary);">
                    <i class="fa-solid fa-chart-column"></i> Ver Distribución Completa
                </button>
            </div>
        </div>
        `;
    },

    init: () => { BinomialModule.toggleInputs(); },

    toggleInputs: () => {
        const type = document.getElementById('bn_type').value;
        const divK = document.getElementById('bn_input_k');
        const divRange = document.getElementById('bn_input_range');
        if (type.startsWith('entre')) { divK.style.display = 'none'; divRange.style.display = 'block'; }
        else { divK.style.display = 'block'; divRange.style.display = 'none'; }
    },

    fact: (n) => { if(n<0) return 0; return n<=1?1:n*BinomialModule.fact(n-1); },
    nCr: (n, r) => { if (r<0 || r>n) return 0; return BinomialModule.fact(n) / (BinomialModule.fact(r) * BinomialModule.fact(n - r)); },
    pdf: (n, k, p) => BinomialModule.nCr(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k),

    calculate: () => {
        const n = parseInt(document.getElementById('bn_n').value);
        const p = parseFloat(document.getElementById('bn_p').value);
        const type = document.getElementById('bn_type').value;
        
        if (isNaN(n) || isNaN(p)) return alert("Revisa n y p.");
        
        let start=0, end=0, k, a, b, badgeLabel="", mathLabel="", isComp=false;
        
        if (type.startsWith('entre')) {
            a = parseInt(document.getElementById('bn_val_a').value);
            b = parseInt(document.getElementById('bn_val_b').value);
            switch(type) {
                case 'entre_inclusivo': start=a; end=b; badgeLabel=`P(${a} ≤ X ≤ ${b})`; mathLabel=`P(${a} \\le X \\le ${b})`; break;
                case 'entre_estricto': start=a+1; end=b-1; badgeLabel=`P(${a} < X < ${b})`; mathLabel=`P(${a} < X < ${b})`; break;
                case 'entre_mix_izq': start=a+1; end=b; badgeLabel=`P(${a} < X ≤ ${b})`; mathLabel=`P(${a} < X \\le ${b})`; break;
                case 'entre_mix_der': start=a; end=b-1; badgeLabel=`P(${a} ≤ X < ${b})`; mathLabel=`P(${a} \\le X < ${b})`; break;
            }
        } else {
            k = parseInt(document.getElementById('bn_val_k').value);
            switch(type) {
                case 'igual': start=k; end=k; badgeLabel=`P(X = ${k})`; mathLabel=`P(X = ${k})`; break;
                case 'diferente': isComp=true; badgeLabel=`P(X ≠ ${k})`; mathLabel=`P(X \\ne ${k})`; break;
                case 'menor': start=0; end=k-1; badgeLabel=`P(X < ${k})`; mathLabel=`P(X < ${k})`; break;
                case 'menorigual': start=0; end=k; badgeLabel=`P(X ≤ ${k})`; mathLabel=`P(X \\le ${k})`; break;
                case 'mayor': start=k+1; end=n; badgeLabel=`P(X > ${k})`; mathLabel=`P(X > ${k})`; break;
                case 'mayorigual': start=k; end=n; badgeLabel=`P(X ≥ ${k})`; mathLabel=`P(X \\ge ${k})`; break;
            }
        }

        if(!isComp) { if(start<0) start=0; if(end>n) end=n; }

        let total = 0, eqs = [mathLabel];
        const q = 1 - p; 
        let verticalSumHTML = `<div class="vertical-sum-container">`;
        
        if(isComp) {
            let val = BinomialModule.pdf(n,k,p);
            total = 1 - val;
            eqs.push(`= 1 - P(X=${k})`);
            verticalSumHTML += `
                <div class="v-row">
                    <span class="v-formula">\\( P(X=${k}) \\text{ (Puntual)} \\)</span>
                    <span class="v-value">\\( ${val.toFixed(5)} \\)</span>
                </div>
                <div class="v-total-line">
                    <span class="v-formula">\\( 1 - ${val.toFixed(5)} \\)</span>
                    <span class="v-value">\\( ${total.toFixed(5)} \\)</span>
                </div>`;
        } else {
            if(start>end) { 
                total=0; 
                verticalSumHTML += `<div class="v-row">Rango vacío</div>`; 
            } else {
                let sumStr = [];
                let rangeSize = end - start + 1;
                if (rangeSize <= 4) { for(let i=start; i<=end; i++) sumStr.push(`P(X=${i})`); } 
                else { sumStr.push(`P(X=${start})`); sumStr.push(`P(X=${start+1})`); sumStr.push(`\\dots`); sumStr.push(`P(X=${end})`); }
                eqs.push(`= \\sum_{i=${start}}^{${end}} P(X=i)`);
                if(sumStr.length) eqs.push(`= ${sumStr.join(" + ")}`);

                if (rangeSize > 150) alert("Generando una lista muy larga...");
                for(let i=start; i<=end; i++) {
                    let val = BinomialModule.pdf(n,i,p);
                    total += val;
                    verticalSumHTML += `
                        <div class="v-row">
                            <span class="v-formula">\\( P(X=${i}) = \\binom{${n}}{${i}}(${p})^{${i}}(${q.toFixed(2)})^{${n-i}} \\)</span>
                            <span class="v-value">\\( ${val.toFixed(5)} \\)</span>
                        </div>`;
                }
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
            title: "Probabilidad Binomial",
            params: `n=${n}, p=${p} | ${badgeLabel}`,
            equations: eqs,
            customHTML: verticalSumHTML,
            result: total.toFixed(5),
            plot: null // SIN GRÁFICO AQUÍ
        });
    },

    generateTable: () => {
        const n = parseInt(document.getElementById('bn_n').value);
        const p = parseFloat(document.getElementById('bn_p').value);
        if (isNaN(n) || isNaN(p)) return alert("Revisa n y p.");

        let rows = "";
        let acc = 0;
        const x=[], y=[], c=[];
        for(let i=0; i<=n; i++) {
            let val = BinomialModule.pdf(n, i, p);
            acc += val;
            rows += `<tr><td>${i}</td><td>${val.toFixed(5)}</td><td>${acc.toFixed(5)}</td></tr>`;
            x.push(i); y.push(val); c.push('#1a365d');
        }

        const tableHTML = `<table class="data-table"><thead><tr><th>k</th><th>P(X=k)</th><th>Acum.</th></tr></thead><tbody>${rows}</tbody></table>`;
        const plotData = {
            data: [{ x, y, type: 'bar', marker: { color: c }, text: n < 15 ? y.map(v=>v.toFixed(3)) : null, textposition: 'auto' }],
            layout: { 
                title: { text: `Distribución Completa (n=${n})`, font: { size: 13 } }, 
                xaxis: { title: 'k', showgrid:false }, 
                yaxis: { showgrid:true, gridcolor:'#eee' }, 
                bargap: 0.3, 
                autosize: true, // Esto ayuda al resize en pantalla
                height: 300,
                margin: { l:40, r:20, t:40, b:40 }
            }
        };

        Core.addReportItem({
            title: "Distribución Binomial Completa",
            params: `n=${n}, p=${p}`,
            tableHTML: tableHTML,
            plot: plotData, // GRÁFICO AQUÍ
            result: null
        });
    }
};

if (typeof Core !== 'undefined') { Core.registerModule('binomial', BinomialModule); }