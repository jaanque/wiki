'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

import { Model } from '@/types/database'

type SearchResult = Pick<Model, 'id' | 'name' | 'slug' | 'developer' | 'logo_url'>

export default function SearchHeader() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchResults = async (searchQuery: string) => {
    setLoading(true)
    if (searchQuery.length > 1) {
      const { data } = await supabase
        .from('models')
        .select('id, name, slug, developer, logo_url')
        .or(`name.ilike.%${searchQuery}%,developer.ilike.%${searchQuery}%`)
        .limit(6)
      
      setResults(data || [])
    } else {
      // Recommendations when empty search
      const { data } = await supabase
        .from('models')
        .select('id, name, slug, developer, logo_url')
        .order('release_date', { ascending: false })
        .limit(4)
      setResults(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen) fetchResults(query)
    }, 200)
    return () => clearTimeout(timer)
  }, [query, isOpen])

  const handleSelect = (slug: string) => {
    setIsOpen(false)
    setQuery('')
    router.push(`/ai/${slug}`)
  }

  return (
    <header className="top-header">
      <Link href="/" className="logo-link">
        <div className="logo-mono text-[13px] uppercase tracking-wider">[ wikIA ]</div>
      </Link>
      
      <div className="search-wrapper" ref={dropdownRef}>
        <div className="search-container">
          <input 
            type="text" 
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input" 
            placeholder="Buscar modelo, creador o arquitectura..." 
            aria-label="Buscar en la base de datos de IA"
            aria-haspopup="listbox"
          />
          <button className="search-button" aria-label="Ejecutar búsqueda">
            {loading ? '...' : 'Buscar'}
          </button>
        </div>

        {isOpen && (
          <div className="search-dropdown">
            <div className="dropdown-label">
              {query.length > 1 ? 'Resultados Técnicos' : 'Recomendaciones Pro'}
            </div>
            {results.length > 0 ? (
              results.map((res) => (
                <div 
                  key={res.id} 
                  className="dropdown-item flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-wiki-border last:border-0 transition-colors group"
                  onClick={() => handleSelect(res.slug)}
                >
                  <div className="search-result-logo w-8 h-8 shrink-0 bg-white border border-gray-100 flex items-center justify-center overflow-hidden relative">
                    {res.logo_url ? (
                      <Image 
                        src={res.logo_url} 
                        alt="" 
                        width={32} 
                        height={32} 
                        className="w-full h-full object-contain" 
                      />
                    ) : (
                      <span className="text-[10px] uppercase font-bold text-gray-400">{res.name[0]}</span>
                    )}
                  </div>
                  <div className="flex-1 flex justify-between items-center min-w-0">
                    <div className="item-main flex flex-col min-w-0">
                      <span className="item-name font-black text-sm tracking-tight truncate group-hover:text-blue-700 transition-colors">{res.name}</span>
                      <span className="item-developer text-[10px] uppercase font-bold text-gray-400 font-mono truncate">{res.developer}</span>
                    </div>
                    <div className="item-type text-[9px] font-black bg-gray-100 px-1.5 py-0.5 border border-gray-200 uppercase text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 group-hover:border-blue-200 transition-all ml-2 whitespace-nowrap">
                      TÉCNICO »
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-[11px] text-gray-500 italic bg-gray-50 border-b border-wiki-border">
                [!] No se han encontrado registros técnicos coincidentes.
              </div>
            )}
            <div className="dropdown-footer">
              ENTER FOR ADVANCED SYSTEM SEARCH
            </div>
          </div>
        )}
      </div>

      <nav className="utility-nav" aria-label="Usuario y utilidades">
        <Link href="/login" className="nav-link" title="Acceder a tu perfil">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Login
        </Link>
        <span className="divider">|</span>
        <Link href="/docs" className="nav-link" title="Documentación oficial">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
          Doc
        </Link>
        <span className="divider">|</span>
        <Link href="/add" className="nav-link" title="Añadir nuevo registro">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Añadir
        </Link>
      </nav>
    </header>
  )
}
