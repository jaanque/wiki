'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import Image from 'next/image'
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


  return (
    <div className="compare-container max-w-7xl mx-auto px-4 py-12">
      <div className="compare-header mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3">
          <span className="text-blue-600">Comparador</span>
          <span className="text-gray-400">Técnico</span>
        </h1>
        <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest border-l-4 border-blue-600 pl-4 py-1">
          Base de Datos de Inteligencia Artificial / Matrix de Benchmarks
        </p>
      </div>

      {/* SELECTION CHIPS */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Seleccionados:</span>
          {compareData.map(model => (
            <div key={model.id} className="selection-chip flex items-center h-8 px-3 bg-white border border-blue-600 text-blue-700 font-bold hover:bg-blue-50 transition-all cursor-default">
              <span className="text-[11px] mr-2">{model.name}</span>
              <button 
                onClick={() => removeModel(model.id)}
                className="text-blue-400 hover:text-red-600 font-black text-sm transition-colors leading-none"
                title="Quitar"
              >
                ×
              </button>
            </div>
          ))}
          {selectedIds.length < 4 && (
            <div className="h-8 px-3 border border-dashed border-gray-300 text-gray-400 text-[10px] font-bold uppercase flex items-center bg-gray-50/50">
              + Añadir {4 - selectedIds.length}
            </div>
          )}
        </div>
      )}

      {/* SEARCH TOOLBAR */}
      <div className="technical-toolbar border-b border-gray-200 mb-8 z-50">
        <div className="toolbar-search border-r-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input 
            type="text" 
            placeholder="Escribe el nombre de un modelo para añadirlo..."
            className="toolbar-input h-12! pl-12! text-base! focus:bg-white!"
            value={searchQuery}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {isOpen && searchResults.length > 0 && (
            <div className="compare-search-dropdown absolute top-full left-0 right-0 z-50 bg-white border border-gray-300 -mt-px shadow-xl">
              <div className="p-2 bg-gray-50 border-b border-gray-200 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                {searchQuery.length > 0 ? 'Resultados Técnicos' : 'Recomendaciones Pro'}
              </div>
              {searchResults.map(result => (
                <div 
                  key={result.id}
                  onClick={() => addModel(result.id)}
                  className="compare-dropdown-item p-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-100 last:border-0 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="search-result-logo w-8 h-8 shrink-0 bg-white border border-gray-200 flex items-center justify-center overflow-hidden relative">
                      {result.logo_url ? (
                        <Image 
                          src={result.logo_url} 
                          alt="" 
                          width={32} 
                          height={32} 
                          className="w-full h-full object-contain" 
                        />
                      ) : (
                        <span className="text-[12px] uppercase font-bold text-gray-400">{result.name[0]}</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-base tracking-tight group-hover:text-blue-700 transition-colors leading-tight">{result.name}</span>
                      <span className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-gray-500 transition-colors font-mono">{result.developer}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-1 uppercase transition-all whitespace-nowrap">
                      Añadir
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
        <div className="empty-compare-state border border-gray-200 pt-32 pb-48 px-12 text-center bg-gray-50/30 rounded-sm">
          <svg className="mx-auto mb-8 text-gray-300 opacity-50" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="m16 16 3-8 3 8c-.87.65-2.13.65-3 0s-2.13-.65-3 0Z"/><path d="m2 16 3-8 3 8c-.87.65-2.13.65-3 0s-2.13-.65-3 0Z"/><path d="M7 21h10"/><path d="M12 21V3"/><path d="M3 7h18"/></svg>
          <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-gray-400">Comienza una comparativa</h3>
          <p className="text-gray-400 text-sm italic max-w-md mx-auto">
            Utilice la barra de búsqueda superior para añadir los modelos que desea analizar en la matriz técnica.
          </p>
        </div>
      )}
    </div>
  )
}
