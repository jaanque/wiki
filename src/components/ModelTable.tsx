import Link from 'next/link'
import Image from 'next/image'
import { Model } from '@/types/database'

interface ModelTableProps {
  models: Model[];
  sortConfig?: { key: string; direction: 'asc' | 'desc' };
  onSort?: (key: string) => void;
}

export default function ModelTable({ models, sortConfig, onSort }: ModelTableProps) {
  const getIndicator = (key: string) => {
    if (sortConfig?.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  const getLicenseClass = (license: string) => {
    const l = license.toLowerCase();
    if (l.includes('proprietary') || l.includes('privativo')) return 'tag-license-prop';
    return 'tag-license-open';
  };

  const getTypeClass = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('multimodal')) return 'tag-type-multimodal';
    return 'tag-type-text';
  };

  return (
    <table className="data-grid">
      <thead>
        <tr>
          <th style={{ width: '40px' }}>#</th>
          <th onClick={() => onSort?.('name')} className="cursor-pointer hover:bg-gray-100 text-left">
            Modelo 
            <span className="wiki-tooltip">
              [?]
              <span className="tooltip-text">
                Nombre técnico y comercial del modelo fundacional registrado.
              </span>
            </span>
            {getIndicator('name')}
          </th>
          <th onClick={() => onSort?.('developer')} className="cursor-pointer hover:bg-gray-100">
            Desarrollador 
            <span className="wiki-tooltip">
              [?]
              <span className="tooltip-text">
                Organización o consorcio responsable del desarrollo del modelo.
              </span>
            </span>
            {getIndicator('developer')}
          </th>
          <th onClick={() => onSort?.('type')} className="cursor-pointer hover:bg-gray-100">
            Categoría 
            <span className="wiki-tooltip">
              [?]
              <span className="tooltip-text">
                Clasificación basada en la arquitectura o función (e.g. LLM, Vision).
              </span>
            </span>
            {getIndicator('type')}
          </th>
          <th onClick={() => onSort?.('license')} className="cursor-pointer hover:bg-gray-100">
            Licencia 
            <span className="wiki-tooltip">
              [?]
              <span className="tooltip-text">
                Términos legales de distribución (Proprietary, Apache, etc.).
              </span>
            </span>
            {getIndicator('license')}
          </th>
          <th onClick={() => onSort?.('parameters')} className="cursor-pointer hover:bg-gray-100">
            Parámetros 
            <span className="wiki-tooltip">
              [?]
              <span className="tooltip-text">
                Cantidad estimada de variables ajustables (en billones &apos;B&apos;).
              </span>
            </span>
            {getIndicator('parameters')}
          </th>
          <th onClick={() => onSort?.('mmlu_score')} className="cursor-pointer hover:bg-gray-100">
            MMLU 
            <span className="wiki-tooltip">
              [?]
              <span className="tooltip-text">
                Massive Multitask Language Understanding: Benchmark que mide conocimiento general en 57 materias.
              </span>
            </span>
            {getIndicator('mmlu_score')}
          </th>
          <th onClick={() => onSort?.('context_window')} className="cursor-pointer hover:bg-gray-100">
            Contexto 
            <span className="wiki-tooltip">
              [?]
              <span className="tooltip-text">
                Capacidad máxima de tokens (texto) procesables simultáneamente.
              </span>
            </span>
            {getIndicator('context_window')}
          </th>
          <th onClick={() => onSort?.('release_date')} className="cursor-pointer hover:bg-gray-100">
            Lanzamiento 
            <span className="wiki-tooltip">
              [?]
              <span className="tooltip-text">
                Fecha oficial de publicación o disponibilidad general.
              </span>
            </span>
            {getIndicator('release_date')}
          </th>
          <th style={{ textAlign: 'center' }}>Acción</th>
        </tr>
      </thead>
      <tbody>
        {models.map((model, index) => (
          <tr key={model.id}>
            <td className="text-gray-400 font-mono text-xs">{(index + 1).toString().padStart(2, '0')}</td>
            <td className="text-left">
              <div className="flex items-center gap-3">
                <div className="logo-table">
                  {model.logo_url ? (
                    <Image 
                      src={model.logo_url} 
                      alt={model.name} 
                      width={40} 
                      height={40} 
                      unoptimized={true}
                      draggable={false}
                      className="max-w-full max-h-full object-contain p-1 no-drag" 
                    />
                  ) : (
                    model.name.substring(0, 1)
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/ai/${model.slug}`} className="font-bold hover:underline">
                    {model.name}
                  </Link>
                </div>
              </div>
            </td>
            <td>
              <div className="flex flex-column items-center">
                <span className="font-bold text-gray-700">{model.developer}</span>
              </div>
            </td>
            <td>
              <div className="flex flex-wrap gap-1 justify-center">
                {model.model_categories && model.model_categories.length > 0 ? (
                  model.model_categories.map((mc) => (
                    <Link 
                      key={mc.category.id} 
                      href={`/category/${mc.category.slug}`}
                      className={`badge badge-text ${getTypeClass(model.type)}`}
                    >
                      {mc.category.name}
                    </Link>
                  ))
                ) : (
                  <span className="badge badge-empty">Sin categoría</span>
                )}
              </div>
            </td>
            <td>
              <span className={`badge ${getLicenseClass(model.license)}`}>
                {model.license}
              </span>
            </td>
            <td>{model.parameters}</td>
            <td className="font-mono text-blue-700 font-bold">{model.mmlu_score ? `${model.mmlu_score}%` : 'N/A'}</td>
            <td>{model.context_window}</td>
            <td className="text-sm">
              <div className="flex flex-col items-center gap-1">
                {model.release_date}
                {model.release_date && (new Date().getTime() - new Date(model.release_date).getTime()) < 14 * 24 * 60 * 60 * 1000 && (
                  <span className="badge-new" style={{ margin: 0 }}>NUEVO</span>
                )}
              </div>
            </td>
            <td style={{ textAlign: 'center', width: '120px' }}>
              <Link href={`/ai/${model.slug}`} className="btn-wiki">
                VER WIKI »
              </Link>
            </td>
          </tr>
        ))}
        {models.length === 0 && (
          <tr>
            <td colSpan={11} className="text-center py-10 bg-gray-50 italic text-gray-500">
              No se encontraron modelos en el índice técnico.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
