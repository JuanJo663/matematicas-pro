function calcularPuntoGeometrico(p, k) {
    // Fórmula: P(X = k) = (1-p)^(k-1) * p
    return Math.pow(1 - p, k - 1) * p;
}

function obtenerHTMLPuntoGeo(p, k) {
    const q = 1 - p;
    const prob = calcularPuntoGeometrico(p, k);
    return {
        valor: prob,
        formula: `P(X = ${k})`,
        html: `\\[ P(X = ${k}) = (${q.toFixed(4)})^{${k}-1} \\cdot ${p} = ${prob.toFixed(6)} \\]`
    };
}

function ejecutarGeometrica() {
    const p = parseFloat(document.getElementById('geo_p').value);
    const k = parseInt(document.getElementById('geo_k').value);
    const tipo = document.getElementById('geo_tipo').value;
    const resDiv = document.getElementById('res_geometrica');

    if (isNaN(p) || isNaN(k) || p <= 0 || p > 1 || k < 1) {
        alert("Ingresa valores válidos (p entre 0 y 1, k >= 1).");
        return;
    }

    let probabilidadFinal = 0;
    let listaResultados = [];
    let simbolo = (tipo === "igual") ? "=" : (tipo === "menorigual" ? "\\leq" : ">");
    let puntos = [];

    // Definir puntos a calcular
    if (tipo === "igual") puntos = [k];
    else if (tipo === "menorigual") { for(let i=1; i<=k; i++) puntos.push(i); }
    else if (tipo === "mayor") {
        // P(X > k) es simplemente (1-p)^k, pero para el reporte sumaremos los siguientes 5 términos como muestra
        probabilidadFinal = Math.pow(1 - p, k); 
    }

    let contenidoHTML = "";

    if (tipo === "igual") {
        const res = obtenerHTMLPuntoGeo(p, k);
        probabilidadFinal = res.valor;
        contenidoHTML = `
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #e0e0e0;">
                <p><strong>Fórmula:</strong> \\[ P(X = k) = q^{k-1} \\cdot p \\]</p>
                ${res.html}
            </div>`;
    } else if (tipo === "menorigual") {
        puntos.forEach(pt => {
            const res = obtenerHTMLPuntoGeo(p, pt);
            probabilidadFinal += res.valor;
            listaResultados.push(res);
        });
        contenidoHTML = `
            <div style="background: #f1f8ff; padding: 15px; border-radius: 8px; border: 1px solid #d1e9ff;">
                <p style="font-weight: bold;">Sumatoria de intentos hasta el éxito:</p>
                ${listaResultados.map(r => r.html).join("")}
            </div>`;
    } else {
        // Caso P(X > k)
        contenidoHTML = `
            <div style="background: #fdf6e3; padding: 15px; border-left: 5px solid #b58900; border-radius: 8px;">
                <p><strong>Propiedad del Complemento:</strong></p>
                \\[ P(X > k) = q^k \\]
                \\[ P(X > ${k}) = (${(1-p).toFixed(4)})^{${k}} = \\mathbf{${probabilidadFinal.toFixed(6)}} \\]
            </div>`;
    }

    const finalHTML = `
        <div class="procedimiento-detalle">
            <h4 style="color: #2c3e50;">Distribución Geométrica</h4>
            <p>Datos: \\( p = ${p}, X ${simbolo} ${k} \\)</p>
            ${contenidoHTML}
            <div style="background: #2c3e50; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-top: 10px;">
                <p style="margin: 0; color: #2ecc71; font-weight: bold; font-size: 1.2em;">
                    Probabilidad: ${(probabilidadFinal * 100).toFixed(4)}%
                </p>
            </div>
        </div>`;

    resDiv.innerHTML = finalHTML;
    resDiv.style.display = "block";
    if (window.MathJax) MathJax.typesetPromise([resDiv]);
    guardarEnHistorial(`Geométrica (p:${p}, X ${simbolo} ${k})`, finalHTML);
}

function generarTablaGeometrica() {
    const p = parseFloat(document.getElementById('geo_p').value);
    const resDiv = document.getElementById('res_geometrica');

    if (isNaN(p) || p <= 0 || p > 1) return alert("Ingresa p válido.");

    let filasHTML = "";
    // Mostramos los primeros 10 ensayos
    for (let i = 1; i <= 10; i++) {
        const prob = calcularPuntoGeometrico(p, i);
        filasHTML += `<tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${i}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${prob.toFixed(6)}</td>
        </tr>`;
    }

    const htmlTabla = `
        <div class="tabla-distribucion" style="overflow-x: auto; padding: 10px;">
            <h4 style="text-align: center;">Tabla Geométrica (Primeros 10 ensayos)</h4>
            <table style="width: auto; margin: 0 auto; border-collapse: collapse; background: white;">
                <thead style="background: #2c3e50; color: white;">
                    <tr><th style="padding: 10px;">x (Ensayo)</th><th style="padding: 10px;">P(X=x)</th></tr>
                </thead>
                <tbody>${filasHTML}</tbody>
            </table>
        </div>`;

    resDiv.innerHTML = htmlTabla;
    resDiv.style.display = "block";
    if (window.MathJax) MathJax.typesetPromise([resDiv]);
    guardarEnHistorial(`Tabla Geométrica (p:${p})`, htmlTabla);
}