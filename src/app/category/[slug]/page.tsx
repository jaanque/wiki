'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Model, Category } from '@/types/database'
import ModelTable from '@/components/ModelTable'

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [category, setCategory] = useState<Category | null>(null)
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategoryData() {
      setLoading(true)
      
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (catData) {
        setCategory(catData)
        
        const { data: modelData, error } = await supabase
          .from('model_categories')
          .select(`
            models (
              id, name, slug, developer, type, mmlu_score, release_date,
              parameters, context_window, license
            )
          `)
          .eq('category_id', catData.id)

        if (!error && modelData) {
          const formattedModels = (modelData as any).map((item: any) => item.models)
          setModels(formattedModels)
        }
      }
      setLoading(false)
    }

    fetchCategoryData()
  }, [slug])

  if (loading) return <div className="py-20 text-center text-gray-400 italic">Filtrando directorio técnico...</div>

  if (!category) {
    return (
      <div className="not-found-container">
        <div className="error-code">404</div>
        <div className="error-badge">CATEGORÍA NO ENCONTRADA</div>
        <h1 className="error-title">SLUG: {slug.toUpperCase()}</h1>
        <p className="error-message">
          La categoría técnica solicitada no existe en el índice de clasificación. 
        </p>
        
        <div className="technical-details">
          <div><strong>Error:</strong> CATEGORY_INDEX_MISSING</div>
          <div><strong>Slug:</strong> {slug}</div>
        </div>

        <div className="flex gap-4 mt-8">
          <Link href="/" className="btn-wiki px-8 py-3 bg-blue-50">
            « VOLVER AL ÍNDICE PRINCIPAL
          </Link>
          <Link href="/recent" className="btn-wiki px-8 py-3">
            ÚLTIMOS MODELOS »
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="category-view content-inner">
      <div className="unified-header" style={{ padding: '30px' }}>
        <h1 className="text-3xl font-bold mb-2">Categoría: {category.name}</h1>
        <p className="text-gray-600">{category.description}</p>
      </div>

      <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-wiki-border mt-8">
        <h2 className="font-bold">Modelos en esta sección</h2>
        <span className="text-sm text-gray-500">{models.length} modelos técnicos</span>
      </div>

      <ModelTable models={models} />
    </div>
  )
}
