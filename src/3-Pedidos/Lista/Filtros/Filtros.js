import React from 'react';
import styles from './Filtros.module.css';

function Filtros({ filters, setFilters }) {
  return (
    <div className={styles.filtrosUnico_container}>
      <div className={styles.filtrosUnico_item}>
        <label className={styles.filtrosUnico_label} htmlFor="buscador">Buscar:</label>
        <input
          className={styles.filtrosUnico_input}
          type="text"
          id="buscador"
          value={filters.buscador}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, buscador: e.target.value }))
          }
          placeholder="Buscar en todos los campos..."
        />
      </div>

      <div className={styles.filtrosUnico_item}>
        <label className={styles.filtrosUnico_label} htmlFor="estadoServicio">Estado Servicio:</label>
        <select
          className={styles.filtrosUnico_select}
          id="estadoServicio"
          value={filters.estadoServicio}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, estadoServicio: e.target.value }))
          }
        >
          <option value="">Todos</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Pagada">Pagada</option>
          <option value="Cancelada">Cancelada</option>
        </select>
      </div>

      <div className={styles.filtrosUnico_item}>
        <label className={styles.filtrosUnico_label} htmlFor="fechaInicial">Fecha Inicial:</label>
        <input
          className={styles.filtrosUnico_input}
          type="date"
          id="fechaInicial"
          value={filters.fechaInicial}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, fechaInicial: e.target.value }))
          }
        />
      </div>

      <div className={styles.filtrosUnico_item}>
        <label className={styles.filtrosUnico_label} htmlFor="fechaFinal">Fecha Final:</label>
        <input
          className={styles.filtrosUnico_input}
          type="date"
          id="fechaFinal"
          value={filters.fechaFinal}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, fechaFinal: e.target.value }))
          }
        />
      </div>
    </div>
  );
}

export default Filtros;
