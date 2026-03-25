'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Model, Category } from '@/types/database'
import ModelTable from '@/components/ModelTable'
import SkeletonTable from '@/components/SkeletonTable'

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [category, setCategory] = useState<Category | null>(null)
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'mmlu_score',
    direction: 'desc'
  });

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

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
          .from('models')
          .select('*, model_categories!inner(category_id)')
          .eq('model_categories.category_id', catData.id)
          .order(sortConfig.key, { ascending: sortConfig.direction === 'asc' })

        if (!error && modelData) {
          setModels(modelData as unknown as Model[])
        }
      }
      setLoading(false)
    }

    fetchCategoryData()
  }, [slug, sortConfig])

  if (loading && !category) return <div className="py-20 text-center text-gray-400 italic">Filtrando directorio técnico...</div>

  if (!category && !loading) {
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
      <div className="wiki-notice mb-6" role="region" aria-label="Información de categoría">
        <strong>Clasificación Técnica:</strong> Estás navegando por el archivo especializado para <strong>{category?.name}</strong>. En esta sección se agrupan todos los modelos que comparten esta arquitectura o modalidad específica, permitiendo un análisis comparativo de benchmark y parámetros.
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tighter uppercase mb-2">
          Índice Técnico: {category?.name}
        </h1>
        <p className="text-gray-500 text-sm italic">{category?.description}</p>
      </div>

      <div className="flex justify-between items-center mb-2 text-[10px] uppercase font-black tracking-widest text-gray-400 pl-1">
        Categoría: {category?.name} (DB_COUNT: {models.length})
      </div>

      {loading ? (
        <SkeletonTable />
      ) : (
        <div className="fade-in">
          <ModelTable 
            models={models} 
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        </div>
      )}
    </div>
  )
}
