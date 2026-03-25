interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }
      
      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');
      
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="pagination" role="navigation" aria-label="Paginación del directorio">
      <button 
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="page-link page-link-edge"
        aria-label="Ir a la primera página"
        title="Primera"
      >
        Inicio
      </button>
      
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="page-link"
        aria-label="Ir a la página anterior"
        title="Anterior"
      >
        Anterior
      </button>
      
      <div className="page-numbers">
        {getPages().map((p, idx) => (
          p === '...' ? (
            <span key={`dots-${idx}`} className="page-dots">...</span>
          ) : (
            <button 
              key={p} 
              onClick={() => onPageChange(p as number)}
              className={`page-link ${currentPage === p ? 'active' : ''}`}
              aria-current={currentPage === p ? 'page' : undefined}
              aria-label={`Ir a la página ${p}`}
            >
              {p}
            </button>
          )
        ))}
      </div>

      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="page-link"
        aria-label="Ir a la página siguiente"
        title="Siguiente"
      >
        Siguiente
      </button>

      <button 
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="page-link page-link-edge"
        aria-label="Ir a la última página"
        title="Final"
      >
        Final
      </button>
    </div>
  )
}

