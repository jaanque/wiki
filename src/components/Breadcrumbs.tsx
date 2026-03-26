'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Breadcrumbs() {
  const pathname = usePathname()
  
  // No mostrar en la portada
  if (pathname === '/') return null

  // Dividir el pathname en segmentos
  const segments = pathname.split('/').filter(Boolean)
  
  // Generar los breadcrumbs basados en la ruta
  return (
    <nav className="breadcrumb text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-2 py-3 mb-6 border-b border-gray-100">
      <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">PORTADA</Link>
      
      {segments.map((segment, index) => {
        let url = `/${segments.slice(0, index + 1).join('/')}`
        if (segment === 'ai') url = '/' // Redirigir segmento técnico a portada
        const isLast = index === segments.length - 1
        
        let label = segment.charAt(0).toUpperCase() + segment.slice(1)
        if (segment === 'recent') label = 'Modelos Recientes'
        if (segment === 'ai') label = 'EXPLORAR'

        if (segment === 'random') label = 'Modelo Aleatorio'
        if (segment === 'category') label = 'Categoría'


        if (isLast && segments[0] === 'category') label = segment.charAt(0).toUpperCase() + segment.slice(1)
        
        // No renderizar el segmento técnico 'ai'
        if (segment === 'ai') return null

        return (
          <div key={url} className="flex items-center gap-2">
            <span className="text-gray-300 font-normal">/</span>
            {isLast ? (
              <span className="text-gray-900">{decodeURIComponent(label)}</span>
            ) : (
              <Link href={url} className="text-blue-600 hover:text-blue-800 transition-colors">{label}</Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
