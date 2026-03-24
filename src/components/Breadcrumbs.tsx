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
    <nav className="breadcrumb py-4 flex items-center gap-2">
      <Link href="/">Portales</Link>
      <span className="text-gray-300">»</span>
      
      {segments.map((segment, index) => {
        const url = `/${segments.slice(0, index + 1).join('/')}`
        const isLast = index === segments.length - 1
        
        // Formatear el nombre del segmento (ej: "recent" -> "Recientes")
        let label = segment.charAt(0).toUpperCase() + segment.slice(1)
        if (segment === 'recent') label = 'Modelos Recientes'
        if (segment === 'ai') label = 'Directorio AI'
        if (segment === 'random') label = 'Modelo Aleatorio'
        if (segment === 'category') label = 'Categoría'

        // Si es el slug, podemos intentar formatearlo o dejarlo como está
        if (isLast && segments[0] === 'ai') {
          label = segment.toUpperCase()
        }
        if (isLast && segments[0] === 'category') {
          // Si estamos en una categoría, el label es el nombre de la categoría
          label = segment.charAt(0).toUpperCase() + segment.slice(1)
        }

        return (
          <span key={url} className="flex items-center gap-2">
            {isLast ? (
              <span className="font-bold text-gray-900">{decodeURIComponent(label)}</span>
            ) : (
              <>
                <Link href={url} className="hover:underline">{label}</Link>
                <span className="text-gray-300">»</span>
              </>
            )}
          </span>
        )
      })}
    </nav>
  )
}
