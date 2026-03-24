import Link from 'next/link'
import { Model } from '@/types/database'

interface FeaturedBlockProps {
  model: Model;
}

export default function FeaturedBlock({ model }: FeaturedBlockProps) {
  return (
    <div className="featured-block-minimal" role="region" aria-label="Modelo destacado">
      <div className="mb-2">
        <h2 className="text-xl font-black uppercase tracking-tighter">{model.name}</h2>
      </div>

      <p className="text-gray-700 text-sm mb-4 leading-snug">
        {model.description}
      </p>

      <div className="flex gap-4">
        <Link href={`/ai/${model.slug}`} className="btn-wiki px-4 py-1.5 bg-blue-50 border-blue-200">
          FICHA TÉCNICA »
        </Link>
        <a 
          href={model.documentation_url || '#'} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`btn-wiki px-4 py-1.5 bg-gray-50 border-gray-200 ${!model.documentation_url ? 'opacity-30 cursor-not-allowed' : ''}`}
          onClick={(e) => !model.documentation_url && e.preventDefault()}
        >
          DOCUMENTACIÓN ↗
        </a>
      </div>
    </div>
  )
}
