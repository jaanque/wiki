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
    <aside className="sidebar-left">
      <div className="sidebar-section">
        <h3>Navegación</h3>
        <ul className="sidebar-list text-wiki-link">
          <li>
            <Link href="/" className={pathname === '/' ? 'active' : ''}>
              Portada
            </Link>
          </li>
          <li>
            <Link href="/recent" className={pathname === '/recent' ? 'active' : ''}>
              Modelos Recientes
            </Link>
          </li>
          <li>
            <Link href="/random" className={pathname === '/random' ? 'active' : ''}>
              Modelo Aleatorio
            </Link>
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3>Explorar por Categoría</h3>
        <ul className="sidebar-list text-wiki-link">
          {loading ? (
            <li className="text-gray-400 italic text-xs p-2">Cargando categorías...</li>
          ) : (
            categories.map(cat => (
              <li key={cat.id}>
                <Link 
                  href={`/category/${cat.slug}`} 
                  className={pathname === `/category/${cat.slug}` ? 'active' : ''}
                >
                  {cat.name} <span className="text-gray-400 font-normal">({cat.count})</span>
                </Link>
              </li>
            ))
          )}
          {!loading && categories.length === 0 && (
            <li className="text-gray-400 italic text-xs p-2">No hay categorías</li>
          )}
        </ul>
      </div>

      <div className="adsense-skyscraper">
        [ ESPACIO PARA ADSENSE ]<br/>
        (Skyscraper 160x600)
      </div>
    </aside>
  )
}
