'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ComparisonTable from '@/components/ComparisonTable'
import SkeletonTable from '@/components/SkeletonTable'

// Main component wrapped in Suspense for useSearchParams
export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-8 italic text-gray-500">Cargando comparador...</div>}>
      <CompareContent />
    </Suspense>
  )
}

interface ModelResult {
  id: number;
  name: string;
  developer: string;
}

interface ComparisonModel {
  id: number;
  name: string;
  developer: string;
  release_date: string;
  mmlu_score: number;
  gsm8k_score: number;
  humaneval_score: number;
  model_details?: {
    technical_specs: {
      parameters?: string;
      context_window?: string;
      license?: string;
    };
  };
}

function CompareContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Initialize state directly from URL to avoid cascading renders
  const [selectedIds, setSelectedIds] = useState<number[]>(() => {
    const idsParam = searchParams.get('ids')
    if (idsParam) {
      return idsParam.split(',').map(Number).filter(n => !isNaN(n)).slice(0, 4)
    }
    return []
  })

  const [compareData, setCompareData] = useState<ComparisonModel[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<ModelResult[]>([])
  const isInitialLoad = useRef(true)

  // Mark load as complete after first render
  useEffect(() => {
    isInitialLoad.current = false
  }, [])

  // Sync URL with selectedIds only after initial load and when state changes
  useEffect(() => {
    if (isInitialLoad.current) return

    const currentIdsInUrl = searchParams.get('ids') || ''
    const newIdsString = selectedIds.join(',')

    // Only update if the IDs string has actually changed
    if (currentIdsInUrl !== newIdsString) {
      const params = new URLSearchParams(searchParams.toString())
      if (selectedIds.length > 0) {
        params.set('ids', newIdsString)
      } else {
        params.delete('ids')
      }
      router.replace(`/compare?${params.toString()}`, { scroll: false })
    }
  }, [selectedIds, router, searchParams])

  // Fetch model data
  useEffect(() => {
    async function fetchData() {
      if (selectedIds.length === 0) {
        setCompareData([])
        return
      }
      setLoading(true)
      const { data, error } = await supabase
        .from('models')
        .select(`
          id, name, developer, release_date,
          mmlu_score, gsm8k_score, humaneval_score,
          model_details (
            technical_specs
          )
        `)
        .in('id', selectedIds)

      if (!error && data) {
        // Sort data to match selectedIds order and cast to ComparisonModel
        const sortedData = selectedIds
          .map(id => data.find(m => m.id === id))
          .filter(Boolean) as unknown as ComparisonModel[]
        setCompareData(sortedData)
      }
      setLoading(false)
    }
    fetchData()
  }, [selectedIds])

  // Handle Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length < 2) {
        setSearchResults([])
        return
      }
      const { data } = await supabase
        .from('models')
        .select('id, name, developer')
        .ilike('name', `%${searchQuery}%`)
        .limit(5)
      
      setSearchResults(data || [])
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const addModel = (id: number) => {
    if (selectedIds.includes(id)) return
    if (selectedIds.length >= 4) {
      alert('Máximo 4 modelos para comparar')
      return
    }
    setSelectedIds(prev => [...prev, id])
    setSearchQuery('')
    setSearchResults([])
  }

  const removeModel = (id: number) => {
    setSelectedIds(prev => prev.filter(mid => mid !== id))
  }

  return (
    <div className="compare-page py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tighter uppercase mb-2">Comparador de Modelos</h1>
        <p className="text-gray-500 text-sm italic">
          Selecciona hasta 4 modelos para comparar métricas y especificaciones técnicas.
        </p>
      </div>

      {/* SEARCH TO ADD */}
      <div className="technical-toolbar mb-8">
        <div className="toolbar-search w-full max-w-xl">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            placeholder="Escribe el nombre de un modelo para añadir..."
            className="toolbar-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 bg-white border-2 border-slate-900 border-t-0 shadow-lg mt-[-2px]">
              {searchResults.map(result => (
                <div 
                  key={result.id}
                  onClick={() => addModel(result.id)}
                  className="p-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b last:border-0"
                >
                  <span className="font-bold text-sm">{result.name}</span>
                  <span className="text-[10px] uppercase font-bold text-gray-400">{result.developer}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* COMPARISON MATRIX */}
      {loading ? (
        <SkeletonTable />
      ) : (
        <ComparisonTable models={compareData} onRemove={removeModel} />
      )}
    </div>
  )
}
