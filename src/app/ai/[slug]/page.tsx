'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Model, Category, ModelCategory } from '@/types/database'

export default function ModelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [model, setModel] = useState<Model | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchModel() {
      setLoading(true)
      // Fetch model with its categories and details
      const { data, error } = await supabase
        .from('models')
        .select(`
          *,
          model_details (*),
          model_categories (
            category:categories (id, name, slug)
          )
        `)
        .eq('slug', slug)
        .single()

      if (!error && data) {
        setModel(data as unknown as Model)
        const cats = (data.model_categories as unknown as ModelCategory[])?.map((mc) => mc.category) || []
        setCategories(cats)
      }
      setLoading(false)
    }

    fetchModel()
  }, [slug])

  if (loading) {
    return <div className="py-20 text-center text-gray-400 italic">Cargando registro técnico...</div>
  }

  if (!model) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Modelo no encontrado</h1>
        <p className="mb-8 text-gray-600">No hemos podido localizar la entrada solicitada en el índice.</p>
        <Link href="/" className="btn-wiki">VOLVER AL ÍNDICE</Link>
      </div>
    )
  }

  const getLicenseClass = (license: string) => {
    const l = license.toLowerCase();
    if (l.includes('proprietary') || l.includes('privativo')) return 'tag-license-prop';
    return 'tag-license-open';
  };


  // Helper to get formatted value from technical_specs or model
  const getSpecValue = (key: string): string => {
    const fromDetails = model.details?.technical_specs?.[key];
    if (fromDetails !== undefined && fromDetails !== null) return String(fromDetails);
    
    const fromModel = (model as unknown as Record<string, unknown>)[key];
    if (fromModel !== undefined && fromModel !== null) return String(fromModel);
    
    return 'N/A';
  };

  // Helper to get benchmark value
  const getBenchmarkValue = (key: string): string => {
    const fromDetails = model.details?.benchmarks?.[key];
    if (fromDetails !== undefined && fromDetails !== null) return `${fromDetails}%`;
    
    const fromModel = (model as unknown as Record<string, unknown>)[`${key}_score`];
    if (fromModel !== undefined && fromModel !== null) return `${fromModel}%`;
    
    return 'N/A';
  };

  return (
    <div className="model-detail">
      <nav className="mb-4" aria-label="Navegación secundaria">
        <Link href="/" className="text-blue-700 hover:underline text-xs font-bold uppercase tracking-wider">« Índice Técnico Principal</Link>
      </nav>

      <div className="wiki-notice mb-8" role="region" aria-label="Contexto técnico">
        <strong>Directorio IA:</strong> Consultando registro <code>IDX_{model.id}</code>. Datos validados contra el repositorio <code>model_details</code>. 
      </div>

      <div className="mb-10">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(cat => (
            <Link key={cat.id} href={`/category/${cat.slug}`} className="badge badge-text">
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
              <span className="text-gray-400 font-mono text-[10px]">VER: {model.release_date}</span>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-gray-500 uppercase font-black mb-1">Score MMLU</div>
            <div className="text-4xl font-mono font-black text-blue-700 leading-none">
              {getBenchmarkValue('mmlu')}
            </div>
          </div>
        </header>
      </div>

      <div className="detail-grid">
        <div className="detail-main">
          <h2 className="section-title">Resumen Técnico</h2>
          <p className="leading-relaxed text-gray-800 mb-6 text-sm">
            {model.details?.full_description || model.description}
          </p>

          {model.details?.use_cases && (
            <>
              <h2 className="section-title">Casos de Uso Principales</h2>
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 text-sm italic whitespace-pre-wrap">
                {model.details.use_cases}
              </div>
            </>
          )}

          <h2 className="section-title">Arquitectura y Especificaciones</h2>
          <table className="data-grid w-full mb-8">
            <thead>
              <tr>
                <th className="w-1/3 text-left">Parámetro</th>
                <th className="text-left">Valor Registrado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="bg-gray-50 font-bold">Arquitectura de Red</td>
                <td>{getSpecValue('architecture')}</td>
              </tr>
              <tr>
                <td className="bg-gray-50 font-bold">Tamaño de Parámetros</td>
                <td>{getSpecValue('parameters')}</td>
              </tr>
              <tr>
                <td className="bg-gray-50 font-bold">Límite de Contexto</td>
                <td className="font-mono text-blue-700">{getSpecValue('context_window')}</td>
              </tr>
              <tr>
                <td className="bg-gray-50 font-bold">Tipo de Licencia</td>
                <td>
                  <span className={`px-2 py-0.5 border font-bold uppercase text-[10px] ${getLicenseClass(model.license)}`}>
                    {model.license}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <h2 className="section-title">Métricas de Benchmarking</h2>
          <table className="data-grid w-full mb-8">
            <thead>
              <tr>
                <th>Prueba Técnica</th>
                <th>Puntuación</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">MMLU</td>
                <td className="font-mono text-blue-700 font-bold">{getBenchmarkValue('mmlu')}</td>
                <td>General Intelligence</td>
              </tr>
              <tr>
                <td className="font-bold">GSM8K</td>
                <td className="font-mono text-blue-700 font-bold">{getBenchmarkValue('gsm8k')}</td>
                <td>Math Reasoning</td>
              </tr>
              <tr>
                <td className="font-bold">HumanEval</td>
                <td className="font-mono text-blue-700 font-bold">{getBenchmarkValue('humaneval')}</td>
                <td>Code Generation</td>
              </tr>
            </tbody>
          </table>

          {model.details?.limitations && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-xs text-red-900 italic">
              <strong>Limitaciones Conocidas:</strong> {model.details.limitations}
            </div>
          )}
        </div>

        <aside className="detail-sidebar">
          <div className="infobox">
            <div className="infobox-header">Ficha de Identidad</div>
            
            <div className="infobox-logo-area">
              {model.logo_url ? (
                <Image 
                  src={model.logo_url} 
                  alt={`${model.developer} logo`} 
                  width={60}
                  height={60}
                  unoptimized
                  className="object-contain mx-auto mb-4"
                />
              ) : (
                <div className="infobox-logo-circle">
                  {model.developer.substring(0,2)}
                </div>
              )}
              <div className="infobox-dev-tag">Developer: {model.developer}</div>
              <div className="infobox-model-name text-center">{model.name}</div>
            </div>

            <table className="infobox-table">
              <tbody>
                <tr>
                  <th>Proveedor</th>
                  <td>{model.developer}</td>
                </tr>
                <tr>
                  <th>Lanzamiento</th>
                  <td>{model.release_date}</td>
                </tr>
                <tr>
                  <th>Licencia</th>
                  <td>
                    <span className={`px-1 py-0.5 border font-bold uppercase text-[9px] ${getLicenseClass(model.license)}`}>
                      {model.license}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>Especialidad</th>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {categories.map(cat => (
                        <span key={cat.id} className="text-[9px] bg-gray-100 px-1 border border-gray-200 uppercase font-bold">
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div className="p-3 bg-gray-50 border-t border-wiki-border">
              <div className="text-[9px] uppercase font-bold text-gray-500 mb-2">Recursos Externos:</div>
              <ul className="list-none p-0 m-0">
                {model.details?.resources?.map((res, i) => (
                  <li key={i} className="mb-1 text-[10px]">
                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                      {res.name} »
                    </a>
                  </li>
                )) || (
                  <li className="text-[10px] italic text-gray-400">Sin enlaces registrados</li>
                )}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
