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
  const [activeIndex, setActiveIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleGlobalKbd = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleGlobalKbd)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleGlobalKbd)
    }
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
    setActiveIndex(-1)
    router.push(`/ai/${slug}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') setIsOpen(true)
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(prev => (prev > -1 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && results[activeIndex]) {
          handleSelect(results[activeIndex].slug)
        } else if (query.trim()) {
          // Fallback to general search or first result
          if (results[0]) handleSelect(results[0].slug)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setActiveIndex(-1)
        break
    }
  }

  // Reset index when query changes is now handled in onChange to avoid cascading renders

  return (
    <header className="v4-header">
      <div className="v4-header-inner">
        
        <div className="v4-logo-wrapper">
          <button 
            className="v4-mobile-menu-btn" 
            onClick={() => document.body.classList.toggle('sidebar-open')}
            aria-label="Abrir menú"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          
          <Link href="/" className="v4-logo-link" onClick={() => document.body.classList.remove('sidebar-open')}>
            <div className="v4-logo-container">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="v4-logo-book">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              <span className="v4-logo-text">wikIA</span>
            </div>
          </Link>
        </div>
        
        <div 
          className="v4-search-wrapper" 
          ref={dropdownRef}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-owns="search-results-list"
          aria-controls="search-results-list"
        >
          <div className="v4-search-container">
            <div className="v4-search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input 
              ref={inputRef}
              type="text" 
              value={query}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => {
                setQuery(e.target.value)
                setActiveIndex(-1)
              }}
              onKeyDown={handleKeyDown}
              className="v4-search-input" 
              placeholder="Buscar modelos, creadores o arquitecturas..." 
              aria-label="Buscar en la base de datos de IA"
              aria-autocomplete="list"
              aria-controls="search-results-list"
              aria-activedescendant={activeIndex >= 0 ? `result-item-${activeIndex}` : undefined}
            />
            <div className="v4-search-hint">
              <kbd>CMD+K</kbd>
            </div>
          </div>

          {isOpen && (
            <div className="v4-search-dropdown shadow-2xl fade-in-scale" id="search-results-list" role="listbox">
              <div className="v4-dropdown-header">
                <span className="v4-header-status">
                  <div className="v4-status-dot"></div>
                  {query.length > 1 ? 'RESULTADOS' : 'MODELOS DESTACADOS'}
                </span>
                <span className="v4-header-help">ESC PARA CERRAR</span>
              </div>
              
              <div className="v4-dropdown-body">
                {results.length > 0 ? (
                  results.map((res, index) => (
                    <div 
                      id={`result-item-${index}`}
                      key={res.id} 
                      role="option"
                      aria-selected={activeIndex === index}
                      className={`v4-result-item ${activeIndex === index ? 'active' : ''}`}
                      onClick={() => handleSelect(res.slug)}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <div className="v4-result-logo">
                        {res.logo_url ? (
                          <Image 
                            src={res.logo_url} 
                            alt="" 
                            width={32} 
                            height={32} 
                            className="v4-logo-img" 
                          />
                        ) : (
                          <span className="v4-logo-placeholder">{res.name[0]}</span>
                        )}
                      </div>
                      <div className="v4-result-info">
                        <div className="v4-result-top">
                          <span className="v4-result-name">{res.name}</span>
                          <span className="v4-result-id">ID: {res.id}</span>
                        </div>
                        <span className="v4-result-dev">{res.developer}</span>
                      </div>
                      <div className="v4-result-tag">Ver »</div>
                    </div>
                  ))
                ) : !loading && (
                  <div className="v4-no-results">
                    [!] ERROR: No se han encontrado registros coincidentes.
                  </div>
                )}
              </div>
              
              <div className="v4-dropdown-footer">
                <div className="v4-footer-keys">
                  <span><kbd>↑↓</kbd> NAVEGAR</span>
                  <span><kbd>↵</kbd> SELECCIONAR</span>
                </div>
                <div className="v4-footer-status">Sincronizado</div>
              </div>
            </div>
          )}
        </div>

        <nav className="v4-utility-nav" aria-label="Usuario y utilidades">
          <Link 
            href="https://github.com/jaanque/wiki" 
            className="v4-nav-btn" 
            target="_blank" 
            rel="noopener noreferrer"
            title="Contribuir al código en GitHub"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            <span>GitHub</span>
          </Link>
          <span className="v4-nav-btn-disabled" title="Añadir nuevo registro (Deshabilitado)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            <span>Añadir</span>
          </span>
          <Link href="/login" className="v4-login-btn">
            LOGIN »
          </Link>
        </nav>
      </div>
    </header>
  )
}
