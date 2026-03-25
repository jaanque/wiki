'use client'

import { useState, useEffect, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useModels } from '@/hooks/useModels'
import ModelTable from '@/components/ModelTable'
import Pagination from '@/components/Pagination'
import SkeletonTable from '@/components/SkeletonTable'

function HomeContent() {
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'release_date',
    direction: 'desc'
  });
  const [categories, setCategories] = useState<{name: string, slug: string}[]>([])
  const PAGE_SIZE = 10;


  
  const { models, loading, totalCount } = useModels(
    page, 
    PAGE_SIZE, 
    searchQuery, 
    selectedCategory,
    sortConfig.key,
    sortConfig.direction
  )
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  // Fetch categories for the filter dropdown
  useEffect(() => {
    const fetchCats = async () => {
      const { data } = await supabase.from('categories').select('name, slug').order('name')
      if (data) setCategories(data)
    }
    fetchCats()
  }, [])

  // Reset to page 1 on filter change
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
  };

  return (
    <>
      <div className="wiki-notice mb-6">
        <strong>Directorio Técnico de IA:</strong> Estás consultando el índice técnico de código abierto para modelos de lenguaje, visión y audio. Esta base de datos está diseñada para desarrolladores e investigadores que buscan métricas comparativas precisas (MMLU, Contexto, Licencias).
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tighter uppercase mb-2">
          Índice de Inteligencia Artificial
        </h1>
        <p className="text-gray-500 text-sm italic">
          Documentación técnica estructurada de los modelos más avanzados de la industria.
        </p>
      </div>

      {/* MINI-CHAT HERO SECTION */}
      {!loading && page === 1 && (
        <section className="intent-section" aria-labelledby="intent-title">
          <h2 id="intent-title" className="intent-title">¿Qué quieres hacer hoy?</h2>
          
          <div className="ask-ai-trigger" onClick={() => window.dispatchEvent(new CustomEvent('open-mini-chat'))}>
            <div className="ask-ai-placeholder flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Consultar al asistente IA sobre modelos o benchmarks...
            </div>
            <button className="ask-ai-btn">Preguntar a la IA</button>
          </div>

          <div className="quick-starters">
            <button 
              className="quick-starter-btn"
              onClick={() => window.dispatchEvent(new CustomEvent('open-mini-chat-with-prompt', { detail: { prompt: 'Compara los modelos más potentes de la base de datos' } }))}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
              Comparar potencias
            </button>
            <button 
              className="quick-starter-btn"
              onClick={() => window.dispatchEvent(new CustomEvent('open-mini-chat-with-prompt', { detail: { prompt: '¿Qué modelos de visión recomendarías?' } }))}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              Modelos de Visión
            </button>
            <button 
              className="quick-starter-btn"
              onClick={() => window.dispatchEvent(new CustomEvent('open-mini-chat-with-prompt', { detail: { prompt: '¿Cuáles son los modelos añadidos más recientemente?' } }))}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Últimos lanzamientos
            </button>
          </div>
        </section>
      )}

      <div id="models-table" className="flex justify-between items-center mb-2 text-[10px] uppercase font-black tracking-widest text-gray-400 pl-1">
        Índice de Registros Técnicos
      </div>

      {/* TECHNICAL FILTER TOOLBAR */}
      <div className="technical-toolbar">
        <div className="toolbar-search">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text"
            placeholder="Buscar modelo..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="toolbar-input"
          />
        </div>

        <div className="toolbar-item">
          <label>Categoría:</label>
          <select 
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="toolbar-select"
          >
            <option value="">Todas</option>
            {categories.map(cat => (
              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="toolbar-item">
          <span className="toolbar-results">DB_RESULTS: {totalCount}</span>
        </div>
      </div>
      
      {loading ? (
        <SkeletonTable />
      ) : (
        <div className="fade-in table-container">
          <ModelTable 
            models={models} 
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        </div>
      )}


      {/* PAGINATION */}
      {!loading && totalPages > 1 && (
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={(p) => setPage(p)} 
        />
      )}
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Cargando base de datos...</div>}>
      <HomeContent />
    </Suspense>
  )
}
