import Link from 'next/link'
import { Model } from '@/types/database'

interface ModelTableProps {
  models: Model[];
}

export default function ModelTable({ models }: ModelTableProps) {
  return (
    <table className="data-grid">
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
        {models.map((model, index) => (
          <tr key={model.id}>
            <td className="text-gray-400 font-mono text-xs">{(index + 1).toString().padStart(2, '0')}</td>
            <td>
              <div className="flex items-center gap-3">
                <div className="logo-table">
                  {model.name.substring(0, 1)}
                </div>
                <Link href={`/ai/${model.slug}`} className="font-bold hover:underline">
                  {model.name}
                </Link>
              </div>
            </td>
            <td>
              <div className="flex flex-column">
                <span className="font-bold text-gray-700">{model.developer}</span>
              </div>
            </td>
            <td>
              <div className="flex flex-wrap gap-1">
                {model.model_categories && model.model_categories.length > 0 ? (
                  model.model_categories.map((mc) => (
                    <Link 
                      key={mc.category.id} 
                      href={`/category/${mc.category.slug}`}
                      className="badge badge-text hover:bg-blue-100"
                    >
                      {mc.category.name}
                    </Link>
                  ))
                ) : (
                  <span className="text-gray-400 italic text-[10px]">Sin categoría</span>
                )}
              </div>
            </td>
            <td>{model.parameters}</td>
            <td className="font-mono text-blue-700 font-bold">{model.mmlu_score ? `${model.mmlu_score}%` : 'N/A'}</td>
            <td>{model.context_window}</td>
            <td className="text-sm">{model.release_date}</td>
            <td style={{ textAlign: 'center', width: '120px' }}>
              <Link href={`/ai/${model.slug}`} className="btn-wiki">
                VER WIKI »
              </Link>
            </td>
          </tr>
        ))}
        {models.length === 0 && (
          <tr>
            <td colSpan={10} className="text-center py-10 bg-gray-50 italic text-gray-500">
              No se encontraron modelos en el índice técnico.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
