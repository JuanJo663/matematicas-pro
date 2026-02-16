/**
 * Lógica para el cálculo de la Distribución Normal Estándar
 * Incluye la aproximación de la función de distribución acumulada (CDF)
 */

function ejecutarNormal() {
    const z = parseFloat(document.getElementById('norm_z').value);

    // Validación de entrada
    if (isNaN(z)) {
        alert("Por favor, ingresa un valor numérico para Z.");
        return;
    }

    // Algoritmo de aproximación para la probabilidad acumulada P(Z < z)
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    
    // Ajuste según el signo de Z
    if (z > 0) {
        p = 1 - p;
    }

    const resDiv = document.getElementById('res_normal');
    resDiv.style.display = "block";

    // Renderizado con formato LaTeX para consistencia académica
    resDiv.innerHTML = `
        <h4 style="color:#2ecc71;">Resultado Exitoso</h4>
        <div style="font-size: 1.1em;">
            $$P(Z < ${z}) = ${p.toFixed(5)} \\text{ o } ${(p * 100).toFixed(2)}\\%$$
        </div>
        <hr>
        <p style="font-size: 0.9em; color: #555;">
            Este valor representa el área bajo la curva de la campana de Gauss desde $-\\infty$ hasta ${z}.
        </p>
    `;

    // Notificar a MathJax para procesar el nuevo contenido dinámico
    MathJax.typesetPromise([resDiv]);
}