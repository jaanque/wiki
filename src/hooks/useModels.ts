import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Model } from '@/types/database'

export function useModels(page: number, pageSize: number) {
  const [models, setModels] = useState<Model[]>([])
  const [featuredModel, setFeaturedModel] = useState<Model | null>(null)
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      
      const { data, count } = await supabase
        .from('models')
        .select(`
          *,
          model_categories (
            category:categories (
              id, name, slug
            )
          )
        `, { count: 'exact' })
        .order('release_date', { ascending: false })
        .range(from, to)

      if (data) {
        setModels(data as unknown as Model[])
        setTotalCount(count || 0)
        
        // Featured logic (usually first model)
        if (page === 1 && data.length > 0) {
          setFeaturedModel(data[0] as unknown as Model)
        }
      }
      setLoading(false)
    }

    fetchData()
  }, [page, pageSize])

  return { models, featuredModel, loading, totalCount }
}
