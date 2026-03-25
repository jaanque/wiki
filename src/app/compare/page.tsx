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
  logo_url?: string;
}

interface ComparisonModel {
  id: number;
  name: string;
  slug: string;
  developer: string;
  logo_url?: string;
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
  const [isOpen, setIsOpen] = useState(false)
  const isInitialLoad = useRef(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Mark load as complete after first render and handle click outside
  useEffect(() => {
    isInitialLoad.current = false

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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
          id, name, slug, developer, logo_url, release_date,
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

  // Handle Search & Recommendations
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length < 1) {
        // Fetch recommendations when empty or focused
        const { data } = await supabase
          .from('models')
          .select('id, name, developer, logo_url')
          .order('release_date', { ascending: false })
          .limit(4)
        setSearchResults(data || [])
        return
      }
      
      const { data } = await supabase
        .from('models')
        .select('id, name, developer, logo_url')
        .ilike('name', `%${searchQuery}%`)
        .limit(6)
      
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

  const suggestions = [
    { name: 'Llama 3.3 vs GPT-4o', ids: [1, 2], label: 'Líderes de la industria' },
    { name: 'Claude 3.5 vs Gemini 1.5', ids: [3, 4], label: 'Razonamiento avanzado' },
    { name: 'DeepSeek vs Qwen 2.5', ids: [5, 6], label: 'Open Source Champions' },
  ]

  return (
    <div className="compare-container max-w-7xl mx-auto px-4 py-12">
      <div className="compare-header mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 flex items-center gap-3">
          <span className="bg-slate-900 text-white px-2 py-1">Comparador</span>
          <span className="text-gray-300">Técnico</span>
        </h1>
        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest border-l-4 border-blue-600 pl-4 py-1">
          Base de Datos de Inteligencia Artificial / Matrix de Benchmarks
        </p>
      </div>

      {/* SELECTION CHIPS */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Seleccionados:</span>
          {compareData.map(model => (
            <div key={model.id} className="selection-chip flex items-center h-8 px-3 bg-white border-2 border-slate-900 shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all cursor-default">
              <span className="text-[11px] font-bold mr-2">{model.name}</span>
              <button 
                onClick={() => removeModel(model.id)}
                className="text-gray-400 hover:text-red-600 font-black text-sm transition-colors leading-none"
                title="Quitar"
              >
                ×
              </button>
            </div>
          ))}
          {selectedIds.length < 4 && (
            <div className="h-8 px-3 border-2 border-dashed border-gray-300 text-gray-400 text-[10px] font-bold uppercase flex items-center bg-gray-50/50">
              + Añadir {4 - selectedIds.length}
            </div>
          )}
        </div>
      )}

      {/* SEARCH TOOLBAR */}
      <div className="compare-toolbar bg-white border-2 border-slate-900 p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] mb-12 relative z-50">
        <div className="relative" ref={dropdownRef}>
          <input 
            type="text" 
            placeholder="Escribe el nombre de un modelo para añadirlo..."
            className="w-full h-14 bg-gray-50 border-2 border-slate-900 px-6 font-bold text-lg focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
            value={searchQuery}
            onFocus={() => {
              setIsOpen(true)
              if (searchQuery === '') {
                // Trigger fetch for recommendations
                setSearchQuery('')
              }
            }}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {isOpen && searchResults.length > 0 && (
            <div className="compare-search-dropdown absolute top-full left-0 right-0 z-50 bg-white border-2 border-slate-900 border-t-0 shadow-[8px_8px_0_0_rgba(0,0,0,1)] mt-[-2px]">
              <div className="p-3 bg-gray-50 border-b-2 border-slate-900 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                {searchQuery.length > 0 ? 'Resultados Técnicos' : 'Recomendaciones Pro'}
              </div>
              {searchResults.map(result => (
                <div 
                  key={result.id}
                  onClick={() => addModel(result.id)}
                  className="compare-dropdown-item p-4 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-100 last:border-0 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="search-result-logo w-9 h-9 flex-shrink-0 bg-white border-2 border-gray-100 flex items-center justify-center overflow-hidden">
                      {result.logo_url ? (
                        <img src={result.logo_url} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-[12px] uppercase font-bold text-gray-400">{result.name[0]}</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-base tracking-tight group-hover:text-blue-700 transition-colors leading-tight">{result.name}</span>
                      <span className="text-[11px] uppercase font-bold text-gray-400 group-hover:text-gray-500 transition-colors font-mono">{result.developer}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black bg-slate-900 text-white px-2 py-1 uppercase group-hover:bg-blue-600 transition-all whitespace-nowrap">
                      AÑADIR + »
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* COMPARISON MATRIX */}
      {loading ? (
        <SkeletonTable />
      ) : selectedIds.length > 0 ? (
        <ComparisonTable models={compareData} onRemove={removeModel} />
      ) : (
        <div className="empty-compare-state border-2 border-dashed border-gray-200 p-12 text-center bg-gray-50/50">
          <svg className="mx-auto mb-4 text-gray-300" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m16 16 3-8 3 8c-.87.65-2.13.65-3 0s-2.13-.65-3 0Z"/><path d="m2 16 3-8 3 8c-.87.65-2.13.65-3 0s-2.13-.65-3 0Z"/><path d="M7 21h10"/><path d="M12 21V3"/><path d="M3 7h18"/></svg>
          <h3 className="text-lg font-black uppercase tracking-tight mb-2">Comienza una comparativa</h3>
          <p className="text-gray-500 text-sm italic mb-8 max-w-md mx-auto">
            Busca modelos arriba o prueba una de estas comparativas sugeridas por la comunidad técnica:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {suggestions.map((s, i) => (
              <button 
                key={i}
                onClick={() => setSelectedIds(s.ids)}
                className="p-4 bg-white border-2 border-slate-900 hover:bg-blue-50 transition-colors text-left group shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <div className="text-[10px] font-black text-blue-600 uppercase mb-1">{s.label}</div>
                <div className="font-bold text-sm group-hover:underline">{s.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
