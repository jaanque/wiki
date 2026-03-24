'use client'

import { useState, Suspense } from 'react'
import { useModels } from '@/hooks/useModels'
import ModelTable from '@/components/ModelTable'
import Pagination from '@/components/Pagination'
import FeaturedBlock from '@/components/FeaturedBlock'

function HomeContent() {
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 5
  
  const { models, featuredModel, loading, totalCount } = useModels(page, PAGE_SIZE)
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

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

      {/* FEATURED MODEL SECTION - VERTICAL FLOW */}
      {featuredModel && <FeaturedBlock model={featuredModel} />}

      <div className="flex justify-between items-end mb-6 pb-2 border-b-2 border-wiki-border mt-16">
        <h2 className="font-black text-xl uppercase tracking-tighter">Índice Completo de Modelos</h2>
        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 px-3 py-1 border border-gray-200">
          Mostrando {models.length} de {totalCount} entradas técnicas
        </div>
      </div>
      
      {loading ? (
        <div className="py-20 text-center text-gray-400 italic">Consultando base de datos técnica...</div>
      ) : (
        <ModelTable models={models} />
      )}

      {/* PAGINATION */}
      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={(p) => setPage(p)} 
      />

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
