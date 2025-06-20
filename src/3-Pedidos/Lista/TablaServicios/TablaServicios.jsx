import React from 'react';
import styles from './TablaServicios.module.css';
import BotonOpciones from '../BotonOpciones/BotonOpciones';

export function TablaServicios({ groupedServicios, obtenerServiciosPendientes }) {
  const grupos = Object.entries(groupedServicios).sort(
    ([idA], [idB]) => Number(idA) - Number(idB)
  );

  return (
    <div className={styles.scrollContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID Factura</th>
            <th>Mesero</th>
            <th>Nombre Servicio</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
            <th>Estado Servicio</th>
            <th>Fecha Emisión</th>
            <th>Mesa</th>
            <th>Método de Pago</th> {/* Nueva columna */}
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {grupos.length > 0 ? (
            grupos.flatMap(([facturaId, serviciosGrupo], grupoIndex) => {
              const totalFactura = serviciosGrupo.reduce(
                (acc, item) => acc + item.Cantidad * item.Precio_Unitario,
                0
              );

              const estadoServicio = serviciosGrupo[0].Estado_Servicio;
              const filaClaseEstado =
                estadoServicio === 'Pendiente'
                  ? styles.pendiente
                  : estadoServicio === 'Pagada'
                  ? styles.pagada
                  : estadoServicio === 'Cancelada'
                  ? styles.cancelada
                  : '';

              const rowSpan = serviciosGrupo.length;

              const metodoPago = serviciosGrupo[0].Metodo_Pago || 'N/A'; // Obtener método pago del primer servicio

              // Construimos las filas de este grupo
              const filasGrupo = serviciosGrupo.map((servicio, index) => {
                const isFirst = index === 0;
                const isLast = index === serviciosGrupo.length - 1;

                return (
                  <tr
                    key={`${facturaId}-${index}`}
                    className={`${filaClaseEstado} ${styles.grupoFila} ${
                      isLast ? styles.ultimaFilaGrupo : ''
                    }`}
                  >
                    {isFirst && <td rowSpan={rowSpan}>{servicio.ID_Factura}</td>}
                    {isFirst && (
                      <td rowSpan={rowSpan}>{servicio.Nombre_Usuario_Factura}</td>
                    )}
                    <td>{servicio.Nombre_Servicio}</td>
                    <td>{servicio.Cantidad}</td>
                    <td>{parseFloat(servicio.Precio_Unitario).toString()}</td>
                    {isFirst && (
                      <>
                        <td rowSpan={rowSpan}>{parseFloat(totalFactura).toString()}</td>
                        <td rowSpan={rowSpan}>{servicio.Estado_Servicio}</td>
                        <td rowSpan={rowSpan}>
                          {new Date(servicio.Fecha_Emision).toLocaleDateString()}
                        </td>
                        <td rowSpan={rowSpan}>{servicio.mesa}</td>
                        <td rowSpan={rowSpan}>{metodoPago}</td> {/* Mostrar método pago */}
                        <td rowSpan={rowSpan}>
                          <BotonOpciones
                            facturaId={servicio.ID_Factura}
                            servicios={serviciosGrupo}
                            mesero={servicio.Nombre_Usuario_Factura}
                            totalFactura={totalFactura}
                            fechaEmision={servicio.Fecha_Emision}
                            mesa={servicio.mesa}
                            estadoServicio={servicio.Estado_Servicio}
                            obtenerServiciosPendientes={obtenerServiciosPendientes}
                          />
                        </td>
                      </>
                    )}
                  </tr>
                );
              });

              if (grupoIndex < grupos.length - 1) {
                filasGrupo.push(
                  <tr
                    key={`separator-${facturaId}`}
                    className={styles.filaSeparadora}
                  >
                    <td colSpan={11} /> {/* Incrementa el colspan por la nueva columna */}
                  </tr>
                );
              }

              return filasGrupo;
            })
          ) : (
            <tr>
              <td colSpan="11" className={styles.noDataMessage}>
                No hay servicios disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Simulación de servicios para pruebas
export const mockServicios = Array.from({ length: 28 }, (_, i) => ({
  ID_Servicio: i + 1,
  Nombre: `Servicio ${i + 1}`,
  Descripcion: `Descripción del servicio número ${i + 1}`,
  Precio: (Math.random() * 100).toFixed(2),
  Tipo_Servicio: i % 2 === 0 ? 'Básico' : 'Premium',
})).slice(3);
