let normalChart = null;

// --- Funciones Matemáticas ---
function cdfNormal(z) {
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + 1.330274 * t))));
    return z > 0 ? 1 - p : p;
}

function invCDFNormal(p) {
    const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
    const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
    let q = p < 0.5 ? p : 1 - p;
    let x;
    if (q > 0.02425) {
        let u = q - 0.5; let t = u * u;
        x = (((((a[0] * t + a[1]) * t + a[2]) * t + a[3]) * t + a[4]) * t + a[5]) * u / (((((b[0] * t + b[1]) * t + b[2]) * t + b[3]) * t + b[4]) * t + 1);
    } else {
        let t = Math.sqrt(-2 * Math.log(q));
        x = (((((c[0] * t + c[1]) * t + c[2]) * t + c[3]) * t + c[4]) * t + c[5]) / (((((d[0] * t + d[1]) * t + d[2]) * t + d[3]) * t + 1));
    }
    return p < 0.5 ? x : -x;
}

// --- Lógica de Gráfico Corregida ---
function dibujarCampana(mu, sigma, config, callback) {
    const canvas = document.getElementById('normalChart');
    const ctx = canvas.getContext('2d');
    
    // 1. Destrucción total y limpieza del canvas
    if (normalChart) {
        normalChart.destroy();
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const start = mu - 3.5 * sigma;
    const end = mu + 3.5 * sigma;
    const dataPoints = [];
    const backgroundColors = [];
    const steps = 150;
    const stepSize = (end - start) / steps;

    for (let i = 0; i <= steps; i++) {
        let xVal = start + (i * stepSize);
        let yVal = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((xVal - mu) / sigma, 2));
        dataPoints.push({x: xVal, y: yVal});

        let inArea = false;
        if (config.tipo === 'menor' && xVal <= config.val1) inArea = true;
        else if (config.tipo === 'mayor' && xVal >= config.val1) inArea = true;
        else if (config.tipo === 'entre' && xVal >= config.val1 && xVal <= config.val2) inArea = true;
        else if (config.tipo === 'inversa' && xVal <= config.val1) inArea = true;

        backgroundColors.push(inArea ? 'rgba(46, 204, 113, 0.7)' : 'rgba(220, 220, 220, 0.1)');
    }

    document.getElementById('canvas-container').style.display = 'block';

    normalChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                data: dataPoints,
                fill: true,
                segment: { backgroundColor: (ctx) => backgroundColors[ctx.p0DataIndex] },
                borderColor: '#2c3e50',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: false, // Desactivamos para que el callback de imagen sea inmediato
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Distribución Normal' }
            },
            scales: {
                x: {
                    type: 'linear',
                    afterBuildTicks: (axis) => {
                        let tickValues = [mu, config.val1];
                        if (config.val2 !== null) tickValues.push(config.val2);
                        axis.ticks = tickValues.map(v => ({value: v}));
                    },
                    ticks: {
                        callback: function(value) {
                            if (Math.abs(value - mu) < 0.001) return 'μ=' + value;
                            if (Math.abs(value - config.val1) < 0.001) return 'x1=' + value.toFixed(2);
                            if (config.val2 !== null && Math.abs(value - config.val2) < 0.001) return 'x2=' + value.toFixed(2);
                            return '';
                        }
                    }
                },
                y: { display: false }
            }
        }
    });

    // Como quitamos la animación, podemos capturar la imagen de inmediato
    if(callback) {
        callback(canvas.toDataURL("image/png"));
    }
}

function ejecutarNormal() {
    const mu = parseFloat(document.getElementById('norm_mu').value);
    const sigma = parseFloat(document.getElementById('norm_sigma').value);
    const tipo = document.getElementById('norm_tipo').value;
    const resDiv = document.getElementById('res_normal');

    if (isNaN(mu) || isNaN(sigma) || sigma <= 0) {
        alert("Ingresa valores de Media y Desviación válidos.");
        return;
    }

    let pFinal = 0, htmlContenido = "", tituloHistorial = "";
    let configSombreado = { tipo: tipo, val1: null, val2: null };

    if (tipo === "inversa") {
        const pVal = document.getElementById('norm_p_inv').value;
        const p = parseFloat(pVal);
        if (pVal === "" || isNaN(p) || p <= 0 || p >= 1) {
            alert("La probabilidad debe ser un número entre 0 y 1.");
            return;
        }
        const z = invCDFNormal(p);
        const xRes = mu + (z * sigma);
        pFinal = p;
        configSombreado.val1 = xRes;
        htmlContenido = `<p><b>Inversa:</b> P(X < x) = ${p}</p>\\[ x = ${xRes.toFixed(4)} \\]`;
        tituloHistorial = `Inversa (p=${p})`;
    } else if (tipo === "entre") {
        const a = parseFloat(document.getElementById('norm_a').value);
        const b = parseFloat(document.getElementById('norm_b').value);
        if (isNaN(a) || isNaN(b)) {
            alert("Ingresa los límites a y b.");
            return;
        }
        pFinal = cdfNormal((b-mu)/sigma) - cdfNormal((a-mu)/sigma);
        configSombreado.val1 = a; configSombreado.val2 = b;
        htmlContenido = `<p><b>Rango:</b> P(${a} < X < ${b})</p>\\[ P = ${pFinal.toFixed(6)} \\]`;
        tituloHistorial = `Normal (${a} a ${b})`;
    } else {
        const x = parseFloat(document.getElementById('norm_x').value);
        if (isNaN(x)) {
            alert("Ingresa el valor de x.");
            return;
        }
        const z = (x - mu) / sigma;
        pFinal = (tipo === "menor") ? cdfNormal(z) : 1 - cdfNormal(z);
        configSombreado.val1 = x;
        htmlContenido = `<p><b>Probabilidad:</b> P(X ${tipo==='menor'?'<':'>'} ${x})</p>\\[ P = ${pFinal.toFixed(6)} \\]`;
        tituloHistorial = `Normal (X ${tipo==='menor'?'<':'>'} ${x})`;
    }

    const resHTMLBase = `
        <div style="font-size: 0.9em; border-left: 4px solid #3498db; padding-left: 10px;">
            ${htmlContenido}
            <p style="color:#27ae60; font-weight:bold;">Resultado: ${(pFinal * 100).toFixed(4)}%</p>
        </div>`;

    resDiv.innerHTML = resHTMLBase;
    resDiv.style.display = "block";
    if (window.MathJax) MathJax.typesetPromise([resDiv]);

    dibujarCampana(mu, sigma, configSombreado, function(imgBase64) {
        const htmlConImagen = `
            ${resHTMLBase}
            <div style="text-align:center; margin-top:5px;">
                <img src="${imgBase64}" style="width: 100%; max-width: 300px; border: 1px solid #ddd; padding: 5px; background: #fff;">
            </div>`;
        guardarEnHistorial(tituloHistorial, htmlConImagen);
    });
}