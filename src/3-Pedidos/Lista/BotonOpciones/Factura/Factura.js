import { useState } from 'react';
import logo from './img'; // Asegúrate de que la ruta sea correcta

export function useFactura({
  facturaId,
  servicios,
  mesero,
  totalFactura,
  fechaEmision,
  mesa,
  estadoServicio,
}) {
  const [loading, setLoading] = useState(false);

  const formatoPrecio = (num) => {
    if (isNaN(num)) return '0';
    return Number(num) % 1 === 0 ? num.toString() : num.toFixed(2);
  };

  const imprimirFactura = () => {
    const width = 300;
    const height = 600;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);

    const nuevaVentana = window.open('', '_blank', `width=${width},height=${height},left=${left},top=${top}`);

    const serviciosHTML = Array.isArray(servicios)
      ? servicios.map((serv) => {
          const nombre = serv.Nombre_Servicio || '';
          const cantidad = serv.Cantidad || '';
          const precioUnitario = Number(serv.Precio_Unitario);
          const total = Number(serv.Total);

          return `
            <tr>
              <td>${nombre}</td>
              <td style="text-align: center;">${cantidad}</td>
              <td style="text-align: right;">$${formatoPrecio(precioUnitario)}</td>
              <td style="text-align: right;">$${formatoPrecio(total)}</td>
            </tr>
          `;
        }).join('')
      : '';

    const fechaFormateada = new Date(fechaEmision).toLocaleDateString();

    const contenido = `
      <html>
        <head>
          <title>Factura #${facturaId}</title>
          <style>
            @media print {
              @page {
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .factura-container,
              .factura {
                margin: 0;
                padding: 0;
                width: 100%;
              }
            }
            body {
              font-family: 'Courier New', Courier, monospace;
              margin: 0;
              padding: 0;
              color: #000;
              font-size: 11px;
              font-weight: 600;
              line-height: 1.2;
              background: #fff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              color-adjust: exact;
              display: flex;
              justify-content: flex-start;
              align-items: flex-start;
            }
            .factura-container {
              width: 100%;
            }
            .factura {
              width: 100%;
              padding: 0;
              margin: 0;
              box-sizing: border-box;
            }
            .logo-container {
              text-align: center;
              margin: 8px 0;
            }
            .logo-container img {
              max-width: 110px;
              height: auto;
            }
            h2 {
              text-align: center;
              margin: 4px 0;
              font-weight: 700;
              color: #000;
            }
            p {
              margin: 2px 0;
              font-weight: 600;
              color: #000;
            }
            hr {
              border: none;
              border-top: 1px solid #000;
              margin: 6px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 4px;
              font-size: 9px;
              font-weight: 600;
            }
            th, td {
              padding: 1px 2px;
              font-weight: 600;
            }
            th {
              text-align: left;
              border-bottom: 1px solid #000;
            }
            th:nth-child(1), td:nth-child(1) {
              width: 38%;
              text-align: left;
            }
            th:nth-child(2), td:nth-child(2) {
              width: 10%;
              text-align: center;
            }
            th:nth-child(3), td:nth-child(3),
            th:nth-child(4), td:nth-child(4) {
              width: 22%;
              text-align: right;
              font-size: 8px;
            }
            .total {
              text-align: center;
              margin-top: 8px;
              font-size: 12px;
              font-weight: 700;
              color: #000;
              white-space: nowrap;
            }
            .footer {
              text-align: center;
              margin-top: 12px;
              font-size: 10px;
              color: #000;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="factura-container">
            <div class="factura">
              <div class="logo-container">
                <img src="${logo}" alt="Logo" />
              </div>
              <div style="text-align: center; font-size: 10px; font-weight: 600; margin-bottom: 4px;">
                <div>Ayapel Paraíso SAS</div>
                <div>NIT: 901.904.150</div>
                <div>Dirección: calle 10 #1-52 <br> brr centro</div>
                <div>Teléfono: 3024183952</div>
                <div>Resolución POS</div>
                <div>Responsabilidad ante DIAN</div>
              </div>
              <p><strong>N° Factura:</strong> ${facturaId}</p>
              <p><strong>Fecha:</strong> ${fechaFormateada}</p>
              <p><strong>Mesero:</strong> ${mesero}</p>
              <p><strong>Mesa:</strong> ${
                typeof mesa === 'object' ? mesa.nombre || JSON.stringify(mesa) : mesa
              }</p>
              <p><strong>Estado:</strong> ${
                typeof estadoServicio === 'object' ? JSON.stringify(estadoServicio) : estadoServicio
              }</p>
              <hr />
              <table>
                <thead>
                  <tr>
                    <th>Servicio</th>
                    <th>C</th>
                    <th>Precio</th>
                    <th>Total</th>
                    <th>.          ,-</th>
                  </tr>
                </thead>
                <tbody>
                  ${serviciosHTML}
                </tbody>
              </table>
              <h3 class="total">Total: $${formatoPrecio(totalFactura)}</h3>
              <div class="footer">La propina voluntaria.</div>
              <div class="footer">¡Gracias por elegirnos! Esperamos verte pronto.</div>
              <br><br>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    nuevaVentana.document.open();
    nuevaVentana.document.write(contenido);
    nuevaVentana.document.close();
  };

  return {
    loading,
    setLoading,
    imprimirFactura,
  };
}
