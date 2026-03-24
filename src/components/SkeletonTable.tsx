import React from 'react';

const SkeletonTable = () => {
  const rows = Array.from({ length: 5 });

  return (
    <table className="data-grid w-full">
      <thead>
        <tr>
          <th style={{ width: '40px' }}>#</th>
          <th>Modelo</th>
          <th>Desarrollador</th>
          <th>Categoría</th>
          <th>Parámetros</th>
          <th>MMLU</th>
          <th>Contexto</th>
          <th>Lanzamiento</th>
          <th style={{ textAlign: 'center' }}>Acción</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((_, i) => (
          <tr key={i}>
            <td><div className="skeleton-box h-3 w-4" /></td>
            <td>
              <div className="flex items-center gap-3">
                <div className="skeleton-box h-10 w-10 border-0" />
                <div className="skeleton-box h-4 w-32" />
              </div>
            </td>
            <td><div className="skeleton-box h-4 w-24" /></td>
            <td><div className="skeleton-box h-4 w-20" /></td>
            <td><div className="skeleton-box h-4 w-12" /></td>
            <td><div className="skeleton-box h-5 w-10" /></td>
            <td><div className="skeleton-box h-4 w-12" /></td>
            <td><div className="skeleton-box h-4 w-24" /></td>
            <td style={{ textAlign: 'center' }}><div className="skeleton-box h-6 w-24" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SkeletonTable;
