'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AIIndexPage() {
  const [stats, setStats] = useState({ total: 0, llm: 0, image: 0, audio: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      const { count: total } = await supabase.from('models').select('*', { count: 'exact', head: true })
      const { count: llm } = await supabase.from('models').select('*', { count: 'exact', head: true }).eq('type', 'Texto')
      const { count: image } = await supabase.from('models').select('*', { count: 'exact', head: true }).eq('type', 'Imagen')
      
      setStats({ 
        total: total || 0, 
        llm: llm || 0, 
        image: image || 0,
        audio: (total || 0) - (llm || 0) - (image || 0) 
      })
      setLoading(false)
    }
    fetchStats()
  }, [])

  return (
    <div className="ai-index content-inner">
      <div className="unified-header" style={{ padding: '40px' }}>
        <h1 className="text-4xl font-extrabold mb-4">Directorio de Inteligencia Artificial</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Explora nuestra base de datos técnica integral de modelos de lenguaje, visión y audio. 
          Aquí encontrarás especificaciones, benchmarks e información de arquitectura para investigadores y desarrolladores.
        </p>
      </div>

      <div className="detail-grid mt-10">
        <div className="detail-main">
          <h2 className="section-title">Estadísticas del Directorio</h2>
          <div className="featured-stats-grid mb-10">
            <div className="stat-box">
              <span className="label">Total Modelos</span>
              <span className="value text-blue-700">{loading ? '...' : stats.total}</span>
            </div>
            <div className="stat-box">
              <span className="label">Large Language Models</span>
              <span className="value">{loading ? '...' : stats.llm}</span>
            </div>
            <div className="stat-box">
              <span className="label">Generación de Imagen</span>
              <span className="value">{loading ? '...' : stats.image}</span>
            </div>
            <div className="stat-box">
              <span className="label">Otros (Audio/Video)</span>
              <span className="value">{loading ? '...' : stats.audio}</span>
            </div>
          </div>

          <h2 className="section-title">Explorar por Categoría</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="p-6 border border-gray-200 bg-gray-50 hover:border-blue-500 transition-colors cursor-pointer">
              <h3 className="mb-2">LLMs & Chatbots</h3>
              <p className="text-sm text-gray-500">Modelos optimizados para razonamiento, chat y generación de código.</p>
              <Link href="/" className="text-blue-700 text-sm font-bold mt-4 inline-block underline">Ver listado »</Link>
            </div>
            <div className="p-6 border border-gray-200 bg-gray-50 hover:border-purple-500 transition-colors cursor-pointer">
              <h3 className="mb-2">Generación Visual</h3>
              <p className="text-sm text-gray-500">Modelos de difusión y transformadores para imagen y video.</p>
              <Link href="/" className="text-purple-700 text-sm font-bold mt-4 inline-block underline">Ver listado »</Link>
            </div>
          </div>

          <h2 className="section-title">Desarrolladores Destacados</h2>
          <div className="flex flex-wrap gap-4">
            {['OpenAI', 'Meta', 'Anthropic', 'Google', 'Mistral AI', 'Stability AI'].map(dev => (
              <div key={dev} className="px-4 py-2 border border-gray-300 font-bold text-gray-700 bg-white">
                {dev}
              </div>
            ))}
          </div>
        </div>

        <aside className="detail-sidebar">
          <div className="infobox">
            <div className="infobox-header">Atajos Rápidos</div>
            <div className="p-4 space-y-3">
              <Link href="/" className="btn-wiki w-full text-center">IR AL BUSCADOR</Link>
              <Link href="/recent" className="btn-wiki w-full text-center">VER RECIENTES</Link>
              <Link href="/random" className="btn-wiki w-full text-center">MODELO ALEATORIO</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
