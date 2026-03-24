import Link from 'next/link'
import { Model } from '@/types/database'

interface FeaturedBlockProps {
  model: Model;
}

export default function FeaturedBlock({ model }: FeaturedBlockProps) {
  return (
    <div className="featured-block">
      <div className="badge-featured">Destacado</div>
      <div className="flex items-center gap-2 mb-6">
        <div className="featured-logo-square">
          {model.name.substring(0, 1)}
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tighter uppercase">{model.name}</h2>
          <div className="featured-meta text-xs">
            <span className="font-bold text-blue-700">{model.developer}</span>
            <span className="mx-3">|</span>
            <span className="uppercase tracking-widest opacity-60">{model.type}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-6 leading-relaxed max-w-2xl">
        Análisis técnico prioritario del modelo <strong>{model.name}</strong>. 
        Este registro incluye métricas de rendimiento {model.mmlu_score ? `(MMLU: ${model.mmlu_score}%)` : ''} 
        y especificaciones de arquitectura {model.context_window} optimizadas para entornos de producción.
      </p>

      <div className="featured-stats-grid mb-8">
        <div className="stat-box">
          <span className="label">Parámetros</span>
          <span className="value">{model.parameters}</span>
        </div>
        <div className="stat-box">
          <span className="label">Contexto</span>
          <span className="value">{model.context_window}</span>
        </div>
        <div className="stat-box">
          <span className="label">Licencia</span>
          <span className="value">{model.license}</span>
        </div>
        <div className="stat-box">
          <span className="label">MMLU Score</span>
          <span className="value">{model.mmlu_score ? `${model.mmlu_score}%` : 'N/A'}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href={`/ai/${model.slug}`} className="btn-wiki px-8 py-3 bg-blue-50">
          INVESTIGAR MODELO »
        </Link>
        <button className="btn-wiki px-8 py-3">
          EXPORTAR DATOS (CSV)
        </button>
      </div>
    </div>
  )
}
