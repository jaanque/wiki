'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Model {
  id: number;
  name: string;
  slug: string;
  developer: string;
  type: string;
  license: string;
  architecture: string;
  context_window: string;
  parameters: string;
  mmlu_score: number | null;
  release_date: string;
  description: string;
  logo_url?: string;
  documentation_url?: string;
  model_categories?: { category: Category }[];
}

export default function ModelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [model, setModel] = useState<Model | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchModel() {
      setLoading(true)
      const { data, error } = await supabase
        .from('models')
        .select(`
          *,
          model_categories (
            category:categories (id, name, slug)
          )
        `)
        .eq('slug', slug)
        .single()

      if (!error && data) {
        setModel(data)
        // Aplanamos las categorías
        const cats = data.model_categories?.map((mc: { category: Category }) => mc.category) || []
        setCategories(cats)
      }
      setLoading(false)
    }

    fetchModel()
  }, [slug])

  if (loading) {
    return <div className="py-20 text-center text-gray-400 italic">Cargando ficha técnica...</div>
  }

  if (!model) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Modelo no encontrado</h1>
        <p className="mb-8 text-gray-600">Lo sentimos, no hemos podido encontrar la ficha técnica solicitada.</p>
        <Link href="/" className="btn-wiki">VOLVER A LA PORTADA</Link>
      </div>
    )
  }

  return (
    <div className="model-detail content-inner">
      <nav className="mb-4" aria-label="Navegación secundaria">
        <Link href="/" className="text-blue-700 hover:underline text-xs">« VOLVER AL ÍNDICE TÉCNICO</Link>
      </nav>

      <div className="wiki-notice mb-8" role="region" aria-label="Contexto técnico del modelo">
        <strong>Ficha Técnica de IA:</strong> Estás consultando el registro detallado del modelo <strong>{model.name}</strong>. Todos los parámetros y benchmarks (MMLU) han sido verificados contra fuentes de investigación oficiales.
      </div>

      <div className="mb-10">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(cat => (
            <Link key={cat.id} href={`/category/${cat.slug}`} className="badge badge-text hover:bg-blue-100 transition-colors">
              {cat.name}
            </Link>
          ))}
        </div>
        
        <header className="flex justify-between items-end border-b-2 border-wiki-border pb-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-1">{model.name}</h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="font-bold text-blue-800">{model.developer}</span>
              <span className="text-gray-300">|</span>
              <span className="bg-gray-100 px-2 py-0.5 border border-gray-200 text-gray-700 font-bold uppercase text-[10px]">
                {model.type}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-400 font-mono text-[10px]">RE: {model.release_date}</span>
            </div>
          </div>
          <div className="text-right" aria-label="Puntuación MMLU verificada">
            <div className="text-[10px] text-gray-500 uppercase font-black mb-1">Benchmark MMLU</div>
            <div className="text-4xl font-mono font-black text-blue-700 leading-none">
              {model.mmlu_score ? `${model.mmlu_score}%` : 'N/A'}
            </div>
          </div>
        </header>
      </div>


      <div className="detail-grid">
        {/* MAIN CONTENT */}
        <div className="detail-main">
          <h2 className="section-title">Descripción General</h2>
          <p className="leading-relaxed text-gray-800 mb-6">
            {model.description}
          </p>

          <h2 className="section-title">Especificaciones de Arquitectura</h2>
          <table className="data-grid w-full mb-8">
            <thead>
              <tr>
                <th>Característica</th>
                <th>Especificación Técnica</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="bg-gray-50 font-bold w-1/3">Tipo de Red</td>
                <td>{model.architecture}</td>
              </tr>
              <tr>
                <td className="bg-gray-50 font-bold">Parámetros Estimados</td>
                <td>{model.parameters}</td>
              </tr>
              <tr>
                <td className="bg-gray-50 font-bold">Ventana de Contexto</td>
                <td className="font-mono text-blue-700">{model.context_window}</td>
              </tr>
              <tr>
                <td className="bg-gray-50 font-bold">Modalidad de Entrada/Salida</td>
                <td>{model.type}</td>
              </tr>
              <tr>
                <td className="bg-gray-50 font-bold">Licencia de Distribución</td>
                <td>{model.license}</td>
              </tr>
            </tbody>
          </table>

          <h2 className="section-title">Benchmarks y Rendimiento</h2>
          <table className="data-grid w-full">
            <thead>
              <tr>
                <th>Prueba (Benchmark)</th>
                <th>Puntuación</th>
                <th>Percentil / Grado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">MMLU (General Intelligence)</td>
                <td className="font-mono text-blue-700 font-bold">{model.mmlu_score ? `${model.mmlu_score}%` : 'N/A'}</td>
                <td>SOTA (State of the Art)</td>
              </tr>
              <tr>
                <td>GSM8K (Grado escolar Matemáticas)</td>
                <td>N/A</td>
                <td>Información pendiente</td>
              </tr>
              <tr>
                <td>HumanEval (Generación de Código)</td>
                <td>N/A</td>
                <td>Información pendiente</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-10 p-4 bg-blue-50 border-l-4 border-wiki-blue text-sm text-gray-700 italic">
            <strong>Nota técnica:</strong> Los datos de esta ficha han sido extraídos de fuentes oficiales y repositorios de investigación. Para contribuciones o correcciones, contacte con el equipo técnico de AI_Wiki.
          </div>
        </div>

        {/* SIDEBAR INFOBOX */}
        <aside className="detail-sidebar">
          <div className="infobox">
            <div className="infobox-header">Ficha Técnica</div>
            
            <div className="infobox-logo-area">
              <div className="infobox-logo-circle">
                {model.developer.substring(0,2)}
              </div>
              <div className="infobox-dev-tag">MODELO DE {model.developer}</div>
              <div className="infobox-model-name">{model.name}</div>
            </div>

            <table className="infobox-table">
              <tbody>
                <tr>
                  <th>Desarrollador</th>
                  <td>{model.developer}</td>
                </tr>
                <tr>
                  <th>Licencia</th>
                  <td>{model.license}</td>
                </tr>
                <tr>
                  <th>Tipo</th>
                  <td>{model.type}</td>
                </tr>
                <tr>
                  <th>Lanzamiento</th>
                  <td>{model.release_date}</td>
                </tr>
                <tr>
                  <th>Parámetros</th>
                  <td>{model.parameters}</td>
                </tr>
                <tr>
                  <th>Contexto</th>
                  <td>{model.context_window}</td>
                </tr>
              </tbody>
            </table>
            
            <a 
              href={model.documentation_url || '#'} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="infobox-footer-link"
            >
              Documentación Oficial »
            </a>
          </div>

        </aside>
      </div>
    </div>
  )
}
