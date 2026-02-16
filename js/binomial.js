/**
 * Lógica para la Distribución Binomial con Procedimiento Detallado
 */

function factorial(n) {
    if (n < 0) return 0;
    return (n <= 1) ? 1 : n * factorial(n - 1);
}

function combinacion(n, k) {
    if (k < 0 || k > n) return 0;
    return factorial(n) / (factorial(k) * factorial(n - k));
}

function ejecutarBinomial() {
    // Obtención de valores desde el HTML
    const n = parseInt(document.getElementById('bn_n').value);
    const p = parseFloat(document.getElementById('bn_p').value);
    const k = parseInt(document.getElementById('bn_x').value);

    // Validación básica
    if (isNaN(n) || isNaN(p) || isNaN(k)) {
        alert("Por favor, completa todos los campos con valores numéricos.");
        return;
    }

    if (p < 0 || p > 1) {
        alert("La probabilidad p debe estar entre 0 y 1.");
        return;
    }

    // Cálculos matemáticos
    const q = 1 - p;
    const comb = combinacion(n, k);
    const prob = comb * Math.pow(p, k) * Math.pow(q, n - k);
    
    const resDiv = document.getElementById('res_binomial');
    resDiv.style.display = "block";

    // Construcción del procedimiento en formato LaTeX
    // Nota: Usamos \\ para que JavaScript pase la barra invertida a MathJax
    resDiv.innerHTML = `
        <h4 style="color:#2ecc71; margin-top:0;">Procedimiento Detallado</h4>
        
        <div style="background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #eee;">
            $$1. \\text{ Identificar Datos: } n=${n}, \\, p=${p}, \\, q=${q.toFixed(2)}, \\, k=${k}$$
            
            $$2. \\text{ Fórmula: } P(X=k) = \\binom{n}{k} \\cdot p^k \\cdot q^{n-k}$$
            
            $$3. \\text{ Sustitución: } P(X=${k}) = \\binom{${n}}{${k}} \\cdot (${p})^{${k}} \\cdot (${q.toFixed(2)})^{${n-k}}$$
            
            $$4. \\text{ Cálculo de Combinación: } \\binom{${n}}{${k}} = ${comb}$$
            
            $$5. \\text{ Operación Final: } ${comb} \\cdot ${Math.pow(p, k).toFixed(6)} \\cdot ${Math.pow(q, n-k).toFixed(6)}$$
            
            <hr>
            <div style="font-size: 1.2em; text-align: center; font-weight: bold;">
                $$P(X=${k}) = ${prob.toFixed(6)} \\implies ${(prob * 100).toFixed(4)}\\%$$
            </div>
        </div>
    `;

    // Indicar a MathJax que procese el nuevo contenido
    if (window.MathJax) {
        MathJax.typesetPromise([resDiv]);
    }
}