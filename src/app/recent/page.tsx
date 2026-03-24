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
      <div className="wiki-notice mb-6">
        <strong>Novedades del Índice:</strong> Estás consultando las últimas incorporaciones técnica al directorio de IA. Aquí se listan los modelos indexados o actualizados en los últimos 30 días, permitiendo seguir el pulso de los lanzamientos más recientes en el ecosistema.
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tighter uppercase mb-2">
          Modelos Recientes
        </h1>
        <p className="text-gray-500 text-sm italic">
          CRONOLOGÍA TÉCNICA: Innovaciones y lanzamientos de los últimos 30 días.
        </p>
      </div>

      <div className="flex justify-between items-center mb-2 text-[10px] uppercase font-black tracking-widest text-gray-400 pl-1">
        Últimos 30 Días (DB_TOTAL: {models.length})
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
