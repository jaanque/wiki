import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Model } from '@/types/database'

export function useModels(page: number, pageSize: number, searchTerm: string = '', categorySlug: string = '') {
  const [models, setModels] = useState<Model[]>([])
  const [featuredModel, setFeaturedModel] = useState<Model | null>(null)
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      const selectString = categorySlug 
        ? `*, model_categories!inner (category:categories!inner (id, name, slug))` 
        : `*, model_categories (category:categories (id, name, slug))`
      
      let query = supabase
        .from('models')
        .select(selectString, { count: 'exact' })
        
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`)
      }

      if (categorySlug) {
        query = query.eq('model_categories.category.slug', categorySlug)
      }

      const { data, count } = await query
        .order('release_date', { ascending: false })
        .range(from, to)

      if (data) {
        setModels(data as unknown as Model[])
        setTotalCount(count || 0)
        
        // Featured logic (usually first model of current set)
        if (page === 1 && data.length > 0) {
          setFeaturedModel(data[0] as unknown as Model)
        }
      } else {
        setModels([])
        setTotalCount(0)
      }
      setLoading(false)
    }

    fetchData()
  }, [page, pageSize, searchTerm, categorySlug])

  return { models, featuredModel, loading, totalCount }
}
