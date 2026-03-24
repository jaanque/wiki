'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

import { Model } from '@/types/database'

type SearchResult = Pick<Model, 'id' | 'name' | 'slug' | 'developer'>

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
        .select('id, name, slug, developer')
        .or(`name.ilike.%${searchQuery}%,developer.ilike.%${searchQuery}%`)
        .limit(6)
      
      setResults(data || [])
    } else {
      // Recommendations when empty search
      const { data } = await supabase
        .from('models')
        .select('id, name, slug, developer')
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
        <div className="logo-mono">[ AI_Wiki DB ]</div>
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
          />
          <button className="search-button">
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
                  className="dropdown-item"
                  onClick={() => handleSelect(res.slug)}
                >
                  <div className="item-main">
                    <span className="item-name">{res.name}</span>
                    <span className="item-developer uppercase font-mono">{res.developer}</span>
                  </div>
                  <div className="item-type">TECHNICAL FICHA »</div>
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

      <nav className="utility-nav">
        <Link href="/login" className="nav-link">Login</Link>
        <span className="divider">|</span>
        <Link href="/docs" className="nav-link">Documentación</Link>
        <span className="divider">|</span>
        <Link href="/add" className="nav-link">Añadir</Link>
      </nav>
    </header>
  )
}
