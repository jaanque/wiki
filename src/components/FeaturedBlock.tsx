import Link from 'next/link'
import { Model } from '@/types/database'

interface FeaturedBlockProps {
  model: Model;
}

export default function FeaturedBlock({ model }: FeaturedBlockProps) {
  return (
    <div className="featured-block-minimal p-8" role="region" aria-label="Modelo destacado del día">
      <div className="flex justify-between items-start mb-6 border-b border-wiki-border pb-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase leading-none mb-2">{model.name}</h2>
          <div className="text-xs font-bold text-blue-700 uppercase tracking-widest">{model.developer}</div>
        </div>
        <div className="bg-wiki-blue text-white px-3 py-1 text-[10px] font-black uppercase">RECOMENDACIÓN TÉCNICA</div>
      </div>

      <p className="text-gray-700 text-sm leading-relaxed mb-8 max-w-4xl italic">
        {model.description}
      </p>

      <div className="mb-8">
        <table className="featured-specs-table w-full text-[11px] font-mono">
          <tbody>
            <tr>
              <th className="text-left py-2 pr-4 border-b border-wiki-border text-gray-400 uppercase font-black w-1/4">Parámetros</th>
              <td className="py-2 border-b border-wiki-border text-gray-800 font-bold">{model.parameters}</td>
              <th className="text-left py-2 px-4 border-b border-wiki-border text-gray-400 uppercase font-black w-1/4">Contexto</th>
              <td className="py-2 border-b border-wiki-border text-gray-800 font-bold">{model.context_window}</td>
            </tr>
            <tr>
              <th className="text-left py-2 pr-4 text-gray-400 uppercase font-black">Licencia</th>
              <td className="py-2 text-gray-800 font-bold">{model.license}</td>
              <th className="text-left py-2 px-4 text-gray-400 uppercase font-black">MMLU Score</th>
              <td className="py-2 text-blue-700 font-black">{model.mmlu_score}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-wiki-border">
        <Link href={`/ai/${model.slug}`} className="btn-wiki px-8 py-3 bg-blue-50 border-blue-200 hover:bg-white transition-colors">
          VER FICHA TÉCNICA »
        </Link>
        <a 
          href={model.documentation_url || '#'} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`btn-wiki px-8 py-3 bg-gray-50 border-gray-200 ${!model.documentation_url ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:bg-white'}`}
          onClick={(e) => !model.documentation_url && e.preventDefault()}
        >
          VER DOCUMENTACIÓN OFICIAL ↗
        </a>
      </div>
    </div>
  )
}
