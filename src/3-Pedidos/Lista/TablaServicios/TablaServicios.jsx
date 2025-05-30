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
                    <td>{servicio.Precio_Unitario}</td>
                    {isFirst && <td rowSpan={rowSpan}>{totalFactura.toFixed(2)}</td>}
                    {isFirst && (
                      <td rowSpan={rowSpan}>{servicio.Estado_Servicio}</td>
                    )}
                    {isFirst && (
                      <td rowSpan={rowSpan}>
                        {new Date(servicio.Fecha_Emision).toLocaleDateString()}
                      </td>
                    )}
                    {isFirst && <td rowSpan={rowSpan}>{servicio.mesa}</td>}
                    {isFirst && (
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
                    )}
                  </tr>
                );
              });

              // Solo si no es el último grupo, añadimos la fila separadora
              if (grupoIndex < grupos.length - 1) {
                filasGrupo.push(
                  <tr
                    key={`separator-${facturaId}`}
                    className={styles.filaSeparadora}
                  >
                    <td colSpan={10} />
                  </tr>
                );
              }

              return filasGrupo;
            })
          ) : (
            <tr>
              <td colSpan="10" className={styles.noDataMessage}>
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
