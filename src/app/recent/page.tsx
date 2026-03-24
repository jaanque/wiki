'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ModelCategory {
  category: Category;
}

interface Model {
  id: number;
  name: string;
  slug: string;
  developer: string;
  parameters: string;
  mmlu_score: number | null;
  release_date: string;
  model_categories?: ModelCategory[];
}

export default function RecentPage() {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecent() {
      setLoading(true)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const { data, error } = await supabase
        .from('models')
        .select('*, model_categories(category:categories(*))')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })

      if (!error && data) {
        setModels(data as Model[])
      }
      setLoading(false)
    }

    fetchRecent()
  }, [])

  return (
    <div className="recent-container">
      <div className="unified-header" style={{ padding: '24px' }}>
        <h1 className="mb-3">Modelos Recientes</h1>
        <p className="text-sm text-gray-600">
          Esta sección muestra las últimas incorporaciones a nuestra base de datos técnica. 
          Aquí encontrarás modelos lanzados o indexados en los últimos 30 días, permitiéndote 
          estar al tanto de las innovaciones más recientes en el ecosistema de IA.
        </p>
      </div>

      <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-wiki-border mt-8">
        <h2 className="font-bold">Novedades de los últimos 30 días</h2>
        <span className="text-sm text-gray-500">{models.length} modelos encontrados</span>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 italic">Buscando novedades...</div>
      ) : (
        <table className="data-grid">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>ID</th>
              <th>Modelo</th>
              <th>Desarrollador</th>
              <th>Categoría</th>
              <th>Parámetros</th>
              <th>MMLU</th>
              <th>Lanzamiento</th>
              <th style={{ textAlign: 'center' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {models.length > 0 ? (
              models.map((model) => (
                <tr key={model.id}>
                  <td className="text-gray-400">#{model.id}</td>
                  <td>
                    <Link href={`/ai/${model.slug}`} className="font-bold hover:underline">
                      {model.name}
                    </Link>
                  </td>
                  <td className="font-bold text-gray-700">{model.developer}</td>
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
                  <td className="text-sm">{model.release_date}</td>
                  <td style={{ textAlign: 'center' }}>
                    <Link href={`/ai/${model.slug}`} className="btn-wiki">FICHA »</Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-20 bg-gray-50 italic text-gray-500">
                  No hay modelos nuevos en los últimos 30 días.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}
