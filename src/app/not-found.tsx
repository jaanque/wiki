import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="error-code">404</div>
      <div className="error-badge">RECURSO NO ENCONTRADO</div>
      <h1 className="error-title">ID / SLUG INEXISTENTE</h1>
      <p className="error-message">
        La entrada que intentas consultar no existe en la base de datos técnica. 
        Puede deberse a un enlace roto o a que el registro ha sido migrado de categoría.
      </p>
      
      <div className="technical-details">
        <div><strong>Status:</strong> HTTP_404_NOT_FOUND</div>
        <div><strong>Log:</strong> Request failed on AI_Wiki_Central_Index</div>
      </div>

      <div className="flex gap-4 mt-8">
        <Link href="/" className="btn-wiki px-8 py-3 bg-blue-50">
          « VOLVER AL ÍNDICE PRINCIPAL
        </Link>
        <Link href="/recent" className="btn-wiki px-8 py-3">
          VER ÚLTIMOS MODELOS »
        </Link>
      </div>
    </div>
  )
}
