'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ModelTable from '@/components/ModelTable'
import SkeletonTable from '@/components/SkeletonTable'
import { Model } from '@/types/database'

export default function RecentPage() {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'created_at',
    direction: 'desc'
  });

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  useEffect(() => {
    async function fetchRecent() {
      setLoading(true)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const selectString = `*, model_categories (category:categories (id, name, slug))`
      
      const { data, error } = await supabase
        .from('models')
        .select(selectString)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order(sortConfig.key, { ascending: sortConfig.direction === 'asc' })

      if (!error && data) {
        setModels(data as unknown as Model[])
      }
      setLoading(false)
    }

    fetchRecent()
  }, [sortConfig])

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
