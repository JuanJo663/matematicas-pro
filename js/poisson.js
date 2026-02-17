function calcularFactorial(n) {
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
}

// Función para calcular P(X = k) individual
function calcularPuntoPoisson(lambda, k) {
    return (Math.pow(Math.E, -lambda) * Math.pow(lambda, k)) / calcularFactorial(k);
}

function obtenerHTMLPuntoPoisson(lambda, k) {
    const prob = calcularPuntoPoisson(lambda, k);
    const e = Math.E.toFixed(6);
    return {
        valor: prob,
        formula: `P(X = ${k})`,
        html: `\\[ P(X = ${k}) = \\frac{e^{-${lambda}} \\cdot ${lambda}^{${k}}}{${k}!} = ${prob.toFixed(6)} \\]`
    };
}

function ejecutarPoisson() {
    const lambda = parseFloat(document.getElementById('ps_lambda').value);
    const k = parseInt(document.getElementById('ps_k').value);
    const tipo = document.getElementById('ps_tipo').value;
    const resDiv = document.getElementById('res_poisson');

    if (isNaN(lambda) || isNaN(k) || lambda <= 0 || k < 0) {
        alert("Ingresa valores válidos para Lambda y k.");
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
        case "mayor": simbolo = ">"; for(let i=k+1; i<=k+20; i++) puntos.push(i); break; // Límite práctico
        case "mayorigual": simbolo = "\\geq"; for(let i=k; i<=k+20; i++) puntos.push(i); break;
    }

    puntos.forEach(p => {
        const res = obtenerHTMLPuntoPoisson(lambda, p);
        probabilidadFinal += res.valor;
        listaResultados.push(res);
    });

    let contenidoHTML = "";

    if (tipo === "igual") {
        contenidoHTML = `
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #e0e0e0;">
                <p><strong>Fórmula:</strong> \\[ P(X = k) = \\frac{e^{-\\lambda} \\cdot \\lambda^k}{k!} \\]</p>
                ${listaResultados[0].html}
            </div>
        `;
    } else {
        const formatearSuma = (array, prop) => {
            if (array.length <= 4) return array.map(item => item[prop]).join(" + ");
            return `${array[0][prop]} + ${array[1][prop]} + \\dots + ${array[array.length-1][prop]}`;
        };

        const lEstructura = `P(X ${simbolo} ${k}) = ` + formatearSuma(listaResultados, 'formula');
        const lValores = `P(X ${simbolo} ${k}) = ` + formatearSuma(listaResultados, 'valor').replace(/\d+\.\d+/g, m => parseFloat(m).toFixed(4));
        
        contenidoHTML = `
            <div style="background: #f1f8ff; padding: 15px; border-radius: 8px; border: 1px solid #d1e9ff; margin-bottom: 10px;">
                <p style="font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #d1e9ff;">Pasos de la Sumatoria:</p>
                \\[ ${lEstructura} \\]
                \\[ ${lValores} \\]
                \\[ \\mathbf{P(X ${simbolo} ${k}) \\approx ${probabilidadFinal.toFixed(6)}} \\]
            </div>
            <div style="background: #f9f9f9; padding: 10px; border-radius: 8px; border: 1px solid #eee;">
                <p style="font-size: 0.9em; color: #666;">Desarrollo de cada término:</p>
                ${listaResultados.map(r => r.html).join("")}
            </div>
        `;
    }

    const htmlResultado = `
        <div class="procedimiento-detalle">
            <h4 style="color: #2c3e50;">Distribución de Poisson:</h4>
            <p>Datos: \\( \\lambda = ${lambda}, X ${simbolo} ${k} \\)</p>
            ${contenidoHTML}
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
    guardarEnHistorial(`Poisson (λ:${lambda}, X ${simbolo} ${k})`, htmlResultado);
}

function generarTablaPoisson() {
    const lambda = parseFloat(document.getElementById('ps_lambda').value);
    const resDiv = document.getElementById('res_poisson');

    if (isNaN(lambda) || lambda <= 0) {
        alert("Ingresa un valor de Lambda válido.");
        return;
    }

    let filasHTML = "";
    // Para Poisson (que es infinita), mostramos un rango razonable basado en lambda
    const limiteSuperior = Math.ceil(lambda + 10); 

    for (let i = 0; i <= limiteSuperior; i++) {
        const prob = calcularPuntoPoisson(lambda, i);
        if (i > 10 && prob < 0.0001) break; // Abreviar si la probabilidad es casi cero

        filasHTML += `<tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${i}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${prob.toFixed(6)}</td>
        </tr>`;
    }

    const htmlTabla = `
        <div class="tabla-distribucion" style="overflow-x: auto; padding: 10px;">
            <h4 style="text-align: center; color: #2c3e50;">Tabla de Distribución de Poisson</h4>
            <p style="text-align: center;">Distribución para \\( \\lambda = ${lambda} \\)</p>
            <table style="width: auto; min-width: 250px; margin: 0 auto; border-collapse: collapse; background: white;">
                <thead>
                    <tr style="background-color: #2c3e50; color: white;">
                        <th style="border: 1px solid #ddd; padding: 10px;">x (Eventos)</th>
                        <th style="border: 1px solid #ddd; padding: 10px;">P(X = x)</th>
                    </tr>
                </thead>
                <tbody>${filasHTML}</tbody>
            </table>
        </div>
    `;

    resDiv.innerHTML = htmlTabla;
    resDiv.style.display = "block";
    if (window.MathJax) MathJax.typesetPromise([resDiv]);
    guardarEnHistorial(`Tabla Poisson (λ:${lambda})`, htmlTabla);
}