'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Category {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

export default function Sidebar() {
  const pathname = usePathname()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true)
      try {
        // Obtenemos categorías y contamos cuántas relaciones hay en model_categories
        const { data, error } = await supabase
          .from('categories')
          .select(`
            id, name, slug,
            model_categories (count)
          `)
        
        if (!error && data) {
          const formatted = (data as unknown as (Category & { model_categories: { count: number }[] })[]).map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            count: cat.model_categories?.[0]?.count || 0
          }))
          setCategories(formatted)
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <aside className="sidebar-left" aria-label="Menú Principal">
      <div className="sidebar-section">
        <h3 id="nav-general">Navegación</h3>
        <ul className="sidebar-list text-wiki-link" aria-labelledby="nav-general">
          <li>
            <Link 
              href="/" 
              className={`${pathname === '/' ? 'active' : ''} flex items-center`}
              aria-current={pathname === '/' ? 'page' : undefined}
              title="Ir a la portada de wikIA"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span>Portada</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/explore" 
              className={`${pathname === '/explore' ? 'active' : ''} flex items-center`}
              aria-current={pathname === '/explore' ? 'page' : undefined}
              title="Explorar el directorio completo de modelos"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <span>Explorar</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/recent" 
              className={`${pathname === '/recent' ? 'active' : ''} flex items-center`}
              aria-current={pathname === '/recent' ? 'page' : undefined}
              title="Ver los modelos añadidos recientemente"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Modelos Recientes</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/random" 
              className={`${pathname === '/random' ? 'active' : ''} flex items-center`}
              aria-current={pathname === '/random' ? 'page' : undefined}
              title="Cargar un modelo aleatorio de la base de datos"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M12 8v4"/><path d="M12 16h.01"/><circle cx="8" cy="12" r=".5"/><circle cx="16" cy="12" r=".5"/></svg>
              <span>Modelo Aleatorio</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/ranking" 
              className={`${pathname === '/ranking' ? 'active' : ''} flex items-center`}
              aria-current={pathname === '/ranking' ? 'page' : undefined}
              title="Ver clasificación de modelos por rendimiento técnico"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span>Clasificación</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/history" 
              className={`${pathname === '/history' ? 'active' : ''} flex items-center`}
              aria-current={pathname === '/history' ? 'page' : undefined}
              title="Explorar la historia de la Inteligencia Artificial"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/><path d="M3.3 7a9 9 0 1 1 0 10"/></svg>
              <span>Historia</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3 id="nav-categories">Explorar por Categoría</h3>
        <ul className="sidebar-list text-wiki-link" aria-labelledby="nav-categories">
          {loading ? (
            <li className="text-gray-400 italic text-xs p-3">Cargando categorías...</li>
          ) : (
            categories.map(cat => (
              <li key={cat.id}>
                <Link 
                  href={`/category/${cat.slug}`} 
                  className={pathname === `/category/${cat.slug}` ? 'active' : ''}
                  aria-current={pathname === `/category/${cat.slug}` ? 'page' : undefined}
                  title={`Ver modelos en la categoría ${cat.name}`}
                >
                  {cat.name} <span className="text-gray-400">({cat.count})</span>
                </Link>
              </li>
            ))
          )}
          {!loading && categories.length === 0 && (
            <li className="text-gray-400 italic text-xs p-3">No hay categorías</li>
          )}
        </ul>
      </div>

      <div className="sidebar-section">
        <h3 id="nav-tools">Herramientas</h3>
        <ul className="sidebar-list text-wiki-link" aria-labelledby="nav-tools">
          <li>
            <Link 
              href="https://github.com/jaanque/wiki" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
              title="Contribuir al código en GitHub"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              <span>Contribuir</span>
            </Link>
          </li>
          <li>
            <span 
              className="sidebar-item-disabled"
              title="Añadir un nuevo modelo al directorio (Deshabilitado)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              <span>Añadir Registro</span>
            </span>
          </li>
          <li>
            <Link 
              href="/compare" 
              className={`${pathname === '/compare' ? 'active' : ''} flex items-center`}
              aria-current={pathname === '/compare' ? 'page' : undefined}
              title="Comparar múltiples modelos cara a cara"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-2.13.65-3 0s-2.13-.65-3 0Z"/><path d="m2 16 3-8 3 8c-.87.65-2.13.65-3 0s-2.13-.65-3 0Z"/><path d="M7 21h10"/><path d="M12 21V3"/><path d="M3 7h18"/></svg>
              <span>Comparador</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/dictionary" 
              className={`${pathname === '/dictionary' ? 'active' : ''} flex items-center`}
              aria-current={pathname === '/dictionary' ? 'page' : undefined}
              title="Glosario técnico de términos de IA"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
              <span>Diccionario</span>
            </Link>
          </li>
          <li>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-mini-chat'))}
              title="Hablar con el asistente técnico de IA"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span>Hablar con la IA</span>
            </button>
          </li>
          <li>
            <span 
              className="sidebar-item-disabled"
              title="Ver documentación técnica del proyecto (Deshabilitado)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
              <span>Documentación</span>
            </span>
          </li>
        </ul>
      </div>
    </aside>
  )
}
