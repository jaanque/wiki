interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button 
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="page-link"
      >
        « Inicio
      </button>
      
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="page-link"
      >
        ‹ Anterior
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button 
          key={p} 
          onClick={() => onPageChange(p)}
          className={`page-link ${currentPage === p ? 'active' : ''}`}
        >
          {p}
        </button>
      ))}

      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="page-link"
      >
        Siguiente ›
      </button>

      <button 
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="page-link"
      >
        Final »
      </button>
    </div>
  )
}
