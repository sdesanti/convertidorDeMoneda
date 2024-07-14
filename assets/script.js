let data;

async function obtenerDatos() {
  try {
    const res = await fetch('https://mindicador.cl/api');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    data = await res.json();
    console.log(data);
  } catch (error) {
    mostrarError(error.message);
  }
}

const convertirValor = function() {
  const cantidad = document.querySelector('#cantidad').value;
  const moneda = document.querySelector('#moneda').value;
  let valorConvertido;

  if (moneda === "dolar") {
    valorConvertido = cantidad / data.dolar.valor;
  } else if (moneda === "euro") {
    valorConvertido = cantidad / data.euro.valor;
  } else if (moneda === "utm") {
    valorConvertido = cantidad / data.utm.valor;
  } else if (moneda === "uf") {
    valorConvertido = cantidad / data.uf.valor;
  } else if (moneda === "bitcoin") {
    valorConvertido = cantidad / data.bitcoin.valor;
  } else {
    valorConvertido = "Seleccione una moneda válida";
  }

  document.querySelector('#resultado').textContent = `La cifra ingresada corresponde a ${valorConvertido.toFixed(2)} ${moneda}`;
  renderGrafica(moneda);
}

async function getMonedas(moneda) {
  try {
    const endpoint = `https://mindicador.cl/api/${moneda}`;
    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    const ultimos10Dias = data.serie.slice(0, 10);
    return ultimos10Dias;
  } catch (error) {
    mostrarError(error.message);
  }
}

function prepararConfiguracionParaLaGrafica(monedas) {
  const tipoDeGrafica = "line";
  const fechas = monedas.map((moneda) => new Date(moneda.fecha).toLocaleDateString());
  const titulo = "Valores últimos 10 días";
  const colorDeLinea = "red";
  const valores = monedas.map((moneda) => moneda.valor);

  const config = {
    type: tipoDeGrafica,
    data: {
      labels: fechas,
      datasets: [
        {
          label: titulo,
          backgroundColor: colorDeLinea,
          borderColor: colorDeLinea,
          data: valores,
          fill: false,
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Fecha'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Valor'
          }
        }
      }
    }
  };
  return config;
}

async function renderGrafica(moneda) {
  const monedas = await getMonedas(moneda);
  if (monedas) {
    const config = prepararConfiguracionParaLaGrafica(monedas);
    const chartDOM = document.getElementById("myChart");

    if (window.myChart instanceof Chart) {
      window.myChart.destroy();
    }

    window.myChart = new Chart(chartDOM, config);
  }
}


function mostrarError(errorMessage) {
  const errorElement = document.createElement('div');
  errorElement.textContent = `Error: ${errorMessage}`;
  errorElement.style.color = 'red';
  document.body.appendChild(errorElement);
}

obtenerDatos();