'use client'

import { useState, useEffect, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useModels } from '@/hooks/useModels'
import ModelTable from '@/components/ModelTable'
import Pagination from '@/components/Pagination'
import SkeletonTable from '@/components/SkeletonTable'

function ExploreContent() {
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'release_date',
    direction: 'desc'
  });
  const [categories, setCategories] = useState<{name: string, slug: string}[]>([])
  const PAGE_SIZE = 15
  
  const { models, loading, totalCount } = useModels(
    page, 
    PAGE_SIZE, 
    searchQuery, 
    selectedCategory,
    sortConfig.key,
    sortConfig.direction
  )
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  useEffect(() => {
    const fetchCats = async () => {
      const { data } = await supabase.from('categories').select('name, slug').order('name')
      if (data) setCategories(data)
    }
    fetchCats()
  }, [])

  const handleSearch = (val: string) => {
    setSearchQuery(val)
    setPage(1)
  }

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val)
    setPage(1)
  }

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
    setPage(1);
    // Smooth scroll to results
    const element = document.getElementById('explore-results');
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const quickCategories = [
    { name: 'LLM', slug: 'texto' },
    { name: 'Imagen', slug: 'imagen' },
    { name: 'Audio', slug: 'audio' },
    { name: 'Multimodal', slug: 'multimodal' }
  ];

  return (
    <div className="explore-container pb-20">
      <div className="wiki-notice mb-8">
        <strong>Exploración Técnica:</strong> Estás accediendo al motor de búsqueda avanzada de wikIA. Filtra por arquitectura, capacidad o licenciamiento para encontrar el modelo que mejor se adapte a tus necesidades de integración.
      </div>

      <header className="ranking-page-header mb-10">
        <h1 className="tracking-tighter uppercase">Explorar Modelos</h1>
        <p>Índice sistémico de la base de datos de Inteligencia Artificial.</p>
      </header>

      {/* TECHNICAL CONSOLE V.3.0 */}
      <div className="explore-console">
        <div className="console-status-bar">
          <div className="status-indicator">
            <div className={`led-node ${loading ? 'updating' : ''}`}></div>
            <span className="console-label">System_Status: {loading ? 'FETCHING_DATA' : 'OPERATIONAL'}</span>
          </div>
          <div className="status-indicator">
            <span className="console-label">Kernel: v3.2.1</span>
            <span className="console-label ml-4">Registry: wikIA_CORE</span>
          </div>
        </div>

        <div className="console-main">
          <div className="console-search-v3">
            <label className="console-label mb-2 block">Command_Search:</label>
            <div className="relative">
              <input 
                type="text"
                placeholder="Filtrar por nombre o desarrollador..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="input-console"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              
              {searchQuery && (
                <button 
                  onClick={() => handleSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-400 font-bold"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              )}
            </div>
          </div>

          <div className="console-filters">
            <label className="console-label mb-2 block">Filter_Categories:</label>
            <div className="console-segmented">
              <button 
                onClick={() => handleCategoryChange('')}
                className={`segment-btn ${selectedCategory === '' ? 'active' : ''}`}
              >
                All_Registry
              </button>
              {quickCategories.map(cat => (
                <button 
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`segment-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="console-footer-meta">
          <div className="meta-item">NODES_ON_INDEX:<span className="meta-val">{totalCount}</span></div>
          <div className="meta-item">MEMORY_CACHE:<span className="meta-val">OPTIMIZED</span></div>
          <div className="meta-item">SYNC_STATUS:<span className="meta-val">LIVE</span></div>
        </div>
      </div>
      
      <div id="explore-results" className="scroll-mt-20">
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

      {/* PAGINATION */}
      {!loading && totalPages > 1 && (
        <div className="mt-8">
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={(p) => setPage(p)} 
          />
        </div>
      )}

      {(!loading && models.length === 0) && (
        <div className="technical-details mt-10 text-center py-20 border-2 border-dashed border-gray-100">
          <span className="text-gray-400 italic">[!] Ninguna entidad coincide con los parámetros de búsqueda actuales.</span>
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-mono text-xs uppercase animate-pulse">Iniciando protocolo de exploración...</div>}>
      <ExploreContent />
    </Suspense>
  )
}
