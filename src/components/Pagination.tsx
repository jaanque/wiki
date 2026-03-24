interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination" role="navigation" aria-label="Paginación del directorio">
      <button 
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="page-link"
        aria-label="Ir a la primera página"
        title="Primera página"
      >
        « Inicio
      </button>
      
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="page-link"
        aria-label="Ir a la página anterior"
        title="Anterior"
      >
        ‹ Anterior
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button 
          key={p} 
          onClick={() => onPageChange(p)}
          className={`page-link ${currentPage === p ? 'active' : ''}`}
          aria-current={currentPage === p ? 'page' : undefined}
          aria-label={`Ir a la página ${p}`}
        >
          {p}
        </button>
      ))}

      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="page-link"
        aria-label="Ir a la página siguiente"
        title="Siguiente"
      >
        Siguiente ›
      </button>

      <button 
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="page-link"
        aria-label="Ir a la última página"
        title="Última página"
      >
        Final »
      </button>
    </div>
  )
}
