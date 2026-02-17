function calcularFactorialBinomial(n) {
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
}

function calcularCombinacion(n, k) {
    if (k < 0 || k > n) return 0;
    return calcularFactorialBinomial(n) / (calcularFactorialBinomial(k) * calcularFactorialBinomial(n - k));
}

// --- FUNCIÓN NUEVA: Calcula solo el valor numérico (Necesaria para la tabla) ---
function calcularPuntoBinomial(n, k, p) {
    const q = 1 - p;
    const combinacion = calcularCombinacion(n, k);
    return combinacion * Math.pow(p, k) * Math.pow(q, n - k);
}

function obtenerHTMLPunto(n, k, p) {
    const prob = calcularPuntoBinomial(n, k, p);
    const q = 1 - p;
    return {
        valor: prob,
        formula: `P(X = ${k})`,
        // Cambiamos delimitadores para evitar el error de renderizado
        html: `<p>\\[ P(X = ${k}) = \\binom{${n}}{${k}} \\cdot ${p}^{${k}} \\cdot ${q.toFixed(4)}^{${n - k}} = ${prob.toFixed(6)} \\]</p>`
    };
}

function ejecutarBinomial() {
    const n = parseInt(document.getElementById('bn_n').value);
    const p = parseFloat(document.getElementById('bn_p').value);
    const k = parseInt(document.getElementById('bn_x').value);
    const tipo = document.getElementById('bn_tipo').value;
    const resDiv = document.getElementById('res_binomial');

    if (isNaN(n) || isNaN(p) || isNaN(k)) {
        alert("Completa todos los campos.");
        return;
    }

    let probabilidadFinal = 0;
    let listaResultados = [];
    let simbolo = "";
    let puntos = [];

    switch (tipo) {
        case "igual": simbolo = "="; puntos = [k]; break;
        case "menor": simbolo = "<"; for(let i=0; i<k; i++) puntos.push(i); break;
        case "menorigual": simbolo = "\\leq"; for(let i=0; i<=k; i++) puntos.push(i); break;
        case "mayor": simbolo = ">"; for(let i=k+1; i<=n; i++) puntos.push(i); break;
        case "mayorigual": simbolo = "\\geq"; for(let i=k; i<=n; i++) puntos.push(i); break;
    }

    puntos.forEach(punto => {
        const res = obtenerHTMLPunto(n, punto, p);
        probabilidadFinal += res.valor;
        listaResultados.push(res);
    });

    let contenidoPrincipalHTML = "";

    if (tipo === "igual") {
        contenidoPrincipalHTML = `
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #e0e0e0;">
                <p><strong>Fórmula:</strong> \\[ P(X = k) = \\binom{n}{k} \\cdot p^k \\cdot q^{n-k} \\]</p>
                ${listaResultados[0].html}
            </div>
        `;
    } else {
        const formatearSuma = (array, propiedad) => {
            if (array.length <= 4) return array.map(item => item[propiedad]).join(" + ");
            return `${array[0][propiedad]} + ${array[1][propiedad]} + \\dots + ${array[array.length-1][propiedad]}`;
        };

        const lineaEstructura = `P(X ${simbolo} ${k}) = ` + formatearSuma(listaResultados, 'formula');
        const lineaValores = `P(X ${simbolo} ${k}) = ` + formatearSuma(listaResultados, 'valor').replace(/\d+\.\d+/g, m => parseFloat(m).toFixed(4));
        const lineaFinal = `P(X ${simbolo} ${k}) = ${probabilidadFinal.toFixed(6)}`;

        contenidoPrincipalHTML = `
            <div style="background: #f1f8ff; padding: 15px; border-radius: 8px; border: 1px solid #d1e9ff; margin-bottom: 10px;">
                <p style="font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #d1e9ff;">Pasos de la Sumatoria:</p>
                \\[ ${lineaEstructura} \\]
                \\[ ${lineaValores} \\]
                \\[ \\mathbf{${lineaFinal}} \\]
            </div>
            <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; border: 1px solid #eee; margin-top: 10px;">
                <p style="font-size: 0.9em; color: #666;">Desarrollo de cada término:</p>
                ${listaResultados.map(r => r.html).join("")}
            </div>
        `;
    }

    const htmlResultado = `
        <div class="procedimiento-detalle">
            <h4 style="color: #2c3e50;">Resultado para Distribución Binomial:</h4>
            <p>Datos: \\( n = ${n}, p = ${p}, X ${simbolo} ${k} \\)</p>
            ${contenidoPrincipalHTML}
            <div style="background: #2c3e50; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-top: 10px;">
                <p style="margin: 0; color: #2ecc71; font-weight: bold; font-size: 1.2em;">
                    Probabilidad Final: ${(probabilidadFinal * 100).toFixed(4)}%
                </p>
            </div>
        </div>
    `;

    resDiv.innerHTML = htmlResultado;
    resDiv.style.display = "block";
    if (window.MathJax) MathJax.typesetPromise([resDiv]);
    guardarEnHistorial(`Binomial (X ${simbolo} ${k})`, htmlResultado);
}

function generarTablaBinomial() {
    const n = parseInt(document.getElementById('bn_n').value);
    const p = parseFloat(document.getElementById('bn_p').value);
    const resDiv = document.getElementById('res_binomial');

    if (isNaN(n) || isNaN(p) || p < 0 || p > 1) {
        alert("Ingresa valores válidos de n y p para generar la tabla.");
        return;
    }

    let filasHTML = "";
    const limiteFilas = 10;

    const crearFila = (i) => {
        const prob = calcularPuntoBinomial(n, i, p); // Ahora esta función ya existe
        return `<tr>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${i}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${prob.toFixed(6)}</td>
                </tr>`;
    };

    if (n <= limiteFilas) {
        for (let i = 0; i <= n; i++) filasHTML += crearFila(i);
    } else {
        for (let i = 0; i <= 4; i++) filasHTML += crearFila(i);
        filasHTML += `<tr><td colspan="2" style="border: 1px solid #ddd; padding: 8px; text-align: center; background: #eee;">&vellip; (Valores intermedios omitidos) &vellip;</td></tr>`;
        for (let i = n - 1; i <= n; i++) filasHTML += crearFila(i);
    }

    const htmlTabla = `
        <div class="tabla-distribucion" style="margin-top: 20px; display: flex; flex-direction: column; align-items: center;">
            <h4 style="color: #2c3e50; margin-bottom: 5px;">Tabla de Distribución Binomial</h4>
            <p style="margin-bottom: 15px;">Distribución para \\( n = ${n} \\) y \\( p = ${p} \\)</p>
            
            <table style="width: auto; min-width: 250px; border-collapse: collapse; margin: 0 auto 15px auto; background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <thead>
                    <tr style="background-color: #2c3e50; color: white;">
                        <th style="border: 1px solid #ddd; padding: 10px 20px;">x (Éxitos)</th>
                        <th style="border: 1px solid #ddd; padding: 10px 20px;">P(X = x)</th>
                    </tr>
                </thead>
                <tbody>${filasHTML}</tbody>
            </table>
            <p style="font-size: 0.8em; color: #666; font-style: italic;">La suma de todas las probabilidades es 1.</p>
        </div>
    `;
    

    resDiv.innerHTML = htmlTabla;
    resDiv.style.display = "block";
    if (window.MathJax) MathJax.typesetPromise([resDiv]);
    guardarEnHistorial(`Tabla Binomial completa (n:${n}, p:${p})`, htmlTabla);
}