/* ==========================================================================
   MÓDULO: SISTEMAS DE ECUACIONES LINEALES (V16.7 - Detective de Soluciones)
   Soporta: 2x2 hasta 5x5 con diferenciación entre Sin Solución e Infinitas
   ========================================================================== */

const SystemsModule = {
    formatResult: (num) => {
        if (Math.abs(num) < 1e-10) return 0;
        return Number.isInteger(num) ? num : parseFloat(num.toFixed(4));
    },

    render: () => {
        return `
        <div class="module-card">
            <h3 style="color:var(--primary); border-bottom:1px solid var(--border); padding-bottom:10px; margin-top:0;">
                <i class="fa-solid fa-microscope"></i> Analizador de Sistemas Lineales
            </h3>
            
            <div style="background:#eff6ff; border-left:4px solid #3b82f6; padding:12px; border-radius:8px; margin-bottom:20px; font-size:0.85rem;">
                <p style="margin:0; color:#1e40af;"><strong>Formato estándar:</strong> Ax + By + Cz ... = <span style="color:#2563eb;">Resultado</span></p>
            </div>
            
            <div class="input-group" style="margin-bottom:20px;">
                <label>Tamaño:</label>
                <select id="sys_size" onchange="SystemsModule.generateMatrix()">
                    <option value="2">2x2</option>
                    <option value="3">3x3</option>
                    <option value="4">4x4</option>
                    <option value="5">5x5</option>
                </select>
            </div>
            
            <div id="matrix_container" class="table-wrapper" style="background:#fff; padding:10px; border-radius:8px;"></div>

            <button class="btn-action" onclick="SystemsModule.solve()">
                <i class="fa-solid fa-magnifying-glass-chart"></i> Analizar y Resolver
            </button>
        </div>
        `;
    },

    init: () => { SystemsModule.generateMatrix(); },

    generateMatrix: () => {
        const size = parseInt(document.getElementById('sys_size').value);
        const container = document.getElementById('matrix_container');
        const labels = ['x', 'y', 'z', 'w', 'v'];
        let html = `<table class="data-table" style="min-width:100%;"><thead><tr>`;
        for(let j=0; j<size; j++) html += `<th>${labels[j]}</th>`;
        html += `<th>=</th><th>Indep.</th></tr></thead><tbody>`;
        for(let i=0; i<size; i++) {
            html += `<tr>`;
            for(let j=0; j<size; j++) {
                html += `<td><input type="number" id="m_${i}_${j}" value="0" step="any" style="width:100%; text-align:center; border:1px solid #cbd5e1; padding:5px;"></td>`;
            }
            html += `<td style="color:#94a3b8;">=</td>`;
            html += `<td><input type="number" id="res_${i}" value="0" step="any" style="width:100%; text-align:center; border:2px solid var(--primary); padding:5px; font-weight:bold;"></td>`;
            html += `</tr>`;
        }
        html += `</tbody></table>`;
        container.innerHTML = html;
    },

    getDet: (m) => {
        const n = m.length;
        if (n === 1) return m[0][0];
        if (n === 2) return (m[0][0] * m[1][1]) - (m[0][1] * m[1][0]);
        let det = 0;
        for (let i = 0; i < n; i++) {
            const sub = m.slice(1).map(row => row.filter((_, j) => j !== i));
            det += Math.pow(-1, i) * m[0][i] * SystemsModule.getDet(sub);
        }
        return det;
    },

    solve: () => {
        const size = parseInt(document.getElementById('sys_size').value);
        const labels = ['x', 'y', 'z', 'w', 'v'];
        let matrix = [], results = [];

        for(let i=0; i<size; i++) {
            let row = [];
            for(let j=0; j<size; j++) row.push(parseFloat(document.getElementById(`m_${i}_${j}`).value) || 0);
            matrix.push(row);
            results.push(parseFloat(document.getElementById(`res_${i}`).value) || 0);
        }

        const detP = SystemsModule.getDet(matrix);
        const detP_isZero = Math.abs(detP) < 1e-10;

        // --- LÓGICA DE DETECTIVE ---
        if (detP_isZero) {
            let allDetsZero = true;
            for(let j=0; j<size; j++) {
                let mMod = matrix.map((row, i) => {
                    let r = [...row]; r[j] = results[i]; return r;
                });
                if (Math.abs(SystemsModule.getDet(mMod)) > 1e-10) {
                    allDetsZero = false; break;
                }
            }

            let diagnostic = "";
            if (allDetsZero) {
                diagnostic = `
                    <div style="padding:15px; background:#fef3c7; border-left:5px solid #f59e0b; color:#92400e;">
                        <h4><i class="fa-solid fa-infinity"></i> Infinitas Soluciones</h4>
                        <p>El sistema es <strong>Dependiente</strong>. Todas las ecuaciones representan el mismo espacio (se solapan). $\\Delta = 0$ y todos los $\\Delta_i = 0$.</p>
                    </div>`;
            } else {
                diagnostic = `
                    <div style="padding:15px; background:#fee2e2; border-left:5px solid #ef4444; color:#991b1b;">
                        <h4><i class="fa-solid fa-ban"></i> Sin Solución</h4>
                        <p>El sistema es <strong>Inconsistente</strong>. Las ecuaciones son paralelas y nunca se cruzan. $\\Delta = 0$ pero hay $\\Delta_i \\neq 0$.</p>
                    </div>`;
            }

            Core.addReportItem({
                title: "Diagnóstico de Sistema Especial",
                params: `Sistema ${size}x${size}`,
                customHTML: diagnostic,
                result: allDetsZero ? "Infinitas" : "Nula"
            });
            return;
        }

        // --- SOLUCIÓN ÚNICA (Cramer) ---
        let sols = [];
        for(let j=0; j<size; j++) {
            let mMod = matrix.map((row, i) => {
                let r = [...row]; r[j] = results[i]; return r;
            });
            let detJ = SystemsModule.getDet(mMod);
            sols.push({ label: labels[j], val: SystemsModule.formatResult(detJ / detP) });
        }

        let customHTML = `<div class="vertical-sum-container">`;
        sols.forEach(s => {
            customHTML += `<div class="v-row"><span>Incógnita ${s.label.toUpperCase()}</span><strong>${s.val}</strong></div>`;
        });
        customHTML += `</div>`;

        Core.addReportItem({
            title: `Sistema Resuelto`,
            params: `Determinante $\\Delta = ${SystemsModule.formatResult(detP)}$`,
            customHTML: customHTML,
            result: sols.map(s => `${s.label}=${s.val}`).join(", ")
        });
    }
};

if (typeof Core !== 'undefined') { Core.registerModule('systems', SystemsModule); }